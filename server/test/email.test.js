import { expect } from "chai";
import sinon from "sinon";
import Email from "../src/Utility/email.js";
import nodemailer from "nodemailer";
import nodemailerMock from "nodemailer-mock-transport";
import { describe } from "mocha";
describe("Email", () => {
  describe("sendMail", () => {
    let email;
    let transporter;
    beforeEach(() => {
      transporter = nodemailer.createTransport(nodemailerMock());
      email = new Email();
      email.transporter = transporter;
      email.sender = "test92.test@gmail.com";
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should send an email", () => {
      // to track the sendMail function of the email.transporter
      const sendMailSpy = sinon.spy(email.transporter, "sendMail");
      const receiver = "nish95.sha@gmail.com";
      const subject = "Test Email";
      const text = "This is a test email.";
      // call the sendMail function of the email class
      email.sendMail(receiver, subject, text);

      expect(sendMailSpy.calledOnce).to.be.true;
      expect(sendMailSpy.firstCall.args[0]).to.deep.equal({
        from: email.sender,
        to: receiver,
        subject: subject,
        text: text,
      });
    });

    it("should throw the error if the email fails to send", () => {
      // mock the sendMail function of the email.transporter
      email.transporter.sendMail = sinon
        .stub()
        .yields("Failed to send email.");
        // to call the callback function of the sendMail function with the error message
      const receiver = "recipient@example.com";
      const subject = "Test email";
      const text = "This is a test email.";
      const errorMessage = "Failed to send email.";
      expect(() => {
        email.sendMail(receiver, subject, text);
      }).to.throw(Error, errorMessage);
    });
  });
  describe("sendOTP", () => {
    let email;
    let transporter;
    beforeEach(() => {
      transporter = nodemailer.createTransport(nodemailerMock());
      email = new Email();
      email.transporter = transporter;
      email.sender = "test92.test@gmail.com";
      email.sendMail = sinon.stub().resolves();
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should send an OTP", () => {
      const receiver = "nish95.sha@gmail.com";
      const otp = "123456";
      email.sendOTP(receiver, otp);
      expect(
        email.sendMail.calledOnceWithExactly(
          receiver,
          "OTP",
          `Your OTP is ${otp}`
        )
      ).to.be.true;
    });
  });
});
