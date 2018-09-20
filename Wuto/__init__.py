# encoding: utf-8

"""
@version: 1.0
@author: LeungJain
@time: 2018/9/20 16:22
"""
from os.path import abspath, dirname

# 必须在顶级包中加入下面这行代码，并且是在代码文件的最开始
project_dir = dirname(dirname(abspath(__file__))) # Calf项目的安装路径

# 检查运行Wuto的平台是否为python3
import platform
pv = platform.python_version()
if int(pv[0]) >= 3:
    pass
else:
    raise EnvironmentError('Calf only support python3')