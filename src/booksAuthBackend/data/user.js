const { hash } = require('bcryptjs');
const { v4: generateId } = require('uuid');
const { NotFoundError } = require('../util/errors');
const { readData, writeData } = require('./util');

async function add(data) {
  const storedData = await readData();
  const userId = generateId();
  const hashedPw = await hash(data.password, 12);
  const role = data.role || 'user'; // Assign role or default to 'user'

  if (!storedData.users) {
    storedData.users = [];
  }

  storedData.users.push({ ...data, password: hashedPw, id: userId, role });
  await writeData(storedData);

  return { id: userId, email: data.email, role }; // Return role along with id and email
}


async function get(email) {
  const storedData = await readData();
  if (!storedData.users || storedData.users.length === 0) {
    throw new NotFoundError('Could not find any users.');
  }

  const user = storedData.users.find((ev) => ev.email === email);
  if (!user) {
    throw new NotFoundError('Could not find user for email ' + email);
  }

  return user;
}

async function updateEmail(token, newEmail) {
  // Decode the token to extract user ID
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.userId;

  const storedData = await readData();

  if (!storedData.users || storedData.users.length === 0) {
    throw new NotFoundError('Could not find any users.');
  }

  const userIndex = storedData.users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    throw new NotFoundError('User not found.');
  }

  storedData.users[userIndex].email = newEmail;
  await writeData(storedData);

  return storedData.users[userIndex];
}

exports.updateEmail = updateEmail;
exports.add = add;
exports.get = get;
