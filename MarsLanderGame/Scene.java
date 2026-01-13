import java.util.Scanner;
import java.io.File;

public class Scene {
    private static int width;
    private static int height;
    private static String image;

    public static void start(Scanner input) {
        width  = input.nextInt();
        height = input.nextInt();
        image  = "assets/" + input.next();
        StdDraw.setCanvasSize(width, height);
        StdDraw.setXscale(0.0, width);
        StdDraw.setYscale(height, 0.0); // (0,0) top-left; y increases downward
    }

    public static void draw() {
        // fallback to solid background if you don't have the image file
        if (new File(image).exists()) {
            StdDraw.picture(width / 2.0, height / 2.0, image);
        } else {
            StdDraw.clear(StdDraw.BLACK);
        }
    }

    // used by Player to detect “ground”
    public static int getHeight() {
        return height;
    }
}

