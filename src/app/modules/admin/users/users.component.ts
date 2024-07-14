import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { Pagination } from 'app/shared/interfaces/pagination';
import { User } from 'app/shared/interfaces/user';
import { Observable } from 'rxjs';
import { UsersService } from './core/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  users$: Observable<User[]>;
  isLoading$: Observable<boolean>;
  pagination$:  Observable<Pagination>;


  selectedUser: User | undefined;

  constructor(private _userService: UsersService) {
    this.users$ = this._userService.users$;
    this.pagination$ = this._userService.pagination$;
  }

  ngOnInit(): void {
    this._userService.getUsers().subscribe();
  }

  toggleDetails(user: User) {

  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }
}
