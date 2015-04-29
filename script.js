var app = angular.module('app', ['ngRoute','ngSanitize']);
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'views/home.html',
      controller: 'Ctrl'
    }).
    when('/audvid/:sub', {
      templateUrl: 'views/audio-video.html',
      controller: 'AudVidCtrl'
    }).
    when('/txt/:sub', {
      templateUrl: 'views/text.html',
      controller: 'TextCtrl'
    }).
    when('/com/:sub', {
      templateUrl: 'views/comments.html',
      controller: 'CommentsCtrl'
    }).
    when('/cust', {
      templateUrl: 'views/custom.html',
      controller: 'CustomCtrl'
    }).
    otherwise({
      redirectTo: '/'
    })
  }])
