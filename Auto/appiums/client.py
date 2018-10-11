# encoding: utf-8

"""
@version: 1.0
@author: LeungJain
@time: 2018/9/20 16:33
"""
import time
import threading
import base64
from appium import webdriver
from Auto import project_dir
from Auto.appiums.adb import adb
from Auto.exception import ExceptionInfo
from Auto.utils import read_json, Inspector, isin, fontcolor, logger, \
    page_diff


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
                 pfv=None, dn=None, nct=240, udid=None, **kwargs):
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
            # 有关中文的输入会有奇怪的问题
            # 一般配置如下两个参数，在OPPO、vivo上会不断提示安装程序
            # 解决这个问题可以参考https://blog.csdn.net/oneofJava/article/details/81462831
            # 但是这样操作之后又不能输入中文了
            # C:\Users\Administrator\AppData\Local\Programs\Appium\resources\
            # app\node_modules\appium\node_modules\appium-android-ime\bin\UnicodeIME-debug.apk
            # 手动安装这个app，然后再修改文件，可以解决
            dcs["unicodeKeyboard"] = 'True'  # 支持中文输入
            dcs["resetKeyboard"] = 'True'
            dcs['noReset'] = True
            dcs['deviceName'] = 'unnamed' if dn is None else dn
            if pfv is not None:
                dcs['platformVersion'] = pfv
            if udid is not None:
                self.udid = udid
                dcs['udid'] = udid
                self.button = read_json(project_dir +
                                        '\\files\\{}\\button_config.json'.format(udid))
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
            # print(self.driver.get_window_size())
            self.kwargs = kwargs
            logger.success_info_print('The device{} client create success.'
                  .format('' if udid is None else ' ' + udid))
            pass
        except Exception as e:
            ExceptionInfo(e)
            self.driver = None

    def back_home(self):
        try:
            self.driver.keyevent(3)
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def files_push(self, src, dst):
        """
        把系统主机项目下的文件同步到移动设备上，
        以便在涉及文件的操作上，确保移动设备上有
        相应的资源，一般图片是最主要的
        ::保证Auto项目下的files必须在设备上有一个副本
        :return:
        """
        try:
            # TODO(): 需要完成
            # 这个方法不好用
            with open(src, 'rb') as f:
                d = base64.b64encode(f.read())
                d = str(d, encoding='utf-8')
                print(d)
                self.driver.push_file(dst, d)
            return True
            pass
        except Exception as e:
            ExceptionInfo(e)
            return False
            pass

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
                    self.driver.find_element_by_xpath("//*[contains(@resource-id, 'com.android."
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

    def swipe_up(self, duration=1000):
        """
        向上滑动屏幕的三分之一, 持续时间1秒
        :return:
        """
        try:
            self.driver.swipe(start_x=self.size['width'] / 2,
                              start_y=self.size['height'] * 2 / 3,
                              end_x=self.size['width'] / 2,
                              end_y=self.size['height'] / 3,
                              duration=duration)
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def swipe_down(self, duration=1000):
        # 屏幕向上走
        try:
            self.driver.swipe(start_x=self.size['width'] / 2,
                              start_y=self.size['height'] / 3,
                              end_x=self.size['width'] / 2,
                              end_y=self.size['height'] * 2 / 3,
                              duration=duration)
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def swipe_right(self, duration=1000):
        """
        向右滑动屏幕的二分之一, 持续时间1秒 ->
        :return:
        """
        try:
            self.driver.swipe(start_x=self.size['width'] / 2,
                              start_y=self.size['height'] / 2,
                              end_x=self.size['width'] - 1,
                              end_y=self.size['height'] / 2,
                              duration=duration)
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def swipe_left(self, duration=1000):
        """
        向左滑动屏幕的二分之一, 持续时间1秒
        屏幕向右走
        :return:
        """
        try:
            self.driver.swipe(start_x=self.size['width'] / 2,
                              start_y=self.size['height'] / 2,
                              end_x=1,
                              end_y=self.size['height'] / 2,
                              duration=duration)
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def connect_wifi(self, name, password):
        """
        连接WiFi
        :param name:
        :param password:
        :return:
        """
        try:
            # 手机已经打开WiFi了
            if self.open_app_by_activity('com.android.settings',
                                         'com.android.settings.Settings'):
                self.press_attribute('text', self.button['WLAN'])
                time.sleep(1)
                self.press_attribute('text', name)
                time.sleep(0.5)
                d = Inspector(xmlstring=self.driver.page_source).get_attributes()
                # print(d)
                keys = d.text.tolist()
                if  isin('已连接',  keys):
                    # 已连接
                    self.press_attribute('text', '取消')
                    time.sleep(0.5)
                    self.back_home()
                    return True
                elif isin(['忘记网络', '连接'],  keys):
                    # 以前连接过
                    self.press_attribute('text', '连接')
                    time.sleep(0.5)
                    self.back_home()
                    return True
                else:
                    self.input_text('text', '密码', password)
                    time.sleep(2)
                    self.press_attribute('text', '连接')
                    time.sleep(5)
                    self.back_home()
                    # 不会检查是否连接成功了没有
                    return True
            else:
                return False
            pass
        except Exception as e:
            ExceptionInfo(e)
            self.back_home()
            return False

    def add_contactors(self):
        """
        添加联系人
        :return:
        """
        try:
            # 打开联系人
            self.open_app_by_activity('com.android.contacts',
                                      'com.android.contacts.activities.PeopleActivity')
            # print(self.kwargs['contactors'])
            time.sleep(1)
            # TODO(leung): 右上角那个+号：NAF=true
            # d = Inspector(xmlstring=self.driver.page_source).get_attributes()
            # print(d)
            for d in self.kwargs['contactors']:
                try:
                    self.press_attribute('NAF', 'true')
                    time.sleep(1)
                    self.press_attribute('text', '手机')
                    time.sleep(0.5)
                    self.input_text('text', '姓名', d['联系人'])
                    time.sleep(1)
                    # 联系人输入之后可能会出现询问是否合并的对话框
                    # 这时候点击顶部的‘新建联系人’忽略提示‘
                    self.press_attribute('text', '新建联系人')
                    time.sleep(0.5)
                    self.input_text('text', '电话', d['联系电话'])
                    time.sleep(1)
                    self.press_attribute('text', '完成')
                    time.sleep(1)
                    logger.success_info_print(self.udid + ': 联系人({0},{1}), 创建成功.'
                                              .format(d['联系人'], d['联系电话']))
                except Exception as e:
                    ExceptionInfo(e)
                    logger.error_info_print(self.udid + ': 联系人({0},{1}), 创建失败.'
                                              .format(d['联系人'], d['联系电话']))
            pass
        except Exception as e:
            ExceptionInfo(e)

    def open_app_by_name(self, name):
        """
        通过程序名称打开程序，即你在桌面上看到的程序名字
        :return:
        """
        try:
            # 一般很可能会出现一种状况：当前页面上没有这个程序，可能需要
            # 滑动桌面，这种方式只能从桌面启动
            # 1. 检查当前桌面上是否有name
            f = False
            last_page = ' '  # record last page's xml
            for i in range(0, 10):
                x = self.driver.page_source
                if name in x:
                    f = True
                    break
                else:
                    # 判断当前页面跟上一个是否是一样的, ratio>0.95认为是同一页面
                    ratio = page_diff(last_page, x)
                    if ratio < 0.95:
                        self.swipe_left()
                        last_page = x
                    else:
                        # 同一页面
                        break
                    time.sleep(0.5)
            if f:
                # find
                _ = self.press_by_text(name)
                # time.sleep(1)
                # d = Inspector(xmlstring=self.driver.page_source).get_attributes()
                # print(d)
                return _
            else:
                self.back_home()
                time.sleep(0.5)
                for i in range(0, 10):
                    x = self.driver.page_source
                    if name in x:
                        f = True
                        break
                    else:
                        ratio = page_diff(last_page, x)
                        if ratio < 0.95:
                            self.swipe_right()
                            last_page = x
                        else:
                            # 同一页面
                            break
                        time.sleep(0.5)
                if f:
                    # find
                    time.sleep(0.5)
                    return self.press_by_text(name)
                else:
                    logger.warn_info_print('not find this app: {}'.format(name))
                    return False
        except Exception as e:
            ExceptionInfo(e)
            logger.error_info_print('open application of {} filed.'.format(name))
            return False

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

    def press_attribute(self, attr, value):
        try:
            self.driver.find_element_by_xpath("//*[contains(@{0}, '{1}')]".
                                              format(attr, value)).click()
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def input_text(self, attr, value, text):
        """
        通过属性键值对，选择输入框进行文字输入
        :return:
        """
        try:
            self.driver.find_element_by_xpath("//*[contains(@{0}, '{1}')]".
                                              format(attr, value)).send_keys(text )
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def open_notifications(self):
        """
        :return:
        """
        try:
            self.driver.open_notifications()
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def run(self):
        pass

    def get_current_text_element(self):
        """
        获取当前页面上的文字元素，
        在xml中一般以属性列示的，包括text...
        获取这些元素是为了，判断当前处在哪个页面
        :return:
        """
        try:
            # 当前页面的xml描述
            xml = self.driver.page_source
            pass
        except Exception as e:
            ExceptionInfo(e)
        pass

    def exit(self):
        # 所有的操作结束后，应该回到桌面
        self.driver.quit()
pass
# if __name__ == '__main__':
#     ids = adb.get_devices_udid()
#     dn = adb.model(ids[0])
#     pks = adb.packages(ids[0])
#     ac = AppiumClient(udid=ids[0], dn=dn)
# #     ac.start()
#     ac.unlock('2580')
    # ac.press_key(3)
    # ac.driver.find_element_by_name("QQ").click()
    # ac.driver.find_element(value='[name="%s"]' % '天气').click()
    # ac.driver.find_element_by_xpath("//*[contains(@text, '微信')]").click()
