import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Plante } from '../models/plante.model';
import { PlantesService } from '../service/plantes.service';
import { SearchFilterPipe } from '../pipes/search-filter.pipe';

@Component({
  selector: 'app-recherche-par-nom',
  imports: [FormsModule, DatePipe, SearchFilterPipe],
  templateUrl: './recherche-par-nom.html',
  styleUrl: './recherche-par-nom.css',
})
export class RechercheParNomComponent implements OnInit {
  protected nomRecherche = '';
  protected searchTerm = '';
  protected filtreKeyup = '';
  protected toutesLesPlantes: Plante[];
  protected resultatsApi: Plante[];
  protected resultatsKeyup: Plante[];
  protected erreur = '';

  private readonly plantesService = inject(PlantesService);

  constructor() {
    this.toutesLesPlantes = this.plantesService.plantes();
    this.resultatsApi = this.toutesLesPlantes;
    this.resultatsKeyup = this.toutesLesPlantes;
  }

  ngOnInit(): void {
    this.plantesService.charger().subscribe({
      next: (plantes) => {
        this.toutesLesPlantes = plantes;
        this.resultatsApi = plantes;
        this.resultatsKeyup = plantes;
      },
      error: () => { this.erreur = 'Impossible de charger les plantes depuis le backend.'; },
    });
  }

  protected rechercherPlantes(): void {
    this.plantesService.rechercherParNom(this.nomRecherche).subscribe((plantes) => {
      this.resultatsApi = plantes;
    });
  }

  protected onKeyUp(texte: string): void {
    this.filtreKeyup = texte.trim().toLocaleLowerCase();
    this.resultatsKeyup = this.toutesLesPlantes.filter((plante) =>
      plante.nom.toLocaleLowerCase().includes(this.filtreKeyup),
    );
  }
}
