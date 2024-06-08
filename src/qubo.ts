import { Tuple } from './types';
import { InvalidOperationException, IndexOutOfRangeException, InvalidOperation } from './exceptions';

class Qubo {
  size: number;
  private _qubo: Map<string, number>;

  constructor(size: number) {
    this.size = size;
    this._qubo = new Map<string, number>();
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
