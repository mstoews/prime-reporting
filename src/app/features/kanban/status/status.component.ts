import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild, inject, Signal } from '@angular/core';

import { FuseConfirmationService } from 'app/services/confirmation';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

import { GridMenubarStandaloneComponent } from 'app/features/accounting/grid-components/grid-menubar.component';
import { CommonModule } from '@angular/common';
import { KanbanService } from '../kanban.service';
import { Browser } from '@syncfusion/ej2-base';
import { SaveEventArgs, DialogEditEventArgs } from '@syncfusion/ej2-grids';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import {
  EditService,
  ToolbarService,
  PageService,
  SortService,
  FilterService,
  GridModule,
} from '@syncfusion/ej2-angular-grids';
import { IStatus } from 'app/models/kanban';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

const imports = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  GridModule,
  GridMenubarStandaloneComponent,
  MatSidenavModule,
  MatButtonModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatIconModule,
  MatDatepickerModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatCardModule,
];

@Component({
  selector: 'kanban-status',
  imports: [imports],
  template: `
    <mat-drawer
      class="bg-transparent lg:w-100 md:w-full bg-white-100"
      #drawer
      [opened]="false"
      mode="over"
      [position]="'end'"
      [disableClose]="false"
    >
      <mat-card>
        <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
          <div
            class="bg-slate-600 text-justify m-2 p-2 text-white h-10 text-2xl border-l-4 border-gray-400"
            mat-dialog-title
          >
            {{ sTitle }}
          </div>
          <div mat-dialog-content>
            <form [formGroup]="statusForm">
              <div class="flex flex-col m-1">
                <section class="flex flex-col md:flex-row">
                  <div class="flex flex-col grow">
                    <mat-label class="ml-2 text-base">Status</mat-label>
                    <mat-form-field class="m-1 form-element grow" appearance="outline">
                      <input matInput placeholder="Status" formControlName="status" />
                    </mat-form-field>
                  </div>
                </section>

                <div class="flex flex-col grow">
                  <mat-label class="ml-2 text-base">Description</mat-label>
                  <mat-form-field class="m-1 form-element" appearance="outline">
                    <input matInput placeholder="Type Description" formControlName="description" />
                  </mat-form-field>
                </div>
              </div>
            </form>
          </div>
          <div mat-dialog-actions>
            <button
              mat-icon-button
              color="primary"
              class="m-1"
              (click)="onUpdate($event)"
              matTooltip="Update"
              aria-label="Button that displays a tooltip when focused or hovered over"
            >
              <mat-icon>update</mat-icon>
            </button>
            <button
              mat-icon-button
              color="primary"
              class="m-1"
              (click)="onCreate($event)"
              matTooltip="Add"
              aria-label="Button that displays a tooltip when focused or hovered over"
            >
              <mat-icon>add</mat-icon>
            </button>
            <button
              mat-icon-button
              color="primary"
              class="m-1"
              (click)="onDelete($event)"
              matTooltip="Delete"
              aria-label="Button that displays a tooltip when focused or hovered over"
            >
              <mat-icon>delete</mat-icon>
            </button>
            <button
              mat-icon-button
              color="primary"
              class="m-1"
              (click)="closeDrawer()"
              matTooltip="Cancel"
              aria-label="Button that displays a tooltip when focused or hovered over"
            >
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>
      </mat-card>
    </mat-drawer>
    <mat-drawer-container class="flex-col h-full">
      <ng-container>
        <grid-menubar [inTitle]="'Kanban Status Maintenance'"></grid-menubar>

        <div class="flex flex-col h-150">
          <ejs-grid
            #normalized
            id="Normalgrid"
            allowPaging="true"
            [rowHeight]="30"
            [allowSorting]="true"
            [allowFiltering]="true"
            [filterSettings]="filterSettings"
            [editSettings]="editSettings"
            [toolbar]="toolbar"
            [sortSettings]="initialSort"
            (actionComplete)="actionComplete($event)"
            [pageSettings]="pageSettings"
          >
            <e-columns>
              <e-column
                field="Status"
                headerText="Status"
                width="140"
                isPrimaryKey="true"
              ></e-column>
              <e-column field="description" headerText="Description"></e-column>
            </e-columns>
          </ejs-grid>
        </div>
      </ng-container>
    </mat-drawer-container>
  `,

  providers: [SortService, PageService, FilterService, ToolbarService, EditService],
  styles: `
        .e-grid .e-headercell {
        background-color: #333232;
        color: #fff; }
    `,
})
export class StatusComponent implements OnInit {
  private fuseConfirmationService = inject(FuseConfirmationService);
  private fb = inject(FormBuilder);
  public kanbanService = inject(KanbanService);
  public sTitle = 'Kanban Status Types';
  public statusForm!: FormGroup;
  public selectedItemKeys: string[] = [];
  public orderidrules: Object;
  public dropDown: DropDownListComponent;
  public initialSort: Object;
  public pageSettings: Object;
  public filterSettings: Object;
  public toolbar: string[];
  public editSettings: Object;
  public customerIdRules: Object;

