;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')
    .controller('archive', [
      '$scope', '$state', '$rootScope', 'avoscloud'
      archiveCtrler
    ]);

  function archiveCtrler($scope, $state, $rootScope, avoscloud) {
    $scope.itemsPerPage = 10;
    $scope.currentPage = parseNumber($state.params.page) || 1;
    $rootScope.$emit('updateMeta', $scope.configs.name);
    console.log(avoscloud);

    // Read coders from cache
    if ($scope.coders && $scope.coders.length > 0) return;
    
    // TODO: remove this ugly hack
    if ($state.params.page) {
      var lock = true;
      var currentPage = $scope.currentPage;
    }

    // Read fresh data from AVOSCloud
    // $duoshuo.get('threads/list', {
    //   page: $scope.currentPage,
    //   limit: $scope.itemsPerPage,
    //   with_content: 1
    // }, function(err, result, res) {
    //   if ($state.params.page)
    //     lock = false;
    //   if (err)
    //     return $scope.addAlert('获取信息失败，请重试', 'danger');
    //   if (result.length === 0)
    //     return $state.go('layout.404');
    //   $scope.coders = result || [];
    //   $scope.totalItems = res.cursor.total;
    //   if ($state.params.page) $scope.currentPage = currentPage;
    //   return;
    // }, function(err) {
    //   return $state.go('layout.404');
    // });

    // when page changed, go => /#/page/currentPage
    // why the fucking event was trigged twice and return `1` the second time ?!
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
