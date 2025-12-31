import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  AggregateService,
  ColumnMenuService,
  EditService,
  FilterService,
  GridComponent,
  GridModule,
  PageService,
  ResizeService,
  RowDDService,
  RowDragEventArgs,
  RowSelectEventArgs,
  SaveEventArgs,
  SearchService,
  SortService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import {
  Detail,
  IJournalDetail,
  IJournalDetailUpdate,
  IJournalHeader,
  IJournalTemplate,
} from 'app/models/journals';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IDropDownAccounts, IFunds } from 'app/models';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Observable, ReplaySubject, Subject, Subscription, take, takeUntil } from 'rxjs';

import { AUTH } from 'app/app.config';
import { AccountDropDownComponent } from '../../grid-components/drop-down-account.component';
import { ApplicationStore } from 'app/store/application.store';
import { CommonModule } from '@angular/common';
import { DndComponent } from 'app/features/drag-n-drop/loaddnd/dnd.component';
import { ICurrentPeriod } from 'app/models/period';
import { IParty } from 'app/models/party';
import { ISubType } from 'app/models/subtypes';
import { JournalService } from 'app/services/journal.service';
import { JournalStore } from 'app/store/journal.store';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PartyService } from 'app/services/party.service';
import { Router } from '@angular/router';
import { SubtypeDropDownComponent } from '../../grid-components/drop-down.subtype.component';
import { TemplateDropDownComponent } from '../../grid-components/drop-down.templates.component';
import { ToastrService } from 'ngx-toastr';
import { onModifyJournal } from './journalBuilders';

interface ITransactionType {
  value: string;
  viewValue: string;
  checked: boolean;
}

const imported = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatStepperModule,
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatTabsModule,
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatCardModule,
  NgxMaskDirective,
  MatInputModule,
  MatSidenavModule,
  MatIconModule,
  MatDatepickerModule,
  NgxMatSelectSearchModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatDividerModule,
  NgApexchartsModule,
  MatTableModule,
  MatSelectModule,
  GridModule,
  AccountDropDownComponent,
  SubtypeDropDownComponent,
  TemplateDropDownComponent,

];

