import java.util.Scanner;

public class RockPaperScissors {
    
    public static String rpsWinner(String p1, String p2) {
        if (p1.equals(p2)) {
            return "Tie!";
        } else if ((p1.equals("rock") && p2.equals("scissors")) ||
                   (p1.equals("scissors") && p2.equals("paper")) ||
                   (p1.equals("paper") && p2.equals("rock"))) {
            return "Player 1 wins!";
        } else {
            return "Player 2 wins!";
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int numCases = sc.nextInt(); // first line = number of test cases
        
        for (int i = 0; i < numCases; i++) {
            String p1 = sc.next();
            String p2 = sc.next();
            System.out.println(rpsWinner(p1, p2));
        }
        
        sc.close();
    }
}
