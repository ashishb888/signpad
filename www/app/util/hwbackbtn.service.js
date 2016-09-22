(function() {
  angular.module('starter').service('hwBackBtnService', hwBackBtnService);
  hwBackBtnService.$inject = ['$ionicPlatform', 'utilService',
    '$cordovaToast', '$timeout', '$ionicHistory', 'starterConfig', '$state'
  ];

  function hwBackBtnService($ionicPlatform, utilService, $cordovaToast,
    $timeout, $ionicHistory, sConfig, $state) {
    var logger = utilService.getLogger();
    this.HWBackbtnDeregister = undefined;

    this.disableHWBackBtn = function() {
      logger.debug("disableHWBackBtn() service");
      this.HWBackbtnDeregister = $ionicPlatform.registerBackButtonAction(
        function(e) {
          e.preventDefault();
          return false;
        }, 100);
    }

    this.enableHWBackBtn = function() {
      logger.debug("enableHWBackBtn() service");
      if (this.HWBackbtnDeregister !== undefined) {
        this.HWBackbtnDeregister();
        this.HWBackbtnDeregister = undefined;
      }
    }

    this.tapToExit = function() {
      logger.debug("tapToExit() service");

      var backBtnCnt = 0;

      $ionicPlatform.registerBackButtonAction(function(e) {
        var currentState = $ionicHistory.currentStateName();

        if (currentState == sConfig.appStates.signin || currentState ==
          sConfig.appStates.menu_db) {
          if (backBtnCnt == 0) {
            backBtnCnt++;
            $cordovaToast.showShortBottom(sConfig.toastMsgs.appExit).then(
              function(success) {
                logger.debug("cordovaToast: " + success);
              },
              function(error) {
                logger.error("cordovaToast: " + error);
              });

            $timeout(function() {
              backBtnCnt = 0;
            }, 2000);
          } else {
            navigator.app.exitApp();
          }
        } else {
          $ionicHistory.goBack();
        }
      }, 100);
    }

    return this;
  }
})();
