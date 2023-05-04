import { MongoClient, ServerApiVersion } from "mongodb";
export default class database {
  constructor(uri, database) {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    this.database = database;
  }
  // connect to the database
  async connect() {
    await this.client.connect();
    console.log("DB Connection successful");
    const db = this.client.db(this.database);
    this.users = db.collection("Users");
    this.otp = db.collection("otp");
    this.problem = db.collection("Problems");
    this.blog = db.collection("Blogs");
    this.editorials = db.collection("Editorials");
    this.solution = db.collection("SubmittedSolutions");
    this.solved = db.collection("Solved");
  }
  // find one
  async findOne(collection, obj, fields = null) {
    return await collection.findOne(obj, { projection: fields });
  }
  // find
  async find(collection, obj={},sort={},fields=null) {
    return await collection.find(obj, { projection: fields }).sort(sort).toArray();
  }
  // insert one
  async insertOne(collection, obj) {
    return await collection.insertOne(obj);
  }
  // update one
  async updateOne(collection, filter, obj) {
    return await collection.updateOne(filter, obj);
  }
  // update many
  async update(collection, filter, obj) {
    return await collection.updateMany(filter, obj);
  }
  // delete one
  async deleteOne(collection, obj) {
    return await collection.deleteOne(obj);
  }
  // disconnect from the database
  async disconnect() {
    await this.client.close();
  }
  
}
