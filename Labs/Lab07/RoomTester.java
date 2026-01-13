public class RoomTester {
    public static void main(String[] args) {
        Room hall = new Room("Hall", "It's dark.");
        Room bed = new Room("Bed", "Tiny room.");
        Room bath = new Room("Bath", "Toilets here.");
        Room dine = new Room("Dining", "Table & chairs.");
        
        hall.setExits(bed, bath, dine, null);
        System.out.println(hall);
    }
}
