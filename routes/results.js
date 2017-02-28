const express = require('express');
const router = express.Router();
const yelp = require('yelp');
const axios = require('axios');

const Oconsumer_key = process.env.CONSUMER_KEY;
const Oconsumer_secret = process.env.consumer_secret;
const Otoken = process.env.token;
const Otoken_secret = process.env.token_secret;

const Ogeolocation_key = process.env.geolocation_key
const Ogeocode_key = process.env.geocode_key

const Yelp = new yelp({
    consumer_key: Oconsumer_key,
    consumer_secret: Oconsumer_secret,
    token: Otoken,
    token_secret: Otoken_secret
});

/* GET users listing. */

router.get('/', function(req, res, next) {
    res.send('hi');
});

router.post('/', function(req, res, next) {
    axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${Ogeolocation_key}`)
        .then((response) => {
            let located = response.data.location;
            let lat = located.lat;
            let lon = located.lng;
            //here we have the latitude and longitude data . . . hmm . . . we have to be able to plug that data into the Yelp search
            axios.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${Ogeocode_key}`)
                .then((response1) => {
                    let area = response1.data.results[0].formatted_address
                    Yelp.search({ term: `${req.body.name}`, location: area, radius_filter: 1609.34, sort: 1 })
                        .then(function(data) {
                            let businesses = data.businesses;
                            let latty;
                            let longy;
                            // console.log(businesses[0])

                            Object.keys(businesses).map((busy) => {
                                    let square = businesses[busy].location.coordinate;
                                    latty = square.latitude;
                                    longy = square.longitude;
                                    console.log(latty, longy)
                                })
                                // console.log(latty, longy);
                            res.render('results', {
                                test: businesses,
                                title: `${req.body.name}`,
                                country: `${req.body.name}`
                            });
                        })
                        .catch(function(err) {
                            console.error(err);
                        });
                });
        })
        .catch(function(err) {
            console.error(err)
        })
});

module.exports = router;
