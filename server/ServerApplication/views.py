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


def index(request):
    return HttpResponse("Response!!!")


class Register(APIView):

    def get(self,request):

        url = 'https://' + 'localhost' + ':4443/api/tokens'
        data = {'session':'eejraohtbyuj0q76'}
        header = {
                'Authorization': "Basic " + base64.b64encode(b"OPENVIDUAPP:MY_SECRET").decode("utf-8", "ignore"),
                'Content-Type': 'application/json'
            }
        print("Ready to send")
        r = requests.post(url=url,data=json.dumps(data),headers=header, verify=False)
        print(r.json())
        return HttpResponse("Response!!!")