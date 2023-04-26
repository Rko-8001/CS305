import database from "./Components/DataPart/database.js";
import Email from "./Components/email.js";
import JWT from "./Components/jwt.js";
import dotenv from "dotenv";
dotenv.config();
const adminDB = new database(process.env.DB_URI, process.env.DB_NAME);
const adminMail = new Email();
const adminJWT = new JWT();
export { adminDB, adminMail, adminJWT }
