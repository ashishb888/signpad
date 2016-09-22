(function() {
  angular.module('starter').factory('signinService', signinService);
  signinService.$inject = ['$http', 'utilService', 'starterConfig', 'lsService'];
  function signinService($http, utilService, sConfig, lsService) {
    var logger = utilService.getLogger();
    var ss = this;

    ss.signin = signin;
    ss.getFlags = getFlags;

    function getFlags() {
      logger.debug("getFlags() service");
      return $http.get(sConfig.ws + '/flags', lsService.get("httpConfig") ? JSON.parse(lsService.get("httpConfig")) : sConfig.httpReq.config);
    }

    function signin(req) {
      logger.debug("signin() service");
      return $http.post(sConfig.ws + '/signin', req, lsService.get("httpConfig") ? JSON.parse(lsService.get("httpConfig")) : sConfig.httpReq.config);
    }

    return ss;
  }
})();
