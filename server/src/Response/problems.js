import { problem } from "../DataPart/Model/schema.js";
import pkg from "jsonwebtoken";
import { ObjectId } from "mongodb";
const { TokenExpiredError, JsonWebTokenError } = pkg;
import Docker from "dockerode";
import { readFileSync } from "fs";
import { pack as _pack } from "tar-stream";
import fs from "fs";

export default class Problem {
  constructor(adminDB,adminJWT){
    this.adminDB = adminDB;
    this.adminJWT = adminJWT;
  }
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
        console.log("Token has expired");
        res.send({ success: false, message: "Token has expired." });
      } else {
        res.send({ success: false, message: error.message });
      }
    }
  }; // working fine
   submitSolution = async (req, res) => {
    // handle problem submission
    try {
      let problemId = req.body.problemId;
      let token = req.body.userToken;
      let decodeData = this.adminJWT.verifyToken(token);
      let code = req.body.code;
      let handle = decodeData.handle;
      let timestamp = req.body.timestamp;
      let language = req.body.language;

      if (language == "C++") {
        let verdict = "";
        const docker = new Docker();
        // Define container options
        const containerOptions = {
          Image: "gcc",
          Tty: true,
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          Cmd: ["bash"],
        };
        const problem = await this.adminDB.findOne(this.adminDB.problem, {
          _id: new ObjectId(problemId),
        });

        let uniqueId = handle + new Date().getTime();
        console.log(problem);
        fs.writeFile(
          `${uniqueId}-input_template.cpp`,
          problem.input_template_CPP,
          (err) => {
            if (err) throw err;
            console.log("Data has been written to file");
          }
        );
        fs.writeFile(`${uniqueId}-input.txt`, problem.testcases, (err) => {
          if (err) throw err;
          console.log("Data has been written to file");
        });
        fs.writeFile(`${uniqueId}-function_def.h`, code, (err) => {
          if (err) throw err;
          console.log("Data has been written to file");
        });
        fs.writeFile(
          `${uniqueId}-correct_code_CPP.cpp`,
          problem.correct_code_CPP,
          (err) => {
            if (err) throw err;
            console.log("Data has been written to file");
          }
        );
        // Create and start container
        docker.createContainer(containerOptions,  (err, container) =>{
          if (err) {
            console.error("Error creating container:", err);
            verdict = "Internal Error";
          }

          container.start( (err)=> {
            if (err) {
              console.error("Error starting container:", err);
              verdict = "Internal Error";
            }

            console.log("Container started");

            // Copy code to container
            const pack = _pack();
            const fileContents = readFileSync(`${uniqueId}-input_template.cpp`);
            pack.entry({ name: "main.cpp" }, fileContents);
            pack.finalize();

            const pack2 = _pack();
            const fileContents2 = readFileSync(`${uniqueId}-input.txt`);
            pack2.entry({ name: "input.txt" }, fileContents2);
            pack2.finalize();

            const pack3 = _pack();
            const fileContents3 = readFileSync(`${uniqueId}-function_def.h`);
            pack3.entry({ name: "funcDef.h" }, fileContents3);
            pack3.finalize();

            // const pack5 = _pack(); // create a tar pack stream
            // const fileContents5 = readFileSync('./cfuncDef.h');
            // pack5.entry({ name: 'cfuncDef.h' }, fileContents5); // add file to the pack
            // pack5.finalize(); // finalize the pack stream

            const pack6 = _pack();
            const fileContents6 = readFileSync(
              `${uniqueId}-correct_code_CPP.cpp`
            );
            pack6.entry({ name: "cmain.cpp" }, fileContents6);
            pack6.finalize();

            container.putArchive(pack, { path: "/" },  (err)=> {
              if (err) {
                console.error("Error copying file to container:", err);
                verdict = "Internal Error";
              }
              console.log(" Cpp File copied to container");

              container.putArchive(
                pack2,
                { path: "/" },
                 (err)=> {
                  if (err) {
                    console.error("Error copying file to container:", err);
                    verdict = "Internal Error";
                  }
                  console.log(" Input File copied to container");
                },

                container.putArchive(
                  pack3,
                  { path: "/" },
                   (err)=> {
                    if (err) {
                      console.error("Error copying file to container:", err);
                      verdict = "Internal Error";
                    }
                    console.log(" header File copied to container");
                  },

                  // container.putArchive(pack4, { path: '/' }, function (err) {
                  //   if (err) {
                  //     console.error('Error copying file to container:', err);
                  //     return;
                  //   }
                  //   console.log(' Correct output File copied to container');
                  // },

                  // container.putArchive(pack5, { path: '/' }, function (err) {
                  //   if (err) {
                  // 	console.error('Error copying file to container:', err);
                  // 	return;
                  //   }
                  //   console.log(' Correct output File copied to container');
                  // },

                  container.putArchive(
                    pack6,
                    { path: "/" },
                     (err)=> {
                      if (err) {
                        console.error("Error copying file to container:", err);
                        verdict = "Internal Error";
                      }
                      console.log(" Correct output File copied to container");
                    },

                    // Compile and run code
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
                       (err, exec) =>{
                        if (err) {
                          console.error("Error creating exec:", err);
                          verdict = "Internal Error";
                        }

                        exec.start( (err, stream)=> {
                          if (err) {
                            console.error("Error starting exec:", err);
                            verdict = "Internal Error";
                          }

                          stream.on("data",  (data)=> {
                            console.log(data.toString());
                            if (verdict == "") {
                              verdict = "Compilation Error";
                            }
                          });

                          stream.on("error",  (error) =>{
                            console.error(
                              "Error during compilation or runtime:",
                              error
                            );
                          });

                          // Compile and run code
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
                             (err, exec)=> {
                              if (err) {
                                console.error("Error creating exec:", err);
                                if (verdict == "") {
                                  verdict = "Internal Error";
                                }
                              }

                              exec.start((err, stream)=> {
                                if (err) {
                                  console.error("Error starting exec:", err);
                                  if (verdict == "") {
                                    verdict = "Internal Error";
                                  }
                                }

                                stream.on("data", (data)=> {
                                  console.log(data.toString());
                                });

                                stream.on("error", (error)=> {
                                  console.error(
                                    "Error during compilation or runtime:",
                                    error
                                  );
                                });
                              });
                            }
                          );

                          setTimeout(() => {
                            // Read the contents of the files into memory
                            const file1 = "output.txt";
                            const file2 = "coutput.txt";

                            // Run the diff command inside the container
                            container.exec(
                              {
                                Cmd: ["diff", file1, file2],
                                AttachStdout: true,
                                AttachStderr: true,
                              },
                              (err, exec)=> {
                                if (err) {
                                  console.error("Error creating exec:", err);
                                  if (verdict == "") {
                                    verdict = "Internal Error";
                                  }
                                }

                                exec.start( (err, stream) =>{
                                  if (err) {
                                    console.error("Error starting exec:", err);
                                    if (verdict == "") {
                                      verdict = "Internal Error";
                                    }
                                  }

                                  let output = "";
                                  stream.on("data",  (data)=> {
                                    output += data.toString();
                                  });

                                  stream.on("end",  ()=> {
                                    // If the output of the diff command is empty, the files are the same
                                    if (output.trim() === "") {
                                      console.log("The files are the same");
                                      if (verdict == "") {
                                        verdict = "Accepted";
                                      }
                                    } else {
                                      console.log("The files are different");
                                      if (verdict == "") {
                                        verdict = "Wrong Answer";
                                      }

                                      // Print the contents of the files to see the differences
                                      container.exec(
                                        {
                                          Cmd: ["cat", file1],
                                          AttachStdout: true,
                                          AttachStderr: true,
                                        },
                                         (err, exec)=> {
                                          if (err) {
                                            console.error(
                                              "Error creating exec:",
                                              err
                                            );
                                            if (verdict == "") {
                                              verdict = "Internal Error";
                                            }
                                          }

                                          exec.start( (err, stream)=> {
                                            if (err) {
                                              console.error(
                                                "Error starting exec:",
                                                err
                                              );
                                              if (verdict == "") {
                                                verdict = "Internal Error";
                                              }
                                            }

                                            stream.pipe(process.stdout);
                                            let data = "";
                                            stream.on("data", (chunk) => {
                                              data += chunk;
                                            });

                                            stream.on("end", () => {
                                              console.log(data.toString());
                                              if (
                                                data
                                                  .toString()
                                                  .endsWith(
                                                    "No such file or directory\n"
                                                  )
                                              ) {
                                                if (verdict == "") {
                                                  verdict = "TLE";
                                                }
                                              }
                                            });
                                          });
                                        }
                                      );

                                      console.log("vs");

                                      container.exec(
                                        {
                                          Cmd: ["cat", file2],
                                          AttachStdout: true,
                                          AttachStderr: true,
                                        },
                                         (err, exec)=> {
                                          if (err) {
                                            console.error(
                                              "Error creating exec:",
                                              err
                                            );
                                            if (verdict == "") {
                                              verdict = "Internal Error";
                                            }
                                          }

                                          exec.start((err, stream)=> {
                                            if (err) {
                                              console.error(
                                                "Error starting exec:",
                                                err
                                              );
                                              if (verdict == "") {
                                                verdict = "Internal Error";
                                              }
                                            }

                                            stream.pipe(process.stdout);
                                            let data = "";
                                            stream.on("data", (chunk) => {
                                              data += chunk;
                                            });

                                            stream.on("end", () => {
                                              console.log(data.toString());
                                              if (
                                                data
                                                  .toString()
                                                  .endsWith(
                                                    "No such file or directory\n"
                                                  )
                                              ) {
                                                if (verdict == "") {
                                                  verdict = "Internal Error";
                                                }
                                              }
                                            });
                                          });
                                        }
                                      );
                                    }
                                  });

                                  stream.on("error", (error)=> {
                                    console.error(
                                      "Error during diff command:",
                                      error
                                    );
                                    if (verdict == "") {
                                      verdict = "Internal Error";
                                    }
                                  });
                                });
                              }
                            );
                          }, 4000 * problem.time_limit);

                          setTimeout(async () => {
                            container.modem.demuxStream(
                              stream,
                              process.stdout,
                              process.stderr
                            );
                            container.stop((err) =>{
                              if (err) {
                                console.error("Error stopping container:", err);
                                if (verdict == "") {
                                  verdict = "Internal Error";
                                }
                              }
                              console.log("Container stopped");
                              container.remove( (err)=> {
                                if (err) {
                                  console.error(
                                    "Error removing container:",
                                    err
                                  );
                                  if (verdict == "") {
                                    verdict = "Internal Error";
                                  }
                                }
                                console.log("Container removed");
                              });
                            });
                            console.log(verdict);
                            await this.adminDB.insertOne(this.adminDB.solution, {
                              code: code,
                              verdict: verdict,
                              problemId: problemId,
                              handle: handle,
                              timestamp: new Date(timestamp),
                              language: language,
                            });

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
                              console.log(data, handle);
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

                            res.send({ success: true, verdict: verdict });
                            fs.unlink(
                              `${uniqueId}-input_template.cpp`,
                              (err) => {
                                if (err) throw err;
                                console.log("File has been deleted");
                              }
                            );
                            fs.unlink(`${uniqueId}-input.txt`, (err) => {
                              if (err) throw err;
                              console.log("File has been deleted");
                            });
                            fs.unlink(`${uniqueId}-function_def.h`, (err) => {
                              if (err) throw err;
                              console.log("File has been deleted");
                            });
                            fs.unlink(
                              `${uniqueId}-correct_code_CPP.cpp`,
                              (err) => {
                                if (err) throw err;
                                console.log("File has been deleted");
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
      } else if ((language = "Java")) {
        let verdict = "";
        const docker = new Docker();
        // Define container options
        const containerOptions = {
          Image: "openjdk",
          Tty: true,
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          Cmd: ["bash"],
        };
        const problem = await this.adminDB.findOne(this.adminDB.problem, {
          _id: new ObjectId(problemId),
        });

        let uniqueId = handle + new Date().getTime();
        console.log(problem);
        fs.writeFile(
          `${uniqueId}-input_template.java`,
          problem.input_template_JAVA,
          (err) => {
            if (err) throw err;
            console.log("Data has been written to file");
          }
        );
        fs.writeFile(`${uniqueId}-input.txt`, problem.testcases, (err) => {
          if (err) throw err;
          console.log("Data has been written to file");
        });
        fs.writeFile(`${uniqueId}-Solution.java`, code, (err) => {
          if (err) throw err;
          console.log("Data has been written to file");
        });
        fs.writeFile(
          `${uniqueId}-correct_code_JAVA.java`,
          problem.correct_code_JAVA,
          (err) => {
            if (err) throw err;
            console.log("Data has been written to file");
          }
        );
        // Create and start container
        docker.createContainer(containerOptions,  (err, container) =>{
          if (err) {
            console.error("Error creating container:", err);
            verdict = "Internal Error";
          }

          container.start( (err)=> {
            if (err) {
              console.error("Error starting container:", err);
              verdict = "Internal Error";
            }

            console.log("Container started");

            // Copy code to container
            const pack = _pack();
            const fileContents = readFileSync(
              `${uniqueId}-input_template.java`
            );
            pack.entry({ name: "Func.java" }, fileContents);
            pack.finalize();

            const pack2 = _pack();
            const fileContents2 = readFileSync(`${uniqueId}-input.txt`);
            pack2.entry({ name: "input.txt" }, fileContents2);
            pack2.finalize();

            const pack3 = _pack();
            const fileContents3 = readFileSync(`${uniqueId}-Solution.java`);
            pack3.entry({ name: "Solution.java" }, fileContents3);
            pack3.finalize();

            const pack4 = _pack();
            const fileContents4 = readFileSync("CompareFiles.java");
            pack4.entry({ name: "CompareFiles.java" }, fileContents4);
            pack4.finalize();

            // const pack5 = _pack(); // create a tar pack stream
            // const fileContents5 = readFileSync('./cfuncDef.h');
            // pack5.entry({ name: 'cfuncDef.h' }, fileContents5); // add file to the pack
            // pack5.finalize(); // finalize the pack stream

            const pack6 = _pack();
            const fileContents6 = readFileSync(
              `${uniqueId}-correct_code_JAVA.java`
            );
            pack6.entry({ name: "CorrectCode.java" }, fileContents6);
            pack6.finalize();

            container.putArchive(pack, { path: "/" },  (err)=> {
              if (err) {
                console.error("Error copying file to container:", err);
                verdict = "Internal Error";
              }
              console.log(" Cpp File copied to container");

              container.putArchive(
                pack2,
                { path: "/" },
                 (err)=> {
                  if (err) {
                    console.error("Error copying file to container:", err);
                    verdict = "Internal Error";
                  }
                  console.log(" Input File copied to container");
                },

                container.putArchive(
                  pack3,
                  { path: "/" },
                  (err)=> {
                    if (err) {
                      console.error("Error copying file to container:", err);
                      verdict = "Internal Error";
                    }
                    console.log(" header File copied to container");
                  },

                  container.putArchive(
                    pack4,
                    { path: "/" },
                    (err) =>{
                      if (err) {
                        console.error("Error copying file to container:", err);
                        verdict = "Internal Error";
                      }
                      console.log(" header File copied to container");
                    },

                    // container.putArchive(pack4, { path: '/' }, function (err) {
                    //   if (err) {
                    //     console.error('Error copying file to container:', err);
                    //     return;
                    //   }
                    //   console.log(' Correct output File copied to container');
                    // },

                    // container.putArchive(pack5, { path: '/' }, function (err) {
                    //   if (err) {
                    // 	console.error('Error copying file to container:', err);
                    // 	return;
                    //   }
                    //   console.log(' Correct output File copied to container');
                    // },

                    container.putArchive(
                      pack6,
                      { path: "/" },
                     (err) =>{
                        if (err) {
                          console.error(
                            "Error copying file to container:",
                            err
                          );
                          verdict = "Internal Error";
                        }
                        console.log(" Correct output File copied to container");
                      },

                      // Compile and run code
                      container.exec(
                        {
                          Cmd: ["sh", "-c", "javac *.java && java Func"],
                          AttachStdout: true,
                          AttachStderr: true,
                        },
                         (err, exec)=> {
                          if (err) {
                            console.error("Error creating exec:", err);
                            verdict = "Internal Error";
                          }

                          exec.start( (err, stream)=> {
                            if (err) {
                              console.error("Error starting exec:", err);
                              verdict = "Internal Error";
                            }

                            stream.on("data", (data)=> {
                              console.log(data.toString());
                              if (verdict == "") {
                                verdict = "Compilation Error";
                              }
                            });

                            stream.on("error",  (error)=> {
                              console.error(
                                "Error during compilation or runtime:",
                                error
                              );
                            });

                            // Compile and run code
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
                              (err, exec)=> {
                                if (err) {
                                  console.error("Error creating exec:", err);
                                  if (verdict == "") {
                                    verdict = "Internal Error";
                                  }
                                }

                                exec.start( (err, stream)=> {
                                  if (err) {
                                    console.error("Error starting exec:", err);
                                    if (verdict == "") {
                                      verdict = "Internal Error";
                                    }
                                  }

                                  stream.on("data",  (data)=> {
                                    console.log(data.toString());
                                  });

                                  stream.on("error",(error)=> {
                                    console.error(
                                      "Error during compilation or runtime:",
                                      error
                                    );
                                  });
                                });
                              }
                            );

                            setTimeout(() => {
                              // Read the contents of the files into memory
                              const file1 = "output.txt";
                              const file2 = "coutput.txt";

                              // Run the diff command inside the container
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
                                 (err, exec)=> {
                                  if (err) {
                                    console.error("Error creating exec:", err);
                                    if (verdict == "") {
                                      verdict = "Internal Error";
                                    }
                                  }

                                  exec.start( (err, stream)=> {
                                    if (err) {
                                      console.error(
                                        "Error starting exec:",
                                        err
                                      );
                                      if (verdict == "") {
                                        verdict = "Internal Error";
                                      }
                                    }

                                    let output = "";
                                    stream.on("data", (data) =>{
                                      output += data.toString();
                                    });

                                    stream.on("end", ()=> {
                                      // If the output of the diff command is empty, the files are the same
                                      if (output.trim() === "") {
                                        console.log("The files are the same");
                                        if (verdict == "") {
                                          verdict = "Accepted";
                                        }
                                      } else {
                                        console.log("The files are different");
                                        console.log(output);
                                        if (verdict == "") {
                                          verdict = "Wrong Answer";
                                        }

                                        // Print the contents of the files to see the differences
                                        container.exec(
                                          {
                                            Cmd: ["cat", file1],
                                            AttachStdout: true,
                                            AttachStderr: true,
                                          },
                                           (err, exec)=> {
                                            if (err) {
                                              console.error(
                                                "Error creating exec:",
                                                err
                                              );
                                              if (verdict == "") {
                                                verdict = "Internal Error";
                                              }
                                            }

                                            exec.start( (err, stream)=> {
                                              if (err) {
                                                console.error(
                                                  "Error starting exec:",
                                                  err
                                                );
                                                if (verdict == "") {
                                                  verdict = "Internal Error";
                                                }
                                              }

                                              stream.pipe(process.stdout);
                                              let data = "";
                                              stream.on("data", (chunk) => {
                                                data += chunk;
                                              });

                                              stream.on("end", () => {
                                                console.log(data.toString());
                                                if (
                                                  data
                                                    .toString()
                                                    .endsWith(
                                                      "No such file or directory\n"
                                                    )
                                                ) {
                                                  if (verdict == "") {
                                                    verdict = "TLE";
                                                  }
                                                }
                                              });
                                            });
                                          }
                                        );

                                        console.log("vs");

                                        container.exec(
                                          {
                                            Cmd: ["cat", file2],
                                            AttachStdout: true,
                                            AttachStderr: true,
                                          },
                                          (err, exec)=> {
                                            if (err) {
                                              console.error(
                                                "Error creating exec:",
                                                err
                                              );
                                              if (verdict == "") {
                                                verdict = "Internal Error";
                                              }
                                            }

                                            exec.start((err, stream)=> {
                                              if (err) {
                                                console.error(
                                                  "Error starting exec:",
                                                  err
                                                );
                                                if (verdict == "") {
                                                  verdict = "Internal Error";
                                                }
                                              }

                                              stream.pipe(process.stdout);
                                              let data = "";
                                              stream.on("data", (chunk) => {
                                                data += chunk;
                                              });

                                              stream.on("end", () => {
                                                console.log(data.toString());
                                                if (
                                                  data
                                                    .toString()
                                                    .endsWith(
                                                      "No such file or directory\n"
                                                    )
                                                ) {
                                                  if (verdict == "") {
                                                    verdict = "Internal Error";
                                                  }
                                                }
                                              });
                                            });
                                          }
                                        );
                                      }
                                    });

                                    stream.on("error",  (error) =>{
                                      console.error(
                                        "Error during diff command:",
                                        error
                                      );
                                      if (verdict == "") {
                                        verdict = "Internal Error";
                                      }
                                    });
                                  });
                                }
                              );
                            }, 4000 * problem.time_limit);

                            setTimeout(async () => {
                              container.modem.demuxStream(
                                stream,
                                process.stdout,
                                process.stderr
                              );
                              container.stop( (err)=> {
                                if (err) {
                                  console.error(
                                    "Error stopping container:",
                                    err
                                  );
                                  if (verdict == "") {
                                    verdict = "Internal Error";
                                  }
                                }
                                console.log("Container stopped");
                                container.remove((err)=> {
                                  if (err) {
                                    console.error(
                                      "Error removing container:",
                                      err
                                    );
                                    if (verdict == "") {
                                      verdict = "Internal Error";
                                    }
                                  }
                                  console.log("Container removed");
                                });
                              });
                              console.log(verdict);
                              await this.adminDB.insertOne(this.adminDB.solution, {
                                code: code,
                                verdict: verdict,
                                problemId: problemId,
                                handle: handle,
                                timestamp: new Date(timestamp),
                                language: language,
                              });

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
                                console.log(data, handle);
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
                              res.send({ success: true, verdict: verdict });
                              fs.unlink(
                                `${uniqueId}-input_template.java`,
                                (err) => {
                                  if (err) throw err;
                                  console.log("File has been deleted");
                                }
                              );
                              fs.unlink(`${uniqueId}-input.txt`, (err) => {
                                if (err) throw err;
                                console.log("File has been deleted");
                              });
                              fs.unlink(`${uniqueId}-Solution.java`, (err) => {
                                if (err) throw err;
                                console.log("File has been deleted");
                              });
                              fs.unlink(
                                `${uniqueId}-correct_code_JAVA.java`,
                                (err) => {
                                  if (err) throw err;
                                  console.log("File has been deleted");
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
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        console.log("Token has expired");
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
  }; // working fine
   fetchSolvedProblems = async (req, res) => {
    // fetch the solved problems of the user from the solved collection
    let token = req.body.userToken;
    try {
        let decoded = this.adminJWT.verifyToken(token);
        let handle = decoded.handle;
        const data = await this.adminDB.findOne(this.adminDB.solved, {
        handle: handle},{problems:1,_id:0}
        );
        res.send({ success: true, problems: data.problems,message:"Solved problems fetched successfully" });
        
    } catch (error) {
        if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        console.log("Token has expired");
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
  }; // working fine
   fetchAllSubmissions = async (req, res) => {
    // fetch all the submissions of the user from the solution collection
    let token = req.body.token;
    try {
        let decoded = this.adminJWT.verifyToken(token);
        let handle = decoded.handle;
        let data = await this.adminDB.find(this.adminDB.solution, {
        handle: handle
        });
        if(data.length > 0){
            let problems = data.map(item => new ObjectId(item.problemId));
            const problemData = await this.adminDB.find(this.adminDB.problem, {
                _id: { $in: problems }
            },{},{title:1});
            console.log(problemData);
            data = data.map(item => {
                let problem = problemData.find(problem => problem._id.toString() === item.problemId.toString());
                return {
                    ...item,title:problem.title
                }
            });
        }
        res.send({ success: true, submissions: data,message:"Submissions fetched successfully" });
        
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
        res.send({ success: false, message: error.message });
        }
    }
  }; // working fine
   fetchAllProblems = async (req, res) => {
    // fetch all the problems from the problem collection
    try {
        let data = await this.adminDB.find(this.adminDB.problem, {},{timestamp:-1},{title:1,timestamp:1});
        res.send({ success: true, problems: data,message:"Problems fetched successfully" });
        
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
  }; // working fine
   fetchProblemDetails = async (req, res) => {
    // fetch the problem details from the problem collection
    let problemId = req.body.problemId;
    try {
        let data = await this.adminDB.findOne(this.adminDB.problem, {
        _id: new ObjectId(problemId)
        },{_id:0,correct_code_CPP:0,correct_code_JAVA:0,testcases:0});
        res.send({ success: true, problem: data,message:"Problem details fetched successfully" });
        
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
  }; // working fine
}
