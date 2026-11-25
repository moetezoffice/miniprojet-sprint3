import { Routes } from '@angular/router';
import { AddPlante } from './add-plante/add-plante';
import { EditPlante } from './edit-plante/edit-plante';
import { authGuard, adminGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login';
import { ForbiddenComponent } from './forbidden/forbidden';
import { Plantes } from './plantes/plantes';
import { RechercheParNomComponent } from './recherche-par-nom/recherche-par-nom';
import { RechercheParTypeComponent } from './recherche-par-type/recherche-par-type';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'plantes', component: Plantes, canActivate: [authGuard] },
  { path: 'rechercheParNom', component: RechercheParNomComponent, canActivate: [authGuard] },
  { path: 'rechercheParType', component: RechercheParTypeComponent, canActivate: [authGuard] },
  { path: 'add-plante', component: AddPlante, canActivate: [adminGuard] },
  { path: 'edit-plante/:id', component: EditPlante, canActivate: [adminGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
