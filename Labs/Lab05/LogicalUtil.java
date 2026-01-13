public class LogicalUtil {

    public static boolean thereExists(boolean p, boolean q, boolean r) {
        return p || q || r;
    }

    public static boolean forAll(boolean p, boolean q, boolean r) {
        return p && q && r;
    }

    public static boolean majority(boolean p, boolean q, boolean r) {
        int count = 0;
        if (p) count++;
        if (q) count++;
        if (r) count++;
        return count >= 2;
    }

    public static boolean minority(boolean p, boolean q, boolean r) {
        int count = 0;
        if (p) count++;
        if (q) count++;
        if (r) count++;
        return count <= 1;
    }

    public static boolean implies(boolean p, boolean q) {
        return !p || q;
    }

    public static boolean implies(boolean p, boolean q, boolean r) {
        return !(p && q) || r;
    }
}
