import { Component } from '@angular/core';
import { ViewChild, ViewEncapsulation } from '@angular/core';
import { Browser } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ChartComponent, ChartAllModule } from '@syncfusion/ej2-angular-charts';
import { loadChartTheme } from './theme-color';


@Component({
  selector: 'budget-bar',  
  imports: [ChartAllModule, ChartAllModule, ],
  template: `    
    <div class="control-section">
    <div align='center'>
        <ejs-chart #roundcol style='display:block;' 
            [chartArea]='chartArea' 
            [width]='width' 
            height='500px' align='center' id='column-container' 
            [primaryXAxis]='primaryXAxis'
            [primaryYAxis]='primaryYAxis' 
            [title]='title' 
            [subTitle]='subTitle' 
            [titleStyle]='titleStyle' 
            [tooltip]='tooltip' 
            [legendSettings]='legend'
            (load)='load($event)' >
            <e-series-collection>
                <e-series [dataSource]='data' type='Bar' xName='x' yName='y' [cornerRadius]='radius' columnWidth=0.5 [marker]='marker'>
                </e-series>
            </e-series-collection>
        </ejs-chart>
    </div>
  </div>
  `,
  styles: ``
})
export class BudgetBarGraph {

  // create an API that returns the budget data in the format below

  @ViewChild('roundcol')  public chart: ChartComponent;

    // public data: Object[] = [
    //     { x: 'Healthcare', y: 0.9, text: '0.9%' },
    //     { x: 'Real Estate', y: 1.3, text: '1.3%' },
    //     { x: 'Energy', y: 2.3, text: '2.3%' },
    //     { x:  Browser.isDevice ? 'Consumer <br> Staples' : 'Consumer Staples', y: 12.0, text: '12.0%' },
    //     { x: 'Industrials', y: 15.6, text: '15.6%' },
    //     { x: 'Utilities', y: 19.6, text: '19.6%' },
    //     { x:  Browser.isDevice ? 'S&P <br> 500 Average' : 'S&P 500 Average', y: 23.3, text: '23.3%' },
    //     { x: 'Financial', y: 28.4, text: '28.4%' },
    //     { x:  Browser.isDevice ? 'Consumer <br> Discretionary' : 'Consumer Discretionary', y: 29.1, text: '29.1%' },
    //     { x:  Browser.isDevice ? 'Information <br> Technology' : 'Information Technology', y: 35.7, text: '35.7%' },
    //     { x:  Browser.isDevice ? 'Communication <br> Services' : 'Communication Services', y: 38.9, text: '38.9%' }
    // ];

     public data: Object[] = [
    { x: 'Management Fees', y: 30, text: 'Management Fees: 15%' },
    { x: 'Interest expense', y: 15, text: 'Interest Expense: 15%' },
    { x: 'Office', y: 16, text: 'Office: 16%' },
    { x: 'Landscaping', y: 10, text: 'Landscaping: 10%' },
    { x: 'Snow removal', y: 5, text: 'Snow removal: 5%' },
    { x: 'Water', y: 26, text: 'Water: 126%' },
    { x: 'Power', y: 6, text: 'Power: 6%' },    
  ];

    //Initializing Primary X Axis
    public primaryXAxis: Object = {
        valueType: 'Category',
        interval: 1,
        majorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
        lineStyle: { width: 0 },
        labelPosition: 'Outside',
        labelIntersectAction: Browser.isDevice ? 'None' : 'Rotate45'
    };
    //Initializing Primary Y Axis
    public primaryYAxis: Object = {
        minimum: 0,
        maximum: 50,
        title: 'Sector-wise Growth (%)',
        labelFormat: '{value}%',
        interval: 10,
        majorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        lineStyle: { width: 0 },
        opposedPosition: true
    };
    public radius: Object = { bottomLeft: Browser.isDevice ? 8 : 10, bottomRight: Browser.isDevice ? 8 : 10, topLeft: Browser.isDevice ? 8 : 10, topRight: Browser.isDevice ? 8 : 10 }
    public marker: Object = { dataLabel: { visible: true, name: 'text', enableRotation: false, angle: -90, font: { fontWeight: '600' } } }
    public title: string = 'Budget Expense Analysis';
    public subTitle: string = 'Yearly Data of Budget Expenses';
    
    public tooltip: Object = {
        enable: true, header: Browser.isDevice ? "" : "<b>${point.x}</b>", format: "Growth Rate : <b>${point.text}</b>"
    };
    public legend: Object = {
        visible: false
    }
    public chartArea: Object = {
        border: {
            width: 0
        }
    };

    public titleStyle: Object =  { 
      position: 'Top',
      font: {
        fontWeight: '600',
        color: 'gray',
      },
    };

    public width: string = Browser.isDevice ? '100%' : '77%';
    // custom code start
    public load(args: ILoadedEventArgs): void {
        loadChartTheme(args);
    };
    constructor() {
        //code
    };
}


