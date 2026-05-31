import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  username = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  login() {
    this.error.set('');
    this.loading.set(true);

    this.auth.login({
      username: this.username.trim(),
      password: this.password,
    }).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/productos';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.error.set('Usuario o contraseña inválidos');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
