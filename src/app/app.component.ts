import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  find2ndMax(numbersInString: string[]): string {
    const uniqueized = Array.from(new Set(numbersInString));
    const sorted = uniqueized.reverse();
    const toBeReturned = sorted.length > 1 ? sorted[sorted.length - 2] : -1;
    return toBeReturned.toString();
  }
}
