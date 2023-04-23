import database from "./database.js";
import Email from "./email.js";
import dotenv from "dotenv";
dotenv.config();
const adminDB = new database(process.env.DB_URI, process.env.DB_NAME);
const adminMail = new Email();
export { adminDB, adminMail }
