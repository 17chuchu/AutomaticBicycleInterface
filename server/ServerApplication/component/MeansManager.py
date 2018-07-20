from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from django.http import HttpResponse, JsonResponse
import ssl
import threading

import json
import uuid
import datetime
import time
import requests
import base64

from ServerApplication.component.BicycleManager import BicycleManager
from ServerApplication.component.ClientManager import ClientManager
from ServerApplication.component.Comment.MeansComment import MeansComment

from ServerApplication.component.SpecialStructure.SpecialDict import SpecialDict
from ServerApplication.component.Tag.AutorityTag import AutorityTag
from ServerApplication.models import Client


class MeansManager(WebSocket):
    status = False

    currentmeans = None

    meansport = 7100

    @staticmethod
    def initManager():
        if(MeansManager.status == False):
            BicycleManager.MeansManagerReference = MeansManager
            thread = threading.Thread(target=MeansManager.runClientSocket)
            thread.start()
            print('WebSocket starts at port ' + str(MeansManager.meansport))
            MeansManager.status = True

    @staticmethod
    def runClientSocket():
        server = SimpleWebSocketServer('', MeansManager.meansport, MeansManager)
        server.serveforever()
        pass




    def handleMessage(self):
        print('-- Means Message Incoming --')
        try:
            pass
        except Exception as e:
            print("Message error is : " + e)



        #self.sendMessage(self.data)

    def handleConnected(self):
        print('-- Means Connection Incoming --')
        try:
            MeansManager.currentmeans = self
            comment = MeansComment.generateComment("ping", "Connection Success")
            self.sendMessage(json.dumps(comment))

            for key,value in BicycleManager.bicycleroom.items():
                if('BK-' in key):
                    data = dict()
                    data['bikeid'] = key
                    data['bikeroomid'] = BicycleManager.bicycleroom[key]
                    data['clientroomid'] = ClientManager.clientroom[key]
                    info = json.dumps(MeansComment.generateComment('registerNewRoom', data))
                    MeansManager.currentmeans.sendMessage(info)

            print('-- Means Connection Successful --')

        except Exception as e:
            print("Message error is : " + e)



    def handleClose(self):
        print('-- Means Disconnection Incoming --')
        try:
            pass
        except Exception as e:
            print("Message error is : " + e)

    @staticmethod
    def registerNewRoom(bikeid):
        try:
            if(MeansManager.currentmeans != None):
                bikeroomid = str(uuid.uuid4()).replace('-','')
                clientroomid = str(uuid.uuid4()).replace('-','')

                data = dict()
                data['bikeroomid'] = bikeroomid
                data['clientroomid'] = clientroomid
                info = json.dumps(MeansComment.generateComment('registerNewRoom',data))
                MeansManager.currentmeans.sendMessage(info)

                BicycleManager.bicycleroom[bikeid] = bikeroomid
                ClientManager.clientroom[bikeid] = clientroomid
        except Exception as e:
            print("Message error is : " + e)

