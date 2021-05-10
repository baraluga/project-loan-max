import { Component, OnInit } from '@angular/core';
import { numberArrayFromRange } from 'number-array-from-range';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

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
    return this.getBestSegment$().pipe(
      map((segment) => this.findBestTable(segment))
    );
  }

  private findBestTable(within: VacancySegment): number {
    const [from, to] = within;
    const possibleTables = numberArrayFromRange(from + 1, to - 1);
    return possibleTables.find((table) => {
      const distance = this.getDistanceFromSegmentEnds(table, within);
      return this.isDistanceFromSegmentEndsBest(distance);
    });
  }

  private isDistanceFromSegmentEndsBest(
    distance: DistanceFromSegmentEnds
  ): boolean {
    const [fromHead, fromTail] = distance;
    return Math.abs(fromHead - fromTail) <= 1;
  }

  private getDistanceFromSegmentEnds(
    reference: number,
    segmentEnds: VacancySegment
  ): DistanceFromSegmentEnds {
    const [head, tail] = segmentEnds;
    return [reference - head, tail - reference];
  }

  private getBestSegment$(): Observable<VacancySegment> {
    return this.getVacancySegments$().pipe(
      map((segments) => this.findBestSegment(segments))
    );
  }

  private findBestSegment(segments: VacancySegment[]): VacancySegment {
    return segments.reduce(
      (best, segment) => this.resolveBetterSegment(best, segment),
      segments[0]
    );
  }

  private resolveBetterSegment(
    first: VacancySegment,
    second: VacancySegment
  ): VacancySegment {
    return this.getSegmentLength(first) >= this.getSegmentLength(second)
      ? first
      : second;
  }

  private getSegmentLength(segment: VacancySegment): number {
    return segment[1] - segment[0];
  }

  private getVacancySegments$(): Observable<VacancySegment[]> {
    return this.getOccupiedTables$().pipe(
      map((tables) => this.buildSegments(tables))
    );
  }

  private buildSegments(from: number[]): VacancySegment[] {
    const segment = [];
    for (let i = 0; i < from.length - 1; i++) {
      segment.push([from[i], from[i + 1]]);
    }
    return segment;
  }
  private initializeShopOccupancyLayout(): ShopOccupancy {
    return new Array(this.NO_OF_TABLES_SERVING).reduce((acc, _, idx) => {
      acc[idx] = '';
      return acc;
    }, {});
    // return {
    //   1: '*',
    //   2: '',
    //   3: '',
    //   4: '',
    //   5: '*',
    //   6: '',
    //   7: '',
    //   8: '',
    //   9: '',
    //   10: '*',
    // };
  }
}

type ShopOccupancy = { [tableNumber: number]: string };
type VacancySegment = [number, number];
type DistanceFromSegmentEnds = [number, number];
