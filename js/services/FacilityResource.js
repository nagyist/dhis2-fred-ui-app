
fredApp.factory('FacilityResource', ['$resource', function( $resource ) {
  return $resource(baseUrl + '/api-fred/v1/facilities/:id', {'id': '@uuid'}, {
    query: {
      method: 'GET',
      isArray: false
    },
    update: {
      method: 'PUT',
      isArray: false
    }
  });
}]);
