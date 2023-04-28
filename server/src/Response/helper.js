import { adminDB, adminMail, adminJWT } from "../Utility/admin.js";
import bcrypt from "bcrypt";
import {problem,blog,comments,editorial} from "../DataPart/Model/schema.js";
import pkg from "jsonwebtoken";
import { ObjectId } from "mongodb";
const { TokenExpiredError} = pkg;
import Docker from 'dockerode';
import { readFileSync } from 'fs';
import { pack as _pack } from 'tar-stream';
import fs from 'fs';

export default class Helper {
  
 
  static getPostRequest = async (_req, res) => {
    const data = await adminDB.find(adminDB.problem, {
      status: "pending",
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static verifyPostRequest = async (req, res) => {
    let postId = req.body.postId;
    let response = req.body.response;
    const data = await adminDB.updateOne(
      adminDB.problem,
      {
        _id: new ObjectId(postId),
      },
      {
        status: response,
      }
    );
    if (data) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  };
  static postBlog = async (req, res) => {
    try {
      // working fine
      let token = req.body.userToken;
      let decodeData = adminJWT.verifyToken(token);
      let handle = decodeData.handle;
      let type = decodeData.type;
      let Blog = new blog(req.body);
      Blog.handle = handle;
      Blog.type = type;
      Blog.comments = [];
      const data = await adminDB.insertOne(adminDB.blog, Blog);
      if (data) {
        res.send({ success: true,message:"Blog posted." });
      } else {
        res.send({ success: false,message:"Blog cannot be posted due to internal error." });
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        console.log('Token has expired');
        res.send({success:false,message:"Token has expired."})
      } else {
        // handle other errors here
        console.log('Error:', error);
        res.send({success:false,message:"Blog posting failed."})
      }
    }
  }; // working fine
  static comment = async (req, res) => {
    try {
      let token = req.body.userToken;
      let decodeData = adminJWT.verifyToken(token);
      let Id = req.body.Id;
      let entityType = req.body.entityType;
      let handle = decodeData.handle;
      let comment = req.body.comment;
      let timestamp = req.body.timestamp;
      let Comment = new comments({handle:handle,comment:comment,timestamp:timestamp});
      const data = await adminDB.updateOne(
        entityType === 0 ? adminDB.blog : adminDB.editorials,
        { _id: new ObjectId(Id) },
        {
          $push: {
            comments: Comment,
          },
        }
        );
        console.log(data);
      if (data.modifiedCount === 1) {
        res.send({ success: true,message:"Comment posted." });
      } else {
        res.send({ success: false,message:"Comment cannot be posted due to internal error." });
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        console.log('Token has expired');
        res.send({success:false,message:"Token has expired."})
      } else {
        // handle other errors here
        console.log('Error:', error);
        res.send({success:false,message:"Comment cannot be posted due to internal error."})
      } 
    }
  }; // working fine
  static postProblem = async (req, res) => {
    // working fine
    // only need changes in the problem object
    try {
      let token = req.body.userToken;
      let decodeData = adminJWT.verifyToken(token);
      let author_email = decodeData.email;
      let author_type = decodeData.type;
      if (author_type === "0") {
        // if author is not admin or coordinator
        res.send({
          success: false,
          message: "You are not authorized to post problems.",
        });
        return;
      }
      let obj = { ...req.body, author_email: author_email };
      obj.token = undefined;
      let Problem = new problem(obj);
      const data = await adminDB.insertOne(adminDB.problem, Problem);
      if (data) {
        res.send({ success: true, message: "Problem posted successfully." });
      } else {
        res.send({ success: false,message:"Problem can't be posted due to internal reasons" });
      }
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: "Problem posting failed." });
    }
  }; 
  static postEditorial = async (req, res) => {
    try {
      // working fine
      let token = req.body.userToken;
      let decodeData = adminJWT.verifyToken(token);
      let handle = decodeData.handle;
      let type = decodeData.type;
      let Editorial = new editorial(req.body);
      Editorial.handle = handle;
      Editorial.type = type;
      if(Editorial.type === "0")
        {
          res.send({success:false,message:"You are not authorized to post editorials."});
          return;
        }
      Editorial.comments = [];
      const data = await adminDB.insertOne(adminDB.editorials, Editorial);
      if (data) {
        res.send({ success: true,message:"Editorial posted." });
      } else {
        res.send({ success: false,message:"Editorial cannot be posted due to internal error." });
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // handle the token expired error here
        console.log('Token has expired');
        res.send({success:false,message:"Token has expired."})
      } else {
        // handle other errors here
        console.log('Error:', error);
        res.send({success:false,message:"Editorial posting failed."})
      }
    }
  }; // working fine


  
  static submitSolution = async (req, res) => {
    let problemId = req.body.problemId;
    let code = req.body.code;
    let email = req.body.email;
    let date = req.body.date;
    let time = req.body.time;
    let language = req.body.language;

    const data = await adminDB.insertOne(adminDB.solution, {
        code: code,
        email: email,
        date: date,
        time: time,
        problemId: problemId,
        language: language,
    });
    if (data) {
        if (language == "C++") {

            let verdict = "";
            const docker = new Docker();
            // Define container options
            const containerOptions = {
                Image: 'gcc',
                Tty: true,
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                Cmd: ['bash']
            };
            const problem= await adminDB.findOne(adminDB.problem,{
                _id: new ObjectId(problemId)
            });

            let uniqueId=email+new Date().getTime();
            console.log(problem)
            fs.writeFile(`${uniqueId}-input_template.cpp`, problem.input_template_CPP, (err) => {
                if (err) throw err;
                console.log('Data has been written to file');
            });
            fs.writeFile(`${uniqueId}-input.txt`, problem.testcases, (err) => {
                if (err) throw err;
                console.log('Data has been written to file');
            });
            fs.writeFile(`${uniqueId}-function_def.h`, code, (err) => {
                if (err) throw err;
                console.log('Data has been written to file');
            });
            fs.writeFile(`${uniqueId}-correct_code_CPP.cpp`, problem.correct_code_CPP, (err) => {
                if (err) throw err;
                console.log('Data has been written to file');
            });
            // Create and start container
            docker.createContainer(containerOptions, function (err, container) {
                if (err) {
                    console.error('Error creating container:', err);
                    verdict="Internal Error";
                }

                container.start(function (err) {
                    if (err) {
                        console.error('Error starting container:', err);
                        verdict="Internal Error";
                    }

                    console.log('Container started');

                    // Copy code to container
                    const pack = _pack();
                    const fileContents = readFileSync(`${uniqueId}-input_template.cpp`);
                    pack.entry({ name: 'main.cpp' }, fileContents);
                    pack.finalize();

                    const pack2 = _pack();
                    const fileContents2 = readFileSync(`${uniqueId}-input.txt`);
                    pack2.entry({ name: 'input.txt' }, fileContents2);
                    pack2.finalize();

                    const pack3 = _pack();
                    const fileContents3 = readFileSync(`${uniqueId}-function_def.h`);
                    pack3.entry({ name: 'funcDef.h' }, fileContents3);
                    pack3.finalize();

                    // const pack5 = _pack(); // create a tar pack stream
                    // const fileContents5 = readFileSync('./cfuncDef.h');
                    // pack5.entry({ name: 'cfuncDef.h' }, fileContents5); // add file to the pack
                    // pack5.finalize(); // finalize the pack stream

                    const pack6 = _pack();
                    const fileContents6 = readFileSync(`${uniqueId}-correct_code_CPP.cpp`);
                    pack6.entry({ name: 'cmain.cpp' }, fileContents6);
                    pack6.finalize();

                    container.putArchive(pack, { path: '/' }, function (err) {
                        if (err) {
                            console.error('Error copying file to container:', err);
                            verdict="Internal Error";
                        }
                        console.log(' Cpp File copied to container');

                        container.putArchive(pack2, { path: '/' }, function (err) {
                            if (err) {
                                console.error('Error copying file to container:', err);
                                verdict="Internal Error";
                            }
                            console.log(' Input File copied to container');
                        },

                            container.putArchive(pack3, { path: '/' }, function (err) {
                                if (err) {
                                    console.error('Error copying file to container:', err);
                                    verdict="Internal Error";
                                }
                                console.log(' header File copied to container');
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

                                container.putArchive(pack6, { path: '/' }, function (err) {
                                    if (err) {
                                        console.error('Error copying file to container:', err);
                                        verdict="Internal Error";
                                    }
                                    console.log(' Correct output File copied to container');
                                },

                                    // Compile and run code
                                    container.exec(
                                        {
                                            Cmd: ['sh', '-c', 'gcc main.cpp -o main -lstdc++ && ./main'],
                                            AttachStdout: true,
                                            AttachStderr: true
                                        },
                                        function (err, exec) {
                                            if (err) {
                                                console.error('Error creating exec:', err);
                                                verdict="Internal Error";
                                            }

                                            exec.start(function (err, stream) {
                                                if (err) {
                                                    console.error('Error starting exec:', err);
                                                    verdict="Internal Error";
                                                }

                                                stream.on('data', function (data) {
                                                    console.log(data.toString());
                                                    if(verdict==""){
                                                        verdict = "Compilation Error";
                                                    }

                                                });

                                                stream.on('error', function (error) {
                                                    console.error('Error during compilation or runtime:', error);
                                                });


                                                // Compile and run code
                                                container.exec(
                                                    {
                                                        Cmd: ['sh', '-c', 'gcc cmain.cpp -o cmain -lstdc++ && ./cmain'],
                                                        AttachStdout: true,
                                                        AttachStderr: true
                                                    },
                                                    function (err, exec) {
                                                        if (err) {
                                                            console.error('Error creating exec:', err);
                                                            if(verdict==""){
                                                                verdict="Internal Error";
                                                            }
                                                        }

                                                        exec.start(function (err, stream) {
                                                            if (err) {
                                                                console.error('Error starting exec:', err);
                                                                if(verdict==""){
                                                                    verdict="Internal Error";
                                                                }
                                                            }

                                                            stream.on('data', function (data) {
                                                                console.log(data.toString());
                                                            });

                                                            stream.on('error', function (error) {
                                                                console.error('Error during compilation or runtime:', error);
                                                            });
                                                        })
                                                    });

                                                setTimeout(() => {
                                                    // Read the contents of the files into memory
                                                    const file1 = 'output.txt';
                                                    const file2 = 'coutput.txt';

                                                    // Run the diff command inside the container
                                                    container.exec(
                                                        {
                                                            Cmd: ['diff', file1, file2],
                                                            AttachStdout: true,
                                                            AttachStderr: true
                                                        },
                                                        function (err, exec) {
                                                            if (err) {
                                                                console.error('Error creating exec:', err);
                                                                if(verdict==""){
                                                                    verdict="Internal Error";
                                                                }
                                                            }

                                                            exec.start(function (err, stream) {
                                                                if (err) {
                                                                    console.error('Error starting exec:', err);
                                                                    if(verdict==""){
                                                                        verdict="Internal Error";
                                                                    }
                                                                }

                                                                let output = '';
                                                                stream.on('data', function (data) {
                                                                    output += data.toString();
                                                                });

                                                                stream.on('end', function () {


                                                                    // If the output of the diff command is empty, the files are the same
                                                                    if (output.trim() === '') {
                                                                        console.log('The files are the same');
                                                                        if (verdict == "") {
                                                                            verdict = "Accepted";
                                                                        }
                                                                    } else {
                                                                        console.log('The files are different');
                                                                        if (verdict == "") {
                                                                            verdict = "Wrong Answer";
                                                                        }

                                                                        // Print the contents of the files to see the differences
                                                                        container.exec(
                                                                            {
                                                                                Cmd: ['cat', file1],
                                                                                AttachStdout: true,
                                                                                AttachStderr: true
                                                                            },
                                                                            function (err, exec) {
                                                                                if (err) {
                                                                                    console.error('Error creating exec:', err);
                                                                                    if(verdict==""){
                                                                                        verdict="Internal Error";
                                                                                    }
                                                                                }

                                                                                exec.start(function (err, stream) {
                                                                                    if (err) {
                                                                                        console.error('Error starting exec:', err);
                                                                                        if(verdict==""){
                                                                                            verdict="Internal Error";
                                                                                        }
                                                                                    }

                                                                                    stream.pipe(process.stdout);
                                                                                    let data = '';
                                                                                    stream.on('data', chunk => {
                                                                                        data += chunk;
                                                                                    });

                                                                                    stream.on('end', () => {
                                                                                        console.log(data.toString());
                                                                                        if (data.toString().endsWith("No such file or directory\n")) {
                                                                                            if(verdict==""){
                                                                                                verdict="TLE";
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                });
                                                                            }
                                                                        );

                                                                        console.log('vs');

                                                                        container.exec(
                                                                            {
                                                                                Cmd: ['cat', file2],
                                                                                AttachStdout: true,
                                                                                AttachStderr: true
                                                                            },
                                                                            function (err, exec) {
                                                                                if (err) {
                                                                                    console.error('Error creating exec:', err);
                                                                                    if(verdict==""){
                                                                                        verdict="Internal Error";
                                                                                    }
                                                                                }

                                                                                exec.start(function (err, stream) {
                                                                                    if (err) {
                                                                                        console.error('Error starting exec:', err);
                                                                                        if(verdict==""){
                                                                                            verdict="Internal Error";
                                                                                        }
                                                                                    }

                                                                                    stream.pipe(process.stdout);
                                                                                    let data = '';
                                                                                    stream.on('data', chunk => {
                                                                                        data += chunk;
                                                                                    });

                                                                                    stream.on('end', () => {
                                                                                        console.log(data.toString());
                                                                                        if (data.toString().endsWith("No such file or directory\n")) {
                                                                                            if(verdict==""){
                                                                                                verdict="Internal Error";
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                });
                                                                            }
                                                                        );
                                                                    }
                                                                });

                                                                stream.on('error', function (error) {
                                                                    console.error('Error during diff command:', error);
                                                                    if(verdict==""){
                                                                        verdict="Internal Error";
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    );

                                                }, 4000*problem.time_limit);

                                                setTimeout(() => {
                                                    container.modem.demuxStream(stream, process.stdout, process.stderr);
                                                    container.stop(function (err) {
                                                        if (err) {
                                                            console.error('Error stopping container:', err);
                                                            if(verdict==""){
                                                                verdict="Internal Error";
                                                            }
                                                        
                                                        }
                                                        console.log('Container stopped');
                                                        container.remove(function (err) {
                                                            if (err) {
                                                                console.error('Error removing container:', err);
                                                                if(verdict==""){
                                                                    verdict="Internal Error";
                                                                }
                                                                
                                                            }
                                                            console.log('Container removed');
                                                        });
                                                    });
                                                    console.log(verdict);
                                                    res.send({success:true,verdict:verdict})
                                                    fs.unlink(`${uniqueId}-input_template.cpp`, (err) => {
                                                        if (err) throw err;
                                                        console.log('File has been deleted');
                                                    });
                                                    fs.unlink(`${uniqueId}-input.txt`, (err) => {
                                                        if (err) throw err;
                                                        console.log('File has been deleted');
                                                    });
                                                    fs.unlink(`${uniqueId}-function_def.h`, (err) => {
                                                        if (err) throw err;
                                                        console.log('File has been deleted');
                                                    });
                                                    fs.unlink(`${uniqueId}-correct_code_CPP.cpp`, (err) => {
                                                        if (err) throw err;
                                                        console.log('File has been deleted');
                                                    });

                                                }, 8000*problem.time_limit);
                                            }
                                            );
                                        }
                                    )
                                )
                            )
                        )
                    }
                    );
                });
            });
        }
        else if (language = "Java") {
            let verdict = "";
            const docker = new Docker();
            // Define container options
            const containerOptions = {
                Image: 'openjdk',
                Tty: true,
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                Cmd: ['bash']
            };
            const problem= await adminDB.findOne(adminDB.problem,{
                _id: new ObjectId(problemId)
            });

            let uniqueId=email+new Date().getTime();
            console.log(problem)
            fs.writeFile(`${uniqueId}-input_template.java`, problem.input_template_JAVA, (err) => {
                if (err) throw err;
                console.log('Data has been written to file');
            });
            fs.writeFile(`${uniqueId}-input.txt`, problem.testcases, (err) => {
                if (err) throw err;
                console.log('Data has been written to file');
            });
            fs.writeFile(`${uniqueId}-Solution.java`, code, (err) => {
                if (err) throw err;
                console.log('Data has been written to file');
            });
            fs.writeFile(`${uniqueId}-correct_code_JAVA.java`, problem.correct_code_JAVA, (err) => {
                if (err) throw err;
                console.log('Data has been written to file');
            });
            // Create and start container
            docker.createContainer(containerOptions, function (err, container) {
                if (err) {
                    console.error('Error creating container:', err);
                    verdict="Internal Error";
                }

                container.start(function (err) {
                    if (err) {
                        console.error('Error starting container:', err);
                        verdict="Internal Error";
                    }

                    console.log('Container started');

                    // Copy code to container
                    const pack = _pack();
                    const fileContents = readFileSync(`${uniqueId}-input_template.java`);
                    pack.entry({ name: 'Func.java' }, fileContents);
                    pack.finalize();

                    const pack2 = _pack();
                    const fileContents2 = readFileSync(`${uniqueId}-input.txt`);
                    pack2.entry({ name: 'input.txt' }, fileContents2);
                    pack2.finalize();

                    const pack3 = _pack();
                    const fileContents3 = readFileSync(`${uniqueId}-Solution.java`);
                    pack3.entry({ name: 'Solution.java' }, fileContents3);
                    pack3.finalize();

                    const pack4 = _pack();
                    const fileContents4 = readFileSync('CompareFiles.java');
                    pack4.entry({ name: 'CompareFiles.java' }, fileContents4);
                    pack4.finalize();

                    // const pack5 = _pack(); // create a tar pack stream
                    // const fileContents5 = readFileSync('./cfuncDef.h');
                    // pack5.entry({ name: 'cfuncDef.h' }, fileContents5); // add file to the pack
                    // pack5.finalize(); // finalize the pack stream

                    const pack6 = _pack();
                    const fileContents6 = readFileSync(`${uniqueId}-correct_code_JAVA.java`);
                    pack6.entry({ name: 'CorrectCode.java' }, fileContents6);
                    pack6.finalize();

                    container.putArchive(pack, { path: '/' }, function (err) {
                        if (err) {
                            console.error('Error copying file to container:', err);
                            verdict="Internal Error";
                        }
                        console.log(' Cpp File copied to container');

                        container.putArchive(pack2, { path: '/' }, function (err) {
                            if (err) {
                                console.error('Error copying file to container:', err);
                                verdict="Internal Error";
                            }
                            console.log(' Input File copied to container');
                        },

                            container.putArchive(pack3, { path: '/' }, function (err) {
                                if (err) {
                                    console.error('Error copying file to container:', err);
                                    verdict="Internal Error";
                                }
                                console.log(' header File copied to container');
                            },

                            container.putArchive(pack4, { path: '/' }, function (err) {
                                if (err) {
                                    console.error('Error copying file to container:', err);
                                    verdict="Internal Error";
                                }
                                console.log(' header File copied to container');
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

                                container.putArchive(pack6, { path: '/' }, function (err) {
                                    if (err) {
                                        console.error('Error copying file to container:', err);
                                        verdict="Internal Error";
                                    }
                                    console.log(' Correct output File copied to container');
                                },

                                    // Compile and run code
                                    container.exec(
                                        {
                                            Cmd: ['sh', '-c', 'javac *.java && java Func'],
                                            AttachStdout: true,
                                            AttachStderr: true
                                        },
                                        function (err, exec) {
                                            if (err) {
                                                console.error('Error creating exec:', err);
                                                verdict="Internal Error";
                                            }

                                            exec.start(function (err, stream) {
                                                if (err) {
                                                    console.error('Error starting exec:', err);
                                                    verdict="Internal Error";
                                                }

                                                stream.on('data', function (data) {
                                                    console.log(data.toString());
                                                    if(verdict==""){
                                                        verdict = "Compilation Error";
                                                    }

                                                });

                                                stream.on('error', function (error) {
                                                    console.error('Error during compilation or runtime:', error);
                                                });


                                                // Compile and run code
                                                container.exec(
                                                    {
                                                        Cmd: ['sh', '-c', 'javac *.java && java CorrectCode'],
                                                        AttachStdout: true,
                                                        AttachStderr: true
                                                    },
                                                    function (err, exec) {
                                                        if (err) {
                                                            console.error('Error creating exec:', err);
                                                            if(verdict==""){
                                                                verdict="Internal Error";
                                                            }
                                                        }

                                                        exec.start(function (err, stream) {
                                                            if (err) {
                                                                console.error('Error starting exec:', err);
                                                                if(verdict==""){
                                                                    verdict="Internal Error";
                                                                }
                                                            }

                                                            stream.on('data', function (data) {
                                                                console.log(data.toString());
                                                            });

                                                            stream.on('error', function (error) {
                                                                console.error('Error during compilation or runtime:', error);
                                                            });
                                                        })
                                                    });

                                                setTimeout(() => {
                                                    // Read the contents of the files into memory
                                                    const file1 = 'output.txt';
                                                    const file2 = 'coutput.txt';

                                                    // Run the diff command inside the container
                                                    container.exec(
                                                        {
                                                            Cmd: ['sh', '-c','javac *.java && java CompareFiles'],
                                                            AttachStdout: true,
                                                            AttachStderr: true
                                                        },
                                                        function (err, exec) {
                                                            if (err) {
                                                                console.error('Error creating exec:', err);
                                                                if(verdict==""){
                                                                    verdict="Internal Error";
                                                                }
                                                            }

                                                            exec.start(function (err, stream) {
                                                                if (err) {
                                                                    console.error('Error starting exec:', err);
                                                                    if(verdict==""){
                                                                        verdict="Internal Error";
                                                                    }
                                                                }

                                                                let output = '';
                                                                stream.on('data', function (data) {
                                                                    output += data.toString();
                                                                });

                                                                stream.on('end', function () {


                                                                    // If the output of the diff command is empty, the files are the same
                                                                    if (output.trim() === '') {
                                                                        console.log('The files are the same');
                                                                        if (verdict == "") {
                                                                            verdict = "Accepted";
                                                                        }
                                                                    } else {
                                                                        console.log('The files are different');
                                                                        console.log(output);
                                                                        if (verdict == "") {
                                                                            verdict = "Wrong Answer";
                                                                        }

                                                                        // Print the contents of the files to see the differences
                                                                        container.exec(
                                                                            {
                                                                                Cmd: ['cat', file1],
                                                                                AttachStdout: true,
                                                                                AttachStderr: true
                                                                            },
                                                                            function (err, exec) {
                                                                                if (err) {
                                                                                    console.error('Error creating exec:', err);
                                                                                    if(verdict==""){
                                                                                        verdict="Internal Error";
                                                                                    }
                                                                                }

                                                                                exec.start(function (err, stream) {
                                                                                    if (err) {
                                                                                        console.error('Error starting exec:', err);
                                                                                        if(verdict==""){
                                                                                            verdict="Internal Error";
                                                                                        }
                                                                                    }

                                                                                    stream.pipe(process.stdout);
                                                                                    let data = '';
                                                                                    stream.on('data', chunk => {
                                                                                        data += chunk;
                                                                                    });

                                                                                    stream.on('end', () => {
                                                                                        console.log(data.toString());
                                                                                        if (data.toString().endsWith("No such file or directory\n")) {
                                                                                            if(verdict==""){
                                                                                                verdict="TLE";
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                });
                                                                            }
                                                                        );

                                                                        console.log('vs');

                                                                        container.exec(
                                                                            {
                                                                                Cmd: ['cat', file2],
                                                                                AttachStdout: true,
                                                                                AttachStderr: true
                                                                            },
                                                                            function (err, exec) {
                                                                                if (err) {
                                                                                    console.error('Error creating exec:', err);
                                                                                    if(verdict==""){
                                                                                        verdict="Internal Error";
                                                                                    }
                                                                                }

                                                                                exec.start(function (err, stream) {
                                                                                    if (err) {
                                                                                        console.error('Error starting exec:', err);
                                                                                        if(verdict==""){
                                                                                            verdict="Internal Error";
                                                                                        }
                                                                                    }

                                                                                    stream.pipe(process.stdout);
                                                                                    let data = '';
                                                                                    stream.on('data', chunk => {
                                                                                        data += chunk;
                                                                                    });

                                                                                    stream.on('end', () => {
                                                                                        console.log(data.toString());
                                                                                        if (data.toString().endsWith("No such file or directory\n")) {
                                                                                            if(verdict==""){
                                                                                                verdict="Internal Error";
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                });
                                                                            }
                                                                        );
                                                                    }
                                                                });

                                                                stream.on('error', function (error) {
                                                                    console.error('Error during diff command:', error);
                                                                    if(verdict==""){
                                                                        verdict="Internal Error";
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    );

                                                }, 4000*problem.time_limit);

                                                setTimeout(() => {
                                                    container.modem.demuxStream(stream, process.stdout, process.stderr);
                                                    container.stop(function (err) {
                                                        if (err) {
                                                            console.error('Error stopping container:', err);
                                                            if(verdict==""){
                                                                verdict="Internal Error";
                                                            }
                                                        
                                                        }
                                                        console.log('Container stopped');
                                                        container.remove(function (err) {
                                                            if (err) {
                                                                console.error('Error removing container:', err);
                                                                if(verdict==""){
                                                                    verdict="Internal Error";
                                                                }
                                                                
                                                            }
                                                            console.log('Container removed');
                                                        });
                                                    });
                                                    console.log(verdict);
                                                    res.send({success:true,verdict:verdict})
                                                    fs.unlink(`${uniqueId}-input_template.java`, (err) => {
                                                        if (err) throw err;
                                                        console.log('File has been deleted');
                                                    });
                                                    fs.unlink(`${uniqueId}-input.txt`, (err) => {
                                                        if (err) throw err;
                                                        console.log('File has been deleted');
                                                    });
                                                    fs.unlink(`${uniqueId}-Solution.java`, (err) => {
                                                        if (err) throw err;
                                                        console.log('File has been deleted');
                                                    });
                                                    fs.unlink(`${uniqueId}-correct_code_JAVA.java`, (err) => {
                                                        if (err) throw err;
                                                        console.log('File has been deleted');
                                                    });

                                                }, 8000*problem.time_limit);
                                            }
                                            );
                                        }
                                    )
                                )
                            )
                        )
                    )}
                    );
                });
            });
        }
    } else {
        res.send({ success: false });
    }

};
  static getEditorial = async (req, res) => {
    // working fine
    let problemId = req.body.problemId;
    const data = await adminDB.findOne(adminDB.editorial, {
      problemId: new ObjectId(problemId),
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static getBlogs = async (_req, res) => {
    // working fine
    const data = await adminDB.find(adminDB.blog,{},{"timestamp":-1});
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static fetchBlogComments = async (req, res) => {
    let blogId = req.body.blogId;
    const data = await adminDB.findOne(adminDB.blog, {
      _id: new ObjectId(blogId),
    });
    if (data) {
      res.send({ data: data.comments, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static fetchProblemSets = async (_req, res) => {
    const data = await adminDB.find(adminDB.problem, {
      status: "accepted",
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static getProblemDetails = async (req, res) => {
    let problemId = req.body.problemId;
    const data = await adminDB.findOne(adminDB.problem, {
      _id: new ObjectId(problemId),
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static viewEditorials = async (req, res) => {
    let problemId = req.body.problemlId;
    const data = await adminDB.findOne(adminDB.editorial, {
      _id: new ObjectId(problemId),
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  static getVerdict = async (req, res) => {
    let problemId = req.body.problemId;
    const data = await adminDB.find(adminDB.solution, {
      problemId: problemId,
    });
    if (data) {
      res.send({ data: data, success: true });
    } else {
      res.send({ success: false });
    }
  };
  
}
