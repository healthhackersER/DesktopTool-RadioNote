import sys
from pathlib import Path
from xml.dom import minidom
from PySide2.QtGui import QStandardItemModel, QStandardItem, Qt
from PySide2.QtUiTools import QUiLoader
from PySide2.QtWidgets import QApplication, QPushButton, QLineEdit, QFileDialog, QListView, QTextEdit
from PySide2.QtCore import QFile, QObject
import xml.etree.ElementTree as ET
from lxml import etree
from numpy import unicode
import io

class Form(QObject):

    def __init__(self, ui_file, parent=None):
        super(Form, self).__init__(parent)
        ui_file = QFile(ui_file)
        ui_file.open(QFile.ReadOnly)
        self.fileToOpen = None
        self.current_dir = Path.cwd()
        loader = QUiLoader()
        self.window = loader.load(ui_file)
        ui_file.close()
        self.enter = self.window.findChild(QPushButton, 'enter_button')
        self.mainTextEdit = self.window.findChild(QTextEdit, 'main_textEdit')
        self.lineEdit = self.window.findChild(QLineEdit, 'lineEdit')


        self.loadButton = self.window.findChild(QPushButton, 'load_button')
        self.loadButton.clicked.connect(self.on_load)

        self.newItem = self.window.findChild(QPushButton, 'new_button')
        self.newItem.clicked.connect(self.on_new_item)

        self.saveButton = self.window.findChild(QPushButton, 'savefile_button')
        self.saveButton.clicked.connect(self.on_save_file)

        self.deleteButton = self.window.findChild(QPushButton, 'delete_button')
        self.deleteButton.clicked.connect(self.on_delete)

        self.editButton= self.window.findChild(QPushButton,'new_edit')
        self.editButton.clicked.connect(self.on_edit)

        self.listView = self.window.findChild(QListView, 'listView')
        self.model = QStandardItemModel()
        self.listView.setModel(self.model)
        self.listView.clicked.connect(self.on_item)
        # variable holds the currently selected item as QtIndex
        self.currentSelection = None

    def on_edit(self):
        self.currentSelection=None
        self.mainTextEdit.setText('')

    def on_new_item(self):
        text = self.lineEdit.text()
        keyList = text.split(',')

        data = self.mainTextEdit.toPlainText()
        for i in keyList:
            i=i.lower()
            list_of_Items=self.model.findItems(i,Qt.MatchExactly, 0)
            if(len(list_of_Items)==0 and i!=''):
                item = QStandardItem(i)
                item.setData(data, 1)
                self.model.appendRow(item)
            else:
                print("item already in list")
        self.model.sort(0, Qt.SortOrder.AscendingOrder)

    def on_delete(self):
        if (self.currentSelection!=None):
            self.model.removeRow(self.currentSelection.row())
            self.currentSelection=None

    def on_item(self, index):
        if (self.currentSelection != None):
            self.save_item(self.currentSelection)
        self.currentSelection = index
        data = self.model.data(index, 1)
        self.mainTextEdit.setText(data)

    def save_item(self, index):
        text = self.mainTextEdit.toPlainText()
        self.model.setData(index, text, 1)

    def on_save_file(self):
        saveFileName = QFileDialog.getSaveFileName(None, 'Save File', str(self.current_dir), "*.xml")
        # create file structure TODO
        data = etree.Element('resources')
        string_array = etree.SubElement(data, 'string-array')
        string_array.set('name', 'key_string_array')
        for index in range(self.model.rowCount()):
            item = self.model.item(index)
            key = item.data(0)
            tempData = item.data(1)
            xml_item = etree.SubElement(string_array, 'item')
            xml_item.text = (key + "|" + tempData)


        # myfile = open(saveFileName[0], 'w')

        mydata = etree.tostring(data,pretty_print=True,encoding='utf-8',xml_declaration=True)
        string_data=mydata.decode('utf-8')
        with open(saveFileName[0], 'w', encoding='utf8') as f:
            f.write(string_data)
            f.close()






    def on_load(self):
        fileName = QFileDialog.getOpenFileName(None, str("Open Image"), str(Path.cwd()),
                                               str("XML (*.xml)"))
        mydoc = minidom.parse(fileName[0])
        items = mydoc.getElementsByTagName('item')

        for elem in items:
            stringData = str(elem.firstChild.data)
            key, data = stringData.split('|')
            item = QStandardItem(key)
            item.setData(data, 1)
            self.model.appendRow(item)

        self.model.sort(0, Qt.SortOrder.AscendingOrder)


if __name__ == '__main__':

    app = QApplication(sys.argv)
    current_path = Path.cwd()
    ui_file = current_path.joinpath("Main.ui")
    form = Form(str(ui_file))
    form.window.show()
    sys.exit(app.exec_())
