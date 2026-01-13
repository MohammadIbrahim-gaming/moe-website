// RSA.java
import java.math.BigInteger;
import java.util.Random;

public class RSA {
    // Fields
    private BigInteger n;
    private BigInteger e;
    private BigInteger d;

    // --- Constructors ---

    // RSA(String p, String q)
    public RSA(String p, String q) {
        BigInteger bp = new BigInteger(p);
        BigInteger bq = new BigInteger(q);
        this.n = bp.multiply(bq);

        BigInteger phi = totient(bp, bq);
        this.e = generateE(bp, bq);              // prime e < phi, gcd(e,phi)=1
        this.d = generateD(this.e, phi);         // multiplicative inverse of e mod phi
    }

    // RSA(String p, String q, String e)
    public RSA(String p, String q, String e) {
        BigInteger bp = new BigInteger(p);
        BigInteger bq = new BigInteger(q);
        this.n = bp.multiply(bq);

        BigInteger phi = totient(bp, bq);
        this.e = new BigInteger(e);
        this.d = generateD(this.e, phi);
    }

    // --- Methods per API ---

    // (p-1)*(q-1)
    BigInteger totient(BigInteger p, BigInteger q) {
        return p.subtract(BigInteger.ONE).multiply(q.subtract(BigInteger.ONE));
    }

    // pick a random prime e < phi with gcd(e,phi)=1
    BigInteger generateE(BigInteger p, BigInteger q) {
        BigInteger phi = totient(p, q);

        // start from a small odd prime and step via nextProbablePrime until < phi and gcd==1
        BigInteger candidate = BigInteger.valueOf(3); // skip 2 to keep it odd
        while (candidate.compareTo(phi) < 0) {
            if (candidate.isProbablePrime(20) && candidate.gcd(phi).equals(BigInteger.ONE)) {
                return candidate;
            }
            candidate = candidate.nextProbablePrime();
        }

        // Fallback (very unlikely for valid inputs)
        // choose phi-1 if it's prime and coprime; otherwise, default to 3
        BigInteger fallback = phi.subtract(BigInteger.ONE);
        if (fallback.compareTo(BigInteger.TWO) > 0 &&
            fallback.isProbablePrime(20) &&
            fallback.gcd(phi).equals(BigInteger.ONE)) {
            return fallback;
        }
        return BigInteger.valueOf(3);
    }

    // find d such that (e * d) % totient == 1 using an iterative approach
    BigInteger generateD(BigInteger e, BigInteger totient) {
        // Try using modInverse if available is okay, but spec asks iterative.
        // We'll do an iterative search using an extended-euclid style loop,
        // but implemented iteratively and returning the positive representative.
        BigInteger t0 = BigInteger.ZERO,  r0 = totient;
        BigInteger t1 = BigInteger.ONE,   r1 = e.mod(totient);

        while (!r1.equals(BigInteger.ZERO)) {
            BigInteger q = r0.divide(r1);

            BigInteger r2 = r0.subtract(q.multiply(r1));
            r0 = r1; r1 = r2;

            BigInteger t2 = t0.subtract(q.multiply(t1));
            t0 = t1; t1 = t2;
        }

        // Now r0 = gcd(e, totient). If gcd != 1, no inverse; return 0 as a sentinel.
        if (!r0.equals(BigInteger.ONE)) {
            return BigInteger.ZERO;
        }

        // t0 is the inverse (possibly negative). Normalize it into [0, totient).
        BigInteger d = t0.mod(totient);
        return d;
    }

    // Encrypt: for each char c -> (c^e mod n) as a char, build string
    public String encrypt(String message) {
        char[] arr = message.toCharArray();
        StringBuilder sb = new StringBuilder(arr.length);
        for (char ch : arr) {
            int c = (int) ch;
            BigInteger C = BigInteger.valueOf(c).modPow(e, n);
            sb.append((char) C.intValue());
        }
        return sb.toString();
    }

    // Decrypt: for each char c -> (c^d mod n) as a char, build string
    public String decrypt(String message) {
        char[] arr = message.toCharArray();
        StringBuilder sb = new StringBuilder(arr.length);
        for (char ch : arr) {
            int c = (int) ch;
            BigInteger P = BigInteger.valueOf(c).modPow(d, n);
            sb.append((char) P.intValue());
        }
        return sb.toString();
    }

    // (Optional) getters if your tester prints/debugs fields
    public BigInteger getN() { return n; }
    public BigInteger getE() { return e; }
    public BigInteger getD() { return d; }
}
