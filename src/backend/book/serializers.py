from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Book, Chapter, Crossroad, Road
from rest_framework_simplejwt.tokens import RefreshToken

# class TokenSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=Token
#         fields=("user", "token",)


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model=Book
        fields = '__all__'
        

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model=Chapter
        fields = '__all__'
        
class CrossroadSerializer(serializers.ModelSerializer):
    class Meta:
        model=Crossroad
        fields = '__all__'
         
class RoadSerializer(serializers.ModelSerializer):
    class Meta:
        model=Road
        fields = '__all__'
        