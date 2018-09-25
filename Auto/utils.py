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