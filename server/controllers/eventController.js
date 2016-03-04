var Event = require('../models/eventModel.js');
var Events = require('../collections/eventCollection.js');
var User = require('../models/userModel.js');
var Users = require('../collections/userCollection.js');
var Userevent = require('../models/usereventModel.js');
var UserEvents = require('../collections/usereventCollection.js');
var knex = require('../db/schema.js').knex;
var jwt = require('jwt-simple');

module.exports = {
  addEvent: function (req, res) {
    var topic = req.body.topic;
    var place = req.body.place;
    var datetime = req.body.date.slice(0,11) + req.body.time.slice(11);
    var token = req.body.token;

    var eventCreateUser = jwt.decode(token, 'deadpoolsecret').username;

    var event = new Event({
      topic: topic,
      place: place,
      datetime: datetime
    });

    event.save()
      .then(function(newEvent) {
        Events.add(newEvent);
        var eventid = event.id;

        // need to get the userid of the user who created the event
        new User({ username: eventCreateUser }).fetch()
          .then(function(found) {
            if (found) {
              var userid = found.id;

              // insert into userevent table the userid and eventid
              var newUserEvent = new Userevent({user_id: userid, event_id: eventid});
              newUserEvent.save()
                .then(function(userEventInsert) {
                  UserEvents.add(userEventInsert);
                  res.send(Events);
                });
            }
          });
      });
  },

  getEvents: function(req, res) {
    var token = req.body.token;
    var currentUser = jwt.decode(token, 'deadpoolsecret').username;
    console.log('++line 51 eventController currentUser: ', currentUser);
    Events.fetch()
      .then(function(collection) {
        collection = collection.toJSON();
        for(var i = 0; i < collection.length; i++){
          collection[i]['currentUser'] = currentUser;
        }
        res.send(collection);
      });
  },

  eventToggle: function(req, res) {
    var token = req.body.token;
    var eventid = req.body.event.id;
    var eventJoinUser = jwt.decode(token, 'deadpoolsecret').username;
    var validObj = {isValid: false};

    new User({username: eventJoinUser}).fetch()
      .then(function(found) {
        if(found) {
          var userid = found.id;
          // insert into userevent table the userid and eventid
          new Userevent({user_id: userid, event_id: eventid}).fetch()
            .then(function(found) {
              // cannot join the same event twice
              if(found) {
                knex.table('usereventjoins')
                .where({user_id: userid, event_id: eventid})
                .del()
                .then(function(model){
                  validObj.isValid = true;
                  res.send(validObj);
                });
              } else {
                var newUserEvent = new Userevent({user_id: userid, event_id: eventid});
                newUserEvent.save()
                  .then(function(userEventInsert) {
                    UserEvents.add(userEventInsert);
                    validObj.isValid = true;
                    res.send(validObj);
                  });
              }
            });
        } else {
          res.send(validObj);
        }
      });
  },

  getGuestList: function(req, res) {
    // GET request that sends the eventid, and returns an object with the attending users
    var eventid = req.body.eventid;

    // SQL query to get all users from eventid
    knex('usereventjoins').where('event_id', eventid)
      .then(function(collection) {
        var guestList = [];
        collection.forEach(function(user) {
          guestList.push(user.user_id);
        });

      knex.select('username').from('users').whereIn('id', guestList)
        .then(function(list) {
          console.log(list);
          res.send(list);
        });
    });
  }
};
