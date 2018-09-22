# -*- coding: UTF-8 -*-
""" 
@version: v1.0 
@author: LeungJain
@contact: leungjain@outlook.com 
@site:  
@software: PyCharm Community Edition 
@file: wechart.py 
@time: 2018-09-22 9:38 
"""
import time
from Auto.appiums.adb import adb
from Auto.appiums.client import AppiumClient
from Auto.exception import ExceptionInfo


class WeChart(AppiumClient):
    """
    测试微信应用
    """
    def open(self):
        """
        打开微信
        :return:
        """
        # 点击桌面上的“微信”
        return self.press_by_text('微信')

    def login(self):
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
            # resource-id="com.tencent.mm:id/iw"
            self.driver.find_element_by_xpath("//*[contains(@content-desc, '拍照分享')]").click()
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

    def swipe_up(self):
        """
        向上滑动屏幕的三分之一, 持续时间1秒
        :return:
        """
        try:
            self.driver.swipe(start_x=self.size['width'] / 2,
                              start_y=self.size['height'] * 2 / 3,
                              end_x=self.size['width'] / 2,
                              end_y=self.size['height'] / 3,
                              duration=1000)
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def swipe_down(self):
        try:
            self.driver.swipe(start_x=self.size['width'] / 2,
                              start_y=self.size['height'] / 3,
                              end_x=self.size['width'] / 2,
                              end_y=self.size['height'] * 2 / 3,
                              duration=1000)
            return True
        except Exception as e:
            ExceptionInfo(e)
            return False

    def run(self):
        self.open()
        time.sleep(1)
        self.search()
        x = self.driver.page_source
        pass



if __name__ == '__main__':
    ids = adb.get_devices_udid()
    dn = adb.model(ids[0])
    pks = adb.packages(ids[0])
    ac = WeChart(udid=ids[0], dn=dn)
    ac.start()