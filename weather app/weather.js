var request = require('request');

module.exports = function (location) {
		return new Promise(function(resolve, reject){
		var encodedLocation = encodeURIComponent(location);	
		var url = 'http://api.openweathermap.org/data/2.5/weather?appid=c11ef074ea7dde400f4a7ea38167c6d8&q=' + encodedLocation + '&units=imperial';

		if (!location){
			return reject('No location provided!');
		}
		request({
			url: url,
			json: true
		}, function(error, response, body){
			if (error){
				reject('Unable to fetch the weather!');
			} else{
				resolve('It\'s ' + body.main.temp + ' in ' + body.name + '!');
			}
		});
	})
};
