# encoding: utf-8

"""
@version: 1.0
@author: LeungJain
@time: 2018/9/21 11:47
"""
import xml.etree.ElementTree as ET

from Auto import project_dir

tree = ET.parse(project_dir + "/Auto/t.xml")
root = tree.getroot()
node = root.findall('bookstore/book')
pass