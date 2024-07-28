const users = []; // This should be replaced with your database logic

async function add(data) {
  const newUser = { ...data, id: users.length + 1 };
  users.push(newUser);
  return newUser;
}

async function get(email) {
  return users.find(user => user.email === email);
}

async function updateEmail(userId, newEmail) {
  const user = users.find(user => user.id === userId);
  if (user) {
    user.email = newEmail;
    return user;
  }
  throw new Error('User not found');
}

module.exports = { add, get, updateEmail };
