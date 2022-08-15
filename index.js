const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// morgan config
morgan.token("req-body", (req, res) => JSON.stringify(req.body));
morgan.token("res-body", (req, res) => JSON.stringify(res.body));

const morganPostConfig =
  ":method :url :status :res[content-length] - :response-time ms - :req-body";
const morganErrorConfig =
  ":method :url :status :res[content-length] - :response-time ms - :res-body";

// create express app and configure middlewares
const app = express();

app
  .use(express.json())
  .use(cors())
  .use(
    morgan("tiny", {
      skip: (req, res) => res.statusCode === 201 || res.statusCode > 399,
    })
  )
  .use(
    morgan(morganPostConfig, {
      skip: (req, res) => res.statusCode !== 201,
    })
  )
  .use(
    morgan(morganErrorConfig, {
      skip: (req, res) => res.statusCode < 400,
    })
  );

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
app.get("/info", (req, res) => {
  const info = `<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`;

  res.send(info);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  person ? res.json(person) : res.sendStatus(404);
});

app.post("/api/persons", (req, res) => {
  let newPerson = req.body;

  // (these checks are handled client-side instead)
  // const duplicate = persons.find(({ name }) => newPerson.name === name);

  // if (duplicate) {
  //   return res.status(400).json({ error: "name must be unique" });
  // }

  // if (!newPerson.name || !newPerson.number) {
  //   return res.status(400).json({ error: "must include name and number" });
  // }

  const id =
    persons.length > 0 ? Math.max(...persons.map(({ id }) => id)) + 1 : 0;

  newPerson = { id, ...newPerson };
  persons = persons.concat(newPerson);

  res.status(201).send(newPerson);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = persons.find((person) => person.id === id);

  if (exists) {
    persons = persons.filter((person) => person.id !== id);
    res.sendStatus(204);
  } else {
    res.status(400).json({
      message: "This person appears to be deleted already. Refresh the page.",
    });
  }
});

// run server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