@Component({
  selector: 'entry-wizard',
  imports: [imported],
  template: `
    <div id="settings" class="flex flex-col overflow-hidden">
      <mat-drawer-container id="target" class="bg-transparent" [hasBackdrop]="'false'">
        <div class="flex flex-col min-w-0">
          <form
            class="md:p-4 shadow rounded overflow-hidden border-spacing-2"
            [formGroup]="journalEntryForm"
          >
            <mat-vertical-stepper [linear]="true" #verticalStepper>
              <mat-step
                [formGroupName]="'step1'"
                [stepControl]="journalEntryForm.get('step1')"
                #verticalStepperStep1
              >
                <ng-template matStepLabel>Transaction Template</ng-template>

                <section class="flex flex-col md:flex-row w-full mt-2 gap-2">
                  @if (transactionType == 'GL') { @if (templateFilter | async; as templates ) {
                  <mat-form-field class="flex grow mt-2">
                    <mat-label class="md:text-lg  md:ml-2">Template</mat-label>
                    <mat-select
                      [formControl]="templateCtrl"
                      placeholder="Journal Template"
                      #singleTemplateSelect
                      required
                    >
                      <mat-option>
                        <ngx-mat-select-search
                          [formControl]="templateFilterCtrl"
                          [noEntriesFoundLabel]="'No entries found'"
                          [placeholderLabel]="'Search'"
                        >
                        </ngx-mat-select-search>
                      </mat-option>
                      @for (template of templates; track template) {
                      <mat-option [value]="template">{{ template.description }}</mat-option>
                      }
                    </mat-select>
                    <mat-icon
                      color="primary"
                      class="icon-size-5"
                      matSuffix
                      [svgIcon]="'heroicons_solid:document-chart-bar'"
                    ></mat-icon>
                  </mat-form-field>
                  }
                  <mat-form-field class="flex grow mt-2">
                    <mat-label class="text-lg ml-2">Invoice/Reference</mat-label>
                    <input
                      type="text"
                      class="text-right"
                      matInput
                      [placeholder]="'Reference/Invoice'"
                      formControlName="invoice_no"
                    />
                    <mat-icon
                      color="primary"
                      class="icon-size-5"
                      matSuffix
                      [svgIcon]="'heroicons_solid:clipboard-document-list'"
                    ></mat-icon>
                  </mat-form-field>
                  } @if (transactionType != 'GL') { @if (templateFilter | async; as templates ) {
                  <mat-form-field class="flex grow mt-2">
                    <mat-label class="md:text-lg  md:ml-2">Template</mat-label>
                    <mat-select
                      [formControl]="templateCtrl"
                      placeholder="Journal Template"
                      #singleTemplateSelect
                      required
                    >
                      <mat-option>
                        <ngx-mat-select-search
                          [formControl]="templateFilterCtrl"
                          [noEntriesFoundLabel]="'No entries found'"
                          [placeholderLabel]="'Search'"
                        >
                        </ngx-mat-select-search>
                      </mat-option>
                      @for (template of templates; track template) {
                      <mat-option [value]="template">{{ template.description }}</mat-option>
                      }
                    </mat-select>
                    <mat-icon
                      color="primary"
                      class="icon-size-5"
                      matSuffix
                      [svgIcon]="'heroicons_solid:document-chart-bar'"
                    ></mat-icon>
                  </mat-form-field>
                  }
                  <mat-form-field class="flex grow mt-2">
                    <mat-label class="text-lg ml-2">Invoice/Reference</mat-label>
                    <input
                      type="text"
                      class="text-right"
                      matInput
                      [placeholder]="'Reference/Invoice'"
                      formControlName="invoice_no"
                    />
                    <mat-icon
                      color="primary"
                      class="icon-size-5"
                      matSuffix
                      [svgIcon]="'heroicons_solid:clipboard-document-list'"
                    ></mat-icon>
                  </mat-form-field>

                  @if (partyFilter | async; as parties ) {
                  <mat-form-field class="flex grow mt-2">
                    <mat-label class="text-lg ml-2"> Party </mat-label>
                    <mat-select
                      [formControl]="partyCtrl"
                      placeholder="Party"
                      #singlePartySelect
                      required
                    >
                      <mat-option>
                        <ngx-mat-select-search
                          [formControl]="partyFilterCtrl"
                          [noEntriesFoundLabel]="'No entries found'"
                          [placeholderLabel]="'Search'"
                        >
                        </ngx-mat-select-search>
                      </mat-option>
                      @for (party of parties; track party) {
                      <mat-option [value]="party">{{ party.party_id }}</mat-option>
                      }
                    </mat-select>
                    <mat-icon
                      color="primary"
                      class="icon-size-5"
                      matSuffix
                      [svgIcon]="'heroicons_solid:user-plus'"
                    ></mat-icon>
                  </mat-form-field>
                  } }

                  <mat-form-field class="flex grow mt-2 ">
                    <mat-label class="text-lg ml-2">Description</mat-label>
                    <input
                      matInput
                      [formControlName]="'description'"
                      [placeholder]="'Description'"
                      required
                    />
                    <mat-icon
                      color="primary"
                      class="icon-size-5"
                      matSuffix
                      [svgIcon]="'heroicons_solid:document-text'"
                    ></mat-icon>
                  </mat-form-field>

                  <mat-form-field class="flex grow mt-2">
                    <mat-label class="text-lg ml-2">Transaction Amount</mat-label>
                    <input
                      type="text"
                      mask="separator.2"
                      [leadZero]="true"
                      thousandSeparator=","
                      class="text-right"
                      matInput
                      placeholder="Amount"
                      formControlName="amount"
                      [placeholder]="'Transaction Total'"
                    />
                    <mat-icon
                      color="primary"
                      class="icon-size-5"
                      matSuffix
                      [svgIcon]="'heroicons_solid:currency-dollar'"
                    ></mat-icon>
                  </mat-form-field>

                  <mat-form-field class="flex-auto  grow mt-2">
                    <mat-label class="text-lg ml-2 mt-2">Transaction Date</mat-label>
                    <input
                      matInput
                      formControlName="transaction_date"
                      [matDatepicker]="picker"
                      [placeholder]="'Transaction Date'"
                    />
                    <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker color="primary" #picker></mat-datepicker>
                  </mat-form-field>
                </section>

                <section class="flex flex-row md:flex-row gap-2 justify-end">
                  <div class="flex justify-end">
                    <button
                      mat-flat-button
                      color="primary"
                      class="text-gray-100 bg-slate-600 hover:text-gray-800 hover:bg-slate-400 ml-1"
                      (click)="close()"
                      type="button"
                      matTooltip="Cancel Journal"
                    >
                      Close
                    </button>
                  </div>

                  <div class="flex justify-end">
                    <button
                      mat-flat-button
                      color="primary"
                      class="text-gray-100 bg-slate-600 hover:text-gray-800 hover:bg-slate-400 ml-1"
                      (click)="updateHeaderData()"
                      [disabled]="
                        verticalStepperStep1.stepControl.pristine ||
                        verticalStepperStep1.stepControl.invalid
                      "
                      type="button"
                      matTooltip="Create Journal"
                      matStepperNext
                    >
                      Next
                    </button>
                  </div>
                </section>
              </mat-step>

              <mat-step
                [formGroupName]="'step2'"
                [stepControl]="journalEntryForm.get('step2')"
                #verticalStepperStep2
              >
                <ng-template matStepLabel>Post/Edit Transaction</ng-template>
                @if (journalHeader) {
                <ng-container>
                  <div
                    class="text-xl gap-2 m-1 dark:text-slate-100 dark:bg-slate-800 text-slate-800 p-2 bg-slate-300  "
                    mat-dialog-title
                  >
                    {{ 'Journal Update' }}
                  </div>
                  <ejs-grid
                    class="m-1"
                    [dataSource]="journalDetailSignal()"
                    [allowFiltering]="false"
                    [allowPaging]="false"
                    [gridLines]="'Both'"
                    [editSettings]="editSettings"
                    [allowRowDragAndDrop]="true"
                    (actionComplete)="actionComplete($event)"
                    (actionBegin)="actionBegin($event)"
                    (rowSelected)="onRowSelected($event)"
                  >
                    <e-columns>
                      <e-column
                        field="journal_subid"
                        headerText="ID"
                        [visible]="false"
                        isPrimaryKey="true"
                        width="100"
                      ></e-column>
                      <e-column field="child" headerText="Account" width="100"></e-column>
                      <e-column field="fund" headerText="Fund" width="90"></e-column>
                      <e-column
                        field="sub_type"
                        headerText="Sub Type"
                        [visible]="true"
                        width="90"
                      ></e-column>
                      <e-column field="description" headerText="Description" width="150"></e-column>
                      <e-column
                        field="reference"
                        headerText="Reference"
                        [visible]="true"
                        width="120"
                      ></e-column>
                      <e-column
                        field="debit"
                        headerText="Debit"
                        textAlign="Right"
                        width="100"
                        format="N2"
                      ></e-column>
                      <e-column
                        field="credit"
                        headerText="Credit"
                        textAlign="Right"
                        width="100"
                        format="N2"
                      ></e-column>
                    </e-columns>

                    <e-aggregates>
                      <e-aggregate>
                        <e-columns>
                          <e-column type="Sum" field="debit" format="N2">
                            <ng-template #footerTemplate let-data>{{ data.Sum }}</ng-template>
                          </e-column>
                          <e-column type="Sum" field="credit" format="N2">
                            <ng-template #footerTemplate let-data>{{ data.Sum }}</ng-template>
                          </e-column>
                        </e-columns>
                      </e-aggregate>
                    </e-aggregates>
                  </ejs-grid>
                </ng-container>
                <div class="flex justify-end mt-8">
                  <button
                    mat-flat-button
                    class="bg-slate-600 text-gray-100 hover:text-gray-800 hover:bg-slate-400 ml-1"
                    type="button"
                    matTooltip="Close"
                    aria-label="Close"
                    (click)="close()"
                  >
                    Close
                  </button>
                  <button
                    mat-flat-button
                    class="bg-slate-600 text-gray-100 hover:text-gray-800 hover:bg-slate-400 ml-1"
                    type="button"
                    matTooltip="Back to Entry"
                    aria-label="Template"
                    matStepperPrevious
                  >
                    Back
                  </button>
                  <button
                    mat-flat-button
                    class="bg-slate-600 text-gray-100 hover:text-gray-800  hover:bg-slate-400 ml-1"
                    (click)="onUpdate()"
                    type="button"
                    matTooltip="Post Transaction"
                    aria-label="Template"
                    matStepperNext
                  >
                    Save
                  </button>
                </div>
                }
              </mat-step>

              <mat-step>
                <ng-template matStepLabel>Completed</ng-template>

                <ng-container>
                  <div class="flex flex-col h-full mb-2">
                    <mat-icon
                      class="icon-size-20 text-green-700"
                      matSuffix
                      [svgIcon]="'feather:check'"
                    ></mat-icon>
                  </div>
                </ng-container>
                @if (journalHeader) {

                <div class="text-gray-800 text-bold text-3xl m-1">Transaction Confirmed</div>
                <div class="flex">
                  <div class="text-gray-600 m-1">Description : {{ journalHeader.description }}</div>
                </div>
                <div class="flex">
                  <div class="text-gray-600 m-1">
                    Transaction Date : {{ journalHeader.transaction_date }}
                  </div>
                </div>
                <div class="flex">
                  <div class="text-gray-600 m-1">
                    Amount : {{ journalHeader.amount | number : '1.2-2' }}
                  </div>
                </div>

                <div class="flex">
                  <div class="text-gray-600 m-1">
                    The transaction has been completed. Please add a digital artifact to confirm the
                    transaction.
                  </div>
                </div>

                }
                <div class="flex justify-end mt-8">
                  <!--                                        <button class="px-8 mr-2" mat-flat-button [color]="'accent'" type="button"-->
                  <!--                                        (click)="editTransaction()">-->
                  <!--                                            Edit Transaction-->
                  <!--                                        </button>-->
                  <!--                                        <button class="px-8 mr-2" mat-flat-button [color]="'accent'" type="button"-->
                  <!--                                            (click)="onAddArtifact()">-->
                  <!--                                            Add an Artifact-->
                  <!--                                        </button>-->
                  <button
                    class="px-8"
                    mat-flat-button
                    [color]="'primary'"
                    type="reset"
                    (click)="verticalStepper.reset()"
                  >
                    Clear and Restart
                  </button>
                </div>
              </mat-step>
            </mat-vertical-stepper>
          </form>
        </div>
      </mat-drawer-container>
    </div>

    <mat-drawer
      class="w-full md:w-87.5 bg-white-100 dark:bg-gray-900 border-white"
      #drawer
      [opened]="false"
      mode="side"
      [position]="'end'"
      [disableClose]="false"
    >
      <form
        [formGroup]="detailForm"
        class="flex flex-col h-full ml-1 mr-1 text-gray-800 bg-gray-200 dark:bg-gray-900 dark:text-gray-100"
      >
        <mat-card
          class="mat-elevation-z8 border h-full bg-gray-200 dark:bg-gray-900 dark:text-gray-100 text-gray-500"
        >
          <div
            class="flex flex-col w-full filter-article filter-interactive text-gray-700 rounded-lg"
          >
            <div class="text-2xl gap-2 m-1 text-gray-100 p-2 bg-slate-700  " mat-dialog-title>
              {{ 'Journal Update' }}
            </div>
          </div>
          <section class="flex flex-col gap-1">
            @if (accountList().length > 0) {
            <account-drop-down
              [dropdownList]="accountList()"
              controlKey="account"
              label="Account"
              #accountDropDown
            ></account-drop-down>
            } @if (subtypeList().length > 0) {
            <subtype-drop-down
              [dropdownList]="subtypeList()"
              controlKey="subtype"
              label="Sub Type"
              #subtypeDropDown
            ></subtype-drop-down>
            } @if (templateList().length > 0) {
            <template-drop-down
              [dropdownList]="templateList()"
              controlKey="template"
              label="Template"
              #templateDropDown
            ></template-drop-down>
            }

            <!--                        -->
            <!--                        <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow dark:text-gray-100 text-gray-800">-->
            <!--                            <mat-label class="text-lg ml-2 dark:text-gray-100 text-gray-800">Funds</mat-label>-->
            <!--                            <mat-select class="dark:text-gray-100 text-gray-800"  placeholder="Fund" formControlName="fund">-->
            <!--                                @for (item of fundList(); track item) {-->
            <!--                                <mat-option [value]="item"> {{ item.fund }} - {{ item.description }}-->
            <!--                                </mat-option>-->
            <!--                                }-->
            <!--                            </mat-select>-->
            <!--                            <mat-icon class="icon-size-6" matSuffix color=primary [svgIcon]="'heroicons_solid:briefcase'"></mat-icon>-->
            <!--                        </mat-form-field>-->
            <!--                        -->

            <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow dark:text-gray-100 text-gray-800">
              <mat-label class="text-lg ml-2 dark:text-gray-100 text-gray-800">Reference</mat-label>
              <input
                class="text-lg ml-2 dark:text-gray-100 text-gray-800"
                matInput
                placeholder="Reference"
                formControlName="reference"
                [placeholder]="'Reference'"
              />
              <mat-icon
                class="icon-size-6"
                matSuffix
                color="primary"
                [svgIcon]="'heroicons_solid:clipboard-document-list'"
              ></mat-icon>
            </mat-form-field>

            <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow dark:text-gray-100 text-gray-800">
              <mat-label class="text-lg ml-2 dark:text-gray-100 text-gray-800"
                >Description</mat-label
              >
              <input
                class="text-lg ml-2 dark:text-gray-100 text-gray-800"
                matInput
                placeholder="Description"
                formControlName="description"
                [placeholder]="'Description'"
              />
              <mat-icon
                class="icon-size-6"
                matSuffix
                color="primary"
                [svgIcon]="'mat_solid:subject'"
              ></mat-icon>
            </mat-form-field>
          </section>

          <section class="flex flex-col md:flex-row gap-2 mt-1">
            <mat-form-field class="ml-2 mt-1 grow">
              <mat-label class="text-lg ml-2 dark:text-gray-100 text-gray-800">Debits</mat-label>
              <input
                class="!dark:text-gray-100 text-gray-800! text-lg text-right"
                mask="separator.2"
                [leadZero]="true"
                thousandSeparator=","
                matInput
                [placeholder]="'Debit'"
                formControlName="debit"
              />
              <mat-icon
                class="icon-size-6"
                matSuffix
                color="primary"
                [svgIcon]="'heroicons_solid:currency-dollar'"
              ></mat-icon>
            </mat-form-field>

            <mat-form-field class="grow mr-2 mt-1">
              <mat-label class="text-lg ml-2 dark:text-gray-100  text-gray-800">Credits</mat-label>
              <input
                type="text"
                mask="separator.2"
                [leadZero]="true"
                thousandSeparator=","
                class="text-right"
                matInput
                [placeholder]="'Credit'"
                formControlName="credit"
              />
              <mat-icon
                class="icon-size-6"
                matSuffix
                color="primary"
                [svgIcon]="'heroicons_solid:currency-dollar'"
              ></mat-icon>
            </mat-form-field>
          </section>
        </mat-card>
      </form>
      <div mat-dialog-actions class="gap-2 mb-3 mt-5">
        <button
          mat-icon-button
          color="primary"
          class="bg-teal-700 text-slate-300 ml-1"
          (click)="onUpdate()"
          matTooltip="Update Line Item"
          aria-label="hover over"
        >
          <span class="e-icons e-save"></span>
        </button>

        <button
          mat-icon-button
          color="primary"
          class="bg-teal-700 text-slate-300 ml-1"
          (click)="onDeleteDetail()"
          matTooltip="Remove Current Line"
          aria-label="hover over"
        >
          <span class="e-icons e-circle-remove"></span>
        </button>

        <button
          mat-icon-button
          color="primary"
          class="bg-teal-700 text-slate-300 ml-1"
          (click)="closeDrawer()"
          matTooltip="Close Edit"
          aria-label="hovered over"
        >
          <span class="e-icons e-chevron-left"></span>
        </button>
      </div>
    </mat-drawer>
  `,
  encapsulation: ViewEncapsulation.None,

  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    provideNgxMask(),
    SortService,
    FilterService,
    ToolbarService,
    EditService,
    SearchService,
    AggregateService,
    PageService,
    ColumnMenuService,
    ResizeService,
    RowDDService,
    JournalService,
  ],
  styles: `
        :host ::ng-deep .mdc-text-field--focused .mdc-notched-outline__leading {
            border-color: black !important;
        }

        :host ::ng-deep .mdc-text-field--focused .mdc-notched-outline__trailing {
            border-color: black !important;
        }

        :host ::ng-deep .mat-mdc-form-field-appearance-legacy .mat-mdc-form-field-flex {
            border-color: gray !important;
        }

        .mat-datepicker-toggle-icon {
             color: red !important; /* Or a specific hex code */
        }

        .mat-datepicker-toggle svg {
             fill: -webkit-text !important; /* For SVG icons, use fill instead of color */
        }

    `,
})
export class EntryWizardComponent implements OnInit, OnDestroy, AfterViewInit {
  private journalService = inject(JournalService);
  private formBuilder = inject(FormBuilder);
  private partyService = inject(PartyService);
  private router = inject(Router);
  private auth = inject(AUTH);
  private matDialog = inject(MatDialog);
  private toastr = inject(ToastrService);

