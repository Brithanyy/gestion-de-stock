import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { ServicioProveedor } from '../../Services/proveedores/servicio-proveedor';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';
import { Alerta } from '../../Services/alerta/alerta';
import { Proveedor } from '../../Models/Proveedor';
import { Bebida } from '../../Models/Bebida';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-provider',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-provider.html',
  styleUrl: './form-provider.css'
})
export class FormProvider implements OnInit {

  // Servicios
  readonly SERVICIO_BEBIDAS = inject(ServicioBebidas);
  readonly SERVICIO_PROVEEDORES = inject(ServicioProveedor);
  readonly ALERTA = inject(Alerta);
  readonly SERVICIO_AUTENTICACION = inject(ServicioAutenticacion);
  readonly fb = inject(FormBuilder);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  // Estado general
  proveedorID: string | null = null;
  proveedorTraido: Proveedor | null = null;
  bebidasDisponibles: Bebida[] = [];
  usuarioSignal = this.SERVICIO_AUTENTICACION.usuario;
  isEdit = false;
  submitting = false;

  // Formulario reactivo
  proveedorForm = this.fb.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    descripcion: [''],
    bebidas: [[] as string[]] // 👈 array de IDs de bebidas
  });

  ngOnInit(): void {
    this.proveedorID = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.proveedorID;

    this.cargarBebidasDisponibles();

    if (this.isEdit) {
      this.cargarProveedor();
    }
  }

  // Carga todas las bebidas
  cargarBebidasDisponibles() {
    this.SERVICIO_BEBIDAS.getAllDrinks().subscribe({
      next: (bebidas: Bebida[]) => (this.bebidasDisponibles = bebidas),
      error: () => this.ALERTA.mostrar('No se pudieron cargar las bebidas.', 'danger')
    });
  }

  // Carga proveedor existente (para edición)
  cargarProveedor() {
    this.SERVICIO_PROVEEDORES.getProvider(this.proveedorID!).subscribe({
      next: (prov: Proveedor) => {
        this.proveedorTraido = prov;
        this.proveedorForm.patchValue({
          nombre: prov.nombre,
          telefono: prov.telefono,
          descripcion: prov.descripcion,
          bebidas: prov.bebidas || []
        });
      },
      error: () => this.ALERTA.mostrar('Error al cargar el proveedor.', 'danger')
    });
  }

  // Maneja selección de bebidas (checkboxes)
  toggleBebidaSeleccionada(idBebida: string, event: any) {
    const bebidasSeleccionadas = this.proveedorForm.value.bebidas || [];
    if (event.target.checked) {
      this.proveedorForm.patchValue({ bebidas: [...bebidasSeleccionadas, idBebida] });
    } else {
      this.proveedorForm.patchValue({
        bebidas: bebidasSeleccionadas.filter((id) => id !== idBebida)
      });
    }
  }

  // Guarda o actualiza proveedor
async onSubmit() {
  if (this.proveedorForm.invalid) {
    this.ALERTA.mostrar('Completa el formulario correctamente.', 'danger');
    return;
  }

  this.submitting = true;
  const valores = this.proveedorForm.value;

  const proveedor: Proveedor = {
    id: this.isEdit ? this.proveedorID! : undefined,
    nombre: valores.nombre!.trim(),
    telefono: valores.telefono!.trim(),
    descripcion: valores.descripcion!.trim(),
    bebidas: valores.bebidas || []
  };

  try {
    // 🟠 Validar nombre duplicado solo en modo "agregar"
    if (!this.isEdit) {
      const proveedores = await firstValueFrom(this.SERVICIO_PROVEEDORES.getAllProvider());

      const existe = proveedores.some(p =>
        p.nombre.trim().toLowerCase() === proveedor.nombre.toLowerCase()
      );

      if (existe) {
        this.ALERTA.mostrar('Ya existe un proveedor con ese nombre.', 'danger');
        this.submitting = false;
        return;
      }
    }

    // 🟢 Guardar o actualizar según el modo
    if (this.isEdit) {
      await firstValueFrom(this.SERVICIO_PROVEEDORES.putProvider(proveedor));
      this.ALERTA.mostrar('Proveedor actualizado con éxito.', 'success');
    } else {
      await firstValueFrom(this.SERVICIO_PROVEEDORES.postProvider(proveedor));
      this.ALERTA.mostrar('Proveedor agregado con éxito.', 'success');
    }

    this.router.navigate(['/providerPage']);
  } catch (err) {
    console.error(err);
    this.ALERTA.mostrar('Error al guardar el proveedor.', 'danger');
  } finally {
    this.submitting = false;
  }
}

  volver() {
    this.router.navigate(['/providerPage']);
  }
}
