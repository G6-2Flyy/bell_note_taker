//Import Unique Id package
const ShortUniqueId = require("short-unique-id");
//Import fs module
const fs = require("fs");
//Import Exress.js
const express = require("express");
// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require("path");
// Initialize an instance of Express.js
const app = express();
//Instantiate unique id
const uid = new ShortUniqueId();
// Specify on which port the Express.js server will run
const PORT = 3001;
// Add middleware body parser
app.use(express.json());
// Static middleware pointing to the public folder
app.use(express.static("public"));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post("/api/notes", (req, res) => {
  // Random UUID
  const { title, text } = req.body;
  const newNote = {
    title,
    text,
    id: uid.rnd(),
  };
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(notes), (e) => {
      if (e) throw e;
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res)=> {
  const id = req.params.id;
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data)
    const filteredNotes = notes.filter((n)=> n.id !== id)
    fs.writeFile("./db/db.json", JSON.stringify(filteredNotes), (e) => {
      if (e) throw e;
      res.json(filteredNotes);
    });
  })
})
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// listen() method is responsible for listening for incoming connections on the specified port
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
