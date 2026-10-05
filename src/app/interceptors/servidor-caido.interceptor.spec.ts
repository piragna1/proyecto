import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { servidorCaidoInterceptor } from './servidor-caido.interceptor';
import { tokenInterceptor } from './token.interceptor';
import { AuthService } from '../auth/services/auth-service';
import { ToastService } from '../shared/services/toast-service';
import { MENSAJE_SIN_BACKEND } from '../shared/utils/errorMessages';

const URL = 'http://localhost:3000/prueba';

describe('servidorCaidoInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let toast: ToastService;
  let avisos: number;

  // Se controla Date.now a mano para no depender de fake timers: el cooldown
  // del servicio se apoya en el reloj.
  const nowReal = Date.now;
  let ahora: number;

  beforeEach(() => {
    ahora = 1_000_000;
    Date.now = () => ahora;
  });

  afterEach(() => {
    Date.now = nowReal;
    localStorage.removeItem('token');
    backend.verify();
  });

  /**
   * Levanta el TestBed con la cadena de interceptores indicada y deja spias
   * caseros sobre el toast (contador) y el router (para no navegar de verdad).
   */
  function configurar(interceptores: ReturnType<typeof withInterceptors>) {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(interceptores), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    toast = TestBed.inject(ToastService);

    avisos = 0;
    const original = toast.mostrarMensaje.bind(toast);
    toast.mostrarMensaje = (mensaje: string, error = false) => {
      avisos++;
      original(mensaje, error);
    };
  }

  /** Dispara una request y la hace fallar con el status dado. */
  function pedirYFallar(status: number): { next: boolean; error: unknown } {
    const estado = { next: false, error: undefined as unknown };
    http.get(URL).subscribe({
      next: () => (estado.next = true),
      error: (e) => (estado.error = e),
    });
    backend.expectOne(URL).error(new ProgressEvent('error'), { status, statusText: 'test' });
    return estado;
  }

  describe('solo', () => {
    beforeEach(() => configurar(withInterceptors([servidorCaidoInterceptor])));

    it('avisa con el toast de conexión cuando no hay respuesta HTTP (status 0)', () => {
      pedirYFallar(0);

      expect(avisos).toBe(1);
      expect(toast.mensaje()).toBe(MENSAJE_SIN_BACKEND);
      expect(toast.esError()).toBe(true);
    });

    it('aborta la petición: el next no corre y el error se propaga', () => {
      const estado = pedirYFallar(0);

      expect(estado.next).toBe(false);
      expect((estado.error as { status: number }).status).toBe(0);
    });

    it('no avisa con un 401, para no pisar el cierre de sesión', () => {
      pedirYFallar(401);
      expect(avisos).toBe(0);
      expect(toast.visible()).toBe(false);
    });

    it('no avisa con errores de negocio (400, 409, 500): los maneja cada componente', () => {
      pedirYFallar(400);
      pedirYFallar(409);
      pedirYFallar(500);
      expect(avisos).toBe(0);
    });

    it('muestra un solo aviso cuando varias requests caen por la misma razón', () => {
      pedirYFallar(0);
      pedirYFallar(0);
      pedirYFallar(0);
      pedirYFallar(0);

      expect(avisos).toBe(1);
    });

    it('vuelve a avisar una vez pasado el cooldown', () => {
      pedirYFallar(0);
      expect(avisos).toBe(1);

      ahora += 3_999; // todavia dentro de la ventana
      pedirYFallar(0);
      expect(avisos).toBe(1);

      ahora += 1; // justo cierra la ventana de 4000 ms
      pedirYFallar(0);
      expect(avisos).toBe(2);
    });

    it('no filtra los errores de negocio a través del toast de conexión', () => {
      pedirYFallar(409);
      pedirYFallar(0);

      // El unico toast debe ser el de conexion, no el de negocio.
      expect(avisos).toBe(1);
      expect(toast.mensaje()).toBe(MENSAJE_SIN_BACKEND);
    });
  });

  describe('junto a tokenInterceptor (cadena real de app.config)', () => {
    let cierres: number;
    let navegaciones: string[];

    beforeEach(() => {
      localStorage.setItem('token', 'token-de-prueba');
      configurar(withInterceptors([tokenInterceptor, servidorCaidoInterceptor]));

      cierres = 0;
      navegaciones = [];
      const auth = TestBed.inject(AuthService);
      const originalCerrar = auth.cerrarSesion.bind(auth);
      auth.cerrarSesion = () => {
        cierres++;
        originalCerrar();
      };
      const router = TestBed.inject(Router);
      const originalNav = router.navigateByUrl.bind(router);
      router.navigateByUrl = (url: string) => {
        navegaciones.push(url);
        return originalNav(url);
      };
    });

    it('un 401 cierra sesión sin mostrar el toast de conexión', () => {
      pedirYFallar(401);

      expect(cierres).toBe(1);
      expect(navegaciones).toContain('/');
      expect(avisos).toBe(0);
    });

    it('un status 0 avisa la caída pero NO cierra sesión ni navegar', () => {
      pedirYFallar(0);

      expect(avisos).toBe(1);
      expect(toast.mensaje()).toBe(MENSAJE_SIN_BACKEND);
      expect(cierres).toBe(0);
      expect(navegaciones).toEqual([]);
    });

    it('un error de negocio no avisa ni cierra sesión', () => {
      pedirYFallar(409);

      expect(avisos).toBe(0);
      expect(cierres).toBe(0);
    });
  });
});