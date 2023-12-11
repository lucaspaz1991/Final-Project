using System.ComponentModel.DataAnnotations.Schema;

namespace FullStackAPI.Models
{
    public class Producto
    {
        public Guid Id { get; set; }

        public string Nombre { get; set; }

        public string Descripcion { get; set; }

        public string Categoria { get; set; }

        public long CantidadEnStock { get; set; }

        public long Dimensiones { get; set; }

        public decimal Precio { get; set; }

        public string FechaCreacion { get; set; }

        public string FechaValidez { get; set; }

        //public string Responsable { get; set; }

        public Guid IdDeposito { get; set; }

        public Guid IdProveedor { get; set; }

        [ForeignKey("IdDeposito")]
        public Deposito Deposito { get; set; }

        [ForeignKey("IdProveedor")]
        public Proveedor Proveedor { get; set; }

        // Relación muchos a muchos con ProductoIngresado a través de ProductoIngresadoProducto
        public ICollection<ProductoIngresadoProducto> ProductoIngresadoProductos { get; set; }

        public ICollection<SeccionProductos> SeccionProductos { get; set; } // Propiedad de navegación


    }
}

