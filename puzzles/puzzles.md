# Puzzles to carry

One problem at a time, carried for a week or a month. Come back to it in the shower, on walks, before sleep. The app shows these one at a time and unlocks hints only after you've thought about a puzzle on several different days.

**Format** (the app parses this file, so keep the shape when adding your own):
`## id · Title`, then a line `module: … · scale: week|month · difficulty: 1–3`, then the sections `### Problem`, `### Why it matters`, `### Hints` (a numbered list), `### Solution sketch`, `### Keep carrying`.

Weekly puzzles rotate in the order they appear below, and so do monthly ones.

---

## mod24 · Why 24?
module: 03-primes · scale: week · difficulty: 1

### Problem
Check a few cases: 5² − 1 = 24, 7² − 1 = 48, 11² − 1 = 120, 13² − 1 = 168.

**Prove that p² − 1 is divisible by 24 for every prime p > 3.**

### Why it matters
It's a first taste of reasoning *modulo* small numbers, the same move behind the Hardy–Littlewood correction factor for twin primes and behind the "6k ± 1" shape of primes.

### Hints
1. Factor p² − 1.
2. Look at the three consecutive numbers p − 1, p, p + 1. Which of them can be divisible by 3? By 2?
3. p − 1 and p + 1 are *consecutive even numbers*. What does that tell you about divisibility by 4?

### Solution sketch
p² − 1 = (p − 1)(p + 1). Since p is odd, both factors are even, and of two consecutive even numbers one is divisible by 4, so 8 divides the product. Among p − 1, p, p + 1 one is divisible by 3, and it isn't p (a prime > 3), so 3 divides the product. Since 3 and 8 share no factor, 24 divides p² − 1.

### Keep carrying
Is the converse true? If n² ≡ 1 (mod 24), must n be prime? (Try n = 25.) Which n satisfy n² ≡ 1 (mod 24)? Describe them exactly.

---

## oddsquares · Odd numbers make squares
module: 01-recursion · scale: week · difficulty: 1

### Problem
1 = 1, 1 + 3 = 4, 1 + 3 + 5 = 9, 1 + 3 + 5 + 7 = 16 …

**Prove that 1 + 3 + 5 + … + (2n − 1) = n² in three ways: with a picture, by induction, and by algebra. Then explain why the picture and the induction are secretly the same proof.**

### Why it matters
This is the bridge between *seeing* and *symbols* that this repo is about. Induction is recursion's twin: the picture shows the recursive step.

### Hints
1. Draw a 1×1 square, then a 2×2, then a 3×3. What shape do you add each time?
2. For induction: assume the sum up to (2n − 1) is n². Add the next odd number.
3. The added "L" shape (a gnomon) has 2n + 1 cells. That's the induction step drawn.

### Solution sketch
Picture: an (n+1)×(n+1) square is an n×n square plus an L-shaped border of n + n + 1 = 2n + 1 cells. Induction: n² + (2n + 1) = (n + 1)². Algebra: Σ(2k − 1) = 2·n(n+1)/2 − n = n². The picture *is* the induction step: "to build the next square, add the next odd number".

### Keep carrying
What do you add to go from a triangle of dots to the next triangle? From a cube to the next cube? Can you "see" 1³ + 2³ + … + n³ = (1 + 2 + … + n)²?

---

## gaps · Deserts among the primes
module: 03-primes · scale: week · difficulty: 1

### Problem
Primes get rarer but never stop. **Show that for every n there are n consecutive whole numbers, none of which is prime.** For example, find 10 consecutive composite numbers.

### Why it matters
The average gap near x is about ln x (Prime Number Theorem), yet twin primes suggest gaps of 2 keep recurring forever. Gaps can be huge *and* tiny. Holding both at once is the whole twin prime mystery.

### Hints
1. You want a number that is divisible by 2, the next by 3, the next by 4, …
2. What number is divisible by every integer from 2 to n + 1?
3. Consider (n + 1)! + 2.

### Solution sketch
The numbers (n+1)! + 2, (n+1)! + 3, …, (n+1)! + (n+1) are n consecutive numbers, and k divides (n+1)! + k for each 2 ≤ k ≤ n+1. So none is prime.

### Keep carrying
Factorials are wasteful: the actual first gap of length ≥ 10 appears much earlier (find it with the Python script!). Can you replace (n+1)! with something smaller, like the product of primes up to n+1 (the *primorial*)?

