using System.ComponentModel.DataAnnotations.Schema;

namespace FullStackAPI.Models
{
    public class Seccion
    {
        public Guid Id { get; set; }

        public string Codigo { get; set; }

        public string TipoSeccion { get; set; }

        public long CapacidadMaxima { get; set; }

        public long OcupacionActual { get; set; }

        public decimal CapacidadActual { get; set; }

        public string FechaCreacion { get; set; }

        public Guid IdDeposito { get; set; }

        [ForeignKey("IdDeposito")]
        public Deposito Deposito { get; set; }

        public ICollection<SeccionProductos> SeccionProductos { get; set; } // Propiedad de navegación

    }
}
