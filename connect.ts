import mongoose from "mongoose";
import { DBNAME } from "./src/config";

export default function connectMongoDB() {
  const mongoDB = process.env.mongoDB || "";
  mongoose.connect(mongoDB, { dbName: DBNAME });
  const database = mongoose.connection;
  database.on("error", (error) => {
    console.log(error);
  });
  database.once("connected", () => {
    console.log("Database Connected, ", "DB name: ", DBNAME);
  });
}
