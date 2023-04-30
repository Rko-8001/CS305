import {blog,comments,editorial} from "../DataPart/Model/schema.js";
import pkg from "jsonwebtoken";
import { ObjectId } from "mongodb";
const { TokenExpiredError} = pkg;
import { pack as _pack } from 'tar-stream';

export default class Blog{
    constructor(adminDB,adminJWT){
      this.adminDB = adminDB;
      this.adminJWT = adminJWT;
    }
     postBlog = async (req, res) => {
        try {
          // working fine
          let token = req.body.userToken;
          let decodeData = this.adminJWT.verifyToken(token);
          let handle = decodeData.handle;
          let type = decodeData.type;
          let Blog = new blog(req.body);
          Blog.handle = handle;
          Blog.type = type;
          Blog.comments = [];
          const data = await this.adminDB.insertOne(this.adminDB.blog, Blog);
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
       comment = async (req, res) => {
        try {
          let token = req.body.userToken;
          let decodeData = this.adminJWT.verifyToken(token);
          let Id = req.body.Id;
          let entityType = req.body.entityType;
          let handle = decodeData.handle;
          let comment = req.body.comment;
          let timestamp = req.body.timestamp;
          let Comment = new comments({handle:handle,comment:comment,timestamp:timestamp});
          const data = await this.adminDB.updateOne(
            entityType ? this.adminDB.blog : this.adminDB.editorials,
            { _id: new ObjectId(Id) },
            {
              $push: {
                comments: Comment,
              },
            }
            );
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
       postEditorial = async (req, res) => {
        try {
          // working fine
          let token = req.body.userToken;
          let decodeData = this.adminJWT.verifyToken(token);
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
          const data = await this.adminDB.insertOne(this.adminDB.editorials, Editorial);
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
       getEditorial = async (req, res) => {
        try {
            let problemId = req.body.problemId;
            const data = await this.adminDB.findOne(this.adminDB.editorials, {
              problemId: new ObjectId(problemId),
            });
            if (data) {
              res.send({ data: data, message:"Editorial sent successfully.",success: true });
            } else {
              res.send({ success: false,message:"Either editorial has not been made yet or the problemId is invalid." });
            }
        } catch (error) {
            console.log(error);
            res.send({ success: false,message:"Editorial could not be sent due to some internal error." });
        }
      }; // working fine
       getBlogs = async (_req, res) => {
        try {
            const data = await this.adminDB.find(this.adminDB.blog,{},{"timestamp":-1},{comments : 0});
            if (data) {
              res.send({ data: data, success: true,message:"Blogs sent successfully." });
            } else {
              res.send({ success: false,message:"Blogs could not be sent due to some internal error." });
            }
        } catch (error) {
            res.send({ success: false,message:"Blogs could not be sent due to some internal error." });
        }
      }; // working fine
       getBlogComments = async (req,res) => {
        try {
          let blogId = req.body.blogId;
          const data = await this.adminDB.findOne(this.adminDB.blog, {
            _id: new ObjectId(blogId),
          },{comments:1,_id:0});
          if (data) {
            res.send({ data: data.comments, success: true,message:"Comments sent successfully." });
          } else {
            res.send({ success: false,message:"Comments could not be sent due to some internal error." });
          }
        } catch (error) {
          res.send({ success: false,message:"Comments could not be sent due to some internal error." });
        }
      } // working fine
}