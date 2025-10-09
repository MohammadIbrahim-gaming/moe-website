public class Cooking {

    // Converts teaspoons to tablespoons
    public static double teaspoonsToTablespoons(double teaspoons) {
        return teaspoons / 3.0;
    }

    // Converts tablespoons to teaspoons
    public static double tablespoonsToTeaspoons(double tablespoons) {
        return tablespoons * 3.0;
    }

    // Converts tablespoons to cups
    public static double tablespoonsToCups(double tablespoons) {
        return tablespoons / 16.0;
    }

    // Converts cups to tablespoons
    public static double cupsToTablespoons(double cups) {
        return cups * 16.0;
    }

    // Converts ounces to cups
    public static double ouncesToCups(double ounces) {
        return ounces / 8.0;
    }

    // Converts cups to ounces
    public static double cupsToOunces(double cups) {
        return cups * 8.0;
    }

    // Converts cups to pints
    public static double cupsToPints(double cups) {
        return cups / 2.0;
    }

    // Converts pints to cups
    public static double pintsToCups(double pints) {
        return pints * 2.0;
    }
}
