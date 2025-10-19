import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
