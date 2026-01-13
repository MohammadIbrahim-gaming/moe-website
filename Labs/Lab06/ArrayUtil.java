public class ArrayUtil {

    // Problem 1: Reverse Array
    public static void reverse(String[] array) {
        if (array == null) return;
        int left = 0;
        int right = array.length - 1;

        while (left < right) {
            String temp = array[left];
            array[left] = array[right];
            array[right] = temp;
            left++;
            right--;
        }
    }

    // Problem 2: Resize Array (double the length)
    public static String[] resize(String[] array) {
        if (array == null) return null;
        String[] newArray = new String[array.length * 2];
        for (int i = 0; i < array.length; i++) {
            newArray[i] = array[i];
        }
        return newArray;
    }

    // Problem 3: Add Item to Array
    public static String[] add(String element, String[] array) {
        if (array == null) {
            String[] newArray = new String[1];
            newArray[0] = element;
            return newArray;
        }

        for (int i = 0; i < array.length; i++) {
            if (array[i] == null) {
                array[i] = element;
                return array;
            }
        }

        // No empty slot — resize and add at first null
        String[] resized = resize(array);
        resized[array.length] = element;
        return resized;
    }

    // Problem 4: Array Contains
    public static boolean contains(String element, String[] array) {
        if (array == null || element == null) return false;
        for (String item : array) {
            if (element.equals(item)) {
                return true;
            }
        }
        return false;
    }
}
