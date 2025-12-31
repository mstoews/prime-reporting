import {
  ActionEventArgs,
  AggregateService,
  CellSaveArgs,
  ColumnMenuService,
  ContextMenuService,
  EditService,
  ExcelExportService,
  FilterService,
  GridComponent,
  GridModule,
  GroupService,
  IEditCell,
  PdfExportService,
  ReorderService,
  ResizeService,
  RowDDService,
  RowSelectEventArgs,
  SearchService,
  SortService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { AutoCompleteModule, ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { Component, OnInit, inject, input, output, viewChild } from '@angular/core';
import { ContextMenuModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IDropDownAccounts, IFunds } from 'app/models';
import { IJournalDetail, IJournalDetailTemplate } from '../../../../models/journals';

import { CommonModule } from '@angular/common';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { ISubType } from 'app/models/subtypes';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { ToastrService } from 'ngx-toastr';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';

const imports = [
  CommonModule,
  ReactiveFormsModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatDividerModule,
  NgApexchartsModule,
  MatTableModule,
  FormsModule,
  NgxMatSelectSearchModule,
  ContextMenuModule,
  GridModule,
  SplitterModule,
  ComboBoxModule,
  MultiSelectModule,
  AutoCompleteModule,
  DropDownListAllModule,
  ToolbarModule,
  TooltipModule,
];

interface IAccountsList {
  text: string;
  value: string;
}

@Component({
  selector: 'template-detail',
  imports: [imports],
  template: `
    <div id="template_grid" #template_grid class="flex flex-col">
      <div class="text-xl gap-2 bg-slate-300 text-primary dark:bg-slate-800 p-1 sticky z-10">
        Details
      </div>
      <div class="h-full w-full text-slate-800">
        <ejs-grid
          id="tmp_grid"
          #tmp_grid
          class="m-1"
          [dataSource]="details()"
          [allowFiltering]="false"
          [gridLines]="'Both'"
          [allowSorting]="true"
          [sortSettings]="detailSort"
          [allowRowDragAndDrop]="true"
          [showColumnMenu]="true"
          [toolbar]="toolbarOptions"
          [editSettings]="editSettings"
          [enablePersistence]="false"
          [allowResizing]="true"
          [allowReordering]="true"
          [allowExcelExport]="true"
          [allowSelection]="true"
          [allowPdfExport]="true"
          (actionBegin)="onActionBegin($event)"
          (beforeBatchSave)="onBatchSave($event)"
          (beforeBatchDelete)="batchDelete($event)"
          (rowSelected)="onRowSelected($event)"
          (beforeBatchAdd)="batchBeforeAdd($event)"
          (actionComplete)="onActionComplete($event)"
        >
          <ng-template #toolbarTemplate let-data>
            <ejs-toolbar class="text-primary" (clicked)="toolbarHandler($event)">
              <e-items>
                <e-item>
                  <ng-template #template>
                    <button
                      mat-icon-button
                      color="primary"
                      (click)="onAdd($event)"
                      class="hover:bg-primary-200  md:visible"
                      matTooltip="Add Line Item"
                      aria-label="CSV"
                    >
                      <span class="e-icons e-large  e-add text-primary hover:text-slate-100"></span>
                    </button>
                  </ng-template>
                </e-item>
                <e-item>
                  <ng-template #template>
                    <button
                      mat-icon-button
                      color="primary"
                      (click)="onCopy()"
                      class="hover:bg-primary-200  md:visible"
                      matTooltip="Duplicate Item"
                      aria-label="CSV"
                    >
                      <span
                        class="e-icons e-large  e-copy text-primary hover:text-slate-100"
                      ></span>
                    </button>
                  </ng-template>
                </e-item>

                <e-item>
                  <ng-template #template>
                    <button
                      mat-icon-button
                      color="primary"
                      (click)="onUpdate()"
                      class="hover:bg-primary-200 md:visible"
                      matTooltip="Update"
                      aria-label="CSV"
                    >
                      <span
                        class="e-icons e-large  e-update text-primary hover:text-slate-100"
                      ></span>
                    </button>
                  </ng-template>
                </e-item>
                <e-item>
                  <ng-template #template>
                    <button
                      mat-icon-button
                      color="primary"
                      (click)="onDeleteLineItem()"
                      class="hover:bg-primary-200  md:visible"
                      matTooltip="Delete Line Item"
                      aria-label="CSV"
                    >
                      <span
                        class="e-icons e-large e-trash text-primary hover:text-slate-100"
                      ></span>
                    </button>
                  </ng-template>
                </e-item>

                <e-item>
                  <ng-template #template>
                    <button
                      mat-icon-button
                      color="primary"
                      (click)="onCancel()"
                      class="hover:bg-primary-200  md:visible"
                      matTooltip="Cancel"
                      aria-label="CSV"
                    >
                      <span
                        class="e-icons e-large e-close text-primary hover:text-slate-100"
                      ></span>
                    </button>
                  </ng-template>
                </e-item>
              </e-items>
            </ejs-toolbar>
          </ng-template>
          <e-columns>
            <e-column
              [allowEditing]="false"
              field="template_ref"
              headerText="ID"
              [visible]="false"
              width="80"
              textAlign="Right"
            ></e-column>
            <e-column
              [allowEditing]="false"
              field="journal_sub"
              headerText="No."
              [visible]="true"
              width="80"
              isPrimaryKey="true"
              textAlign="Right"
            ></e-column>
            <e-column
              [allowEditing]="true"
              field="account"
              headerText="Grp"
              [visible]="false"
              width="120"
            ></e-column>
            <e-column
              [allowEditing]="true"
              field="child"
              headerText="Account"
              [visible]="true"
              width="120"
              editType="dropdownedit"
              [edit]="dropdownAccountParams"
            >
            </e-column>
            <e-column
              [allowEditing]="true"
              field="description"
              headerText="Description"
              [visible]="true"
              width="200"
              editType="stringedit"
            ></e-column>
            <e-column
              [allowEditing]="true"
              field="fund"
              headerText="Fund"
              [visible]="true"
              width="100"
              editType="dropdownedit"
              [edit]="dropdownFundsParams"
            ></e-column>
            <e-column
              [allowEditing]="true"
              field="sub_type"
              headerText="Sub Type"
              [visible]="true"
              width="100"
              editType="dropdownedit"
              [edit]="dropdownSubTypeParams"
            >
            </e-column>
            <e-column
              [allowEditing]="true"
              field="debit"
              headerText="Debit"
              textAlign="right"
              width="100"
              editType="numericedit"
              format="P2"
              [edit]="numericParams"
            ></e-column>
            <e-column
              [allowEditing]="true"
              field="credit"
              headerText="Credit"
              textAlign="right"
              width="100"
              editType="numericedit"
              format="P2"
              [edit]="numericParams"
            ></e-column>
          </e-columns>
          <e-aggregates>
            <e-aggregate>
              <e-columns>
                <e-column type="Count" field="child" textAlign="Right">
                  <ng-template #footerTemplate let-data>
                    <div>
                      <span class="text-transparent rounded-md text-[28px] m-2"></span>
                    </div>
                  </ng-template>
                </e-column>
                <e-column type="Sum" field="reference" textAlign="Left">
                  <ng-template #footerTemplate let-data>
                    <div>
                      <span class="text-primary rounded-md text-[16px]  m-2">Total</span>
                    </div>
                  </ng-template>
                </e-column>
                <e-column type="Sum" field="debit" format="P2">
                  <ng-template #footerTemplate let-data>
                    <div>
                      <span class="text-primary rounded-md text-[16px]">{{ data.Sum }} </span>
                    </div>
                  </ng-template>
                </e-column>
                <e-column type="Sum" field="credit" format="P2">
                  <ng-template #footerTemplate let-data>
                    <div>
                      <span class="text-primary rounded-md text-[16px]">{{ data.Sum }} </span>
                    </div>
                  </ng-template>
                </e-column>
              </e-columns>
            </e-aggregate>
          </e-aggregates>
        </ejs-grid>
      </div>
    </div>
  `,
  styles: ``,
  providers: [
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
  ],
})
export class TemplateDetail implements OnInit {
  public details = input<IJournalDetailTemplate[]>();
  public accountList = input<IDropDownAccounts[]>();
  public fundList = input<IFunds[]>();
  public subtypeList = input<ISubType[]>();
  public toastr = inject(ToastrService);

  public detail = output<IJournalDetailTemplate>();
  public save = output();
  public delete_line = output<IJournalDetailTemplate>();
  public create_line = output<IJournalDetailTemplate>();
  public open = output();

  public detailSort: Object = { columns: [{ field: 'journal_sub', direction: 'Ascending' }] };
  public tmp_grid = viewChild<GridComponent>('tmp_grid');

  bShowAddButton = true;
  bShowDeleteButton = true;
  bShowSaveButton = true;
  bShowCopyButton = true;
  bShowCancelButton = true;

  private selectedFund: string = '';
  private selectedSubType: string = '';
  private selectedAccount: string = '';
  public numericParams?: IEditCell;

  public toolbarOptions: any = ['Delete', 'Add', 'Update', 'Cancel', 'Search'];
  public fundFields = { text: 'fund', value: 'fund' };
  public accountFields = { text: 'description', value: 'child' };
  public subTypeFields = { text: 'subtype', value: 'subtype' };

  public editSettings: Object = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    allowSaving: true,
    allowCanceling: true,
    mode: 'Batch',
    newRowPosition: 'Bottom',
  };

  public dropdownFundsParams?: IEditCell;
  public dropdownSubTypeParams?: IEditCell;
  public dropdownAccountParams?: IEditCell;

  ngOnInit(): void {
    this.dropdownAccountParams = {
      params: {
        actionComplete: () => true,
        allowFiltering: true,
        filterType: 'Contains',
        popupHeight: '300px',
        popupWidth: '400px',
        dataSource: new DataManager(this.accountList()),
        fields: { text: 'description', value: 'child' },
        change: (args) => {
          this.onAccountChanged(args.itemData);
        },
        query: new Query(),
      },
    };

    this.dropdownFundsParams = {
      params: {
        actionComplete: () => true,
        allowFiltering: true,
        filterType: 'Contains',
        popupHeight: '300px',
        popupWidth: '400px',
        dataSource: new DataManager(this.fundList()),
        fields: { text: 'fund', value: 'fund' },
        query: new Query(),
      },
    };
    this.dropdownSubTypeParams = {
      params: {
        actionComplete: () => false,
        allowFiltering: true,
        filterType: 'Contains',
        ignoreCase: true,
        popupHeight: '300px',
        popupWidth: '400px',
        dataSource: new DataManager(this.subtypeList()),
        fields: { text: 'sub_type', value: 'sub_type' },
        query: new Query(),
        change: () => {
          return true;
        },
        placeholder: 'Select a Sub Type',
      },
    };

    this.numericParams = {
      params: {
        decimals: 2,
        format: 'N',
        showClearButton: true,
        showSpinButton: true,
      },
    };
  }

  onDataSelected(args: RowSelectEventArgs): void {
    const detailData: any = args.data;
  }

  onUpdate() {}

  getRowCount(): number {
    if (this.tmp_grid() && this.tmp_grid().dataSource) {
      const rowCount = (this.tmp_grid().dataSource as any[]).length;
      return rowCount < 1 ? 0 : rowCount;
    }
    return 0;
  }

  onBatchSave(event: CellSaveArgs): void {
    this.save.emit();
  }

  onDeleteLineItem() {}

  Save(event) {
    this.save.emit();
  }

  batchDelete(event) {
    console.log(event);
  }

  batchBeforeAdd(event) {
    console.log(event);
  }

  onActionComplete(args: any) {
    console.log(args);
  }

  toolbarHandler(e: any) {}

  onRowSelected(args: any) {
    this.bShowCopyButton = true;
    this.bShowDeleteButton = true;
    const selectedRecords =
      this.tmp_grid().getSelectedRecords() as unknown as IJournalDetailTemplate[];
  }

  onAccountChanged(value: any) {
    const selectedRecords =
      this.tmp_grid().getSelectedRecords() as unknown as IJournalDetailTemplate[];
    var subID = 0;
    if (selectedRecords.length > 0) {
      selectedRecords.forEach((record) => {
        subID = record.journal_sub;
      });
      const selectedAccountItem = this.accountList().find(
        (item) => item.child === value.child.toString()
      );
      if (selectedAccountItem) {
        this.tmp_grid().setCellValue(
          selectedRecords[0].journal_sub,
          'child_desc',
          value.description.substring(7, 100)
        );
      }
    }
  }

  onActionBegin(args: ActionEventArgs) {
    console.debug('action begin', JSON.stringify(args));
    if (args.requestType === 'beginEdit') {
      return;
    }

    if (args.requestType === 'add') {
      const template_ref = this.details()[0]?.template_ref || 0;
      const journal_sub =
        this.details().length > 0 ? Math.max(...this.details().map((o) => o.journal_sub)) + 1 : 1;
      args.data['journal_ref'] = template_ref;
      args.data['journal_sub'] = journal_sub;
      return;
    }

    if (args.requestType === 'save') {
      if (
        args.data['child'] === undefined ||
        args.data['child'] === null ||
        args.data['child'] === ''
      ) {
        alert('You must select an Account');
        args.cancel = true;
        return;
      }
      args.data['account'] =
        this.accountList().find((item) => item.child === args.data['child']).account || 0;
      args.data['child_desc'] =
        this.accountList()
          .find((item) => item.child === args.data['child'])
          ?.description.substring(7, 100) || '';

      const detailData: any = args.data;
      this.save.emit(detailData);
      this.selectedFund = '';
      this.selectedSubType = '';
      this.selectedAccount = '';
      return;
    }
  }

  onAdd(e: any) {
    const selectedRecords = this.tmp_grid().getSelectedRecords();
    if (selectedRecords.length > 0) {
      this.tmp_grid().addRecord(selectedRecords[0]);
    } else {
      this.toastr.info('Select a row to create a copy.');
    }
  }

  onSave() {
    this.save.emit();
  }

  onDelete() {
    const selectedRecords = this.tmp_grid().getSelectedRecords();
    if (selectedRecords.length > 0) {
      const primaryKey = this.tmp_grid().getPrimaryKeyFieldNames()[0]; // Get primary key field name
      const recordToDelete = selectedRecords[0];
      const primaryKeyValue = recordToDelete[primaryKey];
      this.tmp_grid().deleteRecord(primaryKeyValue);
    }
  }

  onCopy() {
    const selectedRecords = this.tmp_grid().getSelectedRecords();
    if (selectedRecords.length > 0) {
      const primaryKey = this.tmp_grid().getPrimaryKeyFieldNames()[0]; // Get primary key field name
      const recordToCopy = selectedRecords[0] as IJournalDetailTemplate;
      const primaryKeyValue = recordToCopy[primaryKey];
      this.create_line.emit(recordToCopy);
    }
    //this.createLine.emit(journalChanges)
  }

  onCancel() {
    this.tmp_grid().editModule.closeEdit();
  }

  onFundChanged(event: any, data: any) {
    this.selectedFund = event.itemData.fund;
    this.tmp_grid().setCellValue(data.journal_sub, 'fund', this.selectedFund);
  }

  onSubTypeChanged(event: any, data: any) {
    this.selectedSubType = event.itemData.subtype;
    this.tmp_grid().setCellValue(data.journal_sub, 'sub_type', this.selectedSubType);
  }
}
