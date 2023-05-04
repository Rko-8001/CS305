import { MongoMemoryServer } from "mongodb-memory-server";
import { describe } from "mocha";
import { stub,spy } from "sinon";
import { expect } from "chai";
import database from "../src/DataPart/database.js";
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
            expect(dbMock.collection.calledWith("Solved")).to.be.true;
            consoleSpy.restore();
        })
     
    });
    describe('findOne', function() {
        let testDatabase;
        let mongoserver;
        let uri;
        // Connect to the database before running the tests
        beforeEach(async() =>{
            mongoserver = await MongoMemoryServer.create();
            uri = mongoserver.getUri();
            let databaseName = "test";
            testDatabase = new database(uri,databaseName);
            await testDatabase.connect();
        });
      
        // Close the database connection after running the tests
        afterEach(async() => {
        await testDatabase.disconnect();
          await mongoserver.stop();
        });
      
        // Test case
        it('should return a document', async () => {
          // Insert a document into the collection for testing
          const doc = { name: 'user', age: 21 };
          await testDatabase.users.insertOne(doc);
      
          // Call the findOne function with the query object
          const query = { name: 'user' };
          const fields = { age:21, _id:0 };
          const result = await testDatabase.findOne(testDatabase.users, query, fields);
      
          // Assert that the result matches the expected document
          expect (result).to.be.an('object');
            expect (result).to.deep.equal({ age:21 });
        });
      });
    describe('insertOne', function() {
        let testDatabase;
        let mongoserver;
        let uri;
        // Connect to the database before running the tests
        beforeEach(async() =>{
            mongoserver = await MongoMemoryServer.create();
            uri = mongoserver.getUri();
            let databaseName = "test";
            testDatabase = new database(uri,databaseName);
            await testDatabase.connect();
        });
      
        // Close the database connection after running the tests
        afterEach(async() => {
        await testDatabase.disconnect();
          await mongoserver.stop();
        });
      
        // Test case
        it('should insert a document', async () => {
          // Insert a document into the collection for testing
          const doc = { name: 'user', age: 21 };
          let insertData = await testDatabase.insertOne(testDatabase.users,doc);
            // Assert that the result matches the expected document
          expect (insertData.acknowledged).to.equal(true);
          expect (insertData.insertedId).to.not.equal(null | undefined);

        });

      });
    describe('updateOne', function() {
      let testDatabase;
      let mongoserver;
      let uri;
      // Connect to the database before running the tests
      beforeEach(async() =>{
          mongoserver = await MongoMemoryServer.create();
          uri = mongoserver.getUri();
          let databaseName = "test";
          testDatabase = new database(uri,databaseName);
          await testDatabase.connect();
      });
    
      // Close the database connection after running the tests
      afterEach(async() => {
      await testDatabase.disconnect();
        await mongoserver.stop();
      });
    
      // Test case
      it('should return a document', async () => {
        // Insert a document into the collection for testing
        const doc = { name: 'user', age: 21,hobby : []};
        await testDatabase.users.insertOne(doc);
    
        // Call the findOne function with the query object
        let query = { name: 'user' };
        let result = await testDatabase.updateOne(testDatabase.users, query, {$set : {name: "newUser"}});
        expect(result).to.be.an('object');
        expect(result.acknowledged).to.equal(true);
        expect(result.modifiedCount).to.equal(1);
        query = { name: 'newUser' };

        result = await testDatabase.updateOne(testDatabase.users, query, {$push : {hobby: "newUser"}});
        expect(result).to.be.an('object');
        expect(result.acknowledged).to.equal(true);
        expect(result.modifiedCount).to.equal(1);

      });
    });
    describe('deleteOne', function() {
      let testDatabase;
      let mongoserver;
      let uri;
      // Connect to the database before running the tests
      beforeEach(async() =>{
          mongoserver = await MongoMemoryServer.create();
          uri = mongoserver.getUri();
          let databaseName = "test";
          testDatabase = new database(uri,databaseName);
          await testDatabase.connect();
      });
    
      // Close the database connection after running the tests
      afterEach(async() => {
      await testDatabase.disconnect();
        await mongoserver.stop();
      });
    
      // Test case
      it('should delete a document', async () => {
        // Insert a document into the collection for testing
        const doc = { name: 'user', age: 21};
        await testDatabase.users.insertOne(doc);
    
        // Call the findOne function with the query object
        let query = { name: 'user' };
        let result = await testDatabase.deleteOne(testDatabase.users, query);
        expect(result).to.be.an('object');
        expect(result.acknowledged).to.equal(true);
        expect(result.deletedCount).to.equal(1);

      });
    });
    describe('find', () => {
      let testDatabase;
      let mongoserver;
      let uri;
      before(async () => {
        // Create a test collection and insert some documents
        mongoserver = await MongoMemoryServer.create();
        uri = mongoserver.getUri();
        let databaseName = "test";
        testDatabase = new database(uri,databaseName);
        await testDatabase.client.connect();
        testDatabase.users = testDatabase.client.db(testDatabase.database).collection('users');
        await testDatabase.users.insertMany([
          { name: 'user1', age: 21 },
          { name: 'user2', age: 22 },
          { name: 'user3', age: 23 },
        ]);
      });
      after(async() => {
        await testDatabase.client.close();
          await mongoserver.stop();
        });
      it('should find all documents in the collection', async () => {
        const docs = await testDatabase.find(testDatabase.users);
        expect(docs).to.have.lengthOf(3);
      });
  
      it('should find documents with a query object', async () => {
        const docs = await testDatabase.find(testDatabase.users, { name: 'user1' });
        expect(docs).to.have.lengthOf(1);
        expect(docs[0].name).to.equal('user1');
      });
  
      it('should sort documents with a sort object', async () => {
        const docs = await testDatabase.find(testDatabase.users, {}, { age: -1 });
        expect(docs).to.have.lengthOf(3);
        expect(docs[0].name).to.equal('user3');
      });
  
      it('should project documents with a fields object', async () => {
        const docs = await testDatabase.find(testDatabase.users, {}, {}, { name: 1 });
        expect(docs).to.have.lengthOf(3);
        expect(docs[0].name).to.exist;
        expect(docs[0].age).to.not.exist;
      });
    });
    
    describe('update', () => {
      let testDatabase;
      let mongoserver;
      let uri;
      before(async () => {
        // Create a test collection and insert some documents
        mongoserver = await MongoMemoryServer.create();
        uri = mongoserver.getUri();
        let databaseName = "test";
        testDatabase = new database(uri,databaseName);
        await testDatabase.client.connect();
        testDatabase.users = testDatabase.client.db(testDatabase.database).collection('users');
        await testDatabase.users.insertMany([
          { name: 'user1', age: 21,hobby:[] },
          { name: 'user2', age: 22 ,hobby:[]},
          { name: 'user3', age: 23 ,hobby:[]},
        ]);
      });
      after(async() => {
        await testDatabase.client.close();
          await mongoserver.stop();
        });
      it('should set some values to all the documents with the required filter', async () => {
        const docs = await testDatabase.update(testDatabase.users, {  }, { $set: { age:50 } });
        expect(docs.modifiedCount).to.equal(3);
      });
  
      it('should push values in ana array to all the documents with the required filter', async () => {
        const docs = await testDatabase.update(testDatabase.users, { age: {$gt:21} }, { $push: { hobby:"newHobby" } });
        expect(docs.modifiedCount).to.equal(3);
      });
  
 
    });

  });
