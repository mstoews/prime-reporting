import {
  ActionEventArgs,
  AggregateService,
  BeforeBatchDeleteArgs,
  ColumnMenuService,
  CommandColumnService,
  ContextMenuService,
  DetailRowService,
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
  RowDragEventArgs,
  RowSelectEventArgs,
  SearchService,
  SelectionSettingsModel,
  ToolbarService,
} from "@syncfusion/ej2-angular-grids";
import { AutoCompleteModule, ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns'
import {Component, HostListener, OnInit, inject, input, output, viewChild} from '@angular/core';
import { ContextMenuModule, NodeSelectEventArgs, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { DdtSelectEventArgs, DropDownListAllModule, DropDownTreeAllModule, DropDownTreeComponent } from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IDropDownAccounts, IFunds } from 'app/models';

import { CommonModule } from '@angular/common';
import { IJournalDetail } from 'app/models/journals';
import { ISubType } from 'app/models/subtypes';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { ToastrService } from 'ngx-toastr';
import { TooltipModule } from "@syncfusion/ej2-angular-popups";

const imports = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  NgxMatSelectSearchModule,
  ContextMenuModule,
  GridModule,
  SplitterModule,
  ComboBoxModule,
  MultiSelectModule,
  AutoCompleteModule,
  DropDownListAllModule,
  DropDownTreeAllModule,
  ToolbarModule,
  TooltipModule,
  DropDownTreeAllModule
];

interface IAccountsList {
  text: string;
  value: string;
}

type MetaData = {
    id: number | string ;
    parentId: number | string;
    name: string;
    hasChild: boolean;
    expanded: boolean;
}

// id: 7, name: 'Department', hasChild: true, expanded: true, selectable: 'false'

