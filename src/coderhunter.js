(function(angular) {

  angular
    .module('coderhunter', [
      'avoscloud',
      'ui.router',
      'ui.bootstrap'
    ])
    .config([
      'avoscloudProvider',
      '$stateProvider',
      '$urlRouterProvider',
      '$locationProvider',
       config]
    );

  function config(avoscloudProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
    var templatesPath = globalConfigs.templatesPath || 'templates';
    // AVOSCloud backend configs
    avoscloudProvider.config({
      'X-AVOSCloud-Application-Id': AVOSConfigs.appId,
      'X-AVOSCloud-Application-Key': AVOSConfigs.appKey
    });
    // init router objects
    var routers = defineRoutes(['archive', 'single', 'admin', '404', 'layout']);
    // routes configs
    $urlRouterProvider.otherwise("/404");
    // signup routes uri
    $stateProvider
      .state('layout',        routerMaker('', routers.layout))
      .state('layout.home',   routerMaker('/', routers.layout)) // alias router for layout
      .state('layout.pager',  routerMaker('/page/:page', routers.archive))
      .state('layout.single', routerMaker('/coder/:uri', routers.single))
      .state('layout.create', routerMaker('/create', routers.admin, appendTitleToRouter('新建')))
      .state('layout.update', routerMaker('/coder/:uri/update', routers.admin, appendTitleToRouter('更新')))
      .state('layout.404',    routerMaker('/404', routers['404']));

    // hashtag config
    $locationProvider
      .hashPrefix(globalConfigs.hashPrefix || '!');

    // html5 mode should also be supported by server side
    if (globalConfigs.html5Mode)
      $locationProvider.html5Mode(true);

    function defineRoutes(routes) {
      var routers = {};
      angular.forEach(routes, function(route) {
        routers[route] = {};
        routers[route].templateUrl = templatesPath + '/' + route + '.html';
        if (route !== '404')
          routers[route].controller = route;
        // define the LAYOUT router
        if (route === 'layout') {
          // define default sub-views of layout
          routers[route].views = {
            'layout': routers.layout,
            '@layout': routers.archive,
            '@layout.home': routers.archive
          }
        }
      });
      return routers;
    }

    function routerMaker(url, router, data) {
      var obj = angular.copy(router);
      obj.url = url;
      if (data && typeof(data) === 'object') 
        obj = angular.extend(obj, data);
      return obj;
    }

    function appendTitleToRouter(title) {
      return {
        data: {
          title: title
        }
      }
    }
  }

})(window.angular);
