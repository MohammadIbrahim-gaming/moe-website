public class TimeTest {
    public static void main(String[] args) {
        System.out.println("secondsToMinutes(1): " + Time.secondsToMinutes(1));
        System.out.println("secondsToHours(1): " + Time.secondsToHours(1));
        System.out.println("secondsToDays(1): " + Time.secondsToDays(1));
        System.out.println("secondsToYears(1): " + Time.secondsToYears(1));
        System.out.println("minutesToSeconds(1.0): " + Time.minutesToSeconds(1.0));
        System.out.println("hoursToSeconds(1.0): " + Time.hoursToSeconds(1.0));
        System.out.println("daysToSeconds(1.0): " + Time.daysToSeconds(1.0));
        System.out.println("yearsToSeconds(1.0): " + Time.yearsToSeconds(1.0));
    }
}
