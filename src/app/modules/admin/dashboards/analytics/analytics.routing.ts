import { Route } from '@angular/router';
import { Auth2Guard } from 'app/core/auth/guards/auth2.guard';
import { AnalyticsComponent } from 'app/modules/admin/dashboards/analytics/analytics.component';
import { AnalyticsResolver } from 'app/modules/admin/dashboards/analytics/analytics.resolvers';

export const analyticsRoutes: Route[] = [
    {
        path     : '',
        component: AnalyticsComponent,
        data: { roles: ['admin'] },
        canActivate: [ Auth2Guard ],
        resolve  : {
            data: AnalyticsResolver
        }
    }
];