  // Inputs

  public accountList = input<IDropDownAccounts[]>();
  public templateList = input<IJournalTemplate[]>();
  public subtypeList = input<ISubType[]>();
  public fundList = input<IFunds[]>();

  // Array of details
  public journalDetailSignal = signal<IJournalDetail[]>(null);

  public journalEntryForm: FormGroup;
  public journalUpdateForm: FormGroup;

  public transactionType = 'GL';
  public isVerified = false;

  public journalHeader: IJournalHeader;

  public journal_id = 1;
  public editSettings: Object;

  public message?: string;
  public bDirty = false;
  public currentPeriod: number;
  public currentYear: number;

  public template: FormControl<string> = new FormControl<string>(null);
  public templateCtrl: FormControl<IJournalTemplate> = new FormControl<IJournalTemplate>(null);
  public templateFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public templateFilter: ReplaySubject<IJournalTemplate[]> = new ReplaySubject<IJournalTemplate[]>(
    1
  );

  public partyList: IParty[] = [];
  public partyCtrl: FormControl<IParty> = new FormControl<IParty>(null);
  public partyFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public partyFilter: ReplaySubject<IParty[]> = new ReplaySubject<IParty[]>(1);

  public debitAccounts: IDropDownAccounts[] = [];
  public debitCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
  public debitAccountFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<
    IDropDownAccounts[]
  >(1);

