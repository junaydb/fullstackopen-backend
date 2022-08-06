const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// routes
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const info = `<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`;

  res.send(info);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  person ? res.json(person) : res.sendStatus(404);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.sendStatus(204);
});

app.post("/api/persons", (req, res) => {
  const newPerson = req.body;

  const duplicate = persons.find((person) => person.name === newPerson.name);

  if (duplicate || !newPerson.name || !newPerson.number) {
    res.status(400).json({
      error:
        "name must be unique and person must include both a name and number",
    });
  } else {
    newPerson.id = Math.floor(Math.random() * 1000) + 10;
    persons = persons.concat(newPerson);

    res.send(persons);
  }
});

// run server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
