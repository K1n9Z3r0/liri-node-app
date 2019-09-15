require("dotenv").config();
var keys = require("./keys")
var request = require("request")
var Spotify = require("node-spotify-api")
var dateFormat = require("dateformat")
var fs = require("fs")

// bands in town search
// =================================================================
var conertSearch = function(artist) {
    var region = ""
    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"


    request(url, function(err, response, body) {

        if (err) {
            return console.log(err)
        }

        var concertInfo = JSON.parse(body)

        results(artist + " concert information:")

        for (i = 0; i < concertInfo.length; i++) {

            region = concertInfo[i].venue.region

            if (region === "") {
                region = concertInfo[i].venue.country
            }

            results("Venue: " + concertInfo[i].venue.name)
            results("Location: " + concertInfo[i].venue.city + ", " + region);
            results("Date: " + dateFormat(concertInfo[i].datetime, "mm/dd/yyyy"))
        }
    })
};

// spotify search
// ==================================================================
var spotifySearch = function(song) {

    if (!song) {
        song = "The Sign Ace of Base"
    }

    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: "track", query: song, limit: 1 }, function(err, data) {

        if (err) {
            return console.log(err)
        }


        var songInfo = data.tracks.items[0]
        results(songInfo.artists[0].name)
        results(songInfo.name)
        results(songInfo.album.name)
        results(songInfo.preview_url)
    })
}

// omdb movie search
// ================================================================================
var movieSearch = function(movie) {


    if (!movie) {
        movie = "Mr.+Nobody"
    }

    var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";


    request(url, function(err, response, body) {

        if (err) {
            return console.log(err)
        }

        var movieInfo = JSON.parse(body)

        results("Title: " + movieInfo.Title)
        results("Release year: " + movieInfo.Year)
        results("IMDB Rating: " + movieInfo.imdbRating)
        results("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value)
        results("Country: " + movieInfo.Country)
        results("Language: " + movieInfo.Language)
        results("Plot: " + movieInfo.Plot)
        results("Actors: " + movieInfo.Actors)
    });
}


var doWhatItSays = function() {

    fs.readFile("random.txt", "utf8", function(err, data) {

        if (err) {
            return console.log(err)
        }

        var dataArray = data.split(",")

        sendIt(dataArray[0], dataArray[1])
    });
}


var results = function(data) {
    console.log(data)

    fs.appendFile("log.txt", "\r\n" + data, function(err) {

        if (err) {
            return console.log(err)
        }
    })
}

var sendIt = function(func, parm) {
    switch (func) {
        case "concert-this":
            conertSearch(parm)
            break
        case "spotify-this-song":
            spotifySearch(parm)
            break
        case "movie-this":
            movieSearch(parm)
            break
        case "do-what-it-says":
            doWhatItSays()
            break
        default:
            results("please use commands: concert-this, spotify-this-song, movie-this, or do-what-it-says")
    }
}

sendIt(process.argv[2], process.argv[3])