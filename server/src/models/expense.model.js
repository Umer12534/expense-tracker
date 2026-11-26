import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const expenseSchema = new mongoose.Schema(
    {
        groupId: { type: ObjectId, ref: "Group", required: true },
        userId: { type: ObjectId, ref: "User", required: true }, // Added by (from token)
        itemId: { type: ObjectId, ref: "Item", required: true },
        amountPaisa: {
            type: Number,
            required: true,
            min: 1,
            validate: { validator: Number.isInteger, message: "Amount must be whole paisa" },
        },
        expenseDate: { type: Date, required: true }, // UTC midnight of the chosen day
        note: { type: String, trim: true },
        updatedBy: { type: ObjectId, ref: "User" },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

expenseSchema.index({ groupId: 1, expenseDate: 1 });
expenseSchema.index({ userId: 1 });

export const Expense = mongoose.model("Expense", expenseSchema);