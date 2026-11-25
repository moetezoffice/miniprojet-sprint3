import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Type } from '../models/type.model';
import { Plante } from '../models/plante.model';
import { PlantesService } from '../service/plantes.service';

@Component({
  selector: 'app-recherche-par-type',
  imports: [FormsModule, DatePipe],
  templateUrl: './recherche-par-type.html',
  styleUrl: './recherche-par-type.css',
})
export class RechercheParTypeComponent implements OnInit {
  protected types: Type[] = [];
  protected plantes: Plante[] = [];
  protected idType: number | null = null;
  protected erreur = '';

  private readonly plantesService = inject(PlantesService);

  ngOnInit(): void {
    this.plantesService.chargerTypes().subscribe({
      next: (types) => { this.types = types; },
      error: () => { this.erreur = 'Impossible de charger les types depuis le backend.'; },
    });
  }

  protected onChange(): void {
    if (this.idType === null) {
      this.plantes = [];
      return;
    }

    this.erreur = '';
    this.plantesService.rechercherParType(this.idType).subscribe({
      next: (plantes) => { this.plantes = plantes; },
      error: () => { this.erreur = 'Recherche impossible. Vérifiez le backend.'; },
    });
  }
}
