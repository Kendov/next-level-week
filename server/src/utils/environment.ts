import dotenv from "dotenv";

dotenv.config();


const sysVar = {
    SERVER_URL: process.env.SERVER_URI
}


export default sysVar;