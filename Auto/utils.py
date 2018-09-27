# encoding: utf-8

"""
@version: 1.0
@author: LeungJain
@time: 2018/9/20 16:30
"""
import datetime as dt
import warnings
import time
# import pygame
import threading

from Auto import project_dir
from Auto.exception import ExceptionInfo

warnings.filterwarnings('ignore')


class fontcolor:
    F_RED = '\033[31m'
    F_GREEN = '\033[32m'
    F_YELLOW = '\033[33m'
    F_BLUE = '\033[34m'
    F_PURPLE = '\033[35m'
    F_GREEN_BLUE = '\033[36m'
    B_WHITE_F_BLACK = '\033[7;37;30m'
    END = '\033[0m'


def progress_bar(total, complete, **kwargs):
    isr = int(60 * complete / total)
    sr = ' ' * isr
    print('\rRun:{0}\033[7;37;30m{1}\033[0m{2}/{3}'.format(kwargs, sr, complete, total),
          end='', flush=True)


def play_music(sound, second=10):
    """
    播放一段声音文件
    :param second: 播放的时间
    :param sound:文件名
    :return:
    """
    try:
        # sys.path[1]
        # file = project_dir + '\Calf\Files\\' + sound
        # pygame.mixer.init()
        # # print("播放音乐1")
        # track = pygame.mixer.music.load(file)
        # pygame.mixer.music.play()
        # time.sleep(second)
        # pygame.mixer.music.stop()
        pass
    except Exception as e:
        ExceptionInfo(e)
        pass


def sound_notice(sound_name):
    """
    以多线程的方式播放一段音频文件
    :param sound_name:
    :return:
    """
    try:
        t = threading.Thread(target=play_music, args=(sound_name,))
        return t
    except Exception as e:
        ExceptionInfo(e)
        pass


import pandas as pd
from xml.etree import ElementTree


class Inspector:
    def __init__(self, path=None, xmlstring=None):
        try:
            if path is not None:
                self.tree = ElementTree.parse(path)
            if xmlstring is not None:
                self.tree = ElementTree.fromstring(xmlstring)
            pass
        except Exception as e:
            ExceptionInfo(e)
            pass

    def get_attributes(self):
        try:
            data = []
            for element in self.tree.getiterator():
                dict_keys = {}
                if element.keys():
                    for name, value in element.items():
                        dict_keys[name] = value
                    # print(dict_keys)
                    data.append(dict_keys)
            data = pd.DataFrame(data)
            return data
        except Exception as e:
            ExceptionInfo(e)

    def find_attribute_key(self, value):
        """
        通过值找到属性名
        :param value:
        :return:
        """
        try:
            data = []
            for element in self.tree.getiterator():
                if element.keys():
                    for k, v in element.items():
                        if v == value:
                            data.append({k: v})
            return data
        except Exception as e:
            ExceptionInfo(e)

    def find_attribute_value(self, key):
        """
        通过属性名找到值
        :param value:
        :return:
        """
        try:
            data = []
            for element in self.tree.getiterator():
                if element.keys():
                    for k, v in element.items():
                        if k == key:
                            data.append({k: v})
            return data
        except Exception as e:
            ExceptionInfo(e)


import os
import shutil
import zipfile


class File:
    """
    create by: zjf and write more
    """
    filename = []

    def __init__(self, filename):
        self.filename = filename

    @classmethod
    def rename(cls, src, dst):
        try:
            os.rename(src, dst)
        except Exception as e:
            print(e)

    @classmethod
    def remove_file(cls, file):
        """
        :param file:like "f:zjf/love.png"
        :return:
        """
        try:
            os.remove(file)
        except Exception as e:
            # by:modify leungjian==print(e)->ExceptionInfo(e)
            # The same place behind is the same
            ExceptionInfo(e)

    @classmethod
    def copy_file(cls, src, dst):
        try:
            shutil.copy(src=src, dst=dst)
        except Exception as e:
            ExceptionInfo(e)

    @classmethod
    def move_file(cls, src, dst):
        try:
            shutil.move(src=src, dst=dst)
        except Exception as e:
            ExceptionInfo(e)

    @classmethod
    def get_all_file(cls, path):
        alllist = os.listdir(path)
        for ifile in alllist:
            paths = os.path.join(path, ifile)
            # 这里得到的path有可能是文件价
            if os.path.isdir(paths):
                # 是的话需要递归
                cls.get_all_file(path=paths)
            cls.filename.append(paths)
        return cls.filename

    @classmethod
    def decompression(cls, src, dst="temp/"):
        f = zipfile.ZipFile(src, 'r')
        for file in f.namelist():
            f.extract(file, dst)

    @classmethod
    def check_file(cls, path):
        """
        检查文件夹，有返回0
        没有的，新建，返回1
        其他返回-1
        :param file_name:
        :return:
        """
        # 引入模块
        import os

        # 去除首位空格
        path = path.strip()
        # 去除尾部 \ 符号
        path = path.rstrip("\\")

        # 判断路径是否存在
        # 存在     True
        # 不存在   False
        isExists = os.path.exists(path)

        # 判断结果
        if not isExists:
            # 如果不存在则创建目录
            # 创建目录操作函数
            os.makedirs(path)

            # print(path + ' 创建成功')
            return True
        else:
            # 如果目录存在则不创建，并提示目录已存在
            # print(path + ' 目录已存在')
            return False


import json


def read_json(path):
    """读取交易参数"""
    try:
        with open(path, encoding='utf-8') as file:
            content = json.load(file)
        return content
    except Exception as e:
        ExceptionInfo(e)
        return None


def modify_json(path, data):
    try:
        with open(path, 'w') as file:
            file.write(json.dumps(data))
        return True
    except Exception as e:
        ExceptionInfo(e)
        return False

def isin(sub, collection):
    if isinstance(sub, list):
        return set(sub) <= set(collection)
    else:
        return sub in collection

# print(isin(1, ['a', 'b', 'c']))
class logger:
    @classmethod
    def success_info_print(cls, info):
        n = dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        info = n + '=>' + str(info)
        print(fontcolor.F_GREEN, info, fontcolor.END)

    @classmethod
    def error_info_print(cls, info):
        n = dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        info = n + '=>' + str(info)
        print(fontcolor.F_RED, info, fontcolor.END)

    @classmethod
    def warn_info_print(cls, info):
        n = dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        info = n + '=>' + str(info)
        print(fontcolor.F_YELLOW, info, fontcolor.END)