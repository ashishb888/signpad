(function() {
  angular.module('starter').controller('RegisterCtrl', RegisterCtrl);

  RegisterCtrl.$inject = ['$state', 'starterConfig', 'utilService',
    '$ionicHistory', 'lsService', '$rootScope', 'cameraService',
    '$ionicActionSheet', '$scope', '$ionicLoading', '$timeout'
  ];

  function RegisterCtrl($state, sConfig, utilService,
    $ionicHistory, lsService, $rootScope, cameraService, $ionicActionSheet,
    $scope, $ionicLoading, $timeout) {
    // Variables section
    var logger = utilService.getLogger();

    logger.debug("RegisterCtrl start");

    // Variables section
    var rc = this;

    rc.rf = {};
    rc.rf.chequeImgBase64;
    rc.rf.signedChequeImgBase64;
    rc.isChequeImg = false;
    rc.isSigned = false;

    // Canvas objects
    var chequeSignaturePad;
    var canvas;

    // Functions section
    rc.register = register;
    rc.imgsActionSheet = imgsActionSheet;
    rc.clearCanvas = clearCanvas;
    rc.saveCanvas = saveCanvas;
    rc.imgToCanvas = imgToCanvas;
    rc.clearChequeCanvas = clearChequeCanvas;
    rc.saveChequeCanvas = saveChequeCanvas;
    rc.initCanvas = initCanvas;
    rc.redirectToPG = redirectToPG;

    // Local functions
    var addImgs = addImgs;
    var getImages = getImages;

    // Functions definations
    function redirectToPG() {
      try {
        logger.debug("redirectToPG function");

        $ionicLoading.show({
          template: '<ion-spinner icon="lines"></ion-spinner>'
        });

        $timeout(function() {
          $ionicLoading.hide();
          utilService.toastMessage("Redirecting to payment gateway");
          $state.go(sConfig.appStates.pg);
        }, 2000);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function initCanvas() {
      try {
        logger.debug("initCanvas function");
        canvas = document.getElementById("signChequeCanvas");
        chequeSignaturePad = new SignaturePad(canvas);
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }
    rc.initCanvas();

    function clearChequeCanvas() {
      logger.debug("clearChequeCanvas function");

      chequeSignaturePad.clear();
    }

    function saveChequeCanvas() {
      logger.debug("saveChequeCanvas function");
      rc.isSigned = true;
      rc.rf.signedChequeImgBase64 = chequeSignaturePad.toDataURL("image/png");
    }


    function imgToCanvas(base64) {
      try {
        logger.debug("imgToCanvas function");

        canvas = document.getElementById("signChequeCanvas");
        /*var img = new Image(); // Create new img element
        var ctx = canvas.getContext("2d");
        img.src = "data:image/jpg;base64," + base64;

        img.onload = function() {
          chequeSignaturePad = new SignaturePad(canvas);   
          ctx.drawImage(img, 0, 0);   
        };*/

        /*var ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);*/

        /*var img = new Image(); // Create new img element
        img.width = 200;
        img.height = 200;
        canvas.width = 200;
        var ctx = canvas.getContext("2d");

        img.onload = function() {
          canvas.height = canvas.width * (img.height / img.width);

          /// step 1 - resize to 50%
          var oc = document.createElement('canvas'),
            octx = oc.getContext('2d');

          oc.width = img.width * 0.5;
          oc.height = img.height * 0.5;
          octx.drawImage(img, 0, 0, oc.width, oc.height);

          /// step 2 - resize 50% of step 1
          octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

          /// step 3, resize to final size
          ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
            0, 0, canvas.width, canvas.height);

          chequeSignaturePad = new SignaturePad(canvas);   
        };
        img.src = "data:image/jpg;base64," + base64;*/

        chequeSignaturePad = new SignaturePad(canvas);
        chequeSignaturePad.fromDataURL("data:image/jpg;base64," + base64);
        //resizeCanvas();
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function register() {
      try {
        logger.debug("register function");

        if (!utilService.isAppOnlineService()) {
          utilService.toastMessage(sConfig.msgs.noConnMsg);
          return;
        }

      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function addImgs(type, srcType) {
      try {
        logger.debug("addImgs function");

        var promise = getImages(srcType, 1);
        promise.then(function(imageData) {
          logger.debug("imageData: " + JSON.stringify(imageData));
          utilService.base64(imageData.uri[0])
            .then(function(sucResp) {
              rc.isChequeImg = true;
              rc.rf.chequeImgBase64 = sucResp;
              // rc.imgToCanvas(sucResp);
            }, function(errResp) {
              logger.error("errResp: " + JSON.stringify(errResp));
            });
        });

      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function getImages(srcType, nImgs) {
      try {
        logger.debug("getImages function");

        switch (srcType) {
          case sConfig.picSrc.camera:
            return cameraService.clickImage(srcType);
            break;
          case sConfig.picSrc.gallery:
            return cameraService.selectImage(nImgs);
            break;
          default:
            return cameraService.clickImage(srcType);
        }
      } catch (exception) {
        logger.error("exception: " + exception);
      }
    }

    function imgsActionSheet() {
      logger.debug("imgsActionSheet function");

      var hideImgsActionSheet = $ionicActionSheet.show({
        titleText: "Choose source type",
        buttons: [{
          text: "<i class='txt-color icon ion-camera'></i> Camera"
        }, {
          text: "<i class='txt-color icon ion-images'></i> Gallary"
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
              addImgs('', sConfig.picSrc.camera);
              break;
            case 1:
              addImgs('', sConfig.picSrc.gallery);
              break;
            case 2:
              hideImgsActionSheet();
              break;
          }
          return true;
        }
      });
    }

    /*var signaturePad;
    var img = new Image(); // Create new img element
    var canvas = document.getElementById('signatureCanvas');
    var ctx = canvas.getContext("2d");*/
    /*img.src = '../img/edelweiss-logo.jpg'; // Set source path

    img.onload = function() {
      signaturePad = new SignaturePad(canvas);   
      ctx.drawImage(img, 10, 10);   
    };*/

    /*signaturePad = new SignaturePad(canvas); */

    function clearCanvas() {
      logger.debug("saveCanvas function");

      signaturePad.clear();
    }

    function saveCanvas() {
      logger.debug("saveCanvas function");

      rc.testImg = signaturePad.toDataURL("image/png");
    }

    function resizeCanvas() {
      var ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      chequeSignaturePad.clear(); // otherwise isEmpty() might return incorrect value
    }

    window.addEventListener("resize", resizeCanvas);

    logger.debug("RegisterCtrl end");
  }
})();
