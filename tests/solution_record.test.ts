import { SolutionRecord, SolutionRecordEntry } from '../src/solution_record';
import { SolutionVector } from '../src/math';
import { InvalidOperationException, InvalidOperation } from '../src/exceptions';

describe('SolutionRecord', () => {
  it('should create a SolutionRecord with given capacity', () => {
    const record = new SolutionRecord(3);
    expect(record.capacity).toBe(3);
  });

  it('should add an entry to the SolutionRecord', () => {
    const record = new SolutionRecord(3);
    const vector = SolutionVector.fromList([1, 0, 1]);
    const isFull = record.addEntry(10.0, vector, 1);
    expect(isFull).toBe(false);
  });

  it('should throw an exception when adding an entry to a full SolutionRecord', () => {
    const record = new SolutionRecord(1);
    const vector = SolutionVector.fromList([1, 0, 1]);
    record.addEntry(10.0, vector, 1);
    expect(() => record.addEntry(10.0, vector, 1)).toThrow(InvalidOperationException);
    expect(() => record.addEntry(10.0, vector, 1)).toThrow(new InvalidOperationException(InvalidOperation.RecordIsFull).message);
  });

  it('should add multiple entries to the SolutionRecord', () => {
    const record = new SolutionRecord(3);
    const vector1 = SolutionVector.fromList([1, 0, 1]);
    const vector2 = SolutionVector.fromList([0, 1, 0]);
    const entries = [
      new SolutionRecordEntry(10.0, vector1, 1),
      new SolutionRecordEntry(12.0, vector2, 2)
    ];
    const isFull = record.addAllEntries(entries);
    expect(isFull).toBe(false);
  });

  it('should throw an exception when adding multiple entries exceeding capacity', () => {
    const record = new SolutionRecord(2);
    const vector1 = SolutionVector.fromList([1, 0, 1]);
    const vector2 = SolutionVector.fromList([0, 1, 0]);
    const entries = [
      new SolutionRecordEntry(10.0, vector1, 1),
      new SolutionRecordEntry(12.0, vector2, 2)
    ];
    record.addEntry(8.0, vector1, 1);
    expect(() => record.addAllEntries(entries)).toThrow(InvalidOperationException);
    expect(() => record.addAllEntries(entries)).toThrow(new InvalidOperationException(InvalidOperation.RecordHasNotEnoughCapacity).message);
  });

  it('should return entries as an iterable', () => {
    const record = new SolutionRecord(3);
    const vector = SolutionVector.fromList([1, 0, 1]);
    record.addEntry(10.0, vector, 1);
    record.addEntry(12.0, vector, 2);

    const entries = Array.from(record.entries());
    expect(entries.length).toBe(2);
    expect(entries[0].energy).toBe(10.0);
    expect(entries[1].numOccurrences).toBe(2);
  });

  it('should return a string representation of the SolutionRecord', () => {
    const record = new SolutionRecord(3);
    const vector = SolutionVector.fromList([1, 0, 1]);
    record.addEntry(10.0, vector, 1);
    const expectedString = "   energy\tsample\toccurrences\n(1) 10\t[q0: 1, q1: 0, q2: 1, ]\tx1\n";
    expect(record.toString()).toBe(expectedString);
  });
});
