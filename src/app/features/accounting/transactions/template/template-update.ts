import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, HostListener, OnDestroy, Output, ViewChild, inject, input, output, viewChild } from "@angular/core";
import {
    AggregateService,
    ColumnMenuService,
    CommandColumnService,
    CommandModel,
    ContextMenuService,
    DialogEditEventArgs,
    EditService,
    FilterService,
    GridComponent,
    GridModule,
    GroupService,
    ResizeService,
    RowDDService,
    RowDragEventArgs,
    RowSelectEventArgs,
    SearchService,
    SortService,
    ToolbarService,
} from "@syncfusion/ej2-angular-grids";
import { AutoCompleteModule, ComboBoxModule, DropDownListAllModule, MultiSelectModule } from "@syncfusion/ej2-angular-dropdowns";
import {
    ContextMenuComponent,
    ContextMenuModule,
    MenuEventArgs,
    MenuItemModel,
} from "@syncfusion/ej2-angular-navigations";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import {IDropDown, IDropDownAccounts, IFunds} from "app/models";
import {
    IJournalDetail,
    IJournalDetailTemplate,
    IJournalHeader,
    IJournalTemplate,
} from "app/models/journals";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { MatFormField, MatSelect, MatSelectModule } from "@angular/material/select";
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ReplaySubject, Subject, take, takeUntil } from "rxjs";
import { Splitter, SplitterComponent, SplitterModule } from '@syncfusion/ej2-angular-layouts';

import { AUTH } from "app/app.config";
import { AccountDropDownComponent } from "../../grid-components/drop-down-account.component";
import { CommonModule } from "@angular/common";
import { FundsDropDownComponent } from "../../grid-components/drop-down.funds.component";
import { FuseConfirmationService } from "app/services/confirmation";
import { GridMenubarStandaloneComponent } from "../../grid-components/grid-menubar.component";
import { ISubType } from "app/models/subtypes";
import { Location } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { Router } from "@angular/router";
import { SubtypeDropDownComponent } from "../../grid-components/drop-down.subtype.component";
import { TemplateDetail } from "./template-detail";
import { TemplateList } from "./template-list";
import { TemplateStore } from "app/store/template.store";
import { ToastrService } from "ngx-toastr";

const imports = [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMatSelectSearchModule,
    NgxMaskDirective,
    ContextMenuModule,
    GridModule,
    SplitterModule,
    ComboBoxModule,
    MultiSelectModule,
    AutoCompleteModule,
    DropDownListAllModule,
    GridMenubarStandaloneComponent,
    SubtypeDropDownComponent,
    AccountDropDownComponent,
    TemplateDetail,
    TemplateList,
    ReactiveFormsModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatDividerModule,
  NgApexchartsModule,
  MatTableModule,
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSidenavModule,
  MatProgressSpinnerModule
];


