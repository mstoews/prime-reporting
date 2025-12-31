import { Component, OnInit } from '@angular/core';
import { editingResources } from './data';
import { GanttAllModule } from '@syncfusion/ej2-angular-gantt';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { SliderAllModule } from '@syncfusion/ej2-angular-inputs';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchAllModule } from '@syncfusion/ej2-angular-buttons';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { splitTasksData } from './data';


@Component({
    selector: 'gantt',
    standalone: true,
    imports: [GanttAllModule, ButtonModule, SliderAllModule, MultiSelectAllModule, DropDownListAllModule, SwitchAllModule, NumericTextBoxAllModule],
    template: `
<div class="control-section">
    <ejs-gantt id="SplitTasks" #splittasks height="750px" [dataSource]="data" [taskFields]="taskSettings" [treeColumnIndex]="1"
        [splitterSettings]="splitterSettings" [editSettings]="editSettings" [columns]="columns" [labelSettings]="labelSettings"
        [allowSelection]="true" [enableContextMenu]="true" [projectStartDate]="projectStartDate" [projectEndDate]="projectEndDate" [highlightWeekends]="true"
        [toolbar]="toolbar">
    </ejs-gantt>
</div>
  `,

})
export class Gantt implements OnInit {

    public data: object[];
    public taskSettings: object;
    public splitterSettings: object;
    public columns: object[];
    public editSettings: object;
    public toolbar: any;
    public labelSettings: object;
    public projectStartDate: Date;
    public projectEndDate: Date;
    public ngOnInit(): void {
        this.data = splitTasksData;
        this.taskSettings = {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            child: 'subtasks',
            segments: 'Segments'
        };
        this.editSettings = {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        };
        this.columns = [
            { field: 'TaskID', width: 80 },
            { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
            { field: 'StartDate' },
            { field: 'EndDate' },
            { field: 'Duration' },
            { field: 'Progress' },
            { field: 'Predecessor' }
        ];
        this.toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'];
        this.splitterSettings = {
            position: "35%"
        };
        this.labelSettings = {
            leftLabel: 'TaskName',
            taskLabel: '${Progress}%'
        };
        this.projectStartDate = new Date('01/30/2024');
        this.projectEndDate = new Date('03/04/2024');
    }
}
