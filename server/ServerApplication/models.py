from django.db import models

# Create your models here.


class Client(models.Model):
    id = models.CharField(primary_key=True, max_length=100, blank=True, default='')
    autoritytag = models.IntegerField()

    username = models.CharField(max_length=100, blank=True, default='')
    password = models.CharField(max_length=100, blank=True, default='')
    email = models.CharField(max_length=100, blank=True, default='')