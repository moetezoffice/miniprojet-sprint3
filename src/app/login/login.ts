import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  protected user: Pick<User, 'username' | 'password'> = { username: '', password: '' };
  protected erreur = false;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected onLoggedin(): void {
    this.erreur = false;
    this.authService.signIn(this.user).subscribe({
      next: () => { void this.router.navigate(['/plantes']); },
      error: () => { this.erreur = true; },
    });
  }
}
