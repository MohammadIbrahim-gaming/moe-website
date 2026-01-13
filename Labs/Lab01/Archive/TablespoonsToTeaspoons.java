import java.util.Scanner;
public class TablespoonsToTeaspoons{
	public static void main(String[] args){
		Scanner input = new Scanner(System.in);
		System.out.print("Enter number of tablespoons: ");
		int tablespoons = input.nextInt();
		int teaspoons = tablespoons * 3;
		System.out.println(teaspoons + " teaspoons");
	}
}