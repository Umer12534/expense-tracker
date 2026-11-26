import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { DB_NAME } from "../src/constants.js";
import { Group } from "../src/models/group.model.js";
import { User } from "../src/models/user.model.js";
import { Item } from "../src/models/item.model.js";
import { Expense } from "../src/models/expense.model.js";

const run = async () => {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, GROUP_NAME } = process.env;
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error("Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    }

    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    // create collections and indexes
    await Promise.all([Group.init(), User.init(), Item.init(), Expense.init()]);

    let group = await Group.findOne();
    if (!group) group = await Group.create({ name: GROUP_NAME || "My Household" });

    const email = ADMIN_EMAIL.toLowerCase().trim();
    const existing = await User.findOne({ email });

    if (existing) {
        console.log("Admin already exists. Nothing changed.");
    } else {
        await User.create({
            groupId: group._id,
            name: ADMIN_NAME,
            email,
            passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
            role: "admin",
        });
        console.log(`Admin created: ${email}`);
    }

    await mongoose.disconnect();
};

run().catch((error) => {
    console.error("Seed failed:", error.message);
    process.exit(1);
});