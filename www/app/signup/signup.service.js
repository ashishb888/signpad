(function() {
  angular.module('starter').factory('signupService', signupService);
  signupService.$inject = ['$http', 'utilService', 'starterConfig', 'lsService'];
  function signupService($http, utilService, sConfig, lsService) {
    var logger = utilService.getLogger();
    var ss = this;

    ss.signup = signup;

    function signup(req) {
      logger.debug("signup() service");
      //return Ionic.Auth.signup(req);
      return $http.post(sConfig.ws + '/users', req, lsService.get("httpConfig") ? JSON.parse(lsService.get("httpConfig")) : sConfig.httpReq.config);
    }

    return ss;
  }
})();
