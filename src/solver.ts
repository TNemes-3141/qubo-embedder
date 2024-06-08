import { Qubo } from './qubo';
import { SolutionRecord } from './solution_record';

export enum SolverType {
    DwaveSampler = 'dwaveSampler',
    Simulator = 'simulator',
}

export abstract class Solver {
    type: SolverType;

    protected constructor(type: SolverType) {
        this.type = type;
    }

    static simulator(): Simulator {
        return new Simulator();
    }

    abstract sampleQubo(qubo: Qubo, recordLength?: number): Promise<SolutionRecord>;
}

// Import the Simulator class to avoid circular dependencies.
import { Simulator } from './samplers/simulator';
