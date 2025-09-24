import java.util.Scanner;

public class TriangleType {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        // Read three side lengths
        int side1 = input.nextInt();
        int side2 = input.nextInt();
        int side3 = input.nextInt();

        // Check the type of triangle
        if (side1 == side2 && side2 == side3) {
            System.out.println("Equilateral");
        } else if (side1 == side2 || side2 == side3 || side1 == side3) {
            System.out.println("Isosceles");
        } else {
            System.out.println("Scalene");
        }
    }
}
