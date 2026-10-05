import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'brand' | 'amber' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="classes()"
      [disabled]="disabled()"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Variants - Dark Theme */
    .btn-primary {
      background: linear-gradient(135deg, #aa3bff 0%, #8b2de0 100%);
      color: #fff;
      box-shadow: 0 4px 14px rgba(170, 59, 255, 0.3);
    }
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #b85cff 0%, #9b3dff 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(170, 59, 255, 0.4);
    }

    .btn-brand {
      background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
      color: #fff;
      box-shadow: 0 4px 14px rgba(24, 40, 72, 0.4);
    }
    .btn-brand:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(24, 40, 72, 0.5);
    }

    .btn-amber {
      background: linear-gradient(135deg, #eaa93e 0%, #b45309 100%);
      color: #1d1206;
      box-shadow: 0 4px 14px rgba(232, 163, 61, 0.35);
    }
    .btn-amber:hover:not(:disabled) {
      background: linear-gradient(135deg, #f5bc55 0%, #c2660a 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(232, 163, 61, 0.45);
    }

    .btn-secondary {
      background: transparent;
      color: #c084fc;
      border: 1px solid rgba(192, 132, 252, 0.5);
    }
    .btn-secondary:hover:not(:disabled) {
      background: rgba(192, 132, 252, 0.15);
      border-color: #c084fc;
    }

    .btn-ghost {
      background: transparent;
      color: rgba(255, 255, 255, 0.85);
      border: 1px solid transparent;
    }
    .btn-ghost:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
    }

    .btn-danger {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: #fff;
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
    }
    .btn-danger:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
    }

    /* Sizes */
    .btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
    .btn-md { padding: 0.75rem 1.5rem; font-size: 1rem; }
    .btn-lg { padding: 1rem 2rem; font-size: 1.125rem; }

    /* Focus visible for accessibility */
    .btn:focus-visible {
      outline: 3px solid rgba(192, 132, 252, 0.5);
      outline-offset: 2px;
    }
    .btn-amber:focus-visible {
      outline-color: rgba(234, 169, 62, 0.55);
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = signal(false);
  @Output() onClick = new EventEmitter<MouseEvent>();

  classes = computed(() => {
    const base = 'btn';
    const variantClass = `btn-${this.variant}`;
    const sizeClass = `btn-${this.size}`;
    return `${base} ${variantClass} ${sizeClass}`;
  });
}