import { SolutionVector } from '../src/math';
import { DataFormattingException, InvalidOperationException, InvalidOperation, DataFormatting } from '../src/exceptions';

describe('SolutionVector', () => {
  it('should create a SolutionVector instance from a list', () => {
    const list = [0, 1, 0];
    const solutionVector = SolutionVector.fromList(list);
    expect(solutionVector.vector).toEqual(list);
  });

  it('should throw DataFormattingException if list contains non-binary entries', () => {
    const list = [0, 2, 1];
    expect(() => SolutionVector.fromList(list)).toThrow(DataFormattingException);
    expect(() => SolutionVector.fromList(list)).toThrow(new DataFormattingException(DataFormatting.EntryNotBinary).message);
  });

  it('should create a SolutionVector instance with filled values', () => {
    const length = 3;
    const fillValue = 1;
    const solutionVector = SolutionVector.filled(length, fillValue);
    expect(solutionVector.vector).toEqual([1, 1, 1]);
  });

  it('should throw InvalidOperationException if fillValue is not binary', () => {
    expect(() => SolutionVector.filled(3, 2)).toThrow(InvalidOperationException);
    expect(() => SolutionVector.filled(3, 2)).toThrow(new InvalidOperationException(InvalidOperation.ProvidedValueNotBinary, "fillValue").message);
  });

  it('should increment the SolutionVector correctly', () => {
    const solutionVector = SolutionVector.fromList([0, 0, 0]);
    expect(solutionVector.increment()).toBe(false);
    expect(solutionVector.vector).toEqual([0, 0, 1]);

    expect(solutionVector.increment()).toBe(false);
    expect(solutionVector.vector).toEqual([0, 1, 0]);

    expect(solutionVector.increment()).toBe(false);
    expect(solutionVector.vector).toEqual([0, 1, 1]);

    expect(solutionVector.increment()).toBe(false);
    expect(solutionVector.vector).toEqual([1, 0, 0]);

    expect(solutionVector.increment()).toBe(false);
    expect(solutionVector.vector).toEqual([1, 0, 1]);

    expect(solutionVector.increment()).toBe(false);
    expect(solutionVector.vector).toEqual([1, 1, 0]);

    expect(solutionVector.increment()).toBe(false);
    expect(solutionVector.vector).toEqual([1, 1, 1]);

    expect(solutionVector.increment()).toBe(true);
    expect(solutionVector.vector).toEqual([0, 0, 0]);
  });

  it('should create a deep copy of the SolutionVector', () => {
    const solutionVector = SolutionVector.fromList([1, 0, 1]);
    const copy = solutionVector.deepCopy();
    expect(copy.vector).toEqual(solutionVector.vector);
    expect(copy).not.toBe(solutionVector);
  });

  it('should return a string representation of the SolutionVector', () => {
    const solutionVector = SolutionVector.fromList([1, 0, 1]);
    expect(solutionVector.toString()).toBe("[q0: 1, q1: 0, q2: 1, ]");
  });
});
