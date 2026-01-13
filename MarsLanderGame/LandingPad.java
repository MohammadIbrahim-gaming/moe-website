import java.util.Scanner;

public class LandingPad {
    private static int x;      // center x of the pad
    private static int width;  // half-width of the pad

    public static void start(Scanner input) {
        x = input.nextInt();
        width = input.nextInt();
    }

    public static void draw() {
        int padY = Scene.getHeight() - 20;
        StdDraw.setPenColor(StdDraw.RED);
        StdDraw.filledRectangle(x, padY, width, 5);
    }

    // ---- This is the method Player.update() calls ----
    public static boolean isTouching() {
        return Math.abs(Player.getX() - x) < width;
    }

    public static int getX() { return x; }
    public static int getHalfWidth() { return width; }
}
