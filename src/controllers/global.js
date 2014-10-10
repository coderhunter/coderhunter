;(function(angular) {
  'use strict';
  
  angular
    .module('coderhunter')
    .controller('global', ['$scope', globalCtrler]);

  function globalCtrler($scope) {
    if (!globalConfigs)
      return console.error(new Error('缺少必要的配置文件!'));
    $scope.configs = globalConfigs;
  }
})(window.angular);
