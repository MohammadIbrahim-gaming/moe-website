public static int findMinimum(int[] arr) {
    // Handle empty array case
    if (arr == null || arr.length == 0) {
        return -1;
    }

    // Assume first element is the minimum
    int min = arr[0];

    // Loop through array to find the actual minimum
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
    }

    return min;
}
