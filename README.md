<div align="center">
    <a href="#">
        <img alt="version" src="https://img.shields.io/static/v1.svg?label=Version&message=1.0.0&color=389ad5&labelColor=31c4f3&style=for-the-badge" />
    </a>
    <a href="#">
        <img alt="open source" src="https://img.shields.io/static/v1.svg?label=Open&message=Source&color=46a4b8&labelColor=3ac1d0&style=for-the-badge" />
    </a>
    <a href="#">
        <img alt="license" src="https://img.shields.io/static/v1.svg?label=License&message=ISC&color=ae68cc&labelColor=6e4a7e&style=for-the-badge" />
    </a>
    <a href="#">
        <img alt="code size" src="https://img.shields.io/github/languages/code-size/Totemi1324/qubo-embedder?label=Code%20size&style=for-the-badge" />
    </a>
    <a href="#">
        <img alt="issues" src="https://img.shields.io/github/issues/Totemi1324/qubo-embedder?label=Issues&style=for-the-badge" />
    </a>

<p><br></p>

**An unofficial library to embed and send optimization (QUBO, Ising) problems to DWave System quantum annealing solvers.** A native Dart equivalent to the [Ocean SDK][dwave_ocean_ref].

</div>

<details>
<summary>TABLE OF CONTENTS</summary>

- [Usage](#usage)
    - [Send to remote DWave annealer solver](#send-to-remote-dwave-annealer-solver)
    - [Sample using local simulator](#sample-using-local-simulator)
- [Data structures](#data-structures)
    - [Qubo](#qubo)
    - [Hamiltonian](#hamiltonian)
    - [SolutionVector](#solutionvector)
    - [SolutionRecord](#solutionrecord)
</details>

---

## Usage

Solving QUBO problems is handled by the `Solver` class which has different modes. Assuming you have your data prepared, it's relatively easy to get your solutions:

### Send to remote DWave annealer solver

```
COMING SOON!
```

### Sample using local simulator

``` typescript
import { Solver, Qubo } from 'qubo-embedder';

const qubo = new Qubo(2);
qubo.addEntry(0, 0, 2.0);
qubo.addEntry(1, 1, 2.0);
qubo.addEntry(0, 1, -2.0);

Solver.simulator().sampleQubo(qubo, 5).then(solutionRecord => {
    console.log(solutionRecord.toString());
});

```

## Data structures

You can format your problems using built-in data types. These use [mathjs](https://mathjs.org/) internally to provide fast and efficient handling of linear algebra types and operations, especially in the Solver.simulator() solver.

### Qubo

Add the coefficients of your QUBO-problems using the indices of the affected variables (beginning at 0).

``` typescript
import { Qubo } from 'qubo-embedder';

const qubo = new Qubo(2);

qubo.addEntry(0, 0, 2.0);
qubo.addEntry(1, 1, 2.0);
qubo.addEntry(0, 1, -2.0);
// qubo.addEntry(1, 0, 2.0) throws an InvalidOperationException

console.log(qubo.getEntry(0, 1)); // -2.0
console.log(qubo.toString()); // [qubits: 2] {(0, 0): 2.0, (0, 1): -2.0, (1, 1): 2.0}

```

### Hamiltonian

If you're done, you can transform `Qubo` objects to `Hamiltonian` which the samplers take as an input.

``` typescript
import { Qubo, Hamiltonian } from 'qubo-embedder';

const qubo = new Qubo(2);
qubo.addEntry(0, 0, 2.0);
qubo.addEntry(1, 1, 2.0);
qubo.addEntry(0, 1, -2.0);

const hamiltonian = Hamiltonian.fromQubo(qubo);

console.log(hamiltonian.matrix); // [[2.0, -2.0], [0.0, 2.0]]

```

### SolutionVector

This type you seldom have to create for yourself, but is used by the solvers to return the solutions to a QUBO problem. A solution vector is immutable, but can be transformed into a regular list.

``` typescript
import { SolutionVector } from 'qubo_embedder';

const solutionVector = SolutionVector.fromList([0, 1]);

console.log(solutionVector.vector); // [0, 1]
console.log(solutionVector.toString()); // [q0: 0, q1: 1]

```

### SolutionRecord

Sampler store their solutions as entries in this record, which you can get by `entries()` and iterate over for solution details. When returned by a sampler, the entries are sorted by energy in ascending order.

``` typescript
import { Qubo, Solver, SolutionRecord } from 'qubo_embedder';

const qubo = new Qubo(2);
qubo.addEntry(0, 0, 2.0);
qubo.addEntry(1, 1, 2.0);
qubo.addEntry(0, 1, -2.0);

Solver.simulator().sampleQubo(qubo, 5).then(solutionRecord => {
    for (const entry of solutionRecord.entries()) {
        console.log(`E=${entry.energy}\t${entry.solutionVector}\tx${entry.numOccurrences}`);
    } 
    // E=-2.0    [q0: 0, q1: 1]    x1

    console.log(solutionRecord.toString());
    //   energy    sample    occurrences
    // (1) -2.0    [q0: 0, q1: 1]    x1
});

```