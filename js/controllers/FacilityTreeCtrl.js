
fredApp.controller('FacilityTreeCtrl', ['$scope', '$rootScope', '$location', '$routeParams', 'FacilityResource',
  function( $scope, $rootScope, $location, $routeParams, FacilityResource ) {

  // TODO refactor into service
  angular.element('#menu').children().removeClass('active');
  angular.element('#menuTree').addClass('active');

  if( $('#menu').hasClass('in') ) {
    $("#menu").collapse('hide');
  }

  $rootScope.clearAlert();
  $rootScope.clearInfo();

  refreshFacilityList();

  function refreshFacilityList() {
    $scope.parent = $routeParams.parent;

    if( typeof $routeParams.parent !== 'undefined' ) {
      $scope.facilities = FacilityResource.query({
        "properties.parent": $routeParams.parent
      }, updateCurrentScope);
    } else {
      $scope.facilities = FacilityResource.query({
        "properties.level": 1
      }, updateCurrentScope);
    }
  }

  function updateCurrentScope( data ) {
    $scope.maxLevel = data.facilities[0].properties.hierarchy[data.facilities[0].properties.hierarchy.length - 1].level;
    $scope.currentLevel = data.facilities[0].properties.level;
    $scope.isTopLevel = $scope.maxLevel == $scope.currentLevel;
  }

  $scope.removeFacility = function( idx ) {
    if( confirm("Are you sure?") ) {
      FacilityResource.remove({ id: idx }, function( data ) {
        $rootScope.infoMsg = data.message;
        refreshFacilityList();
      }, function( data ) {
        $rootScope.alertMsg = data.data.message;
      });
    }
  };

}]);
