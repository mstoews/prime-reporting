import { AR_EXPORTS, ActiveReportsModule, HtmlExportService, PdfExportService, TabularDataExportService, ViewerComponent } from '@mescius/activereportsjs-angular';
import { Component, OnInit, ViewChild, inject, signal, viewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ReportStore } from 'app/store/reports.store';

@Component({
    selector: 'jd-rpt',
    imports: [ActiveReportsModule, ButtonModule, FloatLabelModule],
    template: `
        <div id="viewer-host">
            <gc-activereports-viewer (init)="onViewerInit()" [toolbarVisible]="true" [sidebarVisible]="false"> </gc-activereports-viewer>
        </div>
    `,
    styles: `
        #viewer-host {
            height: calc(100vh - 175px);
            border: 1px solid var(--surface-border);
            border-radius: 4px;
            overflow: hidden;
        }
    `,
    providers: [
        {
            provide: AR_EXPORTS,
            useClass: PdfExportService,
            multi: true
        },
        {
            provide: AR_EXPORTS,
            useClass: HtmlExportService,
            multi: true
        },
        {
            provide: AR_EXPORTS,
            useClass: TabularDataExportService,
            multi: true
        }
    ]
})
class JdRpt implements OnInit{

    reportStore = inject(ReportStore);

    @ViewChild(ViewerComponent, { static: false }) viewerRef?: ViewerComponent;

    protected readonly title = signal('Noble Angular v21 + ActiveReportsJS');
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
        this.reportStore.loadTB(params);
    }

    async loadReport() {
        const reportResponse = await fetch('journal-list.json');
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
        if (this.viewerRef) {
            this.viewerRef.zoom = 1.5;
        }
     }

    zoomOut() {
        if (this.viewerRef) {
            this.viewerRef.zoom = .75;
        }
    }


    onSaveRpt = (info: any) => {
        const reportId = info.id || `NewReport${++this.counter}`;
        this.reportStorage.set(reportId, info.definition);
        return Promise.resolve({ displayName: reportId });
    };
}

export default JdRpt;
