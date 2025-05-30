# ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE

from django.db import models

# Create your models here.

class RoadAnomalyDataReceived(models.Model):
    batch_id = models.BigIntegerField()

    acc_x = models.FloatField()
    acc_y = models.FloatField()
    acc_z = models.FloatField()

    rot_x = models.FloatField()
    rot_y = models.FloatField()
    rot_z = models.FloatField()

    speed = models.FloatField()

    timestamp = models.TextField(format)
    log_interval = models.BigIntegerField()

    latitude = models.FloatField(default = 0)
    longitude = models.FloatField(default = 0)
    accuracy = models.FloatField(default = 0)

    def __str__(self):
        return f"Road Anomaly Data received from App @{self.timestamp}  | speed : {self.speed}"