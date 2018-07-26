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

from ServerApplication.component.Comment.BikeComment import BikeComment
from ServerApplication.component.Comment.ClientComment import ClientComment
from ServerApplication.component.SpecialStructure.SpecialDict import SpecialDict
from ServerApplication.component.Tag.AutorityTag import AutorityTag
from ServerApplication.models import Client


class BicycleManager(WebSocket):
    status = False

    MeansManagerReference = None

    bicyclesocketref = SpecialDict()
    bicycleid = SpecialDict()
    bicycleroom = SpecialDict()

    usertimeout = SpecialDict()
    usertobike = SpecialDict()

    bicycleport = 7010

    @staticmethod
    def initManager():
        if(BicycleManager.status == False):
            thread = threading.Thread(target=BicycleManager.runClientSocket)
            thread.start()
            print('WebSocket starts at port ' + str(BicycleManager.bicycleport))
            BicycleManager.status = True

    @staticmethod
    def runClientSocket():
        server = SimpleWebSocketServer('', BicycleManager.bicycleport, BicycleManager)
        server.serveforever()
        pass




    def handleMessage(self):
        print('-- Bike Message Incoming --')
        try:
            data = json.loads(self.data)
            if(data['topic'] == 'id'):
                print("Register Bike :", data['comment'])
                BicycleManager.bicycleid[str(self.address)] = data['comment']
                BicycleManager.bicyclesocketref[data['comment']] = self

            if(data['topic'] == 'requestopenroom'):
                print("Bike :",data['comment'],"want to publish to a room.")
                bikeid = data['comment']
                BicycleManager.MeansManagerReference.registerNewRoom(bikeid)
                comment = BikeComment.generateComment('','openroomtoken',BicycleManager.bicycleroom[bikeid])
                self.sendMessage(json.dumps(comment))
        except Exception as e:
            print("Message error is : " + e)

        #self.sendMessage(self.data)

    def handleConnected(self):
        print('-- Bike Connection Incoming --')
        try:
            BicycleManager.bicycleid[str(self.address)] = "undefined"
            print('Bicycle Connection Successful :', self.address)

            comment = BikeComment.generateComment("None", "id", "None")
            self.sendMessage(json.dumps(comment))

            comment = BikeComment.generateComment("None", "requestopenroom", "None")
            self.sendMessage(json.dumps(comment))

        except Exception as e:
            print("Message error is : " + e)



    def handleClose(self):
        print('-- Bike Disconnection Incoming --')
        try:
            print('Sign-out bicycle id :',BicycleManager.bicycleid[str(self.address)])

            BicycleManager.bicycleid.pop(str(self.address))
            print('Close BicycleSocket Successful :', self.address)
        except Exception as e:
            print("Message error is : " + e)

    @staticmethod
    def login(request):
        data = json.loads(request)

        if ("username" in data):
            userlist = Client.objects.filter(username=data["username"], password=data["password"])
        elif ("email" in data):
            userlist = Client.objects.filter(email=data["email"], password=data["password"])
        else:
            return ClientComment.generateLoginComment("Login Unsuccessful.")

        if (len(userlist) != 0):
            loginUser = userlist[0]
        else:
            return ClientComment.generateLoginComment("Login Unsuccessful.")

        if (loginUser.id in BicycleManager.__loginUser):

            authToken = BicycleManager.__loginUser[loginUser.id]
        else:
            authToken = str(uuid.uuid4()).replace("-", "")
            BicycleManager.__loginUser[authToken] = loginUser.id

        token = ClientComment.generateLoginComment(authToken)
        BicycleManager.refreshToken(authToken)
        userlist[0].password = ""
        token['info'] = BicycleManager.clienttoString(userlist[0])

        return token

    @staticmethod
    def bindToBike(status,bikeid,userid):
        if(status == "true" and bikeid in BicycleManager.bicycleid):
            if(bikeid not in BicycleManager.usertimeout or bikeid not in BicycleManager.usertobike):
                BicycleManager.usertobike[bikeid] = userid
                BicycleManager.usertimeout[bikeid] = datetime.datetime.now()
                print("Bike :", bikeid, "bind to a user", userid, "at", BicycleManager.bicycleid[bikeid])
                return True
            elif(bikeid in BicycleManager.usertimeout):
                print("Timeout is", (datetime.datetime.now() - BicycleManager.usertimeout[bikeid]).total_seconds())
                if((datetime.datetime.now() - BicycleManager.usertimeout[bikeid]).total_seconds() >= 60):
                    BicycleManager.usertimeout[bikeid] = datetime.datetime.now()
                    BicycleManager.usertobike[bikeid] = userid
                    print("Bike :", bikeid ,"bind to a user", userid ,"at", BicycleManager.bicycleid[bikeid])
                    return True
                else:
                    return float((datetime.datetime.now() - BicycleManager.usertimeout[bikeid]).total_seconds())
        else:
            print("Seperate bike", bikeid ,"from user", userid)
            if(userid in BicycleManager.usertobike):
                BicycleManager.usertobike.pop(bikeid)
                BicycleManager.usertimeout.pop(bikeid)
            return True

    @staticmethod
    def sendDirection(direction,bikeid,userid):
        if(BicycleManager.usertobike[userid] != bikeid):
            return False
        print("The direction is",json.dumps(BikeComment.generateComment("","givedirection",direction)))
        BicycleManager.bicyclesocketref[bikeid].sendMessage(json.dumps(BikeComment.generateComment("","givedirection",direction)))
        return True













    '''
        @staticmethod
        def getUserId(token):
            print(ClientManager.__loginUser)
            if token not in ClientManager.__loginUser:
                return "Fail"
            elif (time.mktime(ClientManager.__tokenTimer[token].timetuple()) - time.mktime(
                    datetime.datetime.now().timetuple())) >= 300:
                del ClientManager.__tokenTimer[token]
                del ClientManager.__loginUser[token]
                return "Fail"
            ClientManager.refreshToken(token)
            return ClientManager.__loginUser[token]
        '''
    '''
    @staticmethod
    def register(request):
        data = json.loads(request.body.decode("utf-8"))

        if (data["name"] == None or data["username"] == None or data["password"] == None or data["email"] == None):
            return Comment.generateDefaultRejection("You are missing some parameter.")

        if (len(data["password"]) > 30):
            return Comment.generatePasswordRejection("This password is too long.")
        elif ("#%!?" in str(data["password"])):
            return Comment.generateUserNRejection("This password contain some illegal charactor.")

        if (len(Client.objects.filter(username=data["username"])) != 0):
            return Comment.generateUserNRejection("This username is already taken.")
        elif ("#%!?" in str(data["username"])):
            return Comment.generateUserNRejection("This username contain some illegal charactor.")

        if (len(Client.objects.filter(email=data["email"])) != 0):
            return Comment.generateEmailRejection("This email is already taken.")

        tag = AutorityTag.Client

        nid = str(uuid.uuid4()).replace("-", "")
        while (len(Client.objects.filter(id=nid)) != 0):
            nid = str(uuid.uuid4()).replace("-", "")

        nClient = Client(id=nid, autoritytag=tag.value, username=data["username"],
                       password=data["password"],
                       email=data["email"])

        nClient.save()

        return Comment.generateSuccessfulComment("Your registeration for " + data["name"] + " is completed.")
    '''