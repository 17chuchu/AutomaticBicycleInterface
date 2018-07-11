import json

class ClientComment:

    Login = 1
    CheckBike = 2
    AskForVideo = 3

    @staticmethod
    def generateLoginComment(comment):
        data = dict()
        data['code'] = ClientComment.Login
        data['pack'] = comment
        return data

    @staticmethod
    def generateCheckBikeComment(comment):
        data = dict()
        data['code'] = ClientComment.CheckBike
        data['pack'] = comment
        return data

    @staticmethod
    def generateAskForVideo(comment):
        data = dict()
        data['code'] = ClientComment.AskForVideo
        data['pack'] = comment
        return data

