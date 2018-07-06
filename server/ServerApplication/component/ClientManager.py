from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from django.http import HttpResponse, JsonResponse
import ssl
import threading

import json
import uuid
import datetime
import time

from ServerApplication.component.Comment.ClientComment import ClientComment
from ServerApplication.component.SpecialStructure.SpecialDict import SpecialDict
from ServerApplication.component.BicycleManager import BicycleManager
from ServerApplication.component.Tag.AutorityTag import AutorityTag
from ServerApplication.models import Client


class ClientManager(WebSocket):
    status = False
    clientport = 7001

    clients = []

    @staticmethod
    def initManager():
        if(ClientManager.status == False):
            thread = threading.Thread(target=ClientManager.runClientSocket)
            thread.start()
            print('WebSocket starts at port ' + str(ClientManager.clientport))
            ClientManager.status = True

    @staticmethod
    def runClientSocket():
        server = SimpleWebSocketServer('', ClientManager.clientport, ClientManager)
        server.serveforever()
        pass




    def handleMessage(self):
        print('-- Client Message Incoming --')
        try:
            obj = json.loads(self.data)
            print(obj)
            if(obj['code'] == ClientComment.Login):
                self.sendMessage(json.dumps(ClientManager.login(obj['pack'])))
            elif(obj['code'] == ClientComment.CheckBike):
                self.sendMessage(json.dumps(ClientManager.checkbike(obj['pack'])))

        except Exception as e:
            print("Client Message Error :",e)



        #self.sendMessage(self.data)

    def handleConnected(self):
        print('-- Client Connection Incoming --')
        ClientManager.clients.append(self)
        print('Client Connection Successful :', self.address)

    def handleClose(self):
        ClientManager.clients.remove(self)
        print('-- Client Disconnection Incoming --')
        print('Close ClientSocket Successful :', self.address)




    __loginUser = SpecialDict()
    __tokenTimer = dict()


    @staticmethod
    def clienttoString(client):
        info = dict()
        info["id"] = client.id
        info["autoritytag"] = client.autoritytag
        info["username"] = client.username
        info["password"] = ""
        info["email"] = client.email
        return json.dumps(info)

    @staticmethod
    def validateToken(token):
        diff = datetime.datetime.now() - ClientManager.__tokenTimer[token]
        form = divmod(diff.days * 86400 + diff.seconds, 60)
        return form[0] * 60 + form[1] > 60 * 60 * 12

    @staticmethod
    def refreshToken(token):
        ClientManager.__tokenTimer[token] = datetime.datetime.now()
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

        if (loginUser.id in ClientManager.__loginUser):

            authToken = ClientManager.__loginUser[loginUser.id]
        else:
            authToken = str(uuid.uuid4()).replace("-", "")
            ClientManager.__loginUser[authToken] = loginUser.id

        token = ClientComment.generateLoginComment(authToken)
        ClientManager.refreshToken(authToken)
        userlist[0].password = ""
        token['info'] = ClientManager.clienttoString(userlist[0])

        return token

    @staticmethod
    def checkbike(request):
        data = json.loads(request)
        pack = dict()
        pack["isBikeOnline"] = "Offline"
        pack["bikeid"] = data["bikeid"]

        if("bikeid" in data):
            if(data["bikeid"] in BicycleManager.bicycleid):
                pack["isBikeOnline"] = "Online"

        comment = ClientComment.generateCheckBikeComment(pack)
        return comment

    @staticmethod
    def broadcastbike(id,isOnline):
        data = json.loads(request)
        pack = dict()
        pack["isBikeOnline"] = "Offline"
        pack["bikeid"] = data["bikeid"]