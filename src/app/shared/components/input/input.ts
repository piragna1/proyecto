import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, AbstractControl, FormControl } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'datetime-local';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-wrapper" [style.--input-accent]="accent">
      <label *ngIf="label" [for]="id" class="input-label">{{ label }}</label>
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [class]="inputClasses()"
        [disabled]="disabled"
        [readonly]="readonly"
        [required]="required"
        [aria-invalid]="hasError"
        [aria-describedby]="error ? errorId : (hint ? hintId : null)"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [formControl]="formControl"
      />
      <p *ngIf="error" [id]="errorId" class="input-error" role="alert">{{ error }}</p>
      <p *ngIf="!error && hint" [id]="hintId" class="input-hint">{{ hint }}</p>
    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }

    .input-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }

    .input-field {
      width: 100%;
      padding: 0.875rem 1rem;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
      font-family: inherit;
      font-size: 1rem;
      line-height: 1.5;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
    }

    .input-field::placeholder {
      color: rgba(255, 255, 255, 0.45);
    }

    .input-field:focus {
      outline: none;
      border-color: var(--input-accent, #c084fc);
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--input-accent, #c084fc) 25%, transparent);
    }

    .input-field:hover:not(:focus):not(:disabled) {
      border-color: rgba(255, 255, 255, 0.25);
    }

    .input-field:disabled {
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.4);
      cursor: not-allowed;
    }

    .input-field.invalid {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
    }
    .input-field.invalid:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
    }

    .input-error {
      margin: 0;
      font-size: 0.75rem;
      color: #fca5a5;
    }

    .input-hint {
      margin: 0;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 480px) {
      .input-field { padding: 0.75rem 0.875rem; font-size: 1rem; }
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = `input-${Math.random().toString(36).slice(2, 9)}`;
  @Input() label = '';
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() error = '';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() control?: AbstractControl;
  // Color de acento para el foco. Por defecto el violeta actual;
  // el login lo usa en ambar (#e8a33d).
  @Input() accent = '#c084fc';

  value = '';
  private _onChange = (value: string) => {};
  private _onTouched = () => {};

  errorId = `${this.id}-error`;
  hintId = `${this.id}-hint`;

  get hasError(): boolean { return !!this.error; }

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  inputClasses = () => {
    const base = 'input-field';
    const invalid = this.error ? 'invalid' : '';
    return `${base} ${invalid}`.trim();
  };

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this._onChange(this.value);
  }

  onTouched(): void {
    this._onTouched();
  }

  writeValue(value: string): void {
    this.value = value ?? '';
    if (this.control) {
      this.control.setValue(value ?? '', { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}