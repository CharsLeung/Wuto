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

from Auto.app.wechat import WeChat
from Auto.appiums.adb import adb
from Auto.app import SYS_APP_TASK, WX_APP_TASK
from Auto.utils import File, logger
from Auto import project_dir


class Action():
    def __init__(self):
        self.udids = adb.get_devices_udid()

        pass

    def connect_wifi(self):
        devices = pd.read_excel(io=project_dir + '\\files\\设备信息.xlsx',
                                encoding='gbk')
        devices = devices.drop_duplicates(['UDID'])
        print(devices)
        for i, d in devices.iterrows():
            if d.UDID in self.udids:
                # ……
                ac = WeChat(udid=d.UDID, dn=adb.model(d.UDID),
                            wifi_name=d['WIFI网络'], wifi_password=d['WIFI密码'],
                            task=SYS_APP_TASK['connect_wifi'])
                ac.start()
            else:
                logger.error_info_print('设备：' + d.UDID + '，未连接!!!')
                pass

    def add_contactors(self):
        """
        添加联系人
        :return:
        """
        devices = pd.read_excel(io=project_dir + '\\files\\通讯录.xlsx',
                                encoding='gbk')
        # devices = devices.drop_duplicates(['UDID'])
        print(devices)
        # 可能会同时添加几个联系人，
        for (u), g in devices.groupby(['UDID']):
            if u in self.udids:
                contactors = g.to_dict(orient='records')
                ac = WeChat(udid=u, dn=adb.model(u),
                            contactors=contactors,
                            task=SYS_APP_TASK['add_contactors'])
                ac.start()
            else:
                logger.error_info_print('设备：' + u + '，未连接!!!')
                pass

    def modify_personal_details(self):
        accounts = pd.read_excel(io=project_dir + '\\files\\微信账号信息.xlsx',
                                 encoding='gbk')
        devices = pd.read_excel(io=project_dir + '\\files\\微信账号设备登录表.xlsx',
                                encoding='gbk')
        accounts = pd.merge(accounts, devices, on=['微信号'])
        for i, a in accounts.iterrows():
            if a['UDID'] in self.udids:
                if a['登录状态'] == '已登录':
                    ac = WeChat(udid=a['UDID'], dn=adb.model(a['UDID']),
                                appName=a['程序ID'], modify_item='header',
                                task=WX_APP_TASK['modify_personal_details'])
                    ac.start()
                else:
                    logger.error_info_print('账号{0}未在设备{1}上登录.'
                                            .format(a['微信号'], a['UDID']))
            else:
                logger.error_info_print('设备：' + a['UDID'] + '，未连接!!!')
                pass

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
                ac = WeChat(udid=i, dn=dn)
                ac.start()

                pass

    def t(self):
        wx = WeChat(udid='46e34325', dn=adb.model('46e34325'),
                                appName='主题').open_app_by_name('微信')


pass
# Action().add_contactors()
Action().t()
