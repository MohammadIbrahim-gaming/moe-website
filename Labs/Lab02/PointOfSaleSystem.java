import java.util.Scanner;

public class PointOfSaleSystem {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        int numOrders = input.nextInt();
        input.nextLine(); 

        for (int i = 0; i < numOrders; i++) {
            double price = 0.0;
            String sequence = input.nextLine();
            String[] tokens = sequence.trim().split("\\s+");

            for (String t : tokens) {
                int order = Integer.parseInt(t);
                switch(order) {
                    case 1: price += 1.50; break;
                    case 2: price += 1.75; break;
                    case 3: price += 2.50; break;
                    case 4: price += 2.75; break;
                    case 5: price += 0.99; break; 
                    case 6: price += 1.25; break;
                }
            }

            price *= 1.065; 
            System.out.printf("%.2f%n", price); 
        }
        input.close();
    }
}
