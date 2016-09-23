(function() {
  angular.module('starter').factory('panService', panService);
  panService.$inject = ['$http', 'utilService', 'starterConfig', 'lsService'];
  function panService($http, utilService, sConfig, lsService) {
    var logger = utilService.getLogger();
    var ps = this;

    ps.verifyPAN = verifyPAN;

    function verifyPAN(req) {
      logger.debug("verifyPAN() service");
      // return $http.get(sConfig.ws + '/register', req, lsService.get("httpConfig") ? JSON.parse(lsService.get("httpConfig")) : sConfig.httpReq.config);
      return $http.get('/app/pan/pan.json', lsService.get("httpConfig") ? JSON.parse(lsService.get("httpConfig")) : sConfig.httpReq.config);
    }

    return ps;
  }
})();
