public class Temperature {

    // Converts Celsius to Fahrenheit
    public static double celsiusToFahrenheit(double celsius) {
        return (9.0 / 5.0) * celsius + 32;
    }

    // Converts Celsius to Kelvin
    public static double celsiusToKelvin(double celsius) {
        return celsius + 273.15;
    }

    // Converts Fahrenheit to Celsius
    public static double fahrenheitToCelsius(double fahrenheit) {
        return (5.0 / 9.0) * (fahrenheit - 32);
    }

    // Converts Fahrenheit to Kelvin
    public static double fahrenheitToKelvin(double fahrenheit) {
        return (5.0 / 9.0) * (fahrenheit + 459.67);
    }

    // Converts Kelvin to Fahrenheit
    public static double kelvinToFahrenheit(double kelvin) {
        return (9.0 / 5.0) * kelvin - 459.67;
    }

    // Converts Kelvin to Celsius
    public static double kelvinToCelsius(double kelvin) {
        return kelvin - 273.15;
    }
}
