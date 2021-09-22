const ECO = require("./ecoStuff/index.js")

var ChessImageGenerator = require('chess-image-generator')

var imageGenerator = new ChessImageGenerator({
  size: 1200,
  light: '#c7c7c7',
  dark: '#71828f',
  style: 'cburnett',
  flipped: false
})

let pgn = '1. Nf3 d5 2. e3 Nf6 3. d4 c5 4. h3 Nc6 5. c4 cxd4 6. exd4 e6 7. Nc3 Be7'
imageGenerator.loadPGN(pgn)
imageGenerator.generatePNG('./output.png')


const eco = new ECO()
eco.on("loaded", ()=>{ 
    let opening = eco.find(pgn)
    console.log("ECO", opening.eco_code)
    console.log("NAME", opening.name)
    console.log("VARIATION", opening.variation)
})
eco.load_default()
