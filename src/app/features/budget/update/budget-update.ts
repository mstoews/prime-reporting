import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild, inject, input, viewChild } from '@angular/core';
import {
  AggregateService,
  ColumnMenuService,
  EditService,
  ExcelExportService,
  FilterService,
  FilterSettingsModel,
  GridModule,
  GroupService,
  PageService,
  ResizeService,
  SaveEventArgs,
  SortService,
  ToolbarItems,
  ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAccounts, IBudget, IDropDownAccounts } from 'app/models';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ReplaySubject, Subject, Subscription, map, takeUntil } from 'rxjs';

import { AUTH } from 'app/app.config';
import { AccountDropDownComponent } from "../../accounting/grid-components/drop-down-account.component";
import { BudgetStore } from 'app/store/budget.store';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { CommonModule } from '@angular/common';
import { GridMenubarStandaloneComponent } from '../../accounting/grid-components/grid-menubar.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatSelect } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SubTypeService } from "app/services/subtype.service";
import { ToastrService } from 'ngx-toastr';

const imp = [
  CommonModule,
  ReactiveFormsModule,
  ComboBoxModule,
  FormsModule,
  GridModule,
  NgxMaskDirective,
  NgxMatSelectSearchModule,
  GridMenubarStandaloneComponent,
  MatSidenavModule,
  MatProgressSpinner,
  MatIconModule,
  MatInputModule,
  MatCardModule
];

const providers = [
  provideNgxMask(),
  BudgetStore,
  SortService,
  ToolbarService,
  SortService,
  FilterService,
  ToolbarService,
  EditService,
  AggregateService,
  GroupService,
  ExcelExportService,
  PageService,
  ResizeService,
  FilterService,
  ToolbarService,
  EditService,
  AggregateService,
  ColumnMenuService];

