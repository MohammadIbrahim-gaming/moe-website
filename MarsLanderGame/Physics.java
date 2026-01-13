import java.util.Scanner;

public class Physics {
    private static double velocityX;
    private static double velocityY;
    private static double gravity;
    private static double maxSurvivableVelocity;
    private static double thrust;

    // Reads: gravity, max survivable velocity, thrust (in that order) from level0.txt
    public static void start(Scanner input) {
        gravity = input.nextDouble();          // e.g. -0.1 in your file
        maxSurvivableVelocity = input.nextDouble(); // e.g. 2.0
        thrust = input.nextDouble();           // e.g. 0.5
        velocityX = 0.0;
        velocityY = 0.0;
    }

    // With Scene.setYscale(height, 0.0), y grows downward.
    // If gravity = -0.1, then velocityY -= gravity => velocityY increases (downward).
    public static void update() {
        velocityY -= gravity;
    }

    public static void thrustUp()    { velocityY -= thrust; }
    public static void thrustRight() { velocityX += thrust; }
    public static void thrustLeft()  { velocityX -= thrust; }

    public static double getVelocityX() { return velocityX; }
    public static double getVelocityY() { return velocityY; }

    // Iteration 9: land only if vertical speed is gentle enough
    public static boolean isSurvivableSpeed() {
        return velocityY < maxSurvivableVelocity;
    }
}
