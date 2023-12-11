using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FullStackAPI.Models
{
    public class ProductoIngresado
    {
            public Guid Id { get; set; }

            public Guid IdProducto { get; set; }

            public string NombreProducto { get; set; }
            
            public int Cantidad { get; set; }

            public bool Almacenado { get; set; }

            public Guid OrdenEntranteId { get; set; } 

            public OrdenEntrante OrdenEntrante { get; set; }

            // Relación muchos a muchos con Producto a través de ProductoIngresadoProducto
            public ICollection<ProductoIngresadoProducto> ProductoIngresadoProductos { get; set; }

            public ICollection<SeccionProductos> SeccionProductos { get; set; } // Propiedad de navegación

    }

    public class ProductoIngresadoReducido
    {
        public Guid Id { get; set; }

        public Guid IdProducto { get; set; }

        public string NombreProducto { get; set; }

        public int Cantidad { get; set; }

        public bool Almacenado { get; set; }

        public Guid OrdenEntranteId { get; set; }
    }

}