@Component({
  selector: 'budget-update',
  imports: [imp, MatProgressSpinner],
  template: `
                <grid-menubar  class="m-2" [showPeriod]="false"  [inTitle]="'Budget Update'" [showNew]=true [showSettings]="false"/>
                <mat-drawer-container class="flex-col h-screen">
                <ng-container>
                    <div class="border border-gray-500 ">
                        @if(budgetStore.isLoading() === false) {
                            <ejs-grid #budget_grid id='budget_grid'
                              showColumnMenu='true'
                              [height]='gridHeight'
                              [enablePersistence]='true'
                              [dataSource]='budgetStore.budget()'
                              [rowHeight]='30'
                              [gridLines]="'Both'"
                              [allowFiltering]='true'
                              [allowGrouping]='true'
                              [toolbar]='toolbarOptions'
                              [filterSettings]='filterSettings'
                              [editSettings]='editSettings'
                              keyExpr="child"
                              (toolbarClick)='toolbarClick($event)'
                              (actionBegin)="actionBegin($event)"
                              (batchSave)="batchSave($event)" >
                        <e-columns>
                            <e-column headerText="Group" field="account" isPrimaryKey="true" width="100"></e-column>
                            <e-column headerText="Account" field="child" isPrimaryKey="true" width="100"></e-column>
                            <e-column headerText="Account Type" [allowEditing]='false' field="acct_type" width="120"></e-column>
                            <e-column headerText="Description" [allowEditing]='false' field="description" width="250"></e-column>
                            <e-column headerText="Budget 1" field="budget_1" width="120" textAlign="Right" format="N2">
                                <ng-template #footerTemplate let-data>{{data.budget_1 | number: '1.2-2'}}</ng-template>
                            </e-column>
                            <e-column headerText="Budget 2" field="budget_2" width="120" textAlign="Right" format="N2">
                                <ng-template #footerTemplate let-data>{{data.budget_2 | number: '1.2-2'}}</ng-template>
                            </e-column>
                            <e-column headerText="Budget 3" field="budget_3" width="120" textAlign="Right" format="N2">
                                <ng-template #footerTemplate let-data>{{data.budget_3 | number: '1.2-2'}}</ng-template>
                            </e-column>
                            <e-column headerText="Budget 4" field="budget_4" width="120" textAlign="Right" format="N2">
                                <ng-template #footerTemplate let-data>{{data.budget_4 | number: '1.2-2'}}</ng-template>
                            </e-column>
                            <e-column headerText="Budget 5" field="budget_5" width="120" textAlign="Right" format="N2">
                                <ng-template #footerTemplate let-data>{{data.budget_5 | number: '1.2-2'}}</ng-template>
                            </e-column>
                            <e-column headerText="Budget 6" field="budget_6" width="120" textAlign="Right" format="N2">
                                <ng-template #footerTemplate let-data>{{data.budget_6 | number: '1.2-2'}}</ng-template>
                            </e-column>
                            <e-column headerText="Budget 7" field="budget_7" width="120" textAlign="Right" format="N2">
                                <ng-template #footerTemplate let-data>{{data.budget_7 | number: '1.2-2'}}</ng-template>
                            </e-column>
                            <e-column headerText="Budget 8" field="budget_8" width="120" textAlign="Right" format="N2">
                                <ng-template #footerTemplate let-data>{{data.budget_8 | number: '1.2-2'}}</ng-template>
                            </e-column>
                            <e-column headerText="Budget 9" field="budget_9" width="120" textAlign="Right" format="N2">
                                <ng-template #footerTemplate let-data>{{data.budget_9 | number: '1.2-2'}}</ng-template>
                            </e-column>
                            <e-column headerText="Budget 10" field="budget_10" width="120" textAlign="Right" format="N2">
                                  <ng-template #footerTemplate let-data>{{data.budget_10 | number: '1.2-2'}}</ng-template>
                            </e-column>
                            <e-column headerText="Budget 11" field="budget_11" width="120" textAlign="Right" format="N2">
                                <ng-template #footerTemplate let-data>{{data.budget_11 | number: '1.2-2'}}</ng-template>
                            </e-column>
                            <e-column headerText="Budget 12" field="budget_12" width="120" textAlign="Right" format="N2">
                                <ng-template #footerTemplate let-data>{{data.budget_12 | number: '1.2-2'}}</ng-template>
                            </e-column>

                        </e-columns>

                        <e-aggregates>
                            <e-aggregate>
                                <e-columns>
                                    <e-column type="Sum" field="amount" format="N2">
                                        <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                                    </e-column>

                                </e-columns>
                            </e-aggregate>
                        </e-aggregates>
                        </ejs-grid>
                         }
                        @else
                        {
                            <div class="flex justify-center items-center mt-20">
                                <mat-spinner></mat-spinner>
                            </div>
                        }
                    </div>
                </ng-container>

        </mat-drawer-container>


      <mat-drawer class="w-112.5" #drawer [opened]="false" mode="over" [position]="'end'" [disableClose]="false">
          <mat-card class="m-2">
              <div class="flex flex-row w-full filter-article filter-interactive text-gray-700">
                  <div class="bg-slate-600 text-justify m-2 p-2 text-white h-10 text-2xl border-l-4 border-gray-400 grow w-full"
                      mat-dialog-title>
                      {{ title }}
                  </div>
              </div>

              <form [formGroup]="budgetForm" class="form">
                  <div class="div flex flex-col grow">
                      <section class="flex flex-col md:flex-col m-1">

                        <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow">
                              <mat-label class="text-md ml-2">Description</mat-label>
                              <input matInput placeholder="Description" formControlName="description"
                                  [placeholder]="'Description'" />
                              <mat-icon class="icon-size-5 text-green-700" matPrefix
                                  [svgIcon]="'heroicons_solid:calculator'"></mat-icon>
                          </mat-form-field>

                          <mat-form-field class="flex-col grow mr-2 ml-2 mt-1">
                              <mat-label class="text-md ml-2">Reference</mat-label>
                              <input matInput placeholder="Reference" formControlName="reference"
                                  [placeholder]="'Reference'" />
                              <mat-icon class="icon-size-5 text-green-700" matPrefix
                                  [svgIcon]="'heroicons_solid:document'"></mat-icon>
                          </mat-form-field>

                          <mat-form-field class="ml-2 mt-1 grow">
                              <mat-label class="text-md ml-2">Budget Amount</mat-label>
                              <input type="text" mask="separator.2" [leadZero]="true" thousandSeparator=","
                                  class="text-right" matInput [placeholder]="'Budger Amount'" formControlName="amount" />
                              <mat-icon class="icon-size-5 text-green-700" matPrefix
                                  [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                          </mat-form-field>

                      </section>
                  </div>
              </form>

                  <div class="flex flex-row w-full">
                      @if (bDirty === true) {
                      <button mat-icon-button color=primary class="bg-slate-200 hover:bg-slate-400 ml-1"
                        matTooltip="Save" aria-label="hovered over">
                        <span class="e-icons e-save"></span>
                      </button>
                      }

                      <button mat-icon-button color=primary
                              class=" hover:bg-slate-400 ml-1" (click)="onAdd()" matTooltip="New" aria-label="hovered over">
                          <span class="e-icons e-circle-add"></span>
                      </button>

                      <button mat-icon-button color=primary
                              class=" hover:bg-slate-400 ml-1" (click)="onDelete()" matTooltip="Delete" aria-label="hovered over">
                          <span class="e-icons e-trash"></span>
                      </button>

                      <button mat-icon-button color=primary
                              class=" hover:bg-slate-400 ml-1"  (click)="onCancel()" matTooltip="Close"
                              aria-label="hovered over">
                              <span class="e-icons e-circle-close"></span>
                      </button>
                  </div>
          </mat-card>
        </mat-drawer>

  `,
  providers: [providers],
  styles: ``
})
export class BudgetUpdate implements OnInit, OnDestroy, AfterViewInit {


