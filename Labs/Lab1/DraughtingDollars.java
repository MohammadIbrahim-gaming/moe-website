import java.util.Scanner;

public class DraughtingDollars {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        double percent = input.nextDouble();
        double price = input.nextDouble();

        double totalPints = (15.5 * 128) / 16;
        double value = percent * totalPints * price;

       System.out.printf("%.2f", value);

    }
}
