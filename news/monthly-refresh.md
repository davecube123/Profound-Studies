# Monthly news refresh (instructions for Claude)

Use these instructions as a scheduled task's prompt, or say "follow news/monthly-refresh.md" in any Claude Code session on this repo.

---

Goal: add verified recent developments (since the newest item already in the file) to `news/news.md`, then commit and push to the branch `ccr-5f0b52e4-xgmfju` (the repo's default branch). Do not open a pull request.

1. Check out `ccr-5f0b52e4-xgmfju`. Read `news/news.md` fully. Its header explains the exact format the app parses: `## YYYY-MM · Headline`, then `topic: … · modules: …`, then 2–4 sentences, a `**Why it connects:**` paragraph and a `**Sources:**` line.
   - Allowed topics: primes, complexity, randomness, logic, emergence, recursion, ai-math.
   - Allowed modules: 01-recursion, 02-emergence, 03-primes, 04-randomness, 05-self-reference, 06-complexity.
   - Skim `README.md` and `THE_THREAD.md` so that each "Why it connects" note matches the repo's themes. These are twin primes and sieves, structure vs randomness, recursion and quicksort, the Game of Life and emergence, Gödel, halting and diagonalization, P vs NP, randomized algorithms, and how AI is changing math research.

2. Research developments from roughly the past six weeks on these topics:
   - twin primes, prime gaps, the Riemann hypothesis, and primes generally
   - Collatz
   - Busy Beaver
   - the Game of Life and cellular automata
   - computational complexity, derandomization, sorting and algorithms
   - logic, undecidability, and proof assistants (Lean)
   - AI in mathematical research: Erdős problems, Terence Tao's commentary, formal verification

   Good sources: Quanta Magazine, Terence Tao's blog and Mathstodon, erdosproblems.com, Science News, Scientific American, Nature, arXiv, Scott Aaronson's blog, the Computational Complexity blog, bbchallenge.org, conwaylife.com and MathWorld.

3. Accuracy is the top priority.
   - Include an item only if you confirmed it from a source page, not just a search snippet.
   - State its status honestly: claimed, preprint, peer reviewed, Lean-verified, or disputed.
   - Quote people only with the exact wording found in sources.
   - Do not duplicate existing items. If a story already in the file has a significant update, for example a claimed result was confirmed or refuted, add a new dated item about the update.
   - Aim for 3–8 items. If little happened, add fewer. Add none rather than padding.

4. Insert new items directly after the "### Keep up yourself" list, newest first. Keep the file's existing style: plain, precise, and written for a curious non-professional.

5. In `sw.js`, increment the `VERSION` string (for example `'ps-v4'` to `'ps-v5'`) so installed apps refresh their offline cache.

6. Check that the app still parses the file. Every new item heading must match `## YYYY-MM · ` and have the topic/modules line directly under it. If Node and Playwright are available, load `index.html#/news` from a local static server and confirm there are no console errors.

7. Commit with a message like "News: <Month YYYY> developments" and push to `origin ccr-5f0b52e4-xgmfju`, retrying network failures up to 4 times. If the push is rejected because the remote has new commits, fetch and merge (never force-push), then push again.

8. Finish with a short summary listing the headlines you added (or saying nothing qualified), and anything you could not verify.
