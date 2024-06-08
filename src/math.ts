import { multiply, transpose, matrix, Matrix } from 'mathjs';
import { Qubo } from './qubo';
import {
    IndexOutOfRangeException,
    DataFormattingException,
    DataFormatting,
    InvalidOperationException,
    InvalidOperation
} from './exceptions';

class Hamiltonian {
  private _matrix: Matrix;

  private constructor(matrix: Matrix) {
    this._matrix = matrix;
  }

  static fromList(list: number[][]): Hamiltonian {
    this._checkListFormat(list);

    const matrixInstance = matrix(list);
    return new Hamiltonian(matrixInstance);
  }

  static fromQubo(qubo: Qubo): Hamiltonian {
    const matrixInstance = this._quboToMatrix(qubo);
    return new Hamiltonian(matrixInstance);
  }

  get matrix(): number[][] {
    return this._matrix.toArray() as number[][];
  }

  get dimension(): number {
    return this._matrix.size()[0];
  }

  getEntry(rowIndex: number, columnIndex: number): number {
    if (rowIndex >= this._matrix.size()[0] || rowIndex < 0) {
      throw new IndexOutOfRangeException("rowIndex");
    }
    if (columnIndex >= this._matrix.size()[1] || columnIndex < 0) {
      throw new IndexOutOfRangeException("columnIndex");
    }

    return this._matrix.get([rowIndex, columnIndex]) as number;
  }

  private static _checkListFormat(list: number[][]): void {
    const size = list.length;

    for (let rowIndex = 0; rowIndex < list.length; rowIndex++) {
      const row = list[rowIndex];
      if (row.length !== size) {
        throw new DataFormattingException(DataFormatting.ListNotSquare);
      }
      for (let i = 0; i < rowIndex; i++) {
        if (row[i] !== 0) {
          throw new DataFormattingException(DataFormatting.LowerTriangleEntryNotZero);
        }
      }
    }
  }

  private static _quboToMatrix(qubo: Qubo): Matrix {
    const rows: number[][] = [];

    for (let i = 0; i < qubo.size; i++) {
      const row = new Array(qubo.size).fill(0);
      for (let j = i; j < qubo.size; j++) {
        const entry = qubo.getEntry(i, j);
        if (entry !== undefined) {
          row[j] = entry;
        }
      }
      rows.push(row);
    }

    return matrix(rows);
  }
}

class SolutionVector {
  private _vector: number[];

  private constructor(vector: number[]) {
    this._vector = vector;
  }

  static fromList(list: number[]): SolutionVector {
    this._checkListFormat(list);
    return new SolutionVector(list);
  }

  static filled(length: number, fillValue: number): SolutionVector {
    if (fillValue !== 0 && fillValue !== 1) {
      throw new InvalidOperationException(InvalidOperation.ProvidedValueNotBinary, "fillValue");
    }

    const vector = new Array(length).fill(fillValue);
    return new SolutionVector(vector);
  }

  get vector(): number[] {
    return this._vector.map(entry => Math.round(entry));
  }

  increment(): boolean {
    const current = this.vector;
    let cursor = current.length - 1;

    do {
      current[cursor] = current[cursor] === 0 ? 1 : 0;
      cursor -= 1;
    } while (current[cursor + 1] === 0 && cursor >= 0);

    this._updateVector(current);

    return cursor === -1 && current[0] === 0;
  }

  deepCopy(): SolutionVector {
    return SolutionVector.fromList(this.vector);
  }

  private _updateVector(newList: number[]): void {
    this._vector = newList;
  }

  private static _checkListFormat(list: number[]): void {
    for (const entry of list) {
      if (entry !== 0 && entry !== 1) {
        throw new DataFormattingException(DataFormatting.EntryNotBinary);
      }
    }
  }

  toString(): string {
    let content = "[";
    const list = this.vector;
    let counter = 0;

    for (const qubit of list) {
      content += `q${counter}: ${qubit}, `;
      counter++;
    }

    content += "]";
    return content;
  }
}

class Calculator {
    static energy(hamiltonian: Hamiltonian, solutionVector: SolutionVector): number {
      const q = solutionVector.vector;
      const qMatrix = matrix([q]); // Convert vector to row matrix
      const qMatrixT = transpose(qMatrix); // Transpose to column matrix
      const hMatrix = matrix(hamiltonian.matrix);
  
      const qTH = multiply(qMatrix, hMatrix) as Matrix;
      const qTHq = multiply(qTH, qMatrixT) as Matrix;
  
      return qTHq.get([0, 0]) as number;
    }
  }

export { Hamiltonian, SolutionVector, Calculator };
