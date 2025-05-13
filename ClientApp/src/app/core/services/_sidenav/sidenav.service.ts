import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SidenavService {
  private itemClickedSubject = new Subject<void>();

  // Observable to emit when a sidenav item is clicked
  itemClicked$ = this.itemClickedSubject.asObservable();

  // Method to call when a sidenav item is clicked
  notifyItemClicked() {
    this.itemClickedSubject.next();
  }
}
