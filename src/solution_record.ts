import { SolutionVector } from './math';
import { InvalidOperationException, InvalidOperation } from './exceptions';

class SolutionRecordEntry {
  energy: number;
  solutionVector: SolutionVector;
  numOccurrences: number;

  constructor(energy: number, solutionVector: SolutionVector, numOccurrences: number) {
    this.energy = energy;
    this.solutionVector = solutionVector;
    this.numOccurrences = numOccurrences;
  }

  toString(): string {
    return `${this.energy}\t${this.solutionVector}\tx${this.numOccurrences}`;
  }
}

class SolutionRecord {
  capacity: number;
  private _entries: SolutionRecordEntry[];

  constructor(capacity: number) {
    this.capacity = capacity;
    this._entries = [];
  }

  addEntry(energy: number, solutionVector: SolutionVector, numOccurrences: number): boolean {
    if (this._entries.length === this.capacity) {
      throw new InvalidOperationException(InvalidOperation.RecordIsFull);
    }

    this._entries.push(new SolutionRecordEntry(energy, solutionVector, numOccurrences));

    return this._entries.length === this.capacity;
  }

  addAllEntries(entries: SolutionRecordEntry[]): boolean {
    if (this._entries.length > this.capacity - entries.length) {
      throw new InvalidOperationException(InvalidOperation.RecordHasNotEnoughCapacity);
    }

    this._entries.push(...entries);

    return this._entries.length === this.capacity;
  }

  *entries(): IterableIterator<SolutionRecordEntry> {
    for (const entry of this._entries) {
      yield entry;
    }
  }

  toString(): string {
    let content = "   energy\tsample\toccurrences\n";
    let counter = 1;

    for (const entry of this._entries) {
      content += `(${counter}) ${entry}\n`;
      counter++;
    }

    return content;
  }
}

export { SolutionRecord, SolutionRecordEntry };
