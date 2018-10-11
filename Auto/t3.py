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
# from Auto.utils import Inspector
# print(Inspector(path=project_dir + "/Auto/wx_search.xml").find_attribute_key('搜索'))
# print('wx' in 'qwefwc')
from Auto.utils import Inspector
import re
d = Inspector(path='D:\PythonFile\Wuto\Auto\wx_home.xml').get_attributes()
a = d.loc[:, ['bounds', 'text']]
d.groupby(['resource-id'], as_index=False).agg({'text': lambda x: list(x),'index':'count'})
a = a[a.text != '']
a['bounds'] = a.bounds.astype('str')
a['bounds'] = a.bounds.map(lambda x: x[1:len(x)-1].replace('][', ',').split(','))
print(d)
# xs = str(open('D:\PythonFile\Wuto\Auto\wx_home.xml','rb').read())
# print(xs)
# xs = 'xad_&5535d7;&#56473;&lt;qss'
# _ = re.compile(r'&.[a-zA-Z0-9]+;').findall(xs)
# print(_)
pass