  public editparams: Object;
  public submitClicked: boolean = false;

  @ViewChild('drawer') drawer!: MatDrawer;

  onCellDblClick(e: any) {
    this.statusForm = this.fb.group({
      status: [e.data.status],
      description: [e.data.description],
    });
    this.openDrawer();
  }

  ngOnInit() {
    //this.kanbanService.readStatus();
    this.createEmptyForm();
    //this.kanbanService.readPriority();
    this.orderidrules = { required: true, number: true };
    this.pageSettings = { pageCount: 5 };
    this.filterSettings = { type: 'Excel' };
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.submitClicked = false;
      this.statusForm = this.createEmptyForm();
    }
    if (args.requestType === 'save') {
      console.log(JSON.stringify(args.data));
      var data = args.data as IStatus;
      this.submitClicked = true;
      if (this.statusForm.valid) {
        args.data = this.statusForm.value;
      } else {
        args.cancel = true;
      }
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      if (Browser.isDevice) {
        args.dialog.height = window.innerHeight - 90 + 'px';
        (<Dialog>args.dialog).dataBind();
      }
      // Set initail Focus
      if (args.requestType === 'beginEdit') {
        // (args.form.elements.namedItem('CustomerName') as HTMLInputElement).focus();
      } else if (args.requestType === 'add') {
        // (args.form.elements.namedItem('OrderID') as HTMLInputElement).focus();
      }
    }
  }

  onCreate(e: any) {
    this.createEmptyForm();
    this.openDrawer();
  }

  deleteRecords() {
    this.selectedItemKeys.forEach((key) => {});
  }

  onDelete(e: any) {
    console.debug(`onDelete ${JSON.stringify(e)}`);
    const confirmation = this.fuseConfirmationService.open({
      title: 'Delete status?',
      message: 'Are you sure you want to delete this type? ',
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Delete the list
        // this.typeApiService.delete(this.typeId);
      }
    });
    this.closeDrawer();
  }

  createEmptyForm() {
    return (this.statusForm = this.fb.group({
      status: [''],
      description: [''],
      updateusr: [''],
      updatedte: [''],
    }));
  }

  openDrawer() {
    const opened = this.drawer.opened;
    if (opened !== true) {
      this.drawer.toggle();
    } else {
      return;
    }
  }

  closeDrawer() {
    const opened = this.drawer.opened;
    if (opened === true) {
      this.drawer.toggle();
    } else {
      return;
    }
  }

  onUpdate(e: any) {
    const status = { ...this.statusForm.value } as IStatus;
    const rawData = {
      status: status.status,
      description: status.description,
    };
    this.kanbanService.updateStatus(rawData);
    this.closeDrawer();
  }
}
