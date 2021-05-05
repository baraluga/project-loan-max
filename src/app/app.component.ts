import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import randomInteger from 'random-int';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private outputSubject = new BehaviorSubject<string>('');
  inputControl = new FormControl('', [Validators.pattern('^[-,0-9 ]+$')]);
  output$ = this.outputSubject.asObservable();

  find2ndMax(numbersInString: string[]): string {
    const uniqueized = Array.from(new Set(numbersInString));
    const toBeReturned =
      uniqueized.length > 1 ? this.performFindingAlgorithm(uniqueized) : -1;
    return toBeReturned.toString();
  }

  private performFindingAlgorithm(input: string[]): BigInt {
    const biggies = input.map((alleged) => BigInt(alleged));
    const trueMax = this.reduceToTrueMax(biggies);
    const trueMaxExcluded = biggies.filter((biggy) => biggy !== trueMax);
    const secondMax = this.reduceTo2ndMax(trueMaxExcluded, trueMax);
    return secondMax;
  }

  private reduceTo2ndMax(fromThis: BigInt[], trueMax: BigInt): BigInt {
    return fromThis.reduce((secondMax, curr) => {
      secondMax = secondMax
        ? this.is2ndMaxCandidate(secondMax, curr, trueMax)
          ? curr
          : secondMax
        : curr;
      return secondMax;
    }, undefined);
  }

  private is2ndMaxCandidate(
    current: BigInt,
    prospect: BigInt,
    trueMax: BigInt
  ): boolean {
    return current < prospect && prospect < trueMax;
  }

  private reduceToTrueMax(fromThis: BigInt[]): BigInt {
    return fromThis.reduce(
      (trueMax, curr) => this.resolveTheMax(trueMax, curr),
      BigInt(0)
    );
  }

  private resolveTheMax(current: BigInt, suspect: BigInt): BigInt {
    return current > suspect ? current : suspect;
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
