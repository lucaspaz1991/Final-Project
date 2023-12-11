using System.ComponentModel.DataAnnotations.Schema;

namespace FullStackAPI.Models
{
    public class Deposito
    {

        public Guid Id { get; set; }

        public string Codigo { get; set; }

        public string Direccion { get; set; }

        public string Ciudad { get; set; }

        public string Pais { get; set; }

        public long CapacidadMaxima { get; set; }

        public long OcupacionActual { get; set; }

        public decimal CapacidadActual { get; set; }

        public string FechaCreacion { get; set; }

        [InverseProperty("Deposito")]
        public ICollection<Seccion> Secciones { get; set; }

        [InverseProperty("Deposito")]
        public ICollection<Producto> Productos { get; set; }

        [InverseProperty("Deposito")]
        public ICollection<Proveedor> Proveedores { get; set; }

        [InverseProperty("Deposito")]
        public ICollection<Empleado> Empleados { get; set; }

        [InverseProperty("Deposito")]
        public ICollection<Consumidor> Consumidores { get; set; }

        [InverseProperty("Deposito")]
        public ICollection<OrdenEntrante> OrdenEntrante { get; set; }
    }
}