---

## triplets · Three in a row
module: 03-primes · scale: week · difficulty: 1

### Problem
(3, 5, 7) are three primes, each 2 apart. **Prove there is no other triple (p, p + 2, p + 4) of primes.**

### Why it matters
Some patterns of primes are *impossible* for a trivial reason, and others (like twins) are conjectured to occur infinitely often. Telling them apart is the first step of the Hardy–Littlewood "prime k-tuples" conjecture.

### Hints
1. Look at the three numbers modulo 3.
2. p, p + 2, p + 4 have remainders p, p + 2, p + 1 (mod 3). What does that cover?

### Solution sketch
Modulo 3, the numbers p, p+2, p+4 ≡ p, p+2, p+1 hit all three remainders 0, 1, 2. So one of them is divisible by 3, and to be prime it must *be* 3. The only option is p = 3, giving (3, 5, 7).

### Keep carrying
People do study "prime triplets" (p, p+2, p+6) and (p, p+4, p+6). Why aren't they blocked by the mod-3 argument? A pattern is called *admissible* if it doesn't cover every residue class mod some prime. Is (0, 2, 6, 8) admissible? (0, 2, 4, 6)?

---

## hanoi · The Tower of Hanoi, honestly
module: 01-recursion · scale: week · difficulty: 2

### Problem
Move a tower of n disks from peg A to peg C, one disk at a time, never placing a larger disk on a smaller one. Everyone "knows" it takes 2ⁿ − 1 moves.

**Prove that 2ⁿ − 1 moves are not just enough but *necessary*: no cleverer solution exists.**

### Why it matters
Showing an algorithm works is easy. Showing nothing faster *can* exist is a **lower bound**, and lower bounds are the hard part of complexity theory (P vs NP is a lower-bound question).

### Hints
1. Think about the largest disk. It must move at least once. What must be true of the other disks at that moment?
2. At the moment the big disk first moves, all n − 1 smaller disks must be stacked on the third peg.
3. Write an inequality T(n) ≥ … and solve it.

### Solution sketch
Before the largest disk first moves from A, the n − 1 others must all be on the remaining peg, which takes ≥ T(n−1) moves. Then the big disk moves (1). Afterwards, the n − 1 disks must end up on top of it at C, which takes ≥ T(n−1) moves. So T(n) ≥ 2T(n−1) + 1 with T(1) = 1, giving T(n) ≥ 2ⁿ − 1, and the recursive algorithm achieves it.

### Keep carrying
New rule: disks may move only between *adjacent* pegs (A↔B, B↔C, never A↔C directly). How many moves now? (Answer to check against: 3ⁿ − 1. Prove it.)

---

## domino · Tiling with dominoes
module: 01-recursion · scale: week · difficulty: 1

### Problem
**In how many ways can a 2 × n rectangle be tiled with 1 × 2 dominoes?** Count n = 1, 2, 3, 4 by hand, guess the pattern, then prove it.

### Why it matters
Counting by recursion: break the problem by what happens at one edge. This is the same thinking as quicksort's analysis, and the same numbers (Fibonacci) appear everywhere in nature.

### Hints
1. Look at the leftmost column. What can cover it?
2. Either one vertical domino, or two horizontal dominoes stacked. What's left in each case?

### Solution sketch
If the left column holds a vertical domino, a 2 × (n−1) board remains. Otherwise two horizontal dominoes cover the first two columns, leaving 2 × (n−2). So T(n) = T(n−1) + T(n−2), with T(1) = 1, T(2) = 2: the Fibonacci numbers, shifted.

### Keep carrying
Now try 3 × n boards (n must be even, so why?). Show the count a(n) satisfies a(n) = 4a(n−2) − a(n−4), with a(0) = 1, a(2) = 3, a(4) = 11.

---

## vonneumann · A fair coin from a bent one
module: 04-randomness · scale: week · difficulty: 1

### Problem
You have a coin that lands heads with some probability p, but you don't know p (it isn't 0 or 1). **Using only this coin, produce a perfectly fair random bit.** How many flips does it take on average?

### Why it matters
Real randomness sources (thermal noise, timing jitter) are biased. Every computer turns biased physical randomness into clean random bits for cryptography. This is the simplest such *randomness extractor*.

### Hints
1. Flip twice. Which outcomes are equally likely, whatever p is?
2. P(HT) = p(1−p) = P(TH).

