import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';

import { AppService } from 'app/store/main.panel.store';
import { ApplicationStore } from 'app/store/application.store';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FundsComponent } from './funds/gl.funds.component';
import { FuseMediaWatcherService } from 'app/services/media-watcher';
import { GLTransactionGridComponent } from '../transactions/general-ledger/transaction-grid';
import { GlAccountsComponent } from './accts/comp.accts';
import { GlSubTypeComponent } from './subtype/gl.subtype.component';
import { GlTypeComponent } from './gl_account_type/gl.types.component';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NgClass } from '@angular/common';
import { PartyComponent } from './party/party.component';
import { PeriodsComponent } from './periods/gl.periods.component';
import { RolesComponent } from './roles/gl.roles.component';
import { SpreadsheetViewComponent } from '../grid-components/spreadsheet-view.component';
import { TeamsComponent } from './team/gl.teams.component';

@Component({
    template: `
        <div class="flex flex-col w-full min-w-0 sm:absolute sm:inset-0 sm:overflow-x-hidden">
        <mat-drawer-container class="flex-auto sm:h-full bg-gray-100 dark:bg-gray-900" cdkScrollable>
            <!-- Drawer -->
            @if(store.panels().length > 0) {
            <mat-drawer class="sm:w-72 dark:bg-gray-900" [autoFocus]="false" [mode]="drawerMode" [opened]="drawerOpened"  #drawer>
                    <!-- Header -->
                    <div class="flex items-center justify-between m-8 mr-6 sm:my-10">
                    <!-- Title -->
                    <div class="text-4xl font-extrabold tracking-tight leading-none text-primary">
                        Reference Data
                    </div>
                    <!-- Close button -->
                    <div class="md:hidden">
                        <button mat-icon-button (click)="this.drawer().toggle()">
                            <mat-icon [svgIcon]="'heroicons_outline:bars-3'"></mat-icon>
                        </button>
                    </div>
                </div>
                <!-- Panel links -->
                <div class="flex flex-col divide-y border-t border-b">
                @for (panel of panels; track trackByFn($index, panel)) {
                    <div class="flex px-8 py-5 cursor-pointer" [ngClass]="{'hover:bg-gray-100 dark:hover:bg-hover': !selectedPanel || selectedPanel !== panel.id, 'bg-primary-50 dark:bg-hover':
                            selectedPanel && selectedPanel === panel.id
                    }" (click)="goToPanel(panel.id)">
                    <mat-icon [ngClass]="{ 'text-hint':!selectedPanel || selectedPanel !== panel.id, 'text-primary dark:text-primary': selectedPanel && selectedPanel === panel.id }" [svgIcon]="panel.icon"></mat-icon>
                    <div class="ml-3">
                    <div class="font-medium leading-6" [ngClass]="{ 'text-primary dark:text-primary': selectedPanel && selectedPanel === panel.id}">
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

            <!-- Drawer content -->
            <mat-drawer-content class="flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
                <!-- Main -->
                <div class="flex-auto px-6 pt-9 pb-12 md:p-8 md:pb-12 lg:p-12">
                    <!-- Panel header -->
                    <div class="flex items-center">
                        <!-- Drawer toggle -->
                        <button class="lx2:hidden -ml-2 text-primary" mat-icon-button (click)="drawer().toggle()">
                            <mat-icon [svgIcon]="'heroicons_outline:bars-3'"></mat-icon>
                        </button>

                        <!-- Panel title -->
                        <div class="ml-2 lg:ml-0 text-3xl font-bold tracking-tight leading-none text-primary">
                            {{ getPanelInfo(selectedPanel).title }}
                        </div>
                    </div>

                    <!-- Load settings panel -->
                    <div class="mt-8">
                        @switch (selectedPanel) {
                            @case ('accounts'){ <glaccounts></glaccounts> }
                            @case ('party'){ <party></party> }
                            @case ('types') { <gl-types></gl-types> }
                            @case ('subtypes'){ <subtypes></subtypes> }
                            @case ('funds') { <funds> </funds> }
                            @case ('periods') { <periods></periods> }
                            @case ('team') { <team></team> }
                            @case ('roles') { <roles></roles> }
                            @case ('grid')  { <gl-grid-transactions></gl-grid-transactions> }
                            @case ('xls')   { <spreadsheet-view></spreadsheet-view> }
                        }
                    </div>
                </div>
            </mat-drawer-content>
        </mat-drawer-container>
    </div>
    `,
    selector: 'gl-main',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatButtonModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatIconModule,
        MatDatepickerModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatCardModule,
        FundsComponent,
        GlAccountsComponent,
        GlTypeComponent,
        PeriodsComponent,
        RolesComponent,
        PartyComponent,
        GlSubTypeComponent,
        TeamsComponent,
        GlAccountsComponent,
        CdkScrollable,
  
        GLTransactionGridComponent,
        SpreadsheetViewComponent,
        NgClass,
    ],
    providers: [HttpClient],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlMainComponent implements OnInit {

    drawer = viewChild<MatDrawer>("drawer");
    public PANEL_ID = 'referencePanel';

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _fuseMediaWatcherService = inject(FuseMediaWatcherService);

    public drawerMode: 'over' | 'side' = 'side';
    public drawerOpened: boolean = true;
    public panels: any[] = [];
    public selectedPanel: string = 'accounts';
    public appService = inject(AppService);
    public store = inject(ApplicationStore);

    constructor() {
        this.appService.getUserId().subscribe((uid) => {
            this.appService.findPanelByName(uid, this.PANEL_ID).subscribe((panel) => {
                this.selectedPanel = panel.lastPanelOpened;
            });
        });
    }
    ngOnInit(): void {
        this.panels = [
            {
                id: 'accounts',
                icon: 'heroicons_outline:currency-dollar',
                title: 'General Ledger Accounts',
                description: 'General ledger list of accounts in a hierarchy',
            },
            {
                id: 'types',
                icon: 'heroicons_outline:banknotes',
                title: 'Account Financial Statement Mapping',
                description: 'Type of general ledger accounts by classification for financial statements',
            },
            {
                id: 'subtypes',
                icon: 'heroicons_outline:document-text',
                title: 'Transaction Sub Types',
                description: 'Mapping transaction sub types',
            },
            {
                id: 'party',
                icon: 'heroicons_outline:user-circle',
                title: 'Customer and Vendor Party',
                description: 'Customer and vendor party definitions',
            },
            {
                id: 'funds',
                icon: 'heroicons_outline:clipboard',
                title: 'Reserve Funds',
                description: 'Reserve fund definitions for transactions',
            },
            {
                id: 'periods',
                icon: 'heroicons_outline:calendar',
                title: 'Accounting Periods',
                description: 'Start and end date of each accounting period',
            },
            {
                id: 'team',
                icon: 'heroicons_outline:user',
                title: 'Accounting Team',
                description: 'List of accounting team members',
            },
            {
                id: 'roles',
                icon: 'heroicons_outline:user-circle',
                title: 'Role Definitions',
                description: 'List of  assignable roles for team members',
            },
            {
                id: 'app-settings',
                icon: 'mat_outline:app_settings_alt',
                title: 'Application Settings',
                description: 'Settings for the application',
            },
            {
                id: 'at',
                icon: 'heroicons_outline:document-arrow-up',
                title: 'Artifact Management',
                description: 'Manage the documentation of transactions',
            },

            {
                id: 'artifact-mgmt',
                icon: 'heroicons_outline:document-magnifying-glass',
                title: 'Artifact by Transaction',
                description: 'List of transactions with assigned artifacts',
            }
        ];


        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else {
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
            lastPanelOpened: this.selectedPanel
        };

        const userId = this.appService.getUserId()
            .subscribe((id) => {
                panelState.uid = id;
                this.appService.setPanel(panelState);
            });

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer().close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
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


