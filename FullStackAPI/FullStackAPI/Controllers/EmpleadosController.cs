using FullStackAPI.Data;
using FullStackAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FullStackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadosController : Controller
    {
        private readonly DepositosDbContext dbContext;

        public EmpleadosController(DepositosDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GettAllEmpleados(Guid IdDeposito)
        {
            var empleado = await dbContext.Empleados.Where(p => p.IdDeposito == IdDeposito).ToListAsync();

            return Ok(empleado);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEmpleado(Guid idDeposito, Empleado empleadoRequest)
        {
            empleadoRequest.Id = Guid.NewGuid();

            await dbContext.Empleados.AddAsync(empleadoRequest);
            await dbContext.SaveChangesAsync();
            return Ok(empleadoRequest);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetEmpleado([FromRoute] Guid id)
        {
            var empleado = await dbContext.Empleados.FirstOrDefaultAsync(x => x.Id == id);

            if (empleado == null)
            {
                return NotFound();
            }
            return Ok(empleado);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateEmpleado([FromRoute] Guid id, Empleado updateEmpleadoRequest)
        {
            var empleado = await dbContext.Empleados.FindAsync(id);

            if (empleado == null)
            {
                return NotFound();
            }

            empleado.Nombre = updateEmpleadoRequest.Nombre;
            empleado.Apellido = updateEmpleadoRequest.Apellido;
            empleado.Telefono = updateEmpleadoRequest.Telefono;
            empleado.IdDeposito = updateEmpleadoRequest.IdDeposito;

            await dbContext.SaveChangesAsync();

            return Ok(empleado);

        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteEmpleado([FromRoute] Guid id)
        {
            var empleado = await dbContext.Empleados.FindAsync(id);

            if (empleado == null)
            {
                return NotFound();
            }

            dbContext.Empleados.Remove(empleado);

            await dbContext.SaveChangesAsync();

            return Ok(empleado);

        }

    }
}
