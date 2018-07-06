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

    bicycleclient = SpecialDict()
    bicycleid = SpecialDict()
    bicycleroom = SpecialDict()

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

            if(data['topic'] == 'requestopenroom'):
                roomid = str(uuid.uuid4()).replace('-', '')

                print("Bike :",data['comment'],"want to publish a room.")
                BicycleManager.bicycleroom[roomid] = data['comment']

                def createRoom(roomid,myip):

                    loop = True
                    while(loop):
                        sessionid = BicycleManager.createBikeRoom(roomid,myip)
                        if(sessionid == 'create session unsuccessful'):
                            print("Bike :", data['comment'], "want to publish a room.")
                            loop = True
                        token = BicycleManager.createJoinRequest(sessionid,myip)
                        if(sessionid == 'session can not be join'):
                            loop = True
                        loop = False
                        data['topic'] = 'openroomtoken'
                        data['comment'] = token
                        self.sendMessage(json.dumps(data))

                thread = threading.Thread(target=lambda: createRoom(roomid, "10.2.1.178"))
                thread.start()

        except Exception as e:
            print("Message error is : " + e)



        #self.sendMessage(self.data)

    def handleConnected(self):
        print('-- Bike Connection Incoming --')
        try:
            BicycleManager.bicycleclient[str(self.address)] = self
            BicycleManager.bicycleid[str(self.address)] = "undefined"
            print('Bicycle Connection Successful :', self.address)

            comment = BikeComment.generateLoginComment("None","id","None")
            self.sendMessage(json.dumps(comment))

            comment = BikeComment.generateLoginComment("None","requestopenroom","None")
            self.sendMessage(json.dumps(comment))

        except Exception as e:
            print("Message error is : " + e)



    def handleClose(self):
        print('-- Bike Disconnection Incoming --')
        try:
            BicycleManager.bicycleclient.pop(str(self.address))
            print('Sign-out bicycle id :',BicycleManager.bicycleid[str(self.address)])
            if(BicycleManager.bicycleid[str(self.address)] is not None):
                pass

            BicycleManager.bicycleid.pop(str(self.address))
            print('Close BicycleSocket Successful :', self.address)
        except Exception as e:
            print("Message error is : " + e)

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
        diff = datetime.datetime.now() - BicycleManager.__tokenTimer[token]
        form = divmod(diff.days * 86400 + diff.seconds, 60)
        return form[0] * 60 + form[1] > 60 * 60 * 12

    @staticmethod
    def refreshToken(token):
        BicycleManager.__tokenTimer[token] = datetime.datetime.now()

    @staticmethod
    def createBikeRoom(roomid, myip):
        url = 'https://' + myip + ':4443/api/sessions'
        data = {'session': roomid}
        header = {
            'Authorization': "Basic " + base64.b64encode(b"OPENVIDUAPP:MY_SECRET").decode("utf-8", "ignore"),
            'Content-Type': 'application/json'
        }
        r = requests.post(url=url, data=json.dumps(data), headers=header, verify=False)

        data = r.json()
        if('id' in data):
            return data['id']
        return 'create session unsuccessful'

    @staticmethod
    def createJoinRequest(roomid, myip):
        url = 'https://' + myip + ':4443/api/tokens'
        data = {'session': roomid}
        header = {
            'Authorization': "Basic " + base64.b64encode(b"OPENVIDUAPP:MY_SECRET").decode("utf-8", "ignore"),
            'Content-Type': 'application/json'
        }
        r = requests.post(url=url, data=json.dumps(data), headers=header, verify=False)

        data = r.json()
        if('error' in data):
            return "session can not be join"
        return data['token']

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