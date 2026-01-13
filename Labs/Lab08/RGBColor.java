public class RGBColor {
    // Fields
    private int red;
    private int green;
    private int blue;

    // Constructor
    public RGBColor(int red, int green, int blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    // equals: all three values the same
    public boolean equals(RGBColor other) {
        if (other == null) {
            return false;
        }
        return this.red == other.red &&
               this.green == other.green &&
               this.blue == other.blue;
    }

    // toString: "rgb(99,16,0)"
    public String toString() {
        return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    }

    // toHex: "#631000" style using %02x
    public String toHex() {
        String r = String.format("%02x", this.red);
        String g = String.format("%02x", this.green);
        String b = String.format("%02x", this.blue);
        return "#" + r + g + b;
    }

    // Getters
    public int getRed() {
        return this.red;
    }

    public int getGreen() {
        return this.green;
    }

    public int getBlue() {
        return this.blue;
    }
}
