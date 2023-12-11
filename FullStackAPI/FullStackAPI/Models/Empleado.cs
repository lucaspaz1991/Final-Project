using System.ComponentModel.DataAnnotations.Schema;

namespace FullStackAPI.Models
{
    public class Empleado
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public long Telefono { get; set; }
        public Guid IdDeposito { get; set; }

        [ForeignKey("IdDeposito")]
        public Deposito Deposito { get; set; }

        [InverseProperty("Empleado")]
        public ICollection<OrdenEntrante> OrdenEntrante { get; set; }
    }
}
