# 01 · Recursion

## The hook
Quicksort fits in five lines:

```python
def quicksort(xs):
    if len(xs) <= 1:
        return xs
    pivot, rest = xs[0], xs[1:]
    return quicksort([x for x in rest if x < pivot]) + [pivot] + quicksort([x for x in rest if x >= pivot])
```

It never says *how* to sort the whole list. It only says how to reduce the problem to smaller copies of itself, plus what to do when the problem is trivially small. Somehow that is enough.

## See it
Open **[quicksort.html](quicksort.html)**.
- Watch the partitions nest inside each other. The colored band shows the current sub-problem, and the depth meter shows how deep the recursion is.
- Set the input to **already sorted** and the pivot to **first element**, and watch quicksort collapse into its worst case.
- Switch the pivot to **random**: the disaster disappears. That is your first glimpse of Module 04.

## The ideas
1. **Base case + reduction = recursion.** Every recursion needs (a) a case it can answer directly and (b) a way to shrink every other case toward it.
2. **Recursion ⇔ induction.** Proving quicksort correct *is* an induction on list length: *if quicksort sorts every shorter list, it sorts this one*. Recursion builds things, and induction proves things about them. They are the same shape.
3. **Divide and conquer.** If each split is roughly even, there are about log₂ n levels and each level does about n work, so the cost is n log n.
4. **The cost of bad splits.** If the pivot is always the smallest element, there are n levels, giving about n²/2 comparisons. For a million items, that's 20 million comparisons versus 500 billion.
5. **Randomness as insurance.** A random pivot makes the *expected* number of comparisons about 2n ln n ≈ 1.39 n log₂ n for **every** input. No adversary can choose a bad input, because the bad luck is in your coin flips, not in their data.

## The proof path
- [ ] Prove quicksort is correct by strong induction on length.
- [ ] Derive the worst case: `C(n) = C(n-1) + (n-1)` ⇒ `C(n) = n(n-1)/2`.
- [ ] Derive the best case: `C(n) = 2C(n/2) + n` ⇒ `C(n) ≈ n log₂ n`. Draw the recursion tree.
- [ ] **The beautiful one:** expected comparisons for random pivot. Elements of rank i and j (i < j) are compared **iff** one of them is the first pivot chosen among ranks i..j, which happens with probability `2/(j-i+1)`. Summing gives `≈ 2n ln n`. Linearity of expectation does all the work, so no recurrence is needed.
- [ ] Bonus: the Master Theorem, a general rule for solving divide-and-conquer recurrences.

## In the world
- Variants of quicksort (introsort, pdqsort) are the default sort in C++ `std::sort`, Rust's `sort_unstable` and Go's `sort`.
- Recursion is how compilers parse code, how file systems walk directories, and how fractals and many natural forms (ferns, rivers, lungs) are described.

## Connections
- → **04 Randomness:** the random pivot is the simplest example of randomness making an algorithm robust.
- → **05 Self-reference:** recursion is a function referring to itself. Gödel's sentence is a *statement* referring to itself.
- → **02 Emergence:** iterating a simple rule is recursion over time.
- → **06 Complexity:** n² vs n log n is your first taste of how algorithm cost is measured.

## Open questions
- Why is "pick the median as pivot" not the obvious fix? (It is possible in linear time with the "median of medians" algorithm. Why isn't it used in practice?)
- Is there a sense in which *every* computation is a recursion? (Look up: μ-recursive functions, the lambda calculus.)
