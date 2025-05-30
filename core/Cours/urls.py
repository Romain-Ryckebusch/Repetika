from django.urls import path
from .views import GetChapter, GetPDF,UploadAPIView, DeleteCourse, ShareCourse

urlpatterns = [
    path('getChapter', GetChapter.as_view()),
    path('getPDF', GetPDF.as_view()),
    path('ajout-cours', UploadAPIView.as_view(), name='ajout-cours'),
    path('deleteCourse', DeleteCourse.as_view()),
    path('shareCourse', ShareCourse.as_view()),  # Assuming this is the same view as DeleteCourse
]