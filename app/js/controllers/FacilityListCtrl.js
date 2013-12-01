
fredApp.controller('FacilityListCtrl', ['$scope', '$rootScope', '$location', 'FacilityResource', function( $scope, $rootScope, $location, FacilityResource ) {
  // TODO refactor into service
  angular.element('#menu').children().removeClass('active');
  angular.element('#menuList').addClass('active');

  if( $('#menu').hasClass('in') ) {
    $("#menu").collapse('hide');
  }

  $rootScope.clearAlert();
  $rootScope.clearInfo();

  var queryString = $location.search();
  refreshFacilityList();

  function refreshFacilityList() {
    $scope.facilities = FacilityResource.query({
      limit: queryString.limit,
      offset: queryString.offset
    }, function(data) {
      $scope.previous = data.meta.offset > 0;
      $scope.next = (data.meta.total - data.meta.offset ) >= data.meta.limit;
    });
  }

  $scope.removeFacility = function( idx ) {
    if(confirm("Are you sure?")) {
      FacilityResource.remove({ id: idx }, function(data) {
        $rootScope.infoMsg = data.message;
        refreshFacilityList();
      }, function(data) {
        $rootScope.alertMsg = data.data.message;
      });
    }
  };
}]);
