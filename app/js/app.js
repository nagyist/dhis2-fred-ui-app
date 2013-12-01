
var baseUrl;

var fredApp = angular.module('FredApp', [ 'ngRoute', 'ngResource' ])
  .config(['$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {
    $routeProvider.when('/facilities', {
      templateUrl: 'partials/facility-list.html',
      controller: 'FacilityListCtrl'
    }).when('/facilities/tree/:parent?', {
        templateUrl: 'partials/facility-tree.html',
        controller: 'FacilityTreeCtrl'
    }).when('/facilities/new', {
        templateUrl: 'partials/facility.html',
        controller: 'FacilityCtrl'
    }).when('/facilities/map', {
        templateUrl: 'partials/facility-map.html',
        controller: 'FacilityMapCtrl'
    }).when('/facilities/edit/:id', {
      templateUrl: 'partials/facility.html',
      controller: 'FacilityCtrl'
    }).otherwise({
      redirectTo: '/facilities'
    });

    $locationProvider.html5Mode(false).hashPrefix('!');

    $.ajax({
      url: 'manifest.webapp',
      async: false,
      cache: false,
      dataType: 'json'
    }).done(function( data ) {
      baseUrl = data.activities.dhis.href;
    });
  }]);

fredApp.run( ['$rootScope', function( $rootScope ) {
  $rootScope.clearInfo = function() {
    $rootScope.infoMsg = undefined;
  };

  $rootScope.clearAlert = function() {
    $rootScope.alertMsg = undefined;
  };
}]);
