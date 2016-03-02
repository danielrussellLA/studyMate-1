angular.module('studyMate')

.controller('createEventCtrl', function($window, $scope, $state, createEventFact, eventsListFact) {
  $scope.event = { guests: [] };
  $scope.currentDate = new Date();

  $scope.sendEvent = function() {
    var temp_time = new Date($scope.event.time).setFullYear(1, 0, 1);
    var now = new Date().setFullYear(1, 0, 1);
    $scope.event.token = $window.localStorage.getItem('com.studymate');
    if ($scope.event.date.getMonth() === $scope.currentDate.getMonth() && $scope.event.date.getYear() === $scope.currentDate.getYear() && $scope.event.date.getDate() === $scope.currentDate.getDate()) {
      if (now > temp_time) {
        console.log("DATE IS SAME, TIME IS INVALID");
        alert("try again");
      }
      else {
        console.log("DATE IS SAME, TIME IS VALID");
        createEventFact.addEvent($scope.event);
      }
    }
    else {
      console.log("VALIDDD");
      createEventFact.addEvent($scope.event);
    }
    $state.reload();
    $window.location.href = '/#/eventsHome';
  };






});
