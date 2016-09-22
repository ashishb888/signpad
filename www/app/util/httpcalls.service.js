(function() {
  angular.module('starter').factory('httpCallsService', httpCallsService);
  httpCallsService.$inject = ['$http', 'utilService', 'starterConfig', 'lsService'];
  function httpCallsService($http, utilService, sConfig, lsService) {
    var logger = utilService.getLogger();
    var hcs = this;

    logger.debug("httpCallsService service");

    hcs.updateLastActive = updateLastActive;
    hcs.initApp = initApp;

    function updateLastActive() {
      logger.debug("updateLastActive() service");
      $http.post(sConfig.ws + '/lastactive', lsService.get("httpConfig") ? JSON.parse(lsService.get("httpConfig")) : sConfig.httpReq.config)
      .then(function(sucResp) {
      }).catch(function(errResp) {
      });
    }

    function initApp() {
      logger.debug("initApp() service");
      $http.get(sConfig.ws + '/initapp', lsService.get("httpConfig") ? JSON.parse(lsService.get("httpConfig")) : sConfig.httpReq.config)
      .then(function(sucResp) {
        var resp = sucResp.data;
      }).catch(function(errResp) {
      });
    }

    return hcs;
  }
})();
