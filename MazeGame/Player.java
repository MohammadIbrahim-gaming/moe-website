public class Player {
    public static final int TILE_SIZE = 32;

    private static int x;
    private static int y;
    private static String image;

    public static void start(int x, int y) {
        Player.x = x;
        Player.y = y;
        image = "Assets/character-chicken.png";
    }

    public static void update() {
        if (StdDraw.hasNextKeyTyped()) {
            char key = StdDraw.nextKeyTyped();
            if (key == 'w' && Scene.canMove(x, y - 1)) {
                y--;
            } else if (key == 's' && Scene.canMove(x, y + 1)) {
                y++;
            } else if (key == 'a' && Scene.canMove(x - 1, y)) {
                x--;
            } else if (key == 'd' && Scene.canMove(x + 1, y)) {
                x++;
            }
        }
    }

    public static void draw() {
        int tileX = x * TILE_SIZE + TILE_SIZE / 2;
        int tileY = y * TILE_SIZE + TILE_SIZE / 2;
        StdDraw.picture(tileX, tileY, image);
    }

    public static int getX() { return x; }
    public static int getY() { return y; }
}