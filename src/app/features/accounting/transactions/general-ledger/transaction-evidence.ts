import {
  ActionEventArgs,
  AggregateService,
  ColumnMenuService,
  ContextMenuService,
  EditService,
  ExcelExportService,
  FilterService,
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
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, Query, inject, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IArtifacts, IJournalDetail } from 'app/models/journals';

import { AccountsStore } from 'app/store/accounts.store';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';
import { DataManager } from '@syncfusion/ej2-data';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { IDropDownAccounts } from 'app/models';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
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
  MatProgressBarModule,
  NgApexchartsModule,
  MatTableModule,
  FormsModule,
  NgxMatSelectSearchModule,
  ContextMenuModule,
  DropDownListAllModule,
  GridModule,
  SplitterModule,
  MatProgressSpinnerModule

];

interface IAccountsList {
  text: string;
  value: string;
}

@Component({
  selector: 'transaction-evidence',
  imports: imports,
  template: `
    <div id="detail_grid" #detail_grid class="flex flex-col">
      <div
        class="text-xl gap-2 text-slate-800 bg-slate-300 dark:text-slate-200 dark:bg-slate-800 p-1 sticky z-10"
      >
        Supporting Documents
      </div>
      <div class="h-full w-full text-slate-800">
        <div class="content overflow-hidden">
          @defer () {
          <ejs-grid
            id="evidence"
            #evidence
            [dataSource]="details()"
            allowEditing="false"
            [editSettings]="editSettings"
            [allowFiltering]="false"
            [allowRowDragAndDrop]="false"
            (actionBegin)="selectedRow($event)"
            (rowSelected)="onEvidenceSelected($event)"
            [gridLines]="'Both'" >
            <e-columns>
              <e-column
                field="id"
                headerText="ID"
                [visible]="false"
                isPrimaryKey="true"
                width="100"
              ></e-column>
              <e-column field="description" headerText="Description" width="300"></e-column>
              <e-column field="reference" headerText="Reference"></e-column>
              <e-column headerText="Image" width="40" [visible]="true" [allowEditing]="false">
                <ng-template #template let-data>
                  <div class="image">
                    <img
                      src="{{ data.location }}}"
                      onerror="src='images/logo/document_image.svg';"
                      alt="{{ data.location }}"
                    />
                  </div>
                </ng-template>
              </e-column>
            </e-columns>
          </ejs-grid>

          <ng-template #template let-data>
            <img [src]="data.location" alt="Noble Ledger v0.0.4.38" />
          </ng-template>

          <ng-template #buttonTemplate let-data>
            <button mat-flat-button class="bg-slate-500 text-slate-100" (click)="handleClick(data)">
              Details
            </button>
          </ng-template>

          } @placeholder (minimum 200ms) {
          <div class="flex justify-center">
            <div>
              <mat-progress-spinner diameter="60" [value]="0" mode="indeterminate">
              </mat-progress-spinner>
            </div>
          </div>
          } @loading (minimum 200ms) {
          <div class="flex justify-center">
            <div>
              <mat-progress-spinner diameter="60" [value]="0" mode="indeterminate">
              </mat-progress-spinner>
            </div>
          </div>
          }
        </div>
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
export class TransactionEvidence {
handleClick(_t33: any) {
throw new Error('Method not implemented.');
}
  public details = input<IArtifacts[]>();
  public detail = output<IArtifacts>();
  public save = output<IArtifacts>();

  public editParams: Object;
  public editparams: IEditCell = {
    params: { popupHeight: '300px', popupWidth: '250px', value: '' },
  };

  // public toolbarOptions: any = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search', 'ExcelExport', 'PdfExport'];
  public toolbarOptions: any = ['Search'];

  public editSettings: Object = {
    allowEditing: true,
    allowAdding: false,
    allowDeleting: false,
    mode: 'Normal',
    newRowPosition: 'Top',
  };

  onEvidenceSelected(args: RowSelectEventArgs): void {
    const artifactsDetail: any = args.data;
    this.detail.emit(artifactsDetail);
  }

  selectedRow(args: ActionEventArgs) {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      return;
    }

    if (args.requestType === 'save') {
      const artifactsDetail: any = args.data;
      this.save.emit(artifactsDetail);
    }
  }
}
