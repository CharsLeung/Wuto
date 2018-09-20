# -*- coding: UTF-8 -*-
""" 
@version: v1.0 
@author: LeungJain
@contact: leungjain@outlook.com 
@site:  
@software: PyCharm Community Edition 
@file: t2.py 
@time: 2018-09-19 20:59 
"""
import os,time
from appium import webdriver
# Returns abs path relative to this file and not cwd
PATH = lambda p: os.path.abspath(
    os.path.join(os.path.dirname(__file__), p)
)

# 可能需要读取移动设备的一些基本信息

class c1():
    def setUp(self):
        desired_caps = {
            'platformName': 'Android',
            'platformVersion': '5.1.1',
            'deviceName': 'vivo X7Plus',
            'newCommandTimeout': 240,
            "udid": "46e34325",
            "appActivity": "com.android.camera.Camera",
            "appPackage": "com.android.camera"
        }
        self.driver = webdriver.Remote('http://localhost:4724/wd/hub', desired_caps)
        print('test')
        time.sleep(5)
        self.driver.quit()

    def test(self):
        print('test')
        time.sleep(5)

    def tearDown(self):
        self.driver.quit()

if __name__=='__main__':
    c1().setUp()