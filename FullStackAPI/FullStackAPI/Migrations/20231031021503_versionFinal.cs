using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FullStackAPI.Migrations
{
    /// <inheritdoc />
    public partial class versionFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Depositos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Codigo = table.Column<string>(type: "longtext", nullable: true),
                    Direccion = table.Column<string>(type: "longtext", nullable: true),
                    Ciudad = table.Column<string>(type: "longtext", nullable: true),
                    Pais = table.Column<string>(type: "longtext", nullable: true),
                    CapacidadMaxima = table.Column<long>(type: "bigint", nullable: false),
                    OcupacionActual = table.Column<long>(type: "bigint", nullable: false),
                    CapacidadActual = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FechaCreacion = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Depositos", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false),
                    usuario = table.Column<string>(type: "longtext", nullable: true),
                    contrasena = table.Column<string>(type: "longtext", nullable: true),
                    idRol = table.Column<string>(type: "longtext", nullable: true),
                    email = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Consumidores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Nombre = table.Column<string>(type: "longtext", nullable: true),
                    Direccion = table.Column<string>(type: "longtext", nullable: true),
                    Correo = table.Column<string>(type: "longtext", nullable: true),
                    IdDeposito = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consumidores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Consumidores_Depositos_IdDeposito",
                        column: x => x.IdDeposito,
                        principalTable: "Depositos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Empleados",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Nombre = table.Column<string>(type: "longtext", nullable: true),
                    Apellido = table.Column<string>(type: "longtext", nullable: true),
                    Telefono = table.Column<long>(type: "bigint", nullable: false),
                    IdDeposito = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Empleados", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Empleados_Depositos_IdDeposito",
                        column: x => x.IdDeposito,
                        principalTable: "Depositos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Proveedores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Nombre = table.Column<string>(type: "longtext", nullable: true),
                    Direccion = table.Column<string>(type: "longtext", nullable: true),
                    Ciudad = table.Column<string>(type: "longtext", nullable: true),
                    Correo = table.Column<string>(type: "longtext", nullable: true),
                    IdDeposito = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Proveedores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Proveedores_Depositos_IdDeposito",
                        column: x => x.IdDeposito,
                        principalTable: "Depositos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Secciones",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Codigo = table.Column<string>(type: "longtext", nullable: true),
                    TipoSeccion = table.Column<string>(type: "longtext", nullable: true),
                    CapacidadMaxima = table.Column<long>(type: "bigint", nullable: false),
                    OcupacionActual = table.Column<long>(type: "bigint", nullable: false),
                    CapacidadActual = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FechaCreacion = table.Column<string>(type: "longtext", nullable: true),
                    IdDeposito = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Secciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Secciones_Depositos_IdDeposito",
                        column: x => x.IdDeposito,
                        principalTable: "Depositos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OrdenEntrante",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    FechaRecepcion = table.Column<string>(type: "longtext", nullable: true),
                    NumeroDocumento = table.Column<string>(type: "longtext", nullable: true),
                    IdProveedor = table.Column<Guid>(type: "char(36)", nullable: false),
                    IdEmpleado = table.Column<Guid>(type: "char(36)", nullable: false),
                    IdDeposito = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdenEntrante", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrdenEntrante_Depositos_IdDeposito",
                        column: x => x.IdDeposito,
                        principalTable: "Depositos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrdenEntrante_Empleados_IdEmpleado",
                        column: x => x.IdEmpleado,
                        principalTable: "Empleados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrdenEntrante_Proveedores_IdProveedor",
                        column: x => x.IdProveedor,
                        principalTable: "Proveedores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Productos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    Nombre = table.Column<string>(type: "longtext", nullable: true),
                    Descripcion = table.Column<string>(type: "longtext", nullable: true),
                    Categoria = table.Column<string>(type: "longtext", nullable: true),
                    CantidadEnStock = table.Column<long>(type: "bigint", nullable: false),
                    Dimensiones = table.Column<long>(type: "bigint", nullable: false),
                    Precio = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FechaCreacion = table.Column<string>(type: "longtext", nullable: true),
                    FechaValidez = table.Column<string>(type: "longtext", nullable: true),
                    IdDeposito = table.Column<Guid>(type: "char(36)", nullable: false),
                    IdProveedor = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Productos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Productos_Depositos_IdDeposito",
                        column: x => x.IdDeposito,
                        principalTable: "Depositos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Productos_Proveedores_IdProveedor",
                        column: x => x.IdProveedor,
                        principalTable: "Proveedores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProductoIngresado",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    IdProducto = table.Column<Guid>(type: "char(36)", nullable: false),
                    NombreProducto = table.Column<string>(type: "longtext", nullable: true),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    Almacenado = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    OrdenEntranteId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductoIngresado", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductoIngresado_OrdenEntrante_OrdenEntranteId",
                        column: x => x.OrdenEntranteId,
                        principalTable: "OrdenEntrante",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProductoIngresadoProducto",
                columns: table => new
                {
                    ProductoIngresadoId = table.Column<Guid>(type: "char(36)", nullable: false),
                    ProductoId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductoIngresadoProducto", x => new { x.ProductoIngresadoId, x.ProductoId });
                    table.ForeignKey(
                        name: "FK_ProductoIngresadoProducto_ProductoIngresado_ProductoIngresad~",
                        column: x => x.ProductoIngresadoId,
                        principalTable: "ProductoIngresado",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductoIngresadoProducto_Productos_ProductoId",
                        column: x => x.ProductoId,
                        principalTable: "Productos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SeccionProductos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false),
                    IdSeccion = table.Column<Guid>(type: "char(36)", nullable: false),
                    IdProducto = table.Column<Guid>(type: "char(36)", nullable: false),
                    NombreProducto = table.Column<string>(type: "longtext", nullable: true),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    ProductoIngresadoId = table.Column<Guid>(type: "char(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeccionProductos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SeccionProductos_ProductoIngresado_ProductoIngresadoId",
                        column: x => x.ProductoIngresadoId,
                        principalTable: "ProductoIngresado",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SeccionProductos_Productos_IdProducto",
                        column: x => x.IdProducto,
                        principalTable: "Productos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SeccionProductos_Secciones_IdSeccion",
                        column: x => x.IdSeccion,
                        principalTable: "Secciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Consumidores_IdDeposito",
                table: "Consumidores",
                column: "IdDeposito");

            migrationBuilder.CreateIndex(
                name: "IX_Empleados_IdDeposito",
                table: "Empleados",
                column: "IdDeposito");

            migrationBuilder.CreateIndex(
                name: "IX_OrdenEntrante_IdDeposito",
                table: "OrdenEntrante",
                column: "IdDeposito");

            migrationBuilder.CreateIndex(
                name: "IX_OrdenEntrante_IdEmpleado",
                table: "OrdenEntrante",
                column: "IdEmpleado");

            migrationBuilder.CreateIndex(
                name: "IX_OrdenEntrante_IdProveedor",
                table: "OrdenEntrante",
                column: "IdProveedor");

            migrationBuilder.CreateIndex(
                name: "IX_ProductoIngresado_OrdenEntranteId",
                table: "ProductoIngresado",
                column: "OrdenEntranteId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductoIngresadoProducto_ProductoId",
                table: "ProductoIngresadoProducto",
                column: "ProductoId");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_IdDeposito",
                table: "Productos",
                column: "IdDeposito");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_IdProveedor",
                table: "Productos",
                column: "IdProveedor");

            migrationBuilder.CreateIndex(
                name: "IX_Proveedores_IdDeposito",
                table: "Proveedores",
                column: "IdDeposito");

            migrationBuilder.CreateIndex(
                name: "IX_Secciones_IdDeposito",
                table: "Secciones",
                column: "IdDeposito");

            migrationBuilder.CreateIndex(
                name: "IX_SeccionProductos_IdProducto",
                table: "SeccionProductos",
                column: "IdProducto");

            migrationBuilder.CreateIndex(
                name: "IX_SeccionProductos_IdSeccion",
                table: "SeccionProductos",
                column: "IdSeccion");

            migrationBuilder.CreateIndex(
                name: "IX_SeccionProductos_ProductoIngresadoId",
                table: "SeccionProductos",
                column: "ProductoIngresadoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Consumidores");

            migrationBuilder.DropTable(
                name: "ProductoIngresadoProducto");

            migrationBuilder.DropTable(
                name: "SeccionProductos");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "ProductoIngresado");

            migrationBuilder.DropTable(
                name: "Productos");

            migrationBuilder.DropTable(
                name: "Secciones");

            migrationBuilder.DropTable(
                name: "OrdenEntrante");

            migrationBuilder.DropTable(
                name: "Empleados");

            migrationBuilder.DropTable(
                name: "Proveedores");

            migrationBuilder.DropTable(
                name: "Depositos");
        }
    }
}
