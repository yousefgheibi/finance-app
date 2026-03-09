import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IUserDto } from '../models/user.model';
import { GlobalConfig } from '../config/global-config';
import { map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private api = GlobalConfig.apiUrl + '/users';

    private _user = signal<IUserDto | null>(null);
    user = this._user.asReadonly();

    private _isLoggedIn = signal(false);
    isLoggedIn = this._isLoggedIn.asReadonly();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.initAuth();
    }

    private initAuth() {
        const user = localStorage.getItem('user');

        if (!user) {
            this._isLoggedIn.set(false);
            return;
        }

        const parsedUser: IUserDto = JSON.parse(user);

        this._user.set(parsedUser);
        this._isLoggedIn.set(true);
    }

    login(data: { phoneNumber: string; password: string }) {
        return this.http
            .get<IUserDto[]>(`${this.api}?phoneNumber=${data.phoneNumber}&password=${data.password}`)
            .pipe(
                map(users => {
                    if (!users.length) {
                        throw new Error('User not found');
                    }

                    const user = users[0];

                    localStorage.setItem('user', JSON.stringify(user));

                    this._user.set(user);
                    this._isLoggedIn.set(true);

                    return user;
                })
            );
    }

    signUp(data: IUserDto) {
        return this.http.post<IUserDto>(this.api, data).pipe(
            tap(user => {
                localStorage.setItem('user', JSON.stringify(user));

                this._user.set(user);
                this._isLoggedIn.set(true);
            })
        );
    }

    logout() {
        localStorage.removeItem('user');

        this._user.set(null);
        this._isLoggedIn.set(false);

        this.router.navigate(['/login']);
    }
}