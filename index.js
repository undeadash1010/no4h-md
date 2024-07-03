console.log('✅ Iniciando...')

import os from 'os';
import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import chalk from 'chalk';
import cfonts from 'cfonts';

const app = express();
const port = process.env.PORT || 8080;

const basePath = new URL(import.meta.url).pathname;
const htmlDir = path.join(path.dirname(basePath), 'html');

const sendHtml = (req, res, name) => {
  res.sendFile(path.join(htmlDir, `${name}.html`));
};
//--
const { say } = cfonts
say(`\n`, {
  font: 'console',
  align: 'center',
  gradient: ['cyan', 'magenta']
})
say('nansoffc', {
  font: 'chrome',
  color: ['white']
})
say(`\n`, {
  font: 'console',
  align: 'center',
  gradient: ['cyan', 'magenta']
})

app.get('/', (req, res) => sendHtml(req, res, 'home'));
app.get('/chat', (req, res) => sendHtml(req, res, 'chat'));
app.get('/game', (req, res) => sendHtml(req, res, 'game'));
app.get('/tools', (req, res) => sendHtml(req, res, 'tools'));
app.get('/music', (req, res) => sendHtml(req, res, 'music'));

app.listen(port, () => {
  console.log(chalk.green(`🌐 Port ${port} terbuka`));
});

let isRunning = false;

async function start(file) {
  if (isRunning) return;
  isRunning = true;

  const currentFilePath = new URL(import.meta.url).pathname;
  const args = [path.join(path.dirname(currentFilePath), file), ...process.argv.slice(2)];
  const p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  });
//--
  p.on('message', (data) => {
    console.log(chalk.cyan(`🟢 MENERIMA ${data}`));
    switch (data) {
      case 'reset':
        p.kill();
        isRunning = false;
        start.apply(this, arguments);
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
    }
  });

  p.on('exit', (code) => {
    isRunning = false;

//console.error(chalk.red(`🛑 Salida con código: ${code}`));
console.error('❎ Terjadi kesalahan tak terduga:', code)
  console.error(chalk.red(`❌ SC> akan dimulai ulang...`));
  start('main.js');
//--
    if (code === 0) return;
    fs.watchFile(args[0], () => {
      fs.unwatchFile(args[0]);
      start('main.js');
    });
    //--
  });

  p.on('error', (err) => {
    console.error(chalk.red(`❌ Error: ${err}`));
    p.kill();
    isRunning = false;
    start('main.js');
  });

  const pluginsFolder = path.join(path.dirname(currentFilePath), 'plugins');

  fs.readdir(pluginsFolder, async (err, files) => {
    if (err) {
      console.error(chalk.red(`❌ Kesalahan membaca folder plugin: ${err}`));
      return;
    }
    console.log(chalk.yellow(`🟡 Menemukan plugin ${files.length} di folder ${pluginsFolder}`));

    try {
      const { default: baileys } = await import('@whiskeysockets/baileys');
      const version = (await baileys.fetchLatestBaileysVersion()).version;
      console.log(chalk.yellow(`🟡 Baileys version ${version} sudah terpasang`));
    } catch (e) {
      console.error(chalk.red('❌ Baileys tidak diinstal'));
    }
  });

  console.log(chalk.yellow(`🖥️ ${os.type()}, ${os.release()} - ${os.arch()}`));
  const ramInGB = os.totalmem() / (1024 * 1024 * 1024);
  console.log(chalk.yellow(`💾 Total RAM: ${ramInGB.toFixed(2)} GB`));
  const freeRamInGB = os.freemem() / (1024 * 1024 * 1024);
  console.log(chalk.yellow(`💽 Free RAM: ${freeRamInGB.toFixed(2)} GB`));
  console.log(chalk.yellow(`📃 Script by FG98F recode by NANS OFFC`));

  const packageJsonPath = path.join(path.dirname(currentFilePath), './package.json');
    try {
    const packageJsonData = await fsPromises.readFile(packageJsonPath, 'utf-8');
    const packageJsonObj = JSON.parse(packageJsonData);
    console.log(chalk.blue.bold(`\n📦 Informasi Paket`));
    console.log(chalk.cyan(`Nama: ${packageJsonObj.name}`));
    console.log(chalk.cyan(`Versi: ${packageJsonObj.version}`));
    console.log(chalk.cyan(`Deskripsi: ${packageJsonObj.description}`));
    console.log(chalk.cyan(`Autor: ${packageJsonObj.author.name}`));
  } catch (err) {
    console.error(chalk.red(`❌ Tidak dapat membaca file package.json: ${err}`));
  }

  const totalFoldersAndFiles = await getTotalFoldersAndFiles(pluginsFolder);
  console.log(chalk.blue.bold(`\n📂 Total Folder dan File di folder "Plugin"`));
  console.log(chalk.cyan(`Jumlah Folder: ${totalFoldersAndFiles.folders}`));
  console.log(chalk.cyan(`Jumlah File: ${totalFoldersAndFiles.files}`));

  console.log(chalk.blue.bold(`\n⏰ Waktu Saat Ini`));
  const currentTime = new Date().toLocaleString();
  console.log(chalk.cyan(`${currentTime}`));

  setInterval(() => {}, 1000);
}

function getTotalFoldersAndFiles(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        let folders = 0;
        let filesCount = 0;
        files.forEach((file) => {
          const filePath = path.join(folderPath, file);
          if (fs.statSync(filePath).isDirectory()) {
            folders++;
          } else {
            filesCount++;
          }
        });
        resolve({ folders, files: filesCount });
      }
    });
  });
}

start('main.js');

process.on('unhandledRejection', () => {
  console.error(chalk.red(`❌ Penolakan janji tidak ditangani. SC akan dimulai ulang...`));
  start('main.js');
});

process.on('exit', (code) => {
  console.error(chalk.red(`🛑 Output dengan kode: ${code}`));
  console.error(chalk.red(`❌ SC akan dimulai ulang...`));
  start('main.js');
});
