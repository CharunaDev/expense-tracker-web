import {
  Injectable,
  Inject,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
} from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";

const AUTH_STATE_KEY = makeStateKey<boolean>("authState");

@Injectable({
  providedIn: "root",
})
export class TransferStateService {
  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  setAuthState(isAuthenticated: boolean): void {
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(AUTH_STATE_KEY, isAuthenticated);
    }
  }

  getAuthState(): boolean | null {
    if (isPlatformBrowser(this.platformId)) {
      return this.transferState.get(AUTH_STATE_KEY, null);
    }
    return null;
  }

  removeAuthState(): void {
    this.transferState.remove(AUTH_STATE_KEY);
  }
}
