(function() {
  angular.module('starter').controller('RetryCtrl', RetryCtrl);

  RetryCtrl.$inject = ['starterConfig', 'utilService', '$state',
    '$stateParams', '$ionicHistory'
  ];

  function RetryCtrl(sConfig, utilService, $state, $stateParams,
    $ionicHistory) {
    // Variables section
    var logger = utilService.getLogger();
    logger.debug("RetryCtrl start");

    var rc = this;
    rc.noConnMsg = sConfig.msgs.noConnMsg;

    // Functions section
    rc.retry = retry;

    // Functions definations
    function retry() {
      try {
        logger.debug("retry function");

        if (!utilService.isAppOnlineService() && $ionicHistory.currentStateName() ==
          sConfig.appStates.retry) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $state.go(sConfig.appStates.menu_db);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    logger.debug("RetryCtrl end");
  }
})();