  public creditAccounts: IDropDownAccounts[] = [];
  public creditAccountFilterCtrl: FormControl<string> = new FormControl<string>('');
  public filteredCreditAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<
    IDropDownAccounts[]
  >(1);

  protected _onCreditDestroy = new Subject<void>();
  protected _onDebitDestroy = new Subject<void>();
  protected _onTemplateDestroy = new Subject<void>();
  protected _onDestroyDebitAccountFilter = new Subject<void>();
  protected _onDestroyCreditAccountFilter = new Subject<void>();
  protected _onDestroyTemplateFilter = new Subject<void>();
  protected _onDestroy = new Subject<void>();

  public cancelWizard = output();

  detailForm = new FormGroup({
    accounts: new FormGroup({
      dropdown: new FormControl(0, Validators.required),
    }),
    subtype: new FormGroup({
      dropdown: new FormControl('', Validators.required),
    }),
    fund: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    debit: new FormControl(0, Validators.required),
    credit: new FormControl(0, Validators.required),
    reference: new FormControl('', Validators.required),
  });

  // Grid Options
  public selectionOptions: Object;
  public journalDetails: IJournalDetail[] = [];

  public accountsListSubject: Subscription;
  public gridControl = viewChild<GridComponent>('grid');
  public currentRowData: any;

