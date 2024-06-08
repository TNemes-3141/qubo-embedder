import { Simulator } from '../../src/samplers/simulator';
import { Qubo } from '../../src/qubo';
import { InvalidOperationException, InvalidOperation } from '../../src/exceptions';

describe('Simulator', () => {
  it('should sample a QUBO problem correctly', async () => {
    const qubo = new Qubo(3);
    qubo.addEntry(0, 1, 1);
    qubo.addEntry(1, 2, 1);
    qubo.addEntry(0, 2, 1);

    const simulator = new Simulator();
    const record = await simulator.sampleQubo(qubo, 8);

    const entries = Array.from(record.entries());
    expect(entries.length).toBeLessThanOrEqual(8);

    // Check if entries are sorted by energy
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i - 1].energy).toBeLessThanOrEqual(entries[i].energy);
    }
  });

  it('should throw an error if record length is larger than possible combinations', async () => {
    const qubo = new Qubo(3);
    const simulator = new Simulator();

    await expect(simulator.sampleQubo(qubo, 10)).rejects.toThrow(InvalidOperationException);
    await expect(simulator.sampleQubo(qubo, 10)).rejects.toThrow(new InvalidOperationException(InvalidOperation.RecordLengthLargerThanPossibleCombinations).message);
  });

  it('should only store one solution per unique energy value', async () => {
    const qubo = new Qubo(2);
    qubo.addEntry(0, 1, 1);

    const simulator = new Simulator();
    const record = await simulator.sampleQubo(qubo);

    const entries = Array.from(record.entries());
    const uniqueEnergies = new Set(entries.map(entry => entry.energy));

    expect(uniqueEnergies.size).toBe(entries.length);
  });
});
