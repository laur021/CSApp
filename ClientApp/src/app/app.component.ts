import { RouterOutlet } from "@angular/router";
import {
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { InputNumberModule } from "primeng/inputnumber";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { PasswordModule } from "primeng/password";
import { ThemeService } from "./core/services/_theme/theme.service";
import { AccountService } from "./core/services/account/account.service";
import { ToastModule } from "primeng/toast";
import { NetworkService } from "./core/services/network/network.service";
import { FooterComponent } from "./shared/components/footer/footer.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
    InputNumberModule,
    FormsModule,
    CardModule,
    ButtonModule,
    PasswordModule,
    ToastModule,
    FooterComponent
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  themeService = inject(ThemeService);
  accountService = inject(AccountService);
  networkService = inject(NetworkService);

  ngOnInit(): void {
    // Load user from local storage on app initialization
    this.accountService.loadUserFromLocalStorage();

    // Optionally refresh user details from API
    this.refreshUserDetails();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  private refreshUserDetails() {
    this.accountService.getCurrentUser().subscribe({
      next: (user) => {
        // Update the service and local storage with fresh user details
        this.accountService.setCurrentUser(user);
      },
      error: (err) => {
        console.error("Failed to fetch user details:", err);
        this.accountService.setCurrentUser(null); // Clear user if fetching fails
      },
    });
  }
}
