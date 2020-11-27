import { config } from 'dotenv';
import { posix, join } from 'path';
import { green, red } from 'chalk';
import { connectSSH } from './utils';

async function run() {
  config();

  const ssh = await connectSSH();

  const deployPath = process.env.DEPLOY_PATH;
  const releasesPath = posix.join(deployPath, 'releases');

  const [date, time] = new Date().toISOString().split('T');
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');
  const releaseFolder = `${year}${month}${day}${hours}${minutes}`;

  const releasePath = posix.join(releasesPath, releaseFolder);

  console.log(`Creating release dir "${releasePath}"`);
  await ssh.exec('mkdir', ['-p', releasePath]);
  console.log(green(`Created release dir!`));

  const rootLocalPath = join(__dirname, '..');
  const distLocalPath = join(rootLocalPath, 'dist');
  const distRemotePath = posix.join(releasePath, 'dist');

  console.log(`Copying "dist" folder...`);
  await ssh.putDirectory(distLocalPath, distRemotePath, { recursive: true });
  console.log(green(`"dist" folder copied!`));

  console.log(`Copying "package.json" and "package-lock.json" files...`);
  await ssh.putFiles([
    {
      local: join(rootLocalPath, 'package.json'),
      remote: posix.join(releasePath, 'package.json'),
    },
    {
      local: join(rootLocalPath, 'package-lock.json'),
      remote: posix.join(releasePath, 'package-lock.json'),
    },
  ]);
  console.log(green(`"package.json" and "package-lock.json" files copied!`));

  const nvmSh = posix.join(process.env.SSH_NVM_DIR, 'nvm.sh');

  console.log(`Installing production dependencies...`);
  await ssh.execCommand(`. ${nvmSh}; npm ci --production`, {
    cwd: releasePath,
  });
  console.log(green(`Production dependencies installed!`));

  const relativeReleasePath = posix.join('releases', releaseFolder);

  console.log(`Switching current version...`);
  await ssh.exec('ln', ['-nfs', relativeReleasePath, 'current'], {
    cwd: deployPath,
  });
  console.log(green(`Current version is now ${releaseFolder}!`));

  const keepReleases = parseInt(process.env.DEPLOY_KEEP_RELEASES ?? '2');

  console.log(`Cleaning old releases (keeping ${keepReleases})...`);
  await ssh.execCommand(
    `(ls -rd ./*|head -n ${keepReleases}; ls -d ./*)|sort|uniq -u|xargs rm -rf`,
    { cwd: releasesPath },
  );
  console.log(green('Cleaned old releases!'));

  console.log(`Restarting app...`);
  await ssh.execCommand(`. ${nvmSh}; pm2 start`, { cwd: deployPath });
  console.log(green('App restarted!'));

  ssh.dispose();
}

(async () => {
  try {
    await run();
    process.exit(0);
  } catch (e) {
    console.log(red(e));
    process.exit(1);
  }
})();
