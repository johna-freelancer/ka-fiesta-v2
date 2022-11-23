import { Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseLoadingService } from '@fuse/services/loading';
import { AuthService } from 'app/shared/services/auth.service';
import { CommonService } from 'app/shared/services/common.service';
import { ConsumerService } from 'app/shared/services/consumer.service';
import { NotificationService } from 'app/shared/services/notify.service';
import { UserService } from 'app/shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
    selector     : 'landing-store',
    templateUrl  : './store.component.html',
    styleUrls: ['./assets/css/theme.min.css'],
    encapsulation: ViewEncapsulation.None
})
export class StoreComponent
{
    records = [];
    keyword = '';
    today = new Date().getDay();
    shopLoading = true;
    user = [];
    store: any;
    constructor(
    private _consumer: ConsumerService,
    private _common: CommonService,
    private _router: Router,
    private _auth: AuthService,
    private _user: UserService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _fuseLoadingService: FuseLoadingService ,
    private _snackBar: MatSnackBar
    )
    {
        
    }

    ngOnInit(): void {
        this.getUser();
        this.store = this._consumer.getSelectedStore();
        if (!this.store) {
            this._snackBar.open('No store selected!');
            this._router.navigateByUrl('/stores');
        }
        this.fetchProducts();
    }

    getUser() {
        this.user = this._auth.getUser();
    }

    fetchProducts() {
        this._fuseLoadingService.show();
        this._consumer.getProducts({store_id: this.store.id, keyword: this.keyword}).subscribe((response:any) => {
            this.records = response['result'];
            this._fuseLoadingService.hide();
        });
    }

    tConvert(time) {
        return this._common.tConvert(time);
    }

    back() {
        this._consumer.clearSelectedStore();
        this._router.navigateByUrl('/stores');
    }

    addToCart(item) {
        this._fuseConfirmationService.open(
            {
              title      : 'Are you sure?',
              message    : 'Add this item to your cart?',
              icon       : {
                  show : false,
                  name : 'heroicons_outline:question-mark-circle',
                  color: 'primary'
              },
              actions    : {
                  confirm: {
                      show : true,
                      label: 'Yes',
                      color: 'primary'
                  },
                  cancel : {
                      show : true,
                      label: 'Cancel'
                  }
              },
              dismissible: true
          }).afterClosed().subscribe(result => {
              if (result == 'confirmed') {
                this._consumer.setCart(item, this.store.name, this.store.id);
                Swal.fire(
                    'Item added to cart!',
                    '',
                    'success'
                  )
              }
          });
    }
    counter(i: number) {
        return new Array(i);
    }
    login () {
        this._router.navigateByUrl('/sign-in?redirectURL=stores/' + this.store.id);
    }
    logout() {
        this._auth.logout()
        .subscribe(()=>{
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            this.getUser();
            
        });
    }
}
