import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-pwa-alert',
  standalone: false,
  templateUrl: './pwa-alert.component.html',
  styleUrl: './pwa-alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PwaAlertComponent {
  protected showInstallPrompt =  signal<boolean>(false);
  protected isMobile = computed(() =>window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  private deferredPrompt: any;

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt.set(true);
    });
  }

  installPWA() {
    this.showInstallPrompt.set(false);
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      this.deferredPrompt = null;
    });
  }

  dismissPrompt() {
    this.showInstallPrompt.set(false);
  }
}
