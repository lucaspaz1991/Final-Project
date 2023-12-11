using System.ComponentModel.DataAnnotations.Schema;

namespace FullStackAPI.Models
{
    public class Proveedor
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Ciudad { get; set; }
        public string Correo { get; set; }
        public Guid IdDeposito { get; set; }

        [ForeignKey("IdDeposito")]
        public Deposito Deposito { get; set; }

        public ICollection<Producto> Producto { get; set; }

        [InverseProperty("Proveedor")]
        public ICollection<OrdenEntrante> OrdenEntrante { get; set; }
    }
}
