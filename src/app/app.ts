import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Toast } from "./shared/components/toast/toast";
import { Footer } from "./shared/components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto');
  private router = inject(Router);
  // Rutas full-screen sin footer: login, registro y todo el panel admin.
  // Se matchea por segmento para cubrir tambien rutas con parametro
  // (ej. /editar-perfil-administrador/:id).
  private esRutaSinFooter(url: string): boolean {
    const ruta = url.split('?')[0].split('#')[0];
    if (ruta === '/' || ruta === '/login' || ruta === '/registro' || ruta === '/home' || ruta === '/nuevo-turno' || ruta === '/mis-turnos') return true;
    if (ruta.startsWith('/editar-perfil/')) return true;
    if (ruta.startsWith('/modificar-turno-usuario/')) return true;
    if (ruta.startsWith('/editar-perfil-peluquero/')) return true;
    if (ruta === '/home-peluquero') return true;
    if (ruta === '/turnos-peluquero') return true;
    if (ruta === '/clientes-peluquero') return true;
    if (ruta === '/servicios-peluquero') return true;
    if (ruta === '/nuevo-turno-mostrador' || ruta === '/alta-peluquero' || ruta === '/alta-servicio') return true;
    return ruta
      .split('/')
      .some((seg) => seg.endsWith('-admin') || seg.endsWith('-administrador'));
  }

  protected readonly ocultarFooter = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => this.esRutaSinFooter(e.urlAfterRedirects))
    ),
    { initialValue: this.esRutaSinFooter(this.router.url) }
  );
}
