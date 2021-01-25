const Discord = require('discord.js')
const fs = require('fs');
const wait = require('util').promisify(setTimeout);

// shuffle array using Fisher-Yates (aka Knuth) Shuffle algorithm (https://github.com/coolaj86/knuth-shuffle)
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  

 async function repeatList(client){
    var infoList = JSON.parse(fs.readFileSync('./data/auto-messages-info.json', 'utf-8'))
    infoList = shuffle(infoList)
    for(var i = 0; i < infoList.length; i++){
        client.channels.cache.get('729083124738162760').send(infoList[i])
        await wait(6*60*60*1000) // Send every 6 hours
    }
    repeatList(client)
}

module.exports = repeatList
