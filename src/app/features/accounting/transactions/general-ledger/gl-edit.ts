import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { map, ReplaySubject, Subject, take, takeUntil } from "rxjs";
import { CommonModule, NgTemplateOutlet } from "@angular/common";
import { DndComponent } from "app/features/drag-n-drop/loaddnd/dnd.component";
import { GridMenubarStandaloneComponent } from "../../grid-components/grid-menubar.component";
import { Location } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";

import { MatDialog } from "@angular/material/dialog";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { FuseConfirmationService } from "app/services/confirmation";

import { DropDownListAllModule } from "@syncfusion/ej2-angular-dropdowns";
import { AUTH } from "app/app.config";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { IDropDownAccounts, IFunds } from "app/models";
import { onModifyJournal } from "./journalBuilders";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { CUSTOM_DATE_FORMATS } from "./date-format"; // Adjust path as needed

import {
  ContextMenuComponent,
  ContextMenuModule,
  MenuEventArgs,
  MenuItemModel,
} from "@syncfusion/ej2-angular-navigations";

import {
  AggregateService,
  EditService,
  FilterService,
  GridModule,
  RowDDService,
  SaveEventArgs,
  SortService,
  ToolbarService,
  GridComponent,
  SearchService,
  RowSelectEventArgs,
  GroupService,
  ColumnMenuService,
  ResizeService,
  ExcelExportService,
  PdfExportService,
  ContextMenuService,
  ReorderService,
  IEditCell,
} from "@syncfusion/ej2-angular-grids";

import {
  IJournalDetail,
  IJournalDetailTemplate,
  IJournalHeader,
  IJournalTemplate,
  IArtifacts,
  ITemplateParams,
  IJournalDetailUpdate,
} from "app/models/journals";

import { Router, ActivatedRoute } from "@angular/router";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";

import {
  Splitter,
  SplitterComponent,
  SplitterModule,
} from "@syncfusion/ej2-angular-layouts";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { IParty } from "../../../../models/party";
import { ISubType } from "app/models/subtypes";
import { Toast, ToastrService } from "ngx-toastr";
import { AccountDropDownComponent } from "../../grid-components/drop-down-account.component";
import { SubtypeDropDownComponent } from "../../grid-components/drop-down.subtype.component";
import { JournalStore } from "app/store/journal.store";

import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { GlDetail } from "./gl-detail";
import { TransactionEvidence } from "./transaction-evidence";
import { ICurrentPeriod, IPeriodStartEndParam } from "app/models/period";
import { FundsDropDownComponent } from "../../grid-components/drop-down.funds.component";
import { EntryWizardComponent } from "./wizard-entry";

import { refreshImagePosition } from "@syncfusion/ej2-spreadsheet";
import { Hotkeys } from "app/services/hotkeys";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";

const imp = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  GridMenubarStandaloneComponent,
  NgxMaskDirective,
  NgxMatSelectSearchModule,
  ContextMenuModule,
  GridModule,
  DropDownListAllModule,
  SplitterModule,
  AccountDropDownComponent,
  SubtypeDropDownComponent,
  FundsDropDownComponent,
  NgTemplateOutlet,
  GlDetail,
  TransactionEvidence,
  MatTabsModule,
  EntryWizardComponent,
  NgTemplateOutlet,
  MatButtonModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatIconModule,
  MatDatepickerModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatCardModule
]


