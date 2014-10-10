;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')
    .controller('meta', ['$scope', '$rootScope', metaCtrler]);

  function metaCtrler($scope, $rootScope) {
    $scope.title = 'Coder Hunter';
    $scope.description = '从靠谱的圈子发现靠谱的人';

    $rootScope.$on('updateMeta', function(eve, data){
      if (typeof(data) === 'string')
        return $scope.title = data;
      angular.forEach(data, function(v, k){
        $scope[k] = v;
      });
    });
  }
})(window.angular);
