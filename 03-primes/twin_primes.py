"""
Twin primes: reality vs. the "random primes" prediction.

Run:  python3 twin_primes.py            (sieves up to 10^7)
      python3 twin_primes.py 100000000  (up to 10^8, needs ~100 MB RAM)

Before running, GUESS: will the random model over- or under-estimate,
and by how much?
"""
import bisect
import math
import sys
from collections import Counter

# Twin prime constant C2 = product over primes p >= 3 of p(p-2)/(p-1)^2
C2 = 0.6601618158468696


def sieve(n):
    """Sieve of Eratosthenes. is_prime[k] == 1 iff k is prime."""
    is_prime = bytearray([1]) * (n + 1)
    is_prime[0:2] = b"\x00\x00"
    for p in range(2, math.isqrt(n) + 1):
        if is_prime[p]:
            # cross out p*p, p*p+p, ... in one slice assignment
            is_prime[p * p :: p] = bytes(len(range(p * p, n + 1, p)))
    return is_prime


def li2(x, steps=4000):
    """Integral from 2 to x of dt / (ln t)^2, by Simpson's rule after t = e^u."""
    a, b = math.log(2), math.log(x)
    h = (b - a) / steps
    f = lambda u: math.exp(u) / (u * u)
    s = f(a) + f(b)
    for i in range(1, steps):
        s += (4 if i % 2 else 2) * f(a + i * h)
    return s * h / 3


def hardy_littlewood(x):
    return 2 * C2 * li2(x)


def naive_random_model(x):
    """Cramér's naive model: ignore that primes are odd, etc."""
    return x / math.log(x) ** 2


def main():
    N = int(sys.argv[1]) if len(sys.argv) > 1 else 10**7
    is_prime = sieve(N)
    primes = [p for p in range(2, N + 1) if is_prime[p]]

    # p starts a twin pair iff the next prime is p+2
    twin_starts = [p for p, q in zip(primes, primes[1:]) if q - p == 2]
    gaps = Counter(q - p for p, q in zip(primes, primes[1:]))

    checkpoints = [10**k for k in range(3, 20) if 10**k <= N]
    print("\nTwin prime pairs (p, p+2) with p+2 <= x\n")
    print(f"{'x':>14} {'actual':>10} {'naive x/ln²x':>14} {'Hardy–Littlewood':>18} {'actual / HL':>12}")
    for x in checkpoints:
        actual = bisect.bisect_right(twin_starts, x - 2)
        hl = hardy_littlewood(x)
        nv = naive_random_model(x)
        print(f"{x:>14,} {actual:>10,} {nv:>14,.0f} {hl:>18,.0f} {actual / hl:>12.4f}")

    print(f"\nMost common gaps between consecutive primes up to {N:,}")
    top = max(gaps.values())
    for gap, freq in sorted(gaps.items(), key=lambda kv: -kv[1])[:10]:
        bar = "█" * round(50 * freq / top)
        print(f"  gap {gap:>3}: {freq:>9,}  {bar}")
    print("\nQuestion: why do multiples of 6 dominate the gaps?\n")


if __name__ == "__main__":
    main()
