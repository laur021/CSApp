import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  isDarkTheme = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.loadThemeFromLocalStorage();
    this.updateThemeClass();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem("theme", this.isDarkTheme ? "dark" : "light");
    this.updateThemeClass();
  }

  getTheme(): boolean {
    return this.isDarkTheme;
  }

  private loadThemeFromLocalStorage(): void {
    const savedTheme = localStorage.getItem("theme");
    this.isDarkTheme = savedTheme ? savedTheme === "dark" : true;
  }

  private updateThemeClass(): void {
    const htmlElement = this.document.documentElement;

    if (this.isDarkTheme) {
      htmlElement.classList.add("p-app-dark");
    } else {
      htmlElement.classList.remove("p-app-dark");
    }
  }
}
