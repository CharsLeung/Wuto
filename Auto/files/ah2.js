'use strict';

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _teen_process = require('teen_process');

var _asyncbox = require('asyncbox');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _appiumSupport = require('appium-support');

var _appiumAndroidIme = require('appium-android-ime');

var _ioAppiumSettings = require('io.appium.settings');

var _appiumUnlock = require('appium-unlock');

var _appiumAndroidBootstrap = require('appium-android-bootstrap');

var _appiumAndroidBootstrap2 = _interopRequireDefault(_appiumAndroidBootstrap);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _appiumAdb = require('appium-adb');

var _appiumAdb2 = _interopRequireDefault(_appiumAdb);

var _unlockHelpers = require('./unlock-helpers');

var _unlockHelpers2 = _interopRequireDefault(_unlockHelpers);

var PACKAGE_INSTALL_TIMEOUT = 90000; // milliseconds
var CHROME_BROWSER_PACKAGE_ACTIVITY = {
  chrome: {
    pkg: 'com.android.chrome',
    activity: 'com.google.android.apps.chrome.Main'
  },
  chromium: {
    pkg: 'org.chromium.chrome.shell',
    activity: '.ChromeShellActivity'
  },
  chromebeta: {
    pkg: 'com.chrome.beta',
    activity: 'com.google.android.apps.chrome.Main'
  },
  browser: {
    pkg: 'com.android.browser',
    activity: 'com.android.browser.BrowserActivity'
  },
  'chromium-browser': {
    pkg: 'org.chromium.chrome',
    activity: 'com.google.android.apps.chrome.Main'
  },
  'chromium-webview': {
    pkg: 'org.chromium.webview_shell',
    activity: 'org.chromium.webview_shell.WebViewBrowserActivity'
  },
  'default': {
    pkg: 'com.android.chrome',
    activity: 'com.google.android.apps.chrome.Main'
  }
};
var SETTINGS_HELPER_PKG_ID = 'io.appium.settings';
var SETTINGS_HELPER_PKG_ACTIVITY = ".Settings";
var UNLOCK_HELPER_PKG_ID = 'io.appium.unlock';
var UNLOCK_HELPER_PKG_ACTIVITY = ".Unlock";
var UNICODE_IME_PKG_ID = 'io.appium.android.ime';

var helpers = {};

helpers.createBaseADB = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var
  // filter out any unwanted options sent in
  // this list should be updated as ADB takes more arguments
  javaVersion, adbPort, suppressKillServer, remoteAdbHost, clearDeviceLogsOnStart, adbExecTimeout;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        javaVersion = opts.javaVersion;
        adbPort = opts.adbPort;
        suppressKillServer = opts.suppressKillServer;
        remoteAdbHost = opts.remoteAdbHost;
        clearDeviceLogsOnStart = opts.clearDeviceLogsOnStart;
        adbExecTimeout = opts.adbExecTimeout;
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(_appiumAdb2['default'].createADB({
          javaVersion: javaVersion,
          adbPort: adbPort,
          suppressKillServer: suppressKillServer,
          remoteAdbHost: remoteAdbHost,
          clearDeviceLogsOnStart: clearDeviceLogsOnStart,
          adbExecTimeout: adbExecTimeout
        }));

      case 8:
        return context$1$0.abrupt('return', context$1$0.sent);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.parseJavaVersion = function (stderr) {
  var lines = stderr.split("\n");
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(lines), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var line = _step.value;

      if (new RegExp(/(java|openjdk) version/).test(line)) {
        return line.split(" ")[2].replace(/"/g, '');
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return null;
};

helpers.getJavaVersion = function callee$0$0() {
  var logVersion = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

  var _ref, stderr, javaVer;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _teen_process.exec)('java', ['-version']));

      case 2:
        _ref = context$1$0.sent;
        stderr = _ref.stderr;
        javaVer = helpers.parseJavaVersion(stderr);

        if (!(javaVer === null)) {
          context$1$0.next = 7;
          break;
        }

        throw new Error("Could not get the Java version. Is Java installed?");

      case 7:
        if (logVersion) {
          _logger2['default'].info('Java version is: ' + javaVer);
        }
        return context$1$0.abrupt('return', javaVer);

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.prepareEmulator = function callee$0$0(adb, opts) {
  var avd, avdArgs, language, locale, avdLaunchTimeout, avdReadyTimeout, avdName, runningAVD;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        avd = opts.avd;
        avdArgs = opts.avdArgs;
        language = opts.language;
        locale = opts.locale;
        avdLaunchTimeout = opts.avdLaunchTimeout;
        avdReadyTimeout = opts.avdReadyTimeout;

        if (avd) {
          context$1$0.next = 8;
          break;
        }

        throw new Error("Cannot launch AVD without AVD name");

      case 8:
        avdName = avd.replace('@', '');
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.getRunningAVD(avdName));

      case 11:
        runningAVD = context$1$0.sent;

        if (!(runningAVD !== null)) {
          context$1$0.next = 21;
          break;
        }

        if (!(avdArgs && avdArgs.toLowerCase().indexOf("-wipe-data") > -1)) {
          context$1$0.next = 19;
          break;
        }

        _logger2['default'].debug('Killing \'' + avdName + '\' because it needs to be wiped at start.');
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(adb.killEmulator(avdName));

      case 17:
        context$1$0.next = 21;
        break;

      case 19:
        _logger2['default'].debug("Not launching AVD because it is already running.");
        return context$1$0.abrupt('return');

      case 21:
        avdArgs = this.prepareAVDArgs(opts, adb, avdArgs);
        context$1$0.next = 24;
        return _regeneratorRuntime.awrap(adb.launchAVD(avd, avdArgs, language, locale, avdLaunchTimeout, avdReadyTimeout));

      case 24:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.prepareAVDArgs = function (opts, adb, avdArgs) {
  var args = avdArgs ? [avdArgs] : [];
  if (!_lodash2['default'].isUndefined(opts.networkSpeed)) {
    var networkSpeed = this.ensureNetworkSpeed(adb, opts.networkSpeed);
    args.push('-netspeed', networkSpeed);
  }
  if (opts.isHeadless) {
    args.push('-no-window');
  }
  return args.join(' ');
};

helpers.ensureNetworkSpeed = function (adb, networkSpeed) {
  if (_lodash2['default'].values(adb.NETWORK_SPEED).indexOf(networkSpeed) !== -1) {
    return networkSpeed;
  }
  _logger2['default'].warn('Wrong network speed param ' + networkSpeed + ', using default: full. Supported values: ' + _lodash2['default'].values(adb.NETWORK_SPEED));
  return adb.NETWORK_SPEED.FULL;
};

helpers.ensureDeviceLocale = function callee$0$0(adb, language, country) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(!_lodash2['default'].isString(language) && !_lodash2['default'].isString(country))) {
          context$1$0.next = 4;
          break;
        }

        _logger2['default'].warn('setDeviceLanguageCountry requires language or country.');
        _logger2['default'].warn('Got language: \'' + language + '\' and country: \'' + country + '\'');
        return context$1$0.abrupt('return');

      case 4:
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(adb.setDeviceLanguageCountry(language, country));

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(adb.ensureCurrentLocale(language, country));

      case 8:
        if (context$1$0.sent) {
          context$1$0.next = 10;
          break;
        }

        throw new Error('Failed to set language: ' + language + ' and country: ' + country);

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.getDeviceInfoFromCaps = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var adb, udid, emPort, devices, availDevicesStr, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, device, deviceOS;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(helpers.createBaseADB(opts));

      case 2:
        adb = context$1$0.sent;
        udid = opts.udid;
        emPort = null;

        if (!opts.avd) {
          context$1$0.next = 12;
          break;
        }

        context$1$0.next = 8;
        return _regeneratorRuntime.awrap(helpers.prepareEmulator(adb, opts));

      case 8:
        udid = adb.curDeviceId;
        emPort = adb.emulatorPort;
        context$1$0.next = 64;
        break;

      case 12:
        // no avd given. lets try whatever's plugged in devices/emulators
        _logger2['default'].info("Retrieving device list");
        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(adb.getDevicesWithRetry());

      case 15:
        devices = context$1$0.sent;

        if (!udid) {
          context$1$0.next = 21;
          break;
        }

        if (!_lodash2['default'].includes(_lodash2['default'].map(devices, 'udid'), udid)) {
          _logger2['default'].errorAndThrow('Device ' + udid + ' was not in the list ' + 'of connected devices');
        }
        emPort = adb.getPortFromEmulatorString(udid);
        context$1$0.next = 64;
        break;

      case 21:
        if (!opts.platformVersion) {
          context$1$0.next = 62;
          break;
        }

        opts.platformVersion = ('' + opts.platformVersion).trim();

        // a platform version was given. lets try to find a device with the same os
        _logger2['default'].info('Looking for a device with Android \'' + opts.platformVersion + '\'');

        // in case we fail to find something, give the user a useful log that has
        // the device udids and os versions so they know what's available
        availDevicesStr = [];
        _iteratorNormalCompletion2 = true;
        _didIteratorError2 = false;
        _iteratorError2 = undefined;
        context$1$0.prev = 28;
        _iterator2 = _getIterator(devices);

      case 30:
        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
          context$1$0.next = 44;
          break;
        }

        device = _step2.value;
        context$1$0.next = 34;
        return _regeneratorRuntime.awrap(adb.setDeviceId(device.udid));

      case 34:
        context$1$0.next = 36;
        return _regeneratorRuntime.awrap(adb.getPlatformVersion());

      case 36:
        deviceOS = context$1$0.sent;

        // build up our info string of available devices as we iterate
        availDevicesStr.push(device.udid + ' (' + deviceOS + ')');

        // we do a begins with check for implied wildcard matching
        // eg: 4 matches 4.1, 4.0, 4.1.3-samsung, etc

        if (!(deviceOS.indexOf(opts.platformVersion) === 0)) {
          context$1$0.next = 41;
          break;
        }

        udid = device.udid;
        return context$1$0.abrupt('break', 44);

      case 41:
        _iteratorNormalCompletion2 = true;
        context$1$0.next = 30;
        break;

      case 44:
        context$1$0.next = 50;
        break;

      case 46:
        context$1$0.prev = 46;
        context$1$0.t0 = context$1$0['catch'](28);
        _didIteratorError2 = true;
        _iteratorError2 = context$1$0.t0;

      case 50:
        context$1$0.prev = 50;
        context$1$0.prev = 51;

        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }

      case 53:
        context$1$0.prev = 53;

        if (!_didIteratorError2) {
          context$1$0.next = 56;
          break;
        }

        throw _iteratorError2;

      case 56:
        return context$1$0.finish(53);

      case 57:
        return context$1$0.finish(50);

      case 58:

        // we couldn't find anything! quit
        if (!udid) {
          _logger2['default'].errorAndThrow('Unable to find an active device or emulator ' + ('with OS ' + opts.platformVersion + '. The following ') + 'are available: ' + availDevicesStr.join(', '));
        }

        emPort = adb.getPortFromEmulatorString(udid);
        context$1$0.next = 64;
        break;

      case 62:
        // a udid was not given, grab the first device we see
        udid = devices[0].udid;
        emPort = adb.getPortFromEmulatorString(udid);

      case 64:

        _logger2['default'].info('Using device: ' + udid);
        return context$1$0.abrupt('return', { udid: udid, emPort: emPort });

      case 66:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[28, 46, 50, 58], [51,, 53, 57]]);
};

// returns a new adb instance with deviceId set
helpers.createADB = function callee$0$0() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var udid, emPort, adb;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        udid = opts.udid;
        emPort = opts.emPort;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(helpers.createBaseADB(opts));

      case 4:
        adb = context$1$0.sent;

        adb.setDeviceId(udid);
        if (emPort) {
          adb.setEmulatorPort(emPort);
        }

        return context$1$0.abrupt('return', adb);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.validatePackageActivityNames = function (opts) {
  var _arr = ['appPackage', 'appActivity', 'appWaitPackage', 'appWaitActivity'];

  for (var _i = 0; _i < _arr.length; _i++) {
    var key = _arr[_i];
    var _name = opts[key];
    if (!_name) {
      continue;
    }

    var match = /([^\w.*,])+/.exec(_name);
    if (!match) {
      continue;
    }

    _logger2['default'].warn('Capability \'' + key + '\' is expected to only include latin letters, digits, underscore, dot, comma and asterisk characters.');
    _logger2['default'].warn('Current value \'' + _name + '\' has non-matching character at index ' + match.index + ': \'' + _name.substring(0, match.index + 1) + '\'');
  }
};

