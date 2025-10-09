public class GeometryTest {
    public static void main(String[] args) {
        System.out.println("Area of Rectangle (1,1): " + Geometry.getAreaRectangle(1, 1));
        System.out.println("Area of Circle (1): " + Geometry.getAreaCircle(1));
        System.out.println("Area of Triangle (1,1): " + Geometry.getAreaTriangle(1, 1));
        System.out.println("Perimeter of Rectangle (1,1): " + Geometry.getPerimeterRectangle(1, 1));
        System.out.println("Perimeter of Circle (1): " + Geometry.getPerimeterCircle(1));
        System.out.println("Perimeter of Triangle (1,1,1): " + Geometry.getPerimeterTriangle(1, 1, 1));
    }
}
