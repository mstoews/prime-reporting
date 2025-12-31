import { Component, OnInit, input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ITrialBalance } from 'app/models';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'statement-comparison-item',
   imports: [CommonModule, MatCardModule],
  template: `        
          <div class="">
          <section class="grid grid-cols-1 text-sm">              
                @if (item().trans_type == 'TB Summary') {                    
                  <div class="grid grid-cols-12 gap-2 border-gray-700 mt-2 ">      
                    <div (click)="onChild($event)" class="col-start-1 text-bold text-left text-slate-800 dark:text-slate-100 ">{{item().child}}</div>
                    <div class="col-start-2 col-end-5 text-slate-900 dark:text-slate-100 text-bold  text-left text-sm">    {{item().account_description}}</div>
                    <div class="col-start-6           text-slate-900 dark:text-slate-100 text-right  text-sm">  {{item().opening_balance | number: '1.2-2'}}</div>
                    <div class="col-start-7           text-slate-900 dark:text-slate-100 text-right  text-sm">  {{item().close | number: '1.2-2'}}</div>            
                    <div class="col-start-8           text-slate-900 dark:text-slate-100 text-right  text-sm">  {{item().close - item().opening_balance| number: '1.2-2'}}</div>  
                  </div>
                                    
                } 
                @else {                      
                  <div class="grid grid-cols-12 gap-2">      
                  <div class="col-start-1           text-slate-800 dark:text-slate-100  text-right   "></div>                  
                  <div class="col-start-3 col-end-5 text-slate-800 dark:text-slate-100  text-left    ">  {{item().id}} - {{item().description}}</div>
                  <div class="col-start-7           text-slate-800 dark:text-slate-100  text-right"> {{item().debit_amount - item().credit_amount | number: '1.2-2'}}</div>
                  </div> 
                }                
          </section>
          </div>  
  `,
})

export class StatementComparisonComponent {
  item = input<ITrialBalance>()
  showHeader = input<boolean>()  

  onChild(e: any) {
    console.log('child clicked', JSON.stringify(e));
  }

}
