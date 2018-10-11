# -*- coding: UTF-8 -*-
""" 
@version: v1.0 
@author: LeungJain
@contact: leungjain@outlook.com 
@site:  
@software: PyCharm Community Edition 
@file: qq.py 
@time: 2018-10-09 21:06 
"""
import time

from Auto.app import QQ_APP_TASK
from Auto.appiums.adb import adb
from Auto.appiums.client import AppiumClient
from Auto.exception import ExceptionInfo
from Auto.utils import Inspector, logger


class QQ(AppiumClient):


    def run(self):
        if self.kwargs['task'] == QQ_APP_TASK['add_group_by_condition']:
            self.add_group_by_condition()
        pass

    def add_group_by_condition(self):
        try:
            self.open_app_by_name('QQ分身')
            time.sleep(1)
            self.press_by_text('联系人')
            time.sleep(0.5)
            self.press_by_text('添加')
            time.sleep(0.5)
            self.press_by_text('找群')
            time.sleep(0.5)
            for i in self.kwargs['cdt']:
                self.press_by_text(i)
                time.sleep(2)
            d = Inspector(xmlstring=self.driver.page_source).get_attributes()
            txts = d.text.dropna(axis=1).tolist()
            print(txts)
            pass
        except Exception as e:
            ExceptionInfo(e)
            pass
pass
if __name__ == '__main__':

    QQ(udid='46e34325', dn=adb.model('46e34325'),
       task=QQ_APP_TASK['add_group_by_condition'],
       cdt=['游戏'])