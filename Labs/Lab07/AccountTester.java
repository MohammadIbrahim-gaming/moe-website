// AccountTester.java
public class AccountTester {
    public static void main(String[] args) {
        Account tim = new Account("Tim", "1234");
        System.out.println(tim);

        Account ted = new Account("Ted", "9999");
        System.out.println(ted);

        tim.deposit(500);
        tim.withdraw(100);
        System.out.println(tim);

        System.out.println("PIN test (1234): " + tim.isPin("1234"));
        System.out.println("PIN test (0000): " + tim.isPin("0000"));
    }
}
