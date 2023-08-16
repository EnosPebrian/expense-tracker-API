const moment = require(`moment`);
const categoryname = require(`../data/database.json`).category;
const inputVerificator = (req, res, next) => {
  try {
    const { name, nominal, category } = req.body;
    if (!name || !nominal || !category)
      throw new Error(`Name, nominal, and category must be filled`);
    let isCategoryRight = 1;
    if (category) {
      for (item of categoryname) {
        if (category != item) isCategoryRight = 0;
        else {
          isCategoryRight = 1;
          break;
        }
      }
    }
    if (!isCategoryRight) {
      throw new Error(`please input the right category`);
    }
    const keys = Object.keys(req.body);
    req.bodyverified = {};
    for (key of keys) {
      if (
        key == "name" ||
        key == "nominal" ||
        key == "category" ||
        key == "date" ||
        key == "time"
      ) {
        req.bodyverified[key] = req.body[key];
      }
    }
    if (!req.bodyverified.date) {
      req.bodyverified["date"] = moment().format("YYYY-MM-DD");
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
  next();
};

module.exports = inputVerificator;
