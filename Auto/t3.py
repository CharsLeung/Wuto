# encoding: utf-8

"""
@version: 1.0
@author: LeungJain
@time: 2018/9/21 11:47
"""
# import xml.etree.ElementTree as ET
# import time
from Auto import project_dir
#
# tree = ET.parse(project_dir + "/Auto/wx_search.xml")
# root = tree.getroot()
# node = root.findall("//android.widget.FrameLayout[@resource-id='com.android.systemui:id/panel_holder']")
# print(node)
# import pandas as pd
# from xml.etree import ElementTree
# treexml = ElementTree.parse(project_dir + "/Auto/wx_search.xml")
# data = []
# for element in treexml.getiterator():
#     dict_keys={}
#     if element.keys():
#         for name, value in element.items():
#             dict_keys[name]=value
#         print(dict_keys)
#         data.append(dict_keys)
# data = pd.DataFrame(data)
# print(data)
from Auto.utils import Inspector
print(Inspector(path=project_dir + "/Auto/wx_search.xml").find_attribute_key('搜索'))
pass