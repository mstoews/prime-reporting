import {
  ColumnMenuService,
  EditService,
  FilterService,
  GridComponent,
  GridModule,
  PageService,
  SortService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { Component, HostListener, OnInit, inject, output, viewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';

import { CommonModule } from '@angular/common';
import { ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';
import { FundsStore } from 'app/store/funds.store';
import { FuseConfirmationService } from 'app/services/confirmation';
import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { IFunds } from 'app/models';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { PDFExport } from '@syncfusion/ej2-pivotview';
import { PDFExportService } from '@syncfusion/ej2-angular-pivotview';

const imports = [
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
  GridMenubarStandaloneComponent,
  GLGridComponent,
  ContextMenuAllModule,
  ReactiveFormsModule,
  FormsModule,
  GridModule,
  GridMenubarStandaloneComponent,
  GLGridComponent,
  ContextMenuAllModule,
];

@Component({
  selector: 'funds',
  imports: [imports],
  template: `
    <grid-menubar
      [showPeriod]="false"
      [inTitle]="sTitle"
      [showNew]="true"
      [showSettings]="false"
      (new)="onAddNew()"
    ></grid-menubar>
    <mat-drawer-container id="target" class="flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <mat-drawer
        class="lg:w-1/3 sm:w-full bg-white-100"
        #drawer
        [opened]="false"
        mode="side"
        [position]="'end'"
        [disableClose]="false"
      >
        <mat-card class="m-2 p-2 mat-elevation-z8">
          <div
            class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive"
          >
            <div
              class="h-12 m-2 rounded-lg p-2 text-2xl text-justify text-gray-200 bg-slate-600"
              mat-dialog-title
            >
              {{ sTitle }}
            </div>
            <div mat-dialog-content>
              <form [formGroup]="fundsForm">
                <div class="flex flex-col m-1">
                  <div class="flex flex-col grow">
                    <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                      <mat-label class="ml-2 text-base text-gray-800 dark:text-gray-100"
                        >Fund</mat-label
                      >
                      <input matInput placeholder="Fund" formControlName="fund" />
                      <mat-icon
                        class="icon-size-5"
                        matPrefix
                        [svgIcon]="'heroicons_solid:document-check'"
                      ></mat-icon>
                    </mat-form-field>
                  </div>

                  <div class="flex flex-col grow">
                    <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                      <mat-label class="ml-2 text-base text-gray-800 dark:text-gray-100"
                        >Description</mat-label
                      >
                      <input matInput placeholder="Description" formControlName="description" />
                      <mat-icon
                        class="icon-size-5"
                        matPrefix
                        [svgIcon]="'heroicons_solid:document'"
                      ></mat-icon>
                    </mat-form-field>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div mat-dialog-actions class="gap-2 mb-3">
            @if (bDirty === true) {
            <button
              mat-icon-button
              color="primary"
              class="bg-slate-200 hover:bg-slate-400 ml-1"
              (click)="onUpdate()"
              matTooltip="Save"
              aria-label="hovered over"
            >
              <span class="e-icons e-save"></span>
            </button>
            } @if (bDirty === false) {
            <button
              mat-icon-button
              color="primary"
              class=" hover:bg-slate-400 ml-1"
              (click)="onAdd()"
              matTooltip="New"
              aria-label="hovered over"
            >
              <span class="e-icons e-circle-add"></span>
            </button>
            }

            <button
              mat-icon-button
              color="primary"
              class=" hover:bg-slate-400 ml-1"
              (click)="onDelete($event)"
              matTooltip="Delete"
              aria-label="hovered over"
            >
              <span class="e-icons e-trash"></span>
            </button>

            <button
              mat-icon-button
              color="primary"
              class=" hover:bg-slate-400 ml-1"
              (click)="onCancel()"
              matTooltip="Close"
              aria-label="hovered over"
            >
              <span class="e-icons e-circle-close"></span>
            </button>
          </div>
        </mat-card>
      </mat-drawer>
      <ng-container>
        @if (fundStore.isLoading() === false) {

        <gl-grid
          (onUpdateSelection)="onSelection($event)"
          [data]="fundStore.funds()"
          [columns]="columns"
        >
        </gl-grid>
        }
      </ng-container>
    </mat-drawer-container>
  `,
  providers: [
    SortService,
    PageService,
    PDFExportService,
    FilterService,
    ToolbarService,
    EditService,
    ColumnMenuService,
  ],
})
export class FundsComponent implements OnInit {
  private confirmation = inject(FuseConfirmationService);
  public sTitle = 'Reserve Funds';
  public fundsForm!: FormGroup;
  public formdata: any = {};
  public drawer = viewChild<MatDrawer>('drawer');

  grid = viewChild<GridComponent>('grid');

  fundStore = inject(FundsStore);

  notifyFundUpdate = output();
  bDirty: boolean = false;
  // funds$ = this.fundStore.selected;

  public columns = [
    {
      field: 'id',
      headerText: 'id',
      visible: false,
      isPrimaryKey: true,
      width: 80,
      textAlign: 'Left',
    },
    { field: 'fund', headerText: 'Fund', width: 80, textAlign: 'Left' },
    { field: 'description', headerText: 'Description', width: 200, textAlign: 'Left' },
    { field: 'create_date', headerText: 'Create Date', width: 80, textAlign: 'Left' },
    { field: 'create_user', headerText: 'Create User', width: 80, textAlign: 'Left' },
  ];

  ngOnInit() {
    if (this.fundStore.isLoaded() === false) {
      this.fundStore.loadFunds();
    }
    this.createEmptyForm();
    this.onChanges();
  }
  

  onSelection(data: any) {
    this.bDirty = false;
    this.fundsForm.patchValue({
      id: [data.id],
      fund: [data.fund],
      description: [data.description],
    });
    this.openDrawer();
  }

  public onChanges(): void {
    this.fundsForm.valueChanges.subscribe((dirty) => {
      if (this.fundsForm.dirty === true) {
        this.bDirty = true;
      } else {
        this.bDirty = false;
      }
    });
  }

  public createEmptyForm() {
    this.fundsForm = new FormGroup({
      id: new FormControl(''),
      fund: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  public menuItems: MenuItemModel[] = [
    { id: 'edit', text: 'Edit Account', iconCss: 'e-icons e-edit' },
    { id: 'add', text: 'Add New Account', iconCss: 'e-icons e-file-document' },
    { id: 'delete', text: 'Delete Account', iconCss: 'e-icons e-circle-remove' },
    { separator: true },
    { id: 'back', text: 'Return', iconCss: 'e-icons e-chevron-left' },
  ];

  public onAdd() {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const fund = { ...this.fundsForm.value } as IFunds;
    const rawData = {
      fund: fund.fund,
      description: fund.description,
    } as IFunds;

    this.fundStore.addFund(rawData);
    this.bDirty = false;
    this.closeDrawer();
  }

  public onAddNew() {
    this.createEmptyForm();
    this.openDrawer();
  }

  public onCancel() {
    this.closeDrawer();
  }

  public onDelete(e: any) {
    var data = this.fundsForm.value;
    const confirmation = this.confirmation.open({
      title: 'Delete Fund?',
      message: `Are you sure you want to delete the fund: ${data.fund}`,
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
        this.fundStore.removeFund(data.fund);
      }
    });
    this.closeDrawer();
  }

  public onUpdateSelection(data: IFunds) {
    //
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    this.bDirty = false;

    const rawData = {
      fund: data.fund,
      description: data.description,
      create_date: updateDate,
      create_user: '@admin',
    } as IFunds;

    this.openDrawer();
  }

  public onUpdate() {
    const fund = this.fundsForm.value;
    const rawData = {
      fund: fund.fund,
      description: fund.description,
    } as IFunds;

    this.fundStore.updateFund(rawData);
    this.bDirty = false;
    this.closeDrawer();
  }

  @HostListener('window:exit')
  public exit() {
    if (this.bDirty === true) {
      const confirm = this.confirmation.open({
        title: 'Fund Modified',
        message: 'Are you sure you want to exit without saving? ',
        actions: {
          confirm: {
            label: 'Confirm',
          },
        },
      });

      confirm.afterClosed().subscribe((result) => {
        // If the confirm button pressed...
        if (result === 'confirmed') {
          this.closeDrawer();
          this.fundsForm.reset();
        }
      });
    } else {
      return;
    }
  }

  public openDrawer() {
    const opened = this.drawer().opened;
    if (opened !== true) {
      this.drawer().toggle();
    } else {
      return;
    }
  }

  public closeDrawer() {
    const opened = this.drawer().opened;
    if (opened === true) {
      this.drawer().toggle();
    } else {
      return;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustHeight();
  }

  ngAfterViewInit() {
    this.adjustHeight();
  }

  adjustHeight() {
    if (this.grid()) {
      this.grid().height = window.innerHeight - 450 + 'px'; // Adjust as needed
    }
  }
}
