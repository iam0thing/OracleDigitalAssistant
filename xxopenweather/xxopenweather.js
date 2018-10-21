/**
 * The ExpressJS namespace.
 * @external ExpressApplicationObject
 * @see {@link http://expressjs.com/3x/api.html#app}
 */

/**
 * Mobile Cloud custom code service entry point.
 * @param {external:ExpressApplicationObject}
 * service
 */
module.exports = function(service) {


	/**
	 *  The file samples.txt in the archive that this file was packaged with contains some example code.
	 */


	service.post('/mobile/custom/xxopenWeather/zip', function(req,res) {
		var zipCode = req.body.zip ? req.body.zip : "42489";
		var country = req.body.country ? req.body.country : "de";

		returnWeather({
			qs: { zip: zipCode+','+country}
		},req, res);
	});

	function returnWeather(queryString, req, res) {

    req.oracleMobile.connectors.OpenWeatherMapConn.get('weather', null, queryString).then(

			function(result) {

			 var weather = JSON.parse(result.result);

				var optimizedReturn = {"city": weather.name,
				                       "country": weather.sys.country,
															 "weather" : weather.weather[0].main ,
															 "description": weather.weather[0].description,
															 "icon": "https://openweathermap.org/img/w/"+weather.weather[0].icon+".png",
															 "temperature": weather.main.temp};

        res.send(result.statusCode, optimizedReturn);
      },
      function(error) {
        res.send(error.statusCode, error.error);
      }
    );
  }

	service.post('/mobile/custom/xxopenWeather/city', function(req,res) {
		var city = req.body.city ? req.body.city : "London";
    var country = req.body.country ? req.body.country : "uk";

    returnWeather({
      qs: { q: city+','+country}
    }, req, res);
	});

};
