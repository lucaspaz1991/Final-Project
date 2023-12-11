namespace FullStackAPI.Models
{
    public class Usuario
    {
        public Guid id { get; set; }

        public string usuario { get; set; }

        public string contrasena { get; set; }

        public string idRol { get; set; }

        public string email { get; set; }
    }
}
