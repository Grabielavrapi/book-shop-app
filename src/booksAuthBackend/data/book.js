const fs = require("node:fs/promises");

const { v4: generateId } = require("uuid");

const { NotFoundError } = require("../util/errors");

async function readData() {
  const data = await fs.readFile("books.json", "utf8");
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile("books.json", JSON.stringify(data));
}

async function getAll() {
  const storedData = await readData();
  if (!storedData.books) {
    throw new NotFoundError("Could not find any books.");
  }
  return storedData.books;
}

async function get(id) {
  const storedData = await readData();
  if (!storedData.books || storedData.books.length === 0) {
    throw new NotFoundError("Could not find any books.");
  }

  const book = storedData.books.find((ev) => ev.id === Number(id));

  if (!book) {
    throw new NotFoundError("Could not find book for id " + id);
  }

  return book;
}

async function add(data) {
  const storedData = await readData();
  storedData.books.unshift({ ...data, id: generateId() });
  await writeData(storedData);
}

async function replace(id, data) {
  const storedData = await readData();
  if (!storedData.books || storedData.books.length === 0) {
    throw new NotFoundError("Could not find any books.");
  }

  const index = storedData.books.findIndex((ev) => ev.id === id);
  if (index < 0) {
    throw new NotFoundError("Could not find book for id " + id);
  }

  storedData.events[index] = { ...data, id };

  await writeData(storedData);
}

async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.books.filter((ev) => ev.id !== Number(id));
  await writeData({ books: updatedData });
}

exports.getAll = getAll;
exports.get = get;
exports.add = add;
exports.replace = replace;
exports.remove = remove;
