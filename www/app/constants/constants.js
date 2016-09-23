angular.module('starter').constant('starterConfig', (function() {
  console.debug("env: " + env);

  var ws;
  var httpReq = {
    timeout: 60000,
    config: {
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
  };
  var msgs = {
    globalCommonError: "Oops. Something went wrong. Please try again later.",
    noConnMsg: "Unable to reach server. Please check your internet connection and try again.",
    connMsg: "Connected to internet",
    error: "Error",
    success: "Success"
  };
  var httpStatus = {
    ERROR: "ERROR",
    SUCCESS: "SUCCESS"
  };
  var appStates = {
    home: "home",
    signup: "signup",
    retry: "retry",
    register: "register",
    pan: "pan"
  };
  var screenTitles = {
    home: "Home",
    signup: "Sign up"
  };
  var httpKeys = {
    req: "req",
    resp: "resp",
    respErr: "respErr"
  };
  var modal = {
    animation: "slide-in-up"
  };
  var offlineStates = [appStates.home, appStates.signup];

  // Photos properties
  var picSrc = {
    camera: "camera",
    gallery: "gallery"
  };
  var picProps = {
    quality: 50,
    width: 400,
    height: 400
  };
  var toastMsgs = {
    appExit: "Press BACK again to exit."
  };
  var tapToExitStates = [appStates.pan];
  var onlineState = appStates.pan;

  switch (env) {
    case envLs.prod:
      ws = urls.prod;
      break;
    case envLs.uat:
      ws = urls.uat;
      break;
    case envLs.dev:
      ws = urls.dev;
      break;
    case envLs.local:
      ws = urls.local;
      break;
    default:
      ws = urls.prod;
  }

  return {
    ws: ws,
    msgs: msgs,
    appStates: appStates,
    httpKeys: httpKeys,
    httpStatus: httpStatus,
    screenTitles: screenTitles,
    httpReq: httpReq,
    modal: modal,
    picSrc: picSrc,
    picProps: picProps,
    toastMsgs: toastMsgs,
    offlineStates: offlineStates,
    tapToExitStates: tapToExitStates,
    onlineState: onlineState
  };

})());
