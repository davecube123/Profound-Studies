# News & developments

Recent developments on the questions in this repo, curated and checked against sources. The app shows them under **News**, tagged by module.

**Format** (the app parses this file): `## YYYY-MM · Headline`, then a line `topic: … · modules: …`, then the text, a **Why it connects:** line and a **Sources:** line. Topics: `primes`, `complexity`, `randomness`, `logic`, `emergence`, `recursion`, `ai-math`.

### Keep up yourself

- [Quanta Magazine: Mathematics](https://www.quantamagazine.org/mathematics/) and [Computer Science](https://www.quantamagazine.org/computer-science/): the best plain-language coverage of new results
- [Terence Tao's blog](https://terrytao.wordpress.com/) and [Mathstodon](https://mathstodon.xyz/@tao): primes, AI in math, and how research is changing
- [erdosproblems.com](https://www.erdosproblems.com/): the Erdős problems database, where much of the AI-and-math action is
- [arXiv: number theory, new](https://arxiv.org/list/math.NT/new) · [arXiv: computational complexity, new](https://arxiv.org/list/cs.CC/new): new papers each weekday (skim the titles)
- [Shtetl-Optimized](https://scottaaronson.blog/) (Scott Aaronson) and the [Computational Complexity blog](https://blog.computationalcomplexity.org/): complexity theory, explained by its practitioners
- [bbchallenge.org](https://bbchallenge.org/): the collaborative Busy Beaver project
- [ConwayLife forums](https://conwaylife.com/forums/): new Game of Life discoveries
- [GIMPS](https://www.mersenne.org/): the search for the largest known primes
- [Lean community](https://leanprover-community.github.io/): formal proofs, where "proof" becomes software

## 2026-10 · An AI-generated proof of a "quasi-Riemann hypothesis" is being checked by experts
topic: primes, ai-math · modules: 03-primes, 04-randomness
On October 6, 2026, OpenAI released a large batch of AI-generated papers. One of them claims a *quasi-Riemann hypothesis*: every nontrivial zero of the zeta function lies in a strip narrower than the known strip from 0 to 1. A 199-page version (zeros between 1/8 and 7/8) is reported as formally checked in Lean. A shorter 49-page version (1/12 to 11/12) is not formally checked, and number theorists are studying it because it is easier to read. Experts largely expect it to hold up, but Peter Sarnak won't call it a theorem until humans have checked and understood every detail. The full Riemann hypothesis remains open.

**Why it connects:** The Riemann hypothesis says the primes are as "random" as they can be, meaning their deviation from the Prime Number Theorem's prediction stays small. A narrower zero strip is real progress on that question. It is also the first major result to be machine-checked before anyone understood why it works.

**Sources:** [Quanta: AI Proved the Quasi-Riemann Hypothesis. What Happens Now?](https://www.quantamagazine.org/ai-proved-the-quasi-riemann-hypothesis-what-happens-now-20261019/) · [OpenAI preprint](https://github.com/openai/math/tree/main/preprints/The-Quasi-Riemann-Hypothesis-September-30-2026)

## 2026-10 · "Is AI the end of math as we know it?"
topic: ai-math · modules: 05-self-reference, 06-complexity
A Quanta essay describes the field's mood in autumn 2026: grief, anger and a search for new norms. arXiv now limits authors to two submissions a month, and many AI-generated proofs are hard for humans to read. The essay's core point is that mathematicians "know that the proofs are true … but have no idea why." Daniel Litt is quoted: "The existing equilibrium has broken. We'll have to find a new one."

**Why it connects:** This is the gap between finding a proof and checking one, in human form. Checking that a proof is valid can be automated, but understanding it cannot, and understanding is the reason you're studying this.

**Sources:** [Quanta: Is AI the End of Math As We Know It?](https://www.quantamagazine.org/is-ai-the-end-of-math-as-we-know-it-20261005/) · [Scientific American: If AI can do math, what's the point of mathematicians?](https://www.scientificamerican.com/article/mathematicians-confront-the-ai-apocalypse/)

## 2026-09 · 25 Fields Medallists, including Tao, warn of a "severe misalignment"
topic: ai-math · modules:
On September 11, 2026, Terence Tao posted a declaration signed by 25 Fields Medallists, among them Scholze, Maynard and Viazovska. It says: "The goals of the AI companies and the goals of the mathematical community are severely misaligned." It also says that "solving problems is only a tool and proxy for achieving the primary goal of conceptual understanding and insight". It warns about rushed announcements, missing attribution and the loss of "the crucial human transmission chain between mathematicians". Other mathematicians can add their signatures at mathandai.org.

**Why it connects:** Leading mathematicians state plainly that the point of mathematics is understanding, not a tally of solved problems. That is a good reason to keep studying the way you are.

**Sources:** [Tao's blog: A Severe Misalignment of AI in Mathematics](https://terrytao.wordpress.com/2026/09/11/a-severe-misalignment-of-ai-in-mathematics/) · [mathandai.org](https://mathandai.org/)

## 2026-09 · AI systems push the prime-gap bound from 240 to a claimed 186
topic: primes, ai-math · modules: 03-primes, 06-complexity
Within days of Stadlmann's record of 240 (see below), several teams claimed improvements: 236 (Shiva Kintali, using several AI systems, Sep 1, and separately Zhao Song and Song Yue), 212 (Axiom Math's AxiomProver, Sep 3), and **186** (OpenAI, credited to its model GPT-6 Astra, around Sep 3). As of MathWorld's Sep 7 update, neither the 212 nor the 186 result was a complete end-to-end Lean proof, since both assume some analytic inputs. None is peer reviewed or independently verified.

**Why it connects:** All of these refine the same sieve-weight optimisation (Maynard and Polymath plus Stadlmann's new input). The twin prime conjecture (gap 2) is untouched, and gap 6 is known to be the limit of these methods even under strong conjectures, which is the parity problem in action.

**Sources:** [MathWorld: Bounded Gaps Between Primes](https://mathworld.wolfram.com/BoundedGapsBetweenPrimes.html) · [Science News](https://www.sciencenews.org/article/human-math-record-twin-primes-openai) · [OpenAI paper (186)](https://cdn.openai.com/pdf/51126fac-1b68-4128-9666-c908bcc16033/short_gaps.pdf) · [Axiom (212)](https://primegaps.axiommath.ai/bgp212.pdf)

## 2026-09 · Tao: the exact twin-prime number matters less than the ideas found along the way
topic: primes, ai-math · modules: 03-primes
On September 5, 2026, Terence Tao posted a thread on Mathstodon. It traces the bounded-gaps story from Goldston–Pintz–Yıldırım (2005) through Zhang's 70 million (2013) and Polymath8's 246 (2014) to the September 2026 race among AI companies. He argues that the exact number matters little and that the value lies in the methods the problem produced, such as the Maynard sieve, now textbook material. He imagines an alternate history in which AI optimisers in 2005 "saturated" the problem before those ideas were ever found. He also gives collaborative uses of AI as a positive example.

**Why it connects:** This is Goodhart's law applied to mathematics: when a number becomes the target, it stops measuring understanding. It also explains why this repo's twin primes module focuses on the *why*.

**Sources:** [Tao on Mathstodon](https://mathstodon.xyz/@tao/117219548485446992)

## 2026-09 · Anthropic says Claude wrote a complete Lean proof of Fermat's Last Theorem
topic: logic, ai-math · modules: 05-self-reference, 03-primes
Anthropic says Claude, working largely on its own for about 11 days, produced a complete computer-checked formalization of Fermat's Last Theorem in the Lean proof assistant, reportedly about 13 million lines. Kevin Buzzard, who leads the human formalization project begun in 2024, called it a big step "provided the claim holds". Independent checking by the formal-math community was reported as ongoing.

**Why it connects:** Gödel says no formal system can prove every truth. Proof assistants work inside that limit: they mechanically check proofs that do exist, step by step, in a fixed formal system.

**Sources:** [Anthropic research post](https://www.anthropic.com/news/formalizing-fermats-last-theorem) · [The Next Web](https://thenextweb.com/news/anthropic-claude-fermat-last-theorem-lean-buzzard) · [Lean FLT project](https://lean-lang.org/use-cases/flt)

## 2026-09 · AI agents claim a Millennium Prize problem: Navier–Stokes blowup
topic: emergence, ai-math · modules: 02-emergence, 06-complexity
On September 8, 2026, OpenAI announced that about 10,000 autonomous AI agents had found a singularity, or *blowup*, in the 3D Navier–Stokes fluid equations, with the result formally checked in Lean. Quanta notes that the work builds heavily on human work by Diego Córdoba and Luis Martínez-Zoroa. A rival AI-assisted team (Tristan Buckmaster with Levent Alpöge) announced related results 12 hours earlier, and priority is disputed. It is not yet peer reviewed. Quanta calls it the most important AI-derived proof yet "if the result holds up to further scrutiny".

**Why it connects:** Simple local rules (Newton's laws for a fluid) can produce violently unexpected global behaviour. That is emergence, and it is the same "can you predict it without running it?" question as in the Game of Life.

**Sources:** [Quanta: AI Has Solved One of Math's $1 Million Millennium Prize Problems](https://www.quantamagazine.org/ai-has-solved-one-of-maths-1-million-millennium-prize-problems-20260908/) · [Buckmaster statement](https://cims.nyu.edu/~tristanb/statement.pdf)

## 2026-08 · Julia Stadlmann breaks the 12-year-old prime-gap record: 246 → 240
topic: primes · modules: 03-primes, 04-randomness
On August 31, 2026, Julia Stadlmann (University of Illinois Urbana–Champaign, a former student of James Maynard) posted a proof that infinitely many pairs of consecutive primes differ by at most **240**. This is the first improvement since Polymath8 reached 246 in 2014. Her key new tool is an equidistribution theorem for numbers with a large smooth factor, combined with optimised sieve weights. She posted early after hearing rumours of an AI announcement, and the record stood for about three days. It is not yet peer reviewed.

**Why it connects:** This is the sieve story in this repo's twin primes module: weights that filter composites only partly still reveal how primes are spaced. A human idea moved the number first, and the machines then optimised around it.

**Sources:** [arXiv 2608.31126](https://arxiv.org/abs/2608.31126) · [Science News](https://www.sciencenews.org/article/human-math-record-twin-primes-openai) · [MathWorld](https://mathworld.wolfram.com/BoundedGapsBetweenPrimes.html)

## 2026-08 · Topology cracks part of the Cohen–Lenstra conjecture behind "Gauss's riddle"
topic: primes, randomness · modules: 03-primes, 04-randomness
Aaron Landesman (Harvard) and Ishan Levy (IAS) proved function-field versions of the Cohen–Lenstra conjectures using a tool from homotopy theory. Cohen and Lenstra (1983) predicted the *average* behaviour of class groups, the structures behind Gauss's composition of quadratic forms, by treating them as random objects. The conjecture had been unproven for over 40 years. The proof covers the "function field" setting, not Gauss's original integers. Melanie Wood calls it "a real breakthrough".

**Why it connects:** No formula predicts a single case, but randomness predicts the average. It is the same heuristic that predicts how many twin primes there are.

**Sources:** [Scientific American](https://www.scientificamerican.com/article/mathematicians-make-a-breakthrough-on-gausss-riddle-unsolved-for-200-years/) · [IAS news](https://www.ias.edu/news/mathematicians-make-breakthrough-gausss-riddle-unsolved-200-years)

## 2026-07 · Tao at the International Congress: "a crisis in our mathematical values and practices"
topic: ai-math · modules: 05-self-reference
In his public lecture "Mathematics in the Age of AI" at the July 2026 International Congress of Mathematicians in Philadelphia, Terence Tao said AI has created "a crisis in our mathematical values and practices". He compared it to the foundational crisis of around 1900: "We are now entering a similarly turbulent period." He warned: "We are very, very close to a scenario in which a major result gets proved, and no human can understand and explain it." His essay version (August 2026) asks what the goals of mathematical research really are.

**Why it connects:** This is the "crisis" you remembered. Tao's comparison is to the crisis that led to Hilbert's program and then to Gödel's incompleteness theorems, which makes the present a sequel to the story in the self-reference module.

**Sources:** [Scientific American](https://www.scientificamerican.com/article/mathematicians-confront-the-ai-apocalypse/) · [Tao, "Mathematics in the age of AI" (arXiv)](https://arxiv.org/abs/2608.16753)

## 2026-05 · An AI model disproves Erdős's 80-year-old unit distance conjecture
topic: ai-math · modules: 03-primes, 06-complexity
On May 20, 2026, OpenAI announced that a general-purpose reasoning model had disproved Erdős's 1946 conjecture that n points in the plane have at most n^(1+o(1)) pairs at distance exactly one. The model built configurations with at least n^(1+δ) such pairs using algebraic number theory, and Will Sawin later showed one can take δ = 0.014. Tim Gowers said that had a human submitted it to the Annals of Mathematics, he "would have recommended acceptance without any hesitation."

**Why it connects:** A counterexample is something found and then easily checked, which is the P vs NP asymmetry. The construction grows out of how primes factor in number fields, generalising Erdős's own Gaussian-integer grid.

**Sources:** [OpenAI announcement](https://openai.com/index/model-disproves-discrete-geometry-conjecture/) · [Remarks by Alon, Bloom, Gowers, Litt, Sawin et al.](https://arxiv.org/abs/2605.20695) · [Quanta: Why the Legendary Erdős Problems Are Falling to AI](https://www.quantamagazine.org/why-the-legendary-erdos-problems-are-falling-to-ai-20260803/)

## 2026-02 · A "fully quantum" complexity theory
topic: complexity · modules: 06-complexity
Henry Yuen (Columbia) and collaborators are building a complexity theory for problems whose inputs and outputs are *quantum states*, not strings of bits. They showed that tasks which look unrelated are equivalent: breaking quantum commitments, decoding a black hole's Hawking radiation, compressing quantum information. Yuen calls one central problem (the Uhlmann transformation) "the hub from which all these other things radiate".

**Why it connects:** P and NP are defined for bit strings. Here a single hub problem ties many others together, the same way NP-complete problems do.

**Sources:** [Quanta: A New Complexity Theory for the Quantum Age](https://www.quantamagazine.org/a-new-complexity-theory-for-the-quantum-age-20260217/)

## 2026-01 · Two young amateurs use a public chatbot to settle an Erdős problem
topic: ai-math · modules: 03-primes
Kevin Barreto, a Cambridge undergraduate, and Liam Price, who left college without finishing, used GPT-5.2 Pro to solve Erdős problem #728, a divisibility question, by January 4, 2026. Nobody could find an earlier solution. Barreto checked the logic with a formal tool (Harmonic's Aristotle). An earlier "first autonomous solution" (#333, Christmas 2025) turned out to have been solved by Erdős himself in 1977. Price says he can't verify the proofs himself and relies on mathematicians to check them.

**Why it connects:** The open erdosproblems.com forum lets amateurs work next to Terence Tao. The story also shows that checking a proof and searching the literature are as much a part of the work as finding the proof.

**Sources:** [Quanta: Why the Legendary Erdős Problems Are Falling to AI](https://www.quantamagazine.org/why-the-legendary-erdos-problems-are-falling-to-ai-20260803/) · [Erdős #728 forum thread](https://www.erdosproblems.com/forum/thread/728?order=oldest) · [Formalized write-up](https://arxiv.org/abs/2601.07421)

## 2025-09 · The BB(5) proof gets a human-readable paper
topic: logic · modules: 05-self-reference, 06-complexity
In 2024 the online Busy Beaver Challenge proved BB(5) = 47,176,870, the longest any halting 5-state Turing machine can run, with a proof checked in the Coq proof assistant. In September 2025 the collaboration posted a human-readable account of the proof (revised March 2026). It works through about 181 million machines and settles for each one whether it halts.

**Why it connects:** Because the halting problem is undecidable, no single algorithm can do this for every machine size. BB(5) was settled one machine at a time, as far as diagonalization allows.

**Sources:** [arXiv 2509.12337](https://arxiv.org/abs/2509.12337) · [bbchallenge announcement](https://discuss.bbchallenge.org/t/july-2nd-2024-we-have-proved-bb-5-47-176-870/237)

## 2025-06 · BB(6) is at least 2↑↑↑5, a number beyond ordinary notation
topic: logic, recursion · modules: 05-self-reference, 01-recursion, 02-emergence
In June 2025 a contributor known as mxdys found a 6-state Turing machine that runs for more than 2↑↑↑5 steps (2 "pentated" to 5) before halting. Pinning down BB(6) exactly looks hopeless. One 6-state machine, nicknamed *Antihydra*, almost certainly never halts, but proving that is tied to a Collatz-like problem nobody can solve.

**Why it connects:** Tiny programs produce growth beyond any computable bound, which is undecidability made concrete. Up-arrow notation is recursion stacked on recursion, and Antihydra links back to the Collatz puzzle.

**Sources:** [Quanta: Busy Beaver Hunters Reach Numbers That Overwhelm Ordinary Math](https://www.quantamagazine.org/busy-beaver-hunters-reach-numbers-that-overwhelm-ordinary-math-20250822/) · [Scott Aaronson's blog](https://scottaaronson.blog/?p=8972) · [BusyBeaverWiki: BB(6)](https://wiki.bbchallenge.org/wiki/BB(6))

## 2025-04 · Shortest paths break the "sorting barrier", beating Dijkstra
topic: recursion, complexity · modules: 01-recursion, 06-complexity
Ran Duan and colleagues gave a deterministic shortest-path algorithm for directed graphs running in O(m log^(2/3) n) time. It is the first to beat Dijkstra's algorithm on sparse graphs, and it was presented at STOC 2025. Dijkstra effectively sorts vertices by distance, so it can never be faster than sorting. The new method avoids fully sorting the frontier.

**Why it connects:** n log n is the speed limit for comparison sorting, the bound quicksort meets on average. This result shows you can escape that limit when you don't need the full sorted order.

**Sources:** [Quanta: New Method Is the Fastest Way To Find the Best Routes](https://www.quantamagazine.org/new-method-is-the-fastest-way-to-find-the-best-routes-20250806/) · [arXiv 2504.17033](https://arxiv.org/abs/2504.17033)

## 2025-02 · Ryan Williams: a little memory outweighs a lot of time
topic: complexity, recursion · modules: 06-complexity, 01-recursion
MIT's Ryan Williams proved that any multitape Turing machine computation taking time t can be simulated in only about √(t log t) space. The previous best, from 50 years earlier, was t / log t. The proof builds on a space-efficient recursive algorithm for "tree evaluation" (Cook–Mertz). As a corollary, some problems solvable in linear space need nearly n² time, a small step toward separating P from PSPACE.

**Why it connects:** It is the first big progress in decades on how two resources (time and memory) relate, the same kind of question as P vs NP, and the proof works by cleverly reusing memory inside a recursion.

**Sources:** [Quanta: For Algorithms, a Little Memory Outweighs a Lot of Time](https://www.quantamagazine.org/for-algorithms-a-little-memory-outweighs-a-lot-of-time-20250521/) · [arXiv 2502.17779](https://arxiv.org/abs/2502.17779)

## 2025-02 · A student's hash table disproves a 40-year-old conjecture
topic: randomness, complexity · modules: 04-randomness, 06-complexity
Andrew Krapivin, then an undergraduate, together with Martín Farach-Colton and William Kuszmaul, showed that open-addressing hash tables can find items much faster than Andrew Yao's long-standing conjecture allowed. Yao's conjecture favoured uniform random probing. They also proved an optimal bound for the class of tables Yao studied.

**Why it connects:** It is structure beating plain randomness: a carefully designed probing scheme does better than "just probe at random", which everyone had assumed was best.

**Sources:** [Quanta: Undergraduate Upends a 40-Year-Old Data Science Conjecture](https://www.quantamagazine.org/undergraduate-upends-a-40-year-old-data-science-conjecture-20250210/) · [arXiv 2501.02305](https://arxiv.org/abs/2501.02305)

## 2025-01 · Hilbert's tenth problem is undecidable in every ring of integers
topic: logic · modules: 05-self-reference, 03-primes
Two independent teams proved that no algorithm can decide whether polynomial equations have solutions in the ring of integers of *any* number field. One team is Alpöge, Bhargava, Ho and Shnidman; the other is Koymans and Pagano. Matiyasevich's 1970 theorem settled this for the ordinary integers, and the new work extends it to every such number system.

**Why it connects:** The proofs encode computation into equations, so solving equations would solve the halting problem. It is the same self-referential trap as Gödel's, now shown to hold for all rings of integers in number fields.

**Sources:** [Quanta: New Proofs Probe the Limits of Mathematical Truth](https://www.quantamagazine.org/new-proofs-probe-the-limits-of-mathematical-truth-20250203/) · [arXiv 2501.18774](https://arxiv.org/abs/2501.18774)
