import { skip, take } from 'rxjs/operators';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent();
  });

  describe('given a list of numerical strings, it should give you the 2nd unique max...', () => {
    it('with [3, -2], it should return -2', () => {
      expect(component.find2ndMax(['3', '-2'])).toEqual('-2');
    });

    it('with [5, 5, 4, 2], it should return 4', () => {
      expect(component.find2ndMax(['5', '5', '4', '2'])).toEqual('4');
    });

    it('with [4, 4, 4], it should return -1', () => {
      expect(component.find2ndMax(['4', '4', '4'])).toEqual('-1');
    });

    it('with [], it should return -1', () => {
      expect(component.find2ndMax([])).toEqual('-1');
    });

    it('with [-2, 3], it should return -2', () => {
      expect(component.find2ndMax(['-2', '3'])).toEqual('-2');
    });

    it('with [1, 1, 1, 1, 1, 2], it should return 1', () => {
      expect(component.find2ndMax(['1', '1', '1', '1', '1', '2'])).toEqual('1');
    });

    it('with [1, 12, 3, 98, 14], it should return 14', () => {
      expect(component.find2ndMax(['1', '12', '3', '98', '14'])).toEqual('14');
    });

    it('with absurd length of inputs, it should return the correct one', () => {
      // tslint:disable-next-line
      const ABSURD_ONE =
        '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const ABSURD_TWO =
        '100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001';
      expect(component.find2ndMax([ABSURD_ONE, ABSURD_TWO])).toEqual(
        String(ABSURD_ONE)
      );
    });
  });

  it('should randomize the values of the input control', (done) => {
    component.inputControl.valueChanges.pipe(take(1)).subscribe((value) => {
      const inArray = String(value).split(',');
      expect(inArray.length).toEqual(10);
      done();
    });
    component.onRandomize();
  });

  it('should find the 2nd max on confirm click', (done) => {
    component.output$.pipe(skip(1), take(1)).subscribe((output) => {
      expect(output).toEqual('2');
      done();
    });
    component.inputControl.patchValue('1, 2, 3');
    component.onConfirm();
  });
});
