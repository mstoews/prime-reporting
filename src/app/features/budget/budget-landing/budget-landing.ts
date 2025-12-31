import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { Component, HostListener, OnInit, effect, inject, signal } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from 'app/services/auth.service';
import { BudgetPieGraph } from './budget-pie';
import { FIRESTORE } from 'app/app.config';
import { MatTableModule } from '@angular/material/table';
import { ProjectService } from 'app/features/admin/dashboard/project.service';
import { ResizingEventArgs } from '@syncfusion/ej2-layouts';
import { Router } from '@angular/router';

const imports = [

    NgApexchartsModule,

    MatTableModule,
    MatCardModule,
    CommonModule,
    BudgetPieGraph,
    // ExpenseComponent
]

@Component({
    selector: 'budget-landing',
    imports: [imports],
    template: `
     <div class="flex flex-col flex-auto min-w-0">
        <div class="bg-card">
                <div class="flex flex-col w-full max-w-7xl mx-auto px-6 sm:px-8">
                <div class="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-8 sm:my-12">
                    <!-- Avatar and name -->
                    <div class="flex flex-auto items-center min-w-0">
                        <div class="flex flex-col min-w-0 ml-4">
                            <div>
                                <div class="text-3xl font-semibold tracking-tight leading-8">Summary of Budget and Yearly Forecasts</div>
                            </div>
                        </div>
                    </div>
                    <!-- Actions -->
                    <div class="flex items-center mt-6 sm:mt-0 sm:ml-2 space-x-3">
                        <button (click)="openForecasts()" mat-flat-button >
                            <span class="e-icons e-table-insert-column"></span>
                            <span class="ml-2">Forecasts</span>

                        </button>
                        <button (click)="openBudgetAdj()" mat-flat-button>
                            <span class="e-icons e-file-new"></span>
                            <span class="ml-2">Budget Adjustments</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-4 mt-2">
                <div class="flex flex-col items-center bg-slate-200 dark:bg-slate-800 p-4">
                    <div>
                        <budget-pie/>
                    </div>
                </div>
            </div>
        </div>
     </div> `,

})
export class BudgetLanding implements OnInit {

    public gridHeight: number;
    public isVisible = true;
    private GRID_HEIGHT_ADJ = 660;
    adjustHeight() {
        this.gridHeight = (window.innerHeight - this.GRID_HEIGHT_ADJ)
    }

    openBudgetAdj() {
        throw new Error('Method not implemented.');
    }
    openForecasts() {
        throw new Error('Method not implemented.');
    }
    data: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    authService = inject(AuthService);
    private _router = inject(Router);
    private _projectService = inject(ProjectService);
    firestore = inject(FIRESTORE);

    constructor() {
        effect(() => {
            if (!this.authService.user()) {
                this._router.navigate(['auth/login']);
            }
        });
    }

    openTasks() {
        this._router.navigate(['kanban']).then();
    }

    openTransactions() {
        this._router.navigate(['journals']);
    }

    ngOnInit(): void {
        // Get the data

    }


    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        const width = window.innerWidth;
        if (width < 768) {
            this.isVisible = false;
        }
        else {
            this.isVisible = true;
        }

        this.adjustHeight();
    }


}
