import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { ThemeServcie } from '../../core/services/theme.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  private readonly formbuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly themeService = inject(ThemeServcie);

  protected profileForm!: FormGroup;
  protected fontSize = computed(() => this.themeService.currentFontSize());
  protected theme = computed(() => this.themeService.currentTheme());
  protected user = this.authService.user;
  protected isGuest = this.authService.isGuest;

  ngOnInit(): void {
    this.profileForm = this.formbuilder.group({
      nationalCode: [null]
    });

    this.profileForm.patchValue({ nationalCode: this.authService.user()?.nationalCode ?? null });
  }

  protected submit() {
    this.authService.updateUser({ nationalCode: this.profileForm.getRawValue().nationalCode });
    this.toastService.success('ویرایش اطلاعات با موفقیت انجام شد.');
  }

  protected setFontSize(size: 'small' | 'medium' | 'large' | 'xlarge') {
    this.themeService.updateFontSize(size);
  }

  protected setTheme(color: 'blue' | 'green' | 'red') {
    this.themeService.updateTheme(color);
  }
}
