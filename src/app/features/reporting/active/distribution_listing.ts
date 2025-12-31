import { AR_EXPORTS, ActiveReportsModule, HtmlExportService, PdfExportService, TabularDataExportService, ViewerComponent, XlsxAdvExportService } from '@mescius/activereportsjs-angular';
import {Component, ViewChild, ViewEncapsulation, inject, signal, viewChild} from '@angular/core';

import { GridMenubarStandaloneComponent } from "app/features/accounting/grid-components/grid-menubar.component";
import { ICurrentPeriod } from 'app/models/period';
import { ITBParams } from 'app/models/journals';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportStore } from 'app/store/reports.store';

@Component({
  selector: "distribution-listing",
  imports: [ActiveReportsModule, GridMenubarStandaloneComponent, MatProgressSpinnerModule],
  template: `
    <div class="sm:hide md:visible mb-1">
    <grid-menubar
                [inTitle]="'Distributed Trial Balance by Period'"
                (back)="onBack()"
                (period)=onPeriod($event)
                [showCalendar]=false
                [showCalendarButton]=false
                [showPeriod]=true
                [showPrint]=false
                [showExportXL]=true
                [showExportPDF]=false
                [showExportCSV]=false
                [showSettings]=false
                [showBack]=true>
    </grid-menubar>
    </div>
    @if (reportStore.isLoading() === false) {
      <div id="viewer-host">
        <gc-activereports-viewer (init)="onViewerInit()" [toolbarVisible]="true" [sidebarVisible]="false"></gc-activereports-viewer>
      </div>
    } @else {
      <div class="flex justify-center items-center mt-20">
        <mat-spinner></mat-spinner>
      </div>
    }
  `,
  styleUrls: ["./active.component.css"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: AR_EXPORTS,
      useClass: PdfExportService,
      multi: true,
    },
    {
      provide: AR_EXPORTS,
      useClass: HtmlExportService,
      multi: true,
    },
    {
      provide: AR_EXPORTS,
      useClass: TabularDataExportService,
      multi: true,
    },
    {
      provide: AR_EXPORTS,
      useClass: XlsxAdvExportService,
      multi: true,
    },
  ],
})
export class DistributionListing {
onBack() {
throw new Error('Method not implemented.');
}

  reportStore = inject(ReportStore);

  periodParams = {
    period: 1,
    year: 2025,
  };


  @ViewChild(ViewerComponent, { static: false }) viewerRef?: ViewerComponent;

  protected readonly title = signal("Noble Angular v21 + ActiveReportsJS");
  public reportView = viewChild(ViewerComponent);
  public reportName = { id: "report.json", displayName: "my report" };
  public counter = 0;
  public reportStorage = new Map();

  async onViewerInit() {
    const report = await this.loadReport();
    report.DataSources[0].ConnectionProperties.ConnectString = "jsondata=" + JSON.stringify(this.reportStore.tb());
    report.DataSets[0].Query.CommandText = "jpath=$.*";
    this.reportView()?.open(report);
  }

  ngOnInit(): void {
    //var params: ITBParams = { period: 1, year: 2025 };
    //this.loadData(params);
    this.onPeriod('');
  }

  loadData(params: ITBParams) {
    this.reportStore.loadTB(params);
  }

  async loadReport() {
    const reportResponse = await fetch("tb-dist.rdlx-json");
    const report = await reportResponse.json();
    return report;
  }

  onExport () {
    console.debug("Exporting Report");


  }

  onPeriod(e: string) {

    console.debug("Period : ", e);

    var prd: ICurrentPeriod[] = [];

    var currentPeriod = localStorage.getItem('currentPeriod');
    if (currentPeriod === null) {
      currentPeriod = 'January 2025';
    }

    var activePeriods: ICurrentPeriod[] = [];

    var _currentActivePeriods = localStorage.getItem('activePeriod');

    if (_currentActivePeriods) {
      activePeriods = JSON.parse(_currentActivePeriods) as ICurrentPeriod[];
    }

    if (activePeriods.length > 0) {
      prd = activePeriods.filter((period) => period.description === currentPeriod);
      if (prd.length > 0) {
        this.periodParams.period = prd[0].period_id;
        this.periodParams.year = prd[0].period_year;
      }
      this.loadData(this.periodParams);
    }
  }

    pageDown() {
        this.reportView()?.goToNextPage();
    }

    pageUp() {
        this.reportView()?.goToPrevPage();
    }

    pageLast() {
        this.reportView()?.goToLastPage();
    }

    pageFirst() {
        this.reportView()?.goToFirstPage();
    }


}
