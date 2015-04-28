var app = angular.module('app', ['ngRoute']);
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'views/home.html',
      controller: 'Ctrl'
    }).
    when('/vid/:sub', {
      templateUrl: 'views/videos.html',
      controller: 'MusicCtrl'
    }).
    when('/txt/:sub', {
      templateUrl: 'views/text.html',
      controller: 'TextCtrl'
    }).
    when('/com/:sub', {
      templateUrl: 'views/comments.html',
      controller: 'CommentsCtrl'
    }).
    otherwise({
      redirectTo: '/'
    })
  }])
