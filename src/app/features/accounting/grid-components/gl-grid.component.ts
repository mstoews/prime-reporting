import { AggregateService, ColumnMenuService, ContextMenuItem, ContextMenuService, DialogEditEventArgs, EditService, EditSettingsModel, ExcelExportService, FilterService, FilterSettingsModel, GridComponent, GridLine, GridModule, GroupService, PageService, PdfExportService, ReorderService, ResizeService, SaveEventArgs, SearchService, SearchSettingsModel, SelectionSettingsModel, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { Component, HostListener, OnInit, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridSettingsService, IGridSettingsModel } from 'app/services/grid.settings.service';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';

import { AuthService } from 'app/services/auth.service';
import { CommonModule } from '@angular/common';
import { ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { PrintService } from '@syncfusion/ej2-angular-schedule';
import { ToastrService } from 'ngx-toastr';

const mods = [
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    ContextMenuAllModule
];

const providers = [
    ReorderService,
    PdfExportService,
    PrintService,
    ExcelExportService,
    ContextMenuService,
    GroupService,
    SortService,
    PageService,
    ResizeService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    ColumnMenuService,
    SearchService,
    ContextMenuService
];

const keyExpr = ["account", "child"];

@Component({
    standalone: true,
    selector: 'gl-grid',
    imports: [mods],
    template: `
    <mat-drawer-container class="flex-col h-2/3">
        <ng-container >
            <ejs-grid  #grid_parent id="grid_parent" class="e-grid mt-3 border-1 border-gray-200"
                    [height]='gridHeight'
                    [rowHeight]='40'
                    [dataSource]="data()"
                    [sortSettings]="sortSettings()"
                    [columns]="columns()"
                    [allowSorting]='true'
                    [showColumnMenu]='true'
                    [selectionSettings]="selectionOptions"
                    [gridLines]="lines"
                    [toolbar]='toolbarOptions'
                    [filterSettings]='filterOptions'
                    [editSettings]='editSettings'
                    [allowFiltering]='true'
                    [enablePersistence]='false'
                    [enableStickyHeader]='true'
                    [allowGrouping]="true"
                    [allowResizing]='true'
                    [allowReordering]='true'
                    [allowExcelExport]='true'
                    [allowPdfExport]='true'
                    (actionBegin)='actionBegin($event)'
                    (rowSelected)="rowSelected($event)"
                    (actionComplete)='actionComplete($event)'>
            </ejs-grid>
        </ng-container>
       <ejs-contextmenu
              target='#grid_parent'
              (select)="itemSelect($event)"
              [animationSettings]='animation'
              [items]= 'menuItems'>
        </ejs-contextmenu>
    </mat-drawer-container>
    `,
    providers: [providers],
    styles: [
        ` .e-grid {
             font-family: cursive;
             border: 1px solid #f0f0f0;

        }
            .custom-css {
             font-style: italic;
             color: #007F00
        }
        `
    ]
})
export class GLGridComponent implements OnInit {

    gridForm: any;
    public context: any;
    public gridHeight: number;

    public selectedItemKeys: any[] = [];
    public bDirty: boolean = false;
    readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];
    showPageSizeSelector = true;
    showInfo = true;
    showNavButtons = true;
    public lines: GridLine;
    private authService = inject(AuthService);
    private gridSettingsService = inject(GridSettingsService);
    toast = inject(ToastrService);

    readonly data = input<Object[]>(undefined);
    readonly columns = input<Object[]>(undefined);
    readonly sortSettings = input<Object[]>(undefined);

    public onUpdateSelection = output<Object>();
    public onFocusChanged = output<Object>();
    public contextMenuItems: ContextMenuItem[];
    public editing: EditSettingsModel;

    public formatoptions: Object;
    public initialSort: Object;
    public editSettings: EditSettingsModel;
    public dropDown: DropDownListComponent;
    public submitClicked: boolean = false;
    public selectionOptions?: SelectionSettingsModel;
    public toolbarOptions?: ToolbarItems[];
    public searchOptions?: SearchSettingsModel;
    public filterSettings: FilterSettingsModel;

    public grid = viewChild<GridComponent>('parent_grid');

    public editDrawer = viewChild<MatDrawer>('drawer');
    private fb = inject(FormBuilder);
    public state?: GridComponent;
    public message?: string;
    public userId: string;
    sTitle: any;

    public animation = {
        effect: 'FadeIn',
        duration: 800
    };

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.gridHeight = event.target.innerHeight - 500;
    }

    constructor() {
        this.gridHeight = window.innerHeight - 540;
    }

    public filterOptions: Object = { type: 'Excel' };

    openTrade($event) {
        console.log('openTrade : ', $event);
    }


    ngOnInit() {
        this.context = { enableContextMenu: true, contextMenuItems: [], customContextMenuItems: [{ id: 'clear', text: "Clear Selection" }] };
        this.initialDatagrid();
        this.lines = 'Both';
        this.editing = { allowDeleting: true, allowEditing: true, allowEditOnDblClick: false, allowAdding: true };
        this.userId = this.authService.user()?.uid
        this.createEmptyForm();
    }


    public menuItems: MenuItemModel[] = [
        { id: 'edit', text: 'Edit Account', iconCss: 'e-icons e-edit' },
        { id: 'add', text: 'Add New Account', iconCss: 'e-icons e-file-document' },
        { id: 'delete', text: 'Delete Account', iconCss: 'e-icons e-circle-remove' },
        { separator: true },
        { id: 'back', text: 'Return', iconCss: 'e-icons e-chevron-left' },
    ];


    public itemSelect(args: MenuEventArgs): void {

        switch (args.item.id) {
            case 'Edit':
                this.onEdit(args);
                break;
            case 'Create':
                this.onAdd();
                break;

            case 'Delete':
                this.onDelete(args);
                break;
            case 'Back':
                // this.onBack();
                break;
        }
    }


    onClone(e: any) {
        this.toast.success('Template Clone', 'Clone');
    }

    rowSelected($event: any) {
        this.onFocusChanged.emit($event);
    }

    onEdit(e: any) {
        this.toast.success('Edit Journal', 'Edit');
    }

    onDelete(e: any) {
        this.toast.success('Template');
    }

    onPrint() {
        this.grid().print();
    }


    onUpdate(e: any) {
        const rawData = {
            settings_name: this.gridForm.value.settings_name,
            grid_name: this.gridForm.value.grid_name,
        };
        this.closeDrawer();
    }

    onCreate($event: any) {
        this.toast.success('onCreate called');
    }



    public readSettings() {
        return this.gridSettingsService.readAll();
    }

    public savePersistData(gridSettings: IGridSettingsModel) {
        var persistData = this.grid().getPersistData(); // Grid persistData
        gridSettings.userId = this.userId;
        gridSettings.settings = persistData;
        this.addFormatSettings(gridSettings); // Grid persistData
        console.log("Grid state saved.");
    }

    public restorePersistData(settingsName: string) {
        const formats = this.gridSettingsService.readSettingsName(settingsName);
        formats.subscribe(format => {
            var settings = format[0].settings;
            if (settings) {
                this.grid().setProperties(JSON.parse(settings));
            }
        });
    }

    onExportExcel() {
        console.log('Excel');
        const fileName = new Date().toLocaleDateString() + '.xlsx';
        this.grid()!.excelExport({ fileName: fileName });
    }

    onExportCSV() {
        console.log('Refresh');
        this.grid()!.csvExport();
    }

    onExportPDF() {
        console.log('Refresh');
        const fileName = new Date().toLocaleDateString() + '.xlsx';
        this.grid()!.pdfExport({
            pageOrientation: 'Landscape', pageSize: 'A4', fileName: 'TB-31-01-2024.pdf', header: {
                fromTop: 0,
                height: 120,
                contents: [
                    {
                        type: 'Text',
                        position: { x: 10, y: 50 },
                        style: { textBrushColor: '#000000', fontSize: 30 },
                    },
                ]
            }
        });
    }

    public onAdd() {

    }

    public readAllSettings(): Observable<IGridSettingsModel[]> {
        return this.gridSettingsService.readAll();
    }

    private addFormatSettings(settings: IGridSettingsModel) {
        this.gridSettingsService.create(settings);
    }


    private getFormatByName(userId: string) {
        return this.gridSettingsService.readUserId(userId);
    }


    onFocusedRowChanged(e: any) {
        this.onFocusChanged.emit(e);
    }

    initialDatagrid() {
        this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' }
        this.selectionOptions = { mode: 'Row' };
        this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
        this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
        this.toolbarOptions = ['Search'];
        this.filterSettings = { type: 'Excel' };
    }

    actionBegin(args: SaveEventArgs): void {
        var data = args.rowData;

        if (args.requestType === 'beginEdit' || args.requestType === 'add') {
            args.cancel = true;
            this.onUpdateSelection.emit(data);
        }

        if (args.requestType === 'delete') {
            args.cancel = true;
            this.onUpdateSelection.emit(data);
        }
        if (args.requestType === 'save') {
            args.cancel = true;
        }
    }

    public setRowHeight(height: number): void {
        this.grid().rowHeight = height;
    }

    actionComplete(args: DialogEditEventArgs): void {
        if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
            if (args.requestType === 'beginEdit') {

            } else if (args.requestType === 'add') {

            }
        }
    }

    createEmptyForm() {
        this.gridForm = this.fb.group({
            settings_name: [''],
            grid_name: [''],
        });
    }

    public openEditDrawer() {
        const opened = this.editDrawer().opened;
        if (opened !== true) {
            this.editDrawer().toggle();
        } else {
            return;
        }
    }

    closeDrawer() {
        const opened = this.editDrawer().opened;
        if (opened === true) {
            this.editDrawer().toggle();
        } else {
            return;
        }
    }




}
