const expense = require(`./data/database.json`).expense;
const express = require(`express`);
const cors = require(`cors`);
const moment = require(`moment`);
require(`dotenv`).config();
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;
const inputVerificator = require(`./middlewares/inputVerificator`);
const patcValidator = require(`./middlewares/patchValidator`);

app.listen(PORT, () => console.log(`server is online on port ${PORT}`));

app.get(`/expense`, (req, res) => {
  try {
    let temp = [...expense];
    const {
      datefrom,
      dateto,
      category,
      id,
      name,
      nominalfrom,
      nominalto,
      action,
    } = req.query;
    if (name)
      temp = temp.filter((exp) =>
        exp.name.toLowerCase().includes(name.toLowerCase())
      );
    if (category && typeof category === "string")
      temp = temp.filter(
        (exp) => exp.category.toLowerCase() === category.toLowerCase()
      );
    if (category && typeof category === "object") {
      const temp2 = [];
      category.forEach((cat) =>
        temp.forEach((val) => {
          if (cat == val.category) temp2.push(val);
        })
      );
      temp = temp2;
    }
    if (nominalfrom)
      temp = temp.filter((exp) => Number(exp.nominal) >= Number(nominalfrom));
    if (nominalto)
      temp = temp.filter((exp) => Number(exp.nominal) <= Number(nominalto));
    if (datefrom) temp = temp.filter((exp) => exp.date >= datefrom);
    if (dateto) temp = temp.filter((exp) => exp.date <= dateto);
    total = temp.reduce((acc, val) => acc + val.nominal, 0);
    return res.send({ totalexpense: total, item: temp });
  } catch (err) {
    return res.status(404).send(err.message);
  }
});

app.get(`/expense/:id`, (req, res) => {
  try {
    const expenseid = req.params.id;
    return res.send(expense.find((exp) => exp.id == expenseid));
  } catch (err) {
    return res.status(404).send(err.message);
  }
});

app.post(`/expense`, inputVerificator, (req, res) => {
  try {
    const temp = {
      id: expense[expense.length - 1].id + 1,
      ...req.bodyverified,
    };
    expense.push(temp);
    res.status(200).send({ message: "An item is added", item: { temp } });
  } catch (err) {
    return res.status(404).send(err.message);
  }
});

app.patch(`/expense/:id`, patcValidator, (req, res) => {
  try {
    const index = expense.findIndex((exp) => exp.id == req.params.id);
    if (index == -1) return res.status(400).send(`item not found`);
    const old = { ...expense[index] };
    expense[index] = { ...expense[index], ...req.bodyverified };
    return res
      .status(201)
      .send({ message: "success", previous: old, updated: expense[index] });
  } catch (err) {
    return res.status(404).send(err.message);
  }
});

app.delete(`/expense/:id`, (req, res) => {
  try {
    const index = expense.findIndex((exp) => exp.id == req.params.id);
    if (index == -1) return res.status(400).send(`item not found`);
    const deleted = expense.splice(index, 1);
    return res.status(201).send(deleted);
  } catch (err) {
    return res.status(404).send(err.message);
  }
});
