import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import randomInteger from 'random-int';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private outputSubject = new BehaviorSubject<string>('');
  inputControl = new FormControl('', [Validators.pattern('^[-,0-9 ]+$')]);
  output$ = this.outputSubject.asObservable();

  ngOnInit(): void {}

  find2ndMax(numbersInString: string[]): string {
    const uniqueized = Array.from(new Set(numbersInString));
    const sorted = uniqueized.sort();
    const toBeReturned = sorted.length > 1 ? sorted[sorted.length - 2] : -1;
    console.log({ uniqueized, sorted, toBeReturned });
    return toBeReturned.toString();
  }

  onRandomize(): void {
    const randomNumbers = this.conjureRandomNumbers();
    const valueToBePatched = randomNumbers.join(', ');
    this.inputControl.patchValue(valueToBePatched);
  }

  onConfirm(): void {
    const arrayizedInput = String(this.inputControl.value).split(',');
    const sanitized = arrayizedInput.map((element) => element.trim());
    const determinedOutput = this.find2ndMax(sanitized);
    this.outputSubject.next(determinedOutput);
  }

  private conjureRandomNumbers(): number[] {
    const FLOOR_CEIL = Math.pow(2, 10);
    return [...Array(10).keys()].map(() =>
      randomInteger(-FLOOR_CEIL, FLOOR_CEIL)
    );
  }
}
