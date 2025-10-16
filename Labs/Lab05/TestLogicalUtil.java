public class TestLogicalUtil {
    public static void main(String[] args) {
        // From the samples
        System.out.println(LogicalUtil.thereExists(false, false, true)); // true
        System.out.println(LogicalUtil.forAll(true, true, true));        // true
        System.out.println(LogicalUtil.majority(true, true, false));     // true
        System.out.println(LogicalUtil.minority(false, false, false));   // true
        System.out.println(LogicalUtil.implies(true, false));            // false
        System.out.println(LogicalUtil.implies(true, true, false));      // false

        // A couple more
        System.out.println(LogicalUtil.majority(true, false, true));     // true
        System.out.println(LogicalUtil.minority(true, false, false));    // true
        System.out.println(LogicalUtil.implies(false, false));           // true
        System.out.println(LogicalUtil.implies(false, true));            // true
    }
}

