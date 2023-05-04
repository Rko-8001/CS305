import sinon,{ stub, match, restore } from "sinon";
import { expect } from "chai";
import jwt from "jsonwebtoken";
const { TokenExpiredError } = jwt;
import Blog from "../src/Response/blog.js";
import { blog } from "../src/DataPart/Model/schema.js";
import { editorial } from "../src/DataPart/Model/schema.js";
import { ObjectId } from "mongodb";
describe("Blog", () => {
  let adminDB, adminJWT, req, res;

  describe("postBlog", () => {
    let testBlog, postBlog;
    let handle = "testHandle";
    let type = "testType";
    beforeEach(() => {
      // Mocking req and res objects
      req = {
        body: {
          userToken: "validToken",
        },
      };
      res = {
        send: stub(),
      };

      // Mocking adminJWT, adminDB, and blog objects
      adminJWT = {
        verifyToken: stub(),
      };

      adminDB = {
        insertOne: stub(),
        blog: {},
      };

      testBlog = new Blog(adminDB, adminJWT);
      // Importing the postBlog function
    });
    afterEach(() => {
      // Restoring the stubbed functions
      restore();
    });

    it("should post a blog and send success response", async () => {
      // Stubbing adminJWT.verifyToken to return handle and type
      adminJWT.verifyToken.returns({ handle: handle, type: type });

      // Stubbing adminDB.insertOne to return data
      adminDB.insertOne.returns({});

      // Calling the postBlog function
      await testBlog.postBlog(req, res);

      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be
        .true;
      expect(
        adminDB.insertOne.calledOnceWith(adminDB.blog, match.instanceOf(blog))
      ).to.be.true;
      expect(
        res.send.calledOnceWith({ success: true, message: "Blog posted." })
      ).to.be.true;
    });

    it("should handle TokenExpiredError and send appropriate response", async () => {
      // Stubbing adminJWT.verifyToken to throw TokenExpiredError
      adminJWT.verifyToken.throws(new TokenExpiredError("Token expired"));

      // Calling the postBlog function
      await testBlog.postBlog(req, res);

      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be
        .true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "Token has expired.",
        })
      ).to.be.true;
    });

    it("should handle other errors and send error response", async () => {
      // Stubbing adminJWT.verifyToken to throw an error
      adminJWT.verifyToken.throws(new Error("Some error"));

      // Calling the postBlog function
      await testBlog.postBlog(req, res);

      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be
        .true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "Blog posting failed.",
        })
      ).to.be.true;
    });
  });

  describe("postEditorial", () => {
    let testEditorial;
    let handle = "testHandle";
    beforeEach(() => {
      // Mocking req and res objects
      req = {
        body: {
          userToken: "validToken",
        },
      };
      res = {
        send: stub(),
      };

      // Mocking adminJWT, adminDB, and editorial objects
      adminJWT = {
        verifyToken: stub(),
      };

      adminDB = {
        insertOne: stub(),
        editorials: "editorials",
      };

      testEditorial = new Blog(adminDB, adminJWT);

      // Importing the postEditorial function
    });

    afterEach(() => {
      // Restoring the stubbed functions
      restore();
    });

    it("should post an editorial and send success response", async () => {
      // Stubbing adminJWT.verifyToken to return handle and type
      adminJWT.verifyToken.returns({ handle: handle, type: "1" });

      // Stubbing adminDB.insertOne to return data
      adminDB.insertOne.returns({});

      // Calling the postEditorial function
      await testEditorial.postEditorial(req, res);

      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be
        .true;
      expect(
        adminDB.insertOne.calledOnceWith(
          adminDB.editorials,
          match.instanceOf(editorial)
        )
      ).to.be.true;
      expect(
        res.send.calledOnceWith({ success: true, message: "Editorial posted." })
      ).to.be.true;
    });

    it("should not post an editorial and send unauthorized response for type 0", async () => {
      // Stubbing adminJWT.verifyToken to return handle and type
      adminJWT.verifyToken.returns({ handle: handle, type: "0" });

      // Calling the postEditorial function
      await testEditorial.postEditorial(req, res);

      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be
        .true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "You are not authorized to post editorials.",
        })
      ).to.be.true;
    });

    it("should handle TokenExpiredError and send appropriate response", async () => {
      // Stubbing adminJWT.verifyToken to throw TokenExpiredError
      adminJWT.verifyToken.throws(new TokenExpiredError("Token expired"));

      // Calling the postEditorial function
      await testEditorial.postEditorial(req, res);

      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be
        .true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "Token has expired.",
        })
      ).to.be.true;
    });

    it("should handle other errors and send error response", async () => {
      // Stubbing adminJWT.verifyToken to throw an error
      adminJWT.verifyToken.throws(new Error("Some error"));

      // Calling the postEditorial function
      await testEditorial.postEditorial(req, res);

      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be
        .true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "Editorial posting failed.",
        })
      ).to.be.true;
    });
    it("should handle other errors and send error response", async () => {
      // Stubbing adminJWT.verifyToken to throw an error
      adminJWT.verifyToken.throws(new Error("Some error"));

      // Calling the postEditorial function
      await testEditorial.postEditorial(req, res);

      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be
        .true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "Editorial posting failed.",
        })
      ).to.be.true;
    });
  });

  describe("getBlog", () => {
    let testBlog;

    beforeEach(() => {
      // Mocking req and res objects
      req = {
        body: {
          blogId: "validBlogId1",
        },
      };
      res = {
        send: stub(),
      };

      // Mocking adminDB object
      adminDB = {
        findOne: stub(),
        blog: "blog",
      };

      // Importing the getBlogComments function
      testBlog = new Blog(adminDB, {});
    });

    it("should get blog comments and send success response", async () => {
      const expectedComments = ["comment1", "comment2"];

      // Stubbing adminDB.findOne to return data with comments
      adminDB.findOne.returns({ comments: expectedComments });

      // Calling the getBlogComments function
      await testBlog.getBlog(req, res);

      // Assertions
      expect(
        adminDB.findOne.calledOnceWith(
          adminDB.blog,
          { _id: new ObjectId("validBlogId1") },
        )
      ).to.be.true;
      expect(
        res.send.calledOnceWith({
          data: { comments: expectedComments },
          success: true,
          message: "Data sent successfully.",
        })
      ).to.be.true;
    });

    it("should handle error and send error response", async () => {
      // Stubbing adminDB.findOne to throw an error
      adminDB.findOne.throws(new Error("Some error"));

      // Calling the getBlogComments function
      await testBlog.getBlog(req, res);

      // Assertions
      expect(
        adminDB.findOne.calledOnceWith(
          adminDB.blog,
          { _id: new ObjectId("validBlogId1") },
          
        )
      ).to.be.true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "Data could not be sent due to some internal error.",
        })
      ).to.be.true;
    });
  });


