import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ServicioService } from '../../servicio/services/servicio-service';

@Component({
  selector: 'app-componente-alta-servicio',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './componente-alta-servicio.html',
  styleUrl: './componente-alta-servicio.css',
})
export class ComponenteAltaServicio {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    tipo: ['', [Validators.required]],
    duracionMinutos: [0, [Validators.required, Validators.min(30)]],
    precio: [0, [Validators.required, Validators.min(15000)]],
  });
  ss: ServicioService = inject(ServicioService);
  r: Router = inject(Router);
  generarServicio() {
    if (this.formulario.invalid) return;
    const s = this.formulario.getRawValue();
    this.ss.postServicio(s).subscribe({
      next: (s) => {
        console.log('servicio posteado', s);
        this.formulario.reset();
        this.r.navigateByUrl('/servicios-admin');
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
