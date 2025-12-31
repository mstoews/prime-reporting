import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, inject, input, viewChild } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { IJournalTemplate} from "../../../models/journals";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';


@Component({
  selector: 'template-drop-down',
  imports: [ReactiveFormsModule, NgxMatSelectSearchModule, MatSelectModule, CommonModule, MatIconModule],
  template: `
  @if (dropdownFilter | async; as items ) {
    <fieldset [formGroupName]="controlKey">
        <mat-form-field class="flex flex-col grow mt-1 dark:text-gray-100 text-gray-700">
            <mat-label class="text-lg ml-2 dark:text-gray-100 text-gray-600" for="dropdown">{{label}}</mat-label>
            <mat-select class="text-lg ml-2 dark:text-gray-100 text-gray-600"  [formControl]="dropdownCtrl" placeholder="Template Name" #singleDropdownSelect required >
                <mat-option>
                    <ngx-mat-select-search [formControl]="dropdownFilterCtrl" [noEntriesFoundLabel]="'No entries found'" [placeholderLabel]="'Search'">
                    </ngx-mat-select-search>
                </mat-option>
                @for (item of items; track $index) {
                    <mat-option [value]="item">{{ item.description }}</mat-option>
                }
            </mat-select>
           <mat-icon class="icon-size-5 text-green-700" matSuffix  [svgIcon]="'heroicons_solid:document-check'"></mat-icon>
        </mat-form-field>        
    </fieldset>
   }
  `,
  styles: ``,
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: () => inject(ControlContainer, { skipSelf: true })
        }
    ],
})
export class TemplateDropDownComponent implements OnInit, OnDestroy, AfterViewInit {

    protected _onDestroyTemplateFilter = new Subject<void>();
    protected _onTemplateDestroy = new Subject<void>();

    @Input({ required: true }) controlKey = '';
    @Input() label = '';

    parentContainer = inject(ControlContainer);

    dropdownList = input.required<IJournalTemplate[]>();

    public dropdownCtrl: FormControl<IJournalTemplate> = new FormControl<IJournalTemplate>(null);
    public dropdownFilterCtrl: FormControl<string> = new FormControl<string>(null);
    public dropdownFilter: ReplaySubject<IJournalTemplate[]> = new ReplaySubject<IJournalTemplate[]>(null);
    public singleDropdownSelect = viewChild<MatSelect>("singleDropdownSelect");


    get parentFormGroup() {
        return this.parentContainer.control as FormGroup;
    }

    ngOnInit() {
        this.parentFormGroup.addControl(this.controlKey,
            new FormGroup({
                dropdownCtrl: new FormControl(''),
            }))


    }
    ngOnDestroy() {
        this.parentFormGroup.removeControl(this.controlKey);
    }

    public ngAfterViewInit() {

        this.dropdownFilter.next(this.dropdownList().slice());
        this.dropdownFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroyTemplateFilter)).subscribe(() => {
            this.filteredDropdown();
        });

        if (this.dropdownFilter)
            this.dropdownFilter
                .pipe(take(1), takeUntil(this._onDestroyTemplateFilter))
                .subscribe(() => {
                    if (this.singleDropdownSelect() != null || this.singleDropdownSelect() != undefined)
                        this.singleDropdownSelect()!.compareWith = (
                            a: IJournalTemplate,
                            b: IJournalTemplate
                        ) => {
                            return a && b && a.template_ref === b.template_ref;
                        };
                });

    }

    protected filteredDropdown() {
        if (!this.dropdownList()) {
            return;
        }
        // get the search keyword
        let search = this.dropdownFilterCtrl.value;
        if (!search) {
            this.dropdownFilter.next(this.dropdownList().slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.dropdownFilter.next(
            this.dropdownList().filter((item) => item.description.toLowerCase().indexOf(search) > -1)
        );
    }

    setDropdownValue(value: number) {
        const update = this.dropdownList().find((f) => f.template_ref === value)
        if (update !== undefined)
            this.dropdownCtrl.setValue(update);
    }

    getDropdownValue() {
        let value = this.dropdownCtrl.value;
        if (value === null || value === undefined) {
            return '';
        }
        return value.template_name;
    }
}
