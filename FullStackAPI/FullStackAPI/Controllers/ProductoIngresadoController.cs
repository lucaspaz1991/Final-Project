using FullStackAPI.Data;
using FullStackAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace FullStackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoIngresadoController : Controller
    {
        private readonly DepositosDbContext dbContext;

        public ProductoIngresadoController(DepositosDbContext dbContext)
        {
            this.dbContext = dbContext;
        }



        









    }
}
