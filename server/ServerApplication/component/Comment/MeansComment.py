import json

class MeansComment:

    Login = 1

    @staticmethod
    def generateComment(topic, comment):
        data = dict()
        data['topic'] = topic
        data['comment'] = comment
        return  data