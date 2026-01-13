import java.util.Scanner;
import java.io.File;

public class Game {
    private static boolean gameOver;

    public static void main(String[] args) {
        start();
        while (!gameOver) {
            update();
            render();
        }
        // Leave the last frame up for a moment
        StdDraw.pause(1000);
    }

    public static void start() {
        gameOver = false;
        StdDraw.enableDoubleBuffering();

        try {
            File f = new File("assets/level0.txt");
            if (!f.exists()) {
                // Fallback: show a window with a message so you SEE something
                StdDraw.setCanvasSize(800, 450);
                StdDraw.setXscale(0.0, 800);
                StdDraw.setYscale(450, 0.0); // y=0 at top
                StdDraw.clear();
                StdDraw.text(400, 200, "Missing assets/level0.txt");
                StdDraw.text(400, 230, "Create assets/level0.txt and images in assets/");
                StdDraw.show();
                // Also print working dir to terminal for debugging
                System.err.println("Working directory: " + new File(".").getAbsolutePath());
                listAssetsDir();
                // Stop the game loop so it doesn’t spin
                gameOver = true;
                return;
            }

            Scanner input = new Scanner(f);
            Scene.start(input);
            Player.start(input);
            Physics.start(input);
            LandingPad.start(input);

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Working directory: " + new File(".").getAbsolutePath());
            listAssetsDir();
            gameOver = true;
        }
    }

    public static void update() {
        if (!gameOver) {
            Player.update();
        }
    }

    public static void render() {
      
        Scene.draw();
        Player.draw();
        LandingPad.draw();
        Hud.draw();              // draw HUD LAST so it’s on top
        StdDraw.show(16);        // ~60 FPS
    }

    public static void setGameOver(boolean value) {
        gameOver = value;
    }

    private static void listAssetsDir() {
        try {
            File dir = new File("assets");
            if (dir.exists() && dir.isDirectory()) {
                System.err.println("assets/ contains:");
                String[] files = dir.list();
                if (files != null) {
                    for (String s : files) System.err.println("  - " + s);
                }
            } else {
                System.err.println("No assets/ directory found next to your .java files.");
            }
        } catch (Exception ignore) {}
    }
}

