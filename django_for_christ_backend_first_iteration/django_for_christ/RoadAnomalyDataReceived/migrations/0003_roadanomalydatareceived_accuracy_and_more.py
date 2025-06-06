# Generated by Django 5.1.3 on 2025-05-18 20:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("RoadAnomalyDataReceived", "0002_auto_20250505_1450"),
    ]

    operations = [
        migrations.AddField(
            model_name="roadanomalydatareceived",
            name="accuracy",
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name="roadanomalydatareceived",
            name="latitude",
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name="roadanomalydatareceived",
            name="longitude",
            field=models.FloatField(default=0),
        ),
    ]
