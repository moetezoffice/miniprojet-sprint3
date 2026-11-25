import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Plante } from '../models/plante.model';
import { Type } from '../models/type.model';
import { PlantesService } from '../service/plantes.service';

@Component({
  selector: 'app-edit-plante',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-plante.html',
  styleUrl: './edit-plante.css',
})
export class EditPlante implements OnInit {
  protected plante?: Plante;
  protected nom = '';
  protected prix: number | null = null;
  protected dateCreation = '';
  protected types: Type[] = [];
  protected typeId = 1;
  protected chargement = true;
  protected erreur = '';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly plantesService = inject(PlantesService);

  ngOnInit(): void {
    this.plantesService.chargerTypes().subscribe({
      next: (types) => { this.types = types; },
      error: () => { this.erreur = 'Impossible de charger les types depuis le backend.'; },
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id < 1) {
      void this.router.navigate(['/plantes']);
      return;
    }

    const planteEnCache = this.plantesService.plantes().find((plante) => plante.id === id);
    if (planteEnCache) {
      this.afficherPlante(planteEnCache);
      this.chargement = false;
    }

    this.plantesService.consulter(id).subscribe({
      next: (plante) => { this.afficherPlante(plante); this.chargement = false; },
      error: () => {
        this.chargement = false;
        this.erreur = 'Consultation impossible. Vérifiez le backend.';
      },
    });
  }

  protected modifierPlante(): void {
    if (!this.plante || !this.types.length || !this.nom.trim() || this.prix === null || this.prix < 0 || !this.dateCreation) return;
    const type = this.types.find((element) => element.id === Number(this.typeId));
    if (!type) return;
    const planteModifiee: Plante = {
      ...this.plante,
      nom: this.nom.trim(),
      prix: this.prix,
      dateCreation: `${this.dateCreation}T00:00:00.000Z`,
      type,
    };

    this.plantesService.modifier(planteModifiee).subscribe({
      next: () => { void this.router.navigate(['/plantes']); },
      error: () => { this.erreur = 'Modification impossible. Vérifiez le backend.'; },
    });
  }

  private afficherPlante(plante: Plante): void {
    this.plante = plante;
    this.nom = plante.nom;
    this.prix = plante.prix;
    this.dateCreation = plante.dateCreation.slice(0, 10);
    this.typeId = plante.type.id;
  }
}
