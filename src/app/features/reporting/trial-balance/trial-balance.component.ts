import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import {
    AggregateService,
    ColumnMenuService,
    DetailRowService,
    EditService,
    ExcelExportService,
    FilterService,
    FilterSettingsModel,
    GridComponent,
    GridModule,
    GroupService,
    PageService,
    PdfExportService,
    ResizeService,
    RowSelectEventArgs,
    SearchSettingsModel,
    SelectionSettingsModel,
    SortService,
    ToolbarItems,
    ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ICurrentPeriod, IPeriod } from 'app/models/period';
import { ReplaySubject, Subject } from 'rxjs';

import { CommonModule, } from '@angular/common';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GridMenubarStandaloneComponent } from "../../accounting/grid-components/grid-menubar.component";
import { IGridSettingsModel } from 'app/services/grid.settings.service';
import { IJournalSummary } from 'app/models';
import { Location } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TrialBalanceStore } from 'app/store/distribution.ledger.store';

const imports = [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    MatProgressSpinnerModule
];

const declarations = [
    TrialBalanceStore,
    PdfExportService,
    ExcelExportService,
    GroupService,
    DetailRowService,
    SortService,
    PageService,
    ResizeService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    ColumnMenuService
];

// report-tb Distributed Trial Balance
// This component displays a trial balance report with options for exporting and printing.
// It uses Syncfusion's grid component for displaying the data and provides functionalities like exporting to Excel
// and PDF, printing, and filtering the data. The component is designed to be responsive and user-friendly, allowing users to easily navigate through the trial balance data.
@Component({
    selector: 'report-tb',
    template: `
        <div class="flex flex-col min-w-0 overflow-y-auto overflow-x-auto bg-gray-100 dark:bg-gray-900" cdkScrollable>
        <!-- Main -->
        <div class="flex-auto p-2 sm:p-10">
            <div class="h-max border-gray-300 rounded-2xl">
            <grid-menubar
                [inTitle]="'Distribution Ledger by Period'"
                (openSettings)="openDrawer()"
                (back)="onBack()"
                (onPrint)="onPrint()"
                (exportXL)="exportXL()"
                (exportPRD)="exportPDF()"
                (exportCSV)="onExportCSV()"
                (period)="onPeriod($event)"
                [showPeriod]="true"
                [showPrint]=false
                [showExportXL]=true
                [showExportPDF]=false
                [showExportCSV]=false
                [showSettings]=false
                [showBack]=true>
            </grid-menubar>

            @if (store.isLoading() === false) {
                <ejs-grid #grid id="grid"
                [enablePersistence]='true'
                [allowPaging]='false'
                [allowSelection]='false'
                [allowSorting]='true'
                [showColumnMenu]='false'
                [allowGrouping]='true'
                [allowExcelExport]='true'
                [allowPdfExport]='true'
                [allowFiltering]='true'
                [toolbar]='toolbarOptions'
                [filterSettings]='filterSettings'
                [editSettings]='editSettings'
                [pageSettings]='pageSettings'
                (rowSelected)="onRowSelected($event)"
                (actionBegin)="actionBegin($event)"
                (load)='onLoad()'
                (click)="onClickGrid($event)"
                [dataSource]="store.header()"  >

                <e-columns>
                    <e-column headerText="Group"        field="account" width="100"></e-column>
                    <e-column headerText="Account"      field="child" isPrimaryKey='true'  width="100" ></e-column>
                    <e-column headerText="Prd"          field="period" width="100" ></e-column>
                    <e-column headerText="Year"         field="period_year" width="100" ></e-column>
                    <e-column headerText="Description"  field="description" width="200" ></e-column>
                    <e-column headerText="Open"         field="opening_balance" textAlign="Right" format="N2" width="100" ></e-column>
                    <e-column headerText="Debit"        field="debit_balance"   textAlign="Right" format="N2" visible="false"  width="100" ></e-column>
                    <e-column headerText="Credit"       field="credit_balance"  textAlign="Right" format="N2" visible="false"  width="100" ></e-column>
                    <e-column headerText="Closing"      field="closing_balance" textAlign="Right" format="N2" width="100" ></e-column>
                    <e-aggregates>
                        <e-aggregate>
                            <e-columns>
                                <e-column type="Sum" field="opening_balance" format="N2">
                                    <ng-template #footerTemplate let-data>
                                        <div>
                                            <span class="text-primary rounded-md text-[14px]">{{data.Sum}}</span>
                                        </div>
                                    </ng-template>
                                </e-column>

                                <e-column type="Sum" field="description"  format="N2">
                                    <ng-template #groupFooterTemplate let-data>
                                        <div>
                                            <span class="text-primary rounded-md text-[14px]">Sub Totals</span>
                                        </div>
                                    </ng-template>
                                </e-column>

                                <e-column type="Sum" field="opening_balance"  format="N2">
                                    <ng-template #groupFooterTemplate let-data>
                                        <div>
                                            <span class="text-primary rounded-md text-[14px]">{{data.Sum}} </span>
                                        </div>
                                    </ng-template>
                                </e-column>

                                <e-column field="debit_balance" type="Sum" format="N2">
                                    <ng-template #groupFooterTemplate let-data>
                                        <div>
                                            <span class="text-primary rounded-md text-[14px]"> {{data.Sum}} </span>
                                        </div>
                                    </ng-template>
                                </e-column>

                                <e-column type="Sum" field="credit_balance" format="N2">
                                        <ng-template #footerTemplate let-data>
                                            <div>
                                                <span class="text-primary rounded-md text-[14px]"> {{data.Sum}} </span>
                                            </div>
                                        </ng-template>
                                </e-column>

                                <e-column field="credit_balance" type="Sum" format="N2">
                                    <ng-template #groupFooterTemplate let-data>
                                        <div>
                                            <span class="text-primary rounded-md text-[14px]"> {{data.Sum}} </span>
                                        </div>
                                    </ng-template>
                                </e-column>

                                <e-column type="Sum" field="closing_balance" format="N2">
                                        <ng-template #footerTemplate let-data>
                                        <div>
                                            <span class="text-primary rounded-md text-[14px]"> {{data.Sum}} </span>
                                        </div>
                                        </ng-template>
                                </e-column>

                                 <e-column field="closing_balance" type="Sum" format="N2">
                                    <ng-template #groupFooterTemplate let-data>
                                        <div>
                                            <span class="text-primary rounded-md text-[14px]"> {{data.Sum}} </span>
                                        </div>
                                    </ng-template>
                                </e-column>

                                <e-column type="Sum" field="debit_balance" format="N2">
                                    <ng-template #footerTemplate let-data>
                                        <div>
                                            <span class="text-primary rounded-md text-[14px]"> {{data.Sum}} </span>
                                        </div>
                                    </ng-template>
                                </e-column>

                            </e-columns>

                        </e-aggregate>
                    </e-aggregates>
                </e-columns>
                </ejs-grid>
                }
                @else
                 {
                 <div class="flex justify-center items-center">
                     <mat-spinner></mat-spinner>
                 </div>
                }
            </div>
        </div>
    </div>
    `,

    imports: [imports, GridMenubarStandaloneComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [declarations],
    styles: `

    `
})
export class TrialBalanceComponent implements OnInit, AfterViewInit {

    store = inject(TrialBalanceStore);
    public grid = viewChild<GridComponent>('grid')

    // datagrid settings start
    public pageSettings: Object;
    public formatoptions: Object;
    public initialSort: Object;
    public filterOptions: FilterSettingsModel;
    public editSettings: Object;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public selectionOptions?: SelectionSettingsModel;
    public toolbarOptions?: ToolbarItems[];
    public searchOptions?: SearchSettingsModel;
    public filterSettings: FilterSettingsModel;
    public childData?: IJournalSummary[] | null;


    public periodList: IPeriod[] = [];
    public periodCtrl: FormControl<IPeriod> = new FormControl<IPeriod>(null);
    public periodFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public periodFilter: ReplaySubject<IPeriod[]> = new ReplaySubject<IPeriod[]>(1);
    protected _onPeriodDestroy = new Subject<void>();
    protected _onDestroy = new Subject<void>();
    public settingsList: IGridSettingsModel[] = [];

    private _location = inject(Location);

    public periodParams = {
        period: 1,
        year: 2025
    }

    initialDatagrid() {
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.selectionOptions = { mode: 'Cell' };
        this.editSettings = { allowEditing: false, allowAdding: false, allowDeleting: false };
        this.searchOptions = { fields: ['description'], operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'CheckBox' };
    }

    protected filterPeriod() {
        if (!this.periodList) {
            return;
        }
        // get the search keyword
        let search = this.periodFilterCtrl.value;
        if (!search) {
            this.periodFilter.next(this.periodList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.periodFilter.next(
            this.periodList.filter(period => period.period_id.toString().toLowerCase().indexOf(search) > -1)
        );
    }

    onBack() {
        console.log('On Back');
        this._location.back();
    }


    onPeriod(e: string) {

        console.debug("Period : ", e);

        var prd: ICurrentPeriod[] = [];

        var currentPeriod = localStorage.getItem('currentPeriod');
        if (currentPeriod === null) {
            currentPeriod = 'January 2025';
        }

        var activePeriods: ICurrentPeriod[] = [];

        var _currentActivePeriods = localStorage.getItem('activePeriod');

        if (_currentActivePeriods) {
            activePeriods = JSON.parse(_currentActivePeriods) as ICurrentPeriod[];
        }

        if (activePeriods.length > 0) {
            prd = activePeriods.filter((period) => period.description === currentPeriod);
            if (prd.length > 0) {
                this.periodParams.period = prd[0].period_id;
                this.periodParams.year = prd[0].period_year;
            }
            this.store.loadHeader(this.periodParams);
        }
    }

    ngOnInit() {
        this.initialDatagrid();
        this.onRefresh();
    }

    onRefresh() {
        this.store.loadHeader(this.periodParams);
    }


    exportPDF() {
        console.log('Excel');
        this.grid()!.excelExport({
            fileName: 'TB-31-01-2024.xlsx', header: {
                headerRows: 7,
                rows: [
                    { cells: [{ colSpan: 4, value: "Company Name", style: { fontColor: '#03396c', fontSize: 20, hAlign: 'Left', bold: true, } }] },
                    { cells: [{ colSpan: 4, value: "Trial Balance", style: { fontColor: '#03396c', fontSize: 20, hAlign: 'Left', bold: true, } }] },
                ]
            },
            footer: {
                footerRows: 4,
                rows: [
                    { cells: [{ colSpan: 4, value: "", style: { hAlign: 'Center', bold: true } }] },
                    { cells: [{ colSpan: 4, value: "", style: { hAlign: 'Center', bold: true } }] }
                ]
            },
        });

    }
    exportXL() {
        console.log('Excel');
        this.grid()!.excelExport({
            fileName: 'Trial-Balance-31-01-2024.xlsx', header: {
                headerRows: 7,
                rows: [
                    { cells: [{ colSpan: 4, value: "Company Name", style: { fontColor: '#03396c', fontSize: 20, hAlign: 'Left', bold: true, } }] },
                    { cells: [{ colSpan: 4, value: "Trial Balance", style: { fontColor: '#03396c', fontSize: 20, hAlign: 'Left', bold: true, } }] },
                ]
            },
            footer: {
                footerRows: 4,
                rows: [
                    { cells: [{ colSpan: 4, value: "", style: { hAlign: 'Center', bold: true } }] },
                    { cells: [{ colSpan: 4, value: "", style: { hAlign: 'Center', bold: true } }] }
                ]
            },
        });

    }
    onPrint() {
        this.grid().print();
    }
    openDrawer() {

    }

    onExportCSV() {
        console.log('Refresh');
        this.grid()!.pdfExport({
            pageOrientation: 'Landscape', pageSize: 'A4', fileName: 'TB-31-01-2024.pdf', header: {
                fromTop: 0,
                height: 120,
                contents: [
                    {
                        type: 'Text',
                        value: `Trial Balance ${this.store.header()[0].period} - ${this.store.header()[0].period_year}`,
                        position: { x: 10, y: 50 },
                        style: { textBrushColor: '#000000', fontSize: 30 },
                    },
                ]
            }
        });

    }
    ngAfterViewInit(): void {
        // this.store.loadJournals({
        //     period: 1,
        //     period_year: 2025
        // });
    }

    // grid.element.addEventListener('click', (e) => {
    //     let cell = closest(e.target, 'td'); // details cell element
    //     if (cell.classList.contains('e-detailrowexpand')) {
    //      const rowIndex = parseInt(cell.parentElement.getAttribute('aria-rowindex'), 10);
    //      const data = grid.getCurrentViewRecords()[rowIndex]; // get details row data
    //      alert("Child Grid");
    //     }
    // });

    onClickGrid(e: any) {
        //this.grid().childGrid.dataSource = this.store.details();
    }

    actionBegin(args: any) {
        console.debug(JSON.stringify(args.requestType));
        console.log('Header Length', this.store.header().length)
        //console.debug('Detail Length', this.store.details().length)
    }

    public onRowSelected(args: RowSelectEventArgs): void {
        console.debug('row Selected');
    }

    onLoad(): void {
        // this.grid().childGrid.dataSource = this.store.details();

    }
}


