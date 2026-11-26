import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        monthlyBudget: { type: Number, min: 0 }, // in paisa, optional
    },
    { timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);