  title: any;
  onCancel() {
    throw new Error('Method not implemented.');
  }
  onDelete() {
    throw new Error('Method not implemented.');
  }

  public bDirty = false;
  accountDropDown = viewChild<AccountDropDownComponent>("accountDropDown");

  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();
  public readonly sTitle = input<string>(undefined);
  public readonly subtypeService = inject(SubTypeService);

  public subtype$ = this.subtypeService.read();
  private auth = inject(AUTH);

  budgetForm = new FormGroup({
    description: new FormControl(''),
    reference: new FormControl(''),
    amount: new FormControl(0.0),
    account: new FormGroup({
      dropdown: new FormControl('')
    }),
  });

  public gridHeight: number;
  public isVisible = true;
  private GRID_HEIGHT_ADJ = 250;
  adjustHeight() {
    this.gridHeight = (window.innerHeight - this.GRID_HEIGHT_ADJ)
  }


  public editSettings: Object;
  public editArtifactSettings: Object;
  public filterSettings: Object;
  public toolbar: string[];
  public orderidrules: Object;
  public editparams: Object;
  public formatoptions: Object;
  public selectionOptions: Object;
  public searchOptions: Object;
  public selIndex?: number[] = [];
  public pageSettings: Object;
  public initialSort: Object;
  public filterOptions: FilterSettingsModel;
  public submitClicked: boolean = false;
  public toolbarOptions?: ToolbarItems[];

  public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

  public value = 0;
  public loading = false;
  public height: string = '350px';

  public accountsListSubject: Subscription;
  public detailsSubject: Subscription;

  budgetStore = inject(BudgetStore);

  toast = inject(ToastrService);

  // drop down searchable list

  @ViewChild('singleSelect', { static: true })
  singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();
  public drawer = viewChild<MatDrawer>("drawer");


