import * as bcrypt from 'bcrypt';

async function run() {
  const hash = await bcrypt.hash('SuperAdmin@123', 10);
  console.log('Hashed password:');
  console.log(hash);
}

run();
