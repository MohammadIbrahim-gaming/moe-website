// FractionTester.java
public class FractionTester {
    public static void main(String[] args) {
        Fraction f1 = new Fraction(1, 2);
        Fraction f2 = new Fraction(1, 3);
        Fraction f3 = f1.add(f2);

        System.out.printf("%s+%s=%s%n", f1.toString(), f2.toString(), f3.toString());
        // Expected: (1/2)+(1/3)=(5/6)

        // A few more quick checks:
        System.out.println("Subtract: " + f1.subtract(f2)); // (1/2)-(1/3)=(1/6)
        System.out.println("Multiply: " + f1.multiply(f2)); // (1/2)*(1/3)=(1/6)
        System.out.println("Divide:   " + f1.divide(f2));   // (1/2)/(1/3)=(3/2)
    }
}
