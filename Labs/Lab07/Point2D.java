// Point2D.java
public class Point2D {
    // Fields
    private double x;
    private double y;

    // Constructor
    public Point2D(double x, double y) {
        this.x = x;
        this.y = y;
    }

    // Getters
    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    // Moves the point to new coordinates
    public void moveTo(double x, double y) {
        this.x = x;
        this.y = y;
    }

    // Moves the point by dx and dy
    public void moveBy(double dx, double dy) {
        this.x += dx;
        this.y += dy;
    }

    // Returns distance between this point and another point
    public double distance(Point2D other) {
        double dx = this.x - other.x;
        double dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Returns a text representation of the point formatted to one decimal place
    @Override
    public String toString() {
        return String.format("(%.1f,%.1f)", x, y);
    }
}
