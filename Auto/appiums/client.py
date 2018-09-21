# encoding: utf-8

"""
@version: 1.0
@author: LeungJain
@time: 2018/9/20 16:33
"""
import time
import threading
from appium import webdriver
from Auto.appiums.adb import adb
from Auto.exception import ExceptionInfo


class AppiumClient(threading.Thread):
    """
    appium客服端
    """
    KEYCODE_CALL = 5
    KEYCODE_ENDCALL = 6
    KEYCODE_HOME = 3
    KEYCODE_MENU = 82
    KEYCODE_BACK = 4
    KEYCODE_SEARCH = 84
    KEYCODE_CAMERA = 27
    KEYCODE_FOCUS = 80
    KEYCODE_POWER = 26
    KEYCODE_NOTIFICATION = 83
    KEYCODE_MUTE = 91
    KEYCODE_VOLUME_MUTE = 164
    KEYCODE_VOLUME_UP = 24
    KEYCODE_VOLUME_DOWN = 25

    def __init__(self, host='127.0.0.1', port=4723, pfn='Android',
                 pfv=None, dn=None, nct=240, udid=None):
        """
        创建一个客服端实例
        """
        try:
            super(AppiumClient, self).__init__()
            dcs = {}
            dcs['platformName'] = pfn
            dcs['newCommandTimeout'] = nct
            # appium默认最开始需要启动一个应用（一般认为是需要测试的app）
            # 目前Auto项目启动安卓系统下的设置，这个应用每个安卓手机都有
            # 然后回到home界面
            # TODO(leung): 这个策略可能需要修改
            dcs['appPackage'] = 'com.android.settings'
            dcs['appActivity'] = 'com.android.settings.Settings'
            dcs['autoLaunch'] = False   # 是否运行上面这个程序
            if pfv is not None:
                dcs['platformVersion'] = pfv
            if dn is not None:
                dcs['deviceName'] = dn
            if udid is not None:
                dcs['udid'] = udid
            self.driver = webdriver.Remote('http://{0}:{1}/wd/hub'
                                           .format(host, port), dcs)
            time.sleep(2)
            # 手机处于锁屏状态下也会执行相应的命令
            # 测试程序准备就绪之后，回到主界面
            self.driver.keyevent(3)
            self.lock = self.driver.is_locked()
            self.size = self.driver.get_window_size()
            # if self.lock:
            #     self.driver.unlock() # 如果有密码，此函数解不了锁
            print(self.driver.get_window_size())
            pass
        except Exception as e:
            ExceptionInfo(e)
            self.driver = None

    def unlock(self, password):
        """
        打开手机，如果手机处于锁屏状态下,解锁
        目前只提供了数字密码形式的锁屏
        :return:
        """
        try:
            # 1.判断手机是不是锁住的
            if self.driver.is_locked():
                # 2.点亮屏幕，可以按电源键（或者其他物理键）、home键
                # 不同的手机会有不同的情况，有的没有home物理键
                # 按电源键可能会关闭屏幕（若屏幕本来就是亮起的）
                # 在有的手机上，有些物理键是不能点亮屏幕的，比如音量键
                # TODO(leung): 这里选择点击home健，这以后可能会设置一个参数
                # self.driver.tap(positions=(100, 100), duration=500)
                self.driver.keyevent(3)
                time.sleep(0.5)
                # 3.上滑屏幕，唤出解锁的界面，原点在左上方
                self.driver.swipe(start_x=self.size['width'] / 2,
                                  start_y=self.size['height'] * 2 / 3,
                                  end_x=self.size['width'] / 2,
                                  end_y=self.size['height'] / 3,
                                  duration=100)
                time.sleep(0.5)
                # s = self.driver.page_source
                # print(s)
                for i in list(password):  # password:'1234'
                    # TODO(leung): 每个设备的解锁按键键盘可能不一样，以vivo为例
                    # 其数字键盘上不是简单的文字（text），但存在与文字有对应关系的属性
                    # resource-id="com.android.systemui:id/VivoPinkey1" 对应 1
                    # xpath？？
                    ac.driver.find_element_by_xpath("//*[contains(@resource-id, 'com.android."
                                                    "systemui:id/VivoPinkey{0}')]".format(i)).click()
                    time.sleep(0.5)
                return self.driver.is_locked()
                pass
            else:
                return True
            pass
        except Exception as e:
            ExceptionInfo(e)
            return False

    def open_app_by_name(self, name):
        """
        通过程序名称打开程序，即你在桌面上看到的程序名字
        :return:
        """
        try:
            # 一般很可能会出现一种状况：当前页面上没有这个程序，可能需要
            # 滑动桌面，这种方式只能从桌面启动
            self.driver.find_element_by_xpath("//*[contains(@text, '{}')]".
                                              format(name)).click()
            pass
        except Exception as e:
            ExceptionInfo(e)
        pass

    def open_app_by_activity(self, app_package, app_activity):
        try:
            self.driver.start_activity(app_package, app_activity)
            return True
            pass
        except Exception as e:
            ExceptionInfo(e)
            return False
        pass

    def press_by_text(self, txt):
        """
        找到当前页面上的某个文字，然后点击它
        1.可能会找不到，报错
        2.可能找到了多个，会点击第一个
        :param txt:
        :return:
        """
        try:
            self.driver.find_element_by_xpath("//*[contains(@text, '{}')]".
                                              format(txt)).click()
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def press_key(self, kc, sleep=1):
        self.driver.keyevent(kc)
        time.sleep(sleep)
        return self.driver

    def run(self):
        self.press_by_text('微信')
        time.sleep(1)
        xml = self.driver.page_source
        self.press_by_text('发现')
        time.sleep(1)
        self.press_by_text('朋友圈')
        time.sleep(1)
        for i in range(0, 10):
            self.driver.swipe(start_x=self.size['width'] / 2,
                              start_y=self.size['height'] * 2 / 3,
                              end_x=self.size['width'] / 2,
                              end_y=self.size['height'] / 3,
                              duration=1000)
            time.sleep(0.5)
        pass

    def exit(self):
        self.driver.quit()


pass
if __name__ == '__main__':
    ids = adb.get_devices_udid()
    dn = adb.model(ids[0])
    pks = adb.packages(ids[0])
    ac = AppiumClient(udid=ids[0], dn=dn)
    ac.start()
    # ac.unlock('2580')
    # ac.press_key(3)
    # ac.driver.find_element_by_name("QQ").click()
    # ac.driver.find_element(value='[name="%s"]' % '天气').click()
    # ac.driver.find_element_by_xpath("//*[contains(@text, '微信')]").click()
