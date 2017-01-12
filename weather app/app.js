var weather = require('./weather.js');
var location = require('./location.js');
var argv = require('yargs')
	.option('location', {
		alias: 'l',
		demand: false,
		describe: 'Location to fetch weather for',
		type: 'string'
	})
	.help('help')
	.argv;

if( typeof argv.l ==='string' && argv.l.length > 0){
	console.log('Locations was provided');
	weather(argv.l).then(function(currentweather){
		console.log(currentweather);
	}).catch(function(error){
		console.log(error);
	})
}else{
	console.log('Locations was not provided');
	location().then(function(loc){
		return weather(loc.city);
	}).then(function(currentweather){
		console.log(currentweather);
	}).catch(function(error){
		console.log(error);
	});
}
