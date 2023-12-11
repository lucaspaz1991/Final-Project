namespace FullStackAPI.Models
{
    public class ProductoIngresadoProducto
    {
        public Guid ProductoIngresadoId { get; set; }
        public ProductoIngresado ProductoIngresado { get; set; }
        public Guid ProductoId { get; set; }
        public Producto Producto { get; set; }
    }
}
