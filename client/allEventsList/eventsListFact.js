angular.module('studyMate')

.factory('eventsListFact', function($http) {
  var getEvents = function(token) {
    return $http({
      method: 'POST',
      url: '/api/events/getEvents',
      data: {token: token}
    }).then( function successs(response) {
      return response.data;
    }, function error(response) {
      console.log(response);
    });
  };

  var eventToggle = function(eventData) {
    return $http({
      method: 'POST',
      url: 'api/events/eventAttendanceToggle',
      data: eventData
    }).then(function(resp) {
      return resp.data;
    });
  };

  var getGuestList = function(eventid) {
    var data = {eventid: eventid};
    return $http({
      method: 'POST',
      url: 'api/events/getGuestList',
      data: data
    }).then(function success (response) {
      return response.data;
    }, function error(response) {
      console.log(response);
    });
  };

  return {
    getEvents: getEvents,
    getGuestList: getGuestList,
    eventToggle: eventToggle
  };
});
