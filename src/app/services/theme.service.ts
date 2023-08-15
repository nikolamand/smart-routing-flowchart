import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkThemeValue = false;

  toggleDarkTheme(value: boolean) {
    this.darkThemeValue = value;
    this.updateBodyClassAttribute();
  }

  private updateBodyClassAttribute() {
    if (this.darkThemeValue) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
