import json

class BikeComment:

    Login = 1

    @staticmethod
    def generateLoginComment(command,topic,comment):
        data = dict()
        data['command'] = command
        data['topic'] = topic
        data['comment'] = comment
        return data
