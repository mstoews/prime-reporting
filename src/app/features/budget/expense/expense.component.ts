import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { AccumulationChartAllModule, ChartComponent, AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';

@Component({
  selector: 'expense',
  imports: [AccumulationChartModule, ListViewModule],
  template: `
    <section class="bg-white dark:bg-gray-950">
    <div class="h-screen flex justify-center p-4 sm:p-6">
        <div class="w-full" style="max-width: 576px;">
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                    <span class="e-badge e-badge-warning flex justify-center items-center text-2xl sf-icon-money-bag w-12 h-12"></span>
                    <div class="flex flex-col gap-1">
                        <p class="text-base font-medium text-gray-900 dark:text-white">Daily Expense</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Data for the last week</p>
                    </div>
                </div>
                <button ejs-button class="hidden sm:block e-outline" content="View Report" type="button" aria-label="view report" role="button"></button>
                <button ejs-button class="block sm:hidden e-outline" iconCss="e-icons e-description" content=" " type="button" aria-label="view report" role="button"></button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-2">
                <div class="relative">
                    <ejs-accumulationchart #chart width="100%" height="200px" [centerLabel]="centerLabel" [legendSettings]="{visible: false}" [enableBorderOnMouseMove]="false" (load)="chartLoad($event,'Tailwind3','Tailwind3Dark')" aria-label="expense analysis" role="region">
                        <e-accumulation-series-collection>
                            <e-accumulation-series [dataSource]="chartData" xName="x" yName="y" name="Expense" startAngle="210" innerRadius="65%" radius="100%" [palettes]="['#5A61F6', '#03B4B4', '#78B008', '#F39C12']"></e-accumulation-series>
                        </e-accumulation-series-collection>
                    </ejs-accumulationchart>
                    <div class="flex items-center gap-1 absolute top-1/2 left-1/2 -translate-x-1/2 mt-2 text-green-700"><span class="e-icons e-arrow-up"></span><p class="text-sm font-medium">2.1%</p></div>
                </div>
                <div id="expenseList" class="flex items-center">
                    <ejs-listview class="e-list-template border-0" [dataSource]="chartData" aria-label="legend options" role="list">
                        <ng-template #template let-data let-i="index">
                            <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 px-1 py-4">
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full" [style.background-color]="['#5A61F6', '#03B4B4', '#78B008', '#F39C12'][data.id-1]"></span>
                                    <p class="text-xs text-gray-700 dark:text-gray-300">{{data.x}}</p>
                                </div>
                                <p class="text-xs text-gray-500 dark:text-gray-400">{{data.y}}%</p>
                            </div>
                        </ng-template>
                    </ejs-listview>
                </div>
            </div>
        </div>
    </div>
</section>
  `,
  styles: `
    :host {
      display: block;
    }
    #expenseList .e-listview .e-list-item {
    border: none !important;
    }

    #expenseList .e-listview .e-list-item.e-active,
    #expenseList .e-listview .e-list-item:hover {
      background-color: transparent !important;
    }
  `
})
export class ExpenseComponent {
 @ViewChild('chart') public chart!: ChartComponent;

    public isDarkMode: boolean = false;

    constructor() { }

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {

    }

    public chartData: Object[] = [
        { id: 1, x: 'Food & Drink', y: 48 },
        { id: 2, x: 'Grocery', y: 32 },
        { id: 3, x: 'Shopping', y: 13 },
        { id: 4, x: 'Transport', y: 7 }
    ];

    public centerLabel: Object = {
        text: '$8,295',
        textStyle: {
            fontWeight: '500',
            size: '16px'
        }
    };

    public chartLoad(args: any, lightTheme: string, darkTheme: string): void {
        args.chart.theme = this.isDarkMode ? darkTheme : lightTheme;
    };

}
