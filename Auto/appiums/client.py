# encoding: utf-8

"""
@version: 1.0
@author: LeungJain
@time: 2018/9/20 16:33
"""
import time
from appium import webdriver
from Auto.appiums.adb import adb
from Auto.exception import ExceptionInfo


class AppiumClient:
    """
    appium客服端
    """
    KEYCODE_CALL=5
    KEYCODE_ENDCALL=6
    KEYCODE_HOME=3
    KEYCODE_MENU=82
    KEYCODE_BACK=4
    KEYCODE_SEARCH=84
    KEYCODE_CAMERA=27
    KEYCODE_FOCUS=80
    KEYCODE_POWER=26
    KEYCODE_NOTIFICATION=83
    KEYCODE_MUTE=91
    KEYCODE_VOLUME_MUTE=164
    KEYCODE_VOLUME_UP=24
    KEYCODE_VOLUME_DOWN=25

    def __init__(self, host='127.0.0.1', port=4723, pfn='Android',
                 pfv=None, dn=None, nct=240, udid=None):
        """
        创建一个客服端实例
        """
        try:
            dcs = {}
            dcs['platformName'] = pfn
            dcs['newCommandTimeout'] = nct
            dcs['appPackage'] = 'com.android.camera'
            dcs['appActivity'] = 'com.android.camera.Camera'
            if pfv is not None:
                dcs['platformVersion'] = pfv
            if dn is not None:
                dcs['deviceName'] = dn
            if udid is not None:
                dcs['udid'] = udid
            # desired_caps = {
            #     'platformName': 'Android',
            #     'platformVersion': '5.1.1',
            #     'deviceName': 'vivo X7Plus',
            #     'newCommandTimeout': 240,
            #     "udid": "46e34325",
            #     # "appActivity": "com.android.camera.Camera",
            #     # "appPackage": "com.android.camera"
            # }
            self.driver = webdriver.Remote('http://{0}:{1}/wd/hub'.format(host, port), dcs)
            pass
        except Exception as e:
            ExceptionInfo(e)
            self.driver = None

    def open_app(self):
        pass

    def press_key(self, kc, sleep=1):
        self.driver.keyevent(kc)
        time.sleep(sleep)
        return self.driver
pass
if __name__ == '__main__':
    ids = adb.get_devices_udid()
    dn = adb.model(ids[0])
    pks = adb.packages(ids[0])
    ac = AppiumClient(udid=ids[0], dn=dn)
    ac.press_key(3)
    # ac.driver.find_element_by_name("QQ").click()
    # ac.driver.find_element(value='[name="%s"]' % '天气').click()
    ac.driver.find_element_by_xpath("//*[contains(@text, '天气')]").click()
