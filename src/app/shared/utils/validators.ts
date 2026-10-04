import { AbstractControl, ValidationErrors } from '@angular/forms';

const MAX_EMAIL_LENGTH = 255;
const MAX_LOCAL_LENGTH = 64;
const MAX_DOMAIN_LENGTH = 253;

const LOCAL_ATEXT = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+$/;
const DOMAIN_LABEL = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const TLD = /^[A-Za-z]{2,63}$/;
const TELEFONO_REGEX = /^\+?549\d{10}$|^\d{10}$/;

export function emailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string | null | undefined;
    if (!value || value.trim() === '') return null;

    const email = value.trim();
    if (email.length > MAX_EMAIL_LENGTH) return { email: true };

    const arroba = email.lastIndexOf('@');
    if (arroba < 1 || arroba === email.length - 1) return { email: true };

    const local = email.slice(0, arroba);
    const dominio = email.slice(arroba + 1);

    if (local.length > MAX_LOCAL_LENGTH) return { email: true };
    if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return { email: true };
    if (!LOCAL_ATEXT.test(local.replace(/\./g, ''))) return { email: true };

    if (dominio.length > MAX_DOMAIN_LENGTH) return { email: true };
    if (dominio.startsWith('.') || dominio.endsWith('.') || dominio.includes('..')) return { email: true };

    const etiquetas = dominio.split('.');
    if (etiquetas.length < 2) return { email: true };

    const tld = etiquetas[etiquetas.length - 1];
    if (!TLD.test(tld)) return { email: true };

    for (let i = 0; i < etiquetas.length - 1; i++) {
        if (!DOMAIN_LABEL.test(etiquetas[i])) return { email: true };
    }

    return null;
}

export function telefonoValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string | null | undefined;
    if (!value || value.trim() === '') return null;
    return TELEFONO_REGEX.test(value.trim()) ? null : { telefono: true };
}

export const MIN_LENGTH_CLAVE = 10;
export const MAX_LENGTH_CLAVE = 255;

// Reglas de formato de clave.
// DEBE COINCIDIR con backend/controllers/usuariosController.js (paquetes separados, no se puede compartir codigo).
// Ojo: la flag /u es obligatoria. Sin ella \p{Ll} no lanza error, compila como texto literal y la regla deja de funcionar.
const REQUISITOS_CLAVE = [
    { etiqueta: 'una minúscula', test: /\p{Ll}/u },
    { etiqueta: 'una mayúscula', test: /\p{Lu}/u },
    { etiqueta: 'un número', test: /\p{Nd}/u },
    { etiqueta: 'un símbolo', test: /[^\p{L}\p{N}\s]/u },
];

function requisitosFaltantes(valor: unknown): string[] {
    const clave = typeof valor === 'string' ? valor : '';
    return REQUISITOS_CLAVE
        .filter((requisito) => !requisito.test.test(clave))
        .map((requisito) => requisito.etiqueta);
}

export interface RequisitoClave {
    etiqueta: string;
    cumple: boolean;
}

export function evaluarRequisitosClave(valor: unknown): RequisitoClave[] {
    const clave = typeof valor === 'string' ? valor.trim() : '';
    return [
        { etiqueta: `Al menos ${MIN_LENGTH_CLAVE} caracteres`, cumple: clave.length >= MIN_LENGTH_CLAVE },
        ...REQUISITOS_CLAVE.map((requisito) => ({ etiqueta: requisito.etiqueta, cumple: requisito.test.test(clave) })),
    ];
}

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (typeof valor !== 'string' || valor.trim() === '') return null;

    const clave = valor.trim();
    const faltantes = requisitosFaltantes(clave);
    if (clave.length < MIN_LENGTH_CLAVE || faltantes.length > 0) {
        return { requisitosClaveFaltantes: { faltantes } };
    }

    return null;
}

export function mensajeClave(control: AbstractControl): string {
    if (!control.invalid) return '';
    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('maxlength')) return `Debe tener como máximo ${MAX_LENGTH_CLAVE} caracteres`;

    const valor = control.value;
    if (typeof valor !== 'string' || valor.trim() === '') return '';

    const clave = valor.trim();
    const partes: string[] = [];

    if (clave.length < MIN_LENGTH_CLAVE) {
        partes.push(`Debe tener al menos ${MIN_LENGTH_CLAVE} caracteres`);
    }

    const faltantes = requisitosFaltantes(clave);
    if (faltantes.length === 1) {
        partes.push(`Falta: ${faltantes[0]}`);
    } else if (faltantes.length > 1) {
        partes.push(`Faltan: ${faltantes.join(', ')}`);
    }

    return partes.length > 0 ? `${partes.join('. ')}.` : '';
}

export type CampoValidado = 'nombre' | 'email' | 'telefono' | 'clave' | 'direccion';

export function mensajeCampo(control: AbstractControl, campo: CampoValidado): string {
    if (!control.invalid) return '';
    if (campo === 'clave') return mensajeClave(control);
    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('email')) return 'El email no es válido';
    if (control.hasError('telefono')) return 'El teléfono debe ser un número de Argentina (ej. +549223XXXXXXX o 223XXXXXXX)';
    if (control.hasError('minlength')) {
        const requeridos = control.getError('minlength')?.requiredLength as number | undefined;
        return `Debe tener al menos ${requeridos ?? 0} caracteres`;
    }
    if (control.hasError('maxlength')) {
        const maximos = control.getError('maxlength')?.requiredLength as number | undefined;
        return `Debe tener como máximo ${maximos ?? 0} caracteres`;
    }
    return '';
}