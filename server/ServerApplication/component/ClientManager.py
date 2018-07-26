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

    MeansManagerReference = None

    __loginUser = SpecialDict()
    __tokenTimer = dict()

    clientroom = SpecialDict()

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
            #if('token' in obj['pack']):
            #    ClientManager.refreshToken(json.loads(obj['pack'])['token'])
            print(obj)

            if(obj['code'] == ClientComment.Login):
                self.sendMessage(json.dumps(ClientManager.login(obj['pack'])))
            elif(obj['code'] == ClientComment.Visitorlogin):
                result = ClientManager.loginVisitor(obj['pack'])
                if(result != None):
                    self.sendMessage(json.dumps(result))
            elif(obj['code'] == ClientComment.CheckBike):
                self.sendMessage(json.dumps(ClientManager.checkbike(obj['pack'])))
            elif(obj['code'] == ClientComment.AskForVideo):
                self.sendMessage(json.dumps(ClientManager.askforvideo(obj['pack'])))
            elif(obj['code'] == ClientComment.GiveDirection):
                ClientManager.givedirection(obj['pack'],obj['token'])
                #self.sendMessage(json.dumps(ClientManager.givedirection(obj['pack'])))
            elif(obj['code'] == ClientComment.AskForControl):
                result = ClientManager.bindtobike(obj['pack'],obj['token'])
                if(result != None):
                    self.sendMessage(json.dumps(result))


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
    def loginVisitor(request):
        data = json.loads(request)
        if("visitorid" in data):
            authToken = str(uuid.uuid4()).replace("-", "")
            ClientManager.__loginUser[authToken] = "id"+str(uuid.uuid4())
            ClientManager.refreshToken(authToken)
            token = ClientComment.generateLoginComment(authToken)
            return token
        return None


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
    def askforvideo(request):
        data = json.loads(request)

        data['token'] = ClientManager.clientroom[data['bikeid']]
        return ClientComment.generateAskForVideo(data)

    @staticmethod
    def broadcastbike(id,isOnline):
        data = json.loads(request)
        pack = dict()
        pack["isBikeOnline"] = "Offline"
        pack["bikeid"] = data["bikeid"]

    @staticmethod
    def givedirection(request,token):
        data = json.loads(request)
        if (token in ClientManager.__loginUser):
            BicycleManager.sendDirection(data["direction"],data["bikeid"],ClientManager.__loginUser[token])


    @staticmethod
    def bindtobike(request,token):
        data = json.loads(request)
        if(token in ClientManager.__loginUser):
            result = BicycleManager.bindToBike(data['status'],data['bikeid'],ClientManager.__loginUser[token])
            if(type(result) == float):
                return ClientComment.generateAskForControl(float(result))



        '''
        data = json.loads(request)

        roomid = BicycleManager.bicycleroom[data['bikeid']]

        sessionid = BicycleManager.createBikeRoom(roomid)
        if (sessionid == 'create session unsuccessful'):
            print("Bike :", data['comment'], "want to publish a room.")
            loop = True
        print("Session ID :", sessionid)
        token = BicycleManager.createJoinRequest(sessionid)
        if (token == 'session can not be join'):
            loop = True
        loop = False
        data['token'] = token
        print(token)

        comment = ClientComment.generateAskForVideo(data)
        return comment'''


        '''
        data = json.loads(request)

        sessionid = BicycleManager.bicycleroom[data['bikeid']]
        print("Session id is",sessionid)

        token = BicycleManager.createJoinRequest(sessionid)
        if (token == 'session can not be join'):
                print('Session :',sessionid,'can not be join :')

        data['token'] = token
        return ClientComment.generateAskForVideo(data)
        '''

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