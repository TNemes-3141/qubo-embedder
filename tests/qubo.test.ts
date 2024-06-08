import { Qubo } from '../src/qubo';
import { IndexOutOfRangeException, InvalidOperationException, InvalidOperation } from '../src/exceptions';

describe('Qubo', () => {
    it('should create a Qubo instance with the given size', () => {
        const qubo = new Qubo(5);
        expect(qubo.size).toBe(5);
    });

    it('should add an entry to the Qubo', () => {
        const qubo = new Qubo(5);
        qubo.addEntry(0, 1, 2.5);
        expect(qubo.getEntry(0, 1)).toBe(2.5);
    });

    it('should throw IndexOutOfRangeException if variable index is out of range', () => {
        const qubo = new Qubo(5);
        expect(() => qubo.addEntry(5, 0, 1)).toThrow(IndexOutOfRangeException);
    });

    it('should throw InvalidOperationException if variable pair index is smaller than variable index', () => {
        const qubo = new Qubo(5);
        expect(() => qubo.addEntry(1, 0, 1)).toThrow(InvalidOperationException);
        expect(() => qubo.addEntry(1, 0, 1)).toThrowError(new InvalidOperationException(InvalidOperation.PairVariableSmallerThanPrimaryVariable).message);
    });

    it('should return undefined for non-existent entries', () => {
        const qubo = new Qubo(5);
        expect(qubo.getEntry(0, 1)).toBeUndefined();
    });

    it('should return a string representation of the Qubo instance', () => {
        const qubo = new Qubo(5);
        qubo.addEntry(0, 1, 2.5);
        expect(qubo.toString()).toContain('[qubits: 5] {(0,1): 2.5, }');
    });
});
