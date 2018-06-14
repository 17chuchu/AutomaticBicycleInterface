from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.core import serializers
from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView

import uuid
import json
# Create your views here.


def index(request):
    return HttpResponse("Response!!!")


class Register(APIView):

    def post(self,request):
        return JsonResponse()