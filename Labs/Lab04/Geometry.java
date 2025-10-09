public class Geometry {

    // Returns the area of a rectangle
    public static double getAreaRectangle(double width, double length) {
        return length * width;
    }

    // Returns the area of a circle
    public static double getAreaCircle(double radius) {
        return Math.PI * radius * radius;
    }

    // Returns the area of a triangle
    public static double getAreaTriangle(double base, double height) {
        return 0.5 * base * height;
    }

    // Returns the perimeter of a rectangle
    public static double getPerimeterRectangle(double width, double length) {
        return 2 * (length + width);
    }

    // Returns the perimeter of a circle
    public static double getPerimeterCircle(double radius) {
        return 2 * Math.PI * radius;
    }

    // Returns the perimeter of a triangle
    public static double getPerimeterTriangle(double side1, double side2, double side3) {
        return side1 + side2 + side3;
    }
}
