using FullStackAPI.Data;
using FullStackAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FullStackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsumidoresController : Controller
    {
        private readonly DepositosDbContext dbContext;

        public ConsumidoresController(DepositosDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GettAllConsumidores(Guid IdDeposito)
        {
            var consumidor = await dbContext.Consumidores.Where(p => p.IdDeposito == IdDeposito).ToListAsync();

            return Ok(consumidor);
        }

        [HttpPost]
        public async Task<IActionResult> CreateConsumidor(Guid idDeposito, Consumidor consumidorRequest)
        {
            consumidorRequest.Id = Guid.NewGuid();

            await dbContext.Consumidores.AddAsync(consumidorRequest);
            await dbContext.SaveChangesAsync();
            return Ok(consumidorRequest);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetConsumidor([FromRoute] Guid id)
        {
            var consumidor = await dbContext.Consumidores.FirstOrDefaultAsync(x => x.Id == id);

            if (consumidor == null)
            {
                return NotFound();
            }
            return Ok(consumidor);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateConsumidor([FromRoute] Guid id, Consumidor updateConsumidorRequest)
        {
            var consumidor = await dbContext.Consumidores.FindAsync(id);

            if (consumidor == null)
            {
                return NotFound();
            }

            consumidor.Nombre = updateConsumidorRequest.Nombre;
            consumidor.Direccion = updateConsumidorRequest.Direccion;
            consumidor.Correo = updateConsumidorRequest.Correo;
            consumidor.IdDeposito = updateConsumidorRequest.IdDeposito;

            await dbContext.SaveChangesAsync();

            return Ok(consumidor);

        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteConsumidor([FromRoute] Guid id)
        {
            var consumidor = await dbContext.Consumidores.FindAsync(id);

            if (consumidor == null)
            {
                return NotFound();
            }

            dbContext.Consumidores.Remove(consumidor);

            await dbContext.SaveChangesAsync();

            return Ok(consumidor);

        }


    }
}
