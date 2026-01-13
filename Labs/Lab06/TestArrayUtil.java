public class TestArrayUtil {
    public static void main(String[] args) {
        // Test reverse()
        String[] arr1 = {"a", "b", "c", "d", "e"};
        ArrayUtil.reverse(arr1);
        System.out.print("Reversed: ");
        for (String s : arr1) System.out.print(s + " ");
        System.out.println();  // Output: e d c b a

        // Test resize()
        String[] arr2 = {"x", "y", "z"};
        arr2 = ArrayUtil.resize(arr2);
        System.out.print("Resized: ");
        for (String s : arr2) System.out.print(s + " ");
        System.out.println();  // Output: x y z null null null

        // Test add()
        String[] arr3 = {"a", "b", "c"};
        arr3 = ArrayUtil.add("d", arr3);
        System.out.print("Added: ");
        for (String s : arr3) System.out.print(s + " ");
        System.out.println();  // Output: a b c d null null

        // Test contains()
        String[] arr4 = {"apple", "banana", "cherry"};
        System.out.println("Contains 'banana'? " + ArrayUtil.contains("banana", arr4)); // true
        System.out.println("Contains 'grape'? " + ArrayUtil.contains("grape", arr4));   // false
    }
}
