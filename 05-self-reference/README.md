# 05 · Self-reference and Gödel

## The hook
In 1931, Kurt Gödel (then 25) showed that any consistent formal system strong enough to do basic arithmetic contains a sentence that, in effect, says:

> **"This sentence cannot be proved in this system."**

If the system could prove it, it would prove something false. So, if the system is consistent, the sentence is unprovable, and therefore *true*. Truth and provability come apart.

Hilbert hoped for a complete, consistent foundation of mathematics. This result showed it cannot exist.

## Why it feels intimidating, and the way in
The *idea* is one sentence long. The difficulty is all **bookkeeping**: how can arithmetic, which talks about numbers, talk about its own sentences? The path below separates the idea from the bookkeeping, and it starts with the easier version Turing gave five years later.

## See it
- Open **[diagonal.html](diagonal.html)**. One picture covers Cantor, Turing and Gödel.
- Run `python3 quine.py`. It prints its own source code exactly. Self-reference without paradox.

### How the quine works
```python
s = 's = %r\nprint(s %% s)'
print(s % s)
```
`s` is a **template**: the program's code with a hole (`%r`) where its own text should go. `s % s` fills the hole with a quoted copy of the template itself. So the program contains a *description* of itself and a rule for *applying the description to itself*.

That is exactly Gödel's diagonal lemma. The philosopher W.V.O. Quine put it in words: *"yields falsehood when preceded by its quotation" yields falsehood when preceded by its quotation.* The sentence talks about itself without ever containing itself.

## The proof path (gentle → full)

**Stage 1. Cantor's diagonal (1891).** List infinite binary sequences as rows. Build a new sequence by flipping the diagonal: its n-th bit is the opposite of row n's n-th bit. It differs from every row, so *no list contains all sequences*. Some infinities are bigger than others.

**Stage 2. Turing's halting problem (1936).** Suppose a program `HALTS(P, x)` always correctly answers "does P halt on input x?". Build:
```
def D(P):
    if HALTS(P, P): loop forever
    else: halt
```
Does `D(D)` halt? Either answer contradicts itself. So `HALTS` cannot exist. *This is Cantor's diagonal with programs as rows and inputs as columns.*

**Stage 3. Incompleteness from halting (an easy version of Gödel).** Suppose a consistent system proves *every* true statement of the form "program P never halts on x". Then to decide halting, run P and search through all proofs at the same time. Either P halts, or a proof that it doesn't eventually appears. That would solve the halting problem, which is impossible. **So some true statement "P doesn't halt" is unprovable.** That is incompleteness. (Strictly, this argument also assumes the system never proves false halting claims, which holds if all its axioms are true.)

**Stage 4. The real Gödel, piece by piece.**
1. **Gödel numbering:** encode every symbol, formula and proof as a number. Statements *about formulas* become statements *about numbers*.
2. **Provability is arithmetic:** "x is the code of a proof of the formula with code y" is a (complicated but mechanical) arithmetic relation `Proof(x, y)`. Define `Prov(y) = ∃x Proof(x, y)`.
3. **The diagonal lemma:** for *any* property F, there is a sentence G with `G ↔ F(⌜G⌝)`, meaning G says "I have property F". *This is the same trick as the quine.*
4. **Choose F = "not provable":** G ↔ ¬Prov(⌜G⌝).
5. **Conclude:** if the system is consistent, G is not provable. If it is also ω-consistent (or using Rosser's trick, just consistent), ¬G is not provable either.

**Stage 5. The second theorem.** Formalize Stage 4 *inside* the system. If the system proved its own consistency, it would prove G, a contradiction. **No consistent system that is strong enough can prove its own consistency.**

- [ ] Stage 1: re-derive it on paper.
- [ ] Stage 2: write the D program yourself and argue both cases.
- [ ] Stage 3: understand why "search through all proofs" is a legitimate algorithm.
- [ ] Stage 4: understand how `quine.py` works, then read the diagonal lemma proof. They have the same structure.
- [ ] Read: *Gödel's Proof* (Nagel & Newman), short and gentle. Then *Gödel, Escher, Bach* (Hofstadter) for the deeper links. For rigor: Peter Smith, *An Introduction to Gödel's Theorems*.

## In the world
- **Rice's theorem:** *every* non-trivial question about what a program does is undecidable. That is why antivirus software, compilers and bug-finders must approximate.
- **Proof assistants (Lean, Coq):** formal systems made real. Gödel limits them, yet they are now used to verify research mathematics and are a big part of how AI is entering mathematics.
- **Philosophy of mind:** whether Gödel shows minds aren't machines (Lucas, Penrose) is a famous and mostly rejected argument. It's still worth understanding why it fails.

## Connections
- → **01 Recursion:** quines and Kleene's recursion theorem. Programs can always obtain their own source code.
- → **02 Emergence:** Life is Turing complete, so questions about Life's future are undecidable.
- → **06 Complexity:** the time-hierarchy theorem (more time lets you solve strictly more problems) is the diagonal argument again, this time with a clock.
- → **03 Primes:** could Goldbach or the twin prime conjecture be true but unprovable? Gödel allows it, though most mathematicians doubt it.

## Open questions
- Exactly what *is* the parallel between the quine and the diagonal lemma? Write it as a table.
- Gödel's sentence is "true". True in what sense, if not provable?
