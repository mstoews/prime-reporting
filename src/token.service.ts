import { Injectable, inject } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable()
export class TokenService {
  auth = inject(AuthService)
  private token!: string

  constructor() {
    this.getToken();
  }

  async getRefreshToken(): Promise<string> {
    var token = await this.auth.user()?.getIdToken()
    if (token === null || token === undefined) {
        return '';
    }
    localStorage.setItem('token', token);
    this.token = token;
    return this.token;
  }

  async getToken(): Promise<string> {
    if (this.token !== undefined && this.token !== '') {
        return this.token;
    }
    else {

    var token = await this.auth.user()?.getIdToken()
        this.token = token as string;
        localStorage.setItem('token', this.token);
        return this.token;
    }
  }

}
