const bcrypt = require('bcrypt');

const myPassword = 'admin123';
const myHash = '$2b$10$/ow.YhuyAzOeNfLTC7iQ3u2cfocJ2q/kBrfCX2fzzmw803A5.SRlK'

async function verifyPassword (password, hash) {
  const isMatch = await bcrypt.compare(password, hash);
  console.log(isMatch)
}

verifyPassword(myPassword, myHash)