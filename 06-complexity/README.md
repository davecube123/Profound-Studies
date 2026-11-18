# 06 · Complexity

## The hook
Checking that a filled-in Sudoku is correct is easy. *Filling it in* seems hard. Is that a real difference, or have we just not found the clever algorithm yet?

That is the **P vs NP** question: if a solution can be *checked* quickly, can it always be *found* quickly? It's one of the Clay Millennium Prize problems ($1,000,000), and most researchers believe the answer is no.

Gödel and Turing asked what can be computed *at all*. Complexity theory asks what can be computed *efficiently*. It's the same question with a stopwatch.

## The landscape
| Class | Meaning | Example |
|---|---|---|
| **P** | solvable in polynomial time | sorting (01), shortest paths, **primality** (AKS) |
| **NP** | solutions *checkable* in polynomial time | Sudoku, SAT, travelling salesman (decision version) |
| **NP-complete** | the hardest problems in NP. Solve one fast and you solve all of NP fast | SAT, 3-colouring, Sudoku (generalized) |
| **BPP** | solvable fast by randomized algorithms with small error | polynomial identity testing (04) |
| **Factoring** | in NP, *not believed* NP-complete, *not known* to be in P | the basis of RSA (03) |
| **Undecidable** | no algorithm at all | halting problem, Life's long-term fate (02, 05) |

Believed: P ⊆ BPP ⊆ … and P = BPP, P ≠ NP. Proven: P ≠ EXP, from the time-hierarchy theorem, a diagonal argument.

## The ideas
1. **Polynomial vs exponential:** n² vs 2ⁿ. At n = 100, n² is 10,000 while 2ⁿ is about 10³⁰.
2. **Reductions:** "if I could solve B, I could solve A" means A is no harder than B. Reductions are the main tool of the field, and you've already seen one: halting → incompleteness (05).
3. **Cook–Levin (1971):** SAT is NP-complete. Any polynomial-time checker can be encoded as a giant Boolean formula. The encoding resembles Gödel numbering: computation is turned into logic.
4. **Barriers:** relativization (1975), natural proofs (1994) and algebrization (2008) explain why *known* techniques can't resolve P vs NP. They are meta-theorems about our proof methods, an echo of Gödel.
5. **Hardness is a resource:** cryptography *needs* hard problems, and derandomization *uses* hardness to build pseudorandomness (04).

## The proof path
- [ ] Show SAT ∈ NP (what's the certificate?).
- [ ] Reduce 3-colouring to SAT by hand for a small graph.
- [ ] Understand the Cook–Levin proof idea: a tableau of a machine's configurations over time. (It resembles the Game of Life: a grid of cells updated by local rules.)
- [ ] Time hierarchy theorem as diagonalization.
- [ ] Read: Scott Aaronson, *Quantum Computing Since Democritus* (wide-ranging, fun); Sipser, *Introduction to the Theory of Computation* (the standard textbook); Wigderson, *Mathematics and Computation* (free online, deep).

## In the world
- **Cryptography** rests on unproven hardness assumptions.
- **Optimization:** logistics, chip design and scheduling are often NP-hard, so industry uses heuristics and SAT solvers, which are surprisingly good in practice. Why they work so well is still partly a mystery.
- **AI and proofs:** finding a proof is like NP (hard to find, easy to check), and checking it is like P. Lean plus AI is that asymmetry made practical.

## Connections
- → every other module. Complexity is the hub: cost of recursion (01), irreducibility (02), primes and factoring (03), randomness (04), the diagonal (05).

## Open questions
- If P = NP, mathematical creativity could be automated, since short proofs could be *found* as easily as checked. Is that why most people believe P ≠ NP?
- Why do SAT solvers work so well on real-world instances if SAT is NP-complete?
