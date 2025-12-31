import { Injectable, computed, inject, signal } from '@angular/core';
import { from, defer, switchMap, tap, BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, confirmPasswordReset, signOut, updateProfile, sendEmailVerification} from 'firebase/auth';
import { authState , idToken} from 'rxfire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Credentials } from './interfaces/credentials';
import { AUTH } from 'app.config';
import { IUser } from 'app/models/user';
import { ToastrService } from 'ngx-toastr';

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
  public token$: Observable<string> = this.token.asObservable();

  public authState: any;
  public tokenSubject?: Subject<string>;

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
        if (token)
         this.UpdateState(token);
      },
    });
  }

  public updateDisplayname(displayName: string) {
      this.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
        if (!user) {
          this.toastService.error(`No user is currently logged in.`);
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
    var uid: string;
    var rc: string = '';
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
        if (user)
            uid = user.uid;
        if (user && user.email)
            rc = user.email;

      });
    return of(rc);
  }

  UpdateState(token: string) {
    localStorage.setItem('jwt', token);
    this.state().token = token;
    this.token.next(token);
  }


  refreshToken(): Observable<string> {
    idToken(this.auth).subscribe({
      next: (token) => {
        if (token)
        this.UpdateState(token);
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

