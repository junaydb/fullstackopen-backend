require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

// morgan config
morgan.token("req-body", (req, res) => JSON.stringify(req.body));
morgan.token("res-body", (req, res) => JSON.stringify(res.body));
const morganPostConfig =
  ":method :url :status :res[content-length] - :response-time ms - :req-body";
const morganErrorConfig =
  ":method :url :status :res[content-length] - :response-time ms - :res-body";

const app = express();
app
  .use(express.json())
  .use(express.static("build"))
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

// routes
app.get("/info", (req, res) => {
  Person.find({}).then((result) =>
    res.send(`<p>Phonebook has info for ${result.length} people</p>
    <p>${new Date()}</p>`)
  );
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((result) => res.send(result));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((result) => (result ? res.json(result) : res.sendStatus(404).end()))
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res) => {
  const newPerson = req.body;
  Person.create({ ...newPerson }).then(res.status(201).send(newPerson));
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id).then(res.sendStatus(204).end());
});

app.put("/api/persons/:id", (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person)
    .then(() => res.sendStatus(204).end())
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(400).json({ error: "unknown endpoint " });
};
app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id " });
  }

  console.log("error");

  next(error);
};
app.use(errorHandler);

// run server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
