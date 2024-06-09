import { Qubo } from '../src/qubo';
import { Hamiltonian } from '../src/math';
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

    it('should create a Qubo from a Hamiltonian', () => {
        const hamiltonianMatrix = [
            [1, 2, 3],
            [0, 4, 5],
            [0, 0, 6]
        ];

        const hamiltonian = Hamiltonian.fromList(hamiltonianMatrix);
        const qubo = Qubo.fromHamiltonian(hamiltonian);

        expect(qubo.size).toBe(3);
        expect(qubo.getEntry(0, 0)).toBe(1);
        expect(qubo.getEntry(0, 1)).toBe(2);
        expect(qubo.getEntry(0, 2)).toBe(3);
        expect(qubo.getEntry(1, 1)).toBe(4);
        expect(qubo.getEntry(1, 2)).toBe(5);
        expect(qubo.getEntry(2, 2)).toBe(6);
    });

    it('should not add zero entries from the Hamiltonian', () => {
        const hamiltonianMatrix = [
            [1, 0, 3],
            [0, 4, 0],
            [0, 0, 6]
        ];

        const hamiltonian = Hamiltonian.fromList(hamiltonianMatrix);
        const qubo = Qubo.fromHamiltonian(hamiltonian);

        expect(qubo.size).toBe(3);
        expect(qubo.getEntry(0, 0)).toBe(1);
        expect(qubo.getEntry(0, 1)).toBeUndefined();
        expect(qubo.getEntry(0, 2)).toBe(3);
        expect(qubo.getEntry(1, 1)).toBe(4);
        expect(qubo.getEntry(1, 2)).toBeUndefined();
        expect(qubo.getEntry(2, 2)).toBe(6);
    });

    it('should handle an empty Hamiltonian', () => {
        const hamiltonianMatrix: number[][] = [];

        const hamiltonian = Hamiltonian.fromList(hamiltonianMatrix);
        const qubo = Qubo.fromHamiltonian(hamiltonian);

        expect(qubo.size).toBe(0);
        expect(qubo.getEntry(0, 0)).toBeUndefined();
    });
});
