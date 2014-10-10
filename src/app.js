(function(angular) {

  angular
    .module('coderhunter', ['avoscloud'])
    .config(['avoscloudProvider', config]);

  function config(avoscloudProvider) {
    avoscloudProvider.config({
      'X-AVOSCloud-Application-Id': AVOSConfigs.appId,
      'X-AVOSCloud-Application-Key': AVOSConfigs.appKey
    });
  }

})(window.angular);