helpers.getLaunchInfo = function callee$0$0(adb, opts) {
  var app, appPackage, appActivity, appWaitPackage, appWaitActivity, _ref2, apkPackage, apkActivity;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        app = opts.app;
        appPackage = opts.appPackage;
        appActivity = opts.appActivity;
        appWaitPackage = opts.appWaitPackage;
        appWaitActivity = opts.appWaitActivity;

        if (app) {
          context$1$0.next = 8;
          break;
        }

        _logger2['default'].warn("No app sent in, not parsing package/activity");
        return context$1$0.abrupt('return');

      case 8:

        this.validatePackageActivityNames(opts);

        if (!(appPackage && appActivity)) {
          context$1$0.next = 11;
          break;
        }

        return context$1$0.abrupt('return');

      case 11:

        _logger2['default'].debug("Parsing package and activity from app manifest");
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(adb.packageAndLaunchActivityFromManifest(app));

      case 14:
        _ref2 = context$1$0.sent;
        apkPackage = _ref2.apkPackage;
        apkActivity = _ref2.apkActivity;

        if (apkPackage && !appPackage) {
          appPackage = apkPackage;
        }
        if (!appWaitPackage) {
          appWaitPackage = appPackage;
        }
        if (apkActivity && !appActivity) {
          appActivity = apkActivity;
        }
        if (!appWaitActivity) {
          appWaitActivity = appActivity;
        }
        _logger2['default'].debug('Parsed package and activity are: ' + apkPackage + '/' + apkActivity);
        return context$1$0.abrupt('return', { appPackage: appPackage, appWaitPackage: appWaitPackage, appActivity: appActivity, appWaitActivity: appWaitActivity });

      case 23:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.resetApp = function callee$0$0(adb) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var app, appPackage, fastReset, fullReset, _opts$androidInstallTimeout, androidInstallTimeout, autoGrantPermissions, allowTestPackages, isInstalled, output;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        app = opts.app;
        appPackage = opts.appPackage;
        fastReset = opts.fastReset;
        fullReset = opts.fullReset;
        _opts$androidInstallTimeout = opts.androidInstallTimeout;
        androidInstallTimeout = _opts$androidInstallTimeout === undefined ? PACKAGE_INSTALL_TIMEOUT : _opts$androidInstallTimeout;
        autoGrantPermissions = opts.autoGrantPermissions;
        allowTestPackages = opts.allowTestPackages;

        if (appPackage) {
          context$1$0.next = 10;
          break;
        }

        throw new Error("'appPackage' option is required");

      case 10:
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(adb.isAppInstalled(appPackage));

      case 12:
        isInstalled = context$1$0.sent;

        if (!isInstalled) {
          context$1$0.next = 38;
          break;
        }

        context$1$0.prev = 14;
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(adb.forceStop(appPackage));

      case 17:
        context$1$0.next = 21;
        break;

      case 19:
        context$1$0.prev = 19;
        context$1$0.t0 = context$1$0['catch'](14);

      case 21:
        if (!(!fullReset && fastReset)) {
          context$1$0.next = 38;
          break;
        }

        context$1$0.next = 24;
        return _regeneratorRuntime.awrap(adb.clear(appPackage));

      case 24:
        output = context$1$0.sent;

        if (!(_lodash2['default'].isString(output) && output.toLowerCase().includes('failed'))) {
          context$1$0.next = 27;
          break;
        }

        throw new Error('Cannot clear the application data of \'' + appPackage + '\'. Original error: ' + output);

      case 27:
        if (!autoGrantPermissions) {
          context$1$0.next = 36;
          break;
        }

        context$1$0.prev = 28;
        context$1$0.next = 31;
        return _regeneratorRuntime.awrap(adb.grantAllPermissions(appPackage));

      case 31:
        context$1$0.next = 36;
        break;

      case 33:
        context$1$0.prev = 33;
        context$1$0.t1 = context$1$0['catch'](28);

        _logger2['default'].error('Unable to grant permissions requested. Original error: ' + context$1$0.t1.message);

      case 36:
        _logger2['default'].debug('Performed fast reset on the installed \'' + appPackage + '\' application (stop and clear)');
        return context$1$0.abrupt('return');

      case 38:
        if (app) {
          context$1$0.next = 40;
          break;
        }

        throw new Error("'app' option is required for reinstall");

      case 40:

        _logger2['default'].debug('Running full reset on \'' + appPackage + '\' (reinstall)');

        if (!isInstalled) {
          context$1$0.next = 44;
          break;
        }

        context$1$0.next = 44;
        return _regeneratorRuntime.awrap(adb.uninstallApk(appPackage));

      case 44:
        context$1$0.next = 46;
        return _regeneratorRuntime.awrap(adb.install(app, {
          grantPermissions: autoGrantPermissions,
          timeout: androidInstallTimeout,
          allowTestPackages: allowTestPackages
        }));

      case 46:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[14, 19], [28, 33]]);
};

helpers.installApk = function callee$0$0(adb) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var app, appPackage, fastReset, fullReset, _opts$androidInstallTimeout2, androidInstallTimeout, autoGrantPermissions, allowTestPackages, shouldPerformFastReset;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        app = opts.app;
        appPackage = opts.appPackage;
        fastReset = opts.fastReset;
        fullReset = opts.fullReset;
        _opts$androidInstallTimeout2 = opts.androidInstallTimeout;
        androidInstallTimeout = _opts$androidInstallTimeout2 === undefined ? PACKAGE_INSTALL_TIMEOUT : _opts$androidInstallTimeout2;
        autoGrantPermissions = opts.autoGrantPermissions;
        allowTestPackages = opts.allowTestPackages;

        if (!(!app || !appPackage)) {
          context$1$0.next = 10;
          break;
        }

        throw new Error("'app' and 'appPackage' options are required");

      case 10:
        if (!fullReset) {
          context$1$0.next = 14;
          break;
        }

        context$1$0.next = 13;
        return _regeneratorRuntime.awrap(this.resetApp(adb, opts));

      case 13:
        return context$1$0.abrupt('return');

      case 14:
        context$1$0.t0 = fastReset;

        if (!context$1$0.t0) {
          context$1$0.next = 19;
          break;
        }

        context$1$0.next = 18;
        return _regeneratorRuntime.awrap(adb.isAppInstalled(appPackage));

      case 18:
        context$1$0.t0 = context$1$0.sent;

      case 19:
        shouldPerformFastReset = context$1$0.t0;
        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(adb.installOrUpgrade(app, appPackage, {
          grantPermissions: autoGrantPermissions,
          timeout: androidInstallTimeout,
          allowTestPackages: allowTestPackages
        }));

      case 22:
        if (!shouldPerformFastReset) {
          context$1$0.next = 26;
          break;
        }

        _logger2['default'].info('Performing fast reset on \'' + appPackage + '\'');
        context$1$0.next = 26;
        return _regeneratorRuntime.awrap(this.resetApp(adb, opts));

      case 26:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

/**
 * Installs an array of apks
 * @param {ADB} adb Instance of Appium ADB object
 * @param {Object} opts Opts defined in driver.js
 */
helpers.installOtherApks = function callee$0$0(otherApps, adb, opts) {
  var _opts$androidInstallTimeout3, androidInstallTimeout, autoGrantPermissions, allowTestPackages;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _opts$androidInstallTimeout3 = opts.androidInstallTimeout;
        androidInstallTimeout = _opts$androidInstallTimeout3 === undefined ? PACKAGE_INSTALL_TIMEOUT : _opts$androidInstallTimeout3;
        autoGrantPermissions = opts.autoGrantPermissions;
        allowTestPackages = opts.allowTestPackages;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(_bluebird2['default'].all(otherApps.map(function (otherApp) {
          _logger2['default'].debug('Installing app: ' + otherApp);
          return adb.installOrUpgrade(otherApp, null, {
            grantPermissions: autoGrantPermissions,
            timeout: androidInstallTimeout,
            allowTestPackages: allowTestPackages
          });
        })));

      case 6:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.initUnicodeKeyboard = function callee$0$0(adb) {
  var defaultIME, appiumIME;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug('Enabling Unicode keyboard support');
        _logger2['default'].debug("Pushing unicode ime to device...");
        context$1$0.prev = 2;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(adb.install(_appiumAndroidIme.path, { replace: false }));

      case 5:
        context$1$0.next = 14;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](2);

        _logger2['default'].info('Performing full reinstall of ' + UNICODE_IME_PKG_ID + ' as a possible fix for: ' + context$1$0.t0.message);
        context$1$0.next = 12;
        return _regeneratorRuntime.awrap(adb.uninstallApk(UNICODE_IME_PKG_ID));

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(adb.install(_appiumAndroidIme.path, { replace: false }));

      case 14:
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(adb.defaultIME());

      case 16:
        defaultIME = context$1$0.sent;

        _logger2['default'].debug('Unsetting previous IME ' + defaultIME);
        appiumIME = UNICODE_IME_PKG_ID + '/.UnicodeIME';

        _logger2['default'].debug('Setting IME to \'' + appiumIME + '\'');
        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(adb.enableIME(appiumIME));

      case 22:
        context$1$0.next = 24;
        return _regeneratorRuntime.awrap(adb.setIME(appiumIME));

      case 24:
        return context$1$0.abrupt('return', defaultIME);

      case 25:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[2, 7]]);
};

helpers.setMockLocationApp = function callee$0$0(adb, app) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(adb.getApiLevel());

      case 3:
        context$1$0.t0 = context$1$0.sent;

        if (!(context$1$0.t0 < 23)) {
          context$1$0.next = 9;
          break;
        }

        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(adb.shell(['settings', 'put', 'secure', 'mock_location', '1']));

      case 7:
        context$1$0.next = 11;
        break;

      case 9:
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.shell(['appops', 'set', app, 'android:mock_location', 'allow']));

      case 11:
        context$1$0.next = 16;
        break;

      case 13:
        context$1$0.prev = 13;
        context$1$0.t1 = context$1$0['catch'](0);

        _logger2['default'].warn('Unable to set mock location for app \'' + app + '\': ' + context$1$0.t1.message);

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 13]]);
};

helpers.installHelperApp = function callee$0$0(adb, apkPath, packageId, appName) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(adb.installOrUpgrade(apkPath, packageId, { grantPermissions: true }));

      case 3:
        context$1$0.next = 8;
        break;

      case 5:
        context$1$0.prev = 5;
        context$1$0.t0 = context$1$0['catch'](0);

        _logger2['default'].warn('Ignored error while installing Appium ' + appName + ' helper: ' + ('\'' + context$1$0.t0.message + '\'. Manually uninstalling the application ') + ('with package id \'' + packageId + '\' may help. Expect some Appium ') + 'features may not work as expected unless this problem is ' + 'fixed.');

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[0, 5]]);
};

helpers.pushSettingsApp = function callee$0$0(adb) {
  var throwError = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("Pushing settings apk to device...");

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(helpers.installHelperApp(adb, _ioAppiumSettings.path, SETTINGS_HELPER_PKG_ID, 'Settings'));

      case 3:
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(adb.processExists(SETTINGS_HELPER_PKG_ID));

      case 5:
        if (!context$1$0.sent) {
          context$1$0.next = 8;
          break;
        }

        _logger2['default'].debug(SETTINGS_HELPER_PKG_ID + ' is already running. ' + 'There is no need to reset its permissions.');
        return context$1$0.abrupt('return');

      case 8:
        context$1$0.prev = 8;
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.startApp({
          pkg: SETTINGS_HELPER_PKG_ID,
          activity: SETTINGS_HELPER_PKG_ACTIVITY,
          action: "android.intent.action.MAIN",
          category: "android.intent.category.LAUNCHER",
          flags: "0x10200000",
          stopApp: false
        }));

      case 11:
        context$1$0.next = 18;
        break;

      case 13:
        context$1$0.prev = 13;
        context$1$0.t0 = context$1$0['catch'](8);

        _logger2['default'].warn('Failed to launch settings app: ' + context$1$0.t0.message);

        if (!throwError) {
          context$1$0.next = 18;
          break;
        }

        throw context$1$0.t0;

      case 18:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[8, 13]]);
};

helpers.pushUnlock = function callee$0$0(adb) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].debug("Pushing unlock helper app to device...");

        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(helpers.installHelperApp(adb, _appiumUnlock.path, UNLOCK_HELPER_PKG_ID, 'Unlock'));

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

/**
 * Extracts string.xml and converts it to string.json and pushes
 * it to /data/local/tmp/string.json on for use of bootstrap
 * If app is not present to extract string.xml it deletes remote strings.json
 * If app does not have strings.xml we push an empty json object to remote
 *
 * @param {?string} language - Language abbreviation, for example 'fr'. The default language
 * is used if this argument is not defined.
 * @param {Object} adb - The adb mofdule instance.
 * @param {Object} opts - Driver options dictionary.
 * @returns {Object} The dictionary, where string resourtces identifiers are keys
 * along with their corresponding values for the given language or an empty object
 * if no matching resources were extracted.
 */
helpers.pushStrings = function callee$0$0(language, adb, opts) {
  var remoteDir, stringsJson, remoteFile, stringsTmpDir, _ref3, apkStrings, localPath;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        remoteDir = '/data/local/tmp';
        stringsJson = 'strings.json';
        remoteFile = remoteDir + '/' + stringsJson;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(adb.rimraf(remoteFile));

      case 5:
        context$1$0.t0 = _lodash2['default'].isEmpty(opts.appPackage);

        if (context$1$0.t0) {
          context$1$0.next = 10;
          break;
        }

        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.exists(opts.app));

      case 9:
        context$1$0.t0 = !context$1$0.sent;

      case 10:
        if (!context$1$0.t0) {
          context$1$0.next = 12;
          break;
        }

        return context$1$0.abrupt('return', {});

      case 12:
        stringsTmpDir = _path2['default'].resolve(opts.tmpDir, opts.appPackage);
        context$1$0.prev = 13;

        _logger2['default'].debug('Extracting strings from apk', opts.app, language, stringsTmpDir);
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(adb.extractStringsFromApk(opts.app, language, stringsTmpDir));

      case 17:
        _ref3 = context$1$0.sent;
        apkStrings = _ref3.apkStrings;
        localPath = _ref3.localPath;
        context$1$0.next = 22;
        return _regeneratorRuntime.awrap(adb.push(localPath, remoteDir));

      case 22:
        return context$1$0.abrupt('return', apkStrings);

      case 25:
        context$1$0.prev = 25;
        context$1$0.t1 = context$1$0['catch'](13);

        _logger2['default'].warn('Could not get strings, continuing anyway. Original error: ' + context$1$0.t1.message);
        context$1$0.next = 30;
        return _regeneratorRuntime.awrap(adb.shell('echo', ['\'{}\' > ' + remoteFile]));

      case 30:
        context$1$0.prev = 30;
        context$1$0.next = 33;
        return _regeneratorRuntime.awrap(_appiumSupport.fs.rimraf(stringsTmpDir));

      case 33:
        return context$1$0.finish(30);

      case 34:
        return context$1$0.abrupt('return', {});

      case 35:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[13, 25, 30, 34]]);
};

