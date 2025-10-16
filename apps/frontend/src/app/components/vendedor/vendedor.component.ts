import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendedor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.scss']
})
export class VendedorComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  venderBoletos(): void {
    this.router.navigate(['/vendedor/boletos']);
  }

  venderDulceria(): void {
    this.router.navigate(['/vendedor/dulceria']);
  }

  validarBoletos(): void {
    this.router.navigate(['/vendedor/validar']);
  }

  validarDulceria(): void {
    this.router.navigate(['/vendedor/validar-dulceria']);
  }

  verMisVentas(): void {
    this.router.navigate(['/vendedor/mis-ventas']);
  }
}
