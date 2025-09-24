import java.util.Scanner;

public class WhileLoop {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        int count = 1;

        while (count <= 10) {
            // Write your code here
            System.out.print("Enter mark for student " + count + ": ");
            int mark = input.nextInt();

            if (mark >= 80) {
                System.out.println("Grade: A");
            } else if (mark >= 60) {
                System.out.println("Grade: B");
            } else {
                System.out.println("Grade: C");
            }

            count++;
        }

        input.close();
    }
}