@Component({
  template: `
    <div
      id="target"
      class="flex flex-col w-full filter-article filter-interactive "
    >
      <div class="sm:hide md:visible ml-5 mr-5">
        <grid-menubar
          #menuBar
          class="pl-5 pr-5"
          (save)="transaction_details().onUpdate()"
          (print)="onPrint()"
          (exportXL)="onExportXL($event)"
          (period)="onPeriod($event)"
          (back)="onBack()"
          (clone)="onClone('GL')"
          (cancelTransaction)="onCancelTransaction()"
          (commitTransaction)="onCommitTransaction()"
          (addEvidence)="onAddEvidence()"
          (new)="onNewJournal()"
          (template)="onTemplateMaintenance()"
          (editType)="onEditMode($event)"
          (startAndEnd)="onStartAndEnd($event)"
          [inTitle]="toolbarTitle"
          [prd]="journalStore.currentPeriod()"
          [prd_year]="journalStore.currentYear()"
          [showCalendar]="true"
          [showNew]="true"
          [showTemplate]="true"
          [showBack]="true"
          [showClone]="true"
          [showCancelTransaction]="true"
          [showAddEvidence]="true"
          [showCloseTransaction]="true"
          [showPrint]="true"
          [showPeriod]="false"
          [showEditType]="false"
        >
        </grid-menubar>
      </div>

      @defer (on viewport; on timer(200ms)) {
      <mat-drawer-container
        id="target"
        class="control-section default-splitter flex flex-col h-[calc(100vh-14rem)] ml-5 mr-5 overview-hidden bg-slate-100 dark:bg-slate-900 dark:text-slate-200 text-slate-500"
        [hasBackdrop]="'false'"
      >
        <mat-drawer
          class="w-full md:w-[350px] bg-white-100 dark:bg-slate-900 border-white"
          #drawer
          [opened]="false"
          mode="side"
          [position]="'end'"
          [disableClose]="false"
        >
          <form
            [formGroup]="detailForm"
            class="flex flex-col h-full ml-1 mr-1 text-slate-800 bg-slate-100 dark:bg-slate-900 dark:text-slate-100"
          >
            <mat-card
              class="mat-elevation-z8 border h-full bg-slate-100 dark:bg-slate-900 dark:text-slate-100 text-slate-500"
            >
              <div
                class="flex flex-col w-full filter-article filter-interactive text-slate-300 rounded-lg"
              >
                <div
                  class="text-xl gap-2 m-1 dark:text-slate-100 dark:bg-slate-800 text-slate-800 p-2 bg-slate-300  "
                  mat-dialog-title
                >
                  {{ "Journal Update" }}
                </div>
              </div>
              <section class="flex flex-col gap-1">
                @if (accountList.length > 0 ) {
                <account-drop-down
                  [dropdownList]="accountList"
                  controlKey="account"
                  label="Account"
                  #accountDropDown
                ></account-drop-down>
                } @if (subtypeList.length > 0 ) {
                <subtype-drop-down
                  [dropdownList]="subtypeList"
                  controlKey="sub_type"
                  label="Sub Type"
                  #subtypeDropDown
                ></subtype-drop-down>
                } @if (fundList.length > 0) {
                <funds-drop-down
                  [dropdownList]="fundList"
                  controlKey="fund"
                  label="Funds"
                  #fundDropDown
                ></funds-drop-down>
                }

                <mat-form-field
                  class="flex-col ml-2 mr-2 mt-1 grow dark:text-slate-100 text-slate-800"
                >
                  <mat-label
                    class="text-lg ml-2 dark:text-slate-100 text-slate-800"
                    >Reference</mat-label
                  >
                  <input
                    class="text-lg ml-2 dark:text-slate-100 text-slate-800"
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

                <mat-form-field
                  class="flex-col ml-2 mr-2 mt-1 grow dark:text-slate-100 text-slate-800"
                >
                  <mat-label
                    class="text-lg ml-2 dark:text-slate-100 text-slate-800"
                    >Description</mat-label
                  >
                  <input
                    class="text-lg ml-2 dark:text-slate-100 text-slate-800"
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
                  <mat-label
                    class="text-lg ml-2 dark:text-slate-100  text-slate-800"
                    >Debit</mat-label
                  >
                  <input
                    type="text"
                    mask="separator.2"
                    [leadZero]="true"
                    thousandSeparator=","
                    class="text-right"
                    matInput
                    [placeholder]="'Debit'"
                    formControlName="debit"
                  />
                  <mat-icon
                    class="icon-size-6"
                    matPrefix
                    color="primary"
                    [svgIcon]="'heroicons_solid:currency-dollar'"
                  ></mat-icon>
                </mat-form-field>

                <mat-form-field class="grow mr-2 mt-1">
                  <mat-label
                    class="text-lg ml-2 dark:text-slate-100  text-slate-800"
                    >Credits</mat-label
                  >
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
                    matPrefix
                    color="primary"
                    [svgIcon]="'heroicons_solid:currency-dollar'"
                  ></mat-icon>
                </mat-form-field>
              </section>
            </mat-card>
            <div mat-dialog-actions class="gap-2 mb-3 mt-5">
              <button
                mat-icon-button
                color="primary"
                class="bg-primary text-slate-300 ml-1"
                (click)="onCreateJournalDetail()"
                matTooltip="Add New Entry"
                aria-label="hovered over"
              >
                <span class="e-icons e-save"></span>
              </button>

              <button
                mat-icon-button
                color="primary"
                class="bg-primary text-slate-300 ml-1"
                (click)="onClearForm()"
                matTooltip="Close Edit"
                aria-label="hovered over"
              >
                <span class="e-icons e-chevron-left"></span>
              </button>
            </div>
          </form>
        </mat-drawer>

        <section
          class="pane1 overflow-hidden bg-slate-100 dark:bg-slate-900 dark:text-slate-100 text-slate-500"
        >
          <ejs-splitter
            #splitterInstance
            id="nested-splitter"
            (created)="onCreated()"
            class="h-[calc(100vh-14rem)] bg-slate-100 dark:bg-slate-900 dark:text-slate-100 text-slate-500"
            width="100%"
          >
            <e-panes>
              <e-pane
                [collapsible]="true"
                min="60px"
                size="20%"
                class="w-72 relative"
              >
                <ng-template #content>
                  <div
                    class="text-xl gap-2 text-primary bg-slate-300 dark:bg-slate-800 p-1 sticky z-10"
                  >
                    Open Journal List
                  </div>
                  <div
                    class="h-[calc(100vh-16.5rem)] bg-slate-100 dark:bg-slate-900 dark:text-slate-100 text-slate-500"
                  >
                    <ejs-grid
                      id="gl_transaction_list"
                      #gl_grid
                      [rowHeight]="40"
                      [dataSource]="journalStore.gl()"
                      [selectionSettings]="selectionOptions"
                      [sortSettings]="initialSort"
                      [allowFiltering]="false"
                      [allowSorting]="true"
                      [showColumnMenu]="true"
                      [enableStickyHeader]="true"
                      [enablePersistence]="true"
                      [toolbar]="toolbarOptions"
                      (rowSelected)="onTransactionListRowSelected($event)"
                      [gridLines]="'Both'"
                    >
                      <e-columns>
                        <e-column
                          field="journal_id"
                          headerText="ID"
                          [visible]="false"
                          isPrimaryKey="true"
                          width="80"
                        ></e-column>
                        <e-column field="type" headerText="Type" width="120">
                          <ng-template #template let-data>
                            @switch (data.type) { @case ('GL') {
                            <span
                              class="e-badge flex text-md gap-1 items-center w-max bg-transparent"
                            >
                              <div
                                class="w-4 h-4  rounded-full bg-green-700"
                              ></div>
                              GL - {{ data.journal_id }}
                            </span>
                            } @case ('AP') {
                            <span
                              class="e-badge flex text-md  gap-1 items-center w-max bg-transparent"
                            >
                              <div
                                class="w-4 h-4 rounded-full bg-blue-700"
                              ></div>
                              AP - {{ data.journal_id }}
                            </span>
                            } @case ('AR') {
                            <span
                              class="e-badge flex text-md  gap-1 items-center w-max bg-transparent"
                            >
                              <div
                                class="w-4 h-4 rounded-full bg-cyan-600"
                              ></div>
                              AR - {{ data.journal_id }}
                            </span>
                            } @case ('CL') {
                            <span
                              class="e-badge flex  text-lg  gap-1 items-center w-max bg-transparent"
                            >
                              <div
                                class="w-4 h-4 rounded-full bg-purple-700"
                              ></div>
                              CL - {{ data.journal_id }}
                            </span>
                            } }
                          </ng-template>
                        </e-column>
                        <e-column
                          field="description"
                          headerText="Journal Description"
                          [visible]="true"
                        ></e-column>
                        <e-column
                          field="amount"
                          headerText="Amount"
                          [visible]="false"
                          width="150"
                          textAlign="Right"
                          editType="numericedit"
                          [edit]="numericParams"
                        ></e-column>
                        <e-column
                          field="booked"
                          headerText="Bk"
                          [visible]="false"
                          width="60"
                          textAlign="Center"
                          [displayAsCheckBox]="true"
                          type="boolean"
                        ></e-column>
                        <e-column
                          field="transaction_date"
                          headerText="Trans Date"
                          [visible]="false"
                          width="60"
                          textAlign="Left"
                          type="Date"
                        ></e-column>
                        <e-column
                          field="due_date"
                          headerText="Due Date"
                          [visible]="false"
                          width="100"
                        ></e-column>
                        <e-column
                          field="period"
                          headerText="Prd"
                          [visible]="false"
                          width="100"
                        ></e-column>
                        <e-column
                          field="period_year"
                          headerText="Yr"
                          [visible]="false"
                          width="100"
                        ></e-column>
                        <e-column
                          field="template_ref"
                          headerText="Template No."
                          [visible]="false"
                          width="50"
                        ></e-column>
                      </e-columns>
                      <e-aggregates>
                        <e-aggregate>
                          <e-columns>
                            <e-column type="Sum" field="amount" format="N2">
                              <ng-template #footerTemplate let-data>
                                <div>
                                  <span
                                    class="text-slate-800 rounded-md text-[14px]"
                                    >{{ data.Sum }}
                                  </span>
                                </div>
                              </ng-template>
                            </e-column>
                          </e-columns>
                        </e-aggregate>
                      </e-aggregates>
                    </ejs-grid>
                  </div>
                </ng-template>
              </e-pane>
              <e-pane [collapsible]="true">
                <ng-template #content>
                  <ng-container
                    *ngTemplateOutlet="template_form"
                  ></ng-container>
                </ng-template>
              </e-pane>
            </e-panes>
          </ejs-splitter>
        </section>
        <mat-drawer
          class="w-full md:w-3/4 lg:w-4/5 bg-white-100 dark:bg-slate-900 border-white overflow-hidden"
          id="wizard"
          #wizard
          [opened]="false"
          mode="over"
          [position]="'start'"
        >
          <entry-wizard
            (cancelWizard)="closeWizard()"
            [accountList]="accountList"
            [templateList]="templateList"
            [subtypeList]="subtypeList"
            [fundList]="fundList"
          ></entry-wizard>
        </mat-drawer>
      </mat-drawer-container>
      } @placeholder(minimum 200ms) {
      <div class="flex justify-center items-center">
        <mat-spinner></mat-spinner>
      </div>
      }

      <ejs-contextmenu
        #contextmenu
        id="contextmenu"
        target="#target"
        (select)="itemSelect($event)"
        [items]="menuItems"
      >
      </ejs-contextmenu>
    </div>

    <ng-template id="template_form" #template_form>
      <div class="content" style="height: 100%">
        <ejs-splitter
          id="vertical_splitter"
          orientation="Vertical"
          #vertical_splitter
          class="vertical_splitter overflow-hidden"
        >
          <e-panes class="border border-slate-400">
            <e-pane>
              <ng-template #content>
                <div class="content overflow-hidden">
                  @if (journalHeader.journal_id > 0) {
                  <div
                    class="text-xl gap-2 text-primary bg-slate-300  dark:bg-slate-800 p-1 sticky z-10"
                  >
                    @if (journalHeader.type == 'GL') { Journals :
                    {{ journalHeader.journal_id }} } @if (journalHeader.type ==
                    'AP') { Accounts Payable : {{ journalHeader.journal_id }} }
                    @if (journalHeader.type == 'AR') { Accounts Receivable :
                    {{ journalHeader.journal_id }}
                    }
                  </div>
                  } @else {
                  <div
                    class="text-3xl gap-2 m-1 text-slate-100 p-2 bg-slate-700  "
                  >
                    Journals
                  </div>
                  }
                  <form
                    [formGroup]="journalForm"
                    class="flex flex-col h-full mt-1 ml-1 mr-1 text-slate-400 bg-slate-50 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <section
                      class="flex flex-col md:flex-row mt-1 dark:text-slate-100 text-slate-500"
                    >
                      @if (templateFilter | async; as templates ) {
                      <div
                        class="flex flex-col w-[350px] dark:text-slate-100 text-slate-700"
                        aria-label="Transaction Template"
                      >
                        <mat-label
                          class="dark:text-slate-100 text-md text-slate-700 ml-2"
                          >Template</mat-label
                        >
                        <mat-form-field
                          class="mt-1 ml-1 mr-1 flex-start text-slate-700"
                          appearance="outline"
                        >
                          <mat-select
                            (selectionChange)="
                              onSelectionTemplateChanged($event)
                            "
                            class="dark:text-slate-100 text-slate-700"
                            [formControl]="templateCtrl"
                            [placeholder]="'Journal Template'"
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
                            <mat-option [value]="template">{{
                              template.description
                            }}</mat-option>
                            }
                          </mat-select>
                          <mat-icon
                            class="icon-size-5"
                            color="primary"
                            matPrefix
                            [svgIcon]="'heroicons_solid:document-chart-bar'"
                          ></mat-icon>
                        </mat-form-field>
                      </div>
                      }
                      <div class="flex flex-col grow">
                        <mat-label
                          class="dark:text-slate-100 ml-1 text-md text-slate-700"
                          >Journal Description</mat-label
                        >
                        <mat-form-field
                          class="mt-1 mr-1 flex-start"
                          appearance="outline"
                        >
                          <input
                            class="dark:text-slate-100 text-slate-700"
                            matInput
                            placeholder="Journal Description"
                            formControlName="description"
                          />
                          <mat-icon
                            class="icon-size-5"
                            color="primary"
                            matPrefix
                            [svgIcon]="'heroicons_solid:document'"
                          ></mat-icon>
                        </mat-form-field>
                      </div>

                      @if (journalHeader.type == 'GL') {
                      <div
                        class="flex flex-col grow dark:text-slate-100 text-slate-700"
                      >
                        <mat-label
                          class="dark:text-slate-100 text-md text-slate-700"
                          >Reference</mat-label
                        >
                        <mat-form-field
                          class="mt-1 flex-start mr-1"
                          appearance="outline"
                        >
                          <input
                            class="dark:text-slate-100 text-slate-700"
                            type="text"
                            matInput
                            placeholder="Reference"
                            formControlName="invoice_no"
                          />
                          <mat-icon
                            class="icon-size-5"
                            color="primary"
                            matPrefix
                            [svgIcon]="
                              'heroicons_solid:clipboard-document-check'
                            "
                          ></mat-icon>
                        </mat-form-field>
                      </div>
                      }
                      <div
                        class="flex flex-col w-[150px] dark:text-slate-100 text-slate-700"
                      >
                        <mat-label
                          class="dark:text-slate-100 text-md text-slate-700"
                          >Transaction Total</mat-label
                        >
                        <mat-form-field
                          class="mt-1 flex-start mr-1"
                          appearance="outline"
                        >
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
                            class="icon-size-5"
                            color="primary"
                            matPrefix
                            [svgIcon]="'heroicons_solid:currency-dollar'"
                          ></mat-icon>
                        </mat-form-field>
                      </div>

                      <div class="flex flex-col w-[150px]">
                        <mat-label
                          class="dark:text-slate-100 text-md text-slate-700"
                          >Date</mat-label
                        >
                        <mat-form-field
                          class="mt-1 flex-start mr-1 text-primary"
                          appearance="outline"
                        >
                          <input
                            matInput
                            (dateChange)="onHeaderDateChanged($event)"
                            formControlName="transaction_date"
                            [matDatepicker]="picker"
                          />
                          <mat-datepicker-toggle
                            class="text-primary"
                            matIconPrefix
                            [for]="picker"
                          ></mat-datepicker-toggle>
                          <mat-datepicker
                            class="text-primary"
                            #picker
                          ></mat-datepicker>
                        </mat-form-field>
                      </div>

                      @if (bHeaderDirty === true && journalHeader.type == 'GL')
                      {
                      <button
                        mat-icon-button
                        color="primary"
                        class="bg-primary-700 text-slate-300 ml-1 mt-8"
                        (click)="transaction_details().onUpdate()"
                        matTooltip="Save"
                        aria-label="hovered over"
                      >
                        <span class="e-icons e-save"></span>
                      </button>

                      }
                    </section>

                    <section class="flex flex-col md:flex-row">
                      @if (journalHeader.type != 'GL') { @if (partyFilter |
                      async; as parties ) {
                      <div class="flex flex-col w-[350px]">
                        <mat-label
                          class="dark:text-slate-100 ml-2 text-md text-slate-700"
                          >Party</mat-label
                        >
                        <mat-form-field
                          class="ml-1 mr-1 flex-start"
                          appearance="outline"
                        >
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
                            <mat-option [value]="party">{{
                              party.party_id
                            }}</mat-option>
                            }
                          </mat-select>
                          <mat-icon
                            class="icon-size-5"
                            color="primary"
                            matPrefix
                            [svgIcon]="'heroicons_solid:user'"
                          ></mat-icon>
                        </mat-form-field>
                      </div>
                      }
                      <div class="flex flex-col grow">
                        <mat-label
                          class="dark:text-slate-100 ml-1 text-md text-slate-700"
                          >Reference</mat-label
                        >
                        <mat-form-field class="mr-1 grow" appearance="outline">
                          <input
                            type="text"
                            class="text-left"
                            matInput
                            placeholder="Reference Number"
                            formControlName="invoice_no"
                          />
                          <mat-icon
                            class="icon-size-5"
                            color="primary"
                            matPrefix
                            [svgIcon]="
                              'heroicons_solid:clipboard-document-check'
                            "
                          ></mat-icon>
                        </mat-form-field>
                      </div>

                      <div class="flex flex-col w-[150px]">
                        <mat-label
                          class="dark:text-slate-100 text-md text-slate-700"
                          >Due Date</mat-label
                        >
                        <mat-form-field
                          class="flex-start mr-1"
                          appearance="outline"
                        >
                          <input
                            matInput
                            (dateChange)="onDueDateChanged($event.target.value)"
                            formControlName="due_date"
                            [matDatepicker]="picker"
                          />
                          <mat-datepicker-toggle
                            matIconPrefix
                            class="text-primary"
                            [for]="picker"
                          ></mat-datepicker-toggle>
                          <mat-datepicker #picker></mat-datepicker>
                        </mat-form-field>
                      </div>

                      @if (bHeaderDirty === true && journalHeader.type != 'GL')
                      {
                      <button
                        mat-icon-button
                        color="primary"
                        class="bg-teal-700 text-slate-300 ml-1 mt-6"
                        (click)="transaction_details().onUpdate()"
                        matTooltip="Save"
                        aria-label="hovered over"
                      >
                        <span class="e-icons e-circle-check"></span>
                      </button>
                      } }
                    </section>
                  </form>
                </div>
              </ng-template>
            </e-pane>
            <e-pane size="65%" min="100px">
              <ng-template #content>
                <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start">
                  <mat-tab label="Debits and Credit">
                    <transaction-detail
                      #transaction_detail
                      class="flex flex-col h-full"
                      (detail)="onDataSelected($event)"
                      (save)="onSaved($event)"
                      (open)="updateDetailForm($event)"
                      (batch_save)="onSaveBatch($event)"
                      (deleteLine)="onDeleteLine($event)"
                      (copyLine)="onCopyLine($event)"
                      [accountList]="accountList"
                      [fundList]="fundList"
                      [subTypeList]="subtypeList"
                      [details]="journalStore.glDetails()"
                    >
                    </transaction-detail>
                  </mat-tab>
                  <mat-tab label="Evidence">
                    <transaction-evidence
                      class="flex flex-col h-full"
                      (save)="onSaveEvidence($event)"
                      [details]="journalStore.readArtifacts()"
                    ></transaction-evidence>
                  </mat-tab>
                  <mat-tab label="Analysis">
                    <div>Analysis Coming Soon.</div>
                  </mat-tab>
                  <mat-tab label="Audit Trail">
                    <div>Audit Trail Coming Soon.</div>
                  </mat-tab>
                </mat-tab-group>
              </ng-template>
            </e-pane>
          </e-panes>
        </ejs-splitter>
      </div>
    </ng-template>
  `,
  selector: "gl-journal",
  imports: [imp],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "outline" },
    },
    provideNgxMask(),
    SortService,
    FilterService,
    ToolbarService,
    EditService,
    SearchService,
    AggregateService,
    ExcelExportService,
    PdfExportService,
    ReorderService,
    GroupService,
    RowDDService,
    ResizeService,
    ContextMenuService,
    ColumnMenuService,
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "en-US" },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      ::ng-deep cdk-overlay-pane {
        /* Your styles here */
        font-size: 14px;
        background-color: var(--bg-primary);
        color: var(--text-slate-500);
        /* ... */
      }
    `,
  ],
})
class JournalUpdate implements OnInit, OnDestroy {
  @Output() notifyDrawerClose: EventEmitter<any> = new EventEmitter();

  private readonly destroyJournalForm$ = new Subject<void>();
  private readonly destroyDetailForm$ = new Subject<void>();

  accountDropDown = viewChild<AccountDropDownComponent>("accountDropDown");
  subtypeDropDown = viewChild<SubtypeDropDownComponent>("subtypeDropDown");
  fundDropDown = viewChild<FundsDropDownComponent>("fundDropDown");
  drawer = viewChild<MatDrawer>("drawer");
  wizard = viewChild<MatDrawer>("wizard");
  transaction_details = viewChild<GlDetail>("transaction_detail");

  private auth = inject(AUTH);
  private activatedRoute = inject(ActivatedRoute);
  private _location = inject(Location);

  private fuseConfirmationService = inject(FuseConfirmationService);
  private matDialog = inject(MatDialog);
  private route = inject(Router);

  public transactionStartDate: string;
  public transactionEndDate: string;

  public toolbarTitle: string = "Journal Edit";

  public currentPrd: number;
  public currentYear: number;

  public bDirty = false;
  public bDetailDirty = false;
  public bTemplateDetails = false;
  // create template details only one

  public animation = {
    effect: "FadeIn",
    duration: 800,
  };

  public journalStore = inject(JournalStore);
  public hotkeysService = inject(Hotkeys);

  public contextmenu: ContextMenuComponent;
  public value = 0;

  private height: string = "250px";
  // Data grid settings

  public editSettings: Object;
  public editArtifactSettings: Object;
  public filterSettings: Object;
  public toolbar: string[];
  public selectionOptions: Object;
  public searchOptions: Object;
  public formatOptions: Object;
  public initialSort: Object;
  public detailSort: Object;

  // drop down searchable list
  public accountList: IDropDownAccounts[] = [];
  public subtypeList: ISubType[] = [];
  public fundList: IFunds[] = [];

  // Internal control variables
  public currentDetailData: IJournalDetail;
  public bHeaderDirty = false;
  public bNewJournal = false;

  public message?: string;
  public description?: string;
  public gridControl = viewChild<GridComponent>("grid");
  public gl_transaction_list = viewChild<GridComponent>("gl_transaction_list");

  public transactionType = "GL";
  public templateList: IJournalTemplate[] = [];
  public templateCtrl: FormControl<IJournalTemplate> =
    new FormControl<IJournalTemplate>(null);
  public templateFilterCtrl: FormControl<string> = new FormControl<string>(
    null
  );
  public templateFilter: ReplaySubject<IJournalTemplate[]> = new ReplaySubject<
    IJournalTemplate[]
  >(1);

  public partyList: IParty[] = [];
  public partyCtrl: FormControl<IParty> = new FormControl<IParty>(null);
  public partyFilterCtrl: FormControl<string> = new FormControl<string>(null);
  public partyFilter: ReplaySubject<IParty[]> = new ReplaySubject<IParty[]>(1);

  public debitAccounts: IDropDownAccounts[] = [];
  public debitCtrl: FormControl<IDropDownAccounts> =
    new FormControl<IDropDownAccounts>(null);
  public debitAccountFilterCtrl: FormControl<string> = new FormControl<string>(
    null
  );
  public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> =
    new ReplaySubject<IDropDownAccounts[]>(1);

  public subtypeCtrl: FormControl<string> = new FormControl<string>(null);
  public fundCtrl: FormControl<string> = new FormControl<string>(null);
  public key: number;

  public journalHeader: IJournalHeader;
  public journalDetails: IJournalDetail[] = [];
  public journal_id = 0;

  public currentPeriod: string | undefined;
  protected _onDestroyDebitAccountFilter = new Subject<void>();
  protected _onDestroy = new Subject<void>();

  public changeDetectorRef = inject(ChangeDetectorRef);
  public gridHeight: number;
  public toastr = inject(ToastrService);
  public toolbarOptions = ["Search"];

  public currentStartAndEndDate: IPeriodStartEndParam;

  @ViewChild("splitterInstance") splitterObj?: SplitterComponent;

  singleDebitSelection = viewChild<MatSelect>("singleDebitSelection");
  singleTemplateSelect = viewChild<MatSelect>("singleTemplateSelect");
  singlePartySelect = viewChild<MatSelect>("singlePartySelect");
  menuBar = viewChild<GridMenubarStandaloneComponent>("menuBar");

  journalForm = new FormGroup({
    journal_id: new FormControl(0, Validators.required),
    templateCtrl: new FormControl({
      dropdown: new FormControl("", Validators.required),
    }),
    description: new FormControl("", Validators.required),
    invoice_no: new FormControl("", Validators.required),
    amount: new FormControl(0, Validators.required),
    transaction_date: new FormControl("", Validators.required),
    due_date: new FormControl("", Validators.required),
    partyCtrl: new FormControl({
      dropdown: new FormControl("", Validators.required),
    }),
  });

  onClearForm() {
    this.journalForm.reset();
    this.closeDrawer();
  }

  detailForm = new FormGroup({
    accounts: new FormGroup({
      dropdown: new FormControl(0, Validators.required),
    }),
    subtype: new FormGroup({
      dropdown: new FormControl("", Validators.required),
    }),
    fund: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    debit: new FormControl(0, Validators.required),
    credit: new FormControl(0, Validators.required),
    reference: new FormControl("", Validators.required),
  });

  public closeWizard() {
    this.wizard().close();
  }

  // ::On Init
  public ngOnInit(): void {
    this.initialDatagrid();

    this.numericParams = {
      params: {
        decimals: 2,
        format: "N2",
        showClearButton: true,
        showSpinButton: false,
      },
    };

    let currentPeriod = localStorage.getItem("currentPeriod");

    if (currentPeriod === null) {
      currentPeriod = "January 2025";
    }

    let activePeriods: ICurrentPeriod[] = [];

    let _currentActivePeriods = localStorage.getItem("activePeriod");

    if (_currentActivePeriods) {
      activePeriods = JSON.parse(_currentActivePeriods) as ICurrentPeriod[];
    }

    if (activePeriods.length > 0) {
      let prd = activePeriods.filter(
        (period) => period.description === currentPeriod
      );
      if (prd.length > 0) {
        this.currentPrd = prd[0].period_id;
        this.currentYear = prd[0].period_year;
      }
    }

    let start = localStorage.getItem("start_date");
    let end = localStorage.getItem("end_date");

    if (start === null) {
      start = "01/01/2025";
      localStorage.setItem("start_date", start);
    }

    if (end === null) {
      end = "12/31/2025";
      localStorage.setItem("end_date", end);
    }

    this.currentStartAndEndDate = {
      start_date: start,
      end_date: end,
    };

    this.menuBar().setDateValues(this.currentStartAndEndDate);
    this.journalStore.getJournalListByStartAndEndDate(
      this.currentStartAndEndDate
    );

    const user = this.activatedRoute.data.pipe(map((d) => {
        d['journal'];
      }));

    /*
    this.activatedRoute.data.pipe(map(data) => {
      this.journalHeader = data.journal[0];
      this.accountList = data.journal[1];
      this.subtypeList = data.journal[2];
      this.templateList = data.journal[3];
      this.partyList = data.journal[4];
      this.fundList = data.journal[5];
      this.templateFilter.next(this.templateList.slice());
      this.partyFilter.next(this.partyList.slice());
      this.refreshJournalForm(this.journalHeader);
    });
    */

    this.journalForm.valueChanges
      .pipe(takeUntil(this.destroyJournalForm$))
      .subscribe((value) => {
        if (value === undefined) {
          this.bHeaderDirty = false;
        } else {
          this.bHeaderDirty = true;
          this.changeDetectorRef.detectChanges();
        }
      });

    this.partyCtrl.valueChanges.subscribe((value) => {
      if (value === undefined) {
        this.bHeaderDirty = false;
      } else {
        this.bHeaderDirty = true;
        this.journalHeader.party_id = value.party_id;
      }
    });

    this.detailForm.valueChanges
      .pipe(takeUntil(this.destroyDetailForm$))
      .subscribe((value) => {
        if (value === undefined) {
          this.bDetailDirty = false;
        } else {
          this.bDetailDirty = true;
          console.debug("Detail form : ", JSON.stringify(value));
        }
      });

    this.templateCtrl.valueChanges.subscribe((value) => {
      if (value === undefined) {
        this.bHeaderDirty = false;
        console.debug("Header is true!! ", value);
      } else {
        this.bHeaderDirty = true;
        this.journalHeader.type = value.journal_type;
        console.debug("Header is false!! ", JSON.stringify(value));
      }
    });

    this.bHeaderDirty = false;
    this.bDetailDirty = false;

    this.hotkeysService.addShortcut(
      "control.S",
      this.saveData.bind(this),
      "Save data control S"
    );
    this.hotkeysService.addShortcut(
      "alt.n",
      this.createNewJournal.bind(this),
      "Create new item"
    );
  }

  public saveData(event: KeyboardEvent): void {
    console.log("Data saved!");
  }

  public createNewJournal(event: KeyboardEvent) {
    console.log("Create a new journal entry");
  }

  public onDeleteLine(detail: IJournalDetail) {
    this.journalStore.deleteJournalDetail(detail);
  }

  public onEditMode(value: any) {
    this.journalStore.updateEditMode(value);
  }

  public onPeriod(event: any) {
    this.currentPeriod = event;
    localStorage.setItem("currentPeriod", this.currentPeriod);
    this.journalStore.getJournalListByPeriod({
      current_period: this.currentPeriod,
    });
    this.toastr.info(event, "Period changed to: ", event.period);
    this.changeDetectorRef.detectChanges();
  }

  // template$: Observable<IJournalTemplate[]>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public numericParams: IEditCell;

  public onSelectionTemplateChanged(e: any) {
    this.journalStore.loadTemplateDetails(e.value.template_ref);
    this.bHeaderDirty = true;
    this.bDirty = true;
  }

  public onStartAndEnd(e: any) {
    const startAndEndDate = {
      start_date: e.start_date,
      end_date: e.end_date,
    };
    localStorage.setItem("end_date", e.end_date);
    localStorage.setItem("start_date", e.start_date);
    this.journalStore.getJournalListByStartAndEndDate(startAndEndDate);
  }

  public menuItems: MenuItemModel[] = [
    {
      id: "new",
      text: "New",
      iconCss: "e-icons e-circle-add",
    },
    {
      id: "edit",
      text: "Edit",
      iconCss: "e-icons e-edit",
    },
    {
      id: "evidence",
      text: "Add Evidence",
      iconCss: "e-icons e-file-document",
    },
    {
      id: "lock",
      text: "Commit",
      iconCss: "e-icons e-lock",
    },
    {
      id: "clone",
      text: "Clone",
      iconCss: "e-icons e-copy",
    },
    {
      id: "cancel",
      text: "Cancel",
      iconCss: "e-icons e-table-overwrite-cells",
    },
    {
      separator: true,
    },
    {
      id: "back",
      text: "Back to Transaction List",
      iconCss: "e-icons e-chevron-left",
    },
  ];

  public itemSelect(args: MenuEventArgs): void {
    switch (args.item.id) {
      case "new":
        this.onNewJournal();
        break;
      case "edit":
        this.onEdit(this.journalHeader);
        break;
      case "evidence":
        this.onAddEvidence();
        break;
      case "lock":
        this.onCommitTransaction();
        break;
      case "clone":
        this.onClone(this.journalHeader);
        break;
      case "cancel":
        this.onCancelTransaction();
        break;
      case "back":
        this.onBack();
        break;
    }
  }

  public onEdit(header: IJournalHeader) {
    this.drawer().toggle().then();
  }

  public onSaveEvidence(args: any) {
    this.journalStore.updateArtifacts(args);
  }

  public onSaved(args: any) {
    const currentRowCount = this.journalStore.glDetails().length;
    const detail = <IJournalDetail>args;
    const updateDate = new Date().toISOString().split("T")[0];
    const userName = this.journalStore.userName();
    const credit = Math.abs(Number(detail.credit));
    const debit = Math.abs(Number(detail.debit));

    console.log("User name : ", userName);

    // Check for correct child accounts coming from the template
    // Sum the debits and the credits to make sure they are equal

    const journalDetail = {
      journal_id: detail.journal_id,
      journal_subid: detail.journal_subid,
      account: Number(detail.account),
      child: Number(detail.child),
      child_desc: detail.child_desc,
      description: detail.description,
      create_date: updateDate,
      create_user: userName,
      sub_type: detail.sub_type,
      debit: debit,
      credit: credit,
      reference: detail.reference,
      fund: detail.fund,
    };

    if (currentRowCount < detail.journal_subid) {
      this.journalStore.createJournalDetail(journalDetail);
    } else {
      this.journalStore.updateJournalDetail(journalDetail);
    }

    this.bDetailDirty = false;
  }

  // ::New Journal
  public onNewJournal() {
    this.wizard().toggle();
  }

  public onTemplateMaintenance() {
    this.route.navigate(["update-template"]);
  }

  public onCancelTransaction() {
    this.fuseConfirmationService
      .open({
        title: "Cancel Transaction",
        message: "Are you sure you want to cancel this transaction?  ",
        actions: {
          confirm: {
            label: "Okay",
          },
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === "confirmed") {
          this.journalStore.cancelTransaction(this.journalHeader.journal_id);
        }
      });
  }

  onExportPDF() {

  }

  public onPrint() {
    this.onExportPDF();
  }

  // onEvidenceSelected(event: RowSelectEventArgs): void {
  //     if (event.data) {
  //         if (this.journalHeader.journal_id !== undefined || true) {
  //             this.journalStore.loadArtifactsById(this.journalHeader.journal_id);
  //         }
  //     } else {
  //         this.toastr.error('No evidence selected');
  //     }
  // }

  public onBack() {

  }

  public aggregates = [
    {
      columns: [
        {
          type: ["Sum"],
          field: "debit",
          columnName: "Debit",
          format: "N2",
          footerTemplate: "Sum: ${Sum}",
        },
        {
          type: ["Sum"],
          field: "credit",
          columnName: "Credit",
          format: "N2",
          footerTemplate: "Sum: ${Sum}",
        },
      ],
    },
  ];

  public changeFund(e: any) {
    console.debug("change fund: ", e);
    this.bDetailDirty = true;
  }

  changeSubtype(e: any) {
    console.debug("change subtype: ", e);
    this.bDetailDirty = true;
  }

  public changeAccount(e: any) {
    console.debug("change Account: ", e);
    this.bDetailDirty = true;
  }

  changeTemplate(e: any) {
    console.debug("change template: ", e);
    this.bDetailDirty = true;
  }

  public onCreated() {
    let splitterObj1 = new Splitter({
      height: "100%",
      separatorSize: 3,
      paneSettings: [{ size: "70%" }, { size: "30%" }],
      orientation: "Vertical",
    });
    splitterObj1.appendTo("#vertical_splitter");
  }

  public createJournalDetailsFromTemplate(
    template: IJournalTemplate,
    journalHeader: IJournalHeader,
    templateDetails: IJournalDetailTemplate[]
  ) {
    if (template === null || template === undefined) {
      return;
    }
    this.transactionType = template.journal_type;
    this.journalStore.loadTemplateDetails(template.template_ref);
    if (this.bNewJournal === true) {
      this.journalDetails = [];
      const updateDate = new Date().toISOString().split("T")[0];
      const email = this.journalStore.userName();

      let count = 1;
      templateDetails.forEach((templateDetail) => {
        let journalDetail: IJournalDetailUpdate = {
          journal_id: journalHeader.journal_id,
          journal_subid: count,
          account: Number(templateDetail.account),
          child: Number(templateDetail.child),
          description: templateDetail.description,
          create_date: updateDate,
          create_user: email,
          sub_type: templateDetail.sub_type,
          debit: templateDetail.debit * journalHeader.amount,
          credit: templateDetail.credit * journalHeader.amount,
          reference: "",
          fund: templateDetail.fund,
        };
        this.journalDetails.push(journalDetail);
        count = count + 1;
      });
    }
    this.bHeaderDirty = true;
  }

  public ngAfterViewInit() {
    this.partyFilter.next(this.partyList.slice());

    if (this.templateFilter && this.singleTemplateSelect() != null)
      this.templateFilter.pipe(take(1), takeUntilDestroyed()).subscribe(() => {
        if (
          this.singleTemplateSelect() != null ||
          this.singleTemplateSelect() != undefined
        )
          this.singleTemplateSelect().compareWith = (
            a: IJournalTemplate,
            b: IJournalTemplate
          ) => a && b && a.template_ref === b.template_ref;
      });

    if (this.partyFilter && this.singlePartySelect() != null)
      this.partyFilter.pipe(take(1), takeUntilDestroyed()).subscribe(() => {
        if (
          this.singlePartySelect() != null ||
          this.singlePartySelect() != undefined
        )
          this.singlePartySelect().compareWith = (a: IParty, b: IParty) =>
            a && b && a.party_id === b.party_id;
      });

    if (this.filteredDebitAccounts)
      this.filteredDebitAccounts
        .pipe(take(1))
        .pipe(takeUntil(this._onDestroyDebitAccountFilter))
        .subscribe(() => {
          if (
            this.singleDebitSelection() != null ||
            this.singleDebitSelection() != undefined
          )
            this.singleDebitSelection().compareWith = (
              a: IDropDownAccounts,
              b: IDropDownAccounts
            ) => {
              return a && b && a.child === b.child;
            };
        });

    this.searchOptions = {
      operator: "contains",
      ignoreCase: true,
      ignoreAccent: true,
    };

    this.bHeaderDirty = false;

    if (this.gl_transaction_list()) {
      this.highLightCurrentRow(this.journalHeader.journal_id);
    }
  }

  public openDrawer() {
    this.bDetailDirty = false;
    this.drawer().toggle();
  }

  public closeDrawer() {
    this.bDetailDirty = false;
    this.drawer().toggle();
  }

  public onTransactionListRowSelected(args: RowSelectEventArgs): void {
    const jl: any = args.data;
    const journal = this.journalStore
      .gl()
      .find((jrn) => jrn.journal_id === jl.journal_id);
    this.refreshJournalForm(journal);
  }

  public initialDatagrid() {
    this.formatOptions = { type: "dateTime", format: "M/dd/yyyy" };
    this.selectionOptions = { mode: "Row" };
    this.editSettings = {
      allowEditing: true,
      allowAdding: false,
      allowDeleting: false,
    };
    this.editArtifactSettings = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: false,
    };
    this.filterSettings = { type: "CheckBox" };
    this.initialSort = {
      columns: [{ field: "journal_id", direction: "Descending" }],
    };

    this.detailSort = {
      columns: [{ field: "debit", direction: "Descending" }],
    };
  }

  public OnDoubleClick(data: IJournalDetail): void {
    this.currentDetailData = data;
    const name = this.journalStore.userName();
    const dDate = new Date();
    let currentDate = dDate.toISOString().split("T")[0];

    const JournalDetail = {
      ...data,
      create_date: currentDate,
      create_user: "@" + name,
    } as IJournalDetail;

    this.updateDetailForm(JournalDetail);
  }

  public updateDetailForm(journalDetail: any) {
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
    this.fundDropDown().setDropdownValue(journalDetail.fund);

    if (this.journalStore.editMode() === "Normal") {
      this.openDrawer();
    }
  }

  public onDataSelected(args: any): void {
    let rowData = args as IJournalDetail;
    this.currentDetailData = rowData;
    const name = this.journalStore.userName();
    const dDate = new Date();
    let currentDate = dDate.toISOString().split("T")[0];

    const JournalDetail = {
      ...rowData,
      create_date: currentDate,
      create_user: name,
    } as IJournalDetail;

    this.updateDetailForm(JournalDetail);

    if (this.journalStore.editMode() === "form") {
      this.openDrawer();
    }
  }
  public actionSelectJournal(args: SaveEventArgs): void {
    if (args.requestType === "beginEdit" || args.requestType === "add") {
      const data = args.rowData as IJournalHeader;
    }
    if (args.requestType === "save") {
      this.saveArtifacts(args.data);
    }
  }

  // ::Actions Complete
  // public actionComplete(args: DialogEditEventArgs): void {
  //     console.debug("args : ", args.requestType);
  //     if (args.requestType === "beginEdit" || args.requestType === "add") {
  //         if (args.requestType === "beginEdit") {
  //         } else if (args.requestType === "add") {
  //         }
  //     }
  // }

  // ::Save Artifacts
  public saveArtifacts(e: any) {
    this.journalStore.updateArtifacts(e);
  }

  // ::Refresh
  public refreshJournalForm(header: IJournalHeader) {
    this.journalHeader = header;

    this.journalForm.patchValue({
      journal_id: header.journal_id,
      description: header.description,
      amount: header.amount,
      transaction_date: header.transaction_date,
      invoice_no: header.invoice_no,
      due_date: header.due_date,
    });

    console.log("Form :", this.journalForm);

    const template = this.templateList.find(
      (x) => x.template_ref === header.template_ref
    );

    this.templateCtrl.setValue(template);

    this.partyCtrl.setValue(
      this.partyList.find((x) => x.party_id === header.party_id)
    );

    this.journalStore.loadDetails(header.journal_id);
    this.journalStore.loadArtifactsById(header.journal_id);

    this.bHeaderDirty = false;
  }

  // ::High Light Current Row
  public highLightCurrentRow(journalId: number) {
    const dataSource = this.gl_transaction_list().dataSource as object[];
    const foundRow = dataSource.find(
      (item) => item["journal_id"] === journalId
    );

    if (foundRow) {
      console.log("Found row:", foundRow);
      // You can now use the 'foundRow' object to perform further actions,
      // such as selecting the row using its primary key or index if needed.
      const primaryKey = foundRow["journal_id"];
      this.gl_transaction_list().selectRow(primaryKey);
    } else {
      console.log("Row not found.");
    }
  }

  // :: onClone create a clone of the current transaction
  public onClone(e: any) {
    const confirmation = this.fuseConfirmationService.open({
      title: "Clone Journal",
      message: "Are you sure you want to clone this journal?",
      actions: {
        confirm: {
          label: "Clone",
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === "confirmed") {
        // Delete the list
        this.journalStore.cloneJournal(this.journalHeader.journal_id);
      }
    });
  }

  // ::Create template from the current transaction
  public onCreateTemplate() {
    const confirmation = this.fuseConfirmationService.open({
      title: "Create Template",
      message:
        "Would you like to create a template based upon the current transaction? ",
      actions: {
        confirm: {
          label: "Journal Template",
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation
      .afterClosed()
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        if (result === "confirmed") {
          let journalParam: ITemplateParams = {
            journal_id: this.journalHeader.journal_id,
            template_description: this.journalHeader.description,
          };
          this.journalStore.createTemplate(journalParam);
        }
      });
  }

  // ::Add Evidence
  public onAddEvidence() {
    const dialogRef = this.matDialog.open(DndComponent, {
      width: "450px",
      data: {
        journal_id: this.journalHeader.journal_id,
        reference: this.journalHeader.invoice_no,
        description: this.journalHeader.description,
        location: "",
        date_created: new Date().toISOString().split("T")[0],
        user_created: this.journalStore.userName(),
      } as IArtifacts,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed())
      .subscribe((result: any) => {
        if (result === undefined) {
          result = { event: "Cancel" };
        }
        switch (result.event) {
          case "Create":
            this.journalStore.createEvidence(result.data);
            break;
          case "Cancel":
            break;
        }
      });
  }

  // :: On Lock Transaction
  public onCommitTransaction() {
    const confirmation = this.fuseConfirmationService.open({
      title: "Commit Transaction",
      message:
        "Committing the transaction will update the trial balance and reports. Editing again will automatically open the transaction. Commit the transaction? ",
      actions: {
        confirm: {
          label: "Commit",
        },
      },
    });

    confirmation
      .afterClosed()
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        if (result === "confirmed") {
        }
      });
  }

  // :: On Delete Detail
  public onDeleteDetail() {
    let journalDetail = {
      journal_id: this.currentDetailData.journal_id,
      journal_subid: this.currentDetailData.journal_subid,
    };

    this.journalStore.deleteJournalDetail(journalDetail);
    this.closeDrawer();
  }

  public onOpenEmptyDrawer() {
    this.openDrawer();
  }

  // ::Add a new line entry
  public onNewLineItem() {
    this.gl_transaction_list().editModule.addRecord();

    const updateDate = new Date().toISOString().split("T")[0];
    let max = 0;

    this.journalStore.glDetails().forEach((details) => {
      if (details.journal_subid > max) {
        max = details.journal_subid;
      }
    });

    if (this.currentDetailData.journal_id === 0) {
      return;
    }

    const name = this.journalStore.userName();
    const detail = this.detailForm.getRawValue();

    if (max === 0) {
      max = 1;
    } else {
      max = max + 1;
    }

    const debit = Number(detail.debit);
    const credit = Number(detail.credit);
    const childAccount = this.currentDetailData.account;

    if (childAccount === null || childAccount === undefined) {
      this.toastr.show("A valid account is required", "Failed");
      return;
    }

    const sub_type = this.subtypeCtrl.value;
    const fund = this.fundCtrl.value;
    let child_desc = "";
    if (this.accountList.length > 0) {
      const account = this.accountList.find(
        (x) => Number(x.child) === childAccount
      );
      if (account) {
        child_desc = account.description;
      }
    } else {
      this.toastr.show("A valid account is required", "Failed");
      return;
    }

    if (debit > 0 && credit > 0) {
      this.toastr.show(
        "Only one of the debit field and credit field may be greater than zero",
        "Failed"
      );
      return;
    }

    if (debit == 0 && credit == 0) {
      this.toastr.show(
        "One of the debit field or credit field may be greater than zero",
        "Failed"
      );
      return;
    }

    const journalDetail = {
      journal_id: this.currentDetailData.journal_id,
      journal_subid: this.currentDetailData.journal_subid,
      account: this.currentDetailData.account,
      child: childAccount,
      child_desc: child_desc,
      description: detail.description,
      create_date: updateDate,
      create_user: name,
      sub_type: sub_type,
      debit: debit,
      credit: credit,
      reference: detail.reference,
      fund: fund,
    };

    this.journalStore.createJournalDetail(journalDetail);
    this.journalStore.renumberJournalDetail(journalDetail.journal_id);

    this.bDetailDirty = false;
  }

  // ::Header Date Changed
  public onHeaderDateChanged(event: any): void {
    console.debug("Date changed: ", event.value);
    this.journalHeader.due_date = event.value.toISOString().slice(0, 10);
    this.bHeaderDirty = true;
  }

  public onDueDateChanged(event: any): void {
    console.debug("Date changed: ", event.value);
    this.journalHeader.due_date = event.value.toISOString().slice(0, 10);
    this.bHeaderDirty = true;
  }

  // dueDate = signal(this.journalForm.get('due_date')?.value);
  // transactionDate = signal(this.journalForm.get('transaction_date')?.value);

  public onExportXL(e: any) {
    // this.excelServer.generateExcel(this.journalStore.glDetails(), "GL_Details", "GL Journal Details" );
    //this.excelServer.financialIncomeState( this.journalStore.glDetails(), "GL_Details", "GL Journal Details" );
    // this.excelServer.finIncomeState(
    //   this.journalStore.glDetails(),
    //   "gl_income_statement",
    //   "Income Statement"
    // );
  }

  // :: Patch Journal
  public onPatchJournal() {
    let journalData = this.journalForm.getRawValue();
    let party_id = "";
    let template = this.templateCtrl.value;
    let partyCtrl = this.partyCtrl.value;
    let details = this.journalStore.glDetails();

    let modify: boolean = false;

    const dueDate = new Date(journalData.due_date).toISOString().slice(0, 10);
    const transDate = new Date(journalData.transaction_date)
      .toISOString()
      .slice(0, 10);

    const userName = this.journalStore.userName();

    if (this.bNewJournal === true) {
      modify = false;
      this.journalHeader.journal_id = this.journalStore.maxJournal();
    } else {
      modify = true;
    }

    if (partyCtrl === undefined) {
      this.journalHeader.party_id = "";
    } else {
      party_id = partyCtrl.party_id;
    }

    const journalHeader = {
      journal_id: this.journalHeader.journal_id,
      description: journalData.description,
      booked: false,
      due_date: dueDate,
      booked_date: new Date().toISOString().slice(0, 10),
      booked_user: userName,
      create_date: new Date().toISOString().slice(0, 10),
      create_user: userName,
      period: this.currentYear,
      period_year: this.currentYear,
      transaction_date: transDate,
      status: "OPEN",
      type: template.journal_type,
      amount: journalData.amount,
      party_id: party_id,
      invoice_no: journalData.invoice_no,
      template_name: template.template_name,
      template_ref: template.template_ref,
    };

    let journal = onModifyJournal(
      journalHeader,
      userName,
      details,
      template,
      this.currentPrd,
      this.currentYear,
      this.journalHeader.journal_id
    );

    if (journal !== null) {
      if (modify === true) {
        this.journalStore.updateJournal(journal);
        this.refreshJournalForm(journal);
      } else {
        this.journalStore.createJournal(journal);
        this.refreshJournalForm(journal);
        this.bNewJournal = false;
      }
      this.bHeaderDirty = false;
    } else {
      this.toastr.info(
        "Unable to save the transaction due to an error in the transaction data. Please check"
      );
    }
  }

  onErrorMessage(msg: string) {
    this.toastr.info(msg, "ERROR");
  }
  // ::onCopyLine make a complete duplicate fo the currently selected line item.
  onCopyLine(detail: IJournalDetail) {
    this.journalStore.createJournalDetail(detail);
  }

  // ::OnSaveBatch
  onSaveBatch(details: any[]) {
    let party_id = ""; // the party control might not be used if the transaction is a GL type.
    let journalId = this.journalHeader.journal_id;
    let header = this.journalForm.getRawValue();
    let templateCtrl = this.templateCtrl.value;

    let maxJournalId = this.journalStore.maxJournal();
    let userName = this.journalStore.userName();
    let trans_type = this.journalHeader.type;
    let sub_type = this.journalHeader.sub_type;
    const transDate = new Date(header.transaction_date)
      .toISOString()
      .slice(0, 10);

    if (header.due_date === null || header.due_date === undefined) {
      header.due_date = new Date().toISOString().slice(0, 10);
    } else {
      header.due_date = new Date(header.due_date).toISOString().slice(0, 10);
    }

    if (journalId === 0 || journalId === null || journalId === undefined) {
      if (this.bNewJournal === true) {
        journalId = this.journalHeader.journal_id;
      } else {
        journalId = maxJournalId;
      }
    }
    let partyCtrl = this.partyCtrl.value;
    if (partyCtrl === undefined || partyCtrl === null) {
      party_id = "";
    } else {
      party_id = partyCtrl.party_id;
    }

    const journalHeader = {
      journal_id: journalId,
      description: header.description,
      booked: false,
      due_date: header.due_date.toString(),
      booked_date: new Date().toISOString().slice(0, 10),
      booked_user: userName,
      create_date: new Date().toISOString().slice(0, 10),
      create_user: userName,
      period: this.currentYear,
      period_year: this.currentYear,
      transaction_date: transDate,
      status: "OPEN",
      type: trans_type,
      sub_type: sub_type,
      amount: header.amount,
      party_id: party_id,
      invoice_no: header.invoice_no,
      template_name: templateCtrl.template_name,
      template_ref: templateCtrl.template_ref,
    };

    // function creates an array used to send to the server for update

    let journal = onModifyJournal(
      journalHeader,
      userName,
      details,
      templateCtrl,
      this.currentPrd,
      this.currentYear,
      journalId
    );
    if (journal !== null) {
      if (this.bNewJournal === true) {
        this.templateCtrl.setValue(
          this.templateList.find(
            (x) => x.template_name === templateCtrl.template_name
          )
        );

        const party = this.partyList.find((x) => x.party_id === party_id);
        console.debug("party: ", party);

        this.partyCtrl.setValue(
          this.partyList.find((x) => x.party_id === party_id)
        );

        this.journalForm.patchValue({
          description: journal.description,
          amount: journal.amount,
          transaction_date: journal.transaction_date,
          invoice_no: journal.invoice_no,
          due_date: journal.due_date,
        });
        this.journalStore.createJournal(journal);
        this.bHeaderDirty = false;
      } else {
        this.journalStore.updateJournal(journal);
        this.bHeaderDirty = false;
      }
    } else {
      this.toastr.info(
        "Unable to save the journal entry. Please check the transaction for errors."
      );
    }
  }

  // ::Switch Edit Mode
  public switchEditMode(mode: string): void {
    this.journalStore.updateEditMode(mode);
  }
  writeToXL() {
    // let data = this.journalStore.glDetails();
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, "Journal Details");
    // const fileName = `my-data.xlsx`;
    // XLSX.writeFile(wb, fileName);
  }

  // ::Update Journal Detail
  onUpdateJournalDetail() {
    const details = this.journalStore.glDetails();
    const detail = this.detailForm.getRawValue();
    const dDate = new Date();
    const updateDate = dDate.toISOString().split("T")[0];
    const userName = this.journalStore.userName();
    const credit = Math.abs(Number(detail.credit));
    const debit = Math.abs(Number(detail.debit));
    const subtype = this.subtypeDropDown().getDropdownValue();
    const child = this.accountDropDown().getDropdownValue();
    const fund = this.fundDropDown().getDropdownValue();

    const child1 = this.detailForm.get("accounts")?.value;

    if (debit > 0 && credit > 0) {
      this.toastr.show(
        "Only one of the debit field and credit field may be greater than zero.",
        "Failed"
      );
      return;
    }

    const journalDetail = {
      journal_id: this.currentDetailData.journal_id,
      journal_subid: this.currentDetailData.journal_subid,
      account: Number(child.account),
      child: Number(child.child),
      child_desc: this.currentDetailData.child_desc,
      description: detail.description,
      create_date: updateDate,
      create_user: userName,
      sub_type: subtype,
      fund: fund,
      debit: debit,
      credit: credit,
      period: this.currentPrd,
      period_year: this.currentYear,
      reference: detail.reference,
    };

    details.push(journalDetail);

    this.onSaveBatch(details);

    this.closeDrawer();
  }

  onCreateCopiedDetail(journalDetail: IJournalDetail) {
    const detail = journalDetail;
    const dDate = new Date();
    const updateDate = dDate.toISOString().split("T")[0];
    const userName = this.journalStore.userName();
    const credit = Math.abs(Number(detail.credit));
    const debit = Math.abs(Number(detail.debit));
    const subtype = this.subtypeDropDown().getDropdownValue();
    const child = this.accountDropDown().getDropdownValue();

    const nextJournalSubId = this.journalStore.glDetails().length + 1;

    if (debit > 0 && credit > 0) {
      this.toastr.show(
        "Only one of the debit field and credit field may be greater than zero!",
        "Failed"
      );
      return;
    }

    const jnlDetail = {
      journal_id: this.journalHeader.journal_id,
      journal_subid: nextJournalSubId,
      account: Number(child.account),
      child: Number(child.child),
      child_desc: child.description,
      description: detail.description,
      create_date: updateDate,
      create_user: userName,
      sub_type: subtype,
      debit: debit,
      credit: credit,
      reference: detail.reference,
      fund: detail.fund,
    };

    this.journalStore.createJournalDetail(jnlDetail);
  }

  // ::Create Journal Detail
  onCreateJournalDetail() {
    const detail = this.detailForm.getRawValue();
    const dDate = new Date();
    const updateDate = dDate.toISOString().split("T")[0];
    const userName = this.journalStore.userName();
    const credit = Math.abs(Number(detail.credit));
    const debit = Math.abs(Number(detail.debit));
    const subtype = this.subtypeDropDown().getDropdownValue();
    const child = this.accountDropDown().getDropdownValue();
    const fund = this.fundDropDown().getDropdownValue();

    const nextJournalSubId = this.journalStore.glDetails().length + 1;

    if (debit > 0 && credit > 0) {
      this.toastr.show(
        "Only one of the debit field and credit field may be greater than zero!",
        "Failed"
      );
      return;
    }

    const journalDetail = {
      journal_id: this.journalHeader.journal_id,
      journal_subid: nextJournalSubId,
      account: Number(child.account),
      child: Number(child.child),
      child_desc: child.description,
      description: detail.description,
      create_date: updateDate,
      create_user: userName,
      sub_type: subtype,
      debit: debit,
      credit: credit,
      period: this.currentPrd,
      period_year: this.currentYear,
      reference: detail.reference,
      fund: fund,
    };

    this.journalStore.createJournalDetail(journalDetail);

    this.closeDrawer();
  }

  ngOnDestroy(): void {
    this.exitWindow();

    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();

    this._onDestroy.next();
    this._onDestroy.complete();

    this.destroyJournalForm$.next();
    this.destroyJournalForm$.complete();

    this.destroyDetailForm$.next();
    this.destroyDetailForm$.complete();

    this.hotkeysService.removeShortcut("control.s");
    this.hotkeysService.removeShortcut("alt.n");
  }

  // ::Show Alert
  ShowAlert(message: string, response: string) {
    if (response == "pass") {
      this.toastr.success(message);
    } else {
      this.toastr.error(message);
    }
    return;
  }

  @HostListener("window:exit")
  public exitWindow(): boolean {
    return false;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.gridHeight = event.target.innerHeight - 490;
  }
}

export default JournalUpdate;
