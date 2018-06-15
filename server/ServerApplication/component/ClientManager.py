from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import threading


class ClientManager(WebSocket):
    status = False

    clients = []
    port = 7000

    @staticmethod
    def initManager():
        if(ClientManager.status == False):
            thread = threading.Thread(target=ClientManager.runSocket)
            thread.start()
            print('WebSocket starts at port 7000.')
            ClientManager.status = True

    @staticmethod
    def runSocket():
        server = SimpleWebSocketServer('', ClientManager.port, ClientManager)
        server.serveforever()
        pass




    def handleMessage(self):
        print(self.data)
        for c in ClientManager.clients:
            c.sendMessage(self.data)

    def handleConnected(self):
        ClientManager.clients.append(self)
        print('Connection Successful :', self.address)

    def handleClose(self):
        ClientManager.clients.remove(self)
        print('Close Socket Successful :', self.address)
