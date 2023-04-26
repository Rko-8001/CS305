import { MongoMemoryServer } from "mongodb-memory-server";
import { describe } from "mocha";
import { stub,spy } from "sinon";
import { expect } from "chai";
import database from "../Components/database.js";
describe("database", () => {
    describe("connect",() => {
        const databaseName = "test";
        let mongoserver;
        let uri;
        let testDatabase
        beforeEach(async () => {
            mongoserver = await MongoMemoryServer.create();
            uri = mongoserver.getUri();  
            testDatabase = new database(uri,databaseName);
        })
        afterEach(async () => {
            await mongoserver.stop();
        })
        it("should connect to the database",async () => {
            const consoleSpy = spy(console,"log");
            const dbMock = {collection : stub()} // mock database collection
            const clientMock = {
                connect : stub().resolves() //returns a resolved promise (Which stimulates the condition when database is connected)
            , db : stub().returns(dbMock)}; //returns a mock database
            testDatabase.client = clientMock;
            await testDatabase.connect();
            expect(clientMock.connect.calledOnce).to.be.true;
            expect(consoleSpy.calledOnce).to.be.true;
            expect(consoleSpy.firstCall.args[0]).to.equal("DB Connection successful");
            expect(clientMock.db.calledWith(databaseName)).to.be.true;
            expect(dbMock.collection.calledWith("Users")).to.be.true;
            expect(dbMock.collection.calledWith("otp")).to.be.true;
            expect(dbMock.collection.calledWith("Problems")).to.be.true;
            expect(dbMock.collection.calledWith("Blogs")).to.be.true;
            expect(dbMock.collection.calledWith("Editorials")).to.be.true;
            expect(dbMock.collection.calledWith("SubmittedSolutions")).to.be.true;
        })
     
    });

});

