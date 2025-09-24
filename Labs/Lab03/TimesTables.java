import java.util.Scanner;

public class TimesTables {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        // Read the number we want the multiplication table of
        int number = input.nextInt();

        // Read the limit up to which we want the table
        int limit = input.nextInt();

        // Print the multiplication table
        for (int i = 1; i <= limit; i++) {
            System.out.println(number * i);
        }
    }
}
