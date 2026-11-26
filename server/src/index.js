import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        const port = process.env.PORT || 8000;
        app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
    })
    .catch((error) => console.log("Startup failed:", error));