helpers.unlockWithUIAutomation = function callee$0$0(driver, adb, unlockCapabilities) {
  var _PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType;

  var unlockType, unlockKey, unlockMethod;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        unlockType = unlockCapabilities.unlockType;

        if (_unlockHelpers2['default'].isValidUnlockType(unlockType)) {
          context$1$0.next = 3;
          break;
        }

        throw new Error('Invalid unlock type ' + unlockType);

      case 3:
        unlockKey = unlockCapabilities.unlockKey;

        if (_unlockHelpers2['default'].isValidKey(unlockType, unlockKey)) {
          context$1$0.next = 6;
          break;
        }

        throw new Error('Missing unlockKey ' + unlockKey + ' capability for unlockType ' + unlockType);

      case 6:
        unlockMethod = (_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType = {}, _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.PIN_UNLOCK, _unlockHelpers2['default'].pinUnlock), _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.PASSWORD_UNLOCK, _unlockHelpers2['default'].passwordUnlock), _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.PATTERN_UNLOCK, _unlockHelpers2['default'].patternUnlock), _defineProperty(_PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType, _unlockHelpers.FINGERPRINT_UNLOCK, _unlockHelpers2['default'].fingerprintUnlock), _PIN_UNLOCK$PASSWORD_UNLOCK$PATTERN_UNLOCK$FINGERPRINT_UNLOCK$unlockType)[unlockType];
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(unlockMethod(adb, driver, unlockCapabilities));

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.unlockWithHelperApp = function callee$0$0(adb) {
  var startOpts, firstRun;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _logger2['default'].info("Unlocking screen");

        context$1$0.prev = 1;
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(adb.forceStop(UNLOCK_HELPER_PKG_ID));

      case 4:
        context$1$0.next = 9;
        break;

      case 6:
        context$1$0.prev = 6;
        context$1$0.t0 = context$1$0['catch'](1);

        // Sometimes we can see the below error, but we can ignore it.
        // [W3C] Encountered internal error running command: Error: Error executing adbExec. Original error: 'Command 'adb -P 5037 -s emulator-5554 shell am force-stop io.appium.unlock' timed out after 20000ms'; Stderr: ''; Code: 'null'
        _logger2['default'].warn('An error in unlockWithHelperApp: ' + context$1$0.t0.message);

      case 9:
        startOpts = {
          pkg: UNLOCK_HELPER_PKG_ID,
          activity: UNLOCK_HELPER_PKG_ACTIVITY,
          action: "android.intent.action.MAIN",
          category: "android.intent.category.LAUNCHER",
          flags: "0x10200000",
          stopApp: false,
          retry: false,
          waitDuration: 1000
        };
        firstRun = true;
        context$1$0.next = 13;
        return _regeneratorRuntime.awrap((0, _asyncbox.retry)(3, function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                if (!firstRun) {
                  context$2$0.next = 4;
                  break;
                }

                firstRun = false;
                context$2$0.next = 16;
                break;

              case 4:
                context$2$0.prev = 4;
                context$2$0.next = 7;
                return _regeneratorRuntime.awrap(adb.isScreenLocked());

              case 7:
                if (context$2$0.sent) {
                  context$2$0.next = 9;
                  break;
                }

                return context$2$0.abrupt('return');

              case 9:
                context$2$0.next = 16;
                break;

              case 11:
                context$2$0.prev = 11;
                context$2$0.t0 = context$2$0['catch'](4);

                _logger2['default'].warn('Error in isScreenLocked: ' + context$2$0.t0.message);
                _logger2['default'].warn("\"adb shell dumpsys window\" command has timed out.");
                _logger2['default'].warn("The reason of this timeout is the delayed adb response. Resetting adb server can improve it.");

              case 16:

                _logger2['default'].info('Launching ' + UNLOCK_HELPER_PKG_ID);

                // The command takes too much time so we should not call the command over twice continuously.
                context$2$0.next = 19;
                return _regeneratorRuntime.awrap(adb.startApp(startOpts));

              case 19:
              case 'end':
                return context$2$0.stop();
            }
          }, null, this, [[4, 11]]);
        }));

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[1, 6]]);
};

helpers.unlock = function callee$0$0(driver, adb, capabilities) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(adb.isScreenLocked());

      case 2:
        if (context$1$0.sent) {
          context$1$0.next = 5;
          break;
        }

        _logger2['default'].info("Screen already unlocked, doing nothing");
        return context$1$0.abrupt('return');

      case 5:

        _logger2['default'].debug("Screen is locked, trying to unlock");

        if (!_lodash2['default'].isUndefined(capabilities.unlockType)) {
          context$1$0.next = 12;
          break;
        }

        _logger2['default'].warn("Using app unlock, this is going to be deprecated!");
        context$1$0.next = 10;
        return _regeneratorRuntime.awrap(helpers.unlockWithHelperApp(adb));

      case 10:
        context$1$0.next = 16;
        break;

      case 12:
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(helpers.unlockWithUIAutomation(driver, adb, { unlockType: capabilities.unlockType, unlockKey: capabilities.unlockKey }));

      case 14:
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(helpers.verifyUnlock(adb));

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.verifyUnlock = function callee$0$0(adb) {
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap((0, _asyncbox.retryInterval)(2, 1000, function callee$1$0() {
          return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return _regeneratorRuntime.awrap(adb.isScreenLocked());

              case 2:
                if (!context$2$0.sent) {
                  context$2$0.next = 4;
                  break;
                }

                throw new Error("Screen did not unlock successfully, retrying");

              case 4:
                _logger2['default'].debug("Screen unlocked successfully");

              case 5:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this);
        }));

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.initDevice = function callee$0$0(adb, opts) {
  var defaultIME;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(adb.waitForDevice());

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(helpers.pushSettingsApp(adb));

      case 4:
        if (opts.avd) {
          context$1$0.next = 7;
          break;
        }

        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(helpers.setMockLocationApp(adb, SETTINGS_HELPER_PKG_ID));

      case 7:
        context$1$0.next = 9;
        return _regeneratorRuntime.awrap(helpers.ensureDeviceLocale(adb, opts.language, opts.locale));

      case 9:
        context$1$0.next = 11;
        return _regeneratorRuntime.awrap(adb.startLogcat());

      case 11:
        defaultIME = undefined;

        if (!opts.unicodeKeyboard) {
          context$1$0.next = 16;
          break;
        }

        context$1$0.next = 15;
        return _regeneratorRuntime.awrap(helpers.initUnicodeKeyboard(adb));

      case 15:
        defaultIME = context$1$0.sent;

      case 16:
        if (!_lodash2['default'].isUndefined(opts.unlockType)) {
          context$1$0.next = 19;
          break;
        }

        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(helpers.pushUnlock(adb));

      case 19:
        return context$1$0.abrupt('return', defaultIME);

      case 20:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
};

helpers.removeNullProperties = function (obj) {
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = _getIterator(_lodash2['default'].keys(obj)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var key = _step3.value;

      if (_lodash2['default'].isNull(obj[key]) || _lodash2['default'].isUndefined(obj[key])) {
        delete obj[key];
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3['return']) {
        _iterator3['return']();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
};

helpers.truncateDecimals = function (number, digits) {
  var multiplier = Math.pow(10, digits),
      adjustedNum = number * multiplier,
      truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

  return truncatedNum / multiplier;
};

helpers.isChromeBrowser = function (browser) {
  return _lodash2['default'].includes(_Object$keys(CHROME_BROWSER_PACKAGE_ACTIVITY), (browser || '').toLowerCase());
};

helpers.getChromePkg = function (browser) {
  return CHROME_BROWSER_PACKAGE_ACTIVITY[browser.toLowerCase()] || CHROME_BROWSER_PACKAGE_ACTIVITY['default'];
};

helpers.removeAllSessionWebSocketHandlers = function callee$0$0(server, sessionId) {
  var activeHandlers, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, pathname;

  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!(!server || !_lodash2['default'].isFunction(server.getWebSocketHandlers))) {
          context$1$0.next = 2;
          break;
        }

        return context$1$0.abrupt('return');

      case 2:
        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(server.getWebSocketHandlers(sessionId));

      case 4:
        activeHandlers = context$1$0.sent;
        _iteratorNormalCompletion4 = true;
        _didIteratorError4 = false;
        _iteratorError4 = undefined;
        context$1$0.prev = 8;
        _iterator4 = _getIterator(_lodash2['default'].keys(activeHandlers));

      case 10:
        if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
          context$1$0.next = 17;
          break;
        }

        pathname = _step4.value;
        context$1$0.next = 14;
        return _regeneratorRuntime.awrap(server.removeWebSocketHandler(pathname));

      case 14:
        _iteratorNormalCompletion4 = true;
        context$1$0.next = 10;
        break;

      case 17:
        context$1$0.next = 23;
        break;

      case 19:
        context$1$0.prev = 19;
        context$1$0.t0 = context$1$0['catch'](8);
        _didIteratorError4 = true;
        _iteratorError4 = context$1$0.t0;

      case 23:
        context$1$0.prev = 23;
        context$1$0.prev = 24;

        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
          _iterator4['return']();
        }

      case 26:
        context$1$0.prev = 26;

        if (!_didIteratorError4) {
          context$1$0.next = 29;
          break;
        }

        throw _iteratorError4;

      case 29:
        return context$1$0.finish(26);

      case 30:
        return context$1$0.finish(23);

      case 31:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this, [[8, 19, 23, 31], [24,, 26, 30]]);
};

/**
 * Takes a desired capability and tries to JSON.parse it as an array,
 * and either returns the parsed array or a singleton array.
 *
 * @param {any} cap A desired capability
 */
helpers.parseArray = function (cap) {
  var parsedCaps = undefined;
  try {
    parsedCaps = JSON.parse(cap);
  } catch (ign) {}

  if (_lodash2['default'].isArray(parsedCaps)) {
    return parsedCaps;
  } else if (_lodash2['default'].isString(cap)) {
    return [cap];
  }

  throw new Error('must provide a string or JSON Array; received ' + cap);
};

helpers.validateDesiredCaps = function (caps) {
  // make sure that the capabilities have one of `app`, `appPackage` or `browser`
  if ((!caps.browserName || !this.isChromeBrowser(caps.browserName)) && !caps.app && !caps.appPackage) {
    _logger2['default'].errorAndThrow('The desired capabilities must include either an app, appPackage or browserName');
  }
  if (caps.browserName) {
    if (caps.app) {
      // warn if the capabilities have both `app` and `browser, although this is common with selenium grid
      _logger2['default'].warn('The desired capabilities should generally not include both an app and a browserName');
    }
    if (caps.appPackage) {
      _logger2['default'].errorAndThrow('The desired capabilities must include either \'appPackage\' or \'browserName\'');
    }
  }

  return true;
};

helpers.bootstrap = _appiumAndroidBootstrap2['default'];
helpers.unlocker = _unlockHelpers2['default'];

exports['default'] = helpers;
module.exports = exports['default'];

// we can create a throwaway ADB instance here, so there is no dependency
// on instantiating on earlier (at this point, we have no udid)
// we can only use this ADB object for commands that would not be confused
// if multiple devices are connected

// a specific avd name was given. try to initialize with that

// udid was given, lets try to init with that device

// first try started devices/emulators

// direct adb calls to the specific device

// fullReset has priority over fastReset

// executing `shell pm clear` resets previously assigned application permissions as well

// There is no need to reset the newly installed app

// Install all of the APK's asynchronously

// get the default IME so we can return back to it later if we want

// Reinstall will stop the settings helper process anyway, so
// there is no need to continue if the application is still running

// lauch io.appium.settings app due to settings failing to be set
// if the app is not launched prior to start the session on android 7+
// see https://github.com/appium/appium/issues/8957

// clean up remote string.json if present

// Unlock succeed with a couple of retries.

// To reduce a time to call adb.isScreenLocked() since `adb shell dumpsys window` is easy to hang adb commands

