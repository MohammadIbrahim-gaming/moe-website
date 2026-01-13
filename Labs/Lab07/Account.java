// Account.java
public class Account {
    // Static field
    private static int count = 0;

    // Instance fields
    private String name;
    private String pin;
    private int id;
    private double balance;

    // Constructor
    public Account(String name, String pin) {
        this.name = name;
        this.pin = pin;
        this.balance = 0.0;
        this.id = count;
        count++; // increment static count for next account
    }

    // Returns the account holder's name
    public String getName() {
        return name;
    }

    // Returns this account's ID
    public int getID() {
        return id;
    }

    // Returns current balance
    public double getBalance() {
        return balance;
    }

    // Checks if entered pin matches stored pin
    public boolean isPin(String attempt) {
        return this.pin.equals(attempt);
    }

    // Deposits a positive amount
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    // Withdraws amount if valid and sufficient balance exists
    public double withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return amount;
        }
        return 0.0; // no withdrawal made
    }

    // Returns formatted account info
    @Override
    public String toString() {
        return String.format("Name: %s, Account ID: %d, Balance: $%.2f", name, id, balance);
    }
}
