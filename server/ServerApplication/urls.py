

from django.urls import path, include

from ServerApplication.component.ClientManager import ClientManager
from . import views

urlpatterns = [
    path('ServerCheck/',views.index)
]

ClientManager.initManager()
