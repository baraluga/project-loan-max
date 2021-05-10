import { skip, take } from 'rxjs/operators';
import { CoffeeShopComponent } from './coffee-shop.component';

describe('CoffeeShopComponent', () => {
  let component: CoffeeShopComponent;

  beforeEach(() => {
    component = new CoffeeShopComponent();
    component.ngOnInit();
  });

  it('should assign the next best table...', (done) => {
    component.occupiedTables$.pipe(skip(1), take(1)).subscribe((occupied) => {
      expect(occupied).toEqual([1, 5, 7, 10]);
      done();
    });
    component.onAssign();
  });
});
