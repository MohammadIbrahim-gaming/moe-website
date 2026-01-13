public class Scene {
    private static final int TILE_SIZE = 32;

    private static int rows;
    private static int cols;
    private static boolean[][] walls; // true = wall, false = floor
    private static int width;  // pixels
    private static int height; // pixels

    private static String floorImage;
    private static String wallImage;

    public static void start(int level) {
        floorImage = "Assets/tile-passage.png";
        wallImage  = "Assets/tile-brickwall.png";

        String[][] map = World.getLevel(level);
        rows = map.length;
        cols = map[0].length;
        width = cols * TILE_SIZE;
        height = rows * TILE_SIZE;
        walls = new boolean[rows][cols];

        // Parse map tiles to populate walls and spawnables
        for (int y = 0; y < rows; y++) {
            for (int x = 0; x < cols; x++) {
                String tile = map[y][x];
                setTile(x, y, tile);
            }
        }

        // Setup canvas data (size & scale)
        StdDraw.setCanvasSize(width, height);
        StdDraw.setXscale(0.0, width);
        StdDraw.setYscale(height, 0.0);
        StdDraw.clear();
    }

    public static void setTile(int x, int y, String tile) {
        if (tile.equals("#")) {
            walls[y][x] = true; // wall
        } else {
            walls[y][x] = false; // floor-like tile (., @, !)
        }

        // Spawns (player, exit) are discovered during tile pass
        if (tile.equals("@")) {
            Player.start(x, y);
        } else if (tile.equals("!")) {
            Exit.start(x, y);
        }
    }

    public static boolean canMove(int x, int y) {
        // bounds check to avoid ArrayIndexOutOfBounds
        if (y < 0 || y >= rows || x < 0 || x >= cols) {
            return false;
        }
        return !walls[y][x];
    }

    public static void draw() {
        for (int y = 0; y < rows; y++) {
            for (int x = 0; x < cols; x++) {
                int tileX = x * TILE_SIZE + TILE_SIZE / 2;
                int tileY = y * TILE_SIZE + TILE_SIZE / 2;
                if (walls[y][x]) {
                    StdDraw.picture(tileX, tileY, wallImage);
                } else {
                    StdDraw.picture(tileX, tileY, floorImage);
                }
            }
        }
    }
}