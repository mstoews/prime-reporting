import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  inject,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ICurrentPeriod, IPeriodStartEndParam } from "app/models/period";
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import {
  MatSelect,
  MatSelectChange,
  MatSelectModule,
} from "@angular/material/select";
import { Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PeriodStore } from "app/store/periods.store";
import { createJournalStartAndEndValidator } from "./date-range-validator";

let modules = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDatepickerModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  CommonModule,
  MatTooltipModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatMenuModule,
];

@Component({
  standalone: true,
  styles: [`
    :host ::ng-deep .cdk-panel-container    {
        background-color: white !important;
    }
    `],
  selector: "grid-menubar",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [modules],
  template: `
    <mat-toolbar  class="bg-slate-300 text-primary dark:bg-slate-800 text-2xl mr-5 rounded-xl" >
      {{ inTitle() }}

      @if (showEditType()) {
      <mat-button-toggle-group
        color="primary"
        class="ml-4"
        [value]="editTypeString"
        name="editingType"
        (change)="onEditTypeChange($event)"
        aria-label="Editing Type"
      >
        <mat-button-toggle color="primary" value="inline"
          >InLine</mat-button-toggle
        >
        <mat-button-toggle color="primary" value="form">Form</mat-button-toggle>
      </mat-button-toggle-group>
      }

      <span class="flex-1"></span>

      @if (showPeriod()) {
      <div
        class="flex flex-row items-center w-[180px] text-primary  border-gray-200 mr-4"
      >
        <mat-select
          class="w-[180px] text-primary  border-gray-300"
          [value]="_currentPeriod"
          #periodDropdownSelection
          (selectionChange)="onSelectionChange($event)"
        >
          @for (period of _currentActivePeriods; track period.description) {
          <mat-option [value]="period.description">
            {{ period.description }}
          </mat-option>
          }
        </mat-select>
      </div>
      } @if (showCalendar()) {
      <form [formGroup]="menuForm">
        <div class="text-primary flex flex-col w-[250px] mt-5">
          <mat-form-field>
            <mat-date-range-input class="text-primary" [rangePicker]="picker">
              <input
                matInput
                formControlName="start_date"
                matStartDate
                placeholder="Start Data"
                (dateChange)="onSetStartDate($event)"
              />
              <input
                matInput
                formControlName="end_date"
                matEndDate
                placeholder="End Date"
                (dateChange)="onSetEndDate($event)"
              />
            </mat-date-range-input>
            @if (menuForm.errors?.selectionPeriod) {
            <mat-error>Start date must be before end date.</mat-error>
            }
            <mat-datepicker-toggle
              class="text-primary"
              matIconPrefix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-date-range-picker
              color="primary"
              class="text-primary"
              #picker
            ></mat-date-range-picker>
          </mat-form-field>
        </div>
      </form>
      } @if (showTemplate()) {
      <button
        mat-icon-button
        color="primary"
        (click)="onTemplateMaintenance()"
        color="primary"
        class="m-1 hover:bg-primary-50 md:visible"
        matTooltip="Templates (Alt+t)"
        aria-label="Template Maintenance"
      >
        <span class="e-icons text-bold e-field-settings"></span>
      </button>
      } @if (showNew()) {
      <button
        mat-icon-button
        color="primary"
        (click)="onNew()"
        color="primary"
        class="m-1 hover:bg-primary-50 md:visible"
        matTooltip="New  (Ctrl+n)"
        aria-label="New"
      >
        <span class="e-icons text-bold e-circle-add"></span>
      </button>
      } @if (showAddEvidence()) {
      <button
        mat-icon-button
        color="primary"
        (click)="addEvidence.emit('evidence')"
        class="m-1  hover:bg-primary-50 md:visible"
        matTooltip="Add Evidence Ctrl+e"
        aria-label="Add Evidence (Ctrl+e)"
      >
        <span class="e-icons e-text-alternative"></span>
      </button>
      } @if (showCancelTransaction()) {
      <button
        mat-icon-button
        color="primary"
        (click)="cancelTransaction.emit('cancel')"
        class="m-1 hover:bg-primary-50  md:visible"
        matTooltip="Cancel Transaction (Ctrl+k)"
        aria-label="Cancel Transaction"
      >
        <span class="e-icons e-trash"></span>
      </button>
      } @if (showCloseTransaction()) {
      <button
        mat-icon-button
        color="primary"
        (click)="commitTransaction.emit('commit')"
        class="m-1  hover:bg-primary-50  md:visible"
        matTooltip="Commit (Ctrl+c)"
        aria-label="Commit Transaction"
      >
        <span class="e-icons e-lock"></span>
      </button>
      } @if (showSave()) {
      <button
        mat-icon-button
        color="primary"
        (click)="onSave()"
        class="m-1  hover:bg-primary-50  md:visible"
        matTooltip="Save (Ctrl+s)"
        aria-label="Save"
      >
        <span class="e-icons e-save"></span>
      </button>
      } @if (showDelete()) {
      <button
        mat-icon-button
        color="primary"
        (click)="onDelete()"
        class="m-1  hover:bg-primary-50  md:visible"
        matTooltip="Trash (Ctrl+d)"
        aria-label="Delete"
      >
        <span class="e-icons e-trash"></span>
      </button>
      } @if (showClone()) {
      <button
        mat-icon-button
        (click)="onClone()"
        color="primary"
        class="m-1  hover:bg-primary-50  md:visible"
        matTooltip="Clone (Alt+c)"
        aria-label="Clone"
      >
        <span class="e-icons e-copy"></span>
      </button>
      } @if (showPrint()) {
      <button
        (click)="onPrint()"
        color="primary"
        class="m-1  hover:bg-primary-50  md:visible"
        mat-icon-button
        matTooltip="Print (Ctrl+p)"
        aria-label="Print"
      >
        <span class="e-icons e-print"></span>
      </button>
      } @if (showExportPDF()) {
      <button
        (click)="onPDF()"
        color="primary"
        class="m-1  hover:bg-primary-50  md:visible"
        mat-icon-button
        matTooltip="Export PDF"
        aria-label="PDF"
      >
        <span class="e-icons e-export-pdf"></span>
      </button>
      } @if (showExportXL()) {
      <button
        (click)="onXL()"
        color="primary"
        class="m-1  hover:bg-primary-50  md:visible"
        mat-icon-button
        matTooltip="Export XL (Ctrl+x)"
        aria-label="XL"
      >
        <span class="e-icons e-export-excel"></span>
      </button>
      } @if (showExportCSV()) {
      <button
        (click)="onCSV()"
        color="primary"
        class="m-1  hover:bg-primary-50  md:visible"
        mat-icon-button
        matTooltip="Export CSV"
        aria-label="CSV"
      >
       </button>
      }

      @if (showZoomIn()) {
          <button
            (click)="onZoomIn(1.25)"
            color="primary"
            class="m-1  hover:bg-primary-50  md:visible"
            mat-icon-button
            matTooltip="Zoom in"
            aria-label="Zoom">
            <span class="e-icons text-bold e-zoom-in"></span>
          </button>
      }

      @if (showZoomIn()) {
          <button
            (click)="onZoomOut(1)"
            color="primary"
            class="m-1  hover:bg-primary-50  md:visible"
            mat-icon-button
            matTooltip="Zoom out"
            aria-label="Zoom">
            <span class="e-icons text-bold e-zoom-out"></span>
          </button>
      }


      @if (showSettings()) {
      <button
        mat-icon-button
        (click)="onOpenSettings()"
        color="primary"
        class="m-1  hover:bg-primary-50  md:visible"
        matTooltip="Table Settings"
        aria-label="CSV"
      >
        <span class="e-icons text-bold e-settings"></span>
      </button>
      }

      @if (showBack()) {
      <button
        (click)="onBack()"
        color="primary"
        class="m-1  hover:bg-primary-50  md:visible"
        mat-icon-button
        matTooltip="Back (Ctrl+b)"
        aria-label="Back"
      >
        <span class="e-icons e-chevron-left"></span>
      </button>
      }
    </mat-toolbar>
  `,
})
export class GridMenubarStandaloneComponent implements OnInit {
  exportXL = output<string>();
  exportPRD = output<string>();
  exportCSV = output<string>();
  openSettings = output<string>();
  print = output<string>();
  back = output<string>();
  new = output<string>();
  clone = output<string>();
  delete = output<string>();
  save = output<string>();
  template = output<string>();
  onCopy = output<string>();
  commitTransaction = output<string>();
  cancelTransaction = output<string>();
  addEvidence = output<string>();
  editType = output<string>();

