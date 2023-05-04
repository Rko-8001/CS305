import database from "../DataPart/database.js";
import Email from "./email.js";
import JWT from "./jwt.js";
import dotenv from "dotenv";

// admin class
class Admin {
  // constructor
  constructor(envPath = `${process.cwd()}/.env`) {
    dotenv.config({ path: envPath });
    this.adminDB = new database(process.env.DB_URI, process.env.DB_NAME);
    this.adminMail = new Email();
    this.adminJWT = new JWT();
  }
  
}
export { Admin as default }
