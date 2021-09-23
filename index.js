const got = require('got')
const Twitter = require('twitter')
const ECO = require("./ecoStuff/index.js")
const nconf = require('nconf')
const fs = require('fs')
const pgnParser = require('pgn-parser')
const ChessImageGenerator = require('chess-image-generator')

var imageGenerator = new ChessImageGenerator({
  size: 1200,
  light: '#c7c7c7',
  dark: '#71828f',
  style: 'cburnett',
  flipped: false
})

let pgn = `[Event "Let\\'s Play!"]
[Site "Chess.com"]
[Date "2021.05.17"]
[Round "?"]
[White "birdmanofbombay"]
[Black "MattHasFun"]
[Result "1/2-1/2"]
[ECO "A04"]
[WhiteElo "1081"]
[BlackElo "945"]
[TimeControl "1/172800"]
[EndDate "2021.07.16"]
[Termination "Game drawn by agreement"]

1. b3 Nf6 2. Bb2 g6 3. Nf3 Bg7 4. e3 Nc6 5. Bb5 a6 6. Bxc6 bxc6 7. d4 d5 8. c4
O-O 9. cxd5 cxd5 10. Nc3 e6 11. Ne5 Qd6 12. a4 Rb8 13. Nb1 Qb6 14. Nd2 Nd7 15.
Nxd7 Bxd7 16. Ba3 Rfe8 17. Bc5 Qb7 18. Ke2 a5 19. f4 Qa6+ 20. Kf2 Qd3 21. Qe2
Qxe2+ 22. Kxe2 Rec8 23. h3 c6 24. g4 f6 25. Rhb1 f5 26. Nf3 Bf6 27. h4 Rc7 28.
Bd6 Rcb7 29. Bxb8 Rxb8 30. g5 Bg7 31. Kd2 c5 32. Kc2 cxd4 33. exd4 Rb4 34. Rd1
Bf8 35. Ne5 Be8 36. Rd3 Bd6 37. Kc3 Kf8 38. Re3 Ke7 39. Nd3 Rb6 40. Rh3 Kf7 41.
h5 Kg8 42. hxg6 hxg6 43. Re3 Bf8 44. Ne5 Rb7 45. Rh3 Bg7 46. Nd3 1/2-1/2`

const [result] = pgnParser.parse(pgn)
console.log(result);
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

/*var imageBody = {
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
	})*/
