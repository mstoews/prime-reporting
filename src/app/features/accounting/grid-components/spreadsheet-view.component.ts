import { Component, HostListener, viewChild } from '@angular/core';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { SpreadsheetAllModule, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';

@Component({
  selector: 'spreadsheet-view',
  imports: [DropDownButtonModule,
    SpreadsheetAllModule],
  template: `
      <ejs-spreadsheet #dockerImage [openUrl]="openUrl" [saveUrl]="saveUrl" allowSave='true' allowOpen="true" height="100%"> </ejs-spreadsheet>
  `,
  styles: ``
})
export class SpreadsheetViewComponent {

  public isVisible: boolean = true;
  
  beforeOpen($event: any) { }
  
  saveUrl='http://localhost:6002/api/spreadsheet/save'  
  openUrl='http://localhost:6002/api/spreadsheet/open'  
  
  public allowedExtensions: string = '.xlsx, .xls, .csv';
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
        const width = window.innerWidth;
        if (width < 768) {
            this.isVisible = false;
        }
        else {
            this.isVisible = true;
        }

        this.adjustHeight();
    }

  ngAfterViewInit() {
        const width = window.innerWidth;
        if (width < 768) {
            this.isVisible = false;
        }
        else {
            this.isVisible = true;
        }
        this.adjustHeight();
    }

  adjustHeight() {

        const headerHeight = document.querySelector('.header')?.clientHeight || 0;
        const footerHeight = document.querySelector('.footer')?.clientHeight || 0;
        const container = document.querySelector('.container');
        if (container) {
            const containerHeight = window.innerHeight - headerHeight - footerHeight;
            container.setAttribute('style', `height: ${containerHeight}px;`);
        }
        const spreadsheet = document.querySelector('.e-spreadsheet') as HTMLElement;
 
    }

}