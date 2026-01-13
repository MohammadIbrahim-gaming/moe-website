public class DNA {
    // Field
    private char[] sequence;

    // Constructor
    public DNA(char[] sequence) {
        // You can copy the array to be safe if you want
        this.sequence = new char[sequence.length];
        for (int i = 0; i < sequence.length; i++) {
            this.sequence[i] = sequence[i];
        }
    }

    // getSequence: returns this DNA's sequence
    public char[] getSequence() {
        // Return a copy so outside code doesn’t directly mutate our array
        char[] copy = new char[this.sequence.length];
        for (int i = 0; i < this.sequence.length; i++) {
            copy[i] = this.sequence[i];
        }
        return copy;
    }

    // swap: new DNA with this sequence before swapPoint
    // and other sequence from swapPoint onward
    public DNA swap(DNA other, int swapPoint) {
        char[] otherSeq = other.sequence;
        char[] newSeq = new char[this.sequence.length];

        for (int i = 0; i < this.sequence.length; i++) {
            if (i < swapPoint) {
                newSeq[i] = this.sequence[i];
            } else {
                newSeq[i] = otherSeq[i];
            }
        }

        return new DNA(newSeq);
    }

    // equals: sequences match exactly
    public boolean equals(DNA other) {
        if (other == null) {
            return false;
        }

        if (this.sequence.length != other.sequence.length) {
            return false;
        }

        for (int i = 0; i < this.sequence.length; i++) {
            if (this.sequence[i] != other.sequence[i]) {
                return false;
            }
        }

        return true;
    }

    // toString: returns sequence as a line of characters, e.g. "atcg"
    public String toString() {
        return new String(this.sequence);
    }
}
