(function() {
  angular.module('starter').factory('registerService', registerService);
  registerService.$inject = ['$http', 'utilService', 'starterConfig', 'lsService'];
  function registerService($http, utilService, sConfig, lsService) {
    var logger = utilService.getLogger();
    var rs = this;

    rs.register = register;

    function register(req) {
      logger.debug("register() service");
      //return Ionic.Auth.signup(req);
      return $http.post(sConfig.ws + '/register', req, lsService.get("httpConfig") ? JSON.parse(lsService.get("httpConfig")) : sConfig.httpReq.config);
    }

    return ss;
  }
})();
