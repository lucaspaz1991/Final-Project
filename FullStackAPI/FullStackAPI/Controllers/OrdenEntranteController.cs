using FullStackAPI.Data;
using FullStackAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.X500;

namespace FullStackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdenEntranteController : Controller
    {
        private readonly DepositosDbContext dbContext;

        private static int ultimoNumeroRegistro = 0; // Variable global para almacenar el último número generado

        public OrdenEntranteController(DepositosDbContext dbContext)
        {
            this.dbContext = dbContext;
        }


        [HttpPost("registrarOrden")]
        public async Task<IActionResult> RegistrarOrden([FromBody] OrdenRequest ordenRequest)
        {
            try
            {
                using (var transaction = dbContext.Database.BeginTransaction())
                {
                    // Crear una nueva instancia de OrdenEntrante
                    var nuevaOrdenEntrante = new OrdenEntrante
                    {
                        IdDeposito = ordenRequest.IdDeposito,
                        IdEmpleado = ordenRequest.IdEmpleado,
                        IdProveedor = ordenRequest.IdProveedor,
                        FechaRecepcion = DateTime.Now.ToString("dd/MM/yyyy"),
                        // Generar el próximo número de registro con 5 dígitos
                        NumeroDocumento = ObtenerProximoNumeroRegistro(),
                        ProductosIngresados = new List<ProductoIngresado>()
                    };

                    // Crear un diccionario para realizar un seguimiento de la cantidad total de cada producto
                    var cantidadTotalPorProducto = new Dictionary<Guid, int>();

                    foreach (var detalle in ordenRequest.DetallesOrden)
                    {
                        // Verificar si el producto ya está en el diccionario
                        if (cantidadTotalPorProducto.ContainsKey(detalle.IdProducto))
                        {
                            // Si el producto existe en el diccionario, suma la cantidad
                            cantidadTotalPorProducto[detalle.IdProducto] += detalle.Cantidad;
                        }
                        else
                        {
                            // Si el producto no existe en el diccionario, agrégalo
                            cantidadTotalPorProducto[detalle.IdProducto] = detalle.Cantidad;
                        }

                        // Buscar ProductoIngresado por IdProducto dentro de la misma orden
                        var productoExistenteEnOrden = nuevaOrdenEntrante.ProductosIngresados.FirstOrDefault(p => p.IdProducto == detalle.IdProducto);

                        if (productoExistenteEnOrden != null)
                        {
                            // Si el producto existe en la orden, actualiza su cantidad en lugar de crear uno nuevo
                            productoExistenteEnOrden.Cantidad += detalle.Cantidad;
                        }
                        else
                        {
                            // Buscar el producto en la base de datos por Id
                            var producto = await dbContext.Productos.FindAsync(detalle.IdProducto);

                            if (producto != null)
                            {
                                // Crear un nuevo ProductoIngresado
                                var nuevoProductoIngresado = new ProductoIngresado
                                {
                                    Id = Guid.NewGuid(),
                                    IdProducto = detalle.IdProducto,
                                    NombreProducto = detalle.NombreProducto,
                                    Cantidad = detalle.Cantidad,
                                    Almacenado = false,
                                    OrdenEntrante = nuevaOrdenEntrante // Establecer la relación con la nueva OrdenEntrante
                                };

                                // Asociar el ProductoIngresado a la OrdenEntrante
                                nuevaOrdenEntrante.ProductosIngresados.Add(nuevoProductoIngresado);
                            }
                            else
                            {
                                return BadRequest($"Producto con Id {detalle.IdProducto} no encontrado.");
                            }
                        }
                    }

                    // Actualizar el stock de cada producto con la cantidad total acumulada
                    foreach (var kvp in cantidadTotalPorProducto)
                    {
                        var producto = await dbContext.Productos.FindAsync(kvp.Key);
                        if (producto != null)
                        {
                            producto.CantidadEnStock += kvp.Value;
                        }
                    }

                    // Agregar la nueva orden a la base de datos de forma asincrónica
                    dbContext.OrdenEntrante.Add(nuevaOrdenEntrante);
                    await dbContext.SaveChangesAsync();

                    // Confirmar la transacción
                    transaction.Commit();

                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Error al registrar la orden: " + ex.Message);
            }
        }


        [HttpGet("listaOrdenes")]
        public async Task<IActionResult> GettAllOrdenEntrante(Guid IdDeposito)
        {
            var ordenEntrante = await dbContext.OrdenEntrante.Where(s => s.IdDeposito == IdDeposito).ToListAsync();

            return Ok(ordenEntrante);
        }


        [HttpGet("noAlmacenados")]
        public async Task<IActionResult> GettAllProductosNoAlmacenados(Guid IdDeposito)
        {
            var ordenes = await dbContext.OrdenEntrante.Where(p => p.IdDeposito == IdDeposito).ToListAsync();

            var productosIngresados = new List<ProductoIngresadoReducido>(); // Inicializo una lista vacía

            foreach (var orden in ordenes)
            {
                var productosEnOrden = await dbContext.ProductoIngresado
                    .Where(o => o.OrdenEntranteId == orden.Id && o.Almacenado == false)
                    .Select(p => new ProductoIngresadoReducido // Proyectamos los datos al nuevo modelo
                    {
                        Id = p.Id,
                        IdProducto = p.IdProducto,
                        NombreProducto = p.NombreProducto,
                        Cantidad = p.Cantidad,
                        Almacenado = p.Almacenado,
                        OrdenEntranteId = orden.Id
                    })
                    .ToListAsync();

                productosIngresados.AddRange(productosEnOrden);
            }

            return Ok(productosIngresados);
        }


        [HttpPost("almacenarEnSeccion")]
        public async Task<IActionResult> AlmacenarProductos([FromBody] SeccionProductosRequest seccionProductosRequest)
        {
            // Me devuelve un solo valor
            var seccion = await dbContext.Secciones.FirstOrDefaultAsync(p => p.Id == seccionProductosRequest.IdSeccion);

            if (seccion != null)
            {
                var capacidad = seccion.CapacidadMaxima - seccion.OcupacionActual;
                if (seccionProductosRequest.Dimensiones <= capacidad)
                {

                    try
                    {
                        var nuevoRequest = new SeccionProductos
                        {
                            IdSeccion = seccionProductosRequest.IdSeccion,
                            IdProducto = seccionProductosRequest.IdProducto,
                            NombreProducto = seccionProductosRequest.NombreProducto,
                            Cantidad = seccionProductosRequest.Cantidad,
                            ProductoIngresadoId = seccionProductosRequest.ProductoIngresadoId

                        };

                        // Agregar la nueva entidad SeccionProductos a la base de datos
                        await dbContext.SeccionProductos.AddAsync(nuevoRequest);
                        await dbContext.SaveChangesAsync();

                        // Buscar el ProductoIngresado correspondiente
                        var productoIngresado = await dbContext.ProductoIngresado
                            .FirstOrDefaultAsync(p => p.Id == seccionProductosRequest.ProductoIngresadoId);

                        if (productoIngresado != null)
                        {
                            // Actualizar la propiedad Almacenado a true
                            productoIngresado.Almacenado = true;
                            await dbContext.SaveChangesAsync();
                        }
                        else
                        {
                            // Manejar el caso en el que no se encuentra el ProductoIngresado
                            return NotFound("ProductoIngresado no encontrado");
                        }

                        // Actualizo OcupacionActual
                        seccion.OcupacionActual = seccion.OcupacionActual + seccionProductosRequest.Dimensiones;
                        await dbContext.SaveChangesAsync(); // Guardo los cambios en la base de datos

                        // Calculo CapacidadActual después de guardar OcupacionActual, parseando los valores a decimal
                        seccion.CapacidadActual = (((decimal)seccion.OcupacionActual / (decimal)seccion.CapacidadMaxima) -1) * -100;
                        await dbContext.SaveChangesAsync(); // Guardo los cambios nuevamente

                        // Me devuelve un solo valor de depositos
                        var deposito = await dbContext.Depositos.FirstOrDefaultAsync(p => p.Id == seccionProductosRequest.IdDeposito);

                        // Actualizo OcupacionActual
                        deposito.OcupacionActual = deposito.OcupacionActual + seccionProductosRequest.Dimensiones;
                        await dbContext.SaveChangesAsync(); // Guardo los cambios en la base de datos

                        // Calculo CapacidadActual después de guardar OcupacionActual, parseando los valores a decimal
                        deposito.CapacidadActual = (((decimal)deposito.OcupacionActual / (decimal)deposito.CapacidadMaxima) -1) *-100;
                        await dbContext.SaveChangesAsync(); // Guardo los cambios nuevamente


                        return Ok(seccionProductosRequest);
                    }
                    catch (Exception ex)
                    {
                        // Manejar errores aquí
                        return BadRequest("Error al almacenar productos: " + ex.Message);
                    }             
                }
                else
                {
                    return NotFound("Las dimensiones del ingreso superan la capacidad de la sección");
                }           
            }
            else
            {
                // Manejar el caso en el que no se encuentra la Seccion
                return NotFound("Seccion no encontrada");
            }

           
        }


        [HttpGet("Almacenados")]
        public async Task<IActionResult> GettAllProductosAlmacenados(Guid IdDeposito)
        {
            try
            {
                var secciones = await dbContext.Secciones.Where(p => p.IdDeposito == IdDeposito).ToListAsync();

                var productosAlmacenados = new List<SeccionProductosResponse>(); // Inicializo una lista vacía

                foreach (var seccion in secciones)
                {
                    var productosEnSeccion = await dbContext.SeccionProductos
                        .Where(o => o.IdSeccion == seccion.Id)
                        .Select(p => new SeccionProductosResponse
                        {
                            IdSeccion = seccion.Id,
                            Codigo = seccion.Codigo,
                            IdProducto = p.IdProducto,
                            NombreProducto = p.NombreProducto,
                            Cantidad = p.Cantidad,
                            ProductoIngresadoId = p.ProductoIngresadoId
                        })
                        .ToListAsync();

                    productosAlmacenados.AddRange(productosEnSeccion);
                }
                //}

                return Ok(productosAlmacenados);
            }
            catch (Exception ex)
            {
                // Captura la excepción y registra detalles útiles para la depuración
                Console.WriteLine("Error en GettAllProductosAlmacenados: " + ex.Message);
                return StatusCode(500, "Error interno del servidor"); // Puedes personalizar el mensaje de error según tus necesidades
            }
        }


        // Método para obtener el próximo número de registro autoincremental
        private string ObtenerProximoNumeroRegistro()
        {
            ultimoNumeroRegistro++; // Incrementar el último número registrado
            return ultimoNumeroRegistro.ToString("D5"); // Devolver el nuevo número autoincremental con formato de 5 dígitos
        }


        [HttpDelete]
        [Route("{id:long}")]
        public async Task<IActionResult> DeleteOrdenEntrante([FromRoute] long id)
        {
            var ordenEntrante = await dbContext.OrdenEntrante.FindAsync(id);

            if (ordenEntrante == null)
            {
                return NotFound();
            }

            dbContext.OrdenEntrante.Remove(ordenEntrante);

            await dbContext.SaveChangesAsync();

            return Ok(ordenEntrante);

        }



    }
}
