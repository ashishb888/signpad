(function() {
  angular.module('starter').controller('SignupCtrl', SignupCtrl);

  SignupCtrl.$inject = ['$state', 'starterConfig', 'utilService',
    'signupService', '$auth', '$ionicHistory', 'lsService', '$rootScope'
  ];

  function SignupCtrl($state, sConfig, utilService, signupService, $auth,
    $ionicHistory, lsService, $rootScope) {
    // Variables section
    var logger = utilService.getLogger();

    logger.debug("SignupCtrl start");

    // Variables section
    var sc = this;

    sc.sf = {};
    sc.genderArr = ["Male", "Female"];
    sc.sf.gender = sc.genderArr[0];

    // Functions section
    sc.signup = signup;

    function signup() {
      try {
        logger.debug("signup function");

        if (!utilService.isAppOnlineService()) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

        if (sc.sf.password !== sc.sf.rePassword) {
          utilService.toastMessage("Password mismatches");
          return;
        }
        var req = {};
        req.data = sc.sf;

        /*var promise = signupService.signup(req);
        promise.then(function(sucResp){
            try {
                var resp = sucResp.data;
                if (resp.status !== sConfig.httpStatus.SUCCESS) {
                    utilService.appAlert(resp.messages);
                    return;
                }

                utilService.toastMessage(resp.messages, sConfig.appStates.signin, sConfig.msgs.success);
                $state.go(sConfig.appStates.signin);
                //utilService.appAlert(resp.messages, sConfig.appStates.signin, sConfig.msgs.success);
            } catch (exception) {
                logger.error("exception: " + exception);
            }
        }, function(errResp){
        });*/

        $auth.signup(req).then(function(sucResp) {
          var resp = sucResp.data;
          if (resp.status !== sConfig.httpStatus.SUCCESS) {
            utilService.toastMessage(resp.messages);
            return;
          }

          $auth.setToken(resp.token);

          lsService.set('jwtToken', JSON.stringify($auth.getPayload()));
          lsService.set("_id", resp.data._id);
          utilService.toastMessage(resp.messages);
          lsService.set("userId", resp.data.userId);
          lsService.set("fullName", resp.data.basicDetails.fullName);
          lsService.set("userGender", resp.data.basicDetails.gender);

          $rootScope.$broadcast("initApp");

          utilService.toastMessage(resp.messages, null, sConfig.msgs.success);

          $ionicHistory.nextViewOptions({
            disableBack: true
          });

          $state.go(sConfig.appStates.welcome);
        }).catch(function(errResp) {});
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    logger.debug("SignupCtrl end");
  }
})();
