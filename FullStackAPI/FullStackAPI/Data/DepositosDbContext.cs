using FullStackAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FullStackAPI.Data
{
    public class DepositosDbContext : DbContext
    {
        public DepositosDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Deposito> Depositos { get; set; }
        public DbSet<Seccion> Secciones { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Proveedor> Proveedores { get; set; }
        public DbSet<Empleado> Empleados { get; set; }
        public DbSet<OrdenEntrante> OrdenEntrante { get; set; }
        public DbSet<ProductoIngresado> ProductoIngresado { get; set; }
        public DbSet<SeccionProductos> SeccionProductos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Consumidor> Consumidores { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Seccion>()
                .HasOne(s => s.Deposito)
                .WithMany(d => d.Secciones)
                .HasForeignKey(s => s.IdDeposito);

            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Deposito)
                .WithMany(d => d.Productos)
                .HasForeignKey(s => s.IdDeposito);

            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Proveedor)
                .WithMany(d => d.Producto)
                .HasForeignKey(s => s.IdProveedor);

            modelBuilder.Entity<Proveedor>()
                .HasOne(p => p.Deposito)
                .WithMany(d => d.Proveedores)
                .HasForeignKey(s => s.IdDeposito);

            modelBuilder.Entity<Empleado>()
                .HasOne(p => p.Deposito)
                .WithMany(d => d.Empleados)
                .HasForeignKey(s => s.IdDeposito);

            // Configuración de la relación muchos a muchos entre Producto y ProductoIngresado
            modelBuilder.Entity<ProductoIngresadoProducto>()
                .HasKey(pip => new { pip.ProductoIngresadoId, pip.ProductoId });

            modelBuilder.Entity<ProductoIngresadoProducto>()
                .HasOne(pip => pip.ProductoIngresado)
                .WithMany(pi => pi.ProductoIngresadoProductos)
                .HasForeignKey(pip => pip.ProductoIngresadoId);

            modelBuilder.Entity<ProductoIngresadoProducto>()
                .HasOne(pip => pip.Producto)
                .WithMany(p => p.ProductoIngresadoProductos)
                .HasForeignKey(pip => pip.ProductoId);

            // Configuración de la relación uno a muchos entre OrdenEntrante y ProductoIngresado
            modelBuilder.Entity<OrdenEntrante>()
                .HasMany(oe => oe.ProductosIngresados)
                .WithOne(pi => pi.OrdenEntrante)
                .HasForeignKey(pi => pi.OrdenEntranteId);

            modelBuilder.Entity<OrdenEntrante>()
                .HasOne(p => p.Deposito)
                .WithMany(d => d.OrdenEntrante)
                .HasForeignKey(s => s.IdDeposito);

            modelBuilder.Entity<OrdenEntrante>()
                .HasOne(p => p.Proveedor)
                .WithMany(d => d.OrdenEntrante)
                .HasForeignKey(s => s.IdProveedor);

            modelBuilder.Entity<OrdenEntrante>()
                .HasOne(p => p.Empleado)
                .WithMany(d => d.OrdenEntrante)
                .HasForeignKey(s => s.IdEmpleado);

            modelBuilder.Entity<SeccionProductos>()
                .HasKey(sp => sp.Id);

            // Relación entre SeccionProductos y Seccion por IdSeccion
            modelBuilder.Entity<SeccionProductos>()
                .HasOne(sp => sp.Seccion)
                .WithMany(s => s.SeccionProductos)
                .HasForeignKey(sp => sp.IdSeccion);

            // Relación entre SeccionProductos y ProductoIngresado por IdProducto
            modelBuilder.Entity<SeccionProductos>()
                .HasOne(sp => sp.Producto)
                .WithMany(pi => pi.SeccionProductos)
                .HasForeignKey(sp => sp.IdProducto);

            modelBuilder.Entity<Consumidor>()
              .HasOne(p => p.Deposito)
              .WithMany(d => d.Consumidores)
              .HasForeignKey(s => s.IdDeposito);

        }
    }
}
