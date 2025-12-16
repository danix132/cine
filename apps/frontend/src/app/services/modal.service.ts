import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalConfig {
  tipo: 'info' | 'success' | 'warning' | 'error' | 'confirm';
  titulo: string;
  mensaje: string;
  mostrarCancelar?: boolean;
  textoConfirmar?: string;
  textoCancelar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalConfig | null>(null);
  private resultadoSubject = new BehaviorSubject<boolean | null>(null);

  constructor() {}

  mostrarModal(config: ModalConfig): Observable<boolean> {
    this.modalSubject.next(config);
    return new Observable(observer => {
      const subscription = this.resultadoSubject.subscribe(resultado => {
        if (resultado !== null) {
          observer.next(resultado);
          observer.complete();
          this.resultadoSubject.next(null);
        }
      });
      return () => subscription.unsubscribe();
    });
  }

  getModal(): Observable<ModalConfig | null> {
    return this.modalSubject.asObservable();
  }

  confirmar() {
    this.resultadoSubject.next(true);
    this.cerrar();
  }

  cancelar() {
    this.resultadoSubject.next(false);
    this.cerrar();
  }

  cerrar() {
    this.modalSubject.next(null);
  }

  // Métodos de conveniencia
  info(titulo: string, mensaje: string): Observable<boolean> {
    return this.mostrarModal({
      tipo: 'info',
      titulo,
      mensaje,
      mostrarCancelar: false,
      textoConfirmar: 'Aceptar'
    });
  }

  success(titulo: string, mensaje: string): Observable<boolean> {
    return this.mostrarModal({
      tipo: 'success',
      titulo,
      mensaje,
      mostrarCancelar: false,
      textoConfirmar: 'Aceptar'
    });
  }

  error(titulo: string, mensaje: string): Observable<boolean> {
    return this.mostrarModal({
      tipo: 'error',
      titulo,
      mensaje,
      mostrarCancelar: false,
      textoConfirmar: 'Aceptar'
    });
  }

  warning(titulo: string, mensaje: string): Observable<boolean> {
    return this.mostrarModal({
      tipo: 'warning',
      titulo,
      mensaje,
      mostrarCancelar: false,
      textoConfirmar: 'Aceptar'
    });
  }

  confirm(titulo: string, mensaje: string, textoConfirmar: string = 'Confirmar', textoCancelar: string = 'Cancelar'): Observable<boolean> {
    return this.mostrarModal({
      tipo: 'confirm',
      titulo,
      mensaje,
      mostrarCancelar: true,
      textoConfirmar,
      textoCancelar
    });
  }
}
