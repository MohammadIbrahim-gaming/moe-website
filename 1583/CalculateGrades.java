public class CalculateGrades {
    public static char[] calculateGrades(double[] scores) {
        
        char[] grades = new char[scores.length];

        
        for (int i = 0; i < scores.length; i++) {
            double score = scores[i];

            if (score >= 90 && score <= 100) {
                grades[i] = 'A';
            } else if (score >= 80) {
                grades[i] = 'B';
            } else if (score >= 70) {
                grades[i] = 'C';
            } else if (score >= 60) {
                grades[i] = 'D';
            } else {
                grades[i] = 'F';
            }
        }

        return grades;
    }

    
    public static void main(String[] args) {
        double[] scores = {99, 94, 91, 80, 45};
        char[] result = calculateGrades(scores);

        
        for (char grade : result) {
            System.out.print(grade + " ");
        }
        
    }
}
