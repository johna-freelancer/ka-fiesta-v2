import { Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/shared/services/auth.service';
import { CommonService } from 'app/shared/services/common.service';
import { ConsumerService } from 'app/shared/services/consumer.service';
import { NotificationService } from 'app/shared/services/notify.service';
import { PusherService } from 'app/shared/services/pusher.service';
import { UserService } from 'app/shared/services/user.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
@Component({
    selector     : 'landing-home',
    templateUrl  : './customer/public/index.component.html',
    styleUrls: ['./customer/public/assets/css/theme.min.css'],
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent
{
    records = [];
    keyword = '';
    today = new Date().getDay();
    shopLoading = true;
    user: any;
    trackOrderNumber = '';
    constructor(
    private _consumer: ConsumerService,
    private _common: CommonService,
    private _router: Router,
    private _auth: AuthService,
    private _user: UserService,
    private _notify: NotificationService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _pusher: PusherService,
    private _snackBar: MatSnackBar
    )
    {
        
    }

    ngOnInit(): void {
        this.fetch();
        this.getUser();
        this._pusher.subScribeToChannel('my-channel', [environment.ORDER_PIPELINE_EVENT], (data) => {
            const jdata = JSON.parse(data);
            const order_id = jdata['order_id'];
            const user_id = jdata['user_id'];
            const msg = jdata['message'];
            if (this.user?.id == user_id) {
                Swal.fire({
                    title: '#' + order_id + ': ' + msg,
                    showClass: {
                      popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                      popup: 'animate__animated animate__fadeOutUp'
                    }
                  })
            }
        });
    }

    getUser() {
        this.user = this._auth.getUser();
    }

    fetch() {
        this.shopLoading = true;
        this._consumer.search(this.keyword)
          .subscribe((store: any) => {
            this.records = store.result;
            this.shopLoading = false;
          });
    }

    tConvert(time) {
        return this._common.tConvert(time);
    }

    chooseStore(store){
        this._consumer.setSelectedStore(store);
        this._router.navigate(['/stores/' + store.id])
    }

    login () {
        this._router.navigateByUrl('/sign-in?redirectURL=stores');
    }

    logout() {
        this._auth.logout()
        .subscribe(()=>{
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            this.getUser();
        });
    }

    track(){
        this._consumer.track(this.trackOrderNumber)
        .subscribe((response: any) => {
            this._fuseConfirmationService.open(
                {
                  title      : response['message'],
                  message    : '',
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
                          show : false,
                          label: 'Cancel'
                      }
                  },
                  dismissible: true
              }).afterClosed().subscribe(result => {
              });
        },
        (response: any) => {
            this._fuseConfirmationService.open(
                {
                  title      : response.error['message'],
                  message    : '',
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
                          show : false,
                          label: 'Cancel'
                      }
                  },
                  dismissible: true
              }).afterClosed().subscribe(result => {
              });
        })
        
    }
}
