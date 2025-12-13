import { AR_EXPORTS, ActiveReportsModule, HtmlExportService, PdfExportService, TabularDataExportService, ViewerComponent } from '@mescius/activereportsjs-angular';
import { Component, signal, viewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'reporting',
  imports: [ActiveReportsModule, ButtonModule, FloatLabelModule],
  template: `
   <div id="viewer-host">
       <gc-activereports-viewer (init)="onViewerInit()" [toolbarVisible]="true" [sidebarVisible]="false"> </gc-activereports-viewer>
   </div>
  `,
  styles:`
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

export class Reporting{

  protected readonly title = signal('Noble Angular v21 + ActiveReportsJS');
  public reportView = viewChild(ViewerComponent);
  public reportName = { id: 'report.json', displayName: 'my report' };
  public counter = 0;
  public reportStorage = new Map();


  dataSetFields = [
        {
            "Name": "account",
            "DataField": "account"
        },
        {
            "Name": "child",
            "DataField": "child"
        },
        {
            "Name": "period",
            "DataField": "period"
        },
        {
            "Name": "description",
            "DataField": "description"
        },
        {
            "Name": "opening_balance",
            "DataField": "opening_balance"
        },
        {
            "Name": "debit_balance",
            "DataField": "debit_balance"
        },
        {
            "Name": "credit_balance",
            "DataField": "credit_balance"
        },
        {
            "Name": "update_date",
            "DataField": "update_date"
        },
    ];

    async onViewerInit() {
        const data = await this.loadData();
        const report = await this.loadReport();
        report.DataSources[0].ConnectionProperties.ConnectString = 'jsondata=' + JSON.stringify(data);
        report.DataSets[0].fields = this.dataSetFields;
        report.DataSets[0].Query.CommandText = 'jpath=$.*';
        this.reportView()?.open(report);
    }

    async loadData() {
        const headers = new Headers();
        const dataRequest = new Request(
            "http://localhost:8080/dist",
            {
                headers: headers,
            }
        );
        const response = await fetch(dataRequest);
        const data: any = await response.json();
        return data;
    }

    async loadReport() {
        const reportResponse = await fetch("report2.rdlx-json");
        const report = await reportResponse.json();
        return report;
    }

    async onSave() {
        alert('Report saved!');
    }

    pageDown( ) {
        this.reportView()?.goToNextPage();
    }

    pageUp( ) {
        this.reportView()?.goToPrevPage();
    }

    pageLast( ) {
        this.reportView()?.goToLastPage();
    }

    pageFirst( ) {
        this.reportView()?.goToFirstPage();
    }

    onSaveRpt = (info: any) => {
      const reportId = info.id || `NewReport${++this.counter}`;
      this.reportStorage.set(reportId, info.definition);
      return Promise.resolve({ displayName: reportId });
  };

}
