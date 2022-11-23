import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseLoadingService } from '@fuse/services/loading';
import { Cart, Item } from 'app/layout/common/cart/cart.model';
import { AuthService } from 'app/shared/services/auth.service';
import { CommonService } from 'app/shared/services/common.service';
import { ConsumerService } from 'app/shared/services/consumer.service';
import { NotificationService } from 'app/shared/services/notify.service';
import { UserService } from 'app/shared/services/user.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DatePipe } from '@angular/common';
@Component({
    selector     : 'landing-transaction',
    templateUrl  : './transactions.component.html',
    styleUrls: ['./assets/css/theme.min.css'],
    encapsulation: ViewEncapsulation.None
})

export class TransactionComponent
{
    statuses =  {   'pending': 'Pending',
                    'preparing' : 'Preparing',
                    'outfordelivery' : 'Out for Delivery',
                    'rejected' : 'Rejected',
                    'completed' : 'Completed'
                };
    records: any[] = [];
    keyword = '';
    user: any;
    displayedColumns: string[] = ['OrderNo', 'TransactionDate', 'Status', 'Remarks'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    date = new Date();
    status = 'all';
    constructor(
    private _consumer: ConsumerService,
    private _common: CommonService,
    private _router: Router,
    private _auth: AuthService,
    private _user: UserService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _fuseLoadingService: FuseLoadingService ,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private _datePipe: DatePipe

    )
    {
        
    }
    
    applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    fetchTransactions() {
        const date = this._datePipe.transform(this.date, 'yyyy-MM-dd');
        this._consumer.listTransactions({status: this.status, date: date, search: this.keyword})
        .subscribe((response: any) => {
            this.records = response['result'];
            this.dataSource = new MatTableDataSource(this.records);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

        })
    }


    ngOnInit(): void {
        this.getUser();
        this.fetchTransactions();
        if (!this.user)
            this._router.navigateByUrl('/stores');
    }

    getUser() {
        this.user = this._auth.getUser();
    }

    back() {
        this._consumer.clearSelectedStore();
        this._router.navigateByUrl('/stores');
    }

    login () {
        this._router.navigateByUrl('/sign-in?redirectURL=stores/activities/transactions');
    }
    logout() {
        this._auth.logout()
        .subscribe(()=>{
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            this._router.navigateByUrl('/stores');
            this.getUser();
        });
    }
    select(order) {
        let msg = '';
        order?.order_list?.forEach(item => {
            msg += item?.product_name + ' x ' + item?.quantity + '<br>';
        });
        this._fuseConfirmationService.open(
            {
              title      : 'Order List<br><hr>',
              message    : msg,
              icon       : {
                  show : false,
                  name : 'heroicons_outline:question-mark-circle',
                  color: 'primary'
              },
              actions    : {
                  confirm: {
                      show : true,
                      label: 'Close',
                      color: 'accent'
                  },
                  cancel : {
                      show : false,
                      label: 'Cancel'
                  }
              },
              dismissible: true
          }).afterClosed().subscribe(result => {
          
          });
    }
}