import { skip, take } from 'rxjs/operators';
import { CoffeeShopComponent } from './coffee-shop.component';

describe('CoffeeShopComponent', () => {
  let component: CoffeeShopComponent;

  beforeEach(() => {
    component = new CoffeeShopComponent();
    component.ngOnInit();
  });

  it('should assign the next best table...', (done) => {
    component.occupiedTables$.pipe(skip(5), take(1)).subscribe((occupied) => {
      expect(occupied).toEqual([1, 3, 5, 7, 10]);
      done();
    });
    component.onAssign();
    component.onAssign();
    component.onAssign();
    component.onAssign();
    component.onAssign();
  });

  it('should vacate the table flawlessly', (done) => {
    component.occupiedTables$.pipe(skip(5), take(1)).subscribe((occupied) => {
      expect(occupied).toEqual([1, 5, 10]);
      done();
    });
    component.onAssign();
    component.onAssign();
    component.onAssign();
    component.onVacate(10);
    component.onAssign();
  });
});
