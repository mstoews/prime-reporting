import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  inject,
  viewChild,
} from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';

import { ActiveComponent } from './active/active.component';
import { AppService } from '../../store/main.panel.store';
import { ApplicationStore } from '../../store/application.store';
import { BalanceSheetActiveReport } from './active/active_balance_sheet';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DistributionListing } from './active/distribution_listing';
import { ExpenseRptComponent } from './expense/expense-rpt.component';
import { FuseMediaWatcherService } from 'app/services/media-watcher/media-watcher.service';
import { GridTemplateComponent } from './grid-template/grid-template.component';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { TbGridComponent } from './tb-grid/tb-pivot-table.component';
import { TbPivotComponent } from './tb-grid/tb-pivot.component';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';

const mods = [
  NgClass,
  TrialBalanceComponent,
  BalanceSheetActiveReport,
  ExpenseRptComponent,
  TbGridComponent,
  GridTemplateComponent,
  TbPivotComponent,
  CdkScrollable,
  DistributionListing,
  MatSidenavModule,
  MatIconModule,
];

@Component({
  selector: 'transaction-main',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col w-full min-w-0 sm:absolute sm:inset-0 sm:overflow-x-hidden">
      <mat-drawer-container class="flex-auto sm:h-full bg-gray-100 dark:bg-gray-900" cdkScrollable>
        <!-- Drawer -->
        @if(store.panels().length > 0) {
        <mat-drawer
          #drawer
          class="sm:w-72 dark:bg-gray-900"
          [autoFocus]="false"
          [mode]="drawerMode"
          [opened]="drawerOpened"
        >
          <!-- Header -->
          <div class="flex items-center justify-between m-8 mr-6 sm:my-10">
            <!-- Title -->
            <div class="text-4xl font-extrabold tracking-tight leading-none text-primary">
              Reporting
            </div>
            <!-- Close button -->
          </div>
          <!-- Panel links -->
          <div class="flex flex-col divide-y border-t border-b">
            @for (panel of panels; track trackByFn($index, panel)) {
            <div
              class="flex px-8 py-5 cursor-pointer"
              [ngClass]="{
                'hover:bg-gray-100 dark:hover:bg-hover':
                  !selectedPanel || selectedPanel !== panel.id,
                'bg-primary-50 dark:bg-hover': selectedPanel && selectedPanel === panel.id
              }"
              (click)="goToPanel(panel.id)"
            >
              <mat-icon
                [ngClass]="{
                  'text-hint': !selectedPanel || selectedPanel !== panel.id,
                  'text-primary dark:text-primary': selectedPanel && selectedPanel === panel.id
                }"
                [svgIcon]="panel.icon"
              ></mat-icon>
              <div class="ml-3">
                <div
                  class="font-medium leading-6"
                  [ngClass]="{
                    'text-primary dark:text-primary': selectedPanel && selectedPanel === panel.id
                  }"
                >
                  {{ panel.title }}
                </div>
                <div class="mt-0.5 text-secondary">
                  {{ panel.description }}
                </div>
              </div>
            </div>
            }
          </div>
        </mat-drawer>
        }
        <mat-drawer-content
          class="flex flex-col overflow-x-hidden bg-gray-100 dark:bg-gray-900"
          cdkScrollable
        >
          <!-- Main -->
          <div class="flex-auto px-6 pt-9 pb-12 md:p-8 md:pb-12 lg:p-12">
            <!-- Panel header -->
            <div class="flex items-center">
              <!-- Drawer toggle -->
              <button class="lx2:hidden -ml-2" mat-icon-button (click)="drawer().toggle()">
                <mat-icon [svgIcon]="'heroicons_outline:bars-3'"></mat-icon>
              </button>

              <!-- Panel title -->
              <div class="ml-2 lg:ml-0 text-3xl font-bold tracking-tight leading-none text-primary">
                {{ getPanelInfo(selectedPanel).title }}
              </div>
            </div>
            <!-- Load settings panel -->
            <div class="mt-8">
              @switch (selectedPanel){

                @case ('distribution-listing')
                {
              <distribution-listing></distribution-listing> } @case ('balance-sheet-rpt') {
              <balance-sheet-rpt></balance-sheet-rpt> }
              @case ('tb-grid') { <tb-grid></tb-grid> }
              @case ('tb-pivot') { <tb-pivot></tb-pivot> }
              @case ('report-tb') { <report-tb></report-tb>}
              @case ('grid-template') { <grid-template></grid-template> }
              @case ('expense-rpt') { <expense-rpt></expense-rpt> }
              @case ('active-rpt') { <active-rpt></active-rpt> } }
            </div>
          </div>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
  styles: ` `,
  imports: [mods, ActiveComponent],
  providers: [AppService],
  standalone: true,
})
export class ReportingPanelComponent {
  drawer = viewChild<MatDrawer>('drawer');
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  panels: any[] = [];
  selectedPanel: string = 'dist-tb';
  PANEL_ID = 'reportingPanel';
  store = inject(ApplicationStore);
  panelService = inject(AppService);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService
  ) {
    this.panelService.getUserId().subscribe((uid) => {
      this.panelService.findPanelByName(uid, this.PANEL_ID).subscribe((panel) => {
        this.selectedPanel = panel.lastPanelOpened;
      });
    });
  }

  ngOnInit() {
    this.panels = [
      {
        id: 'distribution-listing',
        icon: 'heroicons_outline:document-check',
        title: 'Distributed Trial Balance',
        description: 'Trial Balance with Distribution Entries',
      },
      {
        id: 'balance-sheet-rpt',
        icon: 'heroicons_outline:document-plus',
        title: 'Balance Sheet Statement',
        description: 'Continuous Balance Sheet Report',
      },
      {
        id: 'dist-tb',
        icon: 'heroicons_outline:document-plus',
        title: 'Distributed Trial Balance',
        description: 'Tabular summary of trial balance by account',
      },
      {
        id: 'report-tb',
        icon: 'heroicons_outline:document-check',
        title: 'Trial Balance Reporting',
        description: 'Distributed trial balance listing including the associated journal entries',
      },
      {
        id: 'balance-sheet-statement',
        icon: 'heroicons_outline:document-duplicate',
        title: 'Balance Sheet Financial Statement',
        description: 'Balance sheet by period reporting',
      },

      {
        id: 'income-statement',
        icon: 'heroicons_outline:document-duplicate',
        title: 'Income Financial Statement',
        description: 'Income statement by period reporting',
      },
      {
        id: 'income-statement-comparison',
        icon: 'heroicons_outline:document-duplicate',
        title: 'Income Financial Statement Comparison',
        description: 'Income statement comparison by period reporting',
      },
      {
        id: 'cash-flows-statement',
        icon: 'heroicons_outline:document-duplicate',
        title: 'Cash Flow Statement',
        description: 'Inflows and outflow from cash balance by fund',
      },
      {
        id: 'operations-statement',
        icon: 'heroicons_outline:document-duplicate',
        title: 'Operations Statement',
        description: 'Expenses and inflows for operating transactions',
      },
      {
        id: 'ap-aging',
        icon: 'heroicons_outline:document-duplicate',
        title: 'Accounts Payable Aging',
        description: 'Monthly aging of payments for accounts payable',
      },
      {
        id: 'ar-aging',
        icon: 'heroicons_outline:document-duplicate',
        title: 'Accounts Receivable Aging',
        description: 'Monthly aging of receipts from sales or fees',
      },

      {
        id: 'reconciliations',
        icon: 'feather:image',
        title: 'Reconciliation Reporting',
        description: 'Bank, expense and financial reconciliation reporting',
      },
      {
        id: 'expense-rpt',
        icon: 'feather:image',
        title: 'Expense Reporting',
        description: 'Expenses',
      },
      {
        id: 'active-rpt',
        icon: 'feather:image',
        title: 'Journal List Report',
        description: 'List of Journal Entries by Date',
      },

      // {
      //     id: 'grid-template',
      //     icon: 'feather:image',
      //     title: 'Grid Template ',
      //     description: 'Example of using a html in grid',
      // },
      // {
      //     id: 'tb-grid',
      //     icon: 'heroicons_outline:document-check',
      //     title: 'Financial Returns Pivot',
      //     description: 'Pivot table of yearly financial data',
      // },
      // {
      //     id: 'tb-pivot',
      //     icon: 'heroicons_outline:document-check',
      //     title: 'Monthly Results Report',
      //     description: 'Pivot trial balance by monthly period',
      // }
    ];

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode and drawerOpened
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
          this.drawerOpened = true;
        } else {
          this.drawerMode = 'over';
          this.drawerOpened = false;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    const panelState = {
      uid: '',
      panelName: this.PANEL_ID,
      lastPanelOpened: this.selectedPanel,
    };

    this.panelService.getUserId().subscribe((id) => {
      panelState.uid = id;
      this.panelService.setPanel(panelState);
    });

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  /**
   * Get the details of the panel
   *
   * @param id
   */
  goToPanel(panel: string): void {
    this.selectedPanel = panel;
    // Close the drawer on 'over' mode
    if (this.drawerMode === 'over') {
      this.drawer().close();
    }
  }

  getPanelInfo(id: string): any {
    return this.panels.find((panel) => panel.id === id);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
