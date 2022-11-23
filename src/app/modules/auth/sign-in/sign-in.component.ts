import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/shared/services/auth.service';
import { UserService } from 'app/shared/services/user.service';
// import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _auth: AuthService,
        private _user: UserService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._auth.login(this.signInForm.value)
            .subscribe((response: any) => {
                    if (response.status == 'success') {
                        // Set the redirect url.
                        // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                        // to the correct page after a successful sign in. This way, that url can be set via
                        // routing file and we don't have to touch here.
                        let redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || null;
                        this._auth.setToken(response.data.token);
                        this._auth.setUser(JSON.stringify(response.data.profile));
                        this._user.getRole().subscribe((response: any) => {
                            this._user.role = response['result'].role;
                            if (!redirectURL) {
                                if (this._user.role == 'buyer') {
                                    redirectURL = '/stores';
                                } else if (this._user.role == 'admin') {
                                    redirectURL = '/dashboard/analytics';
                                } else {
                                    redirectURL = '/stores';
                                }
                            }
                            this._router.navigateByUrl(redirectURL);
                        })
                    }
                },
                (response) => {
                    // Re-enable the form
                    this.signInForm.enable();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }
}
