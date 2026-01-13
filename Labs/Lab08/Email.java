public class Email {
    // Fields
    private String subject;
    private String to;
    private String from;
    private String body;

    // Constructor with subject, to, from, body
    public Email(String subject, String to, String from, String body) {
        this.subject = subject;
        this.to = to;
        this.from = from;
        this.body = body;
    }

    // Constructor with subject, to, from (body = empty string)
    public Email(String subject, String to, String from) {
        this.subject = subject;
        this.to = to;
        this.from = from;
        this.body = "";
    }

    // setBody: Sets the email’s body to the given String
    public void setBody(String body) {
        this.body = body;
    }

    // addToBody: Appends text to the end of the current body
    public void addToBody(String text) {
        this.body = this.body + text;
    }

    // equals: true if subject, to, from, and body all match
    public boolean equals(Email other) {
        if (other == null) {
            return false;
        }
        return this.subject.equals(other.subject) &&
               this.to.equals(other.to) &&
               this.from.equals(other.from) &&
               this.body.equals(other.body);
    }

    // Getters
    public String getSubject() {
        return this.subject;
    }

    public String getTo() {
        return this.to;
    }

    public String getFrom() {
        return this.from;
    }

    public String getBody() {
        return this.body;
    }

    // toString: "From: Me; To: Joe; Subject: Hw; Body: Hello"
    public String toString() {
        return "From: " + this.from +
               "; To: " + this.to +
               "; Subject: " + this.subject +
               "; Body: " + this.body;
    }
}
