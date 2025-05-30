# ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE
from django.urls import path, include
from rest_framework import serializers, viewsets, routers
from .models import RoadAnomalyPredictionOutput


class RoadAnomalyPredictionOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadAnomalyPredictionOutput
        fields = ("id","batch_id","acc_x", "acc_y", "acc_z", "rot_x", "rot_y", "rot_z", "speed", "timestamp", "log_interval","latitude","longitude","accuracy","anomaly_prediction")


class RoadAnomalyPredictionOutputViewSet(viewsets.ModelViewSet):
    queryset = RoadAnomalyPredictionOutput.objects.all()
    serializer_class = RoadAnomalyPredictionOutputSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)


router = routers.DefaultRouter()
router.register(r"road_anomaly_predict", RoadAnomalyPredictionOutputViewSet)

urlpatterns = [
    path("",include(router.urls)),
    path("api-auth/", include('rest_framework.urls', namespace="rest_framework"))

]