public class MazeGame {
    private static boolean gameOver;
    private static int level;

    public static void start() {
        gameOver = false;
        level = 0;
        World.start();        // reads all levels from stdin and stores them
        Scene.start(level);   // sets up scene for level 0
    }

    public static void update() {
        Player.update();

        // win condition: reached exit -> next level or game over
        if (Player.getX() == Exit.getX() && Player.getY() == Exit.getY()) {
            level++;
            if (level == World.getLength()) {
                gameOver = true;
            } else {
                Scene.start(level);
            }
        }
    }

    public static void render() {
        Scene.draw();
        Exit.draw();
        Player.draw();
        StdDraw.show(100); // small delay & show frame
    }

    public static void main(String[] args) {
        start();
        while (!gameOver) {
            update();
            render();
        }
    }
}