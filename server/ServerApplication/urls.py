import time

from django.urls import path, include

from ServerApplication.component.ClientManager import ClientManager
from ServerApplication.component.BicycleManager import BicycleManager
from ServerApplication.component.MeansManager import MeansManager
from ServerApplication.models import Client
from . import views

import uuid

urlpatterns = [
    path('ServerCheck/',views.index),
    path('RtcCheck/',views.Register.as_view()),
]

ClientManager.initManager()
BicycleManager.initManager()
MeansManager.initManager()


#nclient = Client(id = str(uuid.uuid4()).replace("-", ""),autoritytag = 1,username="Sassboi68",password="1234",email="17chuchu.guy@gmail.com")
#nclient.save()
#print("Save new client")