import java.io.*;

public class CompareFiles {
    public static void main(String[] args) {
        File file1 = new File("output.txt");
        File file2 = new File("coutput.txt");

        try {
            FileInputStream fis1 = new FileInputStream(file1);
            FileInputStream fis2 = new FileInputStream(file2);

            byte[] byteArray1 = new byte[(int) file1.length()];
            byte[] byteArray2 = new byte[(int) file2.length()];

            fis1.read(byteArray1);
            fis2.read(byteArray2);

            if (java.util.Arrays.equals(byteArray1, byteArray2)) {
                // System.out.println("Files are identical");
            } else {
                System.out.println("Files are not identical");
            }

            fis1.close();
            fis2.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
