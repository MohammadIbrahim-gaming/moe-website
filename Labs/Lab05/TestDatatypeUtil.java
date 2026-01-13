public class TestDatatypeUtil {
    public static void main(String[] args) {
        System.out.println(DatatypeUtil.getType(1.0));    // double
        System.out.println(DatatypeUtil.getType(1.0f));   // float
        System.out.println(DatatypeUtil.getType(1));      // int
        System.out.println(DatatypeUtil.getType(1L));     // long
        System.out.println(DatatypeUtil.getType('1'));    // char
        System.out.println(DatatypeUtil.getType(true));   // boolean
        System.out.println(DatatypeUtil.getType("Hello"));// String
    }
}
