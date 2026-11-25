import { Component } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  template: '<main class="page"><h1>Accès refusé</h1><p>Vous n’êtes pas autorisé à accéder à cette page.</p></main>',
  styles: ['.page { max-width: 900px; margin: 2rem auto; padding: 0 1rem; }'],
})
export class ForbiddenComponent {}
