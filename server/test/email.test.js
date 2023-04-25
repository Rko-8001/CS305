import { expect } from "chai";
import sinon from "sinon";
import Email from "../email.js";
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

    it("should log an error if the email fails to send", () => {
      const sendMailStub = sinon.stub(email.transporter, "sendMail");
      const error = new Error("Error sending email");

      sendMailStub.callsFake((_mailObj, callback) => {
        callback(error);
      });

      const consoleSpy = sinon.spy(console, "log");
      const receiver = "nish95.sha@gmail.com";
      const subject = "Test Email";
      const text = "This is a test email.";

      email.sendMail(receiver, subject, text);
      expect(sendMailStub.calledOnce).to.be.true;
      expect(consoleSpy.callCount).to.be.equal(2);
      expect(consoleSpy.firstCall.args[0]).to.equal(
        "The following error occured while sending mail."
      );
      expect(consoleSpy.secondCall.args[0]).to.equal(error.message);
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
        expect(email.sendMail.calledOnceWithExactly(receiver, "OTP",`Your OTP is ${otp}`)).to.be.true
    });
  });
});
