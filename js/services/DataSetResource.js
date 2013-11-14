
fredApp.factory('DataSetResource', ['$resource', function( $resource ) {
  return $resource(baseUrl + '/api/dataSets/:id', {'id': '@id'}, {
    query: {
      method: 'GET',
      isArray: true,
      transformResponse: function(data) {
        return JSON.parse(data).dataSets;
      }
    }
  });
}]);
