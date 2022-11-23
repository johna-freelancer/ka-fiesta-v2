import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';
import { CommonService } from 'app/shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class Auth2Guard  implements CanActivate {

  
  constructor(
    private authService: AuthService,
    private router: Router,
    private commonService: CommonService,
  ) {
  } 

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.authService.isAuthenticated()) {
        //   this.notify.info("You are not authorized to access this page.");
          this.router.navigateByUrl('/stores');
          return false;
      }
        if (!next.data['roles'])
          return true;
        if (!this.commonService.isGrantedAny(next.data['roles'])) {
            this.router.navigateByUrl('/stores');
            return false;
        } else {
            return true;
        }
  }
  
}