'use strict';

app.controller('MusicCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {

  }])
app.controller('TextCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {

  }])
app.controller('MusicCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {

}])
app.controller('VideosCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    
  }])
app.controller('Ctrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    $("[name='my-checkbox']").bootstrapSwitch({
      size:'mini'
    })
    .on('switchChange.bootstrapSwitch', function(event, state) {
      $scope.$apply($scope.omitRedundancies = state)
    })
  }])
