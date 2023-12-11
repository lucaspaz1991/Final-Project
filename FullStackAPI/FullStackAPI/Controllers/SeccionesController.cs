using FullStackAPI.Data;
using FullStackAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FullStackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeccionesController : Controller
    {
        private readonly DepositosDbContext dbContext;

        public SeccionesController(DepositosDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GettAllSecciones(Guid IdDeposito)
        {
            var secciones = await dbContext.Secciones.Where(s => s.IdDeposito == IdDeposito).ToListAsync();

            return Ok(secciones);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSeccion(Seccion seccionRequest)
        {
            try
            {

                var deposito = await dbContext.Depositos
                .Where(d => d.Id == seccionRequest.IdDeposito)
                .Select(d => new {
                    d.Id,
                    d.CapacidadMaxima
                })
                .FirstOrDefaultAsync();


                if (deposito == null)
                {
                    return NotFound("Depósito no encontrado");
                }

                var secciones = await dbContext.Secciones.Where(p => p.IdDeposito == deposito.Id).ToListAsync();

                if (secciones == null)
                {
                    return NotFound("Secciones no encontradas");
                }

                long espacioDisponible = 0;

                foreach (var seccion in secciones)
                {
                    espacioDisponible += seccion.CapacidadMaxima;
                }

                if ((espacioDisponible+seccionRequest.CapacidadMaxima) > deposito.CapacidadMaxima)
                {
                    return NotFound("Las dimensiones de la sección superan la capacidad del depósito");
                }

                else
                {

                    seccionRequest.Id = Guid.NewGuid();
                    seccionRequest.CapacidadActual = 100;
                    seccionRequest.OcupacionActual = 0;
                    seccionRequest.FechaCreacion = DateTime.Now.ToString("dd/MM/yyyy");
                    await dbContext.Secciones.AddAsync(seccionRequest);
                    await dbContext.SaveChangesAsync();
                    return Ok(seccionRequest);

                }
            }
            catch (Exception ex)
            {
                // Loggea la excepción para depuración
                return StatusCode(500, "Error interno en el servidor");
            }

        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetSeccion([FromRoute] Guid id)
        {
            var seccion = await dbContext.Secciones.FirstOrDefaultAsync(x => x.Id == id);

            if (seccion == null)
            {
                return NotFound();
            }
            return Ok(seccion);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateSeccion([FromRoute] Guid id, Seccion updateSeccionRequest)
        {
            var seccion = await dbContext.Secciones.FindAsync(id);

            if (seccion == null)
            {
                return NotFound();
            }

            seccion.Codigo = updateSeccionRequest.Codigo;
            seccion.TipoSeccion = updateSeccionRequest.TipoSeccion;
            seccion.CapacidadMaxima = updateSeccionRequest.CapacidadMaxima;
            seccion.OcupacionActual = updateSeccionRequest.OcupacionActual;
            seccion.CapacidadActual = updateSeccionRequest.CapacidadActual;
            seccion.FechaCreacion = updateSeccionRequest.FechaCreacion;
            seccion.IdDeposito = updateSeccionRequest.IdDeposito;


            await dbContext.SaveChangesAsync();

            return Ok(seccion);

        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteSeccion([FromRoute] Guid id)
        {
            var seccion = await dbContext.Secciones.FindAsync(id);

            if (seccion == null)
            {
                return NotFound();
            }
            else if (seccion.OcupacionActual > 0)
            {
                return NotFound("No puedes eliminar una sección que tiene productos almacenados en ella");

            }

            dbContext.Secciones.Remove(seccion);

            await dbContext.SaveChangesAsync();

            return Ok(seccion);

        }



    }
}
