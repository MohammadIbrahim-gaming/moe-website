import java.util.Scanner;

public class BouncerBot {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        int currMonth = input.nextInt();
        int currDay = input.nextInt();
        int currYear = input.nextInt();
        int birthMonth = input.nextInt();
        int birthDay = input.nextInt();
        int birthYear = input.nextInt();

        boolean birthday = (currMonth == birthMonth && currDay == birthDay);

        int age = currYear - birthYear;
        if (currMonth < birthMonth || (currMonth == birthMonth && currDay < birthDay))
            age--;

        boolean canEnter = birthday && age >= 21;
        System.out.println(canEnter);
    }
}
