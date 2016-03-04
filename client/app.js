angular.module('studyMate', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider
  .state('eventsHome', {
    url: '/eventsHome',
    templateUrl: 'allEventsList/eventsHome.html',
    authenticate: true,
    signedin: false
  })
  .state('signin', {
    url: '/signin',
    templateUrl: 'log/signin.html',
    authenticate: false,
    signedin: false
  })
  .state('booksList', {
    url: '/bookslist/:bookTopic',
    templateUrl: 'booksList/booksList.html',
    controllerAs: 'booksListCtrl',
    authenticate: true,
    signedin: false
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'log/signup.html',
    authenticate: false,
    signedin: false
  });
  $urlRouterProvider.otherwise('/signin');
  $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.studymate');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
return object;
}
};
return attach;
})

.run(function ($rootScope, $state, $location, logFact) {
  $rootScope.url = "http://localhost:8000";
  $rootScope.$on('$stateChangeStart', function (e, toState) {
if (toState.authenticate && !logFact.isAuth()) {
  e.preventDefault();
  $state.go('signin');
}
if(!toState.authenticate && logFact.isAuth()) {
  e.preventDefault();
  $state.go('eventsHome');
}
});
});