// pushSettingsApp required before calling ensureDeviceLocale for API Level 24+
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9hbmRyb2lkLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBYyxRQUFROzs7O29CQUNMLE1BQU07Ozs7NEJBQ0YsY0FBYzs7d0JBQ0UsVUFBVTs7c0JBQzVCLFVBQVU7Ozs7NkJBQ1YsZ0JBQWdCOztnQ0FDSSxvQkFBb0I7O2dDQUNuQixvQkFBb0I7OzRCQUN0QixlQUFlOztzQ0FDL0IsMEJBQTBCOzs7O3dCQUNsQyxVQUFVOzs7O3lCQUVSLFlBQVk7Ozs7NkJBRWdCLGtCQUFrQjs7OztBQUU5RCxJQUFNLHVCQUF1QixHQUFHLEtBQUssQ0FBQztBQUN0QyxJQUFNLCtCQUErQixHQUFHO0FBQ3RDLFFBQU0sRUFBRTtBQUNOLE9BQUcsRUFBRSxvQkFBb0I7QUFDekIsWUFBUSxFQUFFLHFDQUFxQztHQUNoRDtBQUNELFVBQVEsRUFBRTtBQUNSLE9BQUcsRUFBRSwyQkFBMkI7QUFDaEMsWUFBUSxFQUFFLHNCQUFzQjtHQUNqQztBQUNELFlBQVUsRUFBRTtBQUNWLE9BQUcsRUFBRSxpQkFBaUI7QUFDdEIsWUFBUSxFQUFFLHFDQUFxQztHQUNoRDtBQUNELFNBQU8sRUFBRTtBQUNQLE9BQUcsRUFBRSxxQkFBcUI7QUFDMUIsWUFBUSxFQUFFLHFDQUFxQztHQUNoRDtBQUNELG9CQUFrQixFQUFFO0FBQ2xCLE9BQUcsRUFBRSxxQkFBcUI7QUFDMUIsWUFBUSxFQUFFLHFDQUFxQztHQUNoRDtBQUNELG9CQUFrQixFQUFFO0FBQ2xCLE9BQUcsRUFBRSw0QkFBNEI7QUFDakMsWUFBUSxFQUFFLG1EQUFtRDtHQUM5RDtBQUNELGFBQVM7QUFDUCxPQUFHLEVBQUUsb0JBQW9CO0FBQ3pCLFlBQVEsRUFBRSxxQ0FBcUM7R0FDaEQ7Q0FDRixDQUFDO0FBQ0YsSUFBTSxzQkFBc0IsR0FBRyxvQkFBb0IsQ0FBQztBQUNwRCxJQUFNLDRCQUE0QixHQUFHLFdBQVcsQ0FBQztBQUNqRCxJQUFNLG9CQUFvQixHQUFHLGtCQUFr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R0FBRyxDQUFDLENBQUM7R0FDZDs7QUFFRCxRQUFNLElBQUksS0FBSyxvREFBa0QsR0FBRyxDQUFHLENBQUM7Q0FDekUsQ0FBQzs7QUFFRixPQUFPLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxJQUFJLEVBQUU7O0FBRTVDLE1BQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQSxJQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkcsd0JBQU8sYUFBYSxDQUFDLGdGQUFnRixDQUFDLENBQUM7R0FDeEc7QUFDRCxNQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDcEIsUUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFOztBQUVaLDBCQUFPLElBQUksQ0FBQyxxRkFBcUYsQ0FBQyxDQUFDO0tBQ3BHO0FBQ0QsUUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ25CLDBCQUFPLGFBQWEsa0ZBQThFLENBQUM7S0FDcEc7R0FDRjs7QUFFRCxTQUFPLElBQUksQ0FBQztDQUNiLENBQUM7O0FBRUYsT0FBTyxDQUFDLFNBQVMsc0NBQVksQ0FBQztBQUM5QixPQUFPLENBQUMsUUFBUSw2QkFBVyxDQUFDOztxQkFFYixPQUFPIiwiZmlsZSI6ImxpYi9hbmRyb2lkLWhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBleGVjIH0gZnJvbSAndGVlbl9wcm9jZXNzJztcbmltcG9ydCB7IHJldHJ5LCByZXRyeUludGVydmFsIH0gZnJvbSAnYXN5bmNib3gnO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5pbXBvcnQgeyBmcyB9IGZyb20gJ2FwcGl1bS1zdXBwb3J0JztcbmltcG9ydCB7IHBhdGggYXMgdW5pY29kZUlNRVBhdGggfSBmcm9tICdhcHBpdW0tYW5kcm9pZC1pbWUnO1xuaW1wb3J0IHsgcGF0aCBhcyBzZXR0aW5nc0Fwa1BhdGggfSBmcm9tICdpby5hcHBpdW0uc2V0dGluZ3MnO1xuaW1wb3J0IHsgcGF0aCBhcyB1bmxvY2tBcGtQYXRoIH0gZnJvbSAnYXBwaXVtLXVubG9jayc7XG5pbXBvcnQgQm9vdHN0cmFwIGZyb20gJ2FwcGl1bS1hbmRyb2lkLWJvb3RzdHJhcCc7XG5pbXBvcnQgQiBmcm9tICdibHVlYmlyZCc7XG5cbmltcG9ydCBBREIgZnJvbSAnYXBwaXVtLWFkYic7XG5pbXBvcnQgeyBkZWZhdWx0IGFzIHVubG9ja2VyLCBQSU5fVU5MT0NLLCBQQVNTV09SRF9VTkxPQ0ssXG4gIFBBVFRFUk5fVU5MT0NLLCBGSU5HRVJQUklOVF9VTkxPQ0sgfSBmcm9tICcuL3VubG9jay1oZWxwZXJzJztcblxuY29uc3QgUEFDS0FHRV9JTlNUQUxMX1RJTUVPVVQgPSA5MDAwMDsgLy8gbWlsbGlzZWNvbmRzXG5jb25zdCBDSFJPTUVfQlJPV1NFUl9QQUNLQUdFX0FDVElWSVRZID0ge1xuICBjaHJvbWU6IHtcbiAgICBwa2c6ICdjb20uYW5kcm9pZC5jaHJvbWUnLFxuICAgIGFjdGl2aXR5OiAnY29tLmdvb2dsZS5hbmRyb2lkLmFwcHMuY2hyb21lLk1haW4nLFxuICB9LFxuICBjaHJvbWl1bToge1xuICAgIHBrZzogJ29yZy5jaHJvbWl1bS5jaHJvbWUuc2hlbGwnLFxuICAgIGFjdGl2aXR5OiAnLkNocm9tZVNoZWxsQWN0aXZpdHknLFxuICB9LFxuICBjaHJvbWViZXRhOiB7XG4gICAgcGtnOiAnY29tLmNocm9tZS5iZXRhJyxcbiAgICBhY3Rpdml0eTogJ2NvbS5nb29nbGUuYW5kcm9pZC5hcHBzLmNocm9tZS5NYWluJyxcbiAgfSxcbiAgYnJvd3Nlcjoge1xuICAgIHBrZzogJ2NvbS5hbmRyb2lkLmJyb3dzZXInLFxuICAgIGFjdGl2aXR5OiAnY29tLmFuZHJvaWQuYnJvd3Nlci5Ccm93c2VyQWN0aXZpdHknLFxuICB9LFxuICAnY2hyb21pdW0tYnJvd3Nlcic6IHtcbiAgICBwa2c6ICdvcmcuY2hyb21pdW0uY2hyb21lJyxcbiAgICBhY3Rpdml0eTogJ2NvbS5nb29nbGUuYW5kcm9pZC5hcHBzLmNocm9tZS5NYWluJyxcbiAgfSxcbiAgJ2Nocm9taXVtLXdlYnZpZXcnOiB7XG4gICAgcGtnOiAnb3JnLmNocm9taXVtLndlYnZpZXdfc2hlbGwnLFxuICAgIGFjdGl2aXR5OiAnb3JnLmNocm9taXVtLndlYnZpZXdfc2hlbGwuV2ViVmlld0Jyb3dzZXJBY3Rpdml0eScsXG4gIH0sXG4gIGRlZmF1bHQ6IHtcbiAgICBwa2c6ICdjb20uYW5kcm9pZC5jaHJvbWUnLFxuICAgIGFjdGl2aXR5OiAnY29tLmdvb2dsZS5hbmRyb2lkLmFwcHMuY2hyb21lLk1haW4nLFxuICB9LFxufTtcbmNvbnN0IFNFVFRJTkdTX0hFTFBFUl9QS0dfSUQgPSAnaW8uYXBwaXVtLnNldHRpbmdzJztcbmNvbnN0IFNFVFRJTkdTX0hFTFBFUl9QS0dfQUNUSVZJVFkgPSBcIi5TZXR0aW5nc1wiO1xuY29uc3QgVU5MT0NLX0hFTFBFUl9QS0dfSUQgPSAnaW8uYXBwaXVtLnVubG9jayc7XG5jb25zdCBVTkxPQ0tfSEVMUEVSX1BLR19BQ1RJVklUWSA9IFwiLlVubG9ja1wiO1xuY29uc3QgVU5JQ09ERV9JTUVfUEtHX0lEID0gJ2lvLmFwcGl1bS5hbmRyb2lkLmltZSc7XG5cbmxldCBoZWxwZXJzID0ge307XG5cbmhlbHBlcnMuY3JlYXRlQmFzZUFEQiA9IGFzeW5jIGZ1bmN0aW9uIChvcHRzID0ge30pIHtcbiAgLy8gZmlsdGVyIG91dCBhbnkgdW53YW50ZWQgb3B0aW9ucyBzZW50IGluXG4gIC8vIHRoaXMgbGlzdCBzaG91bGQgYmUgdXBkYXRlZCBhcyBBREIgdGFrZXMgbW9yZSBhcmd1bWVudHNcbiAgY29uc3Qge1xuICAgIGphdmFWZXJzaW9uLFxuICAgIGFkYlBvcnQsXG4gICAgc3VwcHJlc3NLaWxsU2VydmVyLFxuICAgIHJlbW90ZUFkYkhvc3QsXG4gICAgY2xlYXJEZXZpY2VMb2dzT25TdGFydCxcbiAgICBhZGJFeGVjVGltZW91dCxcbiAgfSA9IG9wdHM7XG4gIHJldHVybiBhd2FpdCBBREIuY3JlYXRlQURCKHtcbiAgICBqYXZhVmVyc2lvbixcbiAgICBhZGJQb3J0LFxuICAgIHN1cHByZXNzS2lsbFNlcnZlcixcbiAgICByZW1vdGVBZGJIb3N0LFxuICAgIGNsZWFyRGV2aWNlTG9nc09uU3RhcnQsXG4gICAgYWRiRXhlY1RpbWVvdXQsXG4gIH0pO1xufTtcblxuaGVscGVycy5wYXJzZUphdmFWZXJzaW9uID0gZnVuY3Rpb24gKHN0ZGVycikge1xuICBsZXQgbGluZXMgPSBzdGRlcnIuc3BsaXQoXCJcXG5cIik7XG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgvKGphdmF8b3BlbmpkaykgdmVyc2lvbi8pLnRlc3QobGluZSkpIHtcbiAgICAgIHJldHVybiBsaW5lLnNwbGl0KFwiIFwiKVsyXS5yZXBsYWNlKC9cIi9nLCAnJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuaGVscGVycy5nZXRKYXZhVmVyc2lvbiA9IGFzeW5jIGZ1bmN0aW9uIChsb2dWZXJzaW9uID0gdHJ1ZSkge1xuICBsZXQge3N0ZGVycn0gPSBhd2FpdCBleGVjKCdqYXZhJywgWyctdmVyc2lvbiddKTtcbiAgbGV0IGphdmFWZXIgPSBoZWxwZXJzLnBhcnNlSmF2YVZlcnNpb24oc3RkZXJyKTtcbiAgaWYgKGphdmFWZXIgPT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgZ2V0IHRoZSBKYXZhIHZlcnNpb24uIElzIEphdmEgaW5zdGFsbGVkP1wiKTtcbiAgfVxuICBpZiAobG9nVmVyc2lvbikge1xuICAgIGxvZ2dlci5pbmZvKGBKYXZhIHZlcnNpb24gaXM6ICR7amF2YVZlcn1gKTtcbiAgfVxuICByZXR1cm4gamF2YVZlcjtcbn07XG5cbmhlbHBlcnMucHJlcGFyZUVtdWxhdG9yID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgb3B0cykge1xuICBsZXQge2F2ZCwgYXZkQXJncywgbGFuZ3VhZ2UsIGxvY2FsZSwgYXZkTGF1bmNoVGltZW91dCxcbiAgICAgICBhdmRSZWFkeVRpbWVvdXR9ID0gb3B0cztcbiAgaWYgKCFhdmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgbGF1bmNoIEFWRCB3aXRob3V0IEFWRCBuYW1lXCIpO1xuICB9XG4gIGxldCBhdmROYW1lID0gYXZkLnJlcGxhY2UoJ0AnLCAnJyk7XG4gIGxldCBydW5uaW5nQVZEID0gYXdhaXQgYWRiLmdldFJ1bm5pbmdBVkQoYXZkTmFtZSk7XG4gIGlmIChydW5uaW5nQVZEICE9PSBudWxsKSB7XG4gICAgaWYgKGF2ZEFyZ3MgJiYgYXZkQXJncy50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCItd2lwZS1kYXRhXCIpID4gLTEpIHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhgS2lsbGluZyAnJHthdmROYW1lfScgYmVjYXVzZSBpdCBuZWVkcyB0byBiZSB3aXBlZCBhdCBzdGFydC5gKTtcbiAgICAgIGF3YWl0IGFkYi5raWxsRW11bGF0b3IoYXZkTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhcIk5vdCBsYXVuY2hpbmcgQVZEIGJlY2F1c2UgaXQgaXMgYWxyZWFkeSBydW5uaW5nLlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgYXZkQXJncyA9IHRoaXMucHJlcGFyZUFWREFyZ3Mob3B0cywgYWRiLCBhdmRBcmdzKTtcbiAgYXdhaXQgYWRiLmxhdW5jaEFWRChhdmQsIGF2ZEFyZ3MsIGxhbmd1YWdlLCBsb2NhbGUsIGF2ZExhdW5jaFRpbWVvdXQsXG4gICAgICAgICAgICAgICAgICAgICAgYXZkUmVhZHlUaW1lb3V0KTtcbn07XG5cbmhlbHBlcnMucHJlcGFyZUFWREFyZ3MgPSBmdW5jdGlvbiAob3B0cywgYWRiLCBhdmRBcmdzKSB7XG4gIGxldCBhcmdzID0gYXZkQXJncyA/IFthdmRBcmdzXSA6IFtdO1xuICBpZiAoIV8uaXNVbmRlZmluZWQob3B0cy5uZXR3b3JrU3BlZWQpKSB7XG4gICAgbGV0IG5ldHdvcmtTcGVlZCA9IHRoaXMuZW5zdXJlTmV0d29ya1NwZWVkKGFkYiwgb3B0cy5uZXR3b3JrU3BlZWQpO1xuICAgIGFyZ3MucHVzaCgnLW5ldHNwZWVkJywgbmV0d29ya1NwZWVkKTtcbiAgfVxuICBpZiAob3B0cy5pc0hlYWRsZXNzKSB7XG4gICAgYXJncy5wdXNoKCctbm8td2luZG93Jyk7XG4gIH1cbiAgcmV0dXJuIGFyZ3Muam9pbignICcpO1xufTtcblxuaGVscGVycy5lbnN1cmVOZXR3b3JrU3BlZWQgPSBmdW5jdGlvbiAoYWRiLCBuZXR3b3JrU3BlZWQpIHtcbiAgaWYgKF8udmFsdWVzKGFkYi5ORVRXT1JLX1NQRUVEKS5pbmRleE9mKG5ldHdvcmtTcGVlZCkgIT09IC0xKSB7XG4gICAgcmV0dXJuIG5ldHdvcmtTcGVlZDtcbiAgfVxuICBsb2dnZXIud2FybihgV3JvbmcgbmV0d29yayBzcGVlZCBwYXJhbSAke25ldHdvcmtTcGVlZH0sIHVzaW5nIGRlZmF1bHQ6IGZ1bGwuIFN1cHBvcnRlZCB2YWx1ZXM6ICR7Xy52YWx1ZXMoYWRiLk5FVFdPUktfU1BFRUQpfWApO1xuICByZXR1cm4gYWRiLk5FVFdPUktfU1BFRUQuRlVMTDtcbn07XG5cbmhlbHBlcnMuZW5zdXJlRGV2aWNlTG9jYWxlID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgbGFuZ3VhZ2UsIGNvdW50cnkpIHtcbiAgaWYgKCFfLmlzU3RyaW5nKGxhbmd1YWdlKSAmJiAhXy5pc1N0cmluZyhjb3VudHJ5KSkge1xuICAgIGxvZ2dlci53YXJuKGBzZXREZXZpY2VMYW5ndWFnZUNvdW50cnkgcmVxdWlyZXMgbGFuZ3VhZ2Ugb3IgY291bnRyeS5gKTtcbiAgICBsb2dnZXIud2FybihgR290IGxhbmd1YWdlOiAnJHtsYW5ndWFnZX0nIGFuZCBjb3VudHJ5OiAnJHtjb3VudHJ5fSdgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBhd2FpdCBhZGIuc2V0RGV2aWNlTGFuZ3VhZ2VDb3VudHJ5KGxhbmd1YWdlLCBjb3VudHJ5KTtcblxuICBpZiAoIWF3YWl0IGFkYi5lbnN1cmVDdXJyZW50TG9jYWxlKGxhbmd1YWdlLCBjb3VudHJ5KSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIHNldCBsYW5ndWFnZTogJHtsYW5ndWFnZX0gYW5kIGNvdW50cnk6ICR7Y291bnRyeX1gKTtcbiAgfVxufTtcblxuaGVscGVycy5nZXREZXZpY2VJbmZvRnJvbUNhcHMgPSBhc3luYyBmdW5jdGlvbiAob3B0cyA9IHt9KSB7XG4gIC8vIHdlIGNhbiBjcmVhdGUgYSB0aHJvd2F3YXkgQURCIGluc3RhbmNlIGhlcmUsIHNvIHRoZXJlIGlzIG5vIGRlcGVuZGVuY3lcbiAgLy8gb24gaW5zdGFudGlhdGluZyBvbiBlYXJsaWVyIChhdCB0aGlzIHBvaW50LCB3ZSBoYXZlIG5vIHVkaWQpXG4gIC8vIHdlIGNhbiBvbmx5IHVzZSB0aGlzIEFEQiBvYmplY3QgZm9yIGNvbW1hbmRzIHRoYXQgd291bGQgbm90IGJlIGNvbmZ1c2VkXG4gIC8vIGlmIG11bHRpcGxlIGRldmljZXMgYXJlIGNvbm5lY3RlZFxuICBjb25zdCBhZGIgPSBhd2FpdCBoZWxwZXJzLmNyZWF0ZUJhc2VBREIob3B0cyk7XG4gIGxldCB1ZGlkID0gb3B0cy51ZGlkO1xuICBsZXQgZW1Qb3J0ID0gbnVsbDtcblxuICAvLyBhIHNwZWNpZmljIGF2ZCBuYW1lIHdhcyBnaXZlbi4gdHJ5IHRvIGluaXRpYWxpemUgd2l0aCB0aGF0XG4gIGlmIChvcHRzLmF2ZCkge1xuICAgIGF3YWl0IGhlbHBlcnMucHJlcGFyZUVtdWxhdG9yKGFkYiwgb3B0cyk7XG4gICAgdWRpZCA9IGFkYi5jdXJEZXZpY2VJZDtcbiAgICBlbVBvcnQgPSBhZGIuZW11bGF0b3JQb3J0O1xuICB9IGVsc2Uge1xuICAgIC8vIG5vIGF2ZCBnaXZlbi4gbGV0cyB0cnkgd2hhdGV2ZXIncyBwbHVnZ2VkIGluIGRldmljZXMvZW11bGF0b3JzXG4gICAgbG9nZ2VyLmluZm8oXCJSZXRyaWV2aW5nIGRldmljZSBsaXN0XCIpO1xuICAgIGxldCBkZXZpY2VzID0gYXdhaXQgYWRiLmdldERldmljZXNXaXRoUmV0cnkoKTtcblxuICAgIC8vIHVkaWQgd2FzIGdpdmVuLCBsZXRzIHRyeSB0byBpbml0IHdpdGggdGhhdCBkZXZpY2VcbiAgICBpZiAodWRpZCkge1xuICAgICAgaWYgKCFfLmluY2x1ZGVzKF8ubWFwKGRldmljZXMsICd1ZGlkJyksIHVkaWQpKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvckFuZFRocm93KGBEZXZpY2UgJHt1ZGlkfSB3YXMgbm90IGluIHRoZSBsaXN0IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgb2YgY29ubmVjdGVkIGRldmljZXNgKTtcbiAgICAgIH1cbiAgICAgIGVtUG9ydCA9IGFkYi5nZXRQb3J0RnJvbUVtdWxhdG9yU3RyaW5nKHVkaWQpO1xuICAgIH0gZWxzZSBpZiAob3B0cy5wbGF0Zm9ybVZlcnNpb24pIHtcbiAgICAgIG9wdHMucGxhdGZvcm1WZXJzaW9uID0gYCR7b3B0cy5wbGF0Zm9ybVZlcnNpb259YC50cmltKCk7XG5cbiAgICAgIC8vIGEgcGxhdGZvcm0gdmVyc2lvbiB3YXMgZ2l2ZW4uIGxldHMgdHJ5IHRvIGZpbmQgYSBkZXZpY2Ugd2l0aCB0aGUgc2FtZSBvc1xuICAgICAgbG9nZ2VyLmluZm8oYExvb2tpbmcgZm9yIGEgZGV2aWNlIHdpdGggQW5kcm9pZCAnJHtvcHRzLnBsYXRmb3JtVmVyc2lvbn0nYCk7XG5cbiAgICAgIC8vIGluIGNhc2Ugd2UgZmFpbCB0byBmaW5kIHNvbWV0aGluZywgZ2l2ZSB0aGUgdXNlciBhIHVzZWZ1bCBsb2cgdGhhdCBoYXNcbiAgICAgIC8vIHRoZSBkZXZpY2UgdWRpZHMgYW5kIG9zIHZlcnNpb25zIHNvIHRoZXkga25vdyB3aGF0J3MgYXZhaWxhYmxlXG4gICAgICBsZXQgYXZhaWxEZXZpY2VzU3RyID0gW107XG5cbiAgICAgIC8vIGZpcnN0IHRyeSBzdGFydGVkIGRldmljZXMvZW11bGF0b3JzXG4gICAgICBmb3IgKGxldCBkZXZpY2Ugb2YgZGV2aWNlcykge1xuICAgICAgICAvLyBkaXJlY3QgYWRiIGNhbGxzIHRvIHRoZSBzcGVjaWZpYyBkZXZpY2VcbiAgICAgICAgYXdhaXQgYWRiLnNldERldmljZUlkKGRldmljZS51ZGlkKTtcbiAgICAgICAgbGV0IGRldmljZU9TID0gYXdhaXQgYWRiLmdldFBsYXRmb3JtVmVyc2lvbigpO1xuXG4gICAgICAgIC8vIGJ1aWxkIHVwIG91ciBpbmZvIHN0cmluZyBvZiBhdmFpbGFibGUgZGV2aWNlcyBhcyB3ZSBpdGVyYXRlXG4gICAgICAgIGF2YWlsRGV2aWNlc1N0ci5wdXNoKGAke2RldmljZS51ZGlkfSAoJHtkZXZpY2VPU30pYCk7XG5cbiAgICAgICAgLy8gd2UgZG8gYSBiZWdpbnMgd2l0aCBjaGVjayBmb3IgaW1wbGllZCB3aWxkY2FyZCBtYXRjaGluZ1xuICAgICAgICAvLyBlZzogNCBtYXRjaGVzIDQuMSwgNC4wLCA0LjEuMy1zYW1zdW5nLCBldGNcbiAgICAgICAgaWYgKGRldmljZU9TLmluZGV4T2Yob3B0cy5wbGF0Zm9ybVZlcnNpb24pID09PSAwKSB7XG4gICAgICAgICAgdWRpZCA9IGRldmljZS51ZGlkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHdlIGNvdWxkbid0IGZpbmQgYW55dGhpbmchIHF1aXRcbiAgICAgIGlmICghdWRpZCkge1xuICAgICAgICBsb2dnZXIuZXJyb3JBbmRUaHJvdyhgVW5hYmxlIHRvIGZpbmQgYW4gYWN0aXZlIGRldmljZSBvciBlbXVsYXRvciBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHdpdGggT1MgJHtvcHRzLnBsYXRmb3JtVmVyc2lvbn0uIFRoZSBmb2xsb3dpbmcgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBhcmUgYXZhaWxhYmxlOiBgICsgYXZhaWxEZXZpY2VzU3RyLmpvaW4oJywgJykpO1xuICAgICAgfVxuXG4gICAgICBlbVBvcnQgPSBhZGIuZ2V0UG9ydEZyb21FbXVsYXRvclN0cmluZyh1ZGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYSB1ZGlkIHdhcyBub3QgZ2l2ZW4sIGdyYWIgdGhlIGZpcnN0IGRldmljZSB3ZSBzZWVcbiAgICAgIHVkaWQgPSBkZXZpY2VzWzBdLnVkaWQ7XG4gICAgICBlbVBvcnQgPSBhZGIuZ2V0UG9ydEZyb21FbXVsYXRvclN0cmluZyh1ZGlkKTtcbiAgICB9XG4gIH1cblxuICBsb2dnZXIuaW5mbyhgVXNpbmcgZGV2aWNlOiAke3VkaWR9YCk7XG4gIHJldHVybiB7dWRpZCwgZW1Qb3J0fTtcbn07XG5cbi8vIHJldHVybnMgYSBuZXcgYWRiIGluc3RhbmNlIHdpdGggZGV2aWNlSWQgc2V0XG5oZWxwZXJzLmNyZWF0ZUFEQiA9IGFzeW5jIGZ1bmN0aW9uIChvcHRzID0ge30pIHtcbiAgY29uc3Qge3VkaWQsIGVtUG9ydH0gPSBvcHRzO1xuICBjb25zdCBhZGIgPSBhd2FpdCBoZWxwZXJzLmNyZWF0ZUJhc2VBREIob3B0cyk7XG4gIGFkYi5zZXREZXZpY2VJZCh1ZGlkKTtcbiAgaWYgKGVtUG9ydCkge1xuICAgIGFkYi5zZXRFbXVsYXRvclBvcnQoZW1Qb3J0KTtcbiAgfVxuXG4gIHJldHVybiBhZGI7XG59O1xuXG5oZWxwZXJzLnZhbGlkYXRlUGFja2FnZUFjdGl2aXR5TmFtZXMgPSBmdW5jdGlvbiAob3B0cykge1xuICBmb3IgKGNvbnN0IGtleSBvZiBbJ2FwcFBhY2thZ2UnLCAnYXBwQWN0aXZpdHknLCAnYXBwV2FpdFBhY2thZ2UnLCAnYXBwV2FpdEFjdGl2aXR5J10pIHtcbiAgICBjb25zdCBuYW1lID0gb3B0c1trZXldO1xuICAgIGlmICghbmFtZSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgbWF0Y2ggPSAvKFteXFx3LiosXSkrLy5leGVjKG5hbWUpO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGxvZ2dlci53YXJuKGBDYXBhYmlsaXR5ICcke2tleX0nIGlzIGV4cGVjdGVkIHRvIG9ubHkgaW5jbHVkZSBsYXRpbiBsZXR0ZXJzLCBkaWdpdHMsIHVuZGVyc2NvcmUsIGRvdCwgY29tbWEgYW5kIGFzdGVyaXNrIGNoYXJhY3RlcnMuYCk7XG4gICAgbG9nZ2VyLndhcm4oYEN1cnJlbnQgdmFsdWUgJyR7bmFtZX0nIGhhcyBub24tbWF0Y2hpbmcgY2hhcmFjdGVyIGF0IGluZGV4ICR7bWF0Y2guaW5kZXh9OiAnJHtuYW1lLnN1YnN0cmluZygwLCBtYXRjaC5pbmRleCArIDEpfSdgKTtcbiAgfVxufTtcblxuaGVscGVycy5nZXRMYXVuY2hJbmZvID0gYXN5bmMgZnVuY3Rpb24gKGFkYiwgb3B0cykge1xuICBsZXQge2FwcCwgYXBwUGFja2FnZSwgYXBwQWN0aXZpdHksIGFwcFdhaXRQYWNrYWdlLCBhcHBXYWl0QWN0aXZpdHl9ID0gb3B0cztcbiAgaWYgKCFhcHApIHtcbiAgICBsb2dnZXIud2FybihcIk5vIGFwcCBzZW50IGluLCBub3QgcGFyc2luZyBwYWNrYWdlL2FjdGl2aXR5XCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMudmFsaWRhdGVQYWNrYWdlQWN0aXZpdHlOYW1lcyhvcHRzKTtcblxuICBpZiAoYXBwUGFja2FnZSAmJiBhcHBBY3Rpdml0eSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZ2dlci5kZWJ1ZyhcIlBhcnNpbmcgcGFja2FnZSBhbmQgYWN0aXZpdHkgZnJvbSBhcHAgbWFuaWZlc3RcIik7XG4gIGxldCB7YXBrUGFja2FnZSwgYXBrQWN0aXZpdHl9ID1cbiAgICBhd2FpdCBhZGIucGFja2FnZUFuZExhdW5jaEFjdGl2aXR5RnJvbU1hbmlmZXN0KGFwcCk7XG4gIGlmIChhcGtQYWNrYWdlICYmICFhcHBQYWNrYWdlKSB7XG4gICAgYXBwUGFja2FnZSA9IGFwa1BhY2thZ2U7XG4gIH1cbiAgaWYgKCFhcHBXYWl0UGFja2FnZSkge1xuICAgIGFwcFdhaXRQYWNrYWdlID0gYXBwUGFja2FnZTtcbiAgfVxuICBpZiAoYXBrQWN0aXZpdHkgJiYgIWFwcEFjdGl2aXR5KSB7XG4gICAgYXBwQWN0aXZpdHkgPSBhcGtBY3Rpdml0eTtcbiAgfVxuICBpZiAoIWFwcFdhaXRBY3Rpdml0eSkge1xuICAgIGFwcFdhaXRBY3Rpdml0eSA9IGFwcEFjdGl2aXR5O1xuICB9XG4gIGxvZ2dlci5kZWJ1ZyhgUGFyc2VkIHBhY2thZ2UgYW5kIGFjdGl2aXR5IGFyZTogJHthcGtQYWNrYWdlfS8ke2Fwa0FjdGl2aXR5fWApO1xuICByZXR1cm4ge2FwcFBhY2thZ2UsIGFwcFdhaXRQYWNrYWdlLCBhcHBBY3Rpdml0eSwgYXBwV2FpdEFjdGl2aXR5fTtcbn07XG5cbmhlbHBlcnMucmVzZXRBcHAgPSBhc3luYyBmdW5jdGlvbiAoYWRiLCBvcHRzID0ge30pIHtcbiAgY29uc3Qge1xuICAgIGFwcCxcbiAgICBhcHBQYWNrYWdlLFxuICAgIGZhc3RSZXNldCxcbiAgICBmdWxsUmVzZXQsXG4gICAgYW5kcm9pZEluc3RhbGxUaW1lb3V0ID0gUEFDS0FHRV9JTlNUQUxMX1RJTUVPVVQsXG4gICAgYXV0b0dyYW50UGVybWlzc2lvbnMsXG4gICAgYWxsb3dUZXN0UGFja2FnZXNcbiAgfSA9IG9wdHM7XG5cbiAgaWYgKCFhcHBQYWNrYWdlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiJ2FwcFBhY2thZ2UnIG9wdGlvbiBpcyByZXF1aXJlZFwiKTtcbiAgfVxuXG4gIGNvbnN0IGlzSW5zdGFsbGVkID0gYXdhaXQgYWRiLmlzQXBwSW5zdGFsbGVkKGFwcFBhY2thZ2UpO1xuXG4gIGlmIChpc0luc3RhbGxlZCkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhZGIuZm9yY2VTdG9wKGFwcFBhY2thZ2UpO1xuICAgIH0gY2F0Y2ggKGlnbikge31cbiAgICAvLyBmdWxsUmVzZXQgaGFzIHByaW9yaXR5IG92ZXIgZmFzdFJlc2V0XG4gICAgaWYgKCFmdWxsUmVzZXQgJiYgZmFzdFJlc2V0KSB7XG4gICAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCBhZGIuY2xlYXIoYXBwUGFja2FnZSk7XG4gICAgICBpZiAoXy5pc1N0cmluZyhvdXRwdXQpICYmIG91dHB1dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdmYWlsZWQnKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBjbGVhciB0aGUgYXBwbGljYXRpb24gZGF0YSBvZiAnJHthcHBQYWNrYWdlfScuIE9yaWdpbmFsIGVycm9yOiAke291dHB1dH1gKTtcbiAgICAgIH1cbiAgICAgIC8vIGV4ZWN1dGluZyBgc2hlbGwgcG0gY2xlYXJgIHJlc2V0cyBwcmV2aW91c2x5IGFzc2lnbmVkIGFwcGxpY2F0aW9uIHBlcm1pc3Npb25zIGFzIHdlbGxcbiAgICAgIGlmIChhdXRvR3JhbnRQZXJtaXNzaW9ucykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGFkYi5ncmFudEFsbFBlcm1pc3Npb25zKGFwcFBhY2thZ2UpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGxvZ2dlci5lcnJvcihgVW5hYmxlIHRvIGdyYW50IHBlcm1pc3Npb25zIHJlcXVlc3RlZC4gT3JpZ2luYWwgZXJyb3I6ICR7ZXJyb3IubWVzc2FnZX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbG9nZ2VyLmRlYnVnKGBQZXJmb3JtZWQgZmFzdCByZXNldCBvbiB0aGUgaW5zdGFsbGVkICcke2FwcFBhY2thZ2V9JyBhcHBsaWNhdGlvbiAoc3RvcCBhbmQgY2xlYXIpYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgaWYgKCFhcHApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCInYXBwJyBvcHRpb24gaXMgcmVxdWlyZWQgZm9yIHJlaW5zdGFsbFwiKTtcbiAgfVxuXG4gIGxvZ2dlci5kZWJ1ZyhgUnVubmluZyBmdWxsIHJlc2V0IG9uICcke2FwcFBhY2thZ2V9JyAocmVpbnN0YWxsKWApO1xuICBpZiAoaXNJbnN0YWxsZWQpIHtcbiAgICBhd2FpdCBhZGIudW5pbnN0YWxsQXBrKGFwcFBhY2thZ2UpO1xuICB9XG4gIGF3YWl0IGFkYi5pbnN0YWxsKGFwcCwge1xuICAgIGdyYW50UGVybWlzc2lvbnM6IGF1dG9HcmFudFBlcm1pc3Npb25zLFxuICAgIHRpbWVvdXQ6IGFuZHJvaWRJbnN0YWxsVGltZW91dCxcbiAgICBhbGxvd1Rlc3RQYWNrYWdlcyxcbiAgfSk7XG59O1xuXG5oZWxwZXJzLmluc3RhbGxBcGsgPSBhc3luYyBmdW5jdGlvbiAoYWRiLCBvcHRzID0ge30pIHtcbiAgY29uc3Qge1xuICAgIGFwcCxcbiAgICBhcHBQYWNrYWdlLFxuICAgIGZhc3RSZXNldCxcbiAgICBmdWxsUmVzZXQsXG4gICAgYW5kcm9pZEluc3RhbGxUaW1lb3V0ID0gUEFDS0FHRV9JTlNUQUxMX1RJTUVPVVQsXG4gICAgYXV0b0dyYW50UGVybWlzc2lvbnMsXG4gICAgYWxsb3dUZXN0UGFja2FnZXNcbiAgfSA9IG9wdHM7XG5cbiAgaWYgKCFhcHAgfHwgIWFwcFBhY2thZ2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCInYXBwJyBhbmQgJ2FwcFBhY2thZ2UnIG9wdGlvbnMgYXJlIHJlcXVpcmVkXCIpO1xuICB9XG5cbiAgaWYgKGZ1bGxSZXNldCkge1xuICAgIGF3YWl0IHRoaXMucmVzZXRBcHAoYWRiLCBvcHRzKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBUaGVyZSBpcyBubyBuZWVkIHRvIHJlc2V0IHRoZSBuZXdseSBpbnN0YWxsZWQgYXBwXG4gIGNvbnN0IHNob3VsZFBlcmZvcm1GYXN0UmVzZXQgPSBmYXN0UmVzZXQgJiYgYXdhaXQgYWRiLmlzQXBwSW5zdGFsbGVkKGFwcFBhY2thZ2UpO1xuXG4gIGF3YWl0IGFkYi5pbnN0YWxsT3JVcGdyYWRlKGFwcCwgYXBwUGFja2FnZSwge1xuICAgIGdyYW50UGVybWlzc2lvbnM6IGF1dG9HcmFudFBlcm1pc3Npb25zLFxuICAgIHRpbWVvdXQ6IGFuZHJvaWRJbnN0YWxsVGltZW91dCxcbiAgICBhbGxvd1Rlc3RQYWNrYWdlcyxcbiAgfSk7XG5cbiAgaWYgKHNob3VsZFBlcmZvcm1GYXN0UmVzZXQpIHtcbiAgICBsb2dnZXIuaW5mbyhgUGVyZm9ybWluZyBmYXN0IHJlc2V0IG9uICcke2FwcFBhY2thZ2V9J2ApO1xuICAgIGF3YWl0IHRoaXMucmVzZXRBcHAoYWRiLCBvcHRzKTtcbiAgfVxufTtcblxuLyoqXG4gKiBJbnN0YWxscyBhbiBhcnJheSBvZiBhcGtzXG4gKiBAcGFyYW0ge0FEQn0gYWRiIEluc3RhbmNlIG9mIEFwcGl1bSBBREIgb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRzIGRlZmluZWQgaW4gZHJpdmVyLmpzXG4gKi9cbmhlbHBlcnMuaW5zdGFsbE90aGVyQXBrcyA9IGFzeW5jIGZ1bmN0aW9uIChvdGhlckFwcHMsIGFkYiwgb3B0cykge1xuICBsZXQge1xuICAgIGFuZHJvaWRJbnN0YWxsVGltZW91dCA9IFBBQ0tBR0VfSU5TVEFMTF9USU1FT1VULFxuICAgIGF1dG9HcmFudFBlcm1pc3Npb25zLFxuICAgIGFsbG93VGVzdFBhY2thZ2VzXG4gIH0gPSBvcHRzO1xuXG4gIC8vIEluc3RhbGwgYWxsIG9mIHRoZSBBUEsncyBhc3luY2hyb25vdXNseVxuICBhd2FpdCBCLmFsbChvdGhlckFwcHMubWFwKChvdGhlckFwcCkgPT4ge1xuICAgIGxvZ2dlci5kZWJ1ZyhgSW5zdGFsbGluZyBhcHA6ICR7b3RoZXJBcHB9YCk7XG4gICAgcmV0dXJuIGFkYi5pbnN0YWxsT3JVcGdyYWRlKG90aGVyQXBwLCBudWxsLCB7XG4gICAgICBncmFudFBlcm1pc3Npb25zOiBhdXRvR3JhbnRQZXJtaXNzaW9ucyxcbiAgICAgIHRpbWVvdXQ6IGFuZHJvaWRJbnN0YWxsVGltZW91dCxcbiAgICAgIGFsbG93VGVzdFBhY2thZ2VzLFxuICAgIH0pO1xuICB9KSk7XG59O1xuXG5oZWxwZXJzLmluaXRVbmljb2RlS2V5Ym9hcmQgPSBhc3luYyBmdW5jdGlvbiAoYWRiKSB7XG4gIGxvZ2dlci5kZWJ1ZygnRW5hYmxpbmcgVW5pY29kZSBrZXlib2FyZCBzdXBwb3J0Jyk7XG4gIGxvZ2dlci5kZWJ1ZyhcIlB1c2hpbmcgdW5pY29kZSBpbWUgdG8gZGV2aWNlLi4uXCIpO1xuICB0cnkge1xuICAgIGF3YWl0IGFkYi5pbnN0YWxsKHVuaWNvZGVJTUVQYXRoLCB7cmVwbGFjZTogZmFsc2V9KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nZ2VyLmluZm8oYFBlcmZvcm1pbmcgZnVsbCByZWluc3RhbGwgb2YgJHtVTklDT0RFX0lNRV9QS0dfSUR9IGFzIGEgcG9zc2libGUgZml4IGZvcjogJHtlcnIubWVzc2FnZX1gKTtcbiAgICBhd2FpdCBhZGIudW5pbnN0YWxsQXBrKFVOSUNPREVfSU1FX1BLR19JRCk7XG4gICAgYXdhaXQgYWRiLmluc3RhbGwodW5pY29kZUlNRVBhdGgsIHtyZXBsYWNlOiBmYWxzZX0pO1xuICB9XG5cbiAgLy8gZ2V0IHRoZSBkZWZhdWx0IElNRSBzbyB3ZSBjYW4gcmV0dXJuIGJhY2sgdG8gaXQgbGF0ZXIgaWYgd2Ugd2FudFxuICBsZXQgZGVmYXVsdElNRSA9IGF3YWl0IGFkYi5kZWZhdWx0SU1FKCk7XG5cbiAgbG9nZ2VyLmRlYnVnKGBVbnNldHRpbmcgcHJldmlvdXMgSU1FICR7ZGVmYXVsdElNRX1gKTtcbiAgY29uc3QgYXBwaXVtSU1FID0gYCR7VU5JQ09ERV9JTUVfUEtHX0lEfS8uVW5pY29kZUlNRWA7XG4gIGxvZ2dlci5kZWJ1ZyhgU2V0dGluZyBJTUUgdG8gJyR7YXBwaXVtSU1FfSdgKTtcbiAgYXdhaXQgYWRiLmVuYWJsZUlNRShhcHBpdW1JTUUpO1xuICBhd2FpdCBhZGIuc2V0SU1FKGFwcGl1bUlNRSk7XG4gIHJldHVybiBkZWZhdWx0SU1FO1xufTtcblxuaGVscGVycy5zZXRNb2NrTG9jYXRpb25BcHAgPSBhc3luYyBmdW5jdGlvbiAoYWRiLCBhcHApIHtcbiAgdHJ5IHtcbiAgICBpZiAoYXdhaXQgYWRiLmdldEFwaUxldmVsKCkgPCAyMykge1xuICAgICAgYXdhaXQgYWRiLnNoZWxsKFsnc2V0dGluZ3MnLCAncHV0JywgJ3NlY3VyZScsICdtb2NrX2xvY2F0aW9uJywgJzEnXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IGFkYi5zaGVsbChbJ2FwcG9wcycsICdzZXQnLCBhcHAsICdhbmRyb2lkOm1vY2tfbG9jYXRpb24nLCAnYWxsb3cnXSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBsb2dnZXIud2FybihgVW5hYmxlIHRvIHNldCBtb2NrIGxvY2F0aW9uIGZvciBhcHAgJyR7YXBwfSc6ICR7ZXJyLm1lc3NhZ2V9YCk7XG4gIH1cbn07XG5cbmhlbHBlcnMuaW5zdGFsbEhlbHBlckFwcCA9IGFzeW5jIGZ1bmN0aW9uIChhZGIsIGFwa1BhdGgsIHBhY2thZ2VJZCwgYXBwTmFtZSkge1xuICB0cnkge1xuICAgIGF3YWl0IGFkYi5pbnN0YWxsT3JVcGdyYWRlKGFwa1BhdGgsIHBhY2thZ2VJZCwge2dyYW50UGVybWlzc2lvbnM6IHRydWV9KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgbG9nZ2VyLndhcm4oYElnbm9yZWQgZXJyb3Igd2hpbGUgaW5zdGFsbGluZyBBcHBpdW0gJHthcHBOYW1lfSBoZWxwZXI6IGAgK1xuICAgICAgICAgICAgICAgIGAnJHtlcnIubWVzc2FnZX0nLiBNYW51YWxseSB1bmluc3RhbGxpbmcgdGhlIGFwcGxpY2F0aW9uIGAgK1xuICAgICAgICAgICAgICAgIGB3aXRoIHBhY2thZ2UgaWQgJyR7cGFja2FnZUlkfScgbWF5IGhlbHAuIEV4cGVjdCBzb21lIEFwcGl1bSBgICtcbiAgICAgICAgICAgICAgICBgZmVhdHVyZXMgbWF5IG5vdCB3b3JrIGFzIGV4cGVjdGVkIHVubGVzcyB0aGlzIHByb2JsZW0gaXMgYCArXG4gICAgICAgICAgICAgICAgYGZpeGVkLmApO1xuICB9XG59O1xuXG5oZWxwZXJzLnB1c2hTZXR0aW5nc0FwcCA9IGFzeW5jIGZ1bmN0aW9uIChhZGIsIHRocm93RXJyb3IgPSBmYWxzZSkge1xuICBsb2dnZXIuZGVidWcoXCJQdXNoaW5nIHNldHRpbmdzIGFwayB0byBkZXZpY2UuLi5cIik7XG5cbiAgYXdhaXQgaGVscGVycy5pbnN0YWxsSGVscGVyQXBwKGFkYiwgc2V0dGluZ3NBcGtQYXRoLCBTRVRUSU5HU19IRUxQRVJfUEtHX0lELCAnU2V0dGluZ3MnKTtcblxuICAvLyBSZWluc3RhbGwgd2lsbCBzdG9wIHRoZSBzZXR0aW5ncyBoZWxwZXIgcHJvY2VzcyBhbnl3YXksIHNvXG4gIC8vIHRoZXJlIGlzIG5vIG5lZWQgdG8gY29udGludWUgaWYgdGhlIGFwcGxpY2F0aW9uIGlzIHN0aWxsIHJ1bm5pbmdcbiAgaWYgKGF3YWl0IGFkYi5wcm9jZXNzRXhpc3RzKFNFVFRJTkdTX0hFTFBFUl9QS0dfSUQpKSB7XG4gICAgbG9nZ2VyLmRlYnVnKGAke1NFVFRJTkdTX0hFTFBFUl9QS0dfSUR9IGlzIGFscmVhZHkgcnVubmluZy4gYCArXG4gICAgICAgICAgICAgICAgIGBUaGVyZSBpcyBubyBuZWVkIHRvIHJlc2V0IGl0cyBwZXJtaXNzaW9ucy5gKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBsYXVjaCBpby5hcHBpdW0uc2V0dGluZ3MgYXBwIGR1ZSB0byBzZXR0aW5ncyBmYWlsaW5nIHRvIGJlIHNldFxuICAvLyBpZiB0aGUgYXBwIGlzIG5vdCBsYXVuY2hlZCBwcmlvciB0byBzdGFydCB0aGUgc2Vzc2lvbiBvbiBhbmRyb2lkIDcrXG4gIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXBwaXVtL2FwcGl1bS9pc3N1ZXMvODk1N1xuICB0cnkge1xuICAgIGF3YWl0IGFkYi5zdGFydEFwcCh7XG4gICAgICBwa2c6IFNFVFRJTkdTX0hFTFBFUl9QS0dfSUQsXG4gICAgICBhY3Rpdml0eTogU0VUVElOR1NfSEVMUEVSX1BLR19BQ1RJVklUWSxcbiAgICAgIGFjdGlvbjogXCJhbmRyb2lkLmludGVudC5hY3Rpb24uTUFJTlwiLFxuICAgICAgY2F0ZWdvcnk6IFwiYW5kcm9pZC5pbnRlbnQuY2F0ZWdvcnkuTEFVTkNIRVJcIixcbiAgICAgIGZsYWdzOiBcIjB4MTAyMDAwMDBcIixcbiAgICAgIHN0b3BBcHA6IGZhbHNlLFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBsb2dnZXIud2FybihgRmFpbGVkIHRvIGxhdW5jaCBzZXR0aW5ncyBhcHA6ICR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgaWYgKHRocm93RXJyb3IpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cbn07XG5cbmhlbHBlcnMucHVzaFVubG9jayA9IGFzeW5jIGZ1bmN0aW9uIChhZGIpIHtcbiAgbG9nZ2VyLmRlYnVnKFwiUHVzaGluZyB1bmxvY2sgaGVscGVyIGFwcCB0byBkZXZpY2UuLi5cIik7XG5cbiAgYXdhaXQgaGVscGVycy5pbnN0YWxsSGVscGVyQXBwKGFkYiwgdW5sb2NrQXBrUGF0aCwgVU5MT0NLX0hFTFBFUl9QS0dfSUQsICdVbmxvY2snKTtcbn07XG5cbi8qKlxuICogRXh0cmFjdHMgc3RyaW5nLnhtbCBhbmQgY29udmVydHMgaXQgdG8gc3RyaW5nLmpzb24gYW5kIHB1c2hlc1xuICogaXQgdG8gL2RhdGEvbG9jYWwvdG1wL3N0cmluZy5qc29uIG9uIGZvciB1c2Ugb2YgYm9vdHN0cmFwXG4gKiBJZiBhcHAgaXMgbm90IHByZXNlbnQgdG8gZXh0cmFjdCBzdHJpbmcueG1sIGl0IGRlbGV0ZXMgcmVtb3RlIHN0cmluZ3MuanNvblxuICogSWYgYXBwIGRvZXMgbm90IGhhdmUgc3RyaW5ncy54bWwgd2UgcHVzaCBhbiBlbXB0eSBqc29uIG9iamVjdCB0byByZW1vdGVcbiAqXG4gKiBAcGFyYW0gez9zdHJpbmd9IGxhbmd1YWdlIC0gTGFuZ3VhZ2UgYWJicmV2aWF0aW9uLCBmb3IgZXhhbXBsZSAnZnInLiBUaGUgZGVmYXVsdCBsYW5ndWFnZVxuICogaXMgdXNlZCBpZiB0aGlzIGFyZ3VtZW50IGlzIG5vdCBkZWZpbmVkLlxuICogQHBhcmFtIHtPYmplY3R9IGFkYiAtIFRoZSBhZGIgbW9mZHVsZSBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gRHJpdmVyIG9wdGlvbnMgZGljdGlvbmFyeS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkaWN0aW9uYXJ5LCB3aGVyZSBzdHJpbmcgcmVzb3VydGNlcyBpZGVudGlmaWVycyBhcmUga2V5c1xuICogYWxvbmcgd2l0aCB0aGVpciBjb3JyZXNwb25kaW5nIHZhbHVlcyBmb3IgdGhlIGdpdmVuIGxhbmd1YWdlIG9yIGFuIGVtcHR5IG9iamVjdFxuICogaWYgbm8gbWF0Y2hpbmcgcmVzb3VyY2VzIHdlcmUgZXh0cmFjdGVkLlxuICovXG5oZWxwZXJzLnB1c2hTdHJpbmdzID0gYXN5bmMgZnVuY3Rpb24gKGxhbmd1YWdlLCBhZGIsIG9wdHMpIHtcbiAgY29uc3QgcmVtb3RlRGlyID0gJy9kYXRhL2xvY2FsL3RtcCc7XG4gIGNvbnN0IHN0cmluZ3NKc29uID0gJ3N0cmluZ3MuanNvbic7XG4gIGNvbnN0IHJlbW90ZUZpbGUgPSBgJHtyZW1vdGVEaXJ9LyR7c3RyaW5nc0pzb259YDtcblxuICAvLyBjbGVhbiB1cCByZW1vdGUgc3RyaW5nLmpzb24gaWYgcHJlc2VudFxuICBhd2FpdCBhZGIucmltcmFmKHJlbW90ZUZpbGUpO1xuXG4gIGlmIChfLmlzRW1wdHkob3B0cy5hcHBQYWNrYWdlKSB8fCAhKGF3YWl0IGZzLmV4aXN0cyhvcHRzLmFwcCkpKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgY29uc3Qgc3RyaW5nc1RtcERpciA9IHBhdGgucmVzb2x2ZShvcHRzLnRtcERpciwgb3B0cy5hcHBQYWNrYWdlKTtcbiAgdHJ5IHtcbiAgICBsb2dnZXIuZGVidWcoJ0V4dHJhY3Rpbmcgc3RyaW5ncyBmcm9tIGFwaycsIG9wdHMuYXBwLCBsYW5ndWFnZSwgc3RyaW5nc1RtcERpcik7XG4gICAgY29uc3Qge2Fwa1N0cmluZ3MsIGxvY2FsUGF0aH0gPSBhd2FpdCBhZGIuZXh0cmFjdFN0cmluZ3NGcm9tQXBrKG9wdHMuYXBwLCBsYW5ndWFnZSwgc3RyaW5nc1RtcERpcik7XG4gICAgYXdhaXQgYWRiLnB1c2gobG9jYWxQYXRoLCByZW1vdGVEaXIpO1xuICAgIHJldHVybiBhcGtTdHJpbmdzO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBsb2dnZXIud2FybihgQ291bGQgbm90IGdldCBzdHJpbmdzLCBjb250aW51aW5nIGFueXdheS4gT3JpZ2luYWwgZXJyb3I6ICR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgYXdhaXQgYWRiLnNoZWxsKCdlY2hvJywgW2Ane30nID4gJHtyZW1vdGVGaWxlfWBdKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCBmcy5yaW1yYWYoc3RyaW5nc1RtcERpcik7XG4gIH1cbiAgcmV0dXJuIHt9O1xufTtcblxuaGVscGVycy51bmxvY2tXaXRoVUlBdXRvbWF0aW9uID0gYXN5bmMgZnVuY3Rpb24gKGRyaXZlciwgYWRiLCB1bmxvY2tDYXBhYmlsaXRpZXMpIHtcbiAgbGV0IHVubG9ja1R5cGUgPSB1bmxvY2tDYXBhYmlsaXRpZXMudW5sb2NrVHlwZTtcbiAgaWYgKCF1bmxvY2tlci5pc1ZhbGlkVW5sb2NrVHlwZSh1bmxvY2tUeXBlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB1bmxvY2sgdHlwZSAke3VubG9ja1R5cGV9YCk7XG4gIH1cbiAgbGV0IHVubG9ja0tleSA9IHVubG9ja0NhcGFiaWxpdGllcy51bmxvY2tLZXk7XG4gIGlmICghdW5sb2NrZXIuaXNWYWxpZEtleSh1bmxvY2tUeXBlLCB1bmxvY2tLZXkpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIHVubG9ja0tleSAke3VubG9ja0tleX0gY2FwYWJpbGl0eSBmb3IgdW5sb2NrVHlwZSAke3VubG9ja1R5cGV9YCk7XG4gIH1cbiAgY29uc3QgdW5sb2NrTWV0aG9kID0ge1xuICAgIFtQSU5fVU5MT0NLXTogdW5sb2NrZXIucGluVW5sb2NrLFxuICAgIFtQQVNTV09SRF9VTkxPQ0tdOiB1bmxvY2tlci5wYXNzd29yZFVubG9jayxcbiAgICBbUEFUVEVSTl9VTkxPQ0tdOiB1bmxvY2tlci5wYXR0ZXJuVW5sb2NrLFxuICAgIFtGSU5HRVJQUklOVF9VTkxPQ0tdOiB1bmxvY2tlci5maW5nZXJwcmludFVubG9ja1xuICB9W3VubG9ja1R5cGVdO1xuICBhd2FpdCB1bmxvY2tNZXRob2QoYWRiLCBkcml2ZXIsIHVubG9ja0NhcGFiaWxpdGllcyk7XG59O1xuXG5oZWxwZXJzLnVubG9ja1dpdGhIZWxwZXJBcHAgPSBhc3luYyBmdW5jdGlvbiAoYWRiKSB7XG4gIGxvZ2dlci5pbmZvKFwiVW5sb2NraW5nIHNjcmVlblwiKTtcblxuICB0cnkge1xuICAgIGF3YWl0IGFkYi5mb3JjZVN0b3AoVU5MT0NLX0hFTFBFUl9QS0dfSUQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gU29tZXRpbWVzIHdlIGNhbiBzZWUgdGhlIGJlbG93IGVycm9yLCBidXQgd2UgY2FuIGlnbm9yZSBpdC5cbiAgICAvLyBbVzNDXSBFbmNvdW50ZXJlZCBpbnRlcm5hbCBlcnJvciBydW5uaW5nIGNvbW1hbmQ6IEVycm9yOiBFcnJvciBleGVjdXRpbmcgYWRiRXhlYy4gT3JpZ2luYWwgZXJyb3I6ICdDb21tYW5kICdhZGIgLVAgNTAzNyAtcyBlbXVsYXRvci01NTU0IHNoZWxsIGFtIGZvcmNlLXN0b3AgaW8uYXBwaXVtLnVubG9jaycgdGltZWQgb3V0IGFmdGVyIDIwMDAwbXMnOyBTdGRlcnI6ICcnOyBDb2RlOiAnbnVsbCdcbiAgICBsb2dnZXIud2FybihgQW4gZXJyb3IgaW4gdW5sb2NrV2l0aEhlbHBlckFwcDogJHtlLm1lc3NhZ2V9YCk7XG4gIH1cblxuICBsZXQgc3RhcnRPcHRzID0ge1xuICAgIHBrZzogVU5MT0NLX0hFTFBFUl9QS0dfSUQsXG4gICAgYWN0aXZpdHk6IFVOTE9DS19IRUxQRVJfUEtHX0FDVElWSVRZLFxuICAgIGFjdGlvbjogXCJhbmRyb2lkLmludGVudC5hY3Rpb24uTUFJTlwiLFxuICAgIGNhdGVnb3J5OiBcImFuZHJvaWQuaW50ZW50LmNhdGVnb3J5LkxBVU5DSEVSXCIsXG4gICAgZmxhZ3M6IFwiMHgxMDIwMDAwMFwiLFxuICAgIHN0b3BBcHA6IGZhbHNlLFxuICAgIHJldHJ5OiBmYWxzZSxcbiAgICB3YWl0RHVyYXRpb246IDEwMDBcbiAgfTtcblxuICAvLyBVbmxvY2sgc3VjY2VlZCB3aXRoIGEgY291cGxlIG9mIHJldHJpZXMuXG4gIGxldCBmaXJzdFJ1biA9IHRydWU7XG4gIGF3YWl0IHJldHJ5KDMsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUbyByZWR1Y2UgYSB0aW1lIHRvIGNhbGwgYWRiLmlzU2NyZWVuTG9ja2VkKCkgc2luY2UgYGFkYiBzaGVsbCBkdW1wc3lzIHdpbmRvd2AgaXMgZWFzeSB0byBoYW5nIGFkYiBjb21tYW5kc1xuICAgIGlmIChmaXJzdFJ1bikge1xuICAgICAgZmlyc3RSdW4gPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCEoYXdhaXQgYWRiLmlzU2NyZWVuTG9ja2VkKCkpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ2dlci53YXJuKGBFcnJvciBpbiBpc1NjcmVlbkxvY2tlZDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgICAgIGxvZ2dlci53YXJuKFwiXFxcImFkYiBzaGVsbCBkdW1wc3lzIHdpbmRvd1xcXCIgY29tbWFuZCBoYXMgdGltZWQgb3V0LlwiKTtcbiAgICAgICAgbG9nZ2VyLndhcm4oXCJUaGUgcmVhc29uIG9mIHRoaXMgdGltZW91dCBpcyB0aGUgZGVsYXllZCBhZGIgcmVzcG9uc2UuIFJlc2V0dGluZyBhZGIgc2VydmVyIGNhbiBpbXByb3ZlIGl0LlwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsb2dnZXIuaW5mbyhgTGF1bmNoaW5nICR7VU5MT0NLX0hFTFBFUl9QS0dfSUR9YCk7XG5cbiAgICAvLyBUaGUgY29tbWFuZCB0YWtlcyB0b28gbXVjaCB0aW1lIHNvIHdlIHNob3VsZCBub3QgY2FsbCB0aGUgY29tbWFuZCBvdmVyIHR3aWNlIGNvbnRpbnVvdXNseS5cbiAgICBhd2FpdCBhZGIuc3RhcnRBcHAoc3RhcnRPcHRzKTtcbiAgfSk7XG59O1xuXG5oZWxwZXJzLnVubG9jayA9IGFzeW5jIGZ1bmN0aW9uIChkcml2ZXIsIGFkYiwgY2FwYWJpbGl0aWVzKSB7XG4gIGlmICghKGF3YWl0IGFkYi5pc1NjcmVlbkxvY2tlZCgpKSkge1xuICAgIGxvZ2dlci5pbmZvKFwiU2NyZWVuIGFscmVhZHkgdW5sb2NrZWQsIGRvaW5nIG5vdGhpbmdcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbG9nZ2VyLmRlYnVnKFwiU2NyZWVuIGlzIGxvY2tlZCwgdHJ5aW5nIHRvIHVubG9ja1wiKTtcbiAgaWYgKF8uaXNVbmRlZmluZWQoY2FwYWJpbGl0aWVzLnVubG9ja1R5cGUpKSB7XG4gICAgbG9nZ2VyLndhcm4oXCJVc2luZyBhcHAgdW5sb2NrLCB0aGlzIGlzIGdvaW5nIHRvIGJlIGRlcHJlY2F0ZWQhXCIpO1xuICAgIGF3YWl0IGhlbHBlcnMudW5sb2NrV2l0aEhlbHBlckFwcChhZGIpO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IGhlbHBlcnMudW5sb2NrV2l0aFVJQXV0b21hdGlvbihkcml2ZXIsIGFkYiwge3VubG9ja1R5cGU6IGNhcGFiaWxpdGllcy51bmxvY2tUeXBlLCB1bmxvY2tLZXk6IGNhcGFiaWxpdGllcy51bmxvY2tLZXl9KTtcbiAgICBhd2FpdCBoZWxwZXJzLnZlcmlmeVVubG9jayhhZGIpO1xuICB9XG59O1xuXG5oZWxwZXJzLnZlcmlmeVVubG9jayA9IGFzeW5jIGZ1bmN0aW9uIChhZGIpIHtcbiAgYXdhaXQgcmV0cnlJbnRlcnZhbCgyLCAxMDAwLCBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGF3YWl0IGFkYi5pc1NjcmVlbkxvY2tlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTY3JlZW4gZGlkIG5vdCB1bmxvY2sgc3VjY2Vzc2Z1bGx5LCByZXRyeWluZ1wiKTtcbiAgICB9XG4gICAgbG9nZ2VyLmRlYnVnKFwiU2NyZWVuIHVubG9ja2VkIHN1Y2Nlc3NmdWxseVwiKTtcbiAgfSk7XG59O1xuXG5oZWxwZXJzLmluaXREZXZpY2UgPSBhc3luYyBmdW5jdGlvbiAoYWRiLCBvcHRzKSB7XG4gIGF3YWl0IGFkYi53YWl0Rm9yRGV2aWNlKCk7XG4gIC8vIHB1c2hTZXR0aW5nc0FwcCByZXF1aXJlZCBiZWZvcmUgY2FsbGluZyBlbnN1cmVEZXZpY2VMb2NhbGUgZm9yIEFQSSBMZXZlbCAyNCtcbiAgYXdhaXQgaGVscGVycy5wdXNoU2V0dGluZ3NBcHAoYWRiKTtcbiAgaWYgKCFvcHRzLmF2ZCkge1xuICAgIGF3YWl0IGhlbHBlcnMuc2V0TW9ja0xvY2F0aW9uQXBwKGFkYiwgU0VUVElOR1NfSEVMUEVSX1BLR19JRCk7XG4gIH1cblxuICBhd2FpdCBoZWxwZXJzLmVuc3VyZURldmljZUxvY2FsZShhZGIsIG9wdHMubGFuZ3VhZ2UsIG9wdHMubG9jYWxlKTtcbiAgYXdhaXQgYWRiLnN0YXJ0TG9nY2F0KCk7XG4gIGxldCBkZWZhdWx0SU1FO1xuICBpZiAob3B0cy51bmljb2RlS2V5Ym9hcmQpIHtcbiAgICBkZWZhdWx0SU1FID0gYXdhaXQgaGVscGVycy5pbml0VW5pY29kZUtleWJvYXJkKGFkYik7XG4gIH1cbiAgaWYgKF8uaXNVbmRlZmluZWQob3B0cy51bmxvY2tUeXBlKSkge1xuICAgIGF3YWl0IGhlbHBlcnMucHVzaFVubG9jayhhZGIpO1xuICB9XG4gIHJldHVybiBkZWZhdWx0SU1FO1xufTtcblxuaGVscGVycy5yZW1vdmVOdWxsUHJvcGVydGllcyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgZm9yIChsZXQga2V5IG9mIF8ua2V5cyhvYmopKSB7XG4gICAgaWYgKF8uaXNOdWxsKG9ialtrZXldKSB8fCBfLmlzVW5kZWZpbmVkKG9ialtrZXldKSkge1xuICAgICAgZGVsZXRlIG9ialtrZXldO1xuICAgIH1cbiAgfVxufTtcblxuaGVscGVycy50cnVuY2F0ZURlY2ltYWxzID0gZnVuY3Rpb24gKG51bWJlciwgZGlnaXRzKSB7XG4gIGxldCBtdWx0aXBsaWVyID0gTWF0aC5wb3coMTAsIGRpZ2l0cyksXG4gICAgICBhZGp1c3RlZE51bSA9IG51bWJlciAqIG11bHRpcGxpZXIsXG4gICAgICB0cnVuY2F0ZWROdW0gPSBNYXRoW2FkanVzdGVkTnVtIDwgMCA/ICdjZWlsJyA6ICdmbG9vciddKGFkanVzdGVkTnVtKTtcblxuICByZXR1cm4gdHJ1bmNhdGVkTnVtIC8gbXVsdGlwbGllcjtcbn07XG5cbmhlbHBlcnMuaXNDaHJvbWVCcm93c2VyID0gZnVuY3Rpb24gKGJyb3dzZXIpIHtcbiAgcmV0dXJuIF8uaW5jbHVkZXMoT2JqZWN0LmtleXMoQ0hST01FX0JST1dTRVJfUEFDS0FHRV9BQ1RJVklUWSksIChicm93c2VyIHx8ICcnKS50b0xvd2VyQ2FzZSgpKTtcbn07XG5cbmhlbHBlcnMuZ2V0Q2hyb21lUGtnID0gZnVuY3Rpb24gKGJyb3dzZXIpIHtcbiAgcmV0dXJuIENIUk9NRV9CUk9XU0VSX1BBQ0tBR0VfQUNUSVZJVFlbYnJvd3Nlci50b0xvd2VyQ2FzZSgpXSB8fFxuICAgICAgICAgQ0hST01FX0JST1dTRVJfUEFDS0FHRV9BQ1RJVklUWS5kZWZhdWx0O1xufTtcblxuaGVscGVycy5yZW1vdmVBbGxTZXNzaW9uV2ViU29ja2V0SGFuZGxlcnMgPSBhc3luYyBmdW5jdGlvbiAoc2VydmVyLCBzZXNzaW9uSWQpIHtcbiAgaWYgKCFzZXJ2ZXIgfHwgIV8uaXNGdW5jdGlvbihzZXJ2ZXIuZ2V0V2ViU29ja2V0SGFuZGxlcnMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYWN0aXZlSGFuZGxlcnMgPSBhd2FpdCBzZXJ2ZXIuZ2V0V2ViU29ja2V0SGFuZGxlcnMoc2Vzc2lvbklkKTtcbiAgZm9yIChjb25zdCBwYXRobmFtZSBvZiBfLmtleXMoYWN0aXZlSGFuZGxlcnMpKSB7XG4gICAgYXdhaXQgc2VydmVyLnJlbW92ZVdlYlNvY2tldEhhbmRsZXIocGF0aG5hbWUpO1xuICB9XG59O1xuXG4vKipcbiAqIFRha2VzIGEgZGVzaXJlZCBjYXBhYmlsaXR5IGFuZCB0cmllcyB0byBKU09OLnBhcnNlIGl0IGFzIGFuIGFycmF5LFxuICogYW5kIGVpdGhlciByZXR1cm5zIHRoZSBwYXJzZWQgYXJyYXkgb3IgYSBzaW5nbGV0b24gYXJyYXkuXG4gKlxuICogQHBhcmFtIHthbnl9IGNhcCBBIGRlc2lyZWQgY2FwYWJpbGl0eVxuICovXG5oZWxwZXJzLnBhcnNlQXJyYXkgPSBmdW5jdGlvbiAoY2FwKSB7XG4gIGxldCBwYXJzZWRDYXBzO1xuICB0cnkge1xuICAgIHBhcnNlZENhcHMgPSBKU09OLnBhcnNlKGNhcCk7XG4gIH0gY2F0Y2ggKGlnbikgeyB9XG5cbiAgaWYgKF8uaXNBcnJheShwYXJzZWRDYXBzKSkge1xuICAgIHJldHVybiBwYXJzZWRDYXBzO1xuICB9IGVsc2UgaWYgKF8uaXNTdHJpbmcoY2FwKSkge1xuICAgIHJldHVybiBbY2FwXTtcbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihgbXVzdCBwcm92aWRlIGEgc3RyaW5nIG9yIEpTT04gQXJyYXk7IHJlY2VpdmVkICR7Y2FwfWApO1xufTtcblxuaGVscGVycy52YWxpZGF0ZURlc2lyZWRDYXBzID0gZnVuY3Rpb24gKGNhcHMpIHtcbiAgLy8gbWFrZSBzdXJlIHRoYXQgdGhlIGNhcGFiaWxpdGllcyBoYXZlIG9uZSBvZiBgYXBwYCwgYGFwcFBhY2thZ2VgIG9yIGBicm93c2VyYFxuICBpZiAoKCFjYXBzLmJyb3dzZXJOYW1lIHx8ICF0aGlzLmlzQ2hyb21lQnJvd3NlcihjYXBzLmJyb3dzZXJOYW1lKSkgJiYgIWNhcHMuYXBwICYmICFjYXBzLmFwcFBhY2thZ2UpIHtcbiAgICBsb2dnZXIuZXJyb3JBbmRUaHJvdygnVGhlIGRlc2lyZWQgY2FwYWJpbGl0aWVzIG11c3QgaW5jbHVkZSBlaXRoZXIgYW4gYXBwLCBhcHBQYWNrYWdlIG9yIGJyb3dzZXJOYW1lJyk7XG4gIH1cbiAgaWYgKGNhcHMuYnJvd3Nlck5hbWUpIHtcbiAgICBpZiAoY2Fwcy5hcHApIHtcbiAgICAgIC8vIHdhcm4gaWYgdGhlIGNhcGFiaWxpdGllcyBoYXZlIGJvdGggYGFwcGAgYW5kIGBicm93c2VyLCBhbHRob3VnaCB0aGlzIGlzIGNvbW1vbiB3aXRoIHNlbGVuaXVtIGdyaWRcbiAgICAgIGxvZ2dlci53YXJuKCdUaGUgZGVzaXJlZCBjYXBhYmlsaXRpZXMgc2hvdWxkIGdlbmVyYWxseSBub3QgaW5jbHVkZSBib3RoIGFuIGFwcCBhbmQgYSBicm93c2VyTmFtZScpO1xuICAgIH1cbiAgICBpZiAoY2Fwcy5hcHBQYWNrYWdlKSB7XG4gICAgICBsb2dnZXIuZXJyb3JBbmRUaHJvdyhgVGhlIGRlc2lyZWQgY2FwYWJpbGl0aWVzIG11c3QgaW5jbHVkZSBlaXRoZXIgJ2FwcFBhY2thZ2UnIG9yICdicm93c2VyTmFtZSdgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmhlbHBlcnMuYm9vdHN0cmFwID0gQm9vdHN0cmFwO1xuaGVscGVycy51bmxvY2tlciA9IHVubG9ja2VyO1xuXG5leHBvcnQgZGVmYXVsdCBoZWxwZXJzO1xuIl0sInNvdXJjZVJvb3QiOiIuLi8uLiJ9
