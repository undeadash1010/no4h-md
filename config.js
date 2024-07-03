import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['923164413714', 'nansoffc', true],
  ['923164413714']
] // nomor owner

global.mods = ['923164413714'] 
global.prems = ['923164413714', '923164413714']
global.APIs = { // API Prefix
  // name: 'https://website' 
  nrtm: 'https://fg-nrtm.ddns.net',
  lann: 'https://api.betabotz.eu.org'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.betabotz.eu.org': 'nananakorang'
}

// Apikey lu
global.lann = 'nananakorang'

// setting limit user
global.limit = 69

// Sticker WM
global.packname = 'Sticker' 
global.author = '@No4h' 
//--info NS [ NANS ]
global.NSnama = 'NO4H WhatsApp'
global.NSig = 'https://www.instagram.com/' 
global.NSgc = 'https://whatsapp.com/'
global.NSthumb = 'https://mallucampaign.in/images/img_1719937666.jpg'

global.wait = '*⌛ _Loading..._*\n*▰▰▰▱▱▱▱▱*'
global.eror = 'Error negro'
global.rwait = '⌛'
global.dmoji = '🤭'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🔥' 

global.multiplier = 69 
global.maxwarn = '2' // max warning

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
