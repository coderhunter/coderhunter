;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')
    .controller('archive', [
      '$scope', 
      '$state', 
      '$rootScope', 
      'avoscloud',
      archiveCtrler
    ]);

  function archiveCtrler($scope, $state, $rootScope, avoscloud) {
    $scope.itemsPerPage = 10;
    $scope.currentPage = parseNumber($state.params.page) || 1;
    // $rootScope.$emit('updateMeta', $scope.configs.name);

    // Read coders from cache
    if ($scope.coders && $scope.coders.length > 0) return;
    
    // TODO: remove this ugly hack
    if ($state.params.page) {
      var lock = true;
      var currentPage = $scope.currentPage;
    }

    // Read fresh data from AVOSCloud
    // Fetch today's coders
    avoscloud.classes.get({
      className: 'coder'
    }, function(data) {
      if ($state.params.page)
        lock = false;
      console.log(data);
      $scope.coders = data;
      if ($state.params.page) $scope.currentPage = currentPage;
      return;
    }, function(err){
      if (err.status && err.status === 404)
        $state.go('layout.404');
    });

    // When page changed, go => /#/page/currentPage
    // Why the fucking event was trigged twice and return `1` the second time ?!
    $scope.pageChanged = function() {
      if (lock) return;
      $state.go('layout.pager', {
        page: $scope.currentPage
      });
    };

    function parseNumber(str) {
      if (str && !isNaN(parseInt(str)))
        return parseInt(str);
      return false;
    }
  }
})(window.angular);
