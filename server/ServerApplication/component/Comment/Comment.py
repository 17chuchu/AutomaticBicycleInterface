import json

class Comment:

    Login = 1

    @staticmethod
    def generateLoginComment(comment):
        data = {}
        data['code'] = Comment.Login
        data['comment'] = comment
        return data


