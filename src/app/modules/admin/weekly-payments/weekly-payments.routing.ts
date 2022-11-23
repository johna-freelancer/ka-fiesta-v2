import { Route } from '@angular/router';
import { Auth2Guard } from 'app/core/auth/guards/auth2.guard';
import { WeeklyPaymentsComponent } from './weekly-payments.component';
import { WeeklyPaymentsResolver } from './weekly-payments.resolvers';

export const weeklyPaymentRoutes: Route[] = [
    {
        path     : '',
        component: WeeklyPaymentsComponent,
        data: { roles: ['admin'] },
        canActivate: [ Auth2Guard ],
        resolve : {
            data: WeeklyPaymentsResolver
        }
    }
];
