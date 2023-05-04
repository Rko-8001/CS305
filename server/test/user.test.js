import chai from "chai";
import { stub, restore } from "sinon";
import bcrypt from "bcrypt";
import User from "../src/Response/user.js";
import jwt from "jsonwebtoken";
const { expect } = chai;
const { TokenExpiredError,JsonWebTokenError } = jwt;
describe("User", () => {
  let user;
  let handle = "user";
  let type = 0;
  let password = "password";
  let email = "test@examaple.com";
  let adminDB;
  let adminJWT;
  let req;
  let res;

  describe("userLogin", () => {
    beforeEach(() => {
      adminDB = {
        users: "users",
        findOne: stub(),
      };

      adminJWT = {
        createToken: stub(),
      };

      req = {
        body: {
          email: email,
          password: password,
        },
      };

      res = {
        send: stub(),
      };

      user = new User(adminDB, adminJWT);
    });

    afterEach(() => {
      restore();
    });
    it("should send success response if login is successful", async () => {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      adminDB.findOne.resolves({
        email: req.body.email,
        password: hashedPassword,
        type: type,
        handle: handle,
      });

      stub(bcrypt, "compare").callsFake((_password, hash, callback) => {
        callback(null, bcrypt.compareSync(_password, hash));
      });
      adminJWT.createToken.returns("mockToken");

      await user.userLogin(req, res);

      expect(
        adminDB.findOne.calledOnceWithExactly(
          adminDB.users,
          { email: email },
          {
            password: 1,
            type: 1,
            handle: 1,
          }
        )
      ).to.be.true;
      expect(bcrypt.compare.calledOnce).to.be.true;
      expect(adminJWT.createToken.calledOnceWithExactly(email, handle, type)).to
        .be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.deep.equal({
        success: true,
        message: "Login Successful",
        type: type,
        userToken: "mockToken",
      });
    });

    it("should send error response if password does not match", async () => {
      const hashedPassword = bcrypt.hashSync("", 10);

      adminDB.findOne.resolves({
        email: req.body.email,
        password: hashedPassword,
        type: type,
        handle: handle,
      });

      stub(bcrypt, "compare").callsFake((_password, hash, callback) => {
        callback(null, bcrypt.compareSync(_password, hash));
      });

      await user.userLogin(req, res);

      expect(
        adminDB.findOne.calledOnceWithExactly(
          adminDB.users,
          { email: email },
          {
            password: 1,
            type: 1,
            handle: 1,
          }
        )
      ).to.be.true;
      expect(bcrypt.compare.calledOnce).to.be.true;
      expect(adminJWT.createToken.calledOnceWithExactly(email, handle, type)).to
        .be.false;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.deep.equal({
        success: false,
        message: "Invalid Email or Password",
      });
    });

    it("should send error response if user does not exist", async () => {
      adminDB.findOne.resolves(null);

      await user.userLogin(req, res);
      stub(bcrypt, "compare").callsFake((_password, hash, callback) => {
        callback(null, bcrypt.compareSync(_password, hash));
      });
      expect(
        adminDB.findOne.calledOnceWithExactly(
          adminDB.users,
          { email: email },
          {
            password: 1,
            type: 1,
            handle: 1,
          }
        )
      ).to.be.true;
      expect(bcrypt.compare.called).to.be.false;
      expect(adminJWT.createToken.calledOnceWithExactly(email, handle, type)).to
        .be.false;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.deep.equal({
        success: false,
        message: "Invalid Email or Password",
      });
    });

    // ...

    it("should send error response if an error occurs", async () => {
      adminDB.findOne.rejects(new Error("Database error"));
      stub(bcrypt, "compare").callsFake((_password, hash, callback) => {
        callback(null, bcrypt.compareSync(_password, hash));
      });
      await user.userLogin(req, res);

      expect(
        adminDB.findOne.calledOnceWithExactly(
          adminDB.users,
          { email: email },
          {
            password: 1,
            type: 1,
            handle: 1,
          }
        )
      ).to.be.true;
      expect(bcrypt.compare.called).to.be.false;
      expect(adminJWT.createToken.calledOnceWithExactly(email, handle, type)).to
        .be.false;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.deep.equal({
        success: false,
        message: "Database error",
      });
    });
  });
  describe("getUserDetails", () => {
    beforeEach(() => {
      adminDB = {
        users: "users",
        findOne: stub(),
      };

      adminJWT = {
        verifyToken: stub(),
      };

      req = {
        body: {
          userToken: "mockToken",
        },
      };

      res = {
        send: stub(),
      };

      user = new User(adminDB, adminJWT);
    });

    afterEach(() => {
      restore();
    });

    it("should send user details if token is valid and user exists", async () => {
      const decodedToken = {
        email: email,
      };

      adminJWT.verifyToken.returns(decodedToken);
      adminDB.findOne.resolves({ email: decodedToken.email });

      await user.getUserDetails(req, res);

      expect(adminJWT.verifyToken.calledOnceWithExactly(req.body.userToken)).to
        .be.true;
      expect(
        adminDB.findOne.calledOnceWithExactly(
          adminDB.users,
          { email: decodedToken.email },
          { password: 0, _id: 0 }
        )
      ).to.be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: true,
          message: "User Details",
          user: { email: decodedToken.email },
        })
      ).to.be.true;
    });

    it("should send error response if token is expired", async () => {
      const tokenExpiredError = new jwt.TokenExpiredError("Token has expired");
      adminJWT.verifyToken.throws(tokenExpiredError);

      await user.getUserDetails(req, res);

      expect(adminJWT.verifyToken.calledOnceWithExactly(req.body.userToken)).to
        .be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: "Token has expired.",
        })
      ).to.be.true;
    });

    it("should send error response if token is invalid", async () => {
      const jsonWebTokenError = new jwt.JsonWebTokenError("Invalid token");
      adminJWT.verifyToken.throws(jsonWebTokenError);

      await user.getUserDetails(req, res);

      expect(adminJWT.verifyToken.calledOnceWithExactly(req.body.userToken)).to
        .be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: "User has logged out.Kindly login again",
        })
      ).to.be.true;
    });

    it("should send error response if an error occurs", async () => {
      const errorMessage = "Database error";
      adminJWT.verifyToken.throws(new Error(errorMessage));

      await user.getUserDetails(req, res);

      expect(adminJWT.verifyToken.calledOnceWithExactly(req.body.userToken)).to
        .be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: errorMessage,
        })
      ).to.be.true;
    });
  });
  describe("updateProfile", () => {
    let city = "city";
    let userToken = "mockToken";
    let birthdate = "birthdate";
    let address = "address";
    beforeEach(() => {
      adminDB = {
        findOne: stub(),
        updateOne: stub(),
        users: "users",
      };

      adminJWT = {
        verifyToken: stub(),
      };

      req = {
        body: {
          userToken: userToken,
          city: city,
          birthdate: birthdate,
          address: address,
        },
      };

      res = {
        send: stub(),
      };

      user = new User(adminDB, adminJWT);
    });
    afterEach(() => {
      restore();
    });
    it("should update profile if user exists and token is valid", async () => {
      const decodedToken = {
        email: email,
      };
      adminJWT.verifyToken.returns(decodedToken);
      adminDB.findOne.resolves({ email: decodedToken.email });

      await user.updateProfile(req, res);

      expect(adminJWT.verifyToken.calledOnceWithExactly(req.body.userToken)).to
        .be.true;
      expect(
        adminDB.findOne.calledOnceWithExactly(adminDB.users, {
          email: decodedToken.email,
        })
      ).to.be.true;
      expect(
        adminDB.updateOne.calledOnceWithExactly(
          adminDB.users,
          { email: decodedToken.email },
          {
            $set: {
              city: req.body.city,
              birthdate: req.body.birthdate,
              address: req.body.address,
            },
          }
        )
      ).to.be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: true,
          message: "Profile Updated Successfully",
        })
      ).to.be.true;
    });

    it("should send error response if token is expired", async () => {
      const tokenExpiredError = new TokenExpiredError("Token has expired");
      tokenExpiredError.name = "TokenExpiredError";
      adminJWT.verifyToken.throws(tokenExpiredError);

      await user.updateProfile(req, res);

      expect(adminJWT.verifyToken.calledOnceWithExactly(req.body.userToken)).to
        .be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: "Token has expired.",
        })
      ).to.be.true;
    });

    it("should send error response if an error occurs during update", async () => {
      const errorMessage = "Database error";
      adminJWT.verifyToken.throws(new Error(errorMessage));

      await user.updateProfile(req, res);

      expect(adminJWT.verifyToken.calledOnceWithExactly(req.body.userToken)).to
        .be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: "Profile Updation Failed.",
        })
      ).to.be.true;
    });

    it("should send error response if user does not exist", async () => {
      const decodedToken = {
        email: "test@example.com",
      };

      adminJWT.verifyToken.returns(decodedToken);
      adminDB.findOne.resolves(null);

      await user.updateProfile(req, res);

      expect(adminJWT.verifyToken.calledOnceWithExactly(req.body.userToken)).to
        .be.true;
      expect(
        adminDB.findOne.calledOnceWithExactly(adminDB.users, {
          email: decodedToken.email,
        })
      ).to.be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: "User does not exists",
        })
      ).to.be.true;
    });
  });
  describe("fillDetails", () => {
    let adminDB;
    let req;
    let res;

    beforeEach(() => {
      adminDB = {
        findOne: stub(),
        insertOne: stub(),
        users: "users",
      };

      req = {
        body: {
          email: email,
          password: password,
          name: "user",
          handle: handle,
        },
      };

      res = {
        send: stub(),
      };
      user = new User(adminDB);
    });
    afterEach(() => {
      restore();
    });
    it("should send error response if user already exists", async () => {
      const existingUser = {
        email: req.body.email,
      };

      adminDB.findOne.resolves(existingUser);

      await user.fillDetails(req, res);

      expect(
        adminDB.findOne.calledOnceWithExactly(adminDB.users, {
          email: req.body.email,
        })
      ).to.be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: "User already exists",
        })
      ).to.be.true;
    });

    it("should send error response if any required detail is missing", async () => {
      req.body.email = "";
      req.body.password = "";
      req.body.name = "";
      req.body.handle = "";

      await user.fillDetails(req, res);

      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: "Please fill all the details.",
        })
      ).to.be.true;
    });

    it("should send error response if bcrypt hash fails", async () => {
      const errorMessage = "Bcrypt hash failed";
      stub(bcrypt, "hash").yields(new Error(errorMessage));

      await user.fillDetails(req, res);

      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: "User Registration Failed due to some internal error.",
        })
      ).to.be.true;

      restore();
    });

    it("should register the user if all details are provided and user does not exist", async () => {
      const hashedPassword = "hashedPassword";
      const newUser = {
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
        handle: req.body.handle,
        type: "0",
        city: null,
        birthdate: null,
        address: null,
      };
      stub(bcrypt, "hash").callsFake((_password, _len, callback) => {
        callback(null, hashedPassword);
      });
      adminDB.findOne.resolves(null);

      await user.fillDetails(req, res);

      expect(
        adminDB.findOne.calledOnceWithExactly(adminDB.users, {
          email: req.body.email,
        })
      ).to.be.true;
      expect(bcrypt.hash.called).to.be.true;
      expect(adminDB.insertOne.calledWithExactly(adminDB.users, newUser)).to.be
        .true;
      expect(
        adminDB.insertOne.calledWithExactly(adminDB.solved, {
          handle: req.body.handle,
          problems: [],
        })
      ).to.be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: true,
          message: "User Registered Successfully",
        })
      ).to.be.true;

      restore();
    });

    it("should send error response if user registration fails", async () => {
      const hashedPassword = "hashedPassword";
      stub(bcrypt, "hash").callsFake((_password, _len, callback) => {
        callback(null, hashedPassword);
      });
      adminDB.findOne.resolves(null);
      adminDB.insertOne.throws(new Error("Database error"));

      await user.fillDetails(req, res);

      expect(
        adminDB.findOne.calledOnceWithExactly(adminDB.users, {
          email: req.body.email,
        })
      ).to.be.true;
      expect(bcrypt.hash.called).to.be.true;
      expect(
        adminDB.insertOne.calledOnceWithExactly(adminDB.users, {
          email: req.body.email,
          password: hashedPassword,
          name: req.body.name,
          handle: req.body.handle,
          type: "0",
          city: null,
          birthdate: null,
          address: null,
        })
      ).to.be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: "User Registration Failed",
        })
      ).to.be.true;

      restore();
    });
  });
  describe("verifyOTP", () => {
    let otp = "123456";
    beforeEach(() => {
      adminDB = {
        findOne: stub(),
        deleteOne: stub(),
        otp: "otp",
      };

      req = {
        body: {
          email: email,
          otp: otp,
        },
      };

      res = {
        send: stub(),
      };
      user = new User(adminDB, {}, {});
    });

    it("should send success response if OTP matches", async () => {
      adminDB.findOne.resolves({
        email: req.body.email,
        otp: req.body.otp,
      });

      await user.verifyOTP(req, res);

      expect(
        adminDB.findOne.calledOnceWithExactly(adminDB.otp, {
          email: req.body.email,
        })
      ).to.be.true;
      expect(
        adminDB.deleteOne.calledOnceWithExactly(adminDB.otp, {
          email: req.body.email,
        })
      ).to.be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: true,
          message: "OTP Verified Successfully",
        })
      ).to.be.true;
    });

    it("should send error response if OTP does not match", async () => {
      adminDB.findOne.resolves({
        email: req.body.email,
        otp: "wrongOTP",
      });

      await user.verifyOTP(req, res);

      expect(
        adminDB.findOne.calledOnceWithExactly(adminDB.otp, {
          email: req.body.email,
        })
      ).to.be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: "Invalid OTP",
        })
      ).to.be.true;
    });

    it("should send error response if OTP verification fails", async () => {
      adminDB.findOne.throws(new Error("Database error"));

      await user.verifyOTP(req, res);

      expect(
        adminDB.findOne.calledOnceWithExactly(adminDB.otp, {
          email: req.body.email,
        })
      ).to.be.true;
      expect(
        res.send.calledOnceWithExactly({
          success: false,
          message: "OTP Verification Failed.",
        })
      ).to.be.true;
    });
  });

  describe("sendOTP", () => {
    let adminMail;
    beforeEach(() => {
      // Mocking req and res objects
      req = { body: { email: email } };
      res = {
        send: stub(),
      };

      // Mocking adminDB and adminMail objects
      adminDB = {
        findOne: stub(),
        updateOne: stub(),
        insertOne: stub(),
        users: "users",
        otp: "otp",
      };

      adminMail = {
        sendOTP: stub(),
      };

      // Importing the sendOTP function
      user = new User(adminDB, {}, adminMail);
    });

    it("should send OTP and respond with success message if user does not exist", async () => {
      // Stubbing adminDB.findOne to return null (user does not exist)
      adminDB.findOne.returns(null);
      const mathRandomStub = stub(Math, "random").returns(0.5);
      const mathFloorStub = stub(Math, "floor").returns(500000);

      // Calling the sendOTP function
      await user.sendOTP(req, res);

      // Assertions
      expect(adminDB.findOne.callCount).to.equal(2);
      expect(
        adminDB.findOne.calledWithExactly(adminDB.users, {
          email: req.body.email,
        })
      ).to.be.true;
      expect(mathRandomStub.calledOnce).to.be.true;
      expect(mathFloorStub.calledOnce).to.be.true;
      expect(adminMail.sendOTP.calledOnceWith(req.body.email, 500000)).to.be
        .true;
      expect(
        adminDB.findOne.calledWithExactly(adminDB.otp, {
          email: req.body.email,
        })
      ).to.be.true;
      expect(
        adminDB.insertOne.calledOnceWith(adminDB.otp, {
          email: req.body.email,
          otp: 500000,
        })
      ).to.be.true;
      expect(
        res.send.calledOnceWith({
          success: true,
          message: "OTP Sent Successfully",
        })
      ).to.be.true;

      mathRandomStub.restore();
      mathFloorStub.restore();
    });

    it("should send OTP and respond with success message if otp exists in the otp collection", async () => {
      // Stubbing adminDB.findOne to return null (user does not exist)
      adminDB.findOne.onCall(0).returns(null);
      adminDB.findOne.onCall(1).returns(true);
      const mathRandomStub = stub(Math, "random").returns(0.5);
      const mathFloorStub = stub(Math, "floor").returns(500000);

      // Calling the sendOTP function
      await user.sendOTP(req, res);

      // Assertions
      expect(
        adminDB.findOne.calledWithExactly(adminDB.users, {
          email: req.body.email,
        })
      ).to.be.true;
      expect(mathRandomStub.calledOnce).to.be.true;
      expect(mathFloorStub.calledOnce).to.be.true;
      expect(adminMail.sendOTP.calledOnceWith(req.body.email, 500000)).to.be
        .true;

      expect(
        adminDB.updateOne.calledOnceWith(
          adminDB.otp,
          { email: email },
          { $set: { otp: 500000 } }
        )
      ).to.be.true;
      expect(
        res.send.calledOnceWith({
          success: true,
          message: "OTP Sent Successfully",
        })
      ).to.be.true;

      mathRandomStub.restore();
      mathFloorStub.restore();
    });

    it("should send error response if user already exists", async () => {
      // Stubbing adminDB.findOne to return a user (user already exists)
      adminDB.findOne.returns({ email: email });

      // Calling the sendOTP function
      await user.sendOTP(req, res);

      // Assertions
      expect(
        adminDB.findOne.calledOnceWith(adminDB.users, { email: req.body.email })
      ).to.be.true;
      expect(adminMail.sendOTP.notCalled).to.be.true;
      expect(adminDB.insertOne.notCalled).to.be.true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "User already exists",
        })
      ).to.be.true;
    });

    it("should handle errors and respond with failure message", async () => {
      // Stubbing adminDB.findOne to throw an error
      adminDB.findOne.throws(new Error("Database error"));

      // Calling the sendOTP function
      await user.sendOTP(req, res);

      // Assertions
      expect(
        adminDB.findOne.calledOnceWith(adminDB.users, { email: req.body.email })
      ).to.be.true;
      expect(adminMail.sendOTP.notCalled).to.be.true;
      expect(adminDB.insertOne.notCalled).to.be.true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "OTP generation failed.",
        })
      ).to.be.true;
    });
  });

  describe("changePassword", () => {
    let changePassword,hash = "hash",newpassword = "newhashpassword";

    beforeEach(() => {
      req = { body: { email: email, newPassword: newpassword } };
      res = {
        send: stub(),
      };

      adminDB = {
        findOne: stub(),
        updateOne: stub(),
        users: "users",
      };

      user = new User(adminDB, {}, {});
    });

    it("should change password and respond with success message if user exists", async () => {
      adminDB.findOne.returns({ email: email });

      const bcryptHashStub = stub(bcrypt, "hash")
        .callsArgWith(2, null, hash);

      await user.changePassword(req, res);

      expect(
        adminDB.findOne.calledOnceWith(adminDB.users, { email: req.body.email })
      ).to.be.true;
      expect(bcrypt.hash.calledOnceWith(req.body.newPassword, 10)).to.be.true;
      expect(
        adminDB.updateOne.calledOnceWith(
          adminDB.users,
          { email: req.body.email },
          { $set: { password: hash } }
        )
      ).to.be.true;
      expect(
        res.send.calledOnceWith({
          success: true,
          message: "Password Changed Successfully.",
        })
      ).to.be.true;

      bcryptHashStub.restore();
    });

    it("should send error response if bcrypt.hash encounters an error", async () => {
      adminDB.findOne.returns({ email: email });

      const bcryptHashStub = stub(bcrypt, "hash")
        .callsArgWith(2, new Error("Hashing error"));

      await user.changePassword(req, res);

      expect(
        adminDB.findOne.calledOnceWith(adminDB.users, { email: req.body.email })
      ).to.be.true;
      expect(bcrypt.hash.calledOnceWith(req.body.newPassword, 10)).to.be.true;
      expect(adminDB.updateOne.notCalled).to.be.true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "Password Updation Failed due to some internal error.",
        })
      ).to.be.true;

      bcryptHashStub.restore();
    });

    it("should send error response if user does not exist", async () => {
      adminDB.findOne.returns(null);

      await user.changePassword(req, res);

      expect(
        adminDB.findOne.calledOnceWith(adminDB.users, { email: req.body.email })
      ).to.be.true;
      expect(adminDB.updateOne.notCalled).to.be.true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "User does not exists.",
        })
      ).to.be.true;
    });

    it("should handle errors and respond with failure message", async () => {
      adminDB.findOne.throws(new Error("Database error"));
      const bcryptHashStub = stub(bcrypt, "hash")
        .callsArgWith(2, new Error("Hashing error"));
      await user.changePassword(req, res);

      expect(
        adminDB.findOne.calledOnceWith(adminDB.users, { email: req.body.email })
      ).to.be.true;
      expect(bcrypt.hash.notCalled).to.be.true;
      expect(adminDB.updateOne.notCalled).to.be.true;
      expect(
        res.send.calledOnceWith({
          success: false,
          message: "Password Updation Failed due to some internal error.",
        })
      ).to.be.true;
      bcryptHashStub.restore();
    });
  });
  describe('userLogout', () => {
    let   user;
  
    beforeEach(() => {
      // Mocking req and res objects
      req = { body: { userToken: 'validToken' } };
      res = {
        send: stub(),
      };
  
      // Mocking adminJWT and adminDB objects
      adminJWT = {
        verifyToken: stub(),
      };
  
      adminDB = {
        findOne: stub(),
        users: 'users',
      };
      
      // Importing the userLogout function
      user = new User(adminDB, adminJWT, {});
    });
    afterEach(() => {
      // Restoring the stubbed functions to their original implementation
      restore();
 
    });
    it('should send success response if user exists', async () => {
      // Stubbing adminJWT.verifyToken to return email
      adminJWT.verifyToken.returns({ email: email });
  
      // Stubbing adminDB.findOne to return user data
      adminDB.findOne.returns({ email: email });
  
      // Calling the userLogout function
      await user.userLogout(req, res);
  
      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be.true;
      expect(adminDB.findOne.calledOnceWith(adminDB.users, { email: email })).to.be.true;
      expect(res.send.calledOnceWith({
        success: true,
        message: 'User Logged Out Successfully',
        userToken: '',
      })).to.be.true;
    });
  
    it('should send error response if user does not exist', async () => {
      // Stubbing adminJWT.verifyToken to return email
      adminJWT.verifyToken.returns({ email: email });
  
      // Stubbing adminDB.findOne to return null (user does not exist)
      adminDB.findOne.returns(null);
  
      // Calling the userLogout function
      await user.userLogout(req, res);
  
      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be.true;
      expect(adminDB.findOne.calledOnceWith(adminDB.users, { email: email })).to.be.true;
      expect(res.send.calledOnceWith({
        success: false,
        message: 'User does not exists',
      })).to.be.true;
    });
  
    it('should handle TokenExpiredError and send appropriate response', async () => {
      // Stubbing adminJWT.verifyToken to throw TokenExpiredError
      adminJWT.verifyToken.throws(new TokenExpiredError('Token expired'));
  
      // Calling the userLogout function
      await user.userLogout(req, res);
  
      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be.true;
      expect(res.send.calledOnceWith({
        success: false,
        message: 'User has been logged out.',
      })).to.be.true;
    });
  
    it('should handle JsonWebTokenError and send appropriate response', async () => {
      // Stubbing adminJWT.verifyToken to throw JsonWebTokenError
      adminJWT.verifyToken.throws(new JsonWebTokenError('Invalid token'));
  
      // Calling the userLogout function
      await user.userLogout(req, res);
  
      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be.true;
      expect(res.send.calledOnceWith({
        success: false,
        message: "User has logged out.Kindly login again",
      })).to.be.true;
    });
    it('should handle other errors and send appropriate response', async () => {
      // Stubbing adminJWT.verifyToken to throw an error
      adminJWT.verifyToken.throws(new Error('Some error'));
  
      // Calling the userLogout function
      await user.userLogout(req, res);
  
      // Assertions
      expect(adminJWT.verifyToken.calledOnceWith(req.body.userToken)).to.be.true;
      expect(res.send.calledOnceWith({
        success: false,
        message: 'Some error',
      })).to.be.true;
    });
  });
  describe('getAllHandles', () => {
    let user
  
    beforeEach(() => {
      // Mocking req and res objects
      req = {};
      res = {
        send: stub(),
      };
  
      // Mocking adminDB object
      adminDB = {
        find: stub(),
        users: 'users',
      };
  
      user = new User(adminDB, {}, {});      
    });
    afterEach(() => {
      // Restoring the stubbed functions to their original implementation
      restore();
    });
  
    it('should fetch all handles and send success response', async () => {
      // Stubbing adminDB.find to return user data
      const users = [
        { handle: 'handle1' },
        { handle: 'handle2' },
        { handle: 'handle3' },
      ];
      adminDB.find.returns(users);
  
      // Calling the getAllHandles function
      await user.getAllHandles(req, res);
  
      // Assertions
      expect(adminDB.find.calledOnceWith(adminDB.users, {})).to.be.true;
      expect(res.send.calledOnceWith({
        success: true,
        message: 'All Handles',
        handles: ['handle1', 'handle2', 'handle3'],
      })).to.be.true;
    });
  
    it('should handle errors and send error response', async () => {
      // Stubbing adminDB.find to throw an error
      adminDB.find.throws(new Error('Database error'));
  
      // Calling the getAllHandles function
      await user.getAllHandles(req, res);
  
      // Assertions
      expect(adminDB.find.calledOnceWith(adminDB.users, {})).to.be.true;
      expect(res.send.calledOnceWith({
        success: false,
        message: 'Error in fetching handles',
      })).to.be.true;
    });
  });
  
});
