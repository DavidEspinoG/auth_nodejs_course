const bcrypt = require('bcrypt');

const myPassword = 'admin123';

async function hashPassword (password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(hash)
}

hashPassword(myPassword)