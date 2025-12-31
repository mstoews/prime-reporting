import {
  AggregateService,
  ColumnMenuService,
  ContextMenuService,
  EditService,
  EditSettingsModel,
  ExcelExportService,
  FilterService,
  FilterSettingsModel,
  GridLine,
  GridModule,
  GroupService,
  PageService,
  ReorderService,
  ResizeService,
  SaveEventArgs,
  SearchSettingsModel,
  SelectionSettingsModel,
  SortService,
  ToolbarItems,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { Component, HostListener, OnInit, inject, viewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

import { AccountsStore } from 'app/store/accounts.store';
import { AuthService } from 'app/services/auth.service';
import { CommonModule } from '@angular/common';
import { ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';
import { DrawerComponent } from './comp.accts.drawer';
import { FuseConfirmationService } from 'app/services/confirmation';
import { GridMenubarStandaloneComponent } from '../../grid-components/grid-menubar.component';
import { IAccounts } from 'app/models';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
import { Save } from '@syncfusion/ej2-file-utils';
import { ToastrService } from 'ngx-toastr';

const imports = [
  CommonModule,
  MatButtonModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatIconModule,
  MatDatepickerModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatCardModule,
  GridMenubarStandaloneComponent,
  GridModule,
  ContextMenuAllModule,
  // SettingsComponent
];

const keyExpr = ['account', 'child'];

@Component({
  selector: 'glaccounts',
  imports: [imports, DrawerComponent],
  template: `
    @if ( store.isLoading() === false) {
    <grid-menubar
      [showPeriod]="false"
      [showBack]="false"
      [showNew]="true"
      (new)="onAdd($event)"
      [showSave]="true"
      (save)="onUpdate($event)"
      [showDelete]="true"
      (delete)="onDeleteSelection()"
      [inTitle]="'General Ledger Account Maintenance'"
    />

    <mat-drawer-container id="target" class="flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <mat-drawer
        class="w-[400px]"
        id="drawer"
        #drawer
        [opened]="false"
        mode="side"
        position="end"
        [disableClose]="false"
        class="bg-gray-100 dark:bg-gray-900"
      >
        <accts-drawer
          [account]="selectedAccount"
          (Cancel)="onClose()"
          (Update)="onUpdate($event)"
          (Add)="onAdd($event)"
          (Delete)="onDelete($event)"
        >
        </accts-drawer>
      </mat-drawer>

      <ng-container>
        <div class="border-1 border-gray-500 mt-3 bg-transparent rounded-lg">
          @if(store.isLoading() === false) {
          <ejs-grid
            #gl_grid
            [sortSettings]="detailSort"
            [columns]="cols"
            [dataSource]="store.accounts()"
            [height]="gridHeight"
            [rowHeight]="30"
            [allowSorting]="true"
            [showColumnMenu]="false"
            [allowFiltering]="false"
            [gridLines]="'both'"
            [toolbar]="toolbarOptions"
            [editSettings]="editSettings"
            [enablePersistence]="true"
            [allowGrouping]="true"
            [allowResizing]="true"
            [allowReordering]="true"
            [allowExcelExport]="true"
            [allowSelection]="true"
            [allowPdfExport]="true"
            (actionBegin)="actionBegin($event)"
            (rowSelected)="rowSelected($event)"
          >
          </ejs-grid>
          }
        </div>
      </ng-container>
    </mat-drawer-container>

    <ejs-contextmenu
      target="#target"
      (select)="itemSelect($event)"
      [animationSettings]="'animation'"
      [items]="menuItems"
    >
    </ejs-contextmenu>

    } @else {
    <div class="flex justify-center items-center mt-20">
      <mat-spinner></mat-spinner>
    </div>
    }
  `,
  providers: [
    ExcelExportService,
    ContextMenuService,
    ReorderService,
    SortService,
    GroupService,
    PageService,
    ResizeService,
    FilterService,
    ToolbarService,
    EditService,
    AggregateService,
    ColumnMenuService,
  ],
})
export class GlAccountsComponent implements OnInit {
itemSelect($event: any) {
throw new Error('Method not implemented.');
}
rowSelected($event: any) {
throw new Error('Method not implemented.');
}
  store = inject(AccountsStore);
  toast = inject(ToastrService);

  private _fuseConfirmationService = inject(FuseConfirmationService);
  private auth = inject(AuthService);

  public editDrawer = viewChild<MatDrawer>('drawer');
  public settingsDrawer = viewChild<MatDrawer>('settings');

  public gridHeight: number;

  public detailSort: Object;

  selectedAccount: IAccounts | null;

  private currentRow: Object;

  public selectedItemKeys: any[] = [];
  public bDirty: boolean = false;
  public bSettingsDirty: boolean = false;
  public bAccountsDirty: boolean = false;

  public formatoptions: Object;
  public initialSort: Object;
  public editSettings: EditSettingsModel;

  public submitClicked: boolean = false;
  public selectionOptions?: SelectionSettingsModel;
  public toolbarOptions?: ToolbarItems[];
  public searchOptions?: SearchSettingsModel;
  public filterSettings: FilterSettingsModel;
  public lines: GridLine;

  public cols = [
    { field: 'account', headerText: 'Group', width: 80, textAlign: 'Left' },
    { field: 'child', headerText: 'Account', width: 80, textAlign: 'Left', isPrimaryKey: true },
    { field: 'acct_type', headerText: 'Type', width: 80, textAlign: 'Left' },
    { field: 'description', headerText: 'Description', width: 200, textAlign: 'Left' },
    { field: 'update_date', headerText: 'Date', width: 80, textAlign: 'Left' },
    { field: 'update_user', headerText: 'User', width: 80, textAlign: 'Left' },
    { field: 'comments', headerText: 'Comment', width: 80, textAlign: 'Left' },
  ];

  public menuItems: MenuItemModel[] = [
    { id: 'edit', text: 'Edit Account', iconCss: 'e-icons e-edit' },
    { id: 'add', text: 'Add New Account', iconCss: 'e-icons e-file-document' },
    { id: 'delete', text: 'Delete Account', iconCss: 'e-icons e-circle-remove' },
    { separator: true },
    { id: 'back', text: 'Return', iconCss: 'e-icons e-chevron-left' },
  ];
  initialDatagrid() {
    this.formatoptions = { type: 'dateTime', format: 'M/dd/yyyy' };
    this.selectionOptions = { mode: 'Row' };
    this.editSettings = { allowEditing: true, allowAdding: false, allowDeleting: false };
    this.searchOptions = { operator: 'contains', ignoreCase: true, ignoreAccent: true };
    this.toolbarOptions = ['Search'];
    this.filterSettings = { type: 'Excel' };
  }

  onSelection(account: any) {
    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      acct_type: account.acct_type,
      sub_type: account.sub_type,
      balance: account.balance,
      comments: account.comments,
      create_date: new Date().toISOString().split('T')[0],
      create_user: '@' + this.auth.user().email.split('@')[0],
      update_date: new Date().toISOString().split('T')[0],
      update_user: '@' + this.auth.user().email.split('@')[0],
    };
    this.selectedAccount = rawData;
  }

  ngOnInit() {
    this.initialDatagrid();
    if (this.store.isLoaded() === false) this.store.readAccounts();

    this.detailSort = {
      columns: [{ field: 'child', direction: 'Descending' }],
    };
  }

  onOpenSettings() {
    this.settingsDrawer().open();
  }

  actionBegin(args: SaveEventArgs): void {
    var data = args.rowData;

    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      args.cancel = true;
      const account = args.rowData as IAccounts;
      const rawData = {
        account: account.account,
        child: account.child,
        parent_account: account.parent_account,
        description: account.description,
        acct_type: account.acct_type,
        sub_type: account.sub_type,
        balance: account.balance,
        comments: account.comments,
        create_date: new Date().toISOString().split('T')[0],
        create_user: '@' + this.auth.user().email.split('@')[0],
        update_date: new Date().toISOString().split('T')[0],
        update_user: '@' + this.auth.user().email.split('@')[0],
      };
      this.selectedAccount = rawData;
      this.onDoubleClicked(rawData);
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
    }
    if (args.requestType === 'save') {
      args.cancel = true;
    }
  }

  selectedRow(args: any) {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      args.cancel = true;
      const account = args.rowData;
      const rawData = {
        account: account.account,
        child: account.child,
        parent_account: account.parent_account,
        description: account.description,
        acct_type: account.acct_type,
        sub_type: account.sub_type,
        balance: account.balance,
        comments: account.comments,
        create_date: new Date().toISOString().split('T')[0],
        create_user: '@' + this.auth.user().email.split('@')[0],
        update_date: new Date().toISOString().split('T')[0],
        update_user: '@' + this.auth.user().email.split('@')[0],
      };
      this.selectedAccount = rawData;
      this.openEditDrawer();
      // this.onDoubleClicked(rawData);
    }
  }

  // CRUD Functions
  onCreate(account: IAccounts) {
    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      acct_type: account.acct_type,
      sub_type: account.sub_type,
      balance: account.balance,
      comments: account.comments,
      create_date: new Date().toISOString().split('T')[0],
      create_user: '@' + this.auth.user().email.split('@')[0],
      update_date: new Date().toISOString().split('T')[0],
      update_user: '@' + this.auth.user().email.split('@')[0],
    };
    this.selectedAccount = rawData;
    this.store.addAccounts(rawData);
    this.closeEditDrawer();
  }

  onDoubleClicked(account: any) {
    this.bAccountsDirty = false;
    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      acct_type: account.acct_type,
      sub_type: account.sub_type,
      balance: account.balance,
      comments: account.comments,
      create_date: new Date().toISOString().split('T')[0],
      create_user: '@' + this.auth.user().email.split('@')[0],
      update_date: new Date().toISOString().split('T')[0],
      update_user: '@' + this.auth.user().email.split('@')[0],
    };
    const type = account.acct_type;
    var parent: boolean;
    parent = account.parent_account;
    this.selectedAccount = rawData;
    this.openEditDrawer();
  }
  onAdd($event: any) {
    this.openEditDrawer();
  }
  onCancel() {
    this.editDrawer().toggle();
  }
  addAccount(account: IAccounts) {
    const updateDate = new Date().toISOString().split('T')[0];
    var user = this.auth.user().email.split('@')[0];
    user = '@' + user;

    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      acct_type: account.acct_type,
      sub_type: account.sub_type,
      balance: account.balance,
      comments: account.comments,
      create_date: account.create_date,
      create_user: account.create_user,
      update_date: updateDate,
      update_user: user,
    };
    this.store.addAccounts(account);
  }

  deleteAccount(child: number) {
    this.store.removeAccounts(child);
  }

  onUpdate(account: any) {
    const updateDate = new Date().toISOString().split('T')[0];
    var user = this.auth.user().email.split('@')[0];
    user = '@' + user;

    const rawData = {
      account: account.account,
      child: account.child,
      parent_account: account.parent_account,
      description: account.description,
      acct_type: account.acct_type,
      sub_type: account.sub_type,
      balance: account.balance,
      comments: account.comments,
      create_date: account.create_date,
      create_user: account.create_user,
      update_date: updateDate,
      update_user: user,
    };
    this.store.updateAccounts(rawData);
  }

  onDeleteSelection() {
    this.onDelete(this.currentRow);
  }

  onDelete(e: any) {
    const child = e.child;
    const confirmation = this._fuseConfirmationService.open({
      title: `Delete  Account: ${e.account} Child: ${child}`,
      message: 'Are you sure you want to delete this account? ',
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.store.removeAccounts(child);
      }
    });
    this.closeEditDrawer();
  }
  onClose() {
    this.closeEditDrawer();
  }

  closeSettings() {
    this.settingsDrawer().close();
  }

  openEditDrawer() {
    // if (this.settingsDrawer().opened) {
    //   this.settingsDrawer().close();
    // }
    this.editDrawer().open();
  }

  closeEditDrawer() {
    const opened = this.editDrawer().opened;
    if (opened === true) {
      this.editDrawer().toggle();
    } else {
      return;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.gridHeight = event.target.innerHeight - 480;
  }

  constructor() {
    this.gridHeight = window.innerHeight - 480;
  }
}
