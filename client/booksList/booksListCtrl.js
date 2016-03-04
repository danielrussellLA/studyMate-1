angular.module('studyMate')

.controller('booksListCtrl', function($scope, $window, $state, $stateParams, booksListFact) {
  $scope.booksList = [];
  $scope.bookTopic = $stateParams.bookTopic;

  // calls the bookSearch function inside the booksListFact to ping google books api and stores results in booksList array
  $scope.bookSearch = function(){
    booksListFact.bookSearch($scope.bookTopic)
    .then(function(books){
      $scope.booksList = books;
      console.log($scope.booksList);
    });
  };

});
