import { Calculator, Hamiltonian, SolutionVector } from '../src/math';

describe('Calculator', () => {
  it('should calculate the correct energy', () => {
    const hMatrix = [
      [1, 2, 3],
      [0, 4, 5],
      [0, 0, 6]
    ];
    const hamiltonian = Hamiltonian.fromList(hMatrix);
    const solutionVector = SolutionVector.fromList([1, 0, 1]);

    const energy = Calculator.energy(hamiltonian, solutionVector);
    expect(energy).toBe(10); // Expected energy calculation based on the formula
  });

  it('should calculate the correct energy for a different vector', () => {
    const hMatrix = [
      [1, 2],
      [0, 3]
    ];
    const hamiltonian = Hamiltonian.fromList(hMatrix);
    const solutionVector = SolutionVector.fromList([1, 1]);

    const energy = Calculator.energy(hamiltonian, solutionVector);
    expect(energy).toBe(6); // Expected energy calculation based on the formula
  });

  it('should handle zero energy calculation', () => {
    const hMatrix = [
      [0, 0],
      [0, 0]
    ];
    const hamiltonian = Hamiltonian.fromList(hMatrix);
    const solutionVector = SolutionVector.fromList([0, 0]);

    const energy = Calculator.energy(hamiltonian, solutionVector);
    expect(energy).toBe(0); // Expected energy calculation based on the formula
  });
});
