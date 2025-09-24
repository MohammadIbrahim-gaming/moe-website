import java.util.Scanner;

public class AsteriskTriangle {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        // Read number of rows
        int rows = input.nextInt();

        // Loop to print the triangle
        for (int i = 1; i <= rows; i++) {
            // Print i asterisks on each line
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println(); // Move to next line
        }
    }
}