@Component({
  selector: 'transaction-detail',
    imports: [imports ],
  template: `
    <div id="detail_grid" #detail_grid class="flex flex-col">
      <!-- <div class="text-xl gap-2 text-slate-800 bg-slate-300 dark:text-slate-200 dark:bg-slate-800 p-1 sticky z-10"> Debits and Credits </div> -->
      <div class="h-full w-full text-slate-800">
          <ejs-grid id="details_grid" #details_grid class="m-1"

              [dataSource]="details()"
              [rowHeight]="45"
              [allowFiltering]="false"
              [gridLines]="'Both'"
              [allowSorting]='true'
              [sortSettings]= 'detailSort'
              [allowRowDragAndDrop]='true'
              [selectionSettings]="selectionOptions"
              [showColumnMenu]='true'
              [toolbar]='toolbarOptions'
              [editSettings]='editSettings'
              [enablePersistence]='false'
              [allowResizing]='true'
              [allowReordering]='true'
              [allowExcelExport]='true'
              [allowSelection]='true'
              [allowPdfExport]='true'
              (cellEdit)="onCellEdit($event)"
              (cellSelected)="onCellSelected($event)"
              (rowDrop)="rowDrop($event)"
              (rowDrag)="rowDrag($event)"
              (beforeBatchSave)="batchSave($event)"
              (beforeBatchDelete)="batchDelete($event)"
              (rowSelected)="onRowSelected($event)"
              (beforeBatchAdd)="batchBeforeAdd($event)"
              (actionBegin)='onActionBegin($event)'
              (actionComplete)="onActionComplete($event)"

              (rowDataBound)='rowDataBound($event)'>
              <ng-template  #toolbarTemplate let-data>
                  <ejs-toolbar class="text-primary" (clicked)='toolbarHandler($event)'>
                      <e-items>
                          <e-item>
                              <ng-template #template>
                                  <button mat-icon-button color=primary  (click)="onAdd()" class="hover:bg-primary-200  md:visible" matTooltip="Add Line Item"  aria-label="CSV" >
                                      <span class="e-icons e-large  e-add text-primary hover:text-slate-100"></span>
                                  </button>
                              </ng-template>
                          </e-item>
                          <e-item>
                              <ng-template #template>
                                  <button mat-icon-button color=primary  (click)="onCopy()" class="hover:bg-primary-200  md:visible" matTooltip="Duplicate Item"  aria-label="CSV" >
                                      <span class="e-icons e-large  e-copy text-primary hover:text-slate-100"></span>
                                  </button>
                              </ng-template>
                          </e-item>

                          <e-item>
                              <ng-template #template>
                                  <button mat-icon-button color=primary  (click)="onUpdate()" class="hover:bg-primary-200 md:visible" matTooltip="Update"  aria-label="CSV" >
                                      <span class="e-icons e-large  e-update text-primary hover:text-slate-100"></span>
                                  </button>
                              </ng-template>
                          </e-item>
                          <e-item>
                              <ng-template #template>
                                  <button mat-icon-button color=primary  (click)="onDeleteLineItem()" class="hover:bg-primary-200  md:visible" matTooltip="Delete Line Item"  aria-label="CSV" >
                                      <span class="e-icons e-large e-trash text-primary hover:text-slate-100"></span>
                                  </button>
                              </ng-template>
                          </e-item>

                          <e-item>
                              <ng-template #template>
                                  <button mat-icon-button color=primary  (click)="onCancel()" class="hover:bg-primary-200  md:visible" matTooltip="Cancel"  aria-label="CSV" >
                                      <span class="e-icons e-large e-close text-primary hover:text-slate-100"></span>
                                  </button>
                              </ng-template>
                          </e-item>

                      </e-items>
                  </ejs-toolbar>
              </ng-template>
              <e-columns>
                  <e-column [allowEditing]='false' type='numeric'  field='journal_id'    headerText='Journal ID'   [visible]='false' width='100'></e-column>
                  <e-column [allowEditing]='false' type='numeric'  field='journal_subid' headerText='ID'           [visible]='false' isPrimaryKey='true'  width='100'></e-column>
                  <e-column [allowEditing]='false' type='numeric'  field='account'       headerText='Group'        [visible]='false' width='150'></e-column>
                  <e-column [allowEditing]='true'  type='string'   field='child'         headerText='Account'      [visible]='true'  width='150'  editType="dropdownEdit" [edit]="dropdownAccountParams" ></e-column>
                  <e-column [allowEditing]='false' type='string'   field='child_desc'    headerText='Acct Desc'    [visible]='true'  width='200' ></e-column>
                  <e-column [allowEditing]='true'  type='string'   field='description'   headerText='Description'  [visible]='true'  width='150' ></e-column>
                  <e-column [allowEditing]='true'  type='string'   field='fund'          headerText='Fund'         [visible]='true'  width='150'  editType="dropdownEdit" [edit]="dropdownFundsParams" ></e-column>
                  <e-column [allowEditing]='true'  type='string'   field='sub_type'      headerText='Sub Type'     [visible]='true'  width='150'  editType="dropdownEdit" [edit]="dropdownSubTypeParams"> </e-column>
                  <e-column field='category' headerText='Meta Data' width='250'>
                      <ng-template #template let-data>
                          <ejs-dropdowntree class="-m-1 -p-1 border-red" id='dropdownTree' [fields]='fields'  (select)="onDropDownSelect($event)"  [allowFiltering]="true" [showCheckBox]='true' [popupWidth]="400" [treeSettings]='treeSettings'></ejs-dropdowntree>
                      </ng-template>
                  </e-column>
                  <e-column [allowEditing]='true'  type='string'   field='reference'     headerText='Reference'    [visible]='true'  width='120'></e-column>
                  <e-column [allowEditing]='true'  type='number'   field='debit'         headerText='Debit'        format='N2'      [visible]='true' width='150' textAlign='Right'></e-column>
                  <e-column [allowEditing]='true'  type='number'   field='credit'        headerText='Credit'       format='N2'    [visible]='true' width='150' textAlign='Right' ></e-column>
              </e-columns>
              <e-aggregates>
                  <e-aggregate>
                      <e-columns>
                        <e-column type="Count" field="child" textAlign='Right'>
                              <ng-template #footerTemplate let-data>
                                  <div>
                                      <span class="text-transparent rounded-md text-[28px] m-2"></span>
                                  </div>
                              </ng-template>
                          </e-column>
                        <e-column type="Sum" field="reference" textAlign='Left'>
                              <ng-template #footerTemplate let-data>
                                  <div>
                                      <span class="text-primary rounded-md text-[16px]  m-2">Total</span>
                                  </div>
                          </ng-template>
                          </e-column>
                          <e-column type="Sum" field="debit" format="N2" >
                              <ng-template #footerTemplate let-data>
                                  <div>
                                    <span class="text-primary rounded-md text-[16px]">{{data.Sum}} </span>
                                  </div>
                          </ng-template>
                          </e-column>
                      <e-column type="Sum" field="credit" format="N2">
                          <ng-template #footerTemplate let-data>
                              <div>
                                    <span class="text-primary rounded-md text-[16px]">{{data.Sum}} </span>
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
  styles: `
  `,
  providers: [
    FilterService,
    ToolbarService,
    EditService,
    SearchService,
    AggregateService,
    ExcelExportService,
    PdfExportService,
    ReorderService,
    ResizeService,
    GroupService,
    RowDDService,
    ContextMenuService,
    ColumnMenuService,
    CommandColumnService,
    DetailRowService
  ],
})

export class GlDetail implements OnInit {

  // Drop down tree
  public dropdownTreeData: { [key: string]: Object }[] = [
    { id: 'location', name: 'Location', hasChild: true, expanded: true, selectable: 'false' },
    { id: 2, pid: 'location', name: 'Regina' },
    { id: 3, pid: 'location', name: 'Saskatoon' },
    { id: 7, name: 'Department', hasChild: true, expanded: true, selectable: 'false' },
    { id: 8, pid: 7, name: 'Operations' },
    { id: 9, pid: 7, name: 'Admin' },
    { id: 10, pid: 7, name: 'Capital Assets' },
    { id: 11, name: 'Activity', hasChild: true, expanded: true, selectable: false },
    { id: 12, pid: 11, name: 'Fundraising' },
    { id: 13, pid: 11, name: 'Governance' },
    { id: 14, pid: 11, name: 'Program A' },
    { id: 15, pid: 11, name: 'Program B' },
    { id: 16, name: 'Tax Code', hasChild: true, expanded: true, selectable: false },
    { id: 17, pid: 16, name: 'C01' },
    { id: 18, pid: 16, name: 'C02' },
    { id: 19, pid: 16, name: 'C03' },
    { id: 20, pid: 16, name: 'C04' },
    { id: 21, pid: 16, name: 'C05' },
    { id: 22, pid: 16, name: 'C06' },
    { id: 23, pid: 16, name: 'C07' },
    { id: 24, pid: 16, name: 'C08' },
    { id: 25, pid: 16, name: 'C09' },
    { id: 26, pid: 16, name: 'C010' },

  ];

  public fields: Object = {
    dataSource: this.dropdownTreeData,
    value: 'id',
    allowMultiSelection: 'allowMultiSelection',
    selectable: 'false',
    text: 'name',
    placeholder: 'Select an option',
    parentValue: "pid",
    hasChildren: 'hasChild'
  };

  // treeSettings
  public treeSettings: Object = {
    autoCheck: false,
  }

  public allowMultiSelection: boolean = true;
  public parent?: any; public child?: any;
  public count: boolean = false;
  public childCount: boolean = false;

  // maps the appropriate column to fields property
  public fieldsDD: Object = { text: 'description', value: 'child' };
  public accountsDataSource: Object;

  // bind the Query instance to query property
  public query: Query = new Query().select(['account', 'child', 'description']).take(10).requiresCount();
  // set the placeholder to ComboBox input element
  public waterMark: string = 'eg. 1001';
  public selectionOptions?: SelectionSettingsModel;
  public details = input<IJournalDetail[]>();
  public accountList = input<IDropDownAccounts[]>();
  public fundList = input<IFunds[]>();
  public subTypeList = input<ISubType[]>();
  public editType = input<string>();
  public toastr = inject(ToastrService)

  public detail = output<IJournalDetail>();
  public save = output<IJournalDetail>();
  public batch_save = output<IJournalDetail[]>();
  public modified = output<boolean>();
  public open = output<IJournalDetail>();
  public deleteLine = output<any>();
  public copyLine = output<IJournalDetail>();

  public detailSort: Object = { columns: [{ field: 'journal_subid', direction: 'Ascending' }] };
  public details_grid = viewChild<GridComponent>("details_grid");

  private selectedFund: string = '';
  private selectedSubType: string = '';
  private selectedAccount: string = '';
  public selectedRecords: any;

  public toolbarOptions: any = ['Delete', 'Add', 'Update', 'Cancel', 'Search'];

  public fundFields = { text: 'fund', value: 'fund' };
  public accountFields = { text: 'description', value: 'child' };
  public subTypeFields = { text: 'sub_type', value: 'sub_type' };
  private currentIndex = -1;

  public dropdownCategoryParams?: IEditCell;
  public dropdownFundsParams?: IEditCell;
  public dropdownSubTypeParams?: IEditCell;
  public dropdownAccountParams?: IEditCell;
  public numericParams: IEditCell;


  public editSettings: Object = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    allowSaving: true,
    allowCanceling: true,
    showDeleteConfirmDialog: true,
    mode: 'Batch',
    newRowPosition: 'Bottom'
  };


  public metaData: MetaData [];

  onDropDownSelect(dropDownItem: DdtSelectEventArgs) {
    if (dropDownItem.itemData !== undefined) {
      const itemObject = dropDownItem.itemData;
      if (dropDownItem.itemData["text"]) {
         console.log("Item data : ", dropDownItem.itemData['text']);
         let  meta : MetaData = {
             name:  dropDownItem.itemData["text"].toString(),
             parentId: dropDownItem.itemData["parentID"].toString(),
             id: dropDownItem.itemData["id"].toString(),
             hasChild: false,
             expanded: false,
         }
         this.metaData.push(meta);
      }
    }
  }

  onEdit() {
    const selectedRecords = this.details_grid().getSelectedRecords();
    console.debug('Data of current :', selectedRecords);
  }

  onAdd() {
    const selectedRecords = this.details_grid().getSelectedRecords();
    const recordToCopy = selectedRecords[0] as IJournalDetail;
    this.open.emit(recordToCopy);
  }

  onUpdate() {
    this.details_grid().editModule.batchSave();
  }

  onCopy() {
    const selectedRecords = this.details_grid().getSelectedRecords();
    if (selectedRecords.length > 0) {

      const primaryKey = this.details_grid().getPrimaryKeyFieldNames()[0]; // Get primary key field name
      const recordToCopy = selectedRecords[0] as IJournalDetail;
      const primaryKeyValue = recordToCopy[primaryKey];
      this.copyLine.emit(recordToCopy);

    } else {
      this.toastr.show('Select a row to copy.');
    }
  }

  onDeleteLineItem() {
    const selectedRecords = this.details_grid().getSelectedRecords();
    if (selectedRecords.length > 0) {
      const primaryKey = this.details_grid().getPrimaryKeyFieldNames()[0]; // Get primary key field name
      const recordToDelete = selectedRecords[0];
      const primaryKeyValue = recordToDelete[primaryKey];
      this.details_grid().deleteRecord(primaryKeyValue);
      this.deleteLine.emit(recordToDelete);

    } else {
      this.toastr.show('Select a row to delete.');
    }
  }

  onCancel() {
    this.details_grid().editModule.closeEdit();
  }


  onActionComplete(args: any) {
    console.debug('action complete request type', args.requestType);
    if (args.requestType === 'refresh') {
      console.debug('refresh complete :', args);
      //this.details_grid().refresh();
      //return;
    }
    if (args.requestType === 'batchsave') {

    }
  }

  ngOnInit(): void {
    this.numericParams = {
      params: {
        decimals: 2,
        format: 'N2',
        showClearButton: true,
      }
    };

    this.selectionOptions = { type: 'Multiple', mode: 'Row', cellSelectionMode: 'Box' };
    this.accountsDataSource = new DataManager(this.accountList());


    this.dropdownAccountParams = {
      params: {
        actionComplete: () => true,
        allowFiltering: true,
        filterType: 'Contains',
        ignoreCase: true,
        popupHeight: '300px',
        popupWidth: '400px',
        dataSource: new DataManager(this.accountList()),
        fields: { text: 'description', value: 'child' },
        change: (args) => {
          this.onAccountChanged(args.itemData);
        },
        query: new Query(),
      }
    };

    this.dropdownFundsParams = {
      params: {
        actionComplete: () => true,
        allowFiltering: true,
        filterType: 'Contains',
        ignoreCase: true,
        popupHeight: '300px',
        popupWidth: '200px',
        dataSource: new DataManager(this.fundList()),
        fields: { text: 'fund', value: 'fund' },
        query: new Query(),
      }
    };
    this.dropdownSubTypeParams = {
      params: {
        actionComplete: () => false,
        allowFiltering: true,
        filterType: 'Contains',
        ignoreCase: true,
        popupHeight: '300px',
        popupWidth: '400px',
        dataSource: new DataManager(this.subTypeList()),
        fields: { text: 'description', value: 'sub_type' },
        query: new Query(),
        placeholder: 'Select Sub Type',
        filterBarPlaceholder: 'Search sub types',
        noRecordsTemplate: 'No sub types found',
        showClearButton: true,
        autofill: true,
        highlight: true,
        index: 0,
        ignoreAccent: true,

      }
    };

  }

  public rowDataBound($event: any) {
    console.debug('row data bound', $event.data);
  }


  public rowDrag(args: RowDragEventArgs): void {
    (args.rows as Element[]).forEach((row: Element) => {
      row.classList.add("drag-limit");
    });
  }

  public rowDrop(args: RowDragEventArgs): void {
    const draggedRowData = args.data[0]; // Assuming single row drag
    const fromIndex = args.fromIndex;
    const dropIndex = args.dropIndex;

    const movedItem = this.details().splice(fromIndex, 1)[0];

    this.details().splice(dropIndex, 0, movedItem);

    let rowcount= 0;
    this.details().forEach(rows => {
        rowcount++;
        rows.journal_subid = rowcount;
    })

    this.batch_save.emit(this.details());
  }

  onActionBegin(args: ActionEventArgs) {
    console.debug('action begin', JSON.stringify(args));
    if (args.requestType === 'beginEdit') {
      if (this.editType() !== 'inline') {
        args.cancel = true;
        return;
      }
      else {
        return // reset selections

      }
    }

    if (args.requestType === 'add') {
      console.debug('add request', this.editType());
      if (this.editType() !== 'inline') {
        args.cancel = true;
      }
      const journal_id = this.details()[0]?.journal_id || 0;
      const journal_subid = this.details().length > 0 ? Math.max(...this.details().map(o => o.journal_subid)) + 1 : 1;
      args.data['journal_id'] = journal_id;
      args.data['journal_subid'] = journal_subid;
      return
    }

    if (args.requestType === 'save') {

      if (args.data['child'] === undefined || args.data['child'] === null || args.data['child'] === '') {
        alert('You must select an Account');
        args.cancel = true;
        return;
      }
      args.data['account'] = this.accountList().find(item => item.child === args.data['child']).account || 0;
      args.data['child_desc'] = this.accountList().find(item => item.child === args.data['child'])?.description.substring(7, 100) || '';

      const detailData: any = args.data;
      this.save.emit(detailData);
      this.modified.emit(true);
      this.selectedFund = '';
      this.selectedSubType = '';
      this.selectedAccount = '';
      return;
    }
  }

  public editACell(args: HTMLElement) {
    (this.details_grid()).editModule.editCell(
      parseInt((args.getAttribute('index') as string)),
      (this.details_grid()).getColumnByIndex(parseInt(args.getAttribute('aria-colindex') as string) - 1).field);
  }


  onSave(args: any) {
    this.details_grid().editModule.batchSave();
    const detailData: any = args.rowData;
    this.save.emit(detailData);
    this.modified.emit(true);
  }

  batchBeforeAdd(args: any) {
    args.cancel = true;
    //  this.open.emit();

    // this.save.emit(args.defaultData);
  }

  batchAdd(args: any) {
    args.cancel = true;
    console.debug('batch add', JSON.stringify(args));

  }

  batchDelete(args: BeforeBatchDeleteArgs) {

    const deletedRecords = args.rowData as IJournalDetail[];

    // Example: Prevent deletion if any of the records have a 'Completed' status
    const hasCompletedStatus = deletedRecords.some((record: any) => record.Status === 'Completed');

    if (hasCompletedStatus) {
      args.cancel = true; // Cancel the delete operation
      alert('Cannot delete records with a "Completed" status.');
    }
  }

  batchSave(args: any) {
    const changedRecords = args.batchChanges.changedRecords as IJournalDetail[];
    const addedRecords = args.batchChanges.addedRecords;

    var journalChanges: IJournalDetail[] = [];

    // add unchanged records to the list
    this.details().forEach((detail) => {
      if (!changedRecords.find((rec) => rec.journal_subid === detail.journal_subid)) {
        journalChanges.push(detail);
      }
    });

    // add changed and added records to the list
    if (changedRecords && changedRecords.length > 0) {
      journalChanges.push(...changedRecords);
    }

    // add added records to the list
    if (addedRecords && addedRecords.length > 0) {
      journalChanges.push(...addedRecords);
    }
    // deleted records are just not added and are excluded in the journal build
    this.batch_save.emit(journalChanges);
  }

  onFundChanged(data: string, index?: number) {
    this.selectedFund = data
    this.details_grid().setCellValue(this.currentIndex, 'fund', data);

  }


  onSubTypeChanged(data: string, index?: number) {
    this.selectedSubType = data
    this.details_grid().setCellValue(this.currentIndex, 'sub_type', this.selectedSubType);
  }

  onAccountChanged(value: any) {
    const selectedRecords = this.details_grid().getSelectedRecords() as unknown as IJournalDetail[];
    var subID = 0;
    if (selectedRecords.length > 0) {
      selectedRecords.forEach((record) => {
        subID = record.journal_subid;
      })
      const selectedAccountItem = this.accountList().find(item => item.child === value.child.toString());
      if (selectedAccountItem) {
        console.debug('onAccountChanged :', selectedAccountItem.description, this.currentIndex);
        this.details_grid().setCellValue(selectedRecords[0].journal_subid, 'child_desc', value.description.substring(7, 100));
        this.details_grid().setCellValue(selectedRecords[0].journal_subid, 'account', value.account);
      }
    }
  }

  onRowSelected(args: RowSelectEventArgs): void {
    this.selectedRecords = this.details_grid().getSelectedRecords();
    const detailData: any = args.data;
    this.currentIndex = args.rowIndex;
    console.debug("onRowSelected: ", this.selectedRecords)
    //this.detail.emit(detailData);
  }

  onCellSelected(args: any) {
    console.debug('cell selected', args.data);
    this.currentIndex = args.data.journal_subid;
    console.debug('current index', this.currentIndex);

  }

  onCellEdit(args: any) {
    console.debug('cell edit', args.rowData);
    //this.currentIndex = args.rowIndex;
    //this.detail.emit(args.data);
    // this.currentIndex = parseInt(args.getAttribute('index') as string);
    // const detailData: any = this.details()[this.currentIndex];
    // this.detail.emit(detailData);
  }

  toolbarHandler(args: any) {
    console.log("Toolbar handler", args.item.properties.id);
    switch (args.item.properties.id) {
      case 'edit':
        break;
      case 'add':
        break;
      case 'save':
        break;
      case 'copy':
        break;
    }
  }


}

