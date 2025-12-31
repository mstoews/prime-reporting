import { Component, OnInit, inject, viewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDrawer, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CommonModule } from '@angular/common';
import { FuseConfirmationService } from 'app/services/confirmation';
import { GLGridComponent } from '../../grid-components/gl-grid.component';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { ISubType } from 'app/models/subtypes';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SubtypeStore } from 'app/store/subtype.store';
import { idToken } from 'rxfire/auth';

const imports = [
  CommonModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatDividerModule,
  NgApexchartsModule,
  MatTableModule,
  ReactiveFormsModule,
  FormsModule,
  GridMenubarStandaloneComponent,
  GLGridComponent,
  MatSidenavModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatFormFieldModule
];

@Component({
  template: `
    <grid-menubar
      [showPeriod]="false"
      [inTitle]="sTitle"
      [showNew]="true"
      [showSettings]="false"
      (newRecord)="createEmptyForm()" ></grid-menubar>

    <mat-drawer-container id="target" class="flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <mat-drawer
        class="lg:w-100 md:w-full bg-white-100"
        #drawer
        [opened]="false"
        mode="side"
        [position]="'end'"
        [disableClose]="false"
      >
        <div class="flex flex-col w-full text-gray-700 max-w-140 filter-article filter-interactive">
          <div
            class="h-12 m-2 rounded-lg p-2 text-2xl text-justify text-gray-200 bg-slate-600"
            mat-dialog-title
          >
            {{ sTitle }}
          </div>
          <mat-card class="m-2 p-2">
            <div mat-dialog-content>
              <form [formGroup]="subtypeForm" class="flex flex-col">
                <div class="flex flex-col m-1">
                  <div class="flex flex-col grow">
                    <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                      <mat-label class="ml-2 text-base text-gray-700 dark:text-gray-100"
                        >Sub Type</mat-label
                      >
                      <input matInput placeholder="Sub Type" formControlName="subtype" />
                      <mat-icon
                        class="icon-size-5"
                        matPrefix
                        [svgIcon]="'heroicons_solid:document-check'"
                      ></mat-icon>
                    </mat-form-field>
                  </div>

                  <div class="flex flex-col grow">
                    <mat-form-field class="mt-1 ml-1 mr-1 flex-start">
                      <mat-label class="ml-2 text-base text-gray-700 dark:text-gray-100"
                        >Sub Type</mat-label
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
            <div mat-dialog-actions>
              <button
                mat-icon-button
                color="primary"
                class="hover:bg-slate-400 ml-1"
                (click)="onSave($event)"
                matTooltip="Save"
                aria-label="hovered over"
              >
                <span class="e-icons e-save"></span>
              </button>

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
                (click)="onCancel($event)"
                matTooltip="Close"
                aria-label="hovered over"
              >
                <span class="e-icons e-circle-close"></span>
              </button>
            </div>
          </mat-card>
        </div>
      </mat-drawer>
      <ng-container>
        @if(subtypeStore.isLoading() === false) {
        <gl-grid
          (onUpdateSelection)="onUpdate($event)"
          [data]="subtypeStore.subtype()"
          [columns]="columns"
        >
        </gl-grid>
        } @else {
        <div class="flex justify-center items-center mt-20">
          <mat-spinner></mat-spinner>
        </div>
        }
      </ng-container>
    </mat-drawer-container>
  `,
  selector: 'subtypes',
  imports: [imports],
  providers: [imports],
})
export class GlSubTypeComponent implements OnInit {
  fuseConfirmationService = inject(FuseConfirmationService);
  fb = inject(FormBuilder);

  drawer = viewChild<MatDrawer>('drawer');
  sTitle = 'Sub Types';
  bDirty: boolean;

  subtypeForm?: FormGroup | any;

  subtypeStore = inject(SubtypeStore);

  columns = [
    {
      field: 'sub_type',
      headerText: 'Sub Types ',
      width: 100,
      textAlign: 'Left',
      isPrimaryKey: true,
    },
    { field: 'description', headerText: 'Description', width: 100, textAlign: 'Left' },
    { field: 'create_date', headerText: 'Create Date', width: 100, textAlign: 'RIght' },
    { field: 'create_user', headerText: 'Create User', width: 100, textAlign: 'Right' },
    { field: 'update_date', headerText: 'Update Date', width: 100, textAlign: 'Right' },
    { field: 'update_user', headerText: 'Update User', width: 100, textAlign: 'Right' },
  ];

  createEmptyForm() {
    this.subtypeForm = this.fb.group({
      id: [''],
      subtype: ['', Validators.required],
      description: ['', Validators.required],
      create_date: [''],
      create_user: [''],
      update_date: [''],
      update_user: [''],
    });
  }

  onUpdate(type: any) {
    this.subtypeForm.patchValue({
      id: [type.id],
      subtype: [type.subtype],
      description: [type.description],
    });
    this.openDrawer();
  }

  selectSubtype(subtype: ISubType) {
    this.subtypeForm.patchValue({
      id: [subtype.id],
      subtype: [subtype.subtype],
      description: [subtype.description],
    });
    this.openDrawer();
  }
  ngOnInit() {
    this.createEmptyForm();
  }
  onAdd() {
    this.createEmptyForm();
    this.openDrawer();
  }

  onSelection(e: any) {
    this.selectSubtype(e);
    this.openDrawer();
  }

  onCancel($event: any) {
    this.closeDrawer();
  }

  onDelete(e: any) {
    const confirmation = this.fuseConfirmationService.open({
      title: 'Delete Sub Type?',
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
        this.subtypeStore.removeSubtype(this.subtypeForm.value.id);
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
  onSave(e: any) {
    const dDate = new Date();
    const updateDate = dDate.toISOString().split('T')[0];
    const subtype = { ...this.subtypeForm.value } as any;
    const rawData = {
      id: subtype.id,
      subtype: subtype.subtype,
      description: subtype.description,
      create_date: dDate,
      create_user: 'admin_create',
      update_date: dDate,
      update_user: 'admin_update',
    };
    this.subtypeStore.updateSubtype(rawData);
    this.closeDrawer();
  }
}