  startAndEnd = output<IPeriodStartEndParam>();
  zoomIn = output<number>();
  zoomOut = output<number>();

  periods = input<ICurrentPeriod[]>();
  showBack = input<boolean>(true);
  showPeriod = input<boolean>(false);
  showExportXL = input<boolean>(true);
  showExportPDF = input<boolean>(false);
  showExportCSV = input<boolean>(false);
  showPrint = input<boolean>(true);
  showSettings = input<boolean>(false);
  showNew = input<boolean>(false);
  showClone = input<boolean>(false);
  showTemplate = input<boolean>(false);
  showDelete = input<boolean>(false);
  showSave = input<boolean>(false);
  showCalendar = input<boolean>(false);
  showCalendarButton = input<boolean>(false);
  showAddEvidence = input<boolean>(false);
  showCancelTransaction = input<boolean>(false);
  showCloseTransaction = input<boolean>(false);
  showEditType = input<boolean>(false);
  showZoomIn = input<boolean>(true);
  showZoomOut = input<boolean>(true);

  private readonly destroyMenuForm$ = new Subject<void>();
  public changeDetectorRef = inject(ChangeDetectorRef);

  inTitle = input<string>("Grid Menu Bar");
  prd = input<number>();
  prd_year = input<number>();

  public editTypeString: string = "inline";

