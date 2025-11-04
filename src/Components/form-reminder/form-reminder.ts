import { Component, inject, OnInit } from '@angular/core';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { ServicioRecordatorio } from '../../Services/recordatorios/servicio-recordatorio';
import { Alerta } from '../../Services/alerta/alerta';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recordatorio } from '../../Models/Recordatorio';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-reminder',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-reminder.html',
  styleUrl: './form-reminder.css'
})
export class FormReminder implements OnInit{
  private readonly SERVICIO_AUTENTICACION = inject(ServicioAutenticacion);
  private readonly SERVICIO_RECORDATORIOS = inject(ServicioRecordatorio);
  private readonly ALERTA = inject(Alerta);
  private readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  isEdit = false;
  submitting = false;
  recordatorioID: string | null = null;
  RecordatorioTraido: Recordatorio | null = null;


  recordatorioForm = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    fechaRecordatorio: ['', Validators.required]
  });

  ngOnInit(): void {
    this.recordatorioID = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.recordatorioID;

    if (this.isEdit) {
      this.cargarRecordatorio();
    }
  }


  async onSubmit() {
    if (this.recordatorioForm.invalid) {
      this.ALERTA.mostrar('Completa el formulario correctamente.', 'danger');
      return;
    }
  
    this.submitting = true;
    const valores = this.recordatorioForm.value;
  
    const recordatorio: Recordatorio = {
      id: this.isEdit ? this.recordatorioID! : undefined,
      titulo: valores.titulo!,
      descripcion: valores.descripcion!,
      fechaRecordatorio: new Date (valores.fechaRecordatorio!),
      id_usuario: this.SERVICIO_AUTENTICACION.usuario()?.id!
    };
  
    try {
      // 🟠 Validar nombre duplicado solo en modo "agregar"
      if (!this.isEdit) {
        const recordatorios = await firstValueFrom(this.SERVICIO_RECORDATORIOS.getAllReminders());
  
        const existe = recordatorios.some(r =>
          r.titulo.trim().toLowerCase() === recordatorio.titulo.toLowerCase()
        );
  
        if (existe) {
          this.ALERTA.mostrar('Ya existe un recordatorio con ese titulo.', 'danger');
          this.submitting = false;
          return;
        }
      }
  
      // 🟢 Guardar o actualizar según el modo
      if (this.isEdit) {
        await firstValueFrom(this.SERVICIO_RECORDATORIOS.putReminder(recordatorio));
        this.ALERTA.mostrar('Recordatorio actualizado con éxito.', 'success');
      } else {
        await firstValueFrom(this.SERVICIO_RECORDATORIOS.postReminder(recordatorio));
        this.ALERTA.mostrar('Recordatorio agregado con éxito.', 'success');
      }
  
      this.router.navigate(['/reminderPage']);
    } catch (err) {
      console.error(err);
      this.ALERTA.mostrar('Error al guardar el recordatorio.', 'danger');
    } finally {
      this.submitting = false;
    }
  }
    
  volver() {
    this.router.navigate(['/reminderPage']);
  }

  cargarRecordatorio() {
    this.SERVICIO_RECORDATORIOS.getReminder(this.recordatorioID!).subscribe({
          next: (rec: Recordatorio) => {
            this.RecordatorioTraido = rec;
            this.recordatorioForm.patchValue({
              titulo: rec.titulo,
              descripcion: rec.descripcion,
              fechaRecordatorio: new Date(rec.fechaRecordatorio).toISOString().split('T')[0]
            });
          },
          error: () => this.ALERTA.mostrar('Error al cargar el proveedor.', 'danger')
        });
  }
}
