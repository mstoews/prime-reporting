import { Component, input } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';

import { Common } from '@syncfusion/ej2-angular-pivotview';
import { IJournalHeader } from 'app/models/journals';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'journal-card',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    NgApexchartsModule,
    MatTableModule,
    MatCardModule,
    MatTableModule
  ],
  template: `
    <mat-card  class="flex-auto m-2  p-2 bg-gray-200 border-gray-500 dark:bg-gray-400 shadow rounded-xl w-full dark:text-gray-100 overflow-hidden hover:cursor-pointer "    >
      <div>Journal : {{ journal().amount }} - {{ journal().type }}</div>
      <div>Description : {{ journal().description }}</div>
      {{ journal().transaction_date }}
      {{ journal().amount }}
      {{ journal().period_year }}
      {{ journal().period }}
      {{ journal().create_date }}
      {{ journal().create_user }}
      {{ journal().party_id }}
      {{ journal().status }}
      {{ journal().booked }}
    </mat-card>
  `,
  styles: ``,
})
export class JournalCardComponent {
  journal = input<any | null>();

  constructor() {
    if (!this.journal() === undefined) {
      console.error('JournalCardComponent: journal input is null');
      return;
    } else {
      console.log('JournalCardComponent: journal input is set');
    }
  }
}
