using FullStackAPI.Data;
using FullStackAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FullStackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProveedoresController : Controller
    {
        private readonly DepositosDbContext dbContext;

        public ProveedoresController(DepositosDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GettAllProveedores(Guid IdDeposito)
        {
            var proveedor = await dbContext.Proveedores.Where(p => p.IdDeposito == IdDeposito).ToListAsync();

            return Ok(proveedor);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProveedor(Guid idDeposito, Proveedor proveedorRequest)
        {
            proveedorRequest.Id = Guid.NewGuid();
            
            await dbContext.Proveedores.AddAsync(proveedorRequest);
            await dbContext.SaveChangesAsync();
            return Ok(proveedorRequest);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetProveedor([FromRoute] Guid id)
        {
            var proveedor = await dbContext.Proveedores.FirstOrDefaultAsync(x => x.Id == id);

            if (proveedor == null)
            {
                return NotFound();
            }
            return Ok(proveedor);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateProveedor([FromRoute] Guid id, Proveedor updateProveedorRequest)
        {
            var proveedor = await dbContext.Proveedores.FindAsync(id);

            if (proveedor == null)
            {
                return NotFound();
            }

            proveedor.Nombre = updateProveedorRequest.Nombre;
            proveedor.Direccion = updateProveedorRequest.Direccion;
            proveedor.Ciudad = updateProveedorRequest.Ciudad;
            proveedor.Correo = updateProveedorRequest.Correo;
            proveedor.IdDeposito = updateProveedorRequest.IdDeposito;

            await dbContext.SaveChangesAsync();

            return Ok(proveedor);

        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteProveedor([FromRoute] Guid id)
        {
            var proveedor = await dbContext.Proveedores.FindAsync(id);

            if (proveedor == null)
            {
                return NotFound();
            }
            //else
            //{
            //    var productos = await dbContext.Productos.Where(p => p.IdProveedor == id).ToListAsync();

            //    if(productos != null)
            //    {
            //        return NotFound("No puedes eliminar un proveedor que tiene productos en este depósito");

            //    }
            //}

            dbContext.Proveedores.Remove(proveedor);

            await dbContext.SaveChangesAsync();

            return Ok(proveedor);

        }


    }
}
