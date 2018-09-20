# encoding: utf-8

"""
@version: 1.0
@author: LeungJain
@time: 2018/9/20 16:24
"""
from Auto.exception import ExceptionInfo


class AppiumServer:
    """
    appium服务端
    """
    def __init__(self, host='127.0.0.1', port=4327):
        """
        通过appium命令行创建appium服务
        """
        try:
            cmd = ''    # 创建appium的命令
            self.appium = ''    # appium服务的实例
            pass
        except Exception as e:
            self.appium = None
            ExceptionInfo(e)
