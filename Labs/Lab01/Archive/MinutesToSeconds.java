import java.util.Scanner;
public class MinutesToSeconds {
	public static void main(String[] args){
		Scanner scanner = new Scanner(System.in);
		System.out.print("enter number of minutes: ");
		int minutes = scanner.nextInt();
		int seconds = minutes * 60;
		System.out.println(seconds + " seconds");
}
}