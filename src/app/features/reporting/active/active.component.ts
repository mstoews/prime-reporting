import { AR_EXPORTS, ActiveReportsModule, HtmlExportService, PdfExportService, TabularDataExportService, ViewerComponent } from '@mescius/activereportsjs-angular';
import {Component, ViewChild, ViewEncapsulation, inject, signal, viewChild} from '@angular/core';

import { GridMenubarStandaloneComponent } from "app/features/accounting/grid-components/grid-menubar.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportStore } from 'app/store/reports.store';

@Component({
  selector: 'active-rpt',
  imports: [ActiveReportsModule, GridMenubarStandaloneComponent, MatProgressSpinnerModule],
  template: `
    <div class="sm:hide md:visible">
      <grid-menubar
        #menuBar
        class="pl-5 pr-5"
        [showPeriod]="true"
        [showBack]="true"
        [showPeriod]="false"
        [inTitle]=title()
      >
      </grid-menubar>
    </div>
        @if (reportStore.isLoading() === false) {
        <div id="viewer-host">
            <gc-activereports-viewer (init)="onViewerInit()" [toolbarVisible]="true" [sidebarVisible]="false"> </gc-activereports-viewer>
        </div>
        } @else {
         <div class="flex justify-center items-center mt-20">
            <mat-spinner></mat-spinner>
        </div>
        }
      `,
  styleUrls: ['./active.component.css'],
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
    ],
})
export class ActiveComponent {

    reportStore = inject(ReportStore);

    @ViewChild(ViewerComponent, { static: false }) viewerRef?: ViewerComponent;

    protected readonly title = signal('Journal Listing Report');
    public reportView = viewChild(ViewerComponent);
    public reportName = { id: 'report.json', displayName: 'my report' };
    public counter = 0;
    public reportStorage = new Map();

    async onViewerInit() {
        const report = await this.loadReport();
        console.log('Loaded report:', report);
        report.DataSources[0].ConnectionProperties.ConnectString = 'jsondata=' + JSON.stringify(this.reportStore.tb());
        report.DataSets[0].Query.CommandText = 'jpath=$.*';
        this.reportView()?.open(report);
    }

    ngOnInit(): void {
        var params = { start_date: '2025-01-01', end_date: '2025-12-31' };
        this.reportStore.transactionList(params);
    }

    async loadReport() {
        const reportResponse = await fetch('jd.rdlx-json');
        const report = await reportResponse.json();
        return report;
    }

    async onSave() {
        alert('Report saved!');
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

    zoomIn() {
        if (this.reportView()?.zoom) {
            this.reportView()?.zoom.toString(1.5);
        }
     }

    zoomOut() {
       if (this.reportView()?.zoom) {
            this.reportView()?.zoom.toString(.75);
        }
    }


    onSaveRpt = (info: any) => {
        const reportId = info.id || `NewReport${++this.counter}`;
        this.reportStorage.set(reportId, info.definition);
        return Promise.resolve({ displayName: reportId });
    };
}
