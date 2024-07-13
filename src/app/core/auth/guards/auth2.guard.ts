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
    if (this.authService.user().role === 'admin') {
      return true;
    } else {
      this.router.navigateByUrl('/stores');
      return false;
    }
  }
}