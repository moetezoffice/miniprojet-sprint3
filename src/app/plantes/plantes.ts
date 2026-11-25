import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Plante } from '../models/plante.model';
import { PlantesService } from '../service/plantes.service';
import { FormPlante } from '../form-plante/form-plante';

@Component({
  selector: 'app-plantes',
  imports: [DatePipe, FormPlante],
  templateUrl: './plantes.html',
  styleUrl: './plantes.css',
})
export class Plantes implements OnInit {
  protected readonly plantesService = inject(PlantesService);
  protected readonly authService = inject(AuthService);
  protected chargement = true;
  protected erreur = '';
  protected message = '';
  protected planteFormulaire: Plante;
  protected modeAjout = true;

  constructor() {
    this.chargement = this.plantesService.plantes().length === 0;
    this.planteFormulaire = this.nouvellePlante();
  }

  ngOnInit(): void {
    this.chargerPlantes();
  }

  protected chargerPlantes(): void {
    this.chargement = this.plantesService.plantes().length === 0;
    this.erreur = '';
    this.plantesService.charger().subscribe({
      next: () => { this.chargement = false; },
      error: () => {
        this.chargement = false;
        this.erreur = 'Impossible de joindre le serveur. Vérifiez MySQL et le backend.';
      },
    });
  }

  protected supprimerPlante(plante: Plante): void {
    if (!this.authService.isAdmin() || !confirm(`Supprimer ${plante.nom} ?`)) return;
    this.plantesService.supprimer(plante.id).subscribe({
      next: () => { this.message = 'Plante supprimée.'; this.erreur = ''; },
      error: () => { this.erreur = 'Suppression impossible. Vérifiez le backend.'; },
    });
  }

  protected selectionnerPlante(plante: Plante): void {
    this.planteFormulaire = { ...plante, type: { ...plante.type } };
    this.modeAjout = false;
    this.message = '';
    this.erreur = '';
  }

  protected annulerModification(): void {
    this.modeAjout = true;
    this.planteFormulaire = this.nouvellePlante();
    this.erreur = '';
  }

  protected enregistrerPlante(plante: Plante): void {
    const requete = this.modeAjout
      ? this.plantesService.ajouter(plante.nom, plante.prix, plante.dateCreation, plante.type.id)
      : this.plantesService.modifier(plante);

    requete.subscribe({
      next: () => {
        this.message = this.modeAjout ? 'Plante ajoutée.' : 'Plante modifiée.';
        this.erreur = '';
        this.modeAjout = true;
        this.planteFormulaire = this.nouvellePlante();
      },
      error: () => {
        this.erreur = this.modeAjout
          ? 'Ajout impossible. Vérifiez le backend.'
          : 'Modification impossible. Vérifiez le backend.';
        this.message = '';
      },
    });
  }

  private nouvellePlante(): Plante {
    return {
      id: 0,
      nom: '',
      prix: 0,
      dateCreation: new Date().toISOString(),
      type: this.plantesService.listetypes()[0] ?? { id: 1, nom: '' },
    };
  }
}