  journalStore = inject(JournalStore);

  drawer = viewChild<MatDrawer>('drawer');

  templateDropDown = viewChild<TemplateDropDownComponent>('templateDropDown');

  accountDropDown = viewChild<AccountDropDownComponent>('accountDropDown');
  subtypeDropDown = viewChild<SubtypeDropDownComponent>('subtypeDropDown');

  @ViewChild('singleDebitSelect', { static: true }) singleDebitSelect: MatSelect;
  @ViewChild('singleCreditSelect', { static: true }) singleCreditSelect: MatSelect;
  @ViewChild('singleTemplateSelect', { static: true }) singleTemplateSelect: MatSelect;
  @ViewChild('singlePartySelect', { static: true }) singlePartySelect: MatSelect;

  public bHeaderDirty = false;

  bNewTransaction: any;
  public selectedOption: string;

  types: ITransactionType[] = [
    { value: 'GL', viewValue: 'General', checked: true },
    { value: 'AP', viewValue: 'Payments', checked: false },
    { value: 'AR', viewValue: 'Receipts', checked: false },
  ];

  private updateDetailForm(journalDetail: IJournalDetail) {
    const accountString = journalDetail.child.toString();

    this.detailForm.patchValue({
      description: journalDetail.description,
      accounts: {
        dropdown: journalDetail.child,
      },
      subtype: {
        dropdown: journalDetail.sub_type,
      },
      fund: journalDetail.fund,
      debit: journalDetail.debit,
      credit: journalDetail.credit,
      reference: journalDetail.reference,
    });

    this.bHeaderDirty = false;

    this.accountDropDown().setDropdownValue(accountString);
    this.subtypeDropDown().setDropdownValue(journalDetail.sub_type);

    this.openDrawer();
  }

  public close() {
    this.cancelWizard.emit();
  }

  public onRowSelected(args: RowSelectEventArgs): void {
    const queryData: any = args.data;
    // const urlTree = this.router.createUrlTree(["journals/gl", queryData.journal_id]);
    this.refreshJournalForm(queryData);
    this.closeDrawer();
  }

  public onBack() {
    this.router.navigate(['edit-journals']);
  }

  public refreshJournalForm(header: IJournalHeader) {
    this.journalHeader = header;
    this.journalUpdateForm.patchValue({
      description: header.description,
      amount: header.amount,
      transaction_date: header.transaction_date,
      invoice_no: header.invoice_no,
      due_date: header.due_date,
    });

    this.templateCtrl.setValue(
      this.templateList().find((x) => x.template_name === header.template_name)
    );

    this.partyCtrl.setValue(this.partyList.find((x) => x.party_id === header.party_id));

    this.bHeaderDirty = false;
  }

  editTransaction() {
    this.router.navigate(['journals/gl', this.journal_id]);
  }

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  appStore = inject(ApplicationStore);

  template$: Observable<IJournalTemplate[]>;
  accountsDropdown$: Observable<IDropDownAccounts[]>;
  funds$: Observable<IFunds[]>;
  subtype$: Observable<ISubType[]>;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.onPeriod('Initialize Period');

    this.selectedOption = this.types[0].value;

    this.partyService
      .read()
      .pipe(takeUntil(this._onDestroy))
      .subscribe((party) => {
        this.partyList = party;
        this.partyFilter.next(this.partyList.slice());
      });

    this.journalService.getLastJournalNo().subscribe((journal_no) => {
      this.journal_id = Number(journal_no);
    });

    this.editSettings = {
      allowEditing: true,
      allowAdding: false,
      allowDeleting: false,
    };

    // this.templateList = this.appStore.vm().tmp;
    // this.templateFilter.next(this.templateList);

