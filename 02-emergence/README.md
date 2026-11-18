# 02 · Emergence

## The hook
John Conway's Game of Life (1970) has one grid, two states, and these rules:

- A dead cell with exactly **3** live neighbours is **born**.
- A live cell with **2 or 3** live neighbours **survives**.
- Every other cell dies or stays dead.

From those rules come objects that move (gliders), machines that build moving objects (glider guns), patterns that grow forever, and eventually **a universal computer**. None of these things is written in the rules.

## See it
Open **[life.html](life.html)**.
- Start with **Glider**. It's five cells that "walk" diagonally, even though no cell ever moves.
- Try the **R-pentomino**: 5 cells that churn chaotically for **1103 generations** before settling. Watch the population graph.
- Try the **Gosper glider gun**, the first pattern known to grow forever. Conway had offered $50 for one, and Bill Gosper's team won it in 1970.
- Press **Random soup** many times. What fraction of the grid survives in the long run? Does order always appear?

## The ideas
1. **Emergence:** higher-level objects (gliders) with their own "laws" (they move at speed c/4) arise from lower-level rules that know nothing about them.
2. **Levels of description:** you can describe a glider gun cell by cell or as "a gun that fires a glider every 30 generations". The second description is far more useful. Physics, chemistry and biology are each a level of description of the one below.
3. **Universality:** gliders can carry signals, collisions act as logic gates, and gates make a computer. Life is **Turing complete**: it can simulate any program.
4. **Undecidability:** because Life can simulate any program, "Will this pattern ever die out?" is as hard as the halting problem. No algorithm can always answer it.
5. **Computational irreducibility:** for some systems there is no shortcut. To know what happens at step one million, you must compute all million steps.

## The proof path
- [ ] Prove a glider returns to its own shape, shifted by (1,1), after 4 generations (just compute it by hand).
- [ ] Prove a 2×2 block is stable and a blinker has period 2.
- [ ] Understand (informally) how glider streams + collisions implement AND, OR, NOT.
- [ ] Read the sketch of why Life is Turing complete (Berlekamp, Conway & Guy, *Winning Ways*, vol. 2, ch. 25).
- [ ] Prove: if Life is Turing complete, then "does pattern P eventually die?" is undecidable (a reduction from the halting problem; see 05).
- [ ] Explore the 256 **elementary cellular automata** (1D). Rule 110 is also Turing complete (Matthew Cook, 2004).

## In the world
- **Biology:** pattern formation (Turing's 1952 morphogenesis paper, which explains zebra stripes), flocking, ant colonies.
- **Physics:** crystal growth, sandpiles, phase transitions.
- **Social systems:** traffic jams emerge from individually reasonable drivers.
- **AI:** neural networks show abilities nobody programmed explicitly. "Emergent capabilities" is an active and debated research topic.

## Connections
- → **01 Recursion:** each generation is the rule applied to the previous one, which is recursion through time.
- → **03 Primes:** primes also show emergent statistical "laws" (the Prime Number Theorem) from a one-line definition.
- → **05 Self-reference:** Life contains self-replicating patterns, the physical analogue of a quine.
- → **06 Complexity:** irreducibility is a complexity-theoretic idea. Is there a shortcut, or isn't there?

## Open questions
- Is "emergence" a precise mathematical concept, or just a word for our surprise?
- Why does random soup settle into such a predictable mix of blocks, blinkers and beehives?
