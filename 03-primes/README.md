# 03 · Primes

## The hook
Twin primes are pairs (p, p+2) that are both prime: (3,5), (5,7), (11,13), (17,19), (29,31), … (1,000,000,007, 1,000,000,009) …

**Are there infinitely many?** Nobody knows. It is one of the oldest open problems in mathematics.

## See it
Open **[twin-primes.html](twin-primes.html)** or run `python3 twin_primes.py`.
- The **actual** count of twin primes up to x, plotted against the **prediction** from treating primes as if they were random.
- The **ratio** of the two, creeping towards 1.
- A histogram of **gaps** between consecutive primes. Notice that gaps of 6 are more common than gaps of 2 or 4. Why?

## The ideas
1. **Euclid (~300 BC):** there are infinitely many primes. Multiply any finite list together and add 1. The result has a prime factor that isn't on the list.
2. **Prime Number Theorem (1896):** the number of primes up to x is about `x / ln x`. Equivalently, a number near x is prime with "probability" about `1/ln x`.
3. **The random model (Cramér):** pretend each n is prime independently with probability 1/ln n. Then twin primes up to x should number about `x/(ln x)²`.
4. **Fixing the model (Hardy–Littlewood, 1923):** primes are *not* independent. If p > 2 is prime, p is odd, so p+2 is odd too, which makes twins more likely than chance. Correcting for every small prime gives
   `π₂(x) ≈ 2·C₂·∫₂ˣ dt/(ln t)²`, where the **twin prime constant** is `C₂ = ∏_{p≥3} p(p−2)/(p−1)² ≈ 0.6601618`.
   This is **unproven**, yet it matches computations to remarkable accuracy.
5. **Bounded gaps (2013–14):** Yitang Zhang proved there are infinitely many prime pairs less than 70,000,000 apart. James Maynard (with a different method) and Terence Tao's Polymath project improved that to **246**. The last step to 2 seems to need a new idea, because sieve methods run into the **parity problem**: they can't tell numbers with an even number of prime factors from those with an odd number.
6. **Green–Tao (2004):** the primes contain arithmetic progressions of *every* finite length (like 5, 11, 17, 23, 29). The proof is the structure-vs-randomness principle in action: either a set looks random (so patterns appear by chance) or it has structure (which can be exploited).

## The proof path
- [ ] Euclid's proof. Then the variant: infinitely many primes of the form 4k+3.
- [ ] Why every twin pair after (3,5) has the form (6k−1, 6k+1).
- [ ] Sieve of Eratosthenes, and why it runs in O(n log log n).
- [ ] The heuristic derivation of `C₂`. Do it yourself with the "probability" argument. This is where symbols and intuition meet.
- [ ] Brun's theorem (1915): the sum of reciprocals of twin primes **converges** (to ≈ 1.902). So even if there are infinitely many, they are rare enough that the sum converges, unlike the sum of 1/p over all primes.
- [ ] Stretch goal: Chebyshev's bounds, an elementary proof that π(x) is within constant factors of x/ln x.

## In the world
- **Cryptography:** RSA and many key exchanges need huge random primes, found by picking random numbers and testing them with Miller–Rabin (→ 04). Their security rests on factoring being hard (→ 06).
- **Hashing:** hash tables often use prime sizes to spread keys evenly.
- **A famous bug:** in 1994, Thomas Nicely found the Pentium FDIV floating-point bug while computing Brun's constant.

## Connections
- → **04 Randomness:** primes *look* random, and random algorithms find primes.
- → **02 Emergence:** a statistical "law" emerges from a deterministic rule.
- → **06 Complexity:** PRIMES is in P (AKS, 2002). Is FACTORING in P? Nobody knows.
- → **05 Self-reference:** could the twin prime conjecture be true but unprovable? (Probably not, but Gödel says *some* statements are.)

## Open questions
- Why does a *random* model work so well for a deterministic object?
- What exactly is the parity problem, and why does it block the step from 246 to 2?
