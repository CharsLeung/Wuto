# -*- coding: UTF-8 -*-
""" 
@version: v1.0 
@author: LeungJain
@contact: leungjain@outlook.com 
@site:  
@software: PyCharm Community Edition 
@file: action.py 
@time: 2018-09-25 21:32 
"""
import pandas as pd

from Auto.app.wechart import WeChart
from Auto.appiums.adb import adb
from Auto.utils import File, logger
from Auto import project_dir


class Action():
    def __init__(self):
        self.udids = adb.get_devices_udid()

        pass

    def connect_wifi(self):
        devices = pd.read_excel(io=project_dir + '\\files\\device.xlsx',
                               encoding='gbk')
        print(devices)
        for i, d in devices.iterrows():
            if d.UDID in self.udids:
                # ……
                ac = WeChart(udid=d.UDID, dn=adb.model(d.UDID),
                             wifi_name=d['WIFI网络'], wifi_password=d['WIFI密码'])
                ac.start()
            else:
                logger.error_info_print('设备：'+d.UDID+'，未连接！！！')

    def run(self):
        phones = pd.read_excel(io=project_dir + '\\files\\auto.xlsx',
                               sheetname='移动设备', encoding='gbk')
        for i in self.udids:

            if i in phones['UDID'].tolist():
                # 这是一个合法的手机
                path = project_dir + '\\files\\' + i
                File.check_file(path)
                print(path)
                dn = adb.model(i)
                # pks = adb.packages(i)
                ac = WeChart(udid=i, dn=dn)
                ac.start()

                pass

pass
Action().connect_wifi()