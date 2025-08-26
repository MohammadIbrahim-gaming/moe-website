import java.util.Scanner;

public class AreaOfASquare {
	public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.print("Enter length of the square: ");
        int length = input.nextInt();
        int area = length * length;
        System.out.println("The area of theis sqaure is " + area );
	}
}