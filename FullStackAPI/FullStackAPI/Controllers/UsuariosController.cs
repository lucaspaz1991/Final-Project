using FullStackAPI.Data;
using FullStackAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System.Security.Cryptography;
using System.Text;

namespace FullStackAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly DepositosDbContext dbContext;

        public UsuariosController(DepositosDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsuarios()
        {
            var usuarios = await dbContext.Usuarios.ToListAsync();
            return Ok(usuarios);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUsuario(Usuario usuarioRequest)
        {
            var existingUsuario = await dbContext.Usuarios.FirstOrDefaultAsync(u => u.usuario == usuarioRequest.usuario);
            if (existingUsuario != null)
            {
                return BadRequest("El nombre de usuario ya está en uso.");
            }

            var existingEmail = await dbContext.Usuarios.FirstOrDefaultAsync(u => u.email == usuarioRequest.email);
            if (existingEmail != null)
            {
                return BadRequest("El email ya está en uso.");
            }

            if (!IsValidEmail(usuarioRequest.email))
            {
                return BadRequest("El campo de email no es un correo electrónico válido.");
            }

            usuarioRequest.id = Guid.NewGuid();

            string hashedPassword = HashPassword(usuarioRequest.contrasena);
            usuarioRequest.contrasena = hashedPassword;

            await dbContext.Usuarios.AddAsync(usuarioRequest);
            await dbContext.SaveChangesAsync();
            return Ok(usuarioRequest);
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashBytes);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Usuario loginRequest)
        {
            var usuario = await dbContext.Usuarios.FirstOrDefaultAsync(u => u.usuario == loginRequest.usuario);
            if (usuario == null)
            {
                return BadRequest("Usuario no encontrado.");
            }

            string hashedPassword = HashPassword(loginRequest.contrasena);
            if (!SecureEquals(usuario.contrasena, hashedPassword))
            {
                return BadRequest("Contraseña incorrecta.");
            }

            return Ok(usuario);
        }

        private bool SecureEquals(string a, string b)
        {
            if (a.Length != b.Length)
            {
                return false;
            }

            var aBytes = Encoding.UTF8.GetBytes(a);
            var bBytes = Encoding.UTF8.GetBytes(b);

            uint result = 0;
            for (int i = 0; i < a.Length; i++)
            {
                result |= (uint)(aBytes[i] ^ bBytes[i]);
            }

            return result == 0;
        }

        private async Task EnviarCorreoRecuperacion(string email, string contrasenaTemporal)
        {
            var mensaje = new MimeMessage();
            mensaje.From.Add(new MailboxAddress("Proyecto Slo", "simuladorlogistico2023@gmail.com"));
            mensaje.To.Add(new MailboxAddress("Destinatario", email));

            mensaje.Subject = "Recuperación de Contraseña";

            var contenidoBuilder = new BodyBuilder();
            contenidoBuilder.TextBody = $"Tu nueva contraseña es: {contrasenaTemporal}";

            mensaje.Body = contenidoBuilder.ToMessageBody();

            try
            {
                using (var cliente = new MailKit.Net.Smtp.SmtpClient())
                {
                    cliente.Connect("smtp.gmail.com", 587, false);
                    cliente.Authenticate("simuladorlogistico2023@gmail.com", "znsojtneeuqxectm");

                    await cliente.SendAsync(mensaje);

                    cliente.Disconnect(true);
                }
            }
            catch (Exception ex)
            {

            }
        }

        private string GenerarContrasenaTemporal()
        {
            int longitudContrasena = 10;
            const string caracteresValidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            StringBuilder contrasenaBuilder = new StringBuilder();
            Random random = new Random();
            while (contrasenaBuilder.Length < longitudContrasena)
            {
                contrasenaBuilder.Append(caracteresValidos[random.Next(caracteresValidos.Length)]);
            }

            return contrasenaBuilder.ToString();
        }

        [HttpPost("recuperar-contrasena")]
        public async Task<IActionResult> RecuperarContrasena([FromBody] Usuario usuario)
        {
            var existingUsuario = await dbContext.Usuarios.FirstOrDefaultAsync(u => u.email == usuario.email);
            if (existingUsuario == null)
            {
                return BadRequest("No se encontró ningún usuario con ese correo electrónico.");
            }

            string contrasenaTemporal = GenerarContrasenaTemporal();
            string hashedPassword = HashPassword(contrasenaTemporal);
            existingUsuario.contrasena = hashedPassword;

            await dbContext.SaveChangesAsync();

            await EnviarCorreoRecuperacion(usuario.email, contrasenaTemporal);

            return Ok(new { message = "Se ha enviado una contraseña temporal al correo electrónico proporcionado: " + contrasenaTemporal });
        }

        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetUsuario(Guid id)
        {
            var usuario = await dbContext.Usuarios.FirstOrDefaultAsync(x => x.id == id);

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateUsuario(Guid id, [FromBody] Usuario updateUsuarioRequest)
        {
            var usuario = await dbContext.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            var existingUsuario = await dbContext.Usuarios.FirstOrDefaultAsync(u => u.usuario == updateUsuarioRequest.usuario && u.id != id);
            if (existingUsuario != null)
            {
                return BadRequest("El nombre de usuario ya está en uso.");
            }

            var existingEmail = await dbContext.Usuarios.FirstOrDefaultAsync(u => u.email == updateUsuarioRequest.email && u.id != id);
            if (existingEmail != null)
            {
                return BadRequest("El email ya está en uso.");
            }

            usuario.usuario = updateUsuarioRequest.usuario;
            usuario.email = updateUsuarioRequest.email;
            usuario.idRol = updateUsuarioRequest.idRol;

            if (!string.IsNullOrEmpty(updateUsuarioRequest.contrasena))
            {
                string hashedPassword = HashPassword(updateUsuarioRequest.contrasena);
                usuario.contrasena = hashedPassword;
            }

            await dbContext.SaveChangesAsync();
            return Ok(usuario);
        }


        [HttpPut("{id:Guid}/contrasena")]
        public async Task<IActionResult> UpdateContrasena(Guid id, [FromBody] UpdateContrasenaRequest request)
        {
            var usuario = await dbContext.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            string hashedPassword = HashPassword(request.NewPassword);
            usuario.contrasena = hashedPassword;

            await dbContext.SaveChangesAsync();
            return Ok(new { message = "Contraseña actualizada exitosamente." });
        }

        public class UpdateContrasenaRequest
        {
            public string NewPassword { get; set; }
        }
        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteUsuario(Guid id)
        {
            var usuario = await dbContext.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            dbContext.Usuarios.Remove(usuario);
            await dbContext.SaveChangesAsync();
            return Ok(usuario);
        }
    }
}
