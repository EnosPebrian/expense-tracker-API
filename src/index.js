const expense = require(`./data/data-enos.json`).expense;
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
const categorylist = require(`./data/data-enos.json`).category;

app.listen(PORT, () => {
  console.log(`server is online on port ${PORT}`);
});

app.get(`/expense`, (req, res) => {
  const total = {};
  try {
    let temp = [...expense].sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      else return 0;
    });
    const { datefrom, dateto, category, id, name, nominalfrom, nominalto } =
      req.query;
    if (id && typeof id === "string") temp = temp.filter((exp) => exp.id == id);
    if (id && typeof id === "object") {
      const tmp = [];
      id.forEach((val) => tmp.push(temp.find((exp) => exp.id == val)));
      temp = tmp;
    }
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
          if (cat === val.category) temp2.push(val);
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
    total.grandtotal = 0;
    const temp_container = [];
    for (let cat of Object.values(categorylist)) {
      temp_container.push([
        cat.category,
        temp
          .filter((val) => val.category == cat.category)
          .reduce((acc, val) => acc + val.nominal, 0),
      ]);
    }

    temp_container.sort((a, b) => b[1] - a[1]);
    temp_container.forEach((val) => {
      total[val[0]] = val[1];
      total.grandtotal += val[1];
    });

    temp = temp.slice(0, 101);
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

app.get(`/category`, (req, res) => {
  try {
    return res.send(categorylist);
  } catch (err) {
    return res.status(400).send(err);
  }
});
