#!/usr/bin/env python
# Software License Agreement (BSD License)
#
# Copyright (c) 2008, Willow Garage, Inc.
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#
#  * Redistributions of source code must retain the above copyright
#    notice, this list of conditions and the following disclaimer.
#  * Redistributions in binary form must reproduce the above
#    copyright notice, this list of conditions and the following
#    disclaimer in the documentation and/or other materials provided
#    with the distribution.
#  * Neither the name of Willow Garage, Inc. nor the names of its
#    contributors may be used to endorse or promote products derived
#    from this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
# FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
# COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
# INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
# BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
# LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
# ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.
#
# Revision $Id$

## Simple talker demo that published std_msgs/Strings messages
## to the 'chatter' topic

import json
#import rospy
import threading
import websocket
import uuid
import time
import os
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

class Comment:
    def __init__(self,command,topic,comment):
        self.command = command
        self.topic = topic
        self.comment = comment

    @staticmethod
    def strToComment(request):
        data = json.loads(request)
    
        command = (data['command'] if ('command' in data) else 'undefined')
        topic = (data['topic'] if ('topic' in data) else 'undefined')
        comment = (data['comment'] if ('comment' in data) else 'undefined')
        
        return Comment(id,topic,comment)
    
    @staticmethod
    def commentToJsonStr(comment):
        data = dict()
        data['command'] = (comment.command if (type(comment.command) == str) else 'undefined')
        data['topic'] = comment.topic
        data['comment'] = comment.comment
        return json.dumps(data)

    def toString(self):
        return 'command :' , self.command,'\ntopic :' , self.topic,'\ncommant', self.comment


class CameraManager(WebSocket):
    status = False

    camerathread = None
    currentcamera = None
    roomid = ""

    meansport = 7110

    @staticmethod
    def initManager():
        if(CameraManager.status == False):
            thread = threading.Thread(target=CameraManager.runClientSocket)
            thread.start()
            CameraManager.status = True

            thread2 = threading.Thread(target=CameraManager.continueSending)
            thread2.start()
            print('WebSocket starts at port ' + str(CameraManager.meansport))

    @staticmethod
    def runClientSocket():
        server = SimpleWebSocketServer('', CameraManager.meansport, CameraManager)
        server.serveforever()
        pass

    @staticmethod
    def continueSending():
        print("Start feeding roomid to camera.")
        while(True):
            if(CameraManager.currentcamera != None):
                CameraManager.currentcamera.sendMessage(CameraManager.roomid)
            time.sleep(1)

    def handleMessage(self):
        print('-- Means Message Incoming --')
        try:
            pass
        except Exception as e:
            print("Message error is : " + e)

    def handleConnected(self):
        print('-- Camera Connection Incoming --')
        try:
            CameraManager.currentcamera = self
        except Exception as e:
            print("Message error is : " + e)



    def handleClose(self):
        print('-- Camera Disconnection Incoming --')
        try:
            CameraManager.currentcamera = None
            pass
        except Exception as e:
            print("Message error is : " + e)



class ClientSocket:

    ws = None
    isWSConnect = False

    nodeThread = []

    bikeid = 'BK-1234'

    port = "7010"
    ip = "localhost"

    @staticmethod
    def initialize():
        websocket.enableTrace(True);
        ClientSocket.ws = websocket.WebSocketApp('ws://' + ClientSocket.ip + ':' + ClientSocket.port + '/',
                                                on_message=ClientSocket.on_message,
                                                on_close=ClientSocket.on_close,
                                                on_open=ClientSocket.on_open,
                                                on_error=ClientSocket.on_error)
        
    @staticmethod
    def on_open(ws):
        ClientSocket.isWSConnect = True
        print('Connected to server: ' + ClientSocket.ip)

    
    @staticmethod
    def on_message(ws,message):
        #print(message)
        try:
            command = Comment.strToComment(message)
            if(command.topic == 'id'):
                command.comment = ClientSocket.bikeid
                ClientSocket.ws.send(Comment.commentToJsonStr(command))

            elif(command.topic == 'requestopenroom'):
                command.comment = ClientSocket.bikeid
                ClientSocket.ws.send(Comment.commentToJsonStr(command))
            elif(command.topic == 'openroomtoken'):
                #os.system('npm start')
                CameraManager.roomid = command.comment
                print('Assigned roomid is :',CameraManager.roomid)
        except Exception as e:
            print("Message error is : " + e)

    @staticmethod
    def on_close(ws):
        ClientSocket.isWSConnect = False
        print('Disconnect from server: ' + ClientSocket.ip)

    @staticmethod
    def on_error(ws,error):
        print('WebSocket Error:',error)
        #os.system('npm start')


'''
def talker():
    pub = rospy.Publisher('chatter', String, queue_size=10)
    rospy.init_node('talker', anonymous=True)
    rate = rospy.Rate(10) # 10hz
    while not rospy.is_shutdown():
        print('Published')
        hello_str = "hello world %s" % rospy.get_time()
        rospy.loginfo(hello_str)
        pub.publish(hello_str)
        rate.sleep()'''

def runSocketServer():
    ClientSocket.initialize()
    while(True):
        if(not ClientSocket.isWSConnect):
            ClientSocket.ws.run_forever()
        time.sleep(1)

if __name__ == '__main__':
    try:
        #talker()
        CameraManager.initManager()
        thread = threading.Thread(target=runSocketServer)
        thread.start()
        
    except rospy.ROSInterruptException:
        pass
