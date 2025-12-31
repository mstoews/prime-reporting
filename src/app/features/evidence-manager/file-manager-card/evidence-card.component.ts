import { Component, OnInit, inject, input, output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { IArtifacts } from 'app/models/journals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Router } from '@angular/router';

const imports = [
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatDividerModule,
  NgApexchartsModule,
  MatTableModule,
  MatCardModule,

];

@Component({
  selector: 'evidence-card',
  imports: [imports],
  template: `
    <mat-card class="hover:cursor-pointer" onclick="">
      <a class="group border-zinc-100 m-1">
        <span class="flex-1"></span>
        <div>
          <div
            class="w-full pt-1 h-10 text-center justify-center rounded-md text-lg font-medium text-gray-100 bg-gray-500"
          >
            Journal ID : {{ evidence().journal_id }}
          </div>
          <div class="flex-row">
            <div class="flex items-center justify-center m-1 w-1/2"></div>
            <img
              (click)="openEvidenceDetail()"
              [src]="evidence().location"
              onerror="src='images/logo/document.svg';"
              width="200"
              height="200"
              class="block object-cover object-center w-full h-50 rounded-lg"
              alt="XL"
            />
          </div>
          <div class="mt-1 text-md font-medium dark:text-gray-100 text-gray-700">
            {{ evidence().description }}
          </div>
          <div class="mt-1 text-md font-medium dark:text-gray-100 text-gray-700">
            {{ evidence().reference }}
          </div>
        </div>
      </a>
    </mat-card>
  `,
})
export class EvidenceCardComponent implements OnInit {
  readonly evidence = input<IArtifacts>(undefined);

  update = output<number>();

  loggedIn: boolean = false;
  productId: string;
  sub: Subscription;
  isLoggedIn$: Observable<boolean>;

  private router = inject(Router);
  ngOnInit(): void {
    console.log('Evidence id: ', this.evidence().id);
  }

  openEvidenceDetail() {
    // this.router.navigate(['artifacts/evidence', this.evidence.id]);
    this.update.emit(this.evidence().id);
  }
}
