import { Hamiltonian } from '../src/math';
import { Qubo } from '../src/qubo';
import { IndexOutOfRangeException, DataFormattingException, DataFormatting } from '../src/exceptions';

describe('Hamiltonian', () => {
  it('should create a Hamiltonian instance from a list', () => {
    const list = [
      [0, 1, 2],
      [0, 0, 3],
      [0, 0, 0]
    ];
    const hamiltonian = Hamiltonian.fromList(list);
    expect(hamiltonian.matrix).toEqual(list);
  });

  it('should throw DataFormattingException if list is not square', () => {
    const list = [
      [0, 1],
      [0, 0, 3]
    ];
    expect(() => Hamiltonian.fromList(list)).toThrow(DataFormattingException);
    expect(() => Hamiltonian.fromList(list)).toThrow(new DataFormattingException(DataFormatting.ListNotSquare).message);
  });

  it('should throw DataFormattingException if lower triangle entry is not zero', () => {
    const list = [
      [0, 1, 2],
      [1, 0, 3],
      [0, 0, 0]
    ];
    expect(() => Hamiltonian.fromList(list)).toThrow(DataFormattingException);
    expect(() => Hamiltonian.fromList(list)).toThrow(new DataFormattingException(DataFormatting.LowerTriangleEntryNotZero).message);
  });

  it('should create a Hamiltonian instance from a Qubo', () => {
    const qubo = new Qubo(3);
    qubo.addEntry(0, 1, 1.5);
    qubo.addEntry(0, 2, 2.5);
    qubo.addEntry(1, 2, 3.5);

    const hamiltonian = Hamiltonian.fromQubo(qubo);
    const expectedMatrix = [
      [0, 1.5, 2.5],
      [0, 0, 3.5],
      [0, 0, 0]
    ];
    expect(hamiltonian.matrix).toEqual(expectedMatrix);
  });

  it('should return the correct dimension of the matrix', () => {
    const list = [
      [0, 1],
      [0, 0]
    ];
    const hamiltonian = Hamiltonian.fromList(list);
    expect(hamiltonian.dimension).toBe(2);
  });

  it('should return the correct entry from the matrix', () => {
    const list = [
      [0, 1, 2],
      [0, 0, 3],
      [0, 0, 0]
    ];
    const hamiltonian = Hamiltonian.fromList(list);
    expect(hamiltonian.getEntry(0, 1)).toBe(1);
    expect(hamiltonian.getEntry(1, 2)).toBe(3);
  });

  it('should throw IndexOutOfRangeException if row index is out of range', () => {
    const list = [
      [0, 1],
      [0, 0]
    ];
    const hamiltonian = Hamiltonian.fromList(list);
    expect(() => hamiltonian.getEntry(2, 0)).toThrow(IndexOutOfRangeException);
  });

  it('should throw IndexOutOfRangeException if column index is out of range', () => {
    const list = [
      [0, 1],
      [0, 0]
    ];
    const hamiltonian = Hamiltonian.fromList(list);
    expect(() => hamiltonian.getEntry(0, 2)).toThrow(IndexOutOfRangeException);
  });
});
