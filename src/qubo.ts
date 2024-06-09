import { Tuple } from './types';
import { Hamiltonian } from './math';
import { InvalidOperationException, IndexOutOfRangeException, InvalidOperation } from './exceptions';

class Qubo {
  size: number;
  private _qubo: Map<string, number>;

  constructor(size: number) {
    this.size = size;
    this._qubo = new Map<string, number>();
  }

  static fromHamiltonian(hamiltonian: Hamiltonian): Qubo {
    const matrix = hamiltonian.matrix;
    const qubo = new Qubo(hamiltonian.dimension);

    for (let i = 0; i < matrix.length; i++) {
      for (let j = i; j < matrix[i].length; j++) {
        const element = matrix[i][j];
        if (element !== 0) {
          qubo.addEntry(i, j, element);
        }
      }
    }

    return qubo;
  }

  addEntry(variableIndex: number, variablePairIndex: number, value: number): void {
    if (variableIndex >= this.size) throw new IndexOutOfRangeException('variableIndex');
    if (variablePairIndex >= this.size) throw new IndexOutOfRangeException('variablePairIndex');
    if (variablePairIndex < variableIndex) throw new InvalidOperationException(InvalidOperation.PairVariableSmallerThanPrimaryVariable);

    const key = Tuple.toKey(variableIndex, variablePairIndex);
    this._qubo.set(key, value);
  }

  getEntry(variableIndex: number, variablePairIndex: number): number | undefined {
    const key = Tuple.toKey(variableIndex, variablePairIndex);
    return this._qubo.get(key);
  }

  toString(): string {
    let content = `[qubits: ${this.size}] {`;
    this._qubo.forEach((value, key) => {
      content += `(${key}): ${value}, `;
    });
    content += '}';
    return content;
  }
}

export { Qubo };
