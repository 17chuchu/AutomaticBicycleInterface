import json

class BikeComment:

    @staticmethod
    def generateComment(command, topic, comment):
        data = dict()
        data['command'] = command
        data['topic'] = topic
        data['comment'] = comment
        return data
