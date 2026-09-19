import { AbstractControl, ValidationErrors } from '@angular/forms';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string | null | undefined;
    if (!value || value.trim() === '') return null;
    return EMAIL_REGEX.test(value) ? null : { email: true };
}