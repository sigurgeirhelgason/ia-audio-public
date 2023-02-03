from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()

    username = serializers.CharField(
        required=True,
        max_length=64,
        validators=[UniqueValidator(queryset=User.objects.all())]
        )
        
    password = serializers.CharField(
        required=True,
        min_length=1,
        write_only=True
        )

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            )
        user.set_password(validated_data['password'])
        user.save()

        return user


    def get_token(self, user):
        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


    class Meta:
        model = User
        fields = (
            'username',
            'password',
            'token',
            'id'
            )

