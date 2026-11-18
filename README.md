# Profound Studies

A personal study of the ideas I find most beautiful: **primes, emergence, recursion, randomness, self-reference and complexity**. I'm studying them to *understand* them, not just to prove things about them.

These topics look scattered, but they share a common thread: **a few simple rules, applied again and again, create unbounded structure, and that structure has limits that no shortcut can cross.** The full argument is in **[THE_THREAD.md](THE_THREAD.md)**.

Open **[index.html](index.html)** in a browser for an interactive map of how everything connects.

---

## The modules

| # | Module | Core question | Interactive |
|---|---|---|---|
| 01 | [Recursion](01-recursion/) | How can something defined in terms of itself be finite, useful and beautiful? | [quicksort.html](01-recursion/quicksort.html) |
| 02 | [Emergence](02-emergence/) | How do four rules on a grid produce gliders and computers? | [life.html](02-emergence/life.html) |
| 03 | [Primes](03-primes/) | Why do deterministic primes look random, and are there infinitely many twins? | [twin-primes.html](03-primes/twin-primes.html) |
| 04 | [Randomness](04-randomness/) | Why does flipping coins make algorithms faster, and is it really necessary? | [`miller_rabin.py`](04-randomness/miller_rabin.py) |
| 05 | [Self-reference](05-self-reference/) | How can a sentence say "I am not provable", and why does that break mathematics' dream? | [diagonal.html](05-self-reference/diagonal.html) |
| 06 | [Complexity](06-complexity/) | Among things we *can* compute, what can we compute *fast*? | — |

You don't have to go in order. Follow curiosity.

---

## How I study here

I used to study with **symbols and proofs only**. This time I'm adding three things:

1. **See it first.** Every idea gets a picture, an animation, or an experiment *before* the formal proof. The proof then explains what I've already seen.
2. **Connect it to the world.** For every idea, ask: where does this show up outside math? What would break if it were false?
3. **Struggle before asking.** I try each problem myself and write down where I got stuck. Only then do I ask an AI or look it up. AI is a tutor here, not a replacement for thinking. The feeling of understanding is the whole point.

Each module README follows the same shape:

- **The hook:** the question that makes it interesting
- **See it:** the visualization or experiment
- **The ideas:** the core concepts, building from intuition up to symbols
- **The proof path:** the formal side, broken into steps that aren't intimidating
- **In the world:** applications and implications
- **Connections:** links into the other modules
- **Open questions:** what I still don't understand

## Other files

- [`questions.md`](questions.md): a running log of curiosities, confusions and "aha" moments
- [`THE_THREAD.md`](THE_THREAD.md): the unifying idea (keep rewriting it)

## Running things

- `.html` files: open directly in any browser. They have no dependencies and work offline.
- `.py` files: plain Python 3 with no libraries required, e.g. `python3 03-primes/twin_primes.py`
