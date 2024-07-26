const express = require("express");

const { getAll, get, add, replace, remove } = require("../data/book");
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require("../util/validation");
const { checkAuth } = require("../util/auth");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const books = await getAll();
    // setTimeout(() => {
    //   res.json({ books: books });
    // }, 2000);
    res.json({ books: books });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const book = await get(req.params.id);
    res.json({ book: book });
  } catch (error) {
    next(error);
  }
});

router.use(checkAuth);

router.post("/", async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = "Invalid title.";
  }

  if (!isValidText(data.description)) {
    errors.description = "Invalid description.";
  }

  if (!isValidDate(data.publishYear)) {
    errors.date = "Invalid date.";
  }

  if (!isValidImageUrl(data.coverImage)) {
    errors.image = "Invalid image.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Adding the event failed due to validation errors.",
      errors,
    });
  }

  try {
    await add(data);
    res.status(201).json({ message: "Book saved.", book: data });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = "Invalid title.";
  }

  if (!isValidText(data.description)) {
    errors.description = "Invalid description.";
  }

  if (!isValidDate(data.publishYear)) {
    errors.date = "Invalid date.";
  }

  if (!isValidImageUrl(data.coverImage)) {
    errors.image = "Invalid image.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Updating the book failed due to validation errors.",
      errors,
    });
  }

  try {
    await replace(req.params.id, data);
    res.json({ message: "Book updated.", book: data });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.json({ message: "Book deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