describe('getBlogs', () => {
  let testBlog;

  beforeEach(() => {
    // Mocking res object
    res = {
      send: stub(),
    };

    // Mocking adminDB object
    adminDB = {
      find:stub(),
      blog: 'blog',
    };

    // Importing the getBlogs function
    testBlog = new Blog(adminDB, {});
  });

  it('should get blogs and send success response', async () => {
    const expectedBlogs = ['blog1', 'blog2'];

    // Stubbing adminDB.find to return data with blogs
    adminDB.find.returns(expectedBlogs);

    // Calling the getBlogs function
    await testBlog.getBlogs({}, res);

    // Assertions
    expect(adminDB.find.calledOnceWith(adminDB.blog, {}, { timestamp: -1 }, { comments: 0 })).to.be.true;
    expect(res.send.calledOnceWith({ data: expectedBlogs, success: true, message: 'Blogs sent successfully.' })).to.be.true;
  });

  it('should handle error and send error response', async () => {
    // Stubbing adminDB.find to throw an error
    adminDB.find.throws(new Error('Some error'));

    // Calling the getBlogs function
    await testBlog.getBlogs({}, res);

    // Assertions
    expect(adminDB.find.calledOnceWith(adminDB.blog, {}, { timestamp: -1 }, { comments: 0 })).to.be.true;
    expect(res.send.calledOnceWith({ success: false, message: 'Blogs could not be sent due to some internal error.' })).to.be.true;
  });
});

describe('comment', () => {
let comment;
  beforeEach(() => {
    adminDB = {
      updateOne: sinon.stub(),
      blog: 'blog',

    }
    adminJWT = {
      verifyToken: sinon.stub(),
    };
    req = {
      body: {
        userToken: 'testToken',
        Id: 'testId123445',
        entityType: 'blog',
        comment: 'testComment',
        timestamp: Date.now(),
      },
    };
    res = {
      send: sinon.spy(),
    };
    comment = new Blog(adminDB, adminJWT).comment;
  });

  it('should post a comment to a blog or editorial', async () => {
    const decodeData = { handle: 'testHandle' };
    const updateResult = { modifiedCount: 1 };
    const expectedComment = {
      handle: decodeData.handle,
      comment: req.body.comment,
      timestamp: req.body.timestamp,
    };

    adminJWT.verifyToken.returns(decodeData);
    adminDB.updateOne.returns(updateResult);

    await comment(req, res);

    expect(adminJWT.verifyToken.calledOnce).to.be.true;
    expect(adminJWT.verifyToken.firstCall.args[0]).to.equal(req.body.userToken);
    expect(adminDB.updateOne.calledOnce).to.be.true;
    // expect(adminDB.updateOne.firstCall.args[0]).to.equal(adminDB.blog);
    // expect(adminDB.updateOne.firstCall.args[1]).to.deep.equal({
    //   _id: new ObjectId(req.body.Id),
    // });
    // expect(adminDB.updateOne.firstCall.args[2]).to.deep.equal({
    //   $push: {
    //     comments: expectedComment,
    //   },
    // });
    expect(res.send.calledOnce).to.be.true;
    expect(res.send.firstCall.args[0]).to.deep.equal({
      success: true,
      message: 'Comment posted.',
    });
  });

  it('should handle token expired errors', async () => {
    const expiredError = new TokenExpiredError('TokenExpiredError');
    adminJWT.verifyToken.throws(expiredError);

    await comment(req, res);

    expect(res.send.calledOnce).to.be.true;
    expect(res.send.firstCall.args[0]).to.deep.equal({
      success: false,
      message: 'Token has expired.',
    });
  });

  it('should handle other errors', async () => {
    const errorMessage = 'Error posting comment';
    adminDB.updateOne = sinon.stub().throws(new Error(errorMessage));
    adminJWT.verifyToken.returns({ handle: 'testHandle' });
    await comment(req, res);

    expect(res.send.calledOnce).to.be.true;
    expect(res.send.firstCall.args[0]).to.deep.equal({
      success: false,
      message: 'Comment cannot be posted due to internal error.',
    });
  });
});

});
