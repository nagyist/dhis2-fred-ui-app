
fredApp.controller('FacilityCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'FacilityResource', 'DataSetResource',
  function( $scope, $rootScope, $routeParams, $location, FacilityResource, DataSetResource ) {

  angular.element('#menu').children().removeClass('active');

  $rootScope.clearAlert();
  $rootScope.clearInfo();

  $scope.dataSets = DataSetResource.query();

  if( $routeParams.id ) {
    $scope.facility = FacilityResource.get({id: $routeParams.id}, function() {
      $scope.uidIndex = findIdentifierIdx( $scope.facility.identifiers, 'DHIS2', 'DHIS2_UID', true );
      $scope.codeIndex = findIdentifierIdx( $scope.facility.identifiers, 'DHIS2', 'DHIS2_CODE', true );

      $scope.uidId = $scope.facility.identifiers[$scope.uidIndex];
      $scope.codeId = $scope.facility.identifiers[$scope.codeIndex];

      if( typeof $scope.facility.properties.dataSets === 'undefined' ) {
        $scope.facility.properties.dataSets = [];
      }

      $scope.refreshMap();
    });
  } else {
    $scope.facility = {};
    $scope.facility.identifiers = [];
    $scope.facility.properties = {};
    $scope.facility.coordinates = [];

    $scope.facility.active = true;
    $scope.facility.properties.dataSets = [];

    if( $location.search().parent ) {
      $scope.facility.properties.parent = $location.search().parent;
    }

    $scope.codeIndex = findIdentifierIdx( $scope.facility.identifiers, 'DHIS2', 'DHIS2_CODE', true );
    $scope.codeId = $scope.facility.identifiers[$scope.codeIndex];
  }

  function findIdentifierIdx( idArray, agency, context, create ) {
    var idx;

    $.each(idArray, function(i, item ) {
      if( item.agency === agency && item.context === context) {
        idx = i;
      }
    });

    if( typeof idx === 'undefined' && create ) {
      var id = {
        agency: agency,
        context: context
      };

      idArray.push(id);
      idx = idArray.length - 1;
    }

    return idx;
  }

  $scope.saveFacility = function() {
    // TODO: .coordinates/.identifiers should probably be replaced by ng-change here
    $scope.facility.coordinates = [];
    $scope.facility.coordinates[0] = angular.element('#longitude').val();
    $scope.facility.coordinates[1] = angular.element('#latitude').val();

    $scope.facility.identifiers[ $scope.uidIndex ] = $scope.uidId;
    $scope.facility.identifiers[ $scope.codeIndex ] = $scope.codeId;

    if($routeParams.id) {
      FacilityResource.update($scope.facility, function() {
        $location.path('#!/facilities');
      });
    } else {
      FacilityResource.save($scope.facility, function() {
        $location.path('#!/facilities');
      }, function(data) {
        console.log(data);
      });
    }
  };

  $scope.getCoordinates = function() {
    if( navigator.geolocation ) {
      navigator.geolocation.getCurrentPosition(function( position ) {
        $scope.facility.coordinates[0] = position.coords.longitude;
        $scope.facility.coordinates[1] = position.coords.latitude;

        $scope.$digest();
        $scope.refreshMap();
      });
    } else {
      $rootScope.alertMsg = "HTML5 GeoLocation API is not supported on this device."
    }
  };

  function createMap() {
    var mapOptions = {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("facility-map"), mapOptions);
  }

  $scope.refreshMap = function() {
    if( typeof $scope.facility.coordinates === 'undefined') {
      return;
    }

    if(typeof $scope.map === 'undefined') {
      createMap();
    }

    var lng = $scope.facility.coordinates[0];
    var lat = $scope.facility.coordinates[1];

    var latLng = new google.maps.LatLng(lat, lng);

    $scope.map.setCenter(latLng);

    var marker = new google.maps.Marker({
      position: latLng,
      map: $scope.map,
      title: this.name
    });

    $scope.map.setCenter(latLng);

    google.maps.event.trigger($scope.map, 'resize');
  };

  $(window).resize($scope.refreshMap);

  // TODO: refactor into service
  $scope.removeFacility = function( idx ) {
    if(confirm("Are you sure?")) {
      FacilityResource.remove({ id: idx }, function() {
        $location.path('#!/facilities');
      }, function(data) {
        $rootScope.alertMsg = data.data.message;
      });
    }
  };

}]);
