import {
  AggregateService,
  ColumnMenuService,
  EditService,
  FilterService,
  GridComponent,
  GridModule,
  GroupService,
  PageService,
  PdfExportProperties,
  PdfExportService,
  ResizeService,
  SortService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { Component, inject, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IParty, IVendor } from 'app/models/party';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from 'app/services/confirmation';
import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { PartyDrawerComponent } from './vendors.drawer';
import { PartyStore } from 'app/store/party.store';
import { PrintService } from '@syncfusion/ej2-angular-schedule';
import { ToastrService } from 'ngx-toastr';

const imports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  GLGridComponent,
  PartyDrawerComponent,
  GridMenubarStandaloneComponent,
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
  selector: 'party',
  imports: [imports],
  template: `
    <grid-menubar
      [showPeriod]="false"
      [inTitle]="sTitle"
      [showNew]="true"
      (new)="onAddNew()"
      (print)="onPrint()"
      [showSettings]="false"
    />
    <mat-drawer-container id="target" class="flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <ng-container>
        <div class="border-1 border-gray-500">
          @if(store.isLoading() === false) {
          <gl-grid
            #grid
            id="party_grid"
            (onUpdateSelection)="onSelection($event)"
            [data]="store.party()"
            [columns]="columns"
          >
          </gl-grid>
          } @else {
          <div class="flex justify-center items-center mt-20">
            <mat-spinner></mat-spinner>
          </div>
          }
        </div>
      </ng-container>

      <mat-drawer
        class="lg:w-1/3 sm:w-full bg-white-100"
        #drawer
        [opened]="false"
        mode="side"
        [position]="'end'"
        [disableClose]="false"
      >
        <party-drawer
          [party]="selectedParty"
          [bDirty]="bDirty"
          (Cancel)="onClose()"
          (Update)="onUpdate($event)"
          (Add)="onAdd($event)"
          (Delete)="onDelete($event)"
        >
        </party-drawer>
      </mat-drawer>
    </mat-drawer-container>
  `,
  providers: [
    SortService,
    PdfExportService,
    GroupService,
    PageService,
    PrintService,
    ResizeService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    ColumnMenuService,
  ],
})
export class PartyComponent {
  sTitle = 'Vendor/Customer Party';
  drawer = viewChild<MatDrawer>('drawer');
  grid = viewChild<GLGridComponent>('party_grid');
  bDirty = false;
  selectedParty: IParty | null;
  selectedVendor: IVendor | null;
  store = inject(PartyStore);
  toast = inject(ToastrService);

  private _fuseConfirmationService = inject(FuseConfirmationService);

  columns = [
    { isVisible: true, field: 'id', headerText: 'ID', width: 120, textAlign: 'Left' },
    { isVisible: true, field: 'name', headerText: 'Name', width: 200, textAlign: 'Left' },
    {
      isVisible: true,
      field: 'short_name',
      headerText: 'Short Name',
      width: 200,
      textAlign: 'Left',
    },
    { isVisible: true, field: 'address1', headerText: 'Address 1', width: 200, textAlign: 'Left' },
    { isVisible: true, field: 'address2', headerText: 'Address 2', width: 200, textAlign: 'Left' },
    { isVisible: true, field: 'address3', headerText: 'Address 3', width: 200, textAlign: 'Left' },
    {
      isVisible: true,
      field: 'postal_code',
      headerText: 'Postal Code',
      width: 120,
      textAlign: 'Left',
    },
    { isVisible: true, field: 'phone', headerText: 'Phone', width: 120, textAlign: 'Left' },
    { isVisible: true, field: 'fax', headerText: 'Fax', width: 120, textAlign: 'Left' },
    { isVisible: true, field: 'account', headerText: 'Account', width: 120, textAlign: 'Left' },
    { isVisible: true, field: 'child', headerText: 'Child', width: 120, textAlign: 'Left' },
    {
      isVisible: true,
      field: 'vat_account',
      headerText: 'VAT Account',
      width: 120,
      textAlign: 'Left',
    },
    { isVisible: true, field: 'vat_child', headerText: 'VAT Child', width: 120, textAlign: 'Left' },
    {
      isVisible: true,
      field: 'ap_account',
      headerText: 'AP Account',
      width: 120,
      textAlign: 'Left',
    },
    { isVisible: true, field: 'ap_child', headerText: 'AP Child', width: 120, textAlign: 'Left' },
    {
      isVisible: true,
      field: 'description',
      headerText: 'Description',
      width: 200,
      textAlign: 'Left',
    },
    { isVisible: true, field: 'contact', headerText: 'Contact', width: 200, textAlign: 'Left' },
    { isVisible: true, field: 'type', headerText: 'Type', width: 120, textAlign: 'Left' },
    { isVisible: true, field: 'status', headerText: 'Status', width: 120, textAlign: 'Left' },
    {
      isVisible: false,
      field: 'vendor_terms',
      headerText: 'Vendor Terms',
      width: 120,
      textAlign: 'Left',
    },
    {
      isVisible: false,
      field: 'create_date',
      headerText: 'Create Date',
      width: 120,
      textAlign: 'Left',
    },
    {
      isVisible: false,
      field: 'create_user',
      headerText: 'Create User',
      width: 120,
      textAlign: 'Left',
    },
    {
      isVisible: false,
      field: 'update_date',
      headerText: 'Update Date',
      width: 120,
      textAlign: 'Left',
    },
    {
      isVisible: false,
      field: 'update_user',
      headerText: 'Update User',
      width: 120,
      textAlign: 'Left',
    },
  ];

  onClose() {
    this.closeDrawer();
  }

  onPrint() {
    const pdfExportProperties: PdfExportProperties = {
      exportType: 'CurrentPage',
    };
    (this.grid() as any as GridComponent).pdfExport(pdfExportProperties);
  }
  onAddNew() {
    const party = {
      party_id: '',
      name: '',
      address_id: 0,
      party_type: '',
      update_date: new Date().toISOString().split('T')[0],
      update_user: '@admin',
      create_date: new Date().toISOString().split('T')[0],
      create_user: '@admin',
    };
    this.selectedParty = party;
    this.bDirty = false;
    this.openDrawer();
  }

  onSelection(party: any) {
    this.selectedParty = party;
    this.bDirty = true;
    this.openDrawer();
  }

  opPrint() {
    const pdfExportProperties: PdfExportProperties = {
      exportType: 'CurrentPage',
    };
    (this.grid() as any as GridComponent).pdfExport(pdfExportProperties);
  }

  onAdd(party: IParty) {
    this.store.addParty(party);
    this.closeDrawer();
    this.toast.success('Party Added');
  }

  onUpdate(party: IParty) {
    const pt = this.store.updateParty(party);
    this.closeDrawer();
  }

  onDelete(e: IParty) {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete party?',
      message: 'Are you sure you want to delete this party_type? ',
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.store.removeParty(e);
        this.toast.success('Party Deleted');
      }
    });
    this.closeDrawer();
  }

  openDrawer() {
    const opened = this.drawer().opened;
    if (opened !== true) {
      this.drawer().toggle();
    } else {
      return;
    }
  }

  closeDrawer() {
    const opened = this.drawer().opened;
    if (opened === true) {
      this.drawer().toggle();
    } else {
      return;
    }
  }
}
