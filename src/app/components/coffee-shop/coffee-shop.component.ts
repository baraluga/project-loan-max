import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ShopOccupancy } from './coffee-shop.models';
import {
  AllocationStrategies,
  AllocationStrategy,
} from './coffee-shop.strategies';

@Component({
  selector: 'app-coffee-shop',
  templateUrl: './coffee-shop.component.html',
  styleUrls: ['./coffee-shop.component.scss'],
})
export class CoffeeShopComponent implements OnInit {
  readonly NO_OF_TABLES_SERVING = 10;
  private shopOccupancy = new BehaviorSubject<ShopOccupancy>(
    this.initializeShopOccupancyLayout()
  );

  occupiedTables$: Observable<number[]>;

  constructor() {}

  ngOnInit(): void {
    this.occupiedTables$ = this.getOccupiedTables$();
  }

  onAssign(): void {
    this.getBestTable$()
      .pipe(take(1))
      .subscribe((best) =>
        this.shopOccupancy.next({ ...this.shopOccupancy.value, [best]: '*' })
      );
  }

  onVacate(tableNumber: number): void {
    this.shopOccupancy.next({ ...this.shopOccupancy.value, [tableNumber]: '' });
  }

  private getOccupiedTables$(): Observable<number[]> {
    return this.shopOccupancy.pipe(
      map((occupancy) => Object.entries(occupancy)),
      map((tables) => tables.filter(([_, occupancy]) => !!occupancy)),
      map((vacantTables) => vacantTables.map(([table, _]) => Number(table)))
    );
  }

  private getBestTable$(): Observable<number> {
    return this.getOccupiedTables$().pipe(
      map((occupied) =>
        this.findBestStrategy(occupied).findBest(
          occupied,
          this.NO_OF_TABLES_SERVING
        )
      )
    );
  }

  private findBestStrategy(occupied: number[]): AllocationStrategy {
    return AllocationStrategies.find((strategy) =>
      strategy.shouldApply(occupied)
    );
  }

  private initializeShopOccupancyLayout(): ShopOccupancy {
    return new Array(this.NO_OF_TABLES_SERVING).reduce((acc, _, idx) => {
      acc[idx] = '';
      return acc;
    }, {});
  }
}