  fb = inject(FormBuilder);

  menuForm = this.fb.group(
    {
      start_date: [null],
      end_date: [null],
    },
    {
      validators: [createJournalStartAndEndValidator()],
      updateOn: "blur",
    }
  );

  period = output<string>();
  selectedPeriod = output<string>();

  periodStore = inject(PeriodStore);
  periodsDropdown = viewChild<MatSelect>("periodDropdownSelection");

  _currentPeriod: string;
  _currentActivePeriods: ICurrentPeriod[];
  periodDropdownSelect = viewChild<MatSelect>("periodDropdownSelection");

  startDate: Date;
  endDate: Date;

  ngOnInit() {
    var _currentActivePeriods = localStorage.getItem("activePeriod");

    if (_currentActivePeriods) {
      this._currentActivePeriods = JSON.parse(
        _currentActivePeriods
      ) as ICurrentPeriod[];
    }

    this._currentPeriod = localStorage.getItem("currentPeriod");

    this.loadPeriods();

    if (this.showEditType() === true) {
      this.editTypeString = localStorage.getItem("editType") || "inline";
      this.editType.emit(this.editTypeString);
    }

    var _currentStartDate = localStorage.getItem("start_date");
    var _currentEndDate = localStorage.getItem("end_date");

    if (_currentStartDate === null || _currentStartDate === undefined) {
      _currentStartDate = "01/01/2025";
      localStorage.setItem("start_date", _currentStartDate);
    }

    if (
      _currentEndDate === null ||
      _currentEndDate === undefined ||
      _currentEndDate === "null"
    ) {
      _currentEndDate = "12/31/2025";
      localStorage.setItem("end_date", _currentEndDate);
    }

    var sDate = new Date(_currentStartDate);
    var eDate = new Date(_currentEndDate);

    this.menuForm.setValue({ start_date: sDate, end_date: eDate });

    this.menuForm.patchValue({
      start_date: sDate,
      end_date: eDate,
    });

    this.menuForm.valueChanges
      .pipe(takeUntil(this.destroyMenuForm$))
      .subscribe((value) => {
        if (value === undefined) {
          return;
        } else {
          if (value.end_date === null || value.end_date === undefined) {
            return;
          }
          const startAndEndParam = {
            start_date: value.start_date.toISOString().slice(0, 10),
            end_date: value.end_date.toISOString().slice(0, 10),
          };
          this.startAndEnd.emit(startAndEndParam);
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  onEditTypeChange(type: any) {
    localStorage.setItem("editType", type.value);
    this.editType.emit(type);
  }

  onSetStartDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value === null) {
      return;
    }
    this.startDate = event.value;
    console.log("addEvent", event.value.toISOString().slice(0, 10));
  }

  onSetEndDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value === null) {
      return;
    }

    const startAndEndParam = {
      start_date: this.startDate.toISOString().slice(0, 10),
      end_date: event.value.toISOString().slice(0, 10),
    };
    // this.startAndEnd.emit(startAndEndParam)
  }

