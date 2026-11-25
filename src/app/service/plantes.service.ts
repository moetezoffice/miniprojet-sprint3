import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, map, of, shareReplay, tap } from 'rxjs';
import { Plante } from '../models/plante.model';
import { Type } from '../models/type.model';
import { TypeWrapper } from '../models/type-wrapper.model';

interface PlantePayload {
  nom: string;
  prix: number;
  dateCreation: string;
  typeId: number;
}

@Injectable({ providedIn: 'root' })
export class PlantesService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = 'http://localhost:8090/produits';
  private chargementEnCours?: Observable<Plante[]>;
  private chargementTypesEnCours?: Observable<Type[]>;
  private dernierChargement = 0;
  readonly plantes = signal<Plante[]>([]);
  readonly types = signal<Type[]>([]);

  charger(): Observable<Plante[]> {
    if (this.plantes().length > 0 && Date.now() - this.dernierChargement < 15_000) {
      return of(this.plantes());
    }
    if (this.chargementEnCours) return this.chargementEnCours;

    const request = this.http.get<Plante[]>(`${this.apiBase}/api`).pipe(
      tap((plantes) => {
        this.plantes.set(plantes);
        this.dernierChargement = Date.now();
      }),
      finalize(() => { this.chargementEnCours = undefined; }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.chargementEnCours = request;
    return request;
  }

  chargerTypes(): Observable<Type[]> {
    if (this.types().length > 0) return of(this.types());
    if (this.chargementTypesEnCours) return this.chargementTypesEnCours;

    const request = this.http.get<TypeWrapper>(`${this.apiBase}/types`, { params: { size: 100 } }).pipe(
      map((response) => response._embedded?.types ?? []),
      tap((types) => this.types.set(types)),
      finalize(() => { this.chargementTypesEnCours = undefined; }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.chargementTypesEnCours = request;
    return request;
  }

  listetypes(): Type[] {
    return this.types();
  }

  rechercherParType(idType: number): Observable<Plante[]> {
    return this.http.get<Plante[]>(`${this.apiBase}/api/prodscat/${idType}`);
  }

  rechercherParNom(nom: string): Observable<Plante[]> {
    return this.http.get<Plante[]>(`${this.apiBase}/api/rechercheParNom`, { params: { nom: nom.trim() } });
  }

  ajouter(nom: string, prix: number, dateCreation = new Date().toISOString(), typeId = 1): Observable<Plante> {
    return this.http.post<Plante>(`${this.apiBase}/api`, {
      nom: nom.trim(),
      prix,
      dateCreation: this.dateApi(dateCreation),
      typeId,
    } satisfies PlantePayload).pipe(
      tap((plante) => this.plantes.update((plantes) => [...plantes, plante])),
      tap(() => { this.dernierChargement = Date.now(); }),
    );
  }

  modifier(plante: Plante): Observable<Plante> {
    return this.http.put<Plante>(`${this.apiBase}/api/${plante.id}`, {
      nom: plante.nom.trim(),
      prix: plante.prix,
      dateCreation: this.dateApi(plante.dateCreation),
      typeId: plante.type.id,
    } satisfies PlantePayload).pipe(
      tap((updated) => this.plantes.update((plantes) =>
        plantes.map((element) => element.id === updated.id ? updated : element),
      )),
      tap(() => { this.dernierChargement = Date.now(); }),
    );
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/api/${id}`).pipe(
      tap(() => this.plantes.update((plantes) => plantes.filter((plante) => plante.id !== id))),
      tap(() => { this.dernierChargement = Date.now(); }),
    );
  }

  consulter(id: number): Observable<Plante> {
    return this.http.get<Plante>(`${this.apiBase}/api/${id}`);
  }

  private dateApi(dateCreation: string): string {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateCreation)
      ? `${dateCreation}T00:00:00.000Z`
      : dateCreation;
  }
}
