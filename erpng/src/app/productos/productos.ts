import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria, Producto, ProductoRequest, ProductosService } from './productos.service';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class Productos {
  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  loading = signal(false);
  error = signal('');
  formNombre = '';
  formDescripcion = '';
  formIdCategoria: number|null = null;
  editandoId: number|null = null;

  constructor(
    private productosService: ProductosService,
    protected auth: AuthService,
  ) {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias() {
    this.productosService.listarCategorias()
      .subscribe({
        next: categorias => this.categorias.set(categorias),
        error: () => this.error.set('No se pudieron cargar las categorías'),
      });
  }

  cargarProductos() {
    this.loading.set(true);
    this.error.set('');

    this.productosService.listar().subscribe({
      next: productos => this.productos.set(productos),
      error: () => {
        this.error.set('No se pudieron cargar los productos');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  guardarProducto() {
    const producto = this.obtenerProductoDesdeFormulario();
    if (!producto) return;

    if (this.editandoId != null) {
      this.productosService.actualizar(this.editandoId, producto)
        .subscribe({
          next: () => {
            this.cancelarEdicion();
            this.cargarProductos();
          },
          error: () => this.error.set('No se pudo actualizar el producto'),
        });
      return;
    }

    this.productosService.crear(producto)
      .subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarProductos();
        },
        error: () => this.error.set('No se pudo crear el producto'),
      });
  }

  iniciarEdicion(producto: Producto) {
    this.editandoId = producto.id;
    this.formNombre = producto.nombre;
    this.formDescripcion = producto.descripcion;
    this.formIdCategoria = producto.idCategoria;
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.limpiarFormulario();
  }

  eliminarProducto(id: number) {
    if (!confirm(`¿Está seguro de eliminar el producto ${id}?`)) return;

    this.productosService.eliminar(id)
      .subscribe({
        next: () => this.cargarProductos(),
        error: () => this.error.set('No se pudo eliminar el producto'),
      });
  }

  puedeGestionarProductos(): boolean {
    return this.auth.hasAnyRole(['ROLE_ADMIN', 'ADMIN']);
  }

  nombreCategoria(idCategoria: number): string {
    return this.categorias().find(categoria => categoria.id === idCategoria)?.nombre ?? `${idCategoria}`;
  }

  private obtenerProductoDesdeFormulario(): ProductoRequest|null {
    const nombre = this.formNombre.trim();
    const descripcion = this.formDescripcion.trim();
    const idCategoria = Number(this.formIdCategoria);

    if (!nombre || !idCategoria) {
      this.error.set('Nombre e idCategoria son obligatorios');
      return null;
    }

    this.error.set('');
    return { nombre, descripcion, idCategoria };
  }

  private limpiarFormulario() {
    this.formNombre = '';
    this.formDescripcion = '';
    this.formIdCategoria = null;
  }
}
