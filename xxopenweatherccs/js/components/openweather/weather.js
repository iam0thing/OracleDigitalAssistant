"use strict";

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

  metadata: () => ({
    "name": "Custom.Weathercc",
    "properties": {
      "city": {
        "type": "string",
        "required": true
      },
      "country": {
        "type": "string",
        "required": true
      }
    },
    "supportedActions": ["found", "error"]
  }),

  invoke: (conversation, done) => {
    const city = conversation.properties().city;
    const country = conversation.properties().country;

    console.info("request weather for: " + city + ", " + country);

    var args = {}
    args.city = city;
    args.country = country;


    //call custom API using Oracle Mobile Cloud SDK -> conversation.oracleMobile
    // returns:
    //{
    //  "city": "Birmingham",
    //  "country": "GB",
    //  "weather": "Clear",
    //  "description": "clear sky",
    //  "icon": "https://openweathermap.org/img/w/01d.png",
    //  "temperature": 2.28
    //}
    // xxopenWeather is the shared api name with city as resource and args as query parameters
    conversation.oracleMobile.custom.xxopenWeather.post('city', args, {
      inType: 'json'
    }).then(

      function(result) {

        console.fine("returned weather: " + result.result);
        var weatherInfo = JSON.parse(result.result);

        //render response in a single card
        var cards = [];
        let cardObj = conversation.MessageModel().cardObject("Weather for " + weatherInfo.city + ", "
                      + weatherInfo.country, weatherInfo.description + ', ' + weatherInfo.temperature
                      + ' C', weatherInfo.icon, null, null);
        cards.push(cardObj);

        var cardResponseMessage = conversation.MessageModel().cardConversationMessage('vertical', cards);

        conversation.reply(cardResponseMessage);
        conversation.keepTurn(true);
        conversation.transition("found");
        done();

      },
      function(error) {
        console.info("Enter error path");
        console.info("error -" + error.error);
        conversation.transition("error");
        done();
      }
    );
  }
};