    this.createEmptyForms();
    this.onChanges();
  }

  onPeriod(e: string) {
    console.debug('Period : ', e);

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
        this.currentPeriod = prd[0].period_id;
        this.currentYear = prd[0].period_year;
      }
    }
    /// this.store.setCurrentPeriod(this.currentPeriod)
  }

  public onClear() {
    this.journalService.getLastJournalNo().subscribe((journal_no) => {
      this.journal_id = Number(journal_no);
    });
  }

  public createEmptyForms() {
    let currentDate = new Date().toISOString().split('T')[0];

    this.journalUpdateForm = this.formBuilder.group({
      debitAccountFilterCtrl: ['', Validators.required],
      description: ['', Validators.required],
      child: ['', Validators.required],
      fund: ['', Validators.required],
      sub_type: ['', Validators.required],
      party: ['', Validators.required],
      reference: ['', Validators.required],
      debit: ['', Validators.required],
      credit: ['', Validators.required],
    });

    this.journalEntryForm = this.formBuilder.group({
      step1: this.formBuilder.group({
        templateCtrl: new FormControl({
          dropdown: new FormControl('', Validators.required),
        }),
        description: ['', Validators.required],
        amount: ['', Validators.required],
        transaction_date: [currentDate, Validators.required],
        partyCtrl: new FormControl({
          dropdown: new FormControl('', Validators.required),
        }),
        invoice_no: ['', Validators.required],
        due_date: [currentDate, Validators.required],
      }),
      step2: this.formBuilder.group({}),
    });
  }

  onOpenSettings() {}
  onPrinting() {}

  public onChanges(): void {
    this.debitAccountFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyDebitAccountFilter))
      .subscribe(() => {
        this.filterDebitAccounts();
      });
    this.creditAccountFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyCreditAccountFilter))
      .subscribe(() => {
        this.filterCreditAccounts();
      });
    this.templateFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyTemplateFilter))
      .subscribe(() => {
        this.filterTemplate();
      });
    this.partyFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyTemplateFilter))
      .subscribe(() => {
        this.filterParty();
      });
    this.journalEntryForm.valueChanges.subscribe((dirty) => {
      if (this.journalEntryForm.dirty) {
        this.bDirty = true;
      }
    });

    this.templateCtrl.valueChanges.subscribe((value) => {
      this.bDirty = true;
      this.createJournalDetailsFromTemplate(value);
    });
  }

  public onTransTypeClicked(e: any) {
    this.selectedOption = e;
    console.log(e);
  }

  public updateForm(journalDetail: IJournalDetail) {
    const accountString = journalDetail.child.toString();
    this.debitCtrl.setValue(this.debitAccounts.find((x) => x.child === accountString));

    this.journalUpdateForm.patchValue({
      debitAccountFilterCtrl: journalDetail.child.toString(),
      description: journalDetail.description,
      sub_type: journalDetail.sub_type,
      debit: journalDetail.debit,
      credit: journalDetail.credit,
      reference: journalDetail.reference,
      fund: journalDetail.fund,
    });
  }

  openDrawer() {
    this.bDirty = false;
    this.drawer().open();
  }

  onDeleteDetail() {
    throw new Error('Method not implemented.');
  }

  closeDrawer() {
    this.drawer().close();
  }

  public actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'refresh') {
      args.cancel = true;
      return;
    }

    if (args.requestType === 'beginEdit' || args.requestType !== 'delete') {
      args.cancel = true;
      const subid = args.rowData as IJournalDetail;

      const currentSub = this.journalDetailSignal().find(
        (x) => x.journal_subid === subid.journal_subid
      );

      const currentDate = new Date().toISOString().split('T')[0];
      const data = args.rowData as IJournalDetail;
      console.log(JSON.stringify(data));
      const email = '@' + this.auth.currentUser.email.split('@')[0];
      const debit = currentSub.debit;
      const credit = currentSub.credit;

      let JournalDetail = {
        journal_id: data.journal_id,
        journal_subid: data.journal_subid,
        account: data.account,
        child: data.child,
        child_desc: data.child_desc,
        description: data.description,
        create_date: currentDate,
        create_user: email,
        sub_type: data.sub_type,
        debit: debit,
        credit: credit,
        reference: '',
        fund: data.fund,
      } as IJournalDetail;

      this.updateForm(JournalDetail);
      this.openDrawer();
    }

    if (args.requestType === 'save') {
      args.cancel = true;

      const subid = args.rowData as IJournalDetail;
      const currentSub = this.journalDetailSignal().find(
        (x) => x.journal_subid === subid.journal_subid
      );

      const currentDate = new Date().toISOString().split('T')[0];
      const data = args.rowData as IJournalDetail;
      const email = '@' + this.auth.currentUser.email.split('@')[0];
      const debit = currentSub.debit;
      const credit = currentSub.credit;

      let JournalDetail = {
        journal_id: data.journal_id,
        journal_subid: data.journal_subid,
        account: data.account,
        child: data.child,
        child_desc: data.child_desc,
        description: data.description,
        create_date: currentDate,
        create_user: email,
        sub_type: data.sub_type,
        debit: debit,
        credit: credit,
        reference: data.reference,
        fund: data.fund,
      } as IJournalDetail;

      this.onSavedDetails(JournalDetail);
    }
  }

  public OnCardDoubleClick(data: any): void {
    this.currentRowData = data;
    const email = this.auth.currentUser.email;
    const dDate = new Date();
    const currentDate = dDate.toISOString().split('T')[0];
    console.debug('data :', JSON.stringify(data));

    const journalDetail = {
      journal_id: data.journal_id,
      journal_subid: data.journal_subid,
      account: data.account,
      child: data.child,
      child_desc: data.child_desc,
      description: data.description,
      create_date: currentDate,
      create_user: email,
      sub_type: data.sub_type,
      debit: data.debit,
      credit: data.credit,
      reference: data.reference,
      fund: data.fund,
    } as IJournalDetail;

    this.currentRowData = journalDetail;

    this.updateForm(journalDetail);
    this.onChanges();
  }

  rowDrag(args: RowDragEventArgs): void {
    this.message = `rowDrag event triggered ${JSON.stringify(args.data)}`;
    console.debug(this.message);
    (args.rows as Element[]).forEach((row: Element) => {
      row.classList.add('drag-limit');
    });
  }

  rowDrop(args: RowDragEventArgs): void {
    this.message = `Drop  ${args.originalEvent} ${JSON.stringify(args.data)}`;
    console.debug(this.message);
    const value = [];
    for (let r = 0; r < (args.rows as Element[]).length; r++) {
      value.push((args.fromIndex as number) + r);
    }

    this.gridControl().reorderRows(value, args.dropIndex as number);

    // this.onSavedDetails(args.data[0]);
  }

  actionComplete($event) {
    if ($event.requestType === 'save') {
      this.onSavedDetails($event.data);
    }
  }

  onSavedDetails(e: IJournalDetail) {
    this.journalStore.createJournalDetail(e);
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  protected setInitialValue() {
    if (this.templateFilter)
      this.templateFilter.pipe(take(1), takeUntil(this._onTemplateDestroy)).subscribe(() => {
        if (this.singleTemplateSelect != null || this.singleTemplateSelect != undefined)
          this.singleTemplateSelect.compareWith = (a: IJournalTemplate, b: IJournalTemplate) =>
            a && b && a.template_ref === b.template_ref;
      });

    if (this.partyFilter)
      this.partyFilter.pipe(take(1), takeUntil(this._onTemplateDestroy)).subscribe(() => {
        if (this.singlePartySelect != null || this.singlePartySelect != undefined)
          this.singlePartySelect.compareWith = (a: IParty, b: IParty) =>
            a && b && a.party_id === b.party_id;
      });

    if (this.filteredDebitAccounts)
      this.filteredDebitAccounts.pipe(take(1), takeUntil(this._onDebitDestroy)).subscribe(() => {
        if (this.singleDebitSelect != null || this.singleDebitSelect != undefined)
          this.singleDebitSelect.compareWith = (a: IDropDownAccounts, b: IDropDownAccounts) =>
            a && b && a.child === b.child;
      });

    if (this.filteredCreditAccounts)
      this.filteredCreditAccounts.pipe(take(1), takeUntil(this._onCreditDestroy)).subscribe(() => {
        if (this.singleCreditSelect != null || this.singleCreditSelect != undefined)
          this.singleCreditSelect.compareWith = (a: IDropDownAccounts, b: IDropDownAccounts) =>
            a && b && a.child === b.child;
      });
  }

  protected filterCreditAccounts() {
    if (!this.creditAccounts) {
      return;
    }
    // get the search keyword
    let search = this.creditAccountFilterCtrl.value;
    if (!search) {
      this.filteredCreditAccounts.next(this.creditAccounts.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCreditAccounts.next(
      this.creditAccounts.filter(
        (account) => account.description.toLowerCase().indexOf(search) > -1
      )
    );
  }

  protected filterDebitAccounts() {
    if (!this.debitAccounts) {
      return;
    }
    // get the search keyword
    let search = this.debitAccountFilterCtrl.value;
    if (!search) {
      this.filteredDebitAccounts.next(this.debitAccounts.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredDebitAccounts.next(
      this.debitAccounts.filter((account) => account.description.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterParty() {
    if (!this.partyList) {
      return;
    }
    // get the search keyword
    let search = this.partyFilterCtrl.value;
    if (!search) {
      this.partyFilter.next(this.partyList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.partyFilter.next(
      this.partyList.filter((party) => party.party_id.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterTemplate() {
    if (!this.templateList()) {
      return;
    }
    // get the search keyword
    let search = this.templateFilterCtrl.value;
    if (!search) {
      this.templateFilter.next(this.templateList().slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.templateFilter.next(
      this.templateList().filter(
        (template) => template.description.toLowerCase().indexOf(search) > -1
      )
    );
  }

  public createJournalDetailsFromTemplate(value: IJournalTemplate) {
    this.transactionType = value.journal_type;
    this.journalStore.loadTemplateDetails(value.template_ref);
  }

  refresh() {
    this.journalStore.loadTemplateDetails(this.templateCtrl.value.template_ref);
  }

  public updateHeaderData() {
    const updateDate = new Date().toISOString().split('T')[0];
    const inputs = { ...this.journalEntryForm.value };
    const transactionDate = new Date(inputs.step1.transaction_date).toISOString().split('T')[0];
    const dueDateString = new Date(inputs.step1.due_date).toISOString().split('T')[0];
    const email = '@' + this.auth.currentUser?.email.split('@')[0];
    let count: number = 1;
    let party: any;
    let party_id: string;

    this.journalDetails = [];

    const template = this.templateCtrl.value;
    const template_name = this.templateList().find(
      (x) => x.template_name === template.template_name
    ).template_name;

    if (template.journal_type !== 'GL') {
      party = this.partyCtrl.getRawValue();
      party_id = this.partyList.find((x) => x.party_id === party.party_id).party_id;
    } else {
      party_id = '';
    }

    if (inputs.step1.amount === 0) {
      return;
    }

    let journalHeader: IJournalHeader = {
      journal_id: this.journal_id,
      description: inputs.step1.description,
      booked: false,
      booked_date: updateDate,
      booked_user: email,
      create_date: updateDate,
      due_date: dueDateString,
      create_user: email,
      period: Number(this.currentPeriod),
      period_year: Number(this.currentYear),
      transaction_date: transactionDate,
      status: 'OPEN',
      type: template.journal_type,
      sub_type: inputs.step1.sub_type,
      amount: Number(inputs.step1.amount),
      party_id: party_id,
      template_name: template_name,
      template_ref: template.template_ref,
      invoice_no: inputs.step1.invoice_no,
    };

    this.journalHeader = journalHeader;

    this.journalStore.readTemplateDetails().forEach((templateDetail) => {
      let journalDetail: IJournalDetailUpdate = {
        journal_id: this.journal_id,
        journal_subid: count,
        account: Number(templateDetail.account),
        child: Number(templateDetail.child),
        description: templateDetail.description,
        create_date: updateDate,
        create_user: email,
        sub_type: templateDetail.sub_type,
        debit: templateDetail.debit * journalHeader.amount,
        credit: templateDetail.credit * journalHeader.amount,
        reference: this.journalHeader.invoice_no,
        fund: templateDetail.fund,
      };
      this.journalDetails.push(journalDetail);
      count = count + 1;
    });

    this.journalDetailSignal.set(this.journalDetails);

    this.bDirty = true;
  }

  public onUpdate() {
    const inputs = { ...this.journalEntryForm.value };
    const momentDate = new Date(inputs.step1.transaction_date).toISOString().split('T')[0];
    const userName = '@' + this.auth.currentUser?.email.split('@')[0];

    let period = Number(this.currentPeriod);
    let year = Number(this.currentYear);

    if (period === 0 || period === null || period === undefined || isNaN(period)) {
      period = 1;
      year = 2025;
    }

    const template = this.templateCtrl.value;
    const party = this.partyCtrl.value;
    let party_id: string;

    if (party === null || party === undefined) {
      party_id = '';
    } else {
      party_id = party.party_id;
    }

    if (inputs.step1.amount === 0) {
      this.toastr.error('Amount cannot be zero');
    }

    const journalHeader: IJournalHeader = {
      journal_id: this.journalHeader.journal_id,
      description: inputs.step1.description,
      booked: false,
      booked_date: momentDate,
      booked_user: userName,
      create_date: momentDate,
      create_user: userName,
      due_date: momentDate,
      transaction_date: momentDate,
      period: period,
      period_year: year,
      status: 'OPEN',
      type: template.journal_type,
      sub_type: '',
      amount: inputs.step1.amount,
      party_id: party_id,
      invoice_no: inputs.step1.invoice_no,
      template_name: template.template_name,
      template_ref: template.template_ref,
    };

    var detail: Detail[] = this.journalDetailSignal();

    this.onSaveBatch(detail, journalHeader);
  }

  onSaveBatch(details: any[], header: IJournalHeader) {
    let template = this.templateCtrl.value;
    let maxJournalId = this.journalStore.maxJournal();
    const userName = '@' + this.auth.currentUser?.email.split('@')[0];

    let journal = onModifyJournal(
      header,
      userName,
      details,
      template,
      Number(header.period),
      Number(header.period_year),
      maxJournalId
    );
    if (journal === null || journal === undefined) {
      this.toastr.error('Error updating journal');
      return;
    }

    console.debug('Journal to update : ', JSON.stringify(journal));

    this.journalStore.createJournal(journal);
    this.bHeaderDirty = false;
    this.createEmptyForms();
  }

  onAddArtifact() {
    const dialogRef = this.matDialog.open(DndComponent, {
      width: '600px',
      data: {
        journal_id: this.journalHeader.journal_id,
        reference_no: this.journalHeader.journal_id,
        description: this.journalHeader.description,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === undefined) {
        result = { event: 'Cancel' };
      }
      switch (result.event) {
        case 'Create':
          console.debug(result.data);
          break;
        case 'Cancel':
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

    if (this._onDestroyDebitAccountFilter) {
      this._onDestroyDebitAccountFilter.unsubscribe();
    }

    if (this._onDestroyCreditAccountFilter) {
      this._onDestroyCreditAccountFilter.unsubscribe();
    }

    if (this._onDestroyTemplateFilter) {
      this._onDestroyTemplateFilter.unsubscribe();
    }

    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onAddLineJournalDetail() {
    throw new Error('Method not implemented.');
  }

  onAddEvidence() {
    throw new Error('Method not implemented.');
  }

  onCreateTemplate() {
    throw new Error('Method not implemented.');
  }

  ShowAlert(message: string, response: string) {
    if (response == 'pass') {
      this.toastr.success(message);
    } else {
      this.toastr.error(message);
    }
    return;
  }
}

//{"headers":{"normalizedNames":{},"lazyUpdate":null},"status":200,"statusText":"OK","url":"http://localhost:8080/v1/create_journal",
// "ok":false,"name":"HttpErrorResponse","message":"Http failure during parsing for http://localhost:8080/v1/create_journal",
// "error":{"error":{},"text":"
//
//{\"journal_id\":204,\"journal_subid\":1,\"account\":1000,\"child\":1001,\"sub_type\":\"Operating\",\"description\":\"Office Expenses\",\"debit\":0,\"credit\":5000.00,\"create_date\":\"2025-02-01\",\"create_user\":\"@mstoews.10.14\",\"fund\":\"Reserve\",\"reference\":\"\"}{\"journal_id\":204,\"journal_subid\":2,\"account\":6000,\"child\":6030,\"sub_type\":\"Operating\",\"description\":\"Office Expenses\",\"debit\":5000.00,\"credit\":0,\"create_date\":\"2025-02-01\",\"create_user\":\"@mstoews.10.14\",\"fund\":\"Reserve\",\"reference\":\"\"}"}}

//  {"journalHeader":{"
// journal_id":26,
// "description":
// "Description",
// "type":"GL",
// "booked_user":"@mstoews",
// "transaction_date":"2025-09-17",
// "amount":500,
// "template_name":"General GL",
// "invoice_no":"TEST",
// "party_id":"",
// "booked":false,
// "due_date":"2025-09-17"},
// "details":
// {"detail":[
// {"journal_id":26,"journal_subid":1,"account":6000,"child":1001,"description":"Water Expense for month of January ","create_date":"2025-09-17","create_user":"@mstoews","sub_type":"Maintenance","debit":500,"credit":0,"reference":"TEST","fund":"Maintenance"},
// {"journal_id":26,"journal_subid":2,"account":3000,"child":6060,"description":"Water Expense ","create_date":"2025-09-17","create_user":"@mstoews","sub_type":"Maintenance","debit":0,"credit":500,"reference":"TEST","fund":"Reserve"}]}}
