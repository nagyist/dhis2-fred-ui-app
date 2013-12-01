
fredApp.factory('OrganisationUnitResource', ['$resource', function( $resource ) {
  return $resource(baseUrl + '/api/organisationUnits/:id', {'id': '@id'}, {
    query: {
      method: 'GET',
      isArray: false
    }
  });
}]);
