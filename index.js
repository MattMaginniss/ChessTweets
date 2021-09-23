const got = require('got')
const Twitter = require('twitter')
const ECO = require("./ecoStuff/index.js")
const nconf = require('nconf')
const fs = require('fs')
const { Chess } = require('chess.js')
const chess = new Chess()
const ChessImageGenerator = require('chess-image-generator')

var imageGenerator = new ChessImageGenerator({
  size: 1200,
  light: '#c7c7c7',
  dark: '#71828f',
  style: 'cburnett',
  flipped: false
})

let pgn = '1. Nf3 d5 2. e3 Nf6 3. d4 c5 4. h3 Nc6 5. c4 cxd4 6. exd4 e6 7. Nc3 Be7'
chess.load_pgn(pgn)
console.log(chess.ascii())
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

nconf.argv().env().file('./secretstuff/secretkeys.json')

var client = new Twitter({
  consumer_key: (process.env.consumerKey || nconf.get('consumerKey')),
  consumer_secret: (process.env.consumerSecret || nconf.get('consumerSecret')),
  access_token_key: (process.env.accountAccessToken || nconf.get('accountAccessToken')),
  access_token_secret: (process.env.accountTokenSecret || nconf.get('accountTokenSecret'))
})

const imageData = fs.readFileSync('./output.png', 'base64')

var imageBody = {
	'media_data': imageData,
  'additional_owners': '1440418798545240073',
  'media_category': 'tweet_image'
}

client.post('media/upload.json',
    imageBody,
	function(err, media, res) {
		if (err) {
			console.log(err);
		} else {
      var status = 'testing this from Node with an image';
      console.log(status)
      var tweetBody = {
        'status': status,
        media_ids: media.media_id_string
      }
      client.post('statuses/update.json',
        tweetBody,
      function(err, data, res) {
        if (err) {
          console.log(err);
        } else {
          // console.log(data);
        }
      })
		}
	})
