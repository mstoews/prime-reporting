import { Component } from '@angular/core';
import { ViewChild, ViewEncapsulation } from '@angular/core';
import { AccumulationChart, AccumulationChartComponent, ChartAllModule, IAccLoadedEventArgs, AccumulationTheme, AccumulationChartAllModule, IAccPointRenderEventArgs } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';
import { loadAccumulationChartTheme, roundedCornerPointRender } from './theme-color';

@Component({
  selector: 'budget-pie',
  imports: [ChartAllModule, AccumulationChartAllModule,],
  template: 
  `          
        <ejs-accumulationchart class="dark:text-gray-100 w-full h-full" 
            id="container" #pie 
            style='display:block; width: 92% color: gray;' 
            align='center'
            [legendSettings]="legendSettings" 
            [tooltip]="tooltip" 
            [title]="title" 
            [subTitle]="subTitle"
            [enableAnimation]='enableAnimation' 
            (load)='load($event)' 
            [enableBorderOnMouseMove]='false'
            (pointRender)='pointRender($event)'>
            <e-accumulation-series-collection>
                <e-accumulation-series [dataSource]='data' name="Project" xName='x' yName='y' [radius]='radius' innerRadius="50%" [dataLabel]="dataLabel"
                 [border]='border' borderRadius='8' [explode]="false" [startAngle]="120">
                </e-accumulation-series>
            </e-accumulation-series-collection>
        </ejs-accumulationchart>    
  `,
  styles: ``
})
export class BudgetPieGraph {

  // create an API that returns the budget data in the format below

  public data: Object[] = [
    { x: 'Management Fees', y: 126, text: 'Management Fees: 126%' },
    { x: 'Interest expense', y: 15, text: 'Interest Expense: 15%' },
    { x: 'Office', y: 16, text: 'Office: 16%' },
    { x: 'Landscaping', y: 100, text: 'Landscaping: 100%' },
    { x: 'Snow removal', y: 52, text: 'Snow removal: 52%' },
    { x: 'Water', y: 326, text: 'Water: 326%' },
    { x: 'Power', y: 66, text: 'Power: 66%' },
    { x: 'Waste', y: 125, text: 'Waste: 125%' },
    { x: 'Repairs and Maintenance', y: 126, text: 'Repairs and Maintenance: 126%' },
    { x: 'Caretaker', y: 90, text: 'Caretaker: 90%' },
    { x: 'Professional Fees - Legal', y: 226, text: 'Professional Fees: 226%' },
    { x: 'Bookkeeping', y: 92, text: 'Bookkeeping: 92%' },
    { x: 'Insurance', y: 15, text: 'Insurance: 15%' },
    { x: 'Amortization', y: 30, text: 'Amortization: 30%' },
  ];
  
  @ViewChild('pie')  public pie: AccumulationChartComponent | AccumulationChart;
  
  //Initializing Legend
  public legendSettings: Object = {
    visible: false
  };
  public radius: string = Browser.isDevice ? '25%' : '70%';

  public dataLabel: Object = {
    visible: true, position: Browser.isDevice ? 'Inside' : 'Outside',
    name: 'text',
    connectorStyle: { length: '20px', type: 'Curve' },
    font: {
      fontWeight: '600',
      color: 'gray',
    },
    enableRotation: true,
  };
  //Border
  public border: Object = {
    width: 0.5, color: '#ffffff'
  }
  // custom code start
  public load(args: IAccLoadedEventArgs): void {
    loadAccumulationChartTheme(args);
  }
  // custom code end
  public enableAnimation: boolean = true;
  public tooltip: Object = {  enable: true, header: '', format: '<b>${point.x}</b><br>Budget Expense Percentage : <b>${point.y}%</b>', enableHighlight: true };

  public pointRender(args: IAccPointRenderEventArgs): void {
    roundedCornerPointRender(args);

  };
  public title: string = '';
  public subTitle: string = 'Current Budgeted Expenses';
  constructor() {
    //code
  };

}


