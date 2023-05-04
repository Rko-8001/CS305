import { problem } from "../DataPart/Model/schema.js";
import pkg from "jsonwebtoken";
import { ObjectId } from "mongodb";
const { TokenExpiredError, JsonWebTokenError } = pkg;
import Docker from "dockerode";
import { readFileSync } from "fs";
import { pack as _pack } from "tar-stream";
import fs from "fs";

export default class Problem {
  // constructor
  constructor(adminDB, adminJWT) {
    this.adminDB = adminDB;
    this.adminJWT = adminJWT;
  }

  // post problem API
  postProblem = async (req, res) => {
    // handle problem posting
    try {
      let token = req.body.userToken;
      let decodeData = this.adminJWT.verifyToken(token);
      let author_handle = decodeData.handle;
      let author_type = decodeData.type;
      if (author_type !== "2") {
        // if author is not admin or coordinator
        res.send({
          success: false,
          message: "You are not authorized to post problems.",
        });
        return;
      }
      let obj = { ...req.body, author_handle: author_handle };
      obj.token = undefined;
      let Problem = new problem(obj);
      const data = await this.adminDB.insertOne(this.adminDB.problem, Problem);
      // if problem is posted successfully
      if (data) {
        res.send({ success: true, message: "Problem posted successfully." });
      } else {
        res.send({
          success: false,
          message: "Problem can't be posted due to internal reasons",
        });
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        // console.log("Token has expired");
        res.send({ success: false, message: "Token has expired." });
      } else {
        res.send({ success: false, message: error.message });
      }
    }
  }; 
  // submit solution API
  submitSolution = async (req, res)=> {
    // Handle problem submission.
    try {
      let problemId = req.body.problemId;
      let token = req.body.userToken;
      let decodeData = this.adminJWT.verifyToken(token);
      let code = req.body.code;
      let handle = decodeData.handle;
      let timestamp = req.body.timestamp;
      let language = req.body.language;

      // language C++ and Java are supported for submission of solution
      if (language == "C++") await this.handleCPP(problemId, handle, code, timestamp, language, res); 
      else if ((language = "Java")) await this.handleJAVA(problemId, handle, code, timestamp, language, res);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // Handle the token expired error here.
        // console.log("Token has expired");
        res.send({ success: false, message: "Token has expired." });
      } else if (error instanceof JsonWebTokenError) {
        // Handle other errors here.
        res.send({
          success: false,
          message: "User has logged out.Kindly login again.",
        });
      } else {
        // console.log(error);
        res.send({ success: false, message: error});
      }
    }
  } 
  // fetching solved problems API
  fetchSolvedProblems = async (req, res) => {
    // fetch the solved problems of the user from the solved collection
    let token = req.body.userToken;
    try {
      let decoded = this.adminJWT.verifyToken(token);
      let handle = decoded.handle;
      const data = await this.adminDB.findOne(
        this.adminDB.solved,
        {
          handle: handle,
        },
        { problems: 1, _id: 0 }
      );
      res.send({
        success: true,
        problems: data.problems,
        message: "Solved problems fetched successfully",
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        // console.log("Token has expired");
        res.send({ success: false, message: "Token has expired." });
      } else if (error instanceof JsonWebTokenError) {
        // handle other errors here
        res.send({
          success: false,
          message: "User has logged out.Kindly login again",
        });
      } else {
        res.send({ success: false, message: error.message });
      }
    }
  }; 
  // fetching all the submissions API
  fetchAllSubmissions = async (req, res) => {
    // fetch all the submissions of the user from the solution collection
    let token = req.body.token;
    try {
      let decoded = this.adminJWT.verifyToken(token);
      let handle = decoded.handle;
      let data = await this.adminDB.find(this.adminDB.solution, {
        handle: handle,
      });
      // if data is not empty i.e user has submitted some solutions
      if (data.length > 0) {
        let problems = data.map((item) => new ObjectId(item.problemId));
        const problemData = await this.adminDB.find(
          this.adminDB.problem,
          {
            _id: { $in: problems },
          },
          {},
          { title: 1 }
        );
        // console.log(problemData);
        data = data.map((item) => {
          let problem = problemData.find(
            (problem) => problem._id.toString() === item.problemId.toString()
          );
          return {
            ...item,
            title: problem.title,
          };
        });
      }
      res.send({
        success: true,
        submissions: data,
        message: "Submissions fetched successfully",
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        res.send({ success: false, message: "Token has expired." });
      } else if (error instanceof JsonWebTokenError) {
        // handle other errors here
        res.send({
          success: false,
          message: "User has logged out.Kindly login again",
        });
      } else {
        // console.log(error);
        res.send({ success: false, message: error.message });
      }
    }
  }; 
  // fetching all the problems API
  fetchAllProblems = async (req, res) => {
    // fetch all the problems from the problem collection
    try {
      let data = await this.adminDB.find(
        this.adminDB.problem,
        {},
        { timestamp: -1 },
        { title: 1, timestamp: 1 }
      );
      res.send({
        success: true,
        problems: data,
        message: "Problems fetched successfully",
      });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  }; 
  // fetching problem details API
  fetchProblemDetails = async (req, res) => {
    // fetch the problem details from the problem collection
    let problemId = req.body.problemId;
    try {
      let data = await this.adminDB.findOne(
        this.adminDB.problem,
        {
          _id: new ObjectId(problemId),
        },
        { _id: 0, correct_code_CPP: 0, correct_code_JAVA: 0, testcases: 0 }
      );
      res.send({
        success: true,
        problem: data,
        message: "Problem details fetched successfully",
      });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  };
  // API to handle the submission of solution made by the user in JAVA language
   handleJAVA = async (problemId, handle, code, timestamp, language, res)=> {
    {
      let verdict = "";
      // Creating a new docker instance.
      const docker = new Docker();

      // Defining container options.
      const containerOptions = {
        Image: "openjdk", // Image name for docker container.
        Tty: true,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ["bash"],
      };

      // Fetching problem from database.
      const problem = await this.adminDB.findOne(this.adminDB.problem, {
        _id: new ObjectId(problemId),
      });

      // Unique submission id.
      let uniqueId = handle + new Date().getTime();

      // Copying input template to server.
      fs.writeFile(
        `${uniqueId}-input_template.java`,
        problem.input_template_JAVA,
        (err) => {
          if (err)
            throw err;
        }
      );

      // Copying input test case file to server.
      fs.writeFile(`${uniqueId}-input.txt`, problem.testcases, (err) => {
        if (err)
          throw err;
      });

      // Copying user code file to server.
      fs.writeFile(`${uniqueId}-Solution.java`, code, (err) => {
        if (err)
          throw err;
      });

      // Copying correct code file to server.
      fs.writeFile(
        `${uniqueId}-correct_code_JAVA.java`,
        problem.correct_code_JAVA,
        (err) => {
          if (err)
            throw err;
        }
      );

      // Create and start container.
      docker.createContainer(containerOptions, (err, container) => {
        if (err) {
          // console.error("Error creating container:", err);
          verdict = "Internal Error";
        }

        container.start((err) => {
          if (err) {
            // console.error("Error starting container:", err);
            verdict = "Internal Error";
          }

          // console.log("Container started");

          // Copying all the files required from the server into the container.
          const pack = _pack();
          const fileContents = readFileSync(
            `${uniqueId}-input_template.java`
          );
          pack.entry({ name: "Func.java" }, fileContents);
          pack.finalize();

          // Copying input test case file to container.
          const pack2 = _pack();
          const fileContents2 = readFileSync(`${uniqueId}-input.txt`);
          pack2.entry({ name: "input.txt" }, fileContents2);
          pack2.finalize();

          // Copying user code file to container.
          const pack3 = _pack();
          const fileContents3 = readFileSync(`${uniqueId}-Solution.java`);
          pack3.entry({ name: "Solution.java" }, fileContents3);
          pack3.finalize();

          // CompareFiles to compare output generated by user and admin.
          const pack4 = _pack();
          const fileContents4 = readFileSync("CompareFiles.java");
          pack4.entry({ name: "CompareFiles.java" }, fileContents4);
          pack4.finalize();

          // Copying correct code file to container.
          const pack6 = _pack();
          const fileContents6 = readFileSync(
            `${uniqueId}-correct_code_JAVA.java`
          );
          pack6.entry({ name: "CorrectCode.java" }, fileContents6);
          pack6.finalize();

          // copy all the files to the container.
          container.putArchive(pack, { path: "/" }, (err) => {
            if (err) {
              // console.error("Error copying file to container:", err);
              verdict = "Internal Error";
            }
            // console.log("Error copying input template to container.");
            
            // copying input test case to container.
            container.putArchive(
              pack2,
              { path: "/" },
              (err) => {
                if (err) {
                  console.error(
                    "Error copying input test case to container:",
                    err
                  );
                  verdict = "Internal Error";
                }
                // console.log("Error copying input test case to container.");
              },

              // copying solution java file to container.
              container.putArchive(
                pack3,
                { path: "/" },
                (err) => {
                  if (err) {
                    console.error(
                      "Error copying solution java file to container:",
                      err
                    );
                    verdict = "Internal Error";
                  }
                  // console.log(
                  //   "Error copying solution java file to container."
                  // );
                },

                // copying compareFiles to container.
                container.putArchive(
                  pack4,
                  { path: "/" },
                  (err) => {
                    if (err) {
                      // console.error(
                      //   "Error copying solution to container:",
                      //   err
                      // );
                      verdict = "Internal Error";
                    }
                    // console.log("Error comparing compareFiles to container.");
                  },
                  // copying correct code to container.
                  container.putArchive(
                    pack6,
                    { path: "/" },
                    (err) => {
                      if (err) {
                        console.error(
                          "Error copying correct code to container:",
                          err
                        );
                        verdict = "Internal Error";
                      }
                      // console.log("Error copying correct code to container:");
                    },

                    // Compile and run user java code.
                    container.exec(
                      {
                        Cmd: ["sh", "-c", "javac *.java && java Func"],
                        AttachStdout: true,
                        AttachStderr: true,
                      },
                      (err, exec) => {
                        if (err) {
                          // console.error("Error creating exec:", err);
                          verdict = "Internal Error";
                        }

                        // Start execution.
                        exec.start((err, stream) => {
                          if (err) {
                            // console.error("Error starting exec:", err);
                            verdict = "Internal Error";
                          }
                          // Stream output of execution. check for errors.
                          stream.on("data", (data) => {
                            // console.log(data.toString());
                            verdict =
                              verdict === "" ? "Compilation Error" : verdict;
                          });
                          // Stream output of execution. check for errors.
                          stream.on("error", (error) => {
                            console.error(
                              "Error during compilation or runtime:",
                              error
                            );
                          });

                          // Compile and run correct java code.
                          container.exec(
                            {
                              Cmd: [
                                "sh",
                                "-c",
                                "javac *.java && java CorrectCode",
                              ],
                              AttachStdout: true,
                              AttachStderr: true,
                            },
                            (err, exec) => {
                              if (err) {
                                // console.error("Error creating exec:", err);
                                verdict =
                                  verdict === "" ? "Internal Error" : verdict;
                              }

                              // Start execution of correct code.
                              exec.start((err, stream) => {
                                if (err) {
                                  // console.error("Error starting exec:", err);
                                  verdict =
                                    verdict === ""
                                      ? "Internal Error"
                                      : verdict;
                                }

                                stream.on("data", (data) => {
                                  // console.log(data.toString());
                                });

                                // Runtime or compilation error while running.
                                stream.on("error", (error) => {
                                  console.error(
                                    "Error during compilation or runtime:",
                                    error
                                  );
                                });
                              });
                            }
                          );
                          // Wait for few seconds to ensure that the output file is created.
                          setTimeout(() => {
                            // Read the contents of the files into memory
                            const file1 = "output.txt";
                            const file2 = "coutput.txt";

                            // Run the compareFiles inside the container.
                            container.exec(
                              {
                                Cmd: [
                                  "sh",
                                  "-c",
                                  "javac *.java && java CompareFiles",
                                ],
                                AttachStdout: true,
                                AttachStderr: true,
                              },
                              (err, exec) => {
                                if (err) {
                                  // console.error("Error creating exec:", err);
                                  verdict =
                                    verdict === ""
                                      ? "Internal Error"
                                      : verdict;
                                }

                                // Start execution of compareFiles.
                                exec.start((err, stream) => {
                                  if (err) {
                                    console.error(
                                      "Error starting exec:",
                                      err
                                    );
                                    verdict =
                                      verdict === ""
                                        ? "Internal Error"
                                        : verdict;
                                  }

                                  let output = "";
                                  stream.on("data", (data) => {
                                    output += data.toString();
                                  });

                                  // CompareFiles execution completed.
                                  stream.on("end", () => {
                                    // If the output of the compare file is empty, the files are the same.
                                    if (output.trim() === "") {
                                      // console.log(
                                      //   "Both output files are the same."
                                      // );
                                      // If the verdict is empty, the verdict is accepted.
                                      verdict =
                                        verdict === "" ? "Accepted" : verdict;
                                    } else {
                                      // console.log(
                                      //   "Output files are the same."
                                      // );
                                      // If the verdict is empty, the verdict is wrong answer.
                                      verdict =
                                        verdict === ""
                                          ? "Wrong Answer"
                                          : verdict;
                                    }
                                  });

                                  // Error occured while exceuting  compareFiles.
                                  stream.on("error", (error) => {
                                    
                                    // console.error(
                                    //   "Error during diff command:",
                                    //   error
                                    // );
                                    // If the verdict is empty, the verdict is internal error.
                                    verdict =
                                      verdict === ""
                                        ? "Internal Error"
                                        : verdict;
                                  });
                                });
                              }
                            );
                          }, 4000 * problem.time_limit);
                          // Wait for few seconds to ensure that the output file is created.
                          setTimeout(async () => {
                            container.modem.demuxStream(
                              stream,
                              process.stdout,
                              process.stderr
                            );

                            // Stopping the container.
                            container.stop((err) => {
                              if (err) {
                                // console.error(
                                //   "Error stopping container:",
                                //   err
                                // );
                                // If the verdict is empty, the verdict is internal error.
                                verdict =
                                  verdict === "" ? "Internal Error" : verdict;
                              }
                              // console.log("Container stopped");

                              // Removing the container.
                              container.remove((err) => {
                                if (err) {
                                  console.error(
                                    "Error removing container:",
                                    err
                                  );
                                  verdict =
                                    verdict === ""
                                      ? "Internal Error"
                                      : verdict;
                                }
                                // console.log("Container removed");
                              });
                            });

                            // Printing the verdict.
                            // console.log(verdict);

                            // Saving the submission to the database.
                            await this.adminDB.insertOne(
                              this.adminDB.solution,
                              {
                                code: code,
                                verdict: verdict,
                                problemId: problemId,
                                handle: handle,
                                timestamp: new Date(timestamp),
                                language: language,
                              }
                            );
                            // If the verdict is accepted, then add the problem to the solved list of the user.
                            if (verdict === "Accepted") {
                              const data = await this.adminDB.findOne(
                                this.adminDB.solved,
                                {
                                  handle: handle,
                                },
                                {
                                  problems: 1,
                                }
                              );
                              // console.log(data, handle);
                              // If the problem is not already in the solved list, then add it.
                              if (!data.problems.includes(problemId)) {
                                await this.adminDB.updateOne(
                                  this.adminDB.solved,
                                  {
                                    handle: handle,
                                  },
                                  {
                                    $push: {
                                      problems: problemId,
                                    },
                                  }
                                );
                              }
                            }

                            // Returing the response.
                            res.send({ success: true, verdict: verdict });

                            // Removing the files from the server.
                            fs.unlink(
                              `${uniqueId}-input_template.java`,
                              (err) => {
                                if (err)
                                  throw err;
                                // console.log("File has been deleted");
                              }
                            );
                            // Removing the files from the server.
                            fs.unlink(`${uniqueId}-input.txt`, (err) => {
                              if (err)
                                throw err;
                              // console.log("File has been deleted");
                            });
                            // Removing the files from the server.
                            fs.unlink(`${uniqueId}-Solution.java`, (err) => {
                              if (err)
                                throw err;
                              // console.log("File has been deleted");
                            });
                            // Removing the files from the server.
                            fs.unlink(
                              `${uniqueId}-correct_code_JAVA.java`,
                              (err) => {
                                if (err)
                                  throw err;
                                // console.log("File has been deleted");
                              }
                            );
                          }, 8000 * problem.time_limit);
                        });
                      }
                    )
                  )
                )
              )
            );
          });
        });
      });
    }
  }

  // Function to handle C++ submissions.
  handleCPP = async (problemId, handle, code, timestamp, language, res) =>{
    {
      let verdict = "";
      // Creating a new docker instance.
      const docker = new Docker();

      // Define container options.
      const containerOptions = {
        Image: "gcc", // Image of the container.
        Tty: true,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ["bash"],
      };

      // Fetching problem details from docker database.
      const problem = await this.adminDB.findOne(this.adminDB.problem, {
        _id: new ObjectId(problemId),
      });

      // Unique submission id.
      let uniqueId = handle + new Date().getTime();

      // Copying the input template.
      fs.writeFile(
        `${uniqueId}-input_template.cpp`,
        problem.input_template_CPP,
        (err) => {
          if (err)
            throw err;
        }
      );

      // Copying the input testcases.
      fs.writeFile(`${uniqueId}-input.txt`, problem.testcases, (err) => {
        if (err)
          throw err;
      });

      // Copying the user code.
      fs.writeFile(`${uniqueId}-function_def.h`, code, (err) => {
        if (err)
          throw err;
      });

      // Copying the correct code cpp.
      fs.writeFile(
        `${uniqueId}-correct_code_CPP.cpp`,
        problem.correct_code_CPP,
        (err) => {
          if (err)
            throw err;
        }
      );

      // Create and start container.
      docker.createContainer(containerOptions, (err, container) => {
        if (err) {
          // console.error("Error creating container:", err);
          verdict = "Internal Error";
        }

        container.start((err) => {
          if (err) {
            // console.error("Error starting container:", err);
            verdict = "Internal Error";
          }

          // console.log("Container started");

          // Copying file the to container.
          const pack = _pack();
          const fileContents = readFileSync(`${uniqueId}-input_template.cpp`);
          pack.entry({ name: "main.cpp" }, fileContents);
          pack.finalize();

          // Copying file the to container.
          const pack2 = _pack();
          const fileContents2 = readFileSync(`${uniqueId}-input.txt`);
          pack2.entry({ name: "input.txt" }, fileContents2);
          pack2.finalize();

          // Copying file the to container.
          const pack3 = _pack();
          const fileContents3 = readFileSync(`${uniqueId}-function_def.h`);
          pack3.entry({ name: "funcDef.h" }, fileContents3);
          pack3.finalize();

          // Copying file the to container.
          const pack6 = _pack();
          const fileContents6 = readFileSync(
            `${uniqueId}-correct_code_CPP.cpp`
          );
          pack6.entry({ name: "cmain.cpp" }, fileContents6);
          pack6.finalize();

          // Copying file the to container.
          container.putArchive(pack, { path: "/" }, (err) => {
            if (err) {
              // console.error("Error input template to container:", err);
              verdict = "Internal Error";
            }
            // console.log("Cpp File copied to container");

            container.putArchive(
              pack2,
              { path: "/" },
              (err) => {
                if (err) {
                  console.error(
                    "Error in copying input testcase file to container:",
                    err
                  );
                  verdict = "Internal Error";
                }
                // console.log("Input testcase file copied to container");
              },

              // Copying file the to container.
              container.putArchive(
                pack3,
                { path: "/" },
                (err) => {
                  if (err) {
                    console.error(
                      "Error copying header file to container:",
                      err
                    );
                    verdict = "Internal Error";
                  }
                  // console.log("Header File copied to container");
                },

                // copying file the to container.
                container.putArchive(
                  pack6,
                  { path: "/" },
                  (err) => {
                    if (err) {
                      console.error(
                        "Error copying correct code to container:",
                        err
                      );
                      verdict = "Internal Error";
                    }
                    // console.log("Correct output File copied to container.");
                  },

                  // Compile and run code user code.
                  container.exec(
                    {
                      Cmd: [
                        "sh",
                        "-c",
                        "gcc main.cpp -o main -lstdc++ && ./main",
                      ],
                      AttachStdout: true,
                      AttachStderr: true,
                    },
                    (err, exec) => {
                      if (err) {
                        // console.error("Error creating exec:", err);
                        verdict = "Internal Error";
                      }

                      // Start execution of user code.
                      exec.start((err, stream) => {
                        if (err) {
                          // console.error("Error starting exec:", err);
                          verdict = "Internal Error";
                        }
                        // Stream output of user code.
                        stream.on("data", (data) => {
                          verdict =
                            verdict === "" ? "Compilation Error" : verdict;
                        });

                        stream.on("error", (error) => {
                          console.error(
                            "Error during compilation or runtime of user code:",
                            error
                          );
                        });

                        // Compile and run code.
                        container.exec(
                          {
                            Cmd: [
                              "sh",
                              "-c",
                              "gcc cmain.cpp -o cmain -lstdc++ && ./cmain",
                            ],
                            AttachStdout: true,
                            AttachStderr: true,
                          },
                          (err, exec) => {
                            if (err) {
                              // console.error("Error creating exec:", err);
                              verdict =
                                verdict === "" ? "Internal Error" : verdict;
                            }

                            // Start execution correct code.
                            exec.start((err, stream) => {
                              if (err) {
                                // console.error("Error starting exec:", err);
                                verdict =
                                  verdict === "" ? "Internal Error" : verdict;
                              }

                              stream.on("data", (data) => { });

                              stream.on("error", (error) => {
                                console.error(
                                  "Error during compilation or runtime of correct code:",
                                  error
                                );
                              });
                            });
                          }
                        );

                        // Putting setTimeout to allow execution first then comparision of files.
                        setTimeout(() => {
                          // Read the contents of the files into memory.
                          const file1 = "output.txt";
                          const file2 = "coutput.txt";

                          // Run the diff command inside the container.
                          container.exec(
                            {
                              Cmd: ["diff", file1, file2],
                              AttachStdout: true,
                              AttachStderr: true,
                            },
                            (err, exec) => {
                              if (err) {
                                console.error(
                                  "Error creating exec of diff command:",
                                  err
                                );
                                verdict =
                                  verdict === "" ? "Internal Error" : verdict;
                              }

                              // Start execution.
                              exec.start((err, stream) => {
                                if (err) {
                                  console.error(
                                    "Error starting exec of diff command:",
                                    err
                                  );
                                  // If the diff command fails, the files are different.
                                  verdict =
                                    verdict === ""
                                      ? "Internal Error"
                                      : verdict;
                                }

                                let output = "";
                                stream.on("data", (data) => {
                                  output += data.toString();
                                });

                                // On stream end.
                                stream.on("end", () => {
                                  // If the output of the diff command is empty, the files are the same
                                  if (output.trim() === "") {
                                    // console.log("Correct output generated.");
                                    verdict =
                                      verdict === "" ? "Accepted" : verdict;
                                  } else {
                                    // console.log("The files are different");
                                    verdict =
                                      verdict === "" ? "Accepted" : verdict;
                                  }
                                });

                                stream.on("error", (error) => {
                                  console.error(
                                    "Error during diff command:",
                                    error
                                  );
                                  // If the diff command fails, the files are different.
                                  verdict =
                                    verdict === ""
                                      ? "Internal Error"
                                      : verdict;
                                });
                              });
                            }
                          );
                        }, 4000 * problem.time_limit);

                        // After verdict.
                        // Putting setTimeout to allow execution first then comparision of files.
                        setTimeout(async () => {
                          container.modem.demuxStream(
                            stream,
                            process.stdout,
                            process.stderr
                          );

                          // Stopping the container.
                          // error handling.
                          container.stop((err) => {
                            if (err) {
                              // console.error("Error stopping container:", err);
                              verdict =
                                verdict === "" ? "Internal Error" : verdict;
                            }
                            
                            // console.log("Container stopped");
                            container.remove((err) => {
                              if (err) {
                                console.error(
                                  "Error removing container:",
                                  err
                                );
                                verdict =
                                  verdict === "" ? "Internal Error" : verdict;
                              }
                              console.log("Container removed");
                            });
                          });
                          // console.log(verdict);
                          // Inserting the verdict into the database.
                          await this.adminDB.insertOne(
                            this.adminDB.solution,
                            {
                              code: code,
                              verdict: verdict,
                              problemId: problemId,
                              handle: handle,
                              timestamp: new Date(timestamp),
                              language: language,
                            }
                          );

                          // If verdict is accepted.
                          if (verdict === "Accepted") {
                            const data = await this.adminDB.findOne(
                              this.adminDB.solved,
                              {
                                handle: handle,
                              },
                              {
                                problems: 1,
                              }
                            );
                            // console.log(data, handle);
                            if (!data.problems.includes(problemId)) {
                              await this.adminDB.updateOne(
                                this.adminDB.solved,
                                {
                                  handle: handle,
                                },
                                {
                                  $push: {
                                    problems: problemId,
                                  },
                                }
                              );
                            }
                          }

                          // Returning the verdict.
                          res.send({ success: true, verdict: verdict });

                          // Removing files from the container.
                          fs.unlink(
                            `${uniqueId}-input_template.cpp`,
                            (err) => {
                              if (err)
                                throw err;
                              // console.log("File has been deleted");
                            }
                          );
                          // removing files from the container.
                          fs.unlink(`${uniqueId}-input.txt`, (err) => {
                            if (err)
                              throw err;
                            // console.log("File has been deleted");
                          });
                          // removing files from the container.
                          fs.unlink(`${uniqueId}-function_def.h`, (err) => {
                            if (err)
                              throw err;
                            // console.log("File has been deleted");
                          });
                          // removing files from the container.
                          fs.unlink(
                            `${uniqueId}-correct_code_CPP.cpp`,
                            (err) => {
                              if (err)
                                throw err;
                              // console.log("File has been deleted");
                            }
                          );
                        }, 8000 * problem.time_limit);
                      });
                    }
                  )
                )
              )
            );
          });
        });
      });
    }
  }
}
