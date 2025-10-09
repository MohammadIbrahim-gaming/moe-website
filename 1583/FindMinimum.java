    public class FindMinimum {
        public static int findMinimum(int[] arr) {
            if (arr == null || arr.length == 0) {
                throw new IllegalArgumentException("Array cannot be null or empty.");
            }
            int min = arr[0];
            for (int i = 1; i < arr.length; i++) {
                if (arr[i] < min) {
                    min = arr[i];
                }
            }
            return min;
        }

        public static void main(String[] args) {
            int[] numbers = {5, 2, 8, 1, 9};
            int minimum = findMinimum(numbers);
            System.out.println("The minimum element is: " + minimum);
        }
    }