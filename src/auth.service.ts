import { Injectable, computed, inject, signal } from '@angular/core';
import { from, defer, switchMap, tap, BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  confirmPasswordReset,
  signOut,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { authState , idToken} from 'rxfire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AUTH } from './app.config';

import { ToastrService } from 'ngx-toastr';
import { Credentials } from 'app/model/credentials';

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private auth = inject(AUTH);
  private token: BehaviorSubject<string> = new BehaviorSubject('');
  public  token$: Observable<string> = this.token.asObservable();
  public authState: any;

  // sources
  public user$ = authState(this.auth);
  private toastService = inject(ToastrService);

  // state
  private state = signal<AuthState>({
    user: undefined,
    token: ''
  });

  public user = computed(() => this.state().user);

  check() {
      return of(true);
  }

  // selectors

  constructor() {
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) =>
      this.state.update((state) => ({
        ...state,
        user,
      }))
    );
    idToken(this.auth).subscribe({
      next: (token) => {
        if (token === null || token === undefined) {
          return;
        }
        this.UpdateState(token);
      },
    });
  }

  public updateDisplayname(displayName: string) {
      this.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
        if (user === null || user === undefined) {
            return;
        }
      updateProfile(user, { displayName })
        .then(() => {
          sendEmailVerification(user)
            .then(() => {
                this.toastService.success(`Profile address has been updated to your profile ...`)
            }).catch((error) => {
              this.toastService.error(`Error ... ${error}`);
            });
        }).catch((error) => {
          this.toastService.error(`Error ... ${error}`);
        });
    });
  }

  getCurrentUser():  Observable<string>    {
    var email: string | null = '';
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
        if (user === null || user === undefined) {
            email = '';
        }
        else {
            email = user.email
        }
      });
    return of(email as string);
  }

  UpdateState(token: string) {
    localStorage.setItem('jwt', token);
    this.state().token = token;
    this.token.next(token);
  }


  refreshToken(): Observable<string> {
    idToken(this.auth).subscribe({
      next: (token) => {
            if (token !== null && token !== undefined) {
                this.UpdateState(token);
            }
        },
    });
    return of(this.GetToken());
  }


  unlockSession(credentials: Credentials){
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      ).pipe(
        // get the token
        switchMap((auth) => (<any>auth).user.getIdToken()),
        tap((token) => {
          // save state as well
          this.authState.UpdateState(token);
        })
    ));
  }

  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      ).pipe(
        // get the token
        switchMap((auth) => (<any>auth).user.getIdToken()),
        tap((token) => {
          // save state as well
          this.authState.UpdateState(token);
        })
    ));
  }

  resetPassword(oobCode: string, password: string ){
    return from (  defer(() =>
       confirmPasswordReset(
        this.auth,
        oobCode,
        password
      )
    ).pipe(
      // get the token
      switchMap((auth) => (<any>auth).user.getIdToken()),
      tap((token) => {
        // save state as well
        this.authState.UpdateState(token);
      })
    ));
  }

  logout() {
    signOut(this.auth);
  }

  GetToken() {
    return this.state().token;
  }


  createAccount(credentials: Credentials) {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }
}

