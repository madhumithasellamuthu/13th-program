const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect SQLite Database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create Students Table
db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT
  )
`);

// ➕ Add Student
app.post("/add-user", (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone required" });
  }

  db.run(
    "INSERT INTO students(name, phone) VALUES(?, ?)",
    [name, phone],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({
        message: "Student added successfully",
        id: this.lastID,
      });
    }
  );
});

// 📋 Get All Students
app.get("/users", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// ❌ Delete Student
app.delete("/delete-user/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM students WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json(err);
    }
    res.json({ message: "Student removed successfully" });
  });
});

// Start Server
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});

