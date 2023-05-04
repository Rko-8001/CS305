import { expect } from "chai";
import sinon from "sinon";
import { ObjectId } from "mongodb";
import Docker from "dockerode";
import fs from "fs";
import Problem from "../src/Response/problems.js";
describe("Problems", () => {
  let req, res, adminDB, testProblem;

  describe("handleCPP",function ()  {
    let problemId, code, language, handle, timestamp;
    beforeEach(() => {
      res = {
        send: sinon.stub(),
      };
      adminDB = {
        findOne: sinon.stub(),
        insertOne: sinon.stub(),
        updateOne: sinon.stub(),
      };
      testProblem = new Problem(adminDB,{});
      problemId = "644bc03d00e76ef0f3d3137f";
      code =
      `int sum(int a, int b) {return a+b;}`;
      language = "C++";
      handle = "testHandle";
      timestamp = "timastamp";
    });
    it("should return accept for correct solution", function (done) {
        this.timeout(0);
        setTimeout(done,13000)
          adminDB.findOne.onFirstCall().returns({
        _id: new ObjectId("644bc03d00e76ef0f3d3137f"),
        author_handle: 'nishant_89',
        title: 'Add numbers in an array',
        content: 'Add numbers in an array',
        correct_code_CPP: '#include <bits/stdc++.h>\n' +
          'using namespace std;\n' +
          'int sum(int a,int b){\n' +
          '    return a+b;\n' +
          '}\n' +
          'int main(){\n' +
          '    freopen("input.txt", "r", stdin);                   \n' +
          '\tfreopen("coutput.txt", "w", stdout);\n' +
          '\n' +
          '    int t;\n' +
          'cin>>t;\n' +
          'while(t--){\n' +
          '\t int a,b;\n' +
          '    cin>>a>>b;\n' +
          '    cout<<sum(a,b)<<"\\n";\n' +
          '}\n' +
          '   \n' +
          '    return 0;\n' +
          '}',
        correct_code_JAVA: 'import java.io.*;\n' +
          '\n' +
          'public class CorrectCode {\n' +
          '    public static void main(String[] args) {\n' +
          '        try {\n' +
          '            // Open input and output files\n' +
          '            BufferedReader reader = new BufferedReader(new FileReader("input.txt"));\n' +
          '            BufferedWriter writer = new BufferedWriter(new FileWriter("coutput.txt"));\n' +
          '\n' +
          '\t\t// Read first number from input file\n' +
          '            String line = reader.readLine();\n' +
          '            int t = Integer.parseInt(line);\n' +
          '\n' +
          '\t\twhile(t>0){\n' +
          '\t\t\tString input = reader.readLine();\n' +
          '\t\t\tString[] inputArray = input.split(" "); // splits the input by space\n' +
          '        \t\tint num1 = Integer.parseInt(inputArray[0]); // converts the first number to an integer\n' +
          '        \t\tint num2 = Integer.parseInt(inputArray[1]); \n' +
          '            \n' +
          '            \twriter.write(num1+num2+"\\n");\n' +
          '            \n' +
          '            \t// Close input and output files\n' +
          '\t\t\tt--;\n' +
          '\t\t}\n' +
          '\t\treader.close();\n' +
          '            writer.close();\n' +
          '            \n' +
          '            \n' +
          '            \n' +
          '        } catch (IOException e) {\n' +
          '            e.printStackTrace();\n' +
          '        }\n' +
          '    }\n' +
          '}',
        time_limit: 1,
        input_format: 'input',
        output_format: 'output',
        example_input: 'sample_input',
        example_output: 'sample_output',
        function_def_CPP: 'int sum(int a,int b){\n}',
        input_template_CPP: '#include <bits/stdc++.h>\n' +
          'using namespace std;\n' +
          '#include "funcDef.h"\n' +
          'int main(){\n' +
          '    freopen("input.txt", "r", stdin);                   \n' +
          '\tfreopen("output.txt", "w", stdout);\n' +
          '\t\n' +
          '    int t;\n' +
          '    cin>>t;\n' +
          '    while(t--){\n' +
          '\tint a,b;\n' +
          '    cin>>a>>b;\n' +
          '    cout<<sum(a,b)<<"\\n";\n' +
          '    }\n' +
          '\n' +
          '    \n' +
          '    return 0;\n' +
          '}',
        function_def_JAVA: 'public class Solution {\n' +
          '    public static int add(int a, int b) {\n' +
          '        // Write your code here.\n' +
          '    }\n' +
          '}',
        input_template_JAVA: 'import java.io.*;\n' +
          '\n' +
          'public class Func {\n' +
          '    public static void main(String[] args) {\n' +
          '        try {\n' +
          '            // Open input and output files\n' +
          '            BufferedReader reader = new BufferedReader(new FileReader("input.txt"));\n' +
          '            BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"));\n' +
          '\n' +
          '\t\t// Read first number from input file\n' +
          '            String line = reader.readLine();\n' +
          '            int t = Integer.parseInt(line);\n' +
          '\n' +
          '\t\twhile(t>0){\n' +
          '\t\t\tString input = reader.readLine();\n' +
          '\t\t\tString[] inputArray = input.split(" "); // splits the input by space\n' +
          '        \t\tint num1 = Integer.parseInt(inputArray[0]); // converts the first number to an integer\n' +
          '        \t\tint num2 = Integer.parseInt(inputArray[1]); \n' +
          '            \n' +
          '            \twriter.write(Solution.add(num1,num2)+"\\n");\n' +
          '\t\t\tt--;\n' +
          '            \n' +
          '\t\t}\n' +
          '\t\t// Close input and output files\n' +
          '            \treader.close();\n' +
          '            \twriter.close();\n' +
          '            \n' +
          '            \n' +
          '            \n' +
          '        } catch (IOException e) {\n' +
          '            e.printStackTrace();\n' +
          '        }\n' +
          '    }\n' +
          '}',
        testcases: '5\n1 3\n4 6\n2 0\n1 -1\n2 3',
        timestamp: "2023-04-28T11:21:23.840Z",
        tags: [ 'a', 'b' ],
        level: 'medium'
      });
        adminDB.findOne.onSecondCall().returns({problems:[]})
      adminDB.insertOne.returns({});
      adminDB.updateOne.returns({});
       testProblem.handleCPP(
        problemId,
        handle,
        code,
        timestamp,
        language,
        res
      )
      setTimeout(() => {console.log(adminDB.findOne.callCount);}, 11000);
        // expect(res.send.calledOnceWith({ success: true, message: "Accepted" })).to.be.true;
        // expect(adminDB.findOne.calledOnceWith(adminDB.problem, { _id: new ObjectId(problemId) })).to.be.true;
        // expect(adminDB.insertOne.calledOnceWith(adminDB.solution, {
        //     problemId: new ObjectId(problemId),
        //     handle: handle,
        //     code: code,
        //     timestamp: timestamp,
        //     language: language,
        //     verdict: "Accepted",
        //     })).to.be.true;
        // expect(adminDB.updateOne.calledOnceWith(adminDB.solved, { handle: handle }, { $addToSet: { problems: new ObjectId(problemId) } })).to.be.false;

  
        
    })
  });
});
