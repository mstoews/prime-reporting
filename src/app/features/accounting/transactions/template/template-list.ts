import {
  ActionEventArgs,
  AggregateService,
  ColumnMenuService,
  ContextMenuService,
  EditService,
  ExcelExportService,
  FilterService,
  GridComponent,
  GridModule,
  GroupService,
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
import { Component, OnInit, input, output, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IDropDownAccounts, IFunds } from 'app/models';
import { IJournalDetailTemplate, IJournalTemplate } from 'app/models/journals';

import { CommonModule } from '@angular/common';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ISubType } from 'app/models/subtypes';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SplitterModule } from '@syncfusion/ej2-angular-layouts';

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
  MatCardModule,
  NgxMatSelectSearchModule,
  ContextMenuModule,
  GridModule,
  SplitterModule,
  ComboBoxModule,
  MultiSelectModule,
  AutoCompleteModule,
  DropDownListAllModule,
];

interface IAccountsList {
  text: string;
  value: string;
}

@Component({
  selector: 'template-list',
  imports: imports,
  template: `
    <div id="template_grid" #detail_grid class="flex flex-col">
      <div class="text-xl gap-2  bg-slate-300 text-primary dark:bg-slate-800 p-1 sticky z-10">
        Template List
      </div>
      <div class="h-full w-full text-slate-800">
        <mat-card class="mat-elevation-z8 h-[calc(100vh-18rem)] m-2">
          <ejs-grid
            id="grid-journal-list"
            [dataSource]="templateList()"
            [allowFiltering]="false"
            [rowHeight]="40"
            [showColumnMenu]="false"
            [enableStickyHeader]="true"
            [toolbar]="toolbarOptions"
            [allowSorting]="true"
            (rowSelected)="onRowSelected($event)"
            [gridLines]="'Both'"
          >
            <e-columns>
              <e-column
                field="template_ref"
                headerText="ID"
                [visible]="false"
                isPrimaryKey="true"
                width="70"
              ></e-column>
              <e-column
                field="journal_type"
                headerText="Type"
                [visible]="true"
                width="80"
                dataType="text"
                textAlign="Center"
              >
                <ng-template #template let-data>
                  @if(data.journal_type === 'GL') {
                  <div>
                    <span class="text-gray-300 bg-green-700 p-1 rounded-xl">{{
                      data.journal_type
                    }}</span>
                  </div>
                  } @else if (data.journal_type === 'AP'){
                  <div>
                    <span class="text-gray-300 bg-blue-800 p-1 rounded-xl">{{
                      data.journal_type
                    }}</span>
                  </div>
                  } @else if (data.journal_type === 'AR'){
                  <div>
                    <span class="text-gray-300 bg-purple-800 p-1 rounded-xl">{{
                      data.journal_type
                    }}</span>
                  </div>
                  }
                </ng-template>
              </e-column>
              <e-column field="description" headerText="Description" [visible]="true"></e-column>
            </e-columns>
          </ejs-grid>
        </mat-card>
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
export class TemplateList {
  public templateList = input<IJournalTemplate[]>();
  public accountList = input<IDropDownAccounts[]>();
  public fundList = input<IFunds[]>();
  public subtypeList = input<ISubType[]>();

  public template = output<IJournalDetailTemplate>();
  public save = output<IJournalDetailTemplate>();

  public detailSort: Object = {
    columns: [{ field: 'debit', direction: 'Descending' }],
  };

  template_grid = viewChild<GridComponent>('template_grid');

  private selectedFund: string = '';
  private selectedSubType: string = '';
  private selectedAccount: string = '';

  // public toolbarOptions: any = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search', 'ExcelExport', 'PdfExport'];
  public toolbarOptions: any = ['Search'];
  public fundingParams: Object;
  public subTypeParams: Object;
  public fundFields = { text: 'fund', value: 'fund' };
  public accountFields = { text: 'description', value: 'child' };
  public subTypeFields = { text: 'subtype', value: 'subtype' };
  public commands = [
    {
      type: 'Edit',
      buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' },
    },
    {
      type: 'Delete',
      buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' },
    },
    {
      type: 'Save',
      buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' },
    },
    {
      type: 'Cancel',
      buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' },
    },
  ];

  public editSettings: Object = {
    allowEditing: true,
    allowAdding: false,
    allowDeleting: false,
    mode: 'Normal',
    newRowPosition: 'Top',
  };

  public onRowSelected(args: RowSelectEventArgs): void {
    const queryData: any = args.data;
    this.template.emit(queryData);
  }

  onDataSelected(args: RowSelectEventArgs): void {
    const templateData: any = args.data;
    this.template.emit(templateData);
  }

  selectedRow(args: ActionEventArgs) {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      return;
    }

    if (args.requestType === 'save') {
      if (this.selectedFund !== args.data['fund'] && this.selectedFund !== '') {
        args.data['fund'] = this.selectedFund;
      }

      if (this.selectedSubType !== args.data['subType'] && this.selectedSubType !== '') {
        args.data['sub_type'] = this.selectedSubType;
      }

      if (this.selectedAccount !== args.data['child'] && this.selectedAccount !== '') {
        args.data['child'] = this.selectedAccount;
        args.data['child_desc'] =
          this.accountList()
            .find((item) => item.child === this.selectedAccount)
            ?.description.substring(7, 100) || '';
      }

      const detailData: any = args.data;
      this.save.emit(detailData);
    }
  }
}
