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

const expense = [
  {
    id: 1,
    name: `Mie tarempak`,
    nominal: 40000,
    category: "food",
    date: "2023-08-15",
    time: "12:03:04",
  },
  {
    id: 2,
    name: `Brokoli`,
    nominal: 25000,
    category: "groceries",
    date: "2023-08-14",
    time: "16:03:04",
  },
  {
    id: 3,
    name: `Grab ke rumah`,
    nominal: 40000,
    category: "transportation",
    date: "2023-08-13",
    time: "09:03:04",
  },
  {
    id: 4,
    name: `Paintball`,
    nominal: 120000,
    category: "entertainment",
    date: "2023-08-01",
    time: "09:03:04",
  },
  {
    id: 5,
    name: `Futsal`,
    nominal: 350000,
    category: "sport",
    date: "2023-08-01",
    time: "09:03:04",
  },
  {
    id: 6,
    name: `Ticket ke Jkt`,
    nominal: 1000000,
    category: "transportation",
    date: "2023-08-01",
    time: "09:03:04",
  },
  {
    id: 7,
    name: `Berenang`,
    nominal: 30000,
    category: "sport",
    date: "2023-08-09",
    time: "09:03:04",
  },
  {
    id: 8,
    name: `Weywey Palace`,
    nominal: 500000,
    category: "entertainment",
    date: "2023-08-10",
    time: "09:03:04",
  },
  {
    id: 9,
    name: `Wortel`,
    nominal: 20000,
    category: "groceries",
    date: "2023-08-10",
    time: "09:03:04",
  },
  {
    id: 10,
    name: `Nasipadang garuda`,
    nominal: 45000,
    category: "food",
    date: "2023-08-10",
    time: "09:03:04",
  },
  {
    id: 11,
    name: `Taxi bandara`,
    nominal: 120000,
    category: "transportation",
    date: "2023-08-10",
    time: "09:03:04",
  },
];
