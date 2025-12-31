import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

import { CommonModule } from '@angular/common';
import { EvidenceCardComponent } from './file-manager-card/evidence-card.component';
import { EvidenceService } from 'app/services/evidence.service';
import { GridMenubarStandaloneComponent } from '../accounting/grid-components/grid-menubar.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';

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
  EvidenceCardComponent,
  GridMenubarStandaloneComponent,
  GridModule,
  MatFormFieldModule,
  MatSidenavModule,
  MatProgressSpinnerModule
];

@Component({
  selector: 'app-file-manager',
  imports: [imports],
  template: `
    <div class="absolute inset-0 flex flex-col min-w-0 overflow-hidden m-5">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row flex-0 sm:items-center sm:justify-between p-3 sm:py-8 sm:px-10 bg-card dark:bg-transparent"
      >
        <div class="flex-1 min-w-0">
          <div class="mt-2">
            <h2
              class="text-3xl md:text-4xl font-extrabold tracking-tight leading-7 sm:leading-10 truncate text-primary"
            >
              Artifacts Maintenance
            </h2>
          </div>
        </div>
      </div>

      <div class="flex flex-col min-w-0 overflow-y-auto -px-10" cdkScrollable>
        <!-- Main -->
        <div class="sm:hide md:visible">
          <grid-menubar
            class="pl-5 pr-5"
            [inTitle]="'Artifact by Journal Entry'"
            (notifyParentRefresh)="onRefresh()"
            (notifyParentAdd)="onAdd()"
            (notifyParentDelete)="onDeleteSelection()"
            (notifyParentUpdate)="onUpdateSelection()"
          >
          </grid-menubar>
        </div>

        @defer {
        <div class="flex-auto p-6 sm:p-10">
          <div class="h-full border-gray-900 rounded-2xl">
            <mat-drawer-container class="flex-col h-full cdkSrollable">
              <mat-drawer
                class="w-[600px] bg-white-100"
                #drawer
                [opened]="false"
                mode="over"
                [position]="'end'"
                [disableClose]="false"
              >
                <div class="flex flex-col w-full filter-article filter-interactive text-gray-700">
                  <div
                    class="bg-slate-600 text-justify pt-2 text-white h-10 text-2xl m-2"
                    mat-dialog-title
                  >
                    {{ sTitle }}
                  </div>
                  <div mat-dialog-content>
                    <form [formGroup]="evidenceForm">
                      <div class="flex flex-col m-1">
                        <section class="flex flex-col">
                          <div class="flex flex-col grow">
                            <mat-label class="ml-2 dark:text-white text-base">Reference</mat-label>
                            <mat-form-field class="m-1 form-element" appearance="outline">
                              <input
                                matInput
                                placeholder="Reference"
                                formControlName="reference_no"
                              />
                            </mat-form-field>
                          </div>

                          <div class="flex flex-col grow">
                            <mat-label class="ml-2 dark:text-white text-base"
                              >Description</mat-label
                            >
                            <mat-form-field class="m-1 form-element grow" appearance="outline">
                              <input
                                matInput
                                placeholder="Description"
                                formControlName="description"
                              />
                            </mat-form-field>
                          </div>
                          <div class="flex flex-col grow">
                            <mat-label class="ml-2 dark:text-white text-base">Location</mat-label>
                            <mat-form-field class="m-1 form-element grow" appearance="outline">
                              <input matInput placeholder="Location" formControlName="location" />
                            </mat-form-field>
                          </div>
                        </section>
                      </div>
                    </form>
                  </div>

                  <div mat-dialog-actions>
                    <button
                      mat-raised-button
                      color="primary"
                      class="m-1"
                      (click)="onUpdate($event)"
                      matTooltip="Save"
                      aria-label="Button that displays a tooltip when focused or hovered over"
                    >
                      Update
                      <mat-icon>update</mat-icon>
                    </button>
                    <button
                      mat-raised-button
                      color="primary"
                      class="m-1"
                      (click)="onCreate()"
                      matTooltip="Save"
                      aria-label="Button that displays a tooltip when focused or hovered over"
                    >
                      Add
                      <mat-icon>add</mat-icon>
                    </button>
                    <button
                      mat-raised-button
                      color="primary"
                      class="m-1"
                      (click)="onDelete($event)"
                      matTooltip="Save"
                      aria-label="Button that displays a tooltip when focused or hovered over"
                    >
                      Delete
                      <mat-icon>delete</mat-icon>
                    </button>
                    <button
                      mat-raised-button
                      color="primary"
                      class="m-1"
                      (click)="closeDrawer()"
                      matTooltip="Save"
                      aria-label="Button that displays a tooltip when focused or hovered over"
                    >
                      Cancel
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                </div>
              </mat-drawer>
              @if (evidence$ | async; as rows) {
              <ul>
                <li
                  class="grid grid-cols-1 mx-10 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8"
                >
                  @for (evidence of rows; track evidence.id) {
                  <evidence-card
                    [evidence]="evidence"
                    (onUpdate)="onUpdate($event)"
                  ></evidence-card>
                  }
                </li>
              </ul>
              }
            </mat-drawer-container>
          </div>
        </div>
        } @placeholder(minimum 1.5s) {
        <div class="flex justify-center items-center">
          <mat-spinner></mat-spinner>
        </div>
        }
      </div>
    </div>
  `,
})
export class FileManagerComponent {
  private fb = inject(FormBuilder);
  private evidenceServer = inject(EvidenceService);

  @ViewChild('drawer') drawer!: MatDrawer;
  collapsed = false;
  sTitle = 'File Management';
  selectedItemKeys: any[] = [];

  evidence$ = this.evidenceServer.read();

  drawOpen: 'open' | 'close' = 'open';

  customizeTooltip = (pointsInfo: { originalValue: string }) => ({
    text: `${parseInt(pointsInfo.originalValue)}%`,
  });
  evidenceForm!: FormGroup;

  keyField: any;
  accountsForm!: FormGroup;
  async ngOnInit() {
    this.createEmptyForm();
    // await this.updateBooked()
  }
  openDocument(e: any) {
    console.debug(e);
  }
  onDelete($event: any) {
    throw new Error('Method not implemented.');
  }

  onUpdate($event: any) {
    console.debug(`onUpdate ${JSON.stringify($event)}`);
    this.evidenceForm = this.fb.group({
      journal_id: [$event.journal_id],
      reference_no: [$event.reference_no],
      description: [$event.description],
      location: [$event.location],
      create_date: [$event.create_date],
      create_user: [$event.create_user],
    });
    this.openDrawer();
  }

  onRefresh() {}
  onAdd() {}
  onUpdateSelection() {}
  onDeleteSelection() {}
  createEmptyForm() {
    this.evidenceForm = this.fb.group({
      journal_id: [''],
      reference_no: [''],
      description: [''],
      location: [''],
      create_date: [''],
      create_user: [''],
    });
  }

  onCreate() {
    this.createEmptyForm();
    this.openDrawer();
  }

  selectionChanged(data: any) {
    console.debug(`selectionChanged ${JSON.stringify(data.data)}`);
    this.selectedItemKeys = data.selectedRowKeys;
  }

  onCellDoubleClicked(e: any) {
    this.evidenceForm = this.fb.group({
      reference_no: [e.data.reference_no],
      description: [e.data.description],
      location: [e.data.location],
    });
    this.openDrawer();
  }

  onFocusedRowChanged(e: any) {
    console.debug(`selectionChanged ${JSON.stringify(e.data)}`);
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
}
