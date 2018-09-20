# -*- coding: UTF-8 -*-
""" 
@version: v1.0 
@author: LeungJain
@contact: leungjain@outlook.com 
@site:  
@software: PyCharm Community Edition 
@file: adb.py 
@time: 2018-09-19 21:22 
"""
import os
import re

class adb:
    """
    常见adb命令的Python实现，
    需要配置adb的环境变量
    """
    @classmethod
    def get_devices_udid(cls):
        """
        获取移动设备的udid，有些地方又称为uuid、序列号
        就是移动设备的唯一标识符
        :return:
        """
        try:
            cmd = 'adb devices'
            # print(os.system(cmd))
            udids = []
            x = os.popen(cmd).read()
            x = x.split('\n')
            for _ in x:
                id = _.split('\t')
                if len(id) > 1:
                    udids.append(id[0])
            # x = x[::]
            # x = [i.split('\t')[0] for i in x]
            # print(udids)
            return udids
        except:
            return []
            pass

    @classmethod
    def push(cls, pc_path, mb_path, udid=None):
        """
        copy file to mobile from pc,
        当pc连接了多个设备，则应该指定udid，或者将全部执行
        :param pc_path:
        :param mb_path:
        :return:
        """
        try:
            cmd = 'adb {0} push {1} /{2}/'.\
                format('' if udid is None else '-s ' + udid, pc_path, mb_path)
            os.popen(cmd)
            return True
            pass
        except:
            return False
            pass

    @classmethod
    def pull(cls, mb_path, pc_path, udid=None):
        """
        copy file to pc from mobile,
        当pc连接了多个设备，则应该指定udid
        :param pc_path:
        :param mb_path:
        :return:
        """
        try:
            cmd = 'adb {0} pull {1} /{2}/'. \
                format('' if udid is None else '-s ' + udid, mb_path, pc_path)
            os.popen(cmd)
            return True
            pass
        except:
            return False
            pass

    @classmethod
    def install(cls, apk_path, udid=None):
        """
        在手机上安装应用程序
        :param apk_path:
        :return:
        """
        try:
            cmd = 'adb {0} install {}'.\
                format(apk_path if udid is None else '-s ' + udid)
            os.popen(cmd)
            pass
        except:
            pass

    @classmethod
    def packages(cls, udid):
        """

        :param udid:
        :return:
        """
        try:
            pms = []
            cmd = 'adb -s {udid} shell pm list packages'.format(udid=udid)
            r = os.popen(cmd).read().split('\n')
            for i in r:
                _ = i.split(':')
                if len(_) > 1:
                    pms.append(_[1])
            # pms = [i.split(':')[1] for i in r]
            return pms
        except:
            return []
            pass

    @classmethod
    def size(cls, udid):
        """
        获取手机分辨率
        :param udid:
        :return: tuple or None
        """
        try:
            cmd = 'adb -s {udid} shell wm size'.format(udid=udid)
            r = os.popen(cmd).read().split(':')[1].split('\n')[0].split('x')
            # r = re.search('\d+x\d+', r)
            # r.group()
            return (int(r[0]), int(r[1]))
            pass
        except:
            return None
            pass

    @classmethod
    def model(cls, udid):
        """
        获取手机型号
        :param udid:
        :return:
        """
        try:
            cmd = 'adb -s {udid} shell getprop ro.product.model'.\
                format(udid=udid)
            r = os.popen(cmd).read().split('\n')[0]
            return r
            pass
        except:
            return None
            pass



pass

# if __name__ == '__main__':
#     # adb.get_devices_udid()
#     # print(adb.packages('46e34325'))
#     print(adb.model('46e34325'))