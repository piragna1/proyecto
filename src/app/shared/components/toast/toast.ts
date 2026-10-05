import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast-service';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (ts.visible()) {
      <div
        class="app-toast"
        [class]="toastClasses()"
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <div class="toast-content">
          <span class="toast-icon" aria-hidden="true">{{ icon() }}</span>
          <span class="toast-message">{{ ts.mensaje() }}</span>
        </div>
        <button
          class="toast-close"
          (click)="ts.cerrar()"
          aria-label="Cerrar notificación"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    }
  `,
  styles: [`
    .app-toast {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      background: rgba(20, 20, 30, 0.95);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: #fff;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow:
        0 20px 40px -10px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.05) inset;
      animation: toastIn 300ms ease-out;
      max-width: 360px;
      min-width: 280px;
      z-index: 1000;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .app-toast.toast-out {
      animation: toastOut 300ms ease-in forwards;
    }

    .toast-content {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      flex: 1;
      min-width: 0;
    }

    .toast-icon {
      flex-shrink: 0;
      font-size: 1.25rem;
      line-height: 1;
      margin-top: 0.125rem;
    }

    .toast-message {
      font-size: 0.9375rem;
      line-height: 1.5;
      word-break: break-word;
    }

    .toast-close {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      color: inherit;
      opacity: 0.5;
      border-radius: 8px;
      cursor: pointer;
      transition: opacity 0.15s ease, background 0.15s ease;
      margin-top: -0.25rem;
    }
    .toast-close:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }
    .toast-close:focus-visible {
      outline: 3px solid rgba(192, 132, 252, 0.5);
      outline-offset: 2px;
    }

    /* Type variants */
    .app-toast.toast-success {
      border-left: 4px solid #22c55e;
    }
    .app-toast.toast-success .toast-icon { color: #22c55e; }

    .app-toast.toast-warning {
      border-left: 4px solid #eab308;
    }
    .app-toast.toast-warning .toast-icon { color: #eab308; }

    .app-toast.toast-error {
      border-left: 4px solid #ef4444;
    }
    .app-toast.toast-error .toast-icon { color: #ef4444; }

    .app-toast.toast-info {
      border-left: 4px solid #c084fc;
    }
    .app-toast.toast-info .toast-icon { color: #c084fc; }

    @keyframes toastIn {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes toastOut {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
      }
    }

    @media (max-width: 480px) {
      .app-toast {
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        max-width: none;
        min-width: 0;
      }
    }
  `]
})
export class Toast {
  ts = inject(ToastService);

  icon = computed(() => {
    switch (this.ts.tipo()) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✕';
      default: return 'ℹ';
    }
  });

  toastClasses = computed(() => {
    const tipo = this.ts.tipo();
    const base = 'app-toast';
    const typeClass = tipo !== 'info' ? `toast-${tipo}` : '';
    const outClass = this.ts.ocultando() ? 'toast-out' : '';
    return `${base} ${typeClass} ${outClass}`.trim();
  });
}