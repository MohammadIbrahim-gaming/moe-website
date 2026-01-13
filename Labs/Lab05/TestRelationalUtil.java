public class TestRelationalUtil {
    public static void main(String[] args) {
        // From the samples
        System.out.println(RelationalUtil.isIncreasing(1, 2, 3)); // true
        System.out.println(RelationalUtil.isDecreasing(3, 2, 1)); // true
        System.out.println(RelationalUtil.isBetween(-1, 0, 1));   // true
        System.out.println(RelationalUtil.isPositive(1));         // true
        System.out.println(RelationalUtil.isNegative(-1));        // true
        System.out.println(RelationalUtil.overlaps(0, 1, -1, 2)); // true
        System.out.println(RelationalUtil.overlaps(0, 1, 2, 3));  // false

        // Extra edge cases
        System.out.println(RelationalUtil.isIncreasing(1, 1, 2)); // false (exclusive)
        System.out.println(RelationalUtil.isDecreasing(3, 3, 2)); // false (exclusive)
        System.out.println(RelationalUtil.isBetween(5, 5, 9));    // true (inclusive)
        System.out.println(RelationalUtil.overlaps(0, 0, 0, 0));  // true (single point overlap)
        System.out.println(RelationalUtil.overlaps(-3, -1, -2, 2));// true
    }
}
