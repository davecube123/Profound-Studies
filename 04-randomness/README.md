# 04 · Randomness in algorithms

## The hook
You have a 600-digit number. Is it prime?

- Trial division would take longer than the age of the universe.
- **Miller–Rabin** picks a random number a, does some quick arithmetic, and either finds *proof* that n is composite or fails to. Each failed attempt cuts the chance of being fooled by at least a factor of 4. Forty rounds give an error probability below 4⁻⁴⁰ ≈ 10⁻²⁴, far less likely than a hardware error. It finishes in milliseconds.

The coin flips do the work.

## See it
- Run `python3 miller_rabin.py`. It finds a 1024-bit prime, shows how a single "witness" exposes a composite, and counts how often a random base lies about a Carmichael number.
- In **[../01-recursion/quicksort.html](../01-recursion/quicksort.html)**, compare first-element pivot vs random pivot on sorted input.

## The ideas
1. **Two kinds of "average".** *Average-case analysis* averages over inputs, so an adversary can still hand you a bad one. *Randomized algorithms* average over **your own coin flips**, so the guarantee holds for **every** input.
2. **Witnesses.** Many problems have the shape "a composite number has *lots* of witnesses to its compositeness". If at least ¾ of candidates are witnesses, randomly sampling a few finds one with near certainty.
3. **Fingerprinting / polynomial identity testing.** To check whether two huge polynomial expressions are equal, plug in random values. A nonzero polynomial of degree d has at most d roots (the **Schwartz–Zippel** lemma), so a random point exposes inequality with high probability. No deterministic polynomial-time method is known.
4. **Karger's min-cut.** Repeatedly merge the two endpoints of a random edge until two "super-nodes" remain. The edges between them form the minimum cut with probability ≥ 2/n², so repeating it enough times finds it.
5. **Monte Carlo vs Las Vegas.** Monte Carlo algorithms are always fast and *probably* correct (Miller–Rabin). Las Vegas algorithms are always correct and *probably* fast (randomized quicksort).
6. **Is randomness necessary?** In 2002, **AKS** gave a *deterministic* polynomial-time primality test, so randomness wasn't needed for PRIMES after all. **Impagliazzo–Wigderson (1997):** if certain problems are hard enough, then *every* randomized algorithm can be derandomized (**P = BPP**). Most researchers now believe this. Hardness can be turned into pseudorandomness.

## The proof path
- [ ] Fermat's little theorem: if p is prime, then `aᵖ⁻¹ ≡ 1 (mod p)`.
- [ ] Why the Fermat test fails: Carmichael numbers (561 = 3·11·17).
- [ ] Miller–Rabin: modulo a prime, the only square roots of 1 are ±1. Find another one and n is composite.
- [ ] Prove at most ¼ of bases are "liars" for an odd composite (harder; Rabin 1980).
- [ ] Schwartz–Zippel by induction on the number of variables.
- [ ] Karger: compute the success probability `∏ (1 − 2/k)` for k from n down to 3.

## In the world
- **Cryptography:** key generation relies on random primes and fresh randomness. Weak random number generators have broken real systems (e.g. Debian OpenSSL, 2008).
- **Simulation:** Monte Carlo methods in physics, finance and weather forecasting.
- **Machine learning:** stochastic gradient descent, dropout, random initialization.
- **Big data:** hashing, sketches (HyperLogLog counts distinct items in tiny memory), random sampling.

## Connections
- → **03 Primes:** primes are found with randomness, and primes *look* random.
- → **06 Complexity:** BPP, the class of problems solvable by randomized algorithms, and P vs BPP.
- → **02 Emergence:** randomness as an *input* (random soup) vs randomness as an *output* (chaotic patterns).
- → **01 Recursion:** randomized quicksort.

## Open questions
- What *is* randomness? Is a sequence random if no short program can generate it (Kolmogorov complexity)?
- If P = BPP, randomness would add no fundamental power. Why does it still feel so useful?
