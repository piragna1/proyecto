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