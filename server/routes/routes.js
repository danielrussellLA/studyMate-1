var jsonParser = require('body-parser').json();

var userController = require('../controllers/userController.js');
var eventController = require('../controllers/eventController.js');

module.exports = function(app, express) {

  app.use(jsonParser);

  app.use('/', express.static(__dirname + '/../../client'));

  app.post('/api/users/signin', jsonParser, userController.signin);
  app.post('/api/users/signup', jsonParser, userController.signup);
  app.post('/api/events/getEvents', jsonParser, eventController.getEvents);
  app.post('/api/events/addEvent', jsonParser, eventController.addEvent);
  app.post('/api/events/eventAttendanceToggle', jsonParser, eventController.eventToggle);
  app.post('/api/events/getGuestList', jsonParser, eventController.getGuestList);
};
