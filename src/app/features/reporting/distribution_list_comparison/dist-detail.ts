import { Component, input } from '@angular/core';

import { GridModule } from "@syncfusion/ej2-angular-grids";
import { ITrialBalance } from 'app/models';

@Component({
  selector: 'tb-detail',
  imports: [GridModule],
  template: `
        <ejs-grid #grid id="grid" 
          class="text-sm"                                
                gridLines="Both"
                [allowSorting]='false'
                [allowResizing]='true'
                [showColumnMenu]='true'                                                                 
                [allowFiltering]='false'                 
                [enablePersistence]='false'                                
                [enableStickyHeader]='true'                                 
                [allowGrouping]="true"                                
                [allowReordering]='true' 
                [allowExcelExport]='true' 
                [allowPdfExport]='true'                                     
                [dataSource]="dist_list()" >                                
                <e-columns>                                                                               
                  <e-column field='account'             headerText='Account' width='80' [visible]=false></e-column>
                  <e-column field='child'               headerText='Child' width='80' [visible]=false></e-column>
                  <e-column field='account_description' headerText='Acct Desc' width='150' [visible]=false></e-column>
                  <e-column field='transaction_date'    headerText='Tran Date' width='80' [visible]=false></e-column>
                  <e-column field='id'                  headerText='ID' width='100' [visible]=false></e-column>
                  <e-column field='trans_type'          headerText='Type' width='100' [visible]=false></e-column>
                  <e-column field='trans_date'          headerText='Date' width='100' [visible]=false></e-column>
                  <e-column field='type'                headerText='Type' width='100' [visible]=false></e-column>
                  <e-column field='description'         headerText='Description' width='100' [visible]=false></e-column>
                  <e-column field='reference'           headerText='Reference' width='100' [visible]=false></e-column>
                  <e-column field='party_id'            headerText='Party' width='100' [visible]=false></e-column>
                  <e-column field='amount'              headerText='Amount' width='100' [visible]=false></e-column>
                  <e-column field='opening_balance'     headerText='Balance' width='100' [visible]=false></e-column>
                  <e-column field='debit_amount'        headerText='Debit' width='100' [visible]=false></e-column>
                  <e-column field='credit_amount'       headerText='Credit' width='100' [visible]=false></e-column>
                  <e-column field='close'               headerText='Close' width='100' [visible]=false></e-column>
                  <e-column field='net'                 headerText='Net' width='100' [visible]=false></e-column>
                  <e-column field='pd'                  headerText='Prd' width='100' [visible]=false></e-column>
                  <e-column field='prd_year'            headerText='Year' width='100' [visible]=false></e-column>                
                </e-columns>
                <e-aggregates>
                        <e-aggregate>
                            <e-columns>
                                <e-column type="Sum" field="opening_balance" format="N2">
                                    <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                                </e-column>
                                <e-column type="Sum" field="debit_amount" format="N2">
                                      <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                                </e-column>
                                <e-column type="Sum" field="credit_amount" format="N2">
                                      <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                                </e-column>
                                <e-column type="Sum" field="close" format="N2">
                                      <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                                </e-column>
                                <e-column type="Sum" field="net" format="N2">
                                      <ng-template #footerTemplate let-data>{{data.Sum}}</ng-template>
                                </e-column>
                            </e-columns>                                                                                    
                        </e-aggregate>                                        
                    </e-aggregates>
            </ejs-grid>                        
        
  `,
  styles: ``
})

export class DistDetail {

  dist_list = input<ITrialBalance[]>();


}
