const categoryname = require(`../data/database.json`).category;

const patcValidator = (req, res, next) => {
  try {
    const keys = Object.keys(req.body);
    const { category } = req.body;
    let isCategoryRight = true;
    if (category) {
      for (item of categoryname) {
        if (category != item.category) isCategoryRight = false;
        else {
          isCategoryRight = true;
          break;
        }
      }
    }
    if (!isCategoryRight) {
      throw new Error(`please input the right category`);
    }
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
  } catch (err) {
    res.status(400).send(err.message);
  }
  next();
};

module.exports = patcValidator;
