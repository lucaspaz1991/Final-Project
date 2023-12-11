using FullStackAPI.Data;
using FullStackAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FullStackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepositosController : Controller
    {

        private readonly DepositosDbContext dbContext;

        public DepositosController(DepositosDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GettAllDepositos()
        {
            var depositos = await dbContext.Depositos.ToListAsync();

            return Ok(depositos);
        }

      

        [HttpPost]
        public async Task<IActionResult> CreateDeposito(Deposito depositoRequest)
        {
            depositoRequest.Id = Guid.NewGuid();
            depositoRequest.CapacidadActual = 100;
            depositoRequest.OcupacionActual = 0;
            depositoRequest.FechaCreacion = DateTime.Now.ToString("dd/MM/yyyy");
            await dbContext.Depositos.AddAsync(depositoRequest);
            await dbContext.SaveChangesAsync();
            return Ok(depositoRequest);
        }


        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetDeposito([FromRoute] Guid id)
        {
            var deposito = await dbContext.Depositos.FirstOrDefaultAsync(x => x.Id == id);
            
            if (deposito == null)
            {
                return NotFound();
            }
            return Ok(deposito);
        }


        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateDeposito([FromRoute] Guid id, Deposito updateDepositoRequest)
        {
           var deposito = await dbContext.Depositos.FindAsync(id);

            if (deposito == null)
            {
                return NotFound();
            }

            deposito.Codigo = updateDepositoRequest.Codigo;
            deposito.Direccion = updateDepositoRequest.Direccion;
            deposito.Ciudad = updateDepositoRequest.Ciudad;
            deposito.Pais = updateDepositoRequest.Pais;
            deposito.CapacidadMaxima = updateDepositoRequest.CapacidadMaxima;
            deposito.OcupacionActual = updateDepositoRequest.OcupacionActual;
            deposito.CapacidadActual = updateDepositoRequest.CapacidadActual;
            deposito.FechaCreacion = updateDepositoRequest.FechaCreacion;

            await dbContext.SaveChangesAsync();

            return Ok(deposito);

        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteDeposito([FromRoute] Guid id)
        {
            var deposito = await dbContext.Depositos.FindAsync(id);

            if (deposito == null)
            {
                return NotFound();
            }

            dbContext.Depositos.Remove(deposito);

            await dbContext.SaveChangesAsync();

            return Ok(deposito);

        }





    }
}
