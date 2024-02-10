import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import UserRoutes from "./routes/user.route.js";

const app = express();
let PORT = process.env.PORT || 3000;


app.use(express.json({ limit: "50mb" , extended: true}));

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log(`Successfully connected to DB ${mongoose.connection.name}`);
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })

  .catch((err) =>
    console.error("Error occurred while connecting to DB: ", err)
  );

  app.use('/api',UserRoutes);