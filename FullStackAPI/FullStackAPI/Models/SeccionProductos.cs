namespace FullStackAPI.Models
{
    public class SeccionProductos
    {
        public Guid Id { get; set; }

        public Guid IdSeccion { get; set; }

        public Seccion Seccion { get; set; } // Propiedad de navegación

        public Guid IdProducto { get; set; }

        public Producto Producto { get; set; }

        public string NombreProducto { get; set; }

        public int Cantidad { get; set; }

        public Guid ProductoIngresadoId { get; set; }

    }

    public class SeccionProductosRequest
    {
        public Guid IdSeccion { get; set; }

        public Guid IdProducto { get; set; }

        public string NombreProducto { get; set; }

        public int Cantidad { get; set; }

        public Guid ProductoIngresadoId { get; set; }

        public long Dimensiones { get; set; }

        public Guid IdDeposito { get; set; }
    }

    public class SeccionProductosResponse
    {
        public Guid IdSeccion { get; set; }

        public string Codigo { get; set; }

        public Guid IdProducto { get; set; }

        public string NombreProducto { get; set; }

        public int Cantidad { get; set; }

        public Guid ProductoIngresadoId { get; set; }

    }

}