@Component({
    animations: [
        trigger('paneAnimation', [
            state('closed', style({
                transform: 'scaleX(0)',
                opacity: 0,
                width: '0px'
            })),
            state('open', style({
                transform: 'scaleX(1)',
                opacity: 1,
                width: '*'
            })),

        ]),
    ],
    template: `
    <div id="target" class="flex flex-col w-full filter-article filter-interactive text-gray-700">
        @if (bShowMenubar === true) {
        <div class="sm:hide md:visible ml-5 mr-5">
            <grid-menubar class="pl-5 pr-5" [showPeriod]="false" [showBack]="true" [showClone]="true" [showSave]="true"
                [showNew]="true" [showDelete]="true" [showPrint]="false" [showExportXL]="false" [showExportPDF]="false"
                [showExportCSV]="false" [showEditType]="false"  (back)="onBack()" (new)="onNew($event)"
                (clone)="onClone('GL')" [inTitle]="'Journal Template'">
            </grid-menubar>
        </div>
        }
    @defer (on viewport; on timer(200ms)) {
        <mat-drawer-container id="target"
            class="control-section default-splitter flex flex-col h-[calc(100vh-14rem)] ml-5 mr-5 overview-hidden"
            [hasBackdrop]="'false'">
            <mat-drawer class="w-full md:w-87.5 bg-white-100" #drawer [opened]="false" mode="side" [position]="'end'"
                [disableClose]="false">
                <mat-card class="m-2">
                    <form [formGroup]="detailForm">
                        <div class="flex flex-col w-full filter-article filter-interactive text-gray-700 rounded-lg">
                            <div class="text-3xl gap-2 m-1 text-gray-100 p-2 bg-slate-600 rounded-md" mat-dialog-title>
                                {{ "Journal Update" }}
                            </div>
                        </div>
                        <section class="flex flex-col gap-1">
                            <!-- Drop down accounts list -->
                            <account-drop-down [dropdownList]="templateStore.readDropDownAccounts()" controlKey="account" label="Account" #accountDropDown> </account-drop-down>

                            <!-- Sub Type  -->
                            <subtype-drop-down [dropdownList]="templateStore.readSubtypes()" controlKey="subtype" label="Account Sub Type"
                                    #subtypeDropDown></subtype-drop-down>


                            <!-- Funds -->
                            <funds-drop-down [dropdownList]="templateStore.readFunds()" controlKey="funds" label="Funds" #fundsDropDown></funds-drop-down>


                            <!-- Description  -->
                            <mat-form-field class="flex-col ml-2 mr-2 mt-1 grow">
                                <mat-label class="text-md ml-2">Description</mat-label>
                                <input matInput placeholder="Description" formControlName="description"
                                    [placeholder]="'Description'" />
                                <mat-icon class="icon-size-5 text-lime-700" matSuffix
                                    [svgIcon]="'heroicons_solid:calculator'"></mat-icon>
                            </mat-form-field>
                        </section>

                        <section class="flex flex-col md:flex-row gap-2 mt-1">
                            <!-- Debit  -->
                            <mat-form-field class="ml-2 mt-1 grow">
                                <mat-label class="text-md ml-2">Debits</mat-label>
                                <input type="text" mask="separator.2" [leadZero]="true" thousandSeparator=","
                                    class="text-right" matInput [placeholder]="'Debit'" formControlName="debit" />
                                <mat-icon class="icon-size-5 text-lime-700" matPrefix
                                    [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                            </mat-form-field>

                            <!-- Credit  -->
                            <mat-form-field class="grow mr-2 mt-1">
                                <mat-label class="text-md ml-2">Credits</mat-label>
                                <input type="text" mask="separator.2" [leadZero]="true" thousandSeparator=","
                                    class="text-right" matInput [placeholder]="'Credit'" formControlName="credit" />
                                <mat-icon class="icon-size-5 text-lime-700" matPrefix
                                    [svgIcon]="'heroicons_solid:currency-dollar'"></mat-icon>
                            </mat-form-field>
                        </section>
                    </form>
                    <div mat-dialog-actions class="gap-2 mb-3 mt-5">
                        <button mat-icon-button color=primary class="bg-gray-200 fill-slate-100 hover:bg-slate-400 ml-1"
                            (click)="onUpdateTemplateDetail()" matTooltip="Update Line Item" aria-label="hover over">
                            <mat-icon [svgIcon]="'feather:save'"></mat-icon>
                        </button>

                        <button mat-icon-button color=primary class="bg-slate-200 hover:bg-slate-400 ml-1"
                            (click)="onNewLineItem()" matTooltip="Add New Entry" aria-label="hovered over">
                            <span class="e-icons e-circle-add"></span>
                        </button>

                        <button mat-icon-button color=primary class="bg-gray-200 fill-slate-100 hover:bg-slate-400 ml-1"
                            (click)="onDeleteDetail()" matTooltip="Remove Current Line" aria-label="hover over">
                            <span class="e-icons e-circle-remove"></span>
                        </button>

                        <button mat-icon-button color=primary class="bg-gray-200 fill-slate-100 hover:bg-slate-400 ml-1"
                            (click)="closeDrawer()" matTooltip="Close Edit" aria-label="hovered over">
                            <span class="e-icons e-chevron-left"></span>
                        </button>
                    </div>
                </mat-card>
            </mat-drawer>
            <section class="pane1 overflow-hidden">
                <ejs-splitter #splitterInstance id="nested-splitter" class="h-[calc(100vh-14rem)]" [separatorSize]="3" orientation="Horizontal" width="100%">
                    <e-panes>
                        <e-pane min="60px" size="20%" class="w-64">
                            <ng-template #content>
                                <template-list (template)="onTemplateSelected($event)" [templateList]="templateStore.templates()"></template-list>
                            </ng-template>
                        </e-pane>
                        <e-pane>
                            <ng-template #content>
                                <div id="vertical_splitter" class="vertical_splitter overflow-hidden">
                                <div class="text-xl gap-2 text-primary bg-slate-300 dark:bg-slate-800 p-1 sticky z-10"   >
                                    Template Update
                                </div>
                                    <form [formGroup]="headerTemplateForm">
                                        <section class="flex flex-col md:flex-row">
                                            <div class="flex flex-col w-40 grow">
                                                <mat-label class="text-md ml-2">Name*</mat-label>
                                                <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                                    <input matInput placeholder="Template Name" formControlName="template_name" />
                                                    <mat-icon class="icon-size-5 text-primary" matPrefix [svgIcon]="'heroicons_solid:document-check'"></mat-icon>
                                                </mat-form-field>
                                            </div>
                                            <div class="flex flex-col w-40 grow">
                                                <mat-label class="text-md ml-2">Description*</mat-label>
                                                <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                                    <input matInput placeholder="Description"
                                                        formControlName="description" />
                                                    <mat-icon class="icon-size-5 text-primary" matPrefix
                                                        [svgIcon]="'heroicons_solid:clipboard-document-list'"></mat-icon>
                                                </mat-form-field>
                                            </div>
                                            <div class="flex flex-col w-150 ">
                                                <mat-label class="text-md ml-2">Transaction Type*</mat-label>
                                                <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                                                    <mat-select [formControlName]="'journal_type'" [placeholder]="'Journal Type'" required>
                                                        <mat-option value="GL">GL</mat-option>
                                                        <mat-option value="AR">AR</mat-option>
                                                        <mat-option value="AP">AP</mat-option>
                                                    </mat-select>
                                                    <mat-icon class="icon-size-5 text-primary" matPrefix
                                                        [svgIcon]="'heroicons_solid:document-duplicate'"></mat-icon>
                                                </mat-form-field>
                                            </div>
                                            @if (bHeaderDirty === true ) {
                                                <button mat-icon-button color=primary class="bg-teal-700 text-slate-300 ml-1 mt-8"
                                                    (click)="onUpdateTemplateHeader($event)" matTooltip="Save"
                                                    aria-label="hovered over">
                                                    <span class="e-icons e-save"></span>
                                                </button>
                                            }

                                        </section>
                                    </form>

                                    <!-- Template Details  -->
                                    <div id="target" class="flex flex-col">
                                        <div class="flex flex-col h-full ml-1 mr-1 text-gray-800">
                                            <template-detail class="flex flex-col h-full"
                                                (detail)="onDataSelected($event)"
                                                (save)="onSave($event)"
                                                [accountList]="templateStore.readDropDownAccounts()"
                                                [fundList]="templateStore.readFunds()"
                                                [subtypeList]="templateStore.readSubtypes()"
                                                [details]="templateStore.template_details()" >
                                            </template-detail>
                                        </div>
                                    </div>

                                </div>
                            </ng-template>
                        </e-pane>
                    </e-panes>
                </ejs-splitter>
            </section>
        </mat-drawer-container>
    }
    @placeholder(minimum 200ms) {
        <div class="flex justify-center items-center">
            <mat-spinner></mat-spinner>
        </div>
    }
            <ejs-contextmenu #contextmenu id="contextmenu" target="#target" (select)="itemSelect($event)" [items]="menuItems">
            </ejs-contextmenu>
    </div>
    `,
    selector: "template-update",
    imports: [imports, FundsDropDownComponent],

    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
        provideNgxMask(),
        SortService,
        FilterService,
        ToolbarService,
        EditService,
        SearchService,
        AggregateService,
        GroupService,
        RowDDService,
        ResizeService,
        ContextMenuService,
        ColumnMenuService,
        CommandColumnService
    ],
    styles: [
        `
          .mat-mdc-row {
            height: 36px !important;
          }

          .mat-mdc-header {
            height: 36px !important;
          }

          .mat-mdc-form-field {
            height: 72px !important;
          }

          .mat-mdc-table-sticky-border-elem-top {
            height: 36px !important;
            margin-top: 2px !important;
            background: #64748b !important;
            color: white !important;
          }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JournalTemplateUpdateComponent implements OnDestroy, AfterViewInit {

    // Injections
    private auth = inject(AUTH);
    private toastr = inject(ToastrService);
    private location = inject(Location);
    public templateStore = inject(TemplateStore);
    public toast = inject(ToastrService);

    public accountDropDown = viewChild(AccountDropDownComponent);
    public subtypeDropDown = viewChild<SubtypeDropDownComponent>("subtypeDropDown");
    public fundsDropDown = viewChild<FundsDropDownComponent>("fundsDropDown");

    public fundFields = { text: 'fund', value: 'fund' };
    public accountFields = { text: 'description', value: 'child' };
    public subTypeFields = { text: 'subtype', value: 'subtype' };
    public bShowMenubar: boolean = true;
    public paneState: string = 'open';

    public fuseConfirmationService = inject(FuseConfirmationService);
    public drawer = viewChild<MatDrawer>("drawer");

    public bDetailDirty = false;
    public partyId: string = '';
    public bDirty = false;
    public bTemplateDetails = false;


    public animation = {
        effect: 'FadeIn',
        duration: 800
    };


    // Menu component
    public contextmenu: ContextMenuComponent;
    public value = 0;
    public loading = false;
    public height: string = "250px";

    // Internal control variables
    public currentRowData: IJournalDetailTemplate;
    public bHeaderDirty = false;

    // Data grid settings

    public editSettings: Object;
    public editArtifactSettings: Object;
    public filterSettings: Object;
    public selectionOptions: Object;
    public searchOptions: Object;
    public formatOptions: Object;
    public initialSort: Object;
    public detailSort: Object;
    public message?: string;
    public description?: string;

    @ViewChild("grid")
    public grid!: GridComponent;
    public gridControl = viewChild<GridComponent>("grid");
    public transactionType = 'GL';

    public dFields = { text: "child", value: "child" };

    public debitAccounts: IDropDownAccounts[] = [];
    public debitCtrl: FormControl<IDropDownAccounts> = new FormControl<IDropDownAccounts>(null);
    public debitAccountFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public filteredDebitAccounts: ReplaySubject<IDropDownAccounts[]> = new ReplaySubject<IDropDownAccounts[]>(1);

    public templateHeader: IJournalTemplate;

    protected _onDebitDestroy = new Subject<void>();
    protected _onTemplateDestroy = new Subject<void>();
    protected _onDestroyDebitAccountFilter = new Subject<void>();
    protected _onDestroy = new Subject<void>();


    @ViewChild('splitterInstance') splitterObj?: SplitterComponent;

    singleDebitSelection = viewChild<MatSelect>("singleDebitSelection");
    singleTemplateSelect = viewChild<MatSelect>("singleTemplateSelect");
    singlePartySelect = viewChild<MatSelect>("singlePartySelect");
    details_grid = viewChild<GridComponent>("details_grid");


    // Context Menu Items
    public menuItems: MenuItemModel[] = [{
        id: 'edit',
        text: 'Edit Line Item',
        iconCss: 'e-icons e-edit'
    },
    {
        id: 'evidence',
        text: 'Add Evidence',
        iconCss: 'e-icons e-file-document'
    },
    {
        id: 'lock',
        text: 'Close Transaction',
        iconCss: 'e-icons e-lock'
    },
    {
        id: 'cancel',
        text: 'Cancel Transaction',
        iconCss: 'e-icons e-table-overwrite-cells'
    },
    {
        separator: true
    },
    {
        id: 'back',
        text: 'Back to Transaction List',
        iconCss: 'e-icons e-chevron-left'
    },
    ];

    // Form Groups
    public detailForm = new FormGroup({
        template_ref: new FormControl(0),
        journal_sub: new FormControl(0),
        accounts: new FormGroup({ dropdown: new FormControl(0, Validators.required), }),
        subtype: new FormGroup({ dropdown: new FormControl('', Validators.required), }),
        fund: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        debit: new FormControl(0, Validators.required),
        credit: new FormControl(0, Validators.required),
        reference: new FormControl('', Validators.required),
    });

    public headerTemplateForm = new FormGroup({
        template_ref: new FormControl(0, Validators.required),
        template_name: new FormControl('', Validators.required),
        subtype: new FormGroup({ dropdown: new FormControl('', Validators.required), }),
        description: new FormControl('', Validators.required),
        journal_type: new FormControl('', Validators.required),
        create_date: new FormControl('', Validators.required),
        create_user: new FormControl('', Validators.required),
    });


    onDataSelected(event: any) {
        console.log('Detail Event', event);
    }

    togglePane() {
        this.paneState = (this.paneState === 'open' ? 'closed' : 'open');
    }

    onSave(e: any) {
        // const template_detail = <IJournalDetailTemplate>{
        //     template_ref: e.template_ref,
        //     journal_sub: e.journal_sub,
        //     description: e.description,
        //     account: Number(e.account),
        //     child: Number(e.child),
        //     sub_type: e.sub_type,
        //     fund: e.fund,
        //     debit: e.debit,
        //     credit: e.credit,
        //     reference: e.reference
        // }
        // this.templateStore.updateTemplateDetail(template_detail);

        this.updateTemplateData();

    }

    public updateTemplateData() {

        const updateDate = new Date().toISOString().split('T')[0];
        const inputs = { ...this.headerTemplateForm.value }
        const email = this.templateStore.userName();

        var journalTemplateDetails: IJournalDetailTemplate[] = [];
        let count: number = 1;

        let templateHeader: IJournalTemplate = {
            template_ref: inputs.template_ref,
            description: inputs.description,
            template_name: inputs.template_name,
            journal_type: inputs.journal_type,
            create_date: updateDate,
            create_user: email
        }

        this.templateStore.template_details().forEach((templateDetail) => {
            let tmpDetail: IJournalDetailTemplate = {
                template_ref: templateHeader.template_ref,
                journal_sub: count,
                description: templateDetail.description,
                account: templateDetail.account,
                child: templateDetail.child,
                sub_type: templateDetail.sub_type,
                fund: templateDetail.fund,
                debit: templateDetail.debit,
                credit: templateDetail.credit,
                reference: templateDetail.reference
            }
            journalTemplateDetails.push(tmpDetail);
            count = count + 1;
        });

        this.bDirty = true;
    }

    public onEdit() {
        this.drawer().open();
        this.toastr.success('Transaction saved');
    }

    // Context Menu select event
    public itemSelect(args: MenuEventArgs): void {

        switch (args.item.id) {
            case 'edit':
                this.onEdit();
                break;

            case 'lock':
                this.toastr.success('Transaction closed selected TBD');
                this.onClose();
                break;
            case 'cancel':
                this.onCancel();
                this.toastr.success('Transaction Cancelled selected TBD');
                break;
            case 'back':
                this.onBack();
                break;
        }
    }


    onClose() {
        this.toastr.success('Transaction closed TBD');
    }

    onCancel() {
        this.toastr.success('Transaction cancelled TBD');
    }

    onBack() {
        this.location.back();
    }

    changeFund(e: any) {
        console.debug('change fund: ', e);
        this.bDetailDirty = true;
    }

    changeSubtype(e: any) {
        console.debug('change subtype: ', e);
        this.bDetailDirty = true;
    }

    changeTemplate(e: any) {
        console.debug('change template: ', e);
        this.bDetailDirty = true;
    }

    public onCreated() {
        let splitterObj1 = new Splitter({
            height: '100%',
            separatorSize: 3,
            paneSettings: [
                { size: '70%' },
                { size: '30%' }
            ],
            orientation: 'Vertical'
        });
        splitterObj1.appendTo('#vertical_splitter');
    }

    public onTemplateSelected(template: any) {
        this.refreshHeader(template);
    }

    public createJournalDetailsFromTemplate(value: IJournalTemplate) {
        if (value === null || value === undefined) {
            return;
        }
        this.transactionType = value.journal_type;
        this.templateStore.readTemplateDetails(value.template_ref);
        this.bHeaderDirty = false;
    }

    public ngAfterViewInit() {

        this.debitAccountFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroyDebitAccountFilter))
            .subscribe(() => {
                this.filterDebitAccounts();
            });

        if (this.filteredDebitAccounts)
            this.filteredDebitAccounts
                .pipe(take(1), takeUntil(this._onDebitDestroy))
                .subscribe(() => {
                    if (this.singleDebitSelection() != null || this.singleDebitSelection() != undefined)
                        this.singleDebitSelection().compareWith = (
                            a: IDropDownAccounts,
                            b: IDropDownAccounts
                        ) => {
                            return a && b && a.child === b.child;
                        };
                });

        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.onChanges();
        this.bHeaderDirty = false;
        console.debug('Header is false now');
    }

    public openDrawer() {
        this.bDetailDirty = false;
        this.drawer().open();
    }

    public closeDrawer() {
        this.bDetailDirty = false;
        this.drawer().close();
    }

    public onRowSelected(args: RowSelectEventArgs): void {
        const queryData: any = args.data;
        this.templateStore.readTemplateDetails(queryData.template_ref.toString());
        this.refreshHeader(queryData);
        this.closeDrawer();
    }

    protected filterDebitAccounts() {
        if (!this.debitAccounts) {
            return;
        }

        let search = this.debitAccountFilterCtrl.value;
        if (!search) {
            this.filteredDebitAccounts.next(this.debitAccounts.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        this.filteredDebitAccounts.next(
            this.debitAccounts.filter(
                (account) => account.description.toLowerCase().indexOf(search) > -1
            )
        );
    }

    public OnDetailSelected(data: IJournalDetailTemplate): void {

        const JournalTemplateDetail = {
            template_ref: data.template_ref,
            journal_sub: data.journal_sub,
            description: data.description,
            account: data.account,
            child: data.child,
            sub_type: data.sub_type,
            fund: data.fund,
            debit: data.debit,
            credit: data.credit
        } as IJournalDetailTemplate;

        this.updateDetailForm(JournalTemplateDetail);

    }

    private updateDetailForm(journalTemplateDetail: IJournalDetailTemplate) {
        const accountString = journalTemplateDetail.child.toString();

        if (journalTemplateDetail.sub_type === undefined || journalTemplateDetail.sub_type === null) {
            journalTemplateDetail.sub_type = '';
        }

        const subtypeString = journalTemplateDetail.sub_type;

        this.detailForm.patchValue({
            description: journalTemplateDetail.description,
            fund: journalTemplateDetail.fund,
            debit: journalTemplateDetail.debit,
            credit: journalTemplateDetail.credit,
        });

        this.bHeaderDirty = false;
        this.openDrawer();
    }

    public onChanges(): void {
        this.detailForm.controls['accounts'].valueChanges.subscribe((value) => {
            console.debug('Account changed: ', value);
            this.bDetailDirty = true;
        });

        this.detailForm.valueChanges.subscribe((value) => {
            this.bDetailDirty = true;
        });


        this.debitCtrl.valueChanges.subscribe((value) => {
            this.bDetailDirty = true;
        });

        this.headerTemplateForm.valueChanges.subscribe((value) => {
            if (value === undefined) {
                this.bHeaderDirty = false;
            }
            else {
                this.bHeaderDirty = true;
            }
        }
        );
    }

    public actionComplete(args: DialogEditEventArgs): void {
        console.debug("args : ", args.requestType);
        if (args.requestType === "beginEdit" || args.requestType === "add") {
            if (args.requestType === "beginEdit") {
            } else if (args.requestType === "add") {
            }
        }
    }

    public rowDrag(args: RowDragEventArgs): void {
        (args.rows as Element[]).forEach((row: Element) => {
            row.classList.add("drag-limit");
        });
    }

    public rowDrop(args: RowDragEventArgs): void {
        const value = [];
        for (let r = 0; r < (args.rows as Element[]).length; r++) {
            value.push((args.fromIndex as number) + r);
        }
        this.gridControl().reorderRows(value, args.dropIndex as number);
        this.onSave(args.data);
    }

    public refreshHeader(header: IJournalTemplate) {

        this.templateHeader = header;
        this.headerTemplateForm.patchValue({
            template_ref: header.template_ref,
            description: header.description,
            template_name: header.template_name,
            journal_type: header.journal_type,
            create_date: header.create_date,
            create_user: header.create_user
        });

        this.templateStore.readTemplateDetails(header.template_ref);

        this.bHeaderDirty = false;

        this.templateStore.template_details().forEach((detail) => {
            console.log('Detail Line: ', detail);
        });

    }

    public onNew(e: any) {
        const confirmation = this.fuseConfirmationService.open({
            title: "Create New Template",
            message:
                "Would you like to create a new template? ",
            actions: {
                confirm: {
                    label: "Template",
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
                this.bHeaderDirty = false;
                const header = this.headerTemplateForm.getRawValue();
                this.templateHeader = {
                    template_ref: header.template_ref,
                    description: header.description,
                    template_name: header.template_name,
                    journal_type: header.journal_type,
                    create_date: new Date().toISOString().split("T")[0],
                    create_user: this.templateStore.userName()
                } as IJournalTemplate;
                this.templateStore.createTemplate(this.templateHeader);
                this.toastr.success("New Template Created", "Success");
            }
        });
    }

    public onClone(e: any) {

        this.toastr.success("Journal Cloned", "Success");

        const confirmation = this.fuseConfirmationService.open({
            title: "Clone Current Transaction",
            message:
                "Would you like to clone the current transaction? ",
            actions: {
                confirm: {
                    label: "Clone Transaction",
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === "confirmed") {
            }
        });
    }

    // On delete journal detail
    public onDeleteDetail() {

        const inputs = { ...this.headerTemplateForm.value } as IJournalTemplate

        var journalDetail = {
            journal_id: inputs.template_ref,
        };

        const confirmation = this.fuseConfirmationService.open({
            title: `Delete  transaction detail item : ${journalDetail.journal_id}-${journalDetail.journal_id} `,
            message: "Are you sure you want to delete this line entry? ",
            actions: {
                confirm: {
                    label: "Delete",
                },
            },
        });

        var sub = confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === "confirmed") {
                this.bDetailDirty = false;
                this.closeDrawer();
            }
        });
    }

    // On delete journal detail
    public onDelete(args: any) {
        const inputs = { ...this.headerTemplateForm.value }
        const index = (this.grid as GridComponent).getSelectedRowIndexes();
        const rowData = this.grid.getCurrentViewRecords().at(index[0]) as any;
        var journalDetail = {
            journal_id: inputs.template_ref,
            journal_subid: rowData.journal_subid,
        };
        const confirmation = this.fuseConfirmationService.open({
            title: `Delete  transaction number : ${rowData.journal_id}-${rowData.journal_subid} `,
            message: "Are you sure you want to delete this line entry? ",
            actions: {
                confirm: {
                    label: "Delete",
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === "confirmed") {
                // Delete the list
                // this.store.deleteJournalDetail(journalDetail);
                this.bDetailDirty = false;
            }
        });
    }

    public onOpenEmptyDrawer() {
        this.openDrawer();
    }

    // add a new line entry
    public onNewLineItem() {
        const inputs = { ...this.headerTemplateForm.value } as IJournalHeader;
        const updateDate = new Date().toISOString().split("T")[0];
        var max = 0;

        this.templateStore.template_details().forEach((details) => {
            if (details.journal_sub > max) {
                max = details.journal_sub;
            }
        });

        if (inputs.journal_id === 0) {
            return;
        }

        const name = this.templateStore.userName()
        const dDate = new Date();
        let currentDate = dDate.toISOString().split("T")[0];
        const detail = this.detailForm.getRawValue();

        if (max === 0) {
            max = 1;
        }
        else {
            max = max + 1;
        }

        var debit = Number(detail.debit);
        var credit = Number(detail.credit);
        var childAccount = this.debitCtrl.getRawValue();
        let sub_type = this.subtypeDropDown().getDropdownValue();
        let fund = this.fundsDropDown().getDropdownValue();

        var child_desc = this.templateStore.readDropDownAccounts().find((x) => x.child === childAccount.child).description;

        if (debit > 0 && credit > 0) {
            this.toastr.show('Only one of the debit field and credit field may be greater than zero!', 'Failed');
            return;
        }

        const journalDetail = {
            journal_sub: this.currentRowData.journal_sub,
            account: this.currentRowData.account,
            child: Number(childAccount.child),
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

        this.bDetailDirty = false;
        this.toastr.success('Journal details added');

    }

    journalEntryCleanUp() {
        const inputs = { ...this.headerTemplateForm.value } as IJournalHeader;
        this.detailForm.reset();
        this.debitCtrl.reset();
        //this.store.renumberJournalDetail(inputs.journal_id);
    }

    public onHeaderDateChanged(event: any): void {
        this.bHeaderDirty = true;
    }

    // Update template header
    onUpdateTemplateHeader(e: any) {

        let header = this.headerTemplateForm.getRawValue();

        const journalTemplateHeader = {
            description: header.description,
            template_name: header.template_name,
            template_ref: this.templateHeader.template_ref,
            journal_type: header.journal_type
        } as IJournalTemplate;

        this.templateStore.updateTemplate(journalTemplateHeader);
        this.toastr.success(`Journal header updated : ${this.templateHeader.template_name}`);
        this.bHeaderDirty = false;
    }
    // Create or new journal entry
    public onUpdateTemplate() {

        var header = this.headerTemplateForm.getRawValue();
        var detail = this.detailForm.getRawValue();

        const updateDate = new Date().toISOString().split("T")[0];
        const name = this.templateStore.userName()

        if (
            detail.description === "" ||
            detail.description === undefined ||
            detail.description === null
        ) {

            this.toastr.show('Please select a row to edit', 'Failed');
            return;
        }

        var debit = Number(detail.debit);
        var credit = Number(detail.credit);

        if (debit > 0 && credit > 0) {
            this.toastr.show('Only one of the debit field and credit field may be greater than zero!', 'Failed');
            return;
        }

        const journalTemplateDetail = {
            template_ref: this.currentRowData.template_ref,
            journal_sub: this.currentRowData.journal_sub,
            account: this.currentRowData.account,
            child: detail.accounts.dropdown,
            description: detail.description,
            sub_type: detail.subtype.dropdown,
            debit: debit,
            credit: credit,
            reference: detail.reference,
            fund: detail.fund,
        } as IJournalDetailTemplate;

        const templateHeader: any = {
            description: header.description,
            template_name: header.template_name,
            journal_type: header.journal_type,
            create_date: updateDate,
            create_user: name,
        } as IJournalTemplate;

        this.templateStore.updateTemplate(templateHeader);
        this.templateStore.updateTemplateDetail(journalTemplateDetail);

        this.toastr.success('Journal details updated');

        this.bHeaderDirty = false;
        this.debitCtrl.reset();
    }

    onAddLineItem() {
        this.onNewLineItem();
    }

    onUpdateTemplateDetail() {

        var detail = this.detailForm.getRawValue();
        const dDate = new Date();
        const updateDate = dDate.toISOString().split("T")[0];
        const userName = this.templateStore.userName()
        var debit = Number(detail.debit);
        var credit = Number(detail.credit);
        var childAccount = detail.accounts.dropdown;
        var description = detail.description;
        var fund = detail.fund;

        // var child_desc = this.templateStore.accounts().find((x) => x.child === childAccount.toString()).description;
        // const subtype = this.subtypeDropDown().getDropdownValue();

        // Check for correct child accounts coming from the template
        // Sum the debits and the credits to make sure they are equal

        if (debit > 0 && credit > 0) {
            this.toastr.show('Only one of the debit field and credit field may be greater than zero!', 'Failed');
            return;
        }

        //   template_ref: string,
        //   journal_no: number,
        //   journal_sub: number,
        //   description: string,
        //   account: number,
        //   child: number,
        //   sub_type: string,
        //   fund: string,
        //   debit: number,
        //   credit: number,

        const templateDetail = {
            template_ref: detail.template_ref,
            journal_sub: this.currentRowData.journal_sub,
            account: this.currentRowData.account,
            child: this.currentRowData.child,
            description: detail.description,
            sub_type: this.currentRowData.sub_type,
            debit: debit,
            credit: credit,
            fund: detail.fund
        };

        // this.templateStore.updateTemplateDetail(templateDetail);
        this.toastr.success('Template details updated');

        this.closeDrawer();

    }

    ngOnDestroy(): void {
        this.exitWindow();
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    @HostListener("window:exit")
    public exitWindow() {

        if (this.bHeaderDirty === true) {
            const confirmation = this.fuseConfirmationService.open({
                title: "Unsaved Changes",
                message:
                    "Would you like to save the changes before the edit window is closed and the changes lost?  ",
                actions: {
                    confirm: {
                        label: "Close Without Saving",
                    },
                },
            });
            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                if (result === "confirmed") {
                    this.detailForm.reset();
                    this.headerTemplateForm.reset();
                }
            });
        }
    }

    ShowAlert(message: string, response: string) {
        if (response == "pass") {
            this.toastr.success(message);
        } else {
            this.toastr.error(message);
        }
        return;
    }

    public gridHeight: number;

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.gridHeight = event.target.innerHeight - 300;
    }

}







function trigger(arg0: string, arg1: any[]): any {
  throw new Error("Function not implemented.");
}

function state(arg0: string, arg1: any): any {
  throw new Error("Function not implemented.");
}

function style(arg0: { transform: string; opacity: number; width: string; }): any {
  throw new Error("Function not implemented.");
}

function animate(arg0: string): any {
  throw new Error("Function not implemented.");
}

