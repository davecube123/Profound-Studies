"""
Randomness as a superpower: the Miller–Rabin primality test.

Run:  python3 miller_rabin.py

Three experiments:
  1. Carmichael numbers fool the Fermat test for almost every base,
     but Miller–Rabin catches them.
  2. How a single "witness" proves a number composite.
  3. Finding a 1024-bit prime (~309 digits) in a fraction of a second.
"""
import math
import random
import time


def fermat_says_prime(n, a):
    """Fermat test: if n is prime then a^(n-1) = 1 (mod n)."""
    return pow(a, n - 1, n) == 1


def miller_rabin_says_prime(n, a):
    """One round of Miller–Rabin with base a.

    Write n-1 = 2^s * d with d odd. Look at the sequence
        a^d, a^(2d), a^(4d), ..., a^(2^s d) = a^(n-1)   (mod n)
    If n is prime, each term is the square of the previous, and the only
    square roots of 1 mod a prime are +1 and -1. So the sequence must either
    start at 1 or hit -1 somewhere before the end. If not, a is a WITNESS
    that n is composite.
    """
    if n % 2 == 0:
        return n == 2
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    x = pow(a, d, n)
    if x in (1, n - 1):
        return True
    for _ in range(s - 1):
        x = x * x % n
        if x == n - 1:
            return True
    return False


def is_probable_prime(n, rounds=40):
    if n < 2:
        return False
    for p in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        if n % p == 0:
            return n == p
    for _ in range(rounds):
        a = random.randrange(2, n - 1)
        if not miller_rabin_says_prime(n, a):
            return False  # certain: composite
    return True  # wrong with probability < 4^-rounds


def experiment_liars():
    print("1. Liars: how many bases a (coprime to n) wrongly say 'prime'?\n")
    print(f"{'n':>8} {'factorization':>16} {'Fermat liars':>14} {'Miller–Rabin liars':>20}")
    for n, fac in [(561, "3·11·17"), (1105, "5·13·17"), (1729, "7·13·19"),
                   (8911, "7·19·67"), (221, "13·17"), (1001, "7·11·13")]:
        bases = [a for a in range(2, n - 1) if math.gcd(a, n) == 1]
        f = sum(fermat_says_prime(n, a) for a in bases) / len(bases)
        m = sum(miller_rabin_says_prime(n, a) for a in bases) / len(bases)
        print(f"{n:>8} {fac:>16} {f:>13.1%} {m:>19.1%}")
    print("\n   The first four are Carmichael numbers: Fermat is fooled by EVERY coprime base.")
    print("   Miller–Rabin liars never exceed 25% (Rabin, 1980), so each round at least")
    print("   quarters the chance of error.\n")


def experiment_witness():
    n, a = 561, 2
    print(f"2. Watching a witness: n = {n}, base a = {a}")
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    print(f"   n-1 = {n-1} = 2^{s} · {d}")
    x = pow(a, d, n)
    seq = [x]
    for _ in range(s):
        x = x * x % n
        seq.append(x)
    print("   sequence a^(2^k d) mod n:", " → ".join(map(str, seq)))
    for i in range(1, len(seq)):
        if seq[i] == 1 and seq[i - 1] not in (1, n - 1):
            r = seq[i - 1]
            print(f"   {r}² ≡ 1 (mod {n}) but {r} ≢ ±1. A prime has no such square root, so {n} is composite.")
            print(f"   Bonus: gcd({r} - 1, {n}) = {math.gcd(r - 1, n)} is a factor!\n")
            break


def experiment_big_prime(bits=1024):
    print(f"3. Finding a random {bits}-bit prime")
    t0 = time.perf_counter()
    tries = 0
    while True:
        tries += 1
        n = random.getrandbits(bits) | (1 << (bits - 1)) | 1  # full size, odd
        if is_probable_prime(n):
            break
    dt = time.perf_counter() - t0
    expected = math.log(2**bits) / 2
    print(f"   found after {tries} odd candidates (PNT predicts ≈ {expected:.0f}) in {dt:.2f}s")
    s = str(n)
    print(f"   {len(s)} digits: {s[:40]}…{s[-20:]}\n")
    print("   This is exactly how RSA keys are generated.\n")


if __name__ == "__main__":
    experiment_liars()
    experiment_witness()
    experiment_big_prime()
