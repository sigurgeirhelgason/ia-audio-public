import os
from collections import namedtuple
from io import BytesIO
from zipfile import ZIP_DEFLATED, ZipFile

from django.conf import settings
from django.http import HttpResponse
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Book, Chapter, Crossroad, Road
from .serializers import (BookSerializer, ChapterSerializer,
                          CrossroadSerializer, RoadSerializer)


class BookList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = BookSerializer
    queryset = Book.objects.all()

class BookDetails(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = BookSerializer
    queryset = Book.objects.all()

class ChapterList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = ChapterSerializer
    def get_queryset(self):
        return Chapter.objects.filter(book=self.kwargs['pk'])

class ChapterDetails(generics.RetrieveAPIView):
    print ("ChapterDetails")
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = ChapterSerializer
    def get_queryset(self):
        print (self.kwargs['pk'], self.kwargs['chapterid'])
        return Chapter.objects.filter(id=self.kwargs['chapterid'])


class CrossroadList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = CrossroadSerializer
    def get_queryset(self):
        return Crossroad.objects.filter(book=self.kwargs['pk'])

class RoadList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = RoadSerializer
    def get_queryset(self):
        return Road.objects.filter(book=self.kwargs['pk'])

class StoryList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = RoadSerializer
    queryset = Road.objects.all()

class RoadDetails(generics.RetrieveAPIView):
    permissions_classes = (permissions.IsAuthenticated,)
    authentication_classes = [JWTAuthentication]
    serializer_class = RoadSerializer
    queryset = Road.objects.all()


@api_view(['GET'])
def get_book_routes(request):
    routes = [
    '/get_all',]
    return Response(routes)


def get_paths(request):
    book =  Book.objects.get(id=request.id)
    chapters =  Chapter.objects.get(book=book.id)
    crossroad =  Crossroad.objects.get(book=book.id)
    roads = Crossroad.objects.get(book=book.id)
    book_serializer = BookSerializer(book)
    chapter_serializer =  ChapterSerializer(book)
    crossroad_serializer = CrossroadSerializer(book)
    road_serializer = RoadSerializer(book)
    path = [book_serializer, chapter_serializer.data, crossroad_serializer.data, road_serializer.data]
    json_data = JSONRenderer().render(path)
    return HttpResponse(json_data, content_type='application/json',status=200)

'''
zipBookMedia (book_id) that checks if the book with matching id has a value in zip_version 
if not it creates a zip file with the book media, returns the path to the zip file and updates the zip_version to url of zip file
if the book has a value in zip_version it returns the value of zip_version

'''
# def zipBookMedia (request, book_id):
#     book = Book.objects.get(id=book_id)
#     if not book.zip_version.name:
#         book_path = os.path.join(settings.MEDIA_ROOT, str(book_id))
#         print (f"{book_path} - this is the path to the book")
#         with ZipFile(f"/media/{book_id}", 'w', ZIP_DEFLATED) as zip:
#             for root, dirs, files in os.walk(book_path):
#                 for file in files:
#                     zip.write(os.path.join(root, file))
#         book.zip_version = f'{book_path}/{book_id}.zip'
#         book.save()
#     return HttpResponse({{book_id} : book.zip_version}, content_type='application/json',status=200)


def get_media(request, pk):
    book_id = pk
    book = Book.objects.get(id=book_id)     
    in_memory = BytesIO()
    zip = ZipFile(in_memory, "a")
    book_path = os.path.join(settings.MEDIA_ROOT, str(book_id))
  
    for dirname, subdirs, files in os.walk(book_path):
        for filename in files:
            absname = os.path.abspath(os.path.join(dirname, filename))
            arcname = absname[len(book_path) + 1:]
            print (f'zipping {os.path.join(dirname, filename)} as {arcname}')
            zip.write(absname, arcname)

    for file in zip.filelist:
        file.create_system = 0    
        
    zip.close()

    response = HttpResponse(content_type="application/zip")
    response["Content-Disposition"] = f"attachment; filename=media_{book_id}.zip"
    
    in_memory.seek(0)    
    response.write(in_memory.read())
    
    return response
