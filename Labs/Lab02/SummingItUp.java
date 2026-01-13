import java.util.Scanner;

public class SummingItUp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int T = sc.nextInt();  // number of test cases

        for (int t = 0; t < T; t++) {
            int a = sc.nextInt();
            int b = sc.nextInt();

            // Find min and max so we always sum in the correct order
            int start = Math.min(a, b);
            int end = Math.max(a, b);

            // Use formula for sum of arithmetic sequence
            int n = end - start + 1; // number of terms
            long sum = (long) n * (start + end) / 2; // cast to long to avoid overflow

            System.out.println(sum);
        }

        sc.close();
    }
}