  public setDateValues(value: IPeriodStartEndParam) {
    this.menuForm.patchValue({
      start_date: new Date(value.start_date),
      end_date: new Date(value.end_date),
    });
  }

  public loadPeriods() {
    if (this.periodStore.isActiveLoaded() === false)
      this.periodStore.loadActivePeriods();

    if (this.periodStore.isLoaded() === false) {
      this.periodStore.loadPeriods();
    }

    if (this.periodStore.currentPeriodDescription() === "") {
      this.periodStore.loadCurrentPeriod();
    }
  }

  public onSelectionChange(event: MatSelectChange) {
    var currentPrd = event.value as string;
    localStorage.setItem("currentPeriod", currentPrd);
    this.period.emit(currentPrd);
  }

  public onZoomIn(zoom: number) {
    console.log("Zoom In:", zoom);
    this.zoomIn.emit(zoom);
  }

  public onZoomOut(zoom: number) {
    this.zoomOut.emit(zoom);
  }

  public onNew() {
    this.new.emit("add");
  }

  public onTemplateMaintenance() {
    this.template.emit("template");
  }

  public onClone() {
    this.clone.emit("clone");
  }

  public onSave() {
    this.save.emit("save");
  }

  public onBack() {
    this.back.emit("back");
  }

  public onPrint() {
    this.print.emit("print");
  }

  public onPDF() {
    this.exportPRD.emit("pdf");
  }

  public onDelete() {
    this.delete.emit("delete");
  }

  public onXL() {
    this.exportXL.emit("xl");
  }

  public onCSV() {
    this.exportCSV.emit("csv");
  }

  public onAddEvidence() {
    this.addEvidence.emit("addEvidence");
  }

  public onOpenSettings() {
    this.openSettings.emit("settings");
  }

  @HostListener("window:keydown.control.b", ["$event"])
  onAltB(event: KeyboardEvent) {
    console.log("Ctrl + b shortcut triggered!");
    event.preventDefault();
    this.onBack();
  }

  @HostListener("window:keydown.control.s", ["$event"])
  onCtrlS(event: KeyboardEvent) {
    console.log("Ctrl + s shortcut triggered!");
    event.preventDefault();
    this.onSave();
  }

  @HostListener("window:keydown.control.a", ["$event"])
  onCtrlA(event: KeyboardEvent) {
    console.log("Ctrl + a shortcut triggered!");
    event.preventDefault();
    this.onNew();
  }

  @HostListener("window:keydown.control.e", ["$event"])
  onCtrlE(event: KeyboardEvent) {
    console.log("Ctrl + e shortcut triggered!");
    event.preventDefault();
    this.onAddEvidence();
  }

  @HostListener("window:keydown.control.c", ["$event"])
  onCtrlC(event: KeyboardEvent) {
    console.log("Ctrl + c shortcut triggered!");
    event.preventDefault();
    this.commitTransaction.emit("commit");
  }

  @HostListener("window:keydown.control.k", ["$event"])
  onCtrlK(event: KeyboardEvent) {
    console.log("Ctrl + k shortcut triggered!");
    event.preventDefault();
    this.cancelTransaction.emit("cancel");
  }

  @HostListener("window:keydown.alt.t", ["$event"])
  onAltT(event: KeyboardEvent) {
    console.log("Alt + t shortcut triggered!");
    event.preventDefault();
    this.onTemplateMaintenance();
  }

  @HostListener("window:keydown.alt.c", ["$event"])
  onAltC(event: KeyboardEvent) {
    console.log("Atl + c shortcut triggered!");
    event.preventDefault();
    this.onClone();
  }
}
