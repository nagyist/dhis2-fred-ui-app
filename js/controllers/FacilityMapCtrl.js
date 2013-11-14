fredApp.controller('FacilityMapCtrl', ['$scope', 'FacilityResource', function( $scope, FacilityResource ) {
  // TODO refactor into service
  angular.element('#menu').children().removeClass('active');
  angular.element('#menuMap').addClass('active');

  if( $('#menu').hasClass('in') ) {
    $("#menu").collapse('hide');
  }

  var latLngBounds = new google.maps.LatLngBounds();

  var mapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    mapTypeControl: true,
    panControl: true,
    zoomControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }
  };

  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

  $scope.facilities = FacilityResource.query({
    limit: "off",
    fields: "uuid,name,coordinates"
  }, function() {
    $scope.facilities = $scope.facilities.facilities;

    var infoWindow = new google.maps.InfoWindow();

    var markers = [];

    $.each($scope.facilities, function(idx) {
      if(this.coordinates.length == 2) {

        var latLng = new google.maps.LatLng(this.coordinates[1], this.coordinates[0]);
        latLngBounds.extend(latLng);

        var marker = new google.maps.Marker({
          position: latLng,
          map: $scope.map,
          title: this.name
        });

        markers.push(marker);

        var self = this;

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent("<div id='infoWindow'>" + "<b>" + self.name + "</b><br/>Latitude " + self.coordinates[1] + "<br/> Longitude " + self.coordinates[0] +
            "<br/><br/><a href='#!/facilities/edit/" + self.uuid + "'>More information</a></div>");
          infoWindow.open($scope.map,marker);
        });
      }
    });

    $scope.map.setCenter(latLngBounds.getCenter());
    $scope.map.fitBounds(latLngBounds);

    var markerCluster = new MarkerClusterer($scope.map, markers);
  });

  function refreshMap() {
    var mapHeight = $(window).height() - 52;
    angular.element('#map').height(mapHeight);
    google.maps.event.trigger($scope.map, 'resize');
  }

  refreshMap();

  $(window).resize(refreshMap);
}]);
