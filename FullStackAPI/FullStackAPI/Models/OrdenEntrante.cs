using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FullStackAPI.Models
{
    public class OrdenEntrante
    {
        public Guid Id { get; set; }

        public string FechaRecepcion { get; set; }

        public string NumeroDocumento { get; set; }

        public Guid IdProveedor { get; set; }

        public Guid IdEmpleado { get; set; }

        public Guid IdDeposito { get; set; }

        [ForeignKey("IdDeposito")]
        public Deposito Deposito { get; set; }

        [ForeignKey("IdProveedor")]
        public Proveedor Proveedor { get; set; }

        [ForeignKey("IdEmpleado")]
        public Empleado Empleado { get; set; }

        public ICollection<ProductoIngresado> ProductosIngresados { get; set; }

    }

    //DTO para recibir los datos de la orden
    public class OrdenRequest
    {
        public List<ProductoIngresado> DetallesOrden { get; set; }
        public Guid IdDeposito { get; set; }
        public Guid IdEmpleado { get; set; }
        public Guid IdProveedor { get; set; }
    }

}
