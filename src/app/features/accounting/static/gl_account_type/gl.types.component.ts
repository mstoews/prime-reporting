import {
  AggregateService,
  ColumnMenuService,
  DialogEditEventArgs,
  EditService,
  ExcelExportService,
  FilterService,
  GridModule,
  GroupService,
  PageService,
  ResizeService,
  SaveEventArgs,
  SortService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { Component, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

import { AUTH } from 'app/app.config';
import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from 'app/services/confirmation';
import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { GLTypeDrawerComponent } from './gl.type-drawer.component';
import { GLTypeStore } from 'app/store/gltype.store';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { IGLType } from 'app/models/types';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { PDFExport } from '@syncfusion/ej2-pivotview';
import { PDFExportService } from '@syncfusion/ej2-angular-pivotview';
import { ToastrService } from 'ngx-toastr';
import { isVisible } from '@syncfusion/ej2-base';

const imports = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  GridMenubarStandaloneComponent,
  GLGridComponent,
  GLTypeDrawerComponent,
  ReactiveFormsModule,
  FormsModule,
  MatButtonModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatIconModule,
  MatDatepickerModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatCardModule


];

@Component({
  template: `
    <grid-menubar
      [showPeriod]="false"
      [showBack]="false"
      [showNew]="true"
      (new)="onAddNew()"
      [inTitle]="sTitle"
    >
    </grid-menubar>
    <mat-drawer-container id="target" class="flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <mat-drawer
        class="lg:w-100 h-screen md:w-full bg-white-100"
        id="gl_type"
        #gl_type
        [opened]="false"
        mode="side"
        [position]="'end'"
        [disableClose]="false"
      >
        <gltype-drawer
          [bDirty]="bDirty"
          [gltype]="selectedType"
          (Cancel)="onClose()"
          (Update)="onUpdate($event)"
          (Add)="onAdd($event)"
          (Delete)="onDelete($event)"
        >
        </gltype-drawer>
      </mat-drawer>
      <ng-container>
        <div class="border border-gray-500 mt-3 dark:bg-gray-900 bg-gray-100 rounded-lg">
          @if ((glTypeStore.isLoading()) === false) {
          <gl-grid
            [data]="glTypeStore.types()"
            [columns]="columns"
            (onUpdateSelection)="onSelection($event)"
            (gltype)="selectedRow($event)"
          >
          </gl-grid>
          } @else {
          <div class="flex justify-center items-center mt-20">
            <mat-spinner></mat-spinner>
          </div>
          }
        </div>
      </ng-container>
    </mat-drawer-container>
  `,
  selector: 'gl-types',
  imports: [imports],
  providers: [
    SortService,
    GroupService,
    PDFExportService,
    ExcelExportService,
    PageService,
    ResizeService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    ColumnMenuService,
  ],
})
export class GlTypeComponent {
  glTypeStore = inject(GLTypeStore);
  toast = inject(ToastrService);
  fuseConfirmationService = inject(FuseConfirmationService);

  auth = inject(AUTH);
  email = '@' + this.auth.currentUser.email.split('@')[0];

  bDirty: boolean = false;
  sTitle = 'Mapping';
  drawer = viewChild<MatDrawer>('gl_type');

  selectedType: IGLType;

  columns = [
    { field: 'order_by', headerText: 'Order', width: '60', textAlign: 'Left', isPrimaryKey: true },
    { field: 'type', headerText: 'FS Type', width: '80', textAlign: 'Left' },
    { field: 'sub_line_item', headerText: 'Sub Item', width: '80', textAlign: 'Left' },
    { field: 'description', headerText: 'Statement Type', width: '100', textAlign: 'Left' },
    { field: 'update_date', headerText: 'Update Date', width: '80', textAlign: 'Left' },
    { field: 'update_user', headerText: 'Update User', width: '80', textAlign: 'Left' },
    {
      field: 'create_date',
      headerText: 'Create Date',
      width: '80',
      textAlign: 'Left',
      visible: false,
    },
    {
      field: 'create_user',
      headerText: 'Create User',
      width: '80',
      textAlign: 'Left',
      visible: false,
    },
  ];

  onDelete(e: any) {
    console.debug(`onDelete ${JSON.stringify(e)}`);
    const confirmation = this.fuseConfirmationService.open({
      title: 'Delete Type?',
      message: 'Are you sure you want to delete this type? ',
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        // Delete the list
        this.glTypeStore.removeType(e);
      }
    });
    this.onClose();
  }
  selectedRow(gltype: any) {
    this.selectedType = gltype;
    this.bDirty = true;
    this.openDrawer();
  }

  onSelection(gltype: any) {
    this.selectedType = gltype;
    this.bDirty = true;
    this.openDrawer();
  }
  openDrawer() {
    const opened = this.drawer().opened;
    if (opened !== true) {
      this.drawer().toggle();
    } else {
      return;
    }
  }

  /**
   * Adds a new GL type to the store and displays a success message.
   * @param gltype - The GL type to be added.
   * @returns void
   * @throws Error if the addition of the GL type fails.
   */
  onAddNew() {
    this.bDirty = false;
    this.selectedType = {
      type: '',
      sub_line_item: '',
      order_by: 0,
      description: '',
      create_date: new Date().toISOString().split('T')[0],
      create_user: this.email,
      update_date: new Date().toISOString().split('T')[0],
      update_user: this.email,
    } as IGLType;
    this.openDrawer();
  }
  onAdd(gltype: IGLType) {
    this.glTypeStore.addType(gltype);
    this.toast.success('Mapping Added');
    this.onClose();
  }
  onUpdate(gltype: IGLType) {
    this.glTypeStore.updateType(gltype);
    this.toast.success('Mapping Updated');
    this.onClose();
  }
  onClose() {
    const opened = this.drawer().opened;
    if (opened === true) {
      this.drawer().toggle();
    } else {
      return;
    }
  }
}
