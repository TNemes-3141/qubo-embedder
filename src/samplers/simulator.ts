import { Solver, SolverType } from '../solver';
import { Qubo } from '../qubo';
import { SolutionRecord } from '../solution_record';
import { Hamiltonian, SolutionVector, Calculator } from '../math';
import { InvalidOperationException, InvalidOperation } from '../exceptions';

export class Simulator extends Solver {
    constructor() {
        super(SolverType.Simulator);
    }

    async sampleQubo(qubo: Qubo, recordLength?: number): Promise<SolutionRecord> {
        const combinations = Math.pow(2, qubo.size);
        recordLength = recordLength ?? combinations;

        if (recordLength > combinations) {
            throw new InvalidOperationException(InvalidOperation.RecordLengthLargerThanPossibleCombinations);
        }

        const hamiltonian = Hamiltonian.fromQubo(qubo);

        const orderedSolutions = new Map<number, SolutionVector>();
        let solutionVector = SolutionVector.filled(hamiltonian.dimension, 0);
        let terminate = false;

        while (!terminate) {
            const energy = Calculator.energy(hamiltonian, solutionVector);
            if (!orderedSolutions.has(energy)) {
                orderedSolutions.set(energy, solutionVector.deepCopy());
            }

            terminate = solutionVector.increment();
        }

        // Convert map to sorted array based on energy
        const sortedSolutions = Array.from(orderedSolutions.entries()).sort((a, b) => a[0] - b[0]);

        const record = new SolutionRecord(recordLength);

        for (const [energy, vector] of sortedSolutions) {
            const full = record.addEntry(energy, vector, 1);
            if (full) break;
        }

        return record;
    }
}
