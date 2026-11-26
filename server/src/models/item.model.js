import mongoose from "mongoose";
import { CATEGORIES } from "../constants.js";

const { ObjectId } = mongoose.Schema.Types;

const itemSchema = new mongoose.Schema(
    {
        groupId: { type: ObjectId, ref: "Group", required: true },
        name: { type: String, required: true, trim: true },
        nameKey: { type: String, required: true }, // lowercase, trimmed
        category: { type: String, enum: CATEGORIES, default: "Other" },
        isArchived: { type: Boolean, default: false },
        createdBy: { type: ObjectId, ref: "User" },
    },
    { timestamps: true }
);

itemSchema.index({ groupId: 1, nameKey: 1 }, { unique: true });

export const Item = mongoose.model("Item", itemSchema);