### Solution sketch
Flip twice: HT → output 0, TH → output 1, HH or TT → discard and repeat. Both outputs have probability p(1−p), so the bit is fair. Each round succeeds with probability 2p(1−p), so on average 1/(2p(1−p)) rounds, i.e. 1/(p(1−p)) flips.

### Keep carrying
This wastes a lot of flips when p ≈ ½ (an average of 4 flips per bit, while the ideal is about 1). Can you recycle the discarded HH/TT pairs to squeeze out more bits? What is the theoretical best? (Look up Shannon entropy.)

---

## birthday · The birthday surprise
module: 04-randomness · scale: week · difficulty: 1

### Problem
**How many people must be in a room for the chance that two share a birthday to exceed ½?** (Ignore leap years; assume birthdays are uniform.) Most people guess around 180. Then: if there are N possible "birthdays", roughly how many people are needed?

### Why it matters
This is why hash functions need outputs twice as long as you'd naively think. With b-bit hashes, collisions appear after about 2^(b/2) tries (the *birthday attack*). It also explains why random collisions show up so quickly in simulations.

### Hints
1. Compute the probability that *no* two share a birthday instead.
2. Person k + 1 must avoid k birthdays: probability 1 − k/365.
3. For the approximation, use 1 − x ≈ e^(−x).

### Solution sketch
P(no match among n) = ∏_{k=0}^{n−1} (1 − k/365). This first drops below ½ at n = 23 (≈ 0.493). In general ∏(1 − k/N) ≈ e^(−n(n−1)/(2N)), which equals ½ when n ≈ √(2 ln 2 · N) ≈ 1.18 √N.

