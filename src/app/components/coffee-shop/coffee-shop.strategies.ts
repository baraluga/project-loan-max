import { numberArrayFromRange } from 'number-array-from-range';
import { DistanceFromSegmentEnds, VacancySegment } from './coffee-shop.models';

export interface AllocationStrategy {
  shouldApply(occupiedTables: number[]): boolean;
  findBest(occupied: number[], lastTable: number): number;
}

class EmptyShopStrategy implements AllocationStrategy {
  shouldApply(occupiedTables: number[]): boolean {
    return occupiedTables.length === 0;
  }

  findBest(): number {
    return 1;
  }
}

class SingleCustomerStrategy implements AllocationStrategy {
  shouldApply(occupiedTables: number[]): boolean {
    return occupiedTables.length === 1;
  }
  findBest(occupied: number[], lastTable: number): number {
    const soleCustomer = occupied[0];
    const distanceFromHead = soleCustomer - 1;
    const distanceFromTail = lastTable - soleCustomer;
    return distanceFromHead >= distanceFromTail ? 1 : lastTable;
  }
}

class MultipleCustomersStrategy implements AllocationStrategy {
  shouldApply(occupiedTables: number[]): boolean {
    return occupiedTables.length > 1;
  }

  findBest(occupied: number[], lastTable: number): number {
    const segments = this.buildSegments(occupied, lastTable);
    const bestSegment = this.findBestSegment(segments);
    console.log(segments, bestSegment);
    return this.findBestTable(bestSegment, lastTable);
  }

  buildSegments(occupiedTables: number[], lastTable: number): VacancySegment[] {
    const FIRST_SEGMENT = [0, occupiedTables[0]];
    const LAST_SEGMENT = [
      occupiedTables[occupiedTables.length - 1],
      lastTable + 1,
    ];

    const segment = [];
    for (let i = 0; i < occupiedTables.length - 1; i++) {
      segment.push([occupiedTables[i], occupiedTables[i + 1]]);
    }
    return [FIRST_SEGMENT, ...segment, LAST_SEGMENT];
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

  private findBestTable(within: VacancySegment, lastTable: number): number {
    const [from, to] = within;
    if (this.isHeadOrTailPartOfBestSegment(within, lastTable)) {
      return lastTable === to - 1 ? lastTable : from + 1;
    }

    const possibleTables = numberArrayFromRange(from + 1, to - 1);
    return possibleTables.find((table) => {
      const distance = this.getDistanceFromSegmentEnds(table, within);
      return this.isDistanceFromSegmentEndsBest(distance);
    });
  }

  private isHeadOrTailPartOfBestSegment(
    segment: VacancySegment,
    tail: number
  ): boolean {
    const headAndTail = [0, tail + 1];
    return (
      segment.some((part) => headAndTail.includes(part)) &&
      !segment.every((part) => headAndTail.includes(part))
    );
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
}

export const AllocationStrategies = [
  new EmptyShopStrategy(),
  new SingleCustomerStrategy(),
  new MultipleCustomersStrategy(),
];
