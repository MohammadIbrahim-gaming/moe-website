public class Hud {
    public static void draw() {
        // y=0 is the TOP because Scene.setYscale(height, 0.0)
        StdDraw.setPenColor(StdDraw.WHITE);
        StdDraw.textLeft(20, 40, "Fuel: " + Player.getFuel());
    }
}
