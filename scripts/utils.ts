import { NodeSSH } from 'node-ssh';
import { green } from 'chalk';

export async function connectSSH(): Promise<NodeSSH> {
  const ssh = new NodeSSH();
  const host = process.env.SSH_HOST;
  const username = process.env.SSH_USER;

  console.log(`Connecting to ${username}@${host}...`);
  await ssh.connect({
    host,
    username,
    privateKey: process.env.SSH_KEY,
  });
  console.log(green(`Connected to ${username}@${host}!`));

  return ssh;
}
