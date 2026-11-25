import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Plante } from '../models/plante.model';
import { Type } from '../models/type.model';
import { PlantesService } from '../service/plantes.service';

@Component({
  selector: 'app-form-plante',
  imports: [FormsModule],
  templateUrl: './form-plante.html',
})
export class FormPlante implements OnChanges, OnInit {
  @Input({ required: true }) plante!: Plante;
  @Input() ajout = true;
  @Output() planteSaved = new EventEmitter<Plante>();

  protected types: Type[] = [];
  protected nom = '';
  protected prix: number | null = null;
  protected dateCreation = '';
  protected typeId = 1;
  protected erreurTypes = '';

  private readonly plantesService = inject(PlantesService);

  constructor() {
    this.types = this.plantesService.listetypes();
  }

  ngOnInit(): void {
    this.plantesService.chargerTypes().subscribe({
      next: (types) => { this.types = types; this.erreurTypes = ''; },
      error: () => { this.erreurTypes = 'Impossible de charger les types depuis le backend.'; },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['plante'] || !this.plante) return;

    this.nom = this.plante.nom;
    this.prix = this.plante.prix;
    this.dateCreation = this.plante.dateCreation.slice(0, 10);
    this.typeId = this.plante.type.id;
  }

  protected sauvegarder(): void {
    if (!this.types.length || !this.nom.trim() || this.prix === null || this.prix < 0 || !this.dateCreation) return;

    const type = this.types.find((element) => element.id === Number(this.typeId));
    if (!type) return;
    this.planteSaved.emit({
      ...this.plante,
      nom: this.nom.trim(),
      prix: this.prix,
      dateCreation: `${this.dateCreation}T00:00:00.000Z`,
      type,
    });
  }
}