  ngOnInit(): void {
    this.gridHeight = (window.innerHeight - this.GRID_HEIGHT_ADJ); // Adjust as needed
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

  ngAfterViewInit() {
    this.initialDatagrid();

  }


  toolbarClick($event: any) {
    throw new Error('Method not implemented.');
  }

  changeSubtype(e: any) {
    console.debug("Subtype :", e.value);
  }


  initialDatagrid() {
    // this.pageSettings = { pageCount: 10 };
    this.toolbarOptions = ['ExcelExport', 'CsvExport'];
    this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
    this.selectionOptions = { mode: 'Cell' };
    this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false, mode: 'Batch' };
    this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
    this.toolbarOptions = ['Search'];
    this.filterSettings = { type: 'Excel' };
  }

  batchSave(args: any) {
    var accountChanges: IAccounts[] = [];

    const changedRecords = args.batchChanges.changedRecords as IAccounts[];
    const addedRecords = args.batchChanges.addedRecords as IAccounts[];

    // add unchanged records to the list

    this.budgetStore.budget().forEach((detail) => {
      if (!changedRecords.find((rec) => rec.child === detail.child)) {

      }
    });

    // add changed and added records to the list
    if (changedRecords && changedRecords.length > 0) {
      accountChanges.push(...changedRecords);
    }

    // add added records to the list
    if (addedRecords && addedRecords.length > 0) {
      accountChanges.push(...addedRecords);
    }
    // deleted records are just not added and are excluded in the journal build

  }


  onDeleteDetail() {
    throw new Error('Method not implemented.');
  }

  onRefresh() {
    throw new Error('Method not implemented.');
  }

  onAdd() {
    throw new Error('Method not implemented.');
  }

  onDeleteSelection() {
    throw new Error('Method not implemented.');
  }

  onUpdateSelection() {
    throw new Error('Method not implemented.');
  }

  openDrawer() {
    this.bDirty = false;
    this.drawer().open();
  }


  public actionBegin(args: SaveEventArgs): void {
    if (args.requestType === "beginEdit" || args.requestType === "add") {
      //args.cancel = true;
      this.OnCardDoubleClick(args.rowData);
      this.openDrawer();
    }
    if (args.requestType === "save") {
      this.onSaved(args.data);
    }
  }

  onSaved(data: any): void {
    // Handle the saved data
    this.budgetStore.updateBudget(data);
  }

  public OnCardDoubleClick(data: any): void {

    const email = this.auth.currentUser.email;
    const dDate = new Date();
    var currentDate = dDate.toISOString().split("T")[0];
    data = this.budgetStore.budget().find((x) => x.child === data.child);

    const BudgetDetail = {
      account: data.account,
      child: data.child,
      acct_type: data.acct_type,
      description: data.description,
      budget_1: data.budget_1,
      budget_2: data.budget_2,
      budget_3: data.budget_3,
      budget_4: data.budget_4,
      budget_5: data.budget_5,
      budget_6: data.budget_6,
      budget_7: data.budget_7,
      budget_8: data.budget_8,
      budget_9: data.budget_9,
      budget_10: data.budget_10,
      budget_11: data.budget_11,
      budget_12: data.budget_12
    } as IBudget;

    const accountString = data.child.toString();

    this.accountDropDown().setDropdownValue(accountString);

    this.budgetForm.patchValue({

    });

    this.openDrawer();

  }

  public onChanges(): void {
    this.budgetForm.valueChanges.subscribe((dirty) => {
      if (this.budgetForm.dirty) {
        this.bDirty = true;
      }
    });
  }

  closeDrawer() {
    this.drawer().close();
  }

  formatNumber(e: any) {
    const options = {
      style: 'decimal',  // Other options: 'currency', 'percent', etc.
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    if (e.value === null)
      e.value = 0.0;
    const formattedWithOptions = e.value.toLocaleString('en-US', options);
    return formattedWithOptions;
  }

  ngOnDestroy(): void { }
}
