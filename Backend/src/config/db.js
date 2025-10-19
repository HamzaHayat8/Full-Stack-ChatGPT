import mongoose from "mongoose";

export const connectionc = (MONGO_URL) => {
  mongoose
    .connect(MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));
};
