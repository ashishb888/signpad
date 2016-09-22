(function() {
  angular.module('starter').controller('MenuCtrl', MenuCtrl);

  MenuCtrl.$inject = ['starterConfig', 'utilService', '$state', '$ionicPopup',
    'lsService', '$stateParams', '$rootScope',
    '$ionicActionSheet', '$auth', '$ionicSideMenuDelegate'
  ];

  function MenuCtrl(sConfig, utilService, $state, $ionicPopup, lsService,
    $stateParams, $rootScope, $ionicActionSheet, $auth,
    $ionicSideMenuDelegate) {
    // Variables section
    var logger = utilService.getLogger();
    logger.debug("MenuCtrl start");

    var mc = this;
    /*mc.dp = {};
    mc.dp.uri = "img/no-avatar.png";*/
    mc.fullName;
    mc.dp;
    mc.age;
    mc.height;
    mc.location;

    // Functions section
    mc.signout = signout;
    mc.getDP = getDP;
    mc.setDP = setDP;
    mc.signoutActionSheet = signoutActionSheet;
    mc.goToThisState = goToThisState;

    // Functions definations
    function goToThisState(state) {
      try {
        logger.debug("goToThisState function");

        $ionicSideMenuDelegate.toggleLeft();
        $state.go(state);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function signoutActionSheet() {
      logger.debug("signoutActionSheet function");

      var hideSignoutActionSheet = $ionicActionSheet.show({
        titleText: "Sign out",
        buttons: [{
          text: "<i class='txt-color icon ion-log-out'></i> Sign out"
        }, {
          text: "<i class='txt-color icon ion-close-circled'></i> Cancel"
        }],
        /*cancelText: 'Cancel',*/
        cancel: function() {
          logger.debug("Cancelled");
        },
        buttonClicked: function(index) {
          logger.debug("Button clicked", index);

          switch (index) {
            case 0:
              localStorage.clear();
              //lsService.set("isSignedIn", false);
              $auth.logout()

              $state.go(sConfig.appStates.signin);
              break;
            case 1:
              hideSignoutActionSheet();
              break;
          }
          return true;
        }
      });
    }

    $rootScope.$on('setBanner', function(event, data) {
      try {
        logger.debug("setBanner function");

        mc.fullName = lsService.get("fullName");
        mc.dp = lsService.get("dp");
        mc.userId = lsService.get("userId");

        if (lsService.get("userLocation"))
          mc.location = JSON.parse(lsService.get("userLocation"));

        if (lsService.get("dob"))
          mc.age = moment().diff(lsService.get("dob"), "years");

        // var heightLocal = JSON.parse(lsService.get("height"));

        if (lsService.get("userHeight"))
          mc.height = JSON.parse(lsService.get("userHeight"));

      } catch (exception) {
        logger.error("exception: " + exception);
      }
    });

    function setDP() {
      try {
        logger.debug("setDP function");

        mc.fullName = lsService.get("fullName");
        mc.dp = lsService.get("dp");
        mc.userId = lsService.get("userId");
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function getDP() {
      try {
        logger.debug("getDP function");

        var promise = imagesService.getImgs(sConfig.picType.dp, lsService.get(
          "_id"));
        promise.then(function(sucResp) {
          try {
            var resp = sucResp.data;
            if (resp.status !== sConfig.httpStatus.SUCCESS) {
              utilService.toastMessage(resp.messages);
              return;
            }

            if (resp.data.images && resp.data.images.length > 0) {
              var dp = resp.data.images[0];
              if (dp.base64) {
                $rootScope.rootDP = dp.base64;
              }
            }

          } catch (exception) {
            logger.error("exception: " + exception);
          }
        }, function(errResp) {});
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function signout() {
      try {
        logger.debug("signout function");
        var confirmPopup = $ionicPopup.confirm({
          title: 'Sign out',
          template: 'Are you sure you want to signout?'
        });

        confirmPopup.then(function(res) {
          if (res) {
            logger.debug("Signed out");
            localStorage.clear();
            lsService.set("isSignedIn", false);

            // $rootScope.rootDP = undefined;
            $state.go(sConfig.appStates.signin);
          }
        });
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function bootstrap() {
      try {
        logger.debug("bootstrap function");

        switch ($stateParams.functionNm) {
          case "getDP":
            // mc.getDP();
            break;
          default:
            $rootScope.$broadcast("setBanner");
        }
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }
    bootstrap();

    logger.debug("MenuCtrl end");
  }
})();
