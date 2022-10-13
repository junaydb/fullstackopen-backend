const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Provide password as an argument: node mongo.js <password>");
  process.exit(1);
} else {
  var name = process.argv[3];
  var number = process.argv[4];
}

const password = process.argv[2];

(async () => {
  await mongoose.connect(
    `mongodb+srv://junaydb:${password}@cluster0.g2vfmrv.mongodb.net/Phonebook?retryWrites=true&w=majority`
  );

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  if (process.argv.length === 3) {
    const people = await Person.find({});

    people.forEach((p) => console.log(p));

    mongoose.connection.close();
  } else {
    const newPerson = new Person({
      name: name,
      number: number,
    });

    await newPerson.save();

    console.log(`${JSON.stringify(newPerson)} added`);

    mongoose.connection.close();
  }
})().catch((err) => console.log(err));
