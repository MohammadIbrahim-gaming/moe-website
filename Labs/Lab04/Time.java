public class Time {

    // Converts seconds to minutes
    public static double secondsToMinutes(int seconds) {
        return seconds / 60.0;
    }

    // Converts seconds to hours
    public static double secondsToHours(int seconds) {
        return seconds / 3600.0; // 60 * 60
    }

    // Converts seconds to days
    public static double secondsToDays(int seconds) {
        return seconds / 86400.0; // 24 * 60 * 60
    }

    // Converts seconds to years
    public static double secondsToYears(int seconds) {
        return seconds / 31536000.0; // 365 * 24 * 60 * 60
    }

    // Converts minutes to seconds
    public static double minutesToSeconds(double minutes) {
        return minutes * 60.0;
    }

    // Converts hours to seconds
    public static double hoursToSeconds(double hours) {
        return hours * 3600.0; // 60 * 60
    }

    // Converts days to seconds
    public static double daysToSeconds(double days) {
        return days * 86400.0; // 24 * 60 * 60
    }

    // Converts years to seconds
    public static double yearsToSeconds(double years) {
        return years * 31536000.0; // 365 * 24 * 60 * 60
    }
}
