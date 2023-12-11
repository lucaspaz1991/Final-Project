﻿// <auto-generated />
using System;
using FullStackAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FullStackAPI.Migrations
{
    [DbContext(typeof(DepositosDbContext))]
    [Migration("20231031021503_versionFinal")]
    partial class versionFinal
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("FullStackAPI.Models.Consumidor", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Correo")
                        .HasColumnType("longtext");

                    b.Property<string>("Direccion")
                        .HasColumnType("longtext");

                    b.Property<Guid>("IdDeposito")
                        .HasColumnType("char(36)");

                    b.Property<string>("Nombre")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("IdDeposito");

                    b.ToTable("Consumidores");
                });

            modelBuilder.Entity("FullStackAPI.Models.Deposito", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<decimal>("CapacidadActual")
                        .HasColumnType("decimal(18,2)");

                    b.Property<long>("CapacidadMaxima")
                        .HasColumnType("bigint");

                    b.Property<string>("Ciudad")
                        .HasColumnType("longtext");

                    b.Property<string>("Codigo")
                        .HasColumnType("longtext");

                    b.Property<string>("Direccion")
                        .HasColumnType("longtext");

                    b.Property<string>("FechaCreacion")
                        .HasColumnType("longtext");

                    b.Property<long>("OcupacionActual")
                        .HasColumnType("bigint");

                    b.Property<string>("Pais")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Depositos");
                });

            modelBuilder.Entity("FullStackAPI.Models.Empleado", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Apellido")
                        .HasColumnType("longtext");

                    b.Property<Guid>("IdDeposito")
                        .HasColumnType("char(36)");

                    b.Property<string>("Nombre")
                        .HasColumnType("longtext");

                    b.Property<long>("Telefono")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("IdDeposito");

                    b.ToTable("Empleados");
                });

            modelBuilder.Entity("FullStackAPI.Models.OrdenEntrante", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("FechaRecepcion")
                        .HasColumnType("longtext");

                    b.Property<Guid>("IdDeposito")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("IdEmpleado")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("IdProveedor")
                        .HasColumnType("char(36)");

                    b.Property<string>("NumeroDocumento")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("IdDeposito");

                    b.HasIndex("IdEmpleado");

                    b.HasIndex("IdProveedor");

                    b.ToTable("OrdenEntrante");
                });

            modelBuilder.Entity("FullStackAPI.Models.Producto", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<long>("CantidadEnStock")
                        .HasColumnType("bigint");

                    b.Property<string>("Categoria")
                        .HasColumnType("longtext");

                    b.Property<string>("Descripcion")
                        .HasColumnType("longtext");

                    b.Property<long>("Dimensiones")
                        .HasColumnType("bigint");

                    b.Property<string>("FechaCreacion")
                        .HasColumnType("longtext");

                    b.Property<string>("FechaValidez")
                        .HasColumnType("longtext");

                    b.Property<Guid>("IdDeposito")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("IdProveedor")
                        .HasColumnType("char(36)");

                    b.Property<string>("Nombre")
                        .HasColumnType("longtext");

                    b.Property<decimal>("Precio")
                        .HasColumnType("decimal(18,2)");

                    b.HasKey("Id");

                    b.HasIndex("IdDeposito");

                    b.HasIndex("IdProveedor");

                    b.ToTable("Productos");
                });

            modelBuilder.Entity("FullStackAPI.Models.ProductoIngresado", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<bool>("Almacenado")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("Cantidad")
                        .HasColumnType("int");

                    b.Property<Guid>("IdProducto")
                        .HasColumnType("char(36)");

                    b.Property<string>("NombreProducto")
                        .HasColumnType("longtext");

                    b.Property<Guid>("OrdenEntranteId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("OrdenEntranteId");

                    b.ToTable("ProductoIngresado");
                });

            modelBuilder.Entity("FullStackAPI.Models.ProductoIngresadoProducto", b =>
                {
                    b.Property<Guid>("ProductoIngresadoId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("ProductoId")
                        .HasColumnType("char(36)");

                    b.HasKey("ProductoIngresadoId", "ProductoId");

                    b.HasIndex("ProductoId");

                    b.ToTable("ProductoIngresadoProducto");
                });

            modelBuilder.Entity("FullStackAPI.Models.Proveedor", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Ciudad")
                        .HasColumnType("longtext");

                    b.Property<string>("Correo")
                        .HasColumnType("longtext");

                    b.Property<string>("Direccion")
                        .HasColumnType("longtext");

                    b.Property<Guid>("IdDeposito")
                        .HasColumnType("char(36)");

                    b.Property<string>("Nombre")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("IdDeposito");

                    b.ToTable("Proveedores");
                });

            modelBuilder.Entity("FullStackAPI.Models.Seccion", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<decimal>("CapacidadActual")
                        .HasColumnType("decimal(18,2)");

                    b.Property<long>("CapacidadMaxima")
                        .HasColumnType("bigint");

                    b.Property<string>("Codigo")
                        .HasColumnType("longtext");

                    b.Property<string>("FechaCreacion")
                        .HasColumnType("longtext");

                    b.Property<Guid>("IdDeposito")
                        .HasColumnType("char(36)");

                    b.Property<long>("OcupacionActual")
                        .HasColumnType("bigint");

                    b.Property<string>("TipoSeccion")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("IdDeposito");

                    b.ToTable("Secciones");
                });

            modelBuilder.Entity("FullStackAPI.Models.SeccionProductos", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<int>("Cantidad")
                        .HasColumnType("int");

                    b.Property<Guid>("IdProducto")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("IdSeccion")
                        .HasColumnType("char(36)");

                    b.Property<string>("NombreProducto")
                        .HasColumnType("longtext");

                    b.Property<Guid>("ProductoIngresadoId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("IdProducto");

                    b.HasIndex("IdSeccion");

                    b.HasIndex("ProductoIngresadoId");

                    b.ToTable("SeccionProductos");
                });

            modelBuilder.Entity("FullStackAPI.Models.Usuario", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("contrasena")
                        .HasColumnType("longtext");

                    b.Property<string>("email")
                        .HasColumnType("longtext");

                    b.Property<string>("idRol")
                        .HasColumnType("longtext");

                    b.Property<string>("usuario")
                        .HasColumnType("longtext");

                    b.HasKey("id");

                    b.ToTable("Usuarios");
                });

            modelBuilder.Entity("FullStackAPI.Models.Consumidor", b =>
                {
                    b.HasOne("FullStackAPI.Models.Deposito", "Deposito")
                        .WithMany("Consumidores")
                        .HasForeignKey("IdDeposito")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Deposito");
                });

            modelBuilder.Entity("FullStackAPI.Models.Empleado", b =>
                {
                    b.HasOne("FullStackAPI.Models.Deposito", "Deposito")
                        .WithMany("Empleados")
                        .HasForeignKey("IdDeposito")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Deposito");
                });

            modelBuilder.Entity("FullStackAPI.Models.OrdenEntrante", b =>
                {
                    b.HasOne("FullStackAPI.Models.Deposito", "Deposito")
                        .WithMany("OrdenEntrante")
                        .HasForeignKey("IdDeposito")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FullStackAPI.Models.Empleado", "Empleado")
                        .WithMany("OrdenEntrante")
                        .HasForeignKey("IdEmpleado")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FullStackAPI.Models.Proveedor", "Proveedor")
                        .WithMany("OrdenEntrante")
                        .HasForeignKey("IdProveedor")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Deposito");

                    b.Navigation("Empleado");

                    b.Navigation("Proveedor");
                });

            modelBuilder.Entity("FullStackAPI.Models.Producto", b =>
                {
                    b.HasOne("FullStackAPI.Models.Deposito", "Deposito")
                        .WithMany("Productos")
                        .HasForeignKey("IdDeposito")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FullStackAPI.Models.Proveedor", "Proveedor")
                        .WithMany("Producto")
                        .HasForeignKey("IdProveedor")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Deposito");

                    b.Navigation("Proveedor");
                });

            modelBuilder.Entity("FullStackAPI.Models.ProductoIngresado", b =>
                {
                    b.HasOne("FullStackAPI.Models.OrdenEntrante", "OrdenEntrante")
                        .WithMany("ProductosIngresados")
                        .HasForeignKey("OrdenEntranteId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("OrdenEntrante");
                });

            modelBuilder.Entity("FullStackAPI.Models.ProductoIngresadoProducto", b =>
                {
                    b.HasOne("FullStackAPI.Models.Producto", "Producto")
                        .WithMany("ProductoIngresadoProductos")
                        .HasForeignKey("ProductoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FullStackAPI.Models.ProductoIngresado", "ProductoIngresado")
                        .WithMany("ProductoIngresadoProductos")
                        .HasForeignKey("ProductoIngresadoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Producto");

                    b.Navigation("ProductoIngresado");
                });

            modelBuilder.Entity("FullStackAPI.Models.Proveedor", b =>
                {
                    b.HasOne("FullStackAPI.Models.Deposito", "Deposito")
                        .WithMany("Proveedores")
                        .HasForeignKey("IdDeposito")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Deposito");
                });

            modelBuilder.Entity("FullStackAPI.Models.Seccion", b =>
                {
                    b.HasOne("FullStackAPI.Models.Deposito", "Deposito")
                        .WithMany("Secciones")
                        .HasForeignKey("IdDeposito")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Deposito");
                });

            modelBuilder.Entity("FullStackAPI.Models.SeccionProductos", b =>
                {
                    b.HasOne("FullStackAPI.Models.Producto", "Producto")
                        .WithMany("SeccionProductos")
                        .HasForeignKey("IdProducto")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FullStackAPI.Models.Seccion", "Seccion")
                        .WithMany("SeccionProductos")
                        .HasForeignKey("IdSeccion")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("FullStackAPI.Models.ProductoIngresado", null)
                        .WithMany("SeccionProductos")
                        .HasForeignKey("ProductoIngresadoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Producto");

                    b.Navigation("Seccion");
                });

            modelBuilder.Entity("FullStackAPI.Models.Deposito", b =>
                {
                    b.Navigation("Consumidores");

                    b.Navigation("Empleados");

                    b.Navigation("OrdenEntrante");

                    b.Navigation("Productos");

                    b.Navigation("Proveedores");

                    b.Navigation("Secciones");
                });

            modelBuilder.Entity("FullStackAPI.Models.Empleado", b =>
                {
                    b.Navigation("OrdenEntrante");
                });

            modelBuilder.Entity("FullStackAPI.Models.OrdenEntrante", b =>
                {
                    b.Navigation("ProductosIngresados");
                });

            modelBuilder.Entity("FullStackAPI.Models.Producto", b =>
                {
                    b.Navigation("ProductoIngresadoProductos");

                    b.Navigation("SeccionProductos");
                });

            modelBuilder.Entity("FullStackAPI.Models.ProductoIngresado", b =>
                {
                    b.Navigation("ProductoIngresadoProductos");

                    b.Navigation("SeccionProductos");
                });

            modelBuilder.Entity("FullStackAPI.Models.Proveedor", b =>
                {
                    b.Navigation("OrdenEntrante");

                    b.Navigation("Producto");
                });

            modelBuilder.Entity("FullStackAPI.Models.Seccion", b =>
                {
                    b.Navigation("SeccionProductos");
                });
#pragma warning restore 612, 618
        }
    }
}
