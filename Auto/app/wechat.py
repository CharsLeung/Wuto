# -*- coding: UTF-8 -*-
""" 
@version: v1.0 
@author: LeungJain
@contact: leungjain@outlook.com 
@site:  
@software: PyCharm Community Edition 
@file: wechat.py
@time: 2018-09-22 9:38 
"""
import time
from Auto.appiums.adb import adb
from Auto.appiums.client import AppiumClient
from Auto.exception import ExceptionInfo
from Auto.scheduler import TASK
from Auto.utils import Inspector, logger


class WeChat(AppiumClient):
    """
    测试微信应用
    """
    def open(self, name='微信'):
        """
        打开微信
        :return:
        """
        # 通过包名打开，适用于官方安装的微信
        # return self.open_app_by_activity('com.tencent.mm',
        #                                  'com.tencent.mm.ui.LauncherUI')
        # 点击桌面上的“微信”
        return self.press_by_text(name)

    def login(self):
        pass

    def modify_personal_details(self, item):
        """
        修改微信个人信息，每次修改一项
        :param item:
        :return:
        """
        try:
            # open wechat
            if self.appName is not None:
                self.press_by_text(self.appName)
            else:
                logger.warn_info_print('invalid appName, and this client is returned.')
                return
            time.sleep(0.5)
            self.press_by_text('我')
            time.sleep(1)
            print(self.driver.page_source)
            d = Inspector(xmlstring=self.driver.page_source).get_attributes()
            print(d)
            if item == '头像':
                pass
        except Exception as e:
            ExceptionInfo(e)
        pass

    def search_button(self):
        """
        微信各个页面上的放大镜搜索按钮都可以通过这个函数点击
        点击右上角的搜索,搜索输入框下面那个提示性文字都是text
        ‘搜索’提示为text属性，可点
        :return:
        """
        try:
            # 点击桌面上的“搜索”那个图片
            self.driver.find_element_by_xpath("//*[contains(@content-desc, '搜索')]").click()
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def home_search(self, text):
        """
        在微信主页上的那个放大镜下搜索
        :param text:
        :return:
        """
        try:
            # 一般进入搜索页面后，搜索输入框都是已经
            # 获得焦点的，
            self.driver.find_element_by_xpath("//*[contains(@content-desc, '搜索')]").send_keys('text')
            pass
        except Exception as e:
            ExceptionInfo(e)
            return False

    def more(self):
        """
        点击右上角更多功能那个+号
        :return:
        """
        try:
            self.driver.find_element_by_xpath("//*[contains(@content-desc, '更多功能按钮')]").click()
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def txt_button(self, button_name):
        """
        微信界面上可以通过文字点击的按钮。
        包括：底部4个主按钮=>微信、通讯录、发现、我
            以及顶部更多功能下的=>发起群聊...
            聊天页面的好友、公众号、群，都能提供点击备注名打开
            通讯录界面的=>新的朋友、群聊..,朋友列表需要注意！！
            很多人的微信名称有些奇怪的字符，提供文字表达不出来，
            另外，可能需要向上滑动才可以找到好友的名称。
            发现&我=>里面的按钮都可以通过文字点击
        :param button_name:
        :return:
        """
        return self.press_by_text(button_name)

    def photo_share(self):
        try:
            self.press_by_text('微信')
            time.sleep(1)
            self.press_by_text('发现')
            time.sleep(1)
            self.press_by_text('朋友圈')
            time.sleep(0.5)
            # resource-id="com.tencent.mm:id/iw"
            self.press_attribute('content-desc', '拍照分享')
            time.sleep(0.8)
            self.press_by_text('从相册选择')
            time.sleep(0.5)
            x = self.driver.page_source
            d = Inspector(xmlstring=x).get_attributes()
            print(d)
            # 选择图片
            self.press_attribute('content-desc', '图片 1, 2018-09-25 22:48')
            time.sleep(0.5)
            self.press_attribute('text', '完成(1/9)')
            time.sleep(0.5)
            self.press_attribute('text', '这一刻的想法...')
            time.sleep(1)
            self.input_text('text', '这一刻的想法...', '这是在测试程序，不要在意')
            time.sleep(2)
            # self.press_attribute('text', '发表')

            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def back(self):
        try:
            # resource-id="com.tencent.mm:id/j8"
            self.driver.find_element_by_xpath("//*[contains(@content-desc, '返回')]").click()
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def add_pyq(self, text, image=None):
        """
        发朋友圈
        :param text:
        :param image:
        :return:
        """
        try:
            self.press_by_text('微信')
            time.sleep(1)
            self.press_by_text('发现')
            time.sleep(1)
            self.press_by_text('朋友圈')
            time.sleep(0.5)
            self.photo_share()
        except Exception as e:
            ExceptionInfo(e)

    def run(self):
        # self.photo_share()
        # self.files_push('D:\PythonFile\Wuto\\files\\46e34325\image\camera1.png',
        #                 'sdcard/46e34325/image/camera1.png')
        # adb.push('D:\PythonFile\Wuto\\files\\46e34325\image\camera1.png',
        #          '/sdcard/46e34325/image/camera1.png', self.udid)
        if self.kwargs['task'] == TASK['connect_wifi']:
            self.connect_wifi(self.kwargs['wifi_name'],
                              self.kwargs['wifi_password'])
        elif self.kwargs['task'] == TASK['add_contactors']:
            self.add_contactors()
        elif self.kwargs['task'] == TASK['modify_personal_details']:
            self.modify_personal_details(self.kwargs['modify_item'])
        else:
            logger.warn_info_print('no valid task for run.')
        pass


# if __name__ == '__main__':
#     ids = adb.get_devices_udid()
#     dn = adb.model(ids[0])
#     pks = adb.packages(ids[0])
#     ac = WeChart(udid=ids[0], dn=dn)
#     ac.start()