### Keep carrying
The answer grows like √N, not N. Where else does √N appear when randomness meets counting? (Random walks, Monte Carlo error, Pollard's rho factoring algorithm…)

---

## buffon · Finding π by dropping needles
module: 04-randomness · scale: week · difficulty: 2

### Problem
A floor has parallel lines a distance d apart. Drop a needle of length ℓ ≤ d at random. **Show the probability that it crosses a line is 2ℓ/(πd).**

### Why it matters
It was one of the first Monte Carlo methods (Buffon, 1777): you can *estimate π by randomness*. It's also a lesson in modelling: what exactly does "drop at random" mean?

### Hints
1. Describe the needle by two numbers: the distance x from its centre to the nearest line, and its angle θ with the lines.
2. Take x uniform in [0, d/2] and θ uniform in [0, π/2]. When does the needle cross?
3. It crosses iff x ≤ (ℓ/2)·sin θ. Compute the area of that region.

### Solution sketch
The pair (x, θ) is uniform on a rectangle of area (d/2)(π/2). The crossing region has area ∫₀^{π/2} (ℓ/2) sin θ dθ = ℓ/2. The ratio is (ℓ/2) / (dπ/4) = 2ℓ/(πd).

### Keep carrying
Write a 10-line simulation and estimate π. How does the error shrink with the number of needles N? (You should find about 1/√N. Why is that the universal Monte Carlo rate?)

---

## life3 · The fate of three cells
module: 02-emergence · scale: week · difficulty: 1

### Problem
In the Game of Life, **classify the long-term fate of every pattern with exactly 3 live cells.** Which die, which become stable, which oscillate?

### Why it matters
Even in the smallest cases emergence is visible: a few configurations "find" stable or periodic forms, and the rest dissolve. Doing the case analysis by hand builds the intuition that makes gliders and guns feel less magical.

### Hints
1. A live cell needs 2 or 3 neighbours to survive. With only 3 live cells, how many neighbours can each have?
2. A birth needs a dead cell with *all three* live cells as its neighbours.
3. Group patterns by shape: straight line, "L", diagonal, "V", spread out.

### Solution sketch
Only two shapes survive. The straight line of 3 is a **blinker** (period 2). The **L-shaped** tromino becomes a 2×2 **block** after one step (still life). Every other 3-cell pattern is empty by generation 2. Check them in the Life app.

### Keep carrying
Now do 4 cells. One 4-cell pattern grows into four blinkers arranged in a cross (a "traffic light"). Find it in the app. Can you predict any of these fates without running them?

---

## hello · The "hello" detector
module: 05-self-reference · scale: week · difficulty: 2

### Problem
**Prove that no program can decide, for every program P, whether P will ever print the word "hello".** You may use the fact that the halting problem is undecidable.

### Why it matters
This is how undecidability spreads: by *reduction*. The same argument gives Rice's theorem, which says every interesting question about what a program does is undecidable. That's why every bug-finder and antivirus is an approximation.

### Hints
1. Suppose a hello-detector H exists. Use it to build a halting-detector.
2. Given a program M and input x, build a new program that first runs M on x (printing nothing), and then prints "hello".
3. When does that new program print "hello"?

### Solution sketch
Given (M, x), construct P' = "simulate M on x with all output suppressed; then print hello". P' prints hello iff M halts on x. So H(P') would decide halting, which is impossible. Hence H cannot exist.

### Keep carrying
State and prove Rice's theorem in general: for any non-trivial property of the *function* a program computes, deciding it is impossible. Why does "does P have more than 100 lines?" escape Rice's theorem?

---

## countable · More functions than programs
module: 05-self-reference · scale: week · difficulty: 2

### Problem
**Show that there are only countably many programs, but uncountably many functions from ℕ to {0, 1}. Conclude that almost every such function cannot be computed by any program.**

### Why it matters
Before seeing a single specific uncomputable problem, counting alone tells you they must exist, and they vastly outnumber computable ones. Computation is a tiny island.

### Hints
1. A program is a finite string over a finite alphabet. How would you list all of them?
2. List them by length, then alphabetically within each length.
3. For functions, assume a list f₀, f₁, f₂, … and look at the diagonal fₙ(n).

### Solution sketch
Enumerating strings by length and then alphabetically lists every program, so programs are countable. Given any list of functions fₙ, define g(n) = 1 − fₙ(n). Then g differs from every fₙ, so no list contains all functions (Cantor). Since each program computes at most one function, at most countably many functions are computable, and the rest are not.

### Keep carrying
Name a *specific* uncomputable function. The halting function is one. Another is the Busy Beaver function BB(n), the most steps a halting n-state Turing machine can take. BB(5) = 47,176,870 was confirmed in 2024 with a computer-verified proof. Why can BB never be computed, even though each individual value is a definite number?

---

## subsetsum · Beating brute force
module: 06-complexity · scale: week · difficulty: 2

### Problem
Given n whole numbers and a target T, is there a subset summing exactly to T? Trying all subsets takes about 2ⁿ steps.

**Find an algorithm that takes about 2^(n/2) steps (times a small factor).** Then find a completely different algorithm that's fast when T is small.

### Why it matters
Subset Sum is NP-complete, so nobody expects a polynomial algorithm. But "exponential" is not one speed: 2^(n/2) vs 2ⁿ is the difference between n = 80 being feasible or not. Understanding *why* the small-T algorithm doesn't prove P = NP is a key lesson about input size.

### Hints
1. Split the numbers into two halves.
2. List all subset sums of each half (2^(n/2) each). How do you find a pair adding to T quickly?
3. For small T: let reachable[s] mean "some subset of the first k numbers sums to s".

### Solution sketch
*Meet in the middle:* compute the sums A of the first half and B of the second half, and sort B. For each a in A, binary-search for T − a in B. Total ≈ 2^(n/2)·n steps. *Dynamic programming:* a table of which sums ≤ T are reachable, updated number by number, takes O(n·T) steps. This doesn't prove P = NP, because T written down has only about log₂ T digits, so n·T can be exponential in the *input length*. This is called a *pseudo-polynomial* algorithm.

### Keep carrying
Can you combine the halves *without* sorting? What's the best known exponent? Look up the Schroeppel–Shamir algorithm, which matches 2^(n/2) time while using much less memory.

---

## fourkplus3 · Primes of the form 4k + 3
module: 03-primes · scale: week · difficulty: 2

### Problem
**Prove there are infinitely many primes of the form 4k + 3** (3, 7, 11, 19, 23, 31, …), adapting Euclid's proof.

### Why it matters
It's the first step toward Dirichlet's theorem (every progression a, a + d, a + 2d, … with gcd(a, d) = 1 has infinitely many primes), and toward the "prime races" between residue classes, where 4k+3 primes lead surprisingly often (Chebyshev's bias).

### Hints
1. Suppose p₁, …, p_k are all the primes ≡ 3 (mod 4). Build a number like Euclid's, but one that is ≡ 3 (mod 4).
2. Try N = 4p₁p₂⋯p_k − 1.
3. If every prime factor of N were ≡ 1 (mod 4), what would N be mod 4?

### Solution sketch
N = 4p₁⋯p_k − 1 is odd and ≡ 3 (mod 4). A product of numbers ≡ 1 (mod 4) is ≡ 1 (mod 4), so N has a prime factor q ≡ 3 (mod 4). But N ≡ −1 (mod pᵢ) for each i, so q is none of the pᵢ. Contradiction.

### Keep carrying
Why does the same trick *fail* for primes ≡ 1 (mod 4)? (Products of 3-mod-4 numbers can be 1 mod 4.) Find a different proof for 4k + 1. Hint: if p divides n² + 1, what is p mod 4?

---

## collatz · The 3n + 1 problem
module: 02-emergence · scale: month · difficulty: 2

### Problem
Start with any n. If it's even, halve it. If it's odd, replace it with 3n + 1. Repeat. The *Collatz conjecture* says you always reach 1. It has been checked for every starting value up to about 2⁶⁸, yet it's unproven.

**Carry this one for a month. Concrete goal: prove that if a counterexample exists, the smallest one must be ≡ 3 (mod 4).** Then push further.

### Why it matters
Simple rule, wild behaviour: it's emergence in arithmetic. Conway proved that a natural generalization of Collatz-type maps is undecidable, and in 2019 Terence Tao proved that "almost all" orbits get "almost" bounded. The problem sits between the primes, Life and Gödel.

### Hints
1. If n is the smallest number that never reaches 1, then every number smaller than n does reach 1. So n can never drop below itself.
2. What happens to an even n on the first step?
3. If n ≡ 1 (mod 4), follow it for three steps: n → 3n + 1 → ?

### Solution sketch
Even n → n/2 < n, impossible for a minimal counterexample. If n ≡ 1 (mod 4), then 3n + 1 ≡ 0 (mod 4), so two halvings give (3n + 1)/4 < n, also impossible. So n ≡ 3 (mod 4).

### Keep carrying
Push to mod 8, then mod 16. Which residues can the smallest counterexample have? Write a small program to find which residues mod 2ᵏ "drop below themselves" within a few steps. What fraction survive as k grows? This is real research technique, the kind used in computer verification of the conjecture.

---

## quickexact · Quicksort's exact average
module: 01-recursion · scale: month · difficulty: 3

### Problem
For randomized quicksort on n distinct items (pivot chosen uniformly at random), let Cₙ be the number of comparisons.

**Prove that the expected value is exactly E[Cₙ] = 2(n + 1)Hₙ − 4n**, where Hₙ = 1 + ½ + ⅓ + … + 1/n. Check it for n = 2 and n = 3 first.

### Why it matters
This is the cleanest example of *linearity of expectation* defeating what looks like a messy recursion. It also explains the "1.39 n log₂ n" constant you see in the Quicksort app.

### Hints
1. Name the items by rank 1, …, n. Let X_{ij} = 1 if items i and j are ever compared.
2. Items i < j are compared iff the *first* pivot chosen from ranks i, i+1, …, j is i or j. Probability?
3. P = 2/(j − i + 1). Group pairs by their distance d = j − i: there are n − d of them.

### Solution sketch
E[Cₙ] = Σ_{i<j} 2/(j − i + 1) = Σ_{k=2}^{n} (n − k + 1)·2/k = 2(n + 1)Σ_{k=2}^{n} 1/k − 2(n − 1) = 2(n + 1)(Hₙ − 1) − 2n + 2 = 2(n + 1)Hₙ − 4n. Since Hₙ ≈ ln n, this is ≈ 2n ln n ≈ 1.39 n log₂ n.

### Keep carrying
Derive the same result the "hard way" from the recurrence Cₙ = n − 1 + (2/n)Σ_{k<n} C_k. Then: what is the *variance*? Is quicksort's running time concentrated near its mean?

---

## berry · The Berry paradox
module: 05-self-reference · scale: month · difficulty: 2

### Problem
Consider "**the smallest positive integer not definable in under sixty letters**". There are finitely many phrases under sixty letters, so some integers aren't definable that way, and there is a smallest one. But the quoted phrase defines it, in under sixty letters!

**Carry this for a month: what exactly goes wrong? Then make it precise with programs instead of English phrases, and find the real theorem hiding inside.**

### Why it matters
Gödel's sentence is a tamed Liar paradox, and this is the Berry paradox tamed into a theorem about *information*. It leads to Kolmogorov complexity (randomness as incompressibility) and Chaitin's version of incompleteness, which ties together modules 04 and 05.

### Hints
1. Is "definable in English" a precise notion? Can a definition talk about all definitions?
2. Replace "definable in under L letters" with "printed by a program shorter than L symbols". Call K(n) the length of the shortest program printing n.
3. Suppose some program could compute K(n). Write a short program that searches for the first n with K(n) > L. How long is that program?

### Solution sketch
In English the paradox shows "definable" isn't well-defined. Made precise: if K were computable, the program "find the first n with K(n) > L and print it" has length about log L + c, which is less than L for large L. It prints a number whose shortest program is longer than L, a contradiction. So **K(n) is uncomputable**. Chaitin's theorem goes further: a consistent formal system can prove "K(n) > L" only for L below a constant tied to the system's own complexity. Most true statements of the form "this number is random" are unprovable.

### Keep carrying
A string is "random" if K(s) ≈ length(s). Show that most strings are random (count the short programs). Yet you can never *prove* a specific long string is random. How does this sit next to Gödel?

---

## twosat · Why 2-SAT is easy
module: 06-complexity · scale: month · difficulty: 3

### Problem
A 2-SAT instance is an AND of clauses, each an OR of two literals, e.g. (x ∨ ¬y) ∧ (¬x ∨ z) ∧ (y ∨ z). 3-SAT is NP-complete, but **prove that 2-SAT can be solved in polynomial time.**

### Why it matters
The boundary between 2 and 3 is where complexity jumps. Understanding *why* 2-SAT is easy (implications chain like a graph) and 3-SAT isn't is a real insight into where hardness comes from.

### Hints
1. A clause (a ∨ b) is equivalent to two implications. Which?
2. (a ∨ b) ≡ (¬a → b) ∧ (¬b → a). Build a directed graph on the 2n literals.
3. What does it mean if there's a path x → ¬x *and* a path ¬x → x?

### Solution sketch
Build the implication graph: for each clause (a ∨ b) add edges ¬a → b and ¬b → a. If some variable x has x and ¬x in the same strongly connected component, the formula forces x ⇔ ¬x, so it is unsatisfiable. Otherwise it's satisfiable: process components in reverse topological order and set each unassigned literal true. Strongly connected components take linear time to find (Tarjan), so 2-SAT is in P.

### Keep carrying
Why doesn't this work for 3-SAT? (A 3-clause doesn't become single implications.) Random 3-SAT shows a sharp threshold: formulas with fewer than about 4.27 clauses per variable are almost always satisfiable, and those with more almost never are. The hardest instances live near the threshold. Why might hardness peak at a phase transition?

---

## reciprocals · Primes are not that rare
module: 03-primes · scale: month · difficulty: 3

### Problem
The sum 1/2 + 1/3 + 1/5 + 1/7 + 1/11 + … over all primes. **Prove it diverges.** (Contrast: Brun proved that the sum over *twin* primes converges, to about 1.902.)

### Why it matters
This is Euler's insight connecting primes to analysis through the product ∏ 1/(1 − 1/p). It's the seed of the zeta function and the Riemann Hypothesis. It also makes precise how primes are "more common" than squares (Σ1/n² converges) but rarer than all integers.

### Hints
1. Expand 1/(1 − 1/p) = 1 + 1/p + 1/p² + … and multiply over all p ≤ x. What do you get (at least)?
2. ∏_{p≤x} 1/(1 − 1/p) ≥ Σ_{n≤x} 1/n ≥ ln x, by unique factorization.
3. Take logarithms, and use −ln(1 − y) ≤ y + y² for 0 ≤ y ≤ ½.

### Solution sketch
By unique factorization, ∏_{p≤x}(1 + 1/p + 1/p² + …) includes 1/n for every n ≤ x, so it is ≥ ln x. Taking logs: Σ_{p≤x} −ln(1 − 1/p) ≥ ln ln x. With −ln(1 − y) ≤ y + y², this gives Σ_{p≤x} 1/p ≥ ln ln x − Σ 1/p², and the last sum converges. So Σ 1/p grows like ln ln x, which is unbounded but agonizingly slow.

### Keep carrying
Σ_{p≤x} 1/p ≈ ln ln x + 0.2615 (Mertens). Check it numerically with the twin prime script. Why does the twin prime sum converge, even though there are (conjecturally) infinitely many twins? What does that say about how "thin" they are?
