from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.core import serializers
from django.shortcuts import render

import json
import urllib

# Create your views here.
from rest_framework.views import APIView
import base64

import uuid
import requests
import ssl
# Create your views here.
from ServerApplication.component.BicycleManager import BicycleManager


def index(request):
    return HttpResponse("Response!!!")


class Register(APIView):

    def get(self,request):
        print("Is called")
        roomid = '123455'
        myip = "localhost"
        sessionid = BicycleManager.createBikeRoom(roomid, myip)
        if (sessionid == 'create session unsuccessful'):

            loop = True
        token = BicycleManager.createJoinRequest(sessionid, myip)
        if (sessionid == 'session can not be join'):
            loop = True
        loop = False
        print(token)
        return HttpResponse("Its fine")