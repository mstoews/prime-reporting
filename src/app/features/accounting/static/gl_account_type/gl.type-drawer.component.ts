import { Component, OnInit, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGLType } from 'app/models/types';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'gltype-drawer',
  imports: [ReactiveFormsModule, FormsModule,
  MatButtonModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatIconModule,
  MatDatepickerModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatCardModule
  ],
  template: `
       <mat-card>
            <div class="flex flex-col w-full text-gray-700 dark:text-gray-100 max-w-140 filter-article filter-interactive">
            <div class="bg-slate-600 text-justify m-2 p-2 text-white h-10 text-2xl border-l-4 border-gray-400" mat-dialog-title >
            {{ sTitle }}
        </div>
            <div mat-dialog-content>
                <form [formGroup]="gltypeForm">
                    <div class="flex flex-col m-1">
                        @if (bDirty() === false) {
                          <section class="flex flex-col md:flex-row">
                              <div class="flex flex-col grow">
                                  <mat-label class="ml-2 text-base dark:text-gray-100">FS Mapping </mat-label>
                                  <mat-form-field class="m-1 form-element grow" appearance="outline">
                                      <input matInput placeholder="Type" formControlName="type" />
                                  </mat-form-field>
                              </div>
                          </section>
                        }
                        @else {
                          <section class="flex flex-col md:flex-row">
                            <div class="flex flex-col grow">
                                  <mat-label class="ml-2 text-base dark:text-gray-100">FS Mapping </mat-label>
                                  <mat-form-field class="m-1 form-element grow" appearance="outline" >
                                      <input matInput placeholder="Type" formControlName="type" readonly />
                                  </mat-form-field>
                              </div>
                          </section>
                        }

                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base dark:text-gray-100">Order</mat-label>
                            <mat-form-field class="m-1 form-element" appearance="outline">
                                <input matInput placeholder="Order"
                                    formControlName="order_by" />
                            </mat-form-field>
                        </div>
                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base dark:text-gray-100">Sub Item</mat-label>
                            <mat-form-field class="m-1 form-element" appearance="outline">
                                <input matInput placeholder="Sub Item" formControlName="sub_line_item" />
                            </mat-form-field>
                        </div>
                        <div class="flex flex-col grow">
                            <mat-label class="ml-2 text-base dark:text-gray-100">Description</mat-label>
                            <mat-form-field class="m-1 form-element" appearance="outline">
                                <input matInput placeholder="Type Description"
                                    formControlName="description" />
                            </mat-form-field>
                        </div>

                    </div>
                </form>
            </div>
            <div mat-dialog-actions>
                @if (bDirty() === true) {
                    <button mat-icon-button color=primary class="bg-slate-200 hover:bg-slate-400 ml-1" (click)="onUpdate()"
                      matTooltip="Save" aria-label="hovered over">
                      <span class="e-icons e-save"></span>
                    </button>
                }

                @if (bDirty() === false) {
                <button mat-icon-button color=primary
                        class=" hover:bg-slate-400 ml-1" (click)="onAdd()" matTooltip="New" aria-label="hovered over">
                        <span class="e-icons e-circle-add"></span>
                </button>
                }

                <button mat-icon-button color=primary
                        class=" hover:bg-slate-400 ml-1" (click)="onDelete()" matTooltip="Delete" aria-label="hovered over">
                        <span class="e-icons e-trash"></span>
                </button>

                <button mat-icon-button color=primary
                        class=" hover:bg-slate-400 ml-1"  (click)="onCancel()" matTooltip="Close"
                        aria-label="hovered over">
                        <span class="e-icons e-circle-close"></span>
                </button>
            </div>
            </div>
        </mat-card>
  `,
})
export class GLTypeDrawerComponent {

  sTitle = 'Mapping Maintenance';
  originalGLType: IGLType;
  bDirty = input<boolean | null>();
  gltype = input<IGLType | null>();
  Update = output<IGLType>();
  Add = output<IGLType>();
  Delete = output<IGLType>();
  Cancel = output();
  SelectedType = output<IGLType>();

  gltypeForm = new FormGroup({
    type: new FormControl(''),
    description: new FormControl(''),
    sub_line_item: new FormControl(''),
    order_by: new FormControl(0)
  });

  ngOnChanges() {
    if (this.gltype) {
      this.gltypeForm.patchValue(this.gltype());
    }
  }

  updateGLType(): IGLType {
    const updateDate = new Date().toISOString().split('T')[0];
    const userName = '@admin';
    return {
      type: this.gltypeForm.value.type,
      description: this.gltypeForm.value.description,
      sub_line_item: this.gltypeForm.value.sub_line_item,
      order_by: Number(this.gltypeForm.value.order_by),
      update_date: updateDate,
      update_user: userName,
      create_date: updateDate,
      create_user: userName,
    } as IGLType;
  }
  onSelectedType() {
    this.SelectedType.emit(this.updateGLType());
  }
  onUpdate() {
    this.Update.emit(this.updateGLType());
  }

  onAdd() {
    if (this.gltypeForm.invalid) {
      return;
    }
    this.Add.emit(this.updateGLType());
  }

  onDelete() {
    this.Delete.emit(this.updateGLType());
  }

  onCancel() {
    this.Cancel.emit();
  }

}
