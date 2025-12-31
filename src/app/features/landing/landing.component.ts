import { Component, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { AuthService } from 'app/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ScrollService } from 'app/services/scroll.service';
import { filter } from 'rxjs';

@Component({
    selector: 'landing',
    templateUrl: './landing.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatButtonModule, MatIconModule]
})
export class LandingComponent {
    router = inject(Router);
    show: boolean = false;
    scrollService = inject(ScrollService);
    authService = inject(AuthService);

    private authUser$ = toObservable(this.authService.user);

    logout$ = this.authUser$.pipe(filter((user) => !user));

    constructor() {
        this.logout$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.router.navigate(['auth/login']);
        });
    }

    login() {
        this.router.navigate(['projects']);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['auth/login']);
    }
    showMenu() {
        this.show = !this.show;
    }

    onScrollTo(id: string) {
        this.scrollService.scrollToElementById(id);
    }

    onService() {
        this.router.navigate(['service']);
    }
    onLearnMore() {
        this.router.navigate(['learn-more']);
    }
}
