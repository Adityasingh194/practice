const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// CSV File Path
const CSV_FILE = "reviews.csv";

// Function to write data to CSV
function writeToCSV(review) {
    const { name, event, reviewText, date } = review;
    const csvRow = `"${date}","${name}","${event}","${reviewText}"\n`;

    // Check if file exists, if not add headers
    if (!fs.existsSync(CSV_FILE)) {
        fs.writeFileSync(CSV_FILE, `"Date","Name","Event","Review"\n`);
    }
    fs.appendFileSync(CSV_FILE, csvRow, "utf8");
}

// API Endpoint to receive reviews
app.post("/submit-review", (req, res) => {
    const review = req.body;
    if (!review.name || !review.event || !review.reviewText) {
        return res.status(400).json({ error: "All fields are required" });
    }

    writeToCSV(review);
    res.json({ message: "Review saved successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

