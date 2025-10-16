public class TestRadixUtil {
    public static void main(String[] args) {
        // From the samples
        System.out.println(RadixUtil.base2("111")); // 7
        System.out.println(RadixUtil.base2(7));     // "111"

        System.out.println(RadixUtil.base8("10"));  // 8
        System.out.println(RadixUtil.base8(8));     // "10"

        System.out.println(RadixUtil.base16("f"));  // 15
        System.out.println(RadixUtil.base16(15));   // "f"

        // A few extra checks
        System.out.println(RadixUtil.base16("1a")); // 26
        System.out.println(RadixUtil.base2(26));    // "11010"
        System.out.println(RadixUtil.base8(26));    // "32"
    }
}
