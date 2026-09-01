import { Injectable, signal } from '@angular/core';
import { IUserDto } from '../models/user.model';

declare global {
    interface Window {
        Telegram?: any;
    }
}

/**
 * Handles authentication for the app.
 *
 * The app is meant to run as a Telegram Mini App, so there is no login form:
 * as soon as it loads inside Telegram, the user's Telegram profile
 * (id, name, username, avatar) is read from the Telegram Web App SDK and
 * used automatically. No backend call is made.
 *
 * If the app is opened outside of Telegram (e.g. directly in a normal
 * browser for testing), it falls back to a local "guest" mode so the UI
 * still works.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly userStorageKey = 'telegram_user';

    private _user = signal<IUserDto | null>(null);
    user = this._user.asReadonly();

    /** true when the Telegram user could not be detected (opened outside Telegram) */
    private _isGuest = signal(false);
    isGuest = this._isGuest.asReadonly();

    /** true once auth initialization has finished (Telegram check done) */
    private _isReady = signal(false);
    isReady = this._isReady.asReadonly();

    constructor() {
        this.initAuth();
    }

    private initAuth() {
        const telegramUser = this.getTelegramWebApp()?.initDataUnsafe?.user;

        if (telegramUser) {
            this.getTelegramWebApp()?.ready?.();
            this.getTelegramWebApp()?.expand?.();

            const previouslySaved = this.getStoredUser();

            const user: IUserDto = {
                telegramId: telegramUser.id,
                firstName: telegramUser.first_name ?? '',
                lastName: telegramUser.last_name ?? '',
                username: telegramUser.username ?? '',
                photoUrl: telegramUser.photo_url ?? '',
                // locally-entered fields (e.g. nationalCode) are preserved across sessions
                nationalCode: previouslySaved?.nationalCode
            };

            this.persistUser(user);

            this._user.set(user);
            this._isGuest.set(false);
            this._isReady.set(true);
            return;
        }

        // Not running inside Telegram: fall back to guest mode so the app is still usable (e.g. local testing)
        const guestUser = this.getStoredUser();

        this._user.set(guestUser);
        this._isGuest.set(true);
        this._isReady.set(true);
    }

    /** Update locally-editable profile fields (e.g. nationalCode). Persisted only on this device. */
    updateUser(data: Partial<IUserDto>): IUserDto {
        const currentUser = this._user() ?? ({} as IUserDto);
        const updatedUser: IUserDto = { ...currentUser, ...data };

        this.persistUser(updatedUser);
        this._user.set(updatedUser);

        return updatedUser;
    }

    private getTelegramWebApp() {
        return window.Telegram?.WebApp;
    }

    private getStoredUser(): IUserDto | null {
        const raw = localStorage.getItem(this.userStorageKey);
        return raw ? JSON.parse(raw) : null;
    }

    private persistUser(user: IUserDto) {
        localStorage.setItem(this.userStorageKey, JSON.stringify(user));
    }
}
