import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, ModalConfig } from '../../../../services/modal.service';

@Component({
  selector: 'app-modal-global',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="modalConfig" class="modal-overlay-global" (click)="cancelar()">
      <div class="modal-content-global" 
           [ngClass]="'modal-' + modalConfig.tipo"
           (click)="$event.stopPropagation()">
        
        <div class="modal-header-global" [ngClass]="'header-' + modalConfig.tipo">
          <div class="modal-icon">
            <i class="fas" [ngClass]="{
              'fa-info-circle': modalConfig.tipo === 'info',
              'fa-check-circle': modalConfig.tipo === 'success',
              'fa-exclamation-triangle': modalConfig.tipo === 'warning',
              'fa-times-circle': modalConfig.tipo === 'error',
              'fa-question-circle': modalConfig.tipo === 'confirm'
            }"></i>
          </div>
          <h2>{{ modalConfig.titulo }}</h2>
          <button class="btn-close-modal" (click)="cancelar()" title="Cerrar">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body-global">
          <p [innerHTML]="formatearMensaje(modalConfig.mensaje)"></p>
        </div>

        <div class="modal-footer-global">
          <button 
            *ngIf="modalConfig.mostrarCancelar" 
            class="btn btn-secondary-modal" 
            (click)="cancelar()">
            {{ modalConfig.textoCancelar || 'Cancelar' }}
          </button>
          <button 
            class="btn" 
            [ngClass]="{
              'btn-primary-modal': modalConfig.tipo === 'info' || modalConfig.tipo === 'confirm',
              'btn-success-modal': modalConfig.tipo === 'success',
              'btn-warning-modal': modalConfig.tipo === 'warning',
              'btn-danger-modal': modalConfig.tipo === 'error'
            }"
            (click)="confirmar()">
            {{ modalConfig.textoConfirmar || 'Aceptar' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay-global {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      -webkit-backdrop-filter: blur(3px);
      backdrop-filter: blur(3px);
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content-global {
      background: white;
      border-radius: 15px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(50px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header-global {
      padding: 25px;
      display: flex;
      align-items: center;
      gap: 15px;
      color: white;
      position: relative;

      &.header-info {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.header-success {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      }

      &.header-warning {
        background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
      }

      &.header-error {
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      }

      &.header-confirm {
        background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
      }

      .modal-icon {
        font-size: 2.5rem;
        flex-shrink: 0;
      }

      h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        flex: 1;
      }

      .btn-close-modal {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: white;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 1rem;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }
      }
    }

    .modal-body-global {
      padding: 30px 25px;
      font-size: 1.05rem;
      line-height: 1.6;
      color: #333;
      max-height: 400px;
      overflow-y: auto;

      p {
        margin: 0;
        white-space: pre-line;
      }
    }

    .modal-footer-global {
      padding: 20px 25px;
      border-top: 2px solid #e9ecef;
      background: #f8f9fa;
      display: flex;
      gap: 15px;
      justify-content: flex-end;

      .btn {
        padding: 12px 25px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
        border: none;
        display: flex;
        align-items: center;
        gap: 8px;

        &.btn-secondary-modal {
          background: #6c757d;
          color: white;

          &:hover {
            background: #5a6268;
            transform: translateY(-2px);
          }
        }

        &.btn-primary-modal {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }
        }

        &.btn-success-modal {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
          }
        }

        &.btn-warning-modal {
          background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
          color: #856404;
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
          }
        }

        &.btn-danger-modal {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
          }
        }
      }
    }

    @media (max-width: 768px) {
      .modal-content-global {
        width: 95%;
        max-height: 95vh;
      }

      .modal-header-global {
        padding: 20px;

        h2 {
          font-size: 1.2rem;
        }

        .modal-icon {
          font-size: 2rem;
        }
      }

      .modal-body-global {
        padding: 20px;
        font-size: 1rem;
      }

      .modal-footer-global {
        flex-direction: column;

        .btn {
          width: 100%;
          justify-content: center;
        }
      }
    }
  `]
})
export class ModalGlobalComponent implements OnInit {
  modalConfig: ModalConfig | null = null;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.getModal().subscribe((config: ModalConfig | null) => {
      this.modalConfig = config;
    });
  }

  confirmar(): void {
    this.modalService.confirmar();
  }

  cancelar(): void {
    this.modalService.cancelar();
  }

  formatearMensaje(mensaje: string): string {
    // Reemplazar emojis y símbolos comunes para mejor visualización
    return mensaje
      .replace(/\n/g, '<br>')
      .replace(/✅/g, '<i class="fas fa-check-circle" style="color: #28a745;"></i>')
      .replace(/❌/g, '<i class="fas fa-times-circle" style="color: #dc3545;"></i>')
      .replace(/⚠️/g, '<i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i>')
      .replace(/💡/g, '<i class="fas fa-lightbulb" style="color: #ffc107;"></i>')
      .replace(/🔑/g, '<i class="fas fa-key" style="color: #667eea;"></i>')
      .replace(/📊/g, '<i class="fas fa-chart-bar" style="color: #17a2b8;"></i>');
  }
}
