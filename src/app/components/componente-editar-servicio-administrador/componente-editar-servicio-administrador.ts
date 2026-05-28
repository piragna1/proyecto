import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ServicioService } from '../../servicio/services/servicio-service';
import { Servicio } from '../../servicio/interface/servicio.interface';

@Component({
  selector: 'app-componente-editar-servicio-administrador',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './componente-editar-servicio-administrador.html',
  styleUrl: './componente-editar-servicio-administrador.css',
})
export class ComponenteEditarServicioAdministrador implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  formulario = this.fb.nonNullable.group({
    tipo: ['', [Validators.required]],
    duracionMinutos: [0, [Validators.required, Validators.min(30)]],
    precio: [0, [Validators.required, Validators.min(15000)]],
  });
  ar: ActivatedRoute = inject(ActivatedRoute);
  id: string | null = null;
  ss: ServicioService = inject(ServicioService);
  r: Router = inject(Router);
  ngOnInit(): void {
    this.ar.paramMap.subscribe({
      next: (value) => {
        this.id = value.get('id');
        console.log(this.id);
        this.getServicioById(this.id);
      },
      error: (err) => {
        console.log(err);
      }
    });
  };
  editarServicio() {
    if (this.formulario.invalid) return;
    const s: Servicio = {
      tipo: this.formulario.controls.tipo.value,
      duracionMinutos: this.formulario.controls.duracionMinutos.value,
      precio: this.formulario.controls.precio.value
    };
    this.ss.putServicio(s, this.id).subscribe({
      next: (value) => {
        console.log('servicio modificado:', value);
        this.r.navigateByUrl('/servicios-admin');
      },
      error: (err) => {
        console.log(err);
      }
    });
  };
  getServicioById(id: string | null) {
    this.ss.getServicioById(id).subscribe({
      next: (value) => {
        this.formulario.controls.tipo.setValue(value.tipo);
        this.formulario.controls.duracionMinutos.setValue(value.duracionMinutos);
        this.formulario.controls.precio.setValue(value.precio);
      },
      error: (err) => {
        console.log(err);
      }
    });
  };
};
