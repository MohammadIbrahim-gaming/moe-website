import java.util.Scanner;
import java.io.File;
import java.awt.event.KeyEvent;

public class Player {
    private static String shipImage;
    private static String thrusterUpImage;
    private static String thrusterLeftImage;
    private static String thrusterRightImage;
    private static String shipLandedImage;
    private static String shipCrashedImage;

    private static String sprite;
    private static int width, height;
    private static double x, y;
    private static int fuel;

    private enum State { FLYING, LANDED, CRASHED }
    private static State state = State.FLYING;

    public static void start(Scanner input) {
        shipImage          = "assets/" + input.next();
        thrusterUpImage    = "assets/" + input.next();
        thrusterLeftImage  = "assets/" + input.next();
        thrusterRightImage = "assets/" + input.next();
        shipLandedImage    = "assets/" + input.next();
        shipCrashedImage   = "assets/" + input.next();

        sprite = shipImage;

        width  = input.nextInt();
        height = input.nextInt();

        x = input.nextDouble();
        y = input.nextDouble();

        fuel = input.nextInt();

        state = State.FLYING;
    }

    private static boolean exists(String path) { return new File(path).exists(); }

    private static void move() {
        if (state != State.FLYING) return; // no control after landing/crash

        boolean changed = false;

        if (StdDraw.isKeyPressed(KeyEvent.VK_W) && fuel > 0) {
            Physics.thrustUp();
            if (exists(thrusterUpImage)) sprite = thrusterUpImage;
            fuel--;
            changed = true;
        }
        if (StdDraw.isKeyPressed(KeyEvent.VK_A) && fuel > 0) {
            Physics.thrustLeft();
            if (exists(thrusterRightImage)) sprite = thrusterRightImage;
            fuel--;
            changed = true;
        }
        if (StdDraw.isKeyPressed(KeyEvent.VK_D) && fuel > 0) {
            Physics.thrustRight();
            if (exists(thrusterLeftImage)) sprite = thrusterLeftImage;
            fuel--;
            changed = true;
        }

        if (!changed) sprite = shipImage;
    }

    public static void update() {
        if (state != State.FLYING) return;

        move();
        Physics.update();

        y += Physics.getVelocityY();
        x += Physics.getVelocityX();

        // Ground check (y grows downward; ground ≈ Scene.getHeight() - 15)
        if ((y + height) > (Scene.getHeight() - 15)) {
            boolean onPad = LandingPad.isTouching();
            boolean safe  = Physics.isSurvivableSpeed();

            if (onPad && safe) {
                state = State.LANDED;
                sprite = shipLandedImage; // we’ll handle missing file in draw()
            } else {
                state = State.CRASHED;
                sprite = shipCrashedImage; // fallback handled in draw()
            }
            Game.setGameOver(true);
        }
    }

    public static void draw() {
        // If we’ve landed and the image is missing, draw a HAPPY FACE so you always see it.
        if (state == State.LANDED) {
            if (exists(sprite)) {
                StdDraw.picture(x, y, sprite);
            } else {
                drawHappyFace(x, y, Math.max(width, height) * 0.8);
            }
            return;
        }

        // If we’ve crashed and the image is missing, just show the base ship.
        if (state == State.CRASHED) {
            if (exists(sprite)) {
                StdDraw.picture(x, y, sprite);
            } else {
                StdDraw.picture(x, y, shipImage);
            }
            return;
        }

        // FLYING:
        if (exists(sprite)) {
            StdDraw.picture(x, y, sprite);
        } else {
            StdDraw.picture(x, y, shipImage);
        }
    }

    // Simple happy face using StdDraw (always available)
    private static void drawHappyFace(double cx, double cy, double r) {
        // face
        StdDraw.setPenColor(StdDraw.YELLOW);
        StdDraw.filledCircle(cx, cy, r);

        // eyes
        StdDraw.setPenColor(StdDraw.BLACK);
        double ex = r * 0.35, ey = r * 0.25, er = r * 0.12;
        StdDraw.filledCircle(cx - ex, cy - ey, er);
        StdDraw.filledCircle(cx + ex, cy - ey, er);

        // smile (approximate with thick arc)
        StdDraw.setPenRadius(0.02);
        StdDraw.arc(cx, cy + r*0.05, r*0.55, 200, 340);
        StdDraw.setPenRadius(); // reset
    }

    // Getters for other classes
    public static int getHeight() { return height; }
    public static double getX()   { return x; }
    public static int getFuel()   { return fuel; }
}



