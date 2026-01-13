import java.util.Scanner;

public class BloggingHTML {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        String header = input.nextLine();
        String image = input.nextLine();
        String text = input.nextLine();
        String author = input.nextLine();
        String date = input.nextLine();

        String html = "<html><body><h1>" + header + "</h1>"
                    + "<img src='" + image + "' />"
                    + "<p>" + text + "</p>"
                    + "<small>By " + author + ", " + date + "</small>"
                    + "</body></html>";

        System.out.println(html);
    }
}
