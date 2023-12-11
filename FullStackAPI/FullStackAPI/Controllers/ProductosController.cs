using FullStackAPI.Data;
using FullStackAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FullStackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : Controller
    {
        private readonly DepositosDbContext dbContext;

        public ProductosController(DepositosDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GettAllProductos(Guid IdDeposito)
        {
            var productos = await dbContext.Productos.Where(p => p.IdDeposito == IdDeposito).ToListAsync();

            return Ok(productos);
        }

        [HttpGet("productosProveedor")]
        public async Task<IActionResult> GettProductosProveedor(Guid IdDeposito, Guid IdProveedor)
        {
            var productos = await dbContext.Productos.Where(p => p.IdDeposito == IdDeposito && p.IdProveedor == IdProveedor).ToListAsync();

            return Ok(productos);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProducto(Guid idDeposito, Producto productoRequest)
        {
            productoRequest.Id = Guid.NewGuid();
            productoRequest.CantidadEnStock = 0;
            productoRequest.FechaCreacion = DateTime.Now.ToString("dd/MM/yyyy");
            //productoRequest.Responsable = "rcarsin";
            await dbContext.Productos.AddAsync(productoRequest);
            await dbContext.SaveChangesAsync();
            return Ok(productoRequest);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetProducto([FromRoute] Guid id)
        {
            var producto = await dbContext.Productos.FirstOrDefaultAsync(x => x.Id == id);

            if (producto == null)
            {
                return NotFound();
            }
            return Ok(producto);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateProducto([FromRoute] Guid id, Producto updateProductRequest)
        {
            var producto = await dbContext.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            producto.Nombre = updateProductRequest.Nombre;
            producto.Descripcion = updateProductRequest.Descripcion;
            producto.Categoria = updateProductRequest.Categoria;
            producto.CantidadEnStock = updateProductRequest.CantidadEnStock;
            producto.Dimensiones = updateProductRequest.Dimensiones;
            producto.Precio = updateProductRequest.Precio;
            producto.FechaCreacion = updateProductRequest.FechaCreacion;
            producto.FechaValidez = updateProductRequest.FechaValidez;
            //producto.Responsable = updateProductRequest.Responsable;
            producto.IdDeposito = updateProductRequest.IdDeposito;
            producto.IdProveedor = updateProductRequest.IdProveedor;

            await dbContext.SaveChangesAsync();

            return Ok(producto);

        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteProducto([FromRoute] Guid id)
        {
            var producto = await dbContext.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }
            else if (producto.CantidadEnStock > 0)
            {
                return NotFound("No puedes eliminar un producto que tiene stock en el depósito");
            }

            dbContext.Productos.Remove(producto);

            await dbContext.SaveChangesAsync();

            return Ok(producto);

        }


    }
}
