'use strict';
app.controller('CustomCtrl', ['$scope', '$http', '$routeParams', 'Menu',
  function($scope, $http, $routeParams, Menu) {
    $scope.save = function () {
      var subs;
      if (localStorage['custsubs'] === null || localStorage['custsubs'] === undefined || localStorage['custsubs'] === "") {
        subs = [];
      } else {
        subs = JSON.parse(localStorage["custsubs"]);
      }
      subs.push({sub: $scope.sub,type: $scope.type})
      $scope.subs = subs
      localStorage["custsubs"] = JSON.stringify(subs);
    }
    function getSubsFromStorage() {
      var subs;
      if (localStorage['custsubs'] === null || localStorage['custsubs'] === undefined || localStorage['custsubs'] === "") {
        subs = [];
      } else {
        subs = JSON.parse(localStorage["custsubs"]);
      }
      return subs
    }
    $scope.delete = function (idx) {
      $scope.subs.splice(idx,1)
      localStorage["custsubs"] = JSON.stringify($scope.subs);
    }
    $scope.subs = getSubsFromStorage()
  }])
