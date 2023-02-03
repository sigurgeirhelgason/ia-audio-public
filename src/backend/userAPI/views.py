from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework.decorators import api_view 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import UserSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        print(f"This is the user: {user}")
        token = super().get_token(user)

        token['username'] = user.username

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class TestView(APIView):
    def get(self, request, format=None):
        print("Api test was called")
        return Response("Working good", status=200)
    
    def post():
        return 0
    

    def put():
        return 0


class UserView(APIView):
    def post(self, request, format=None):
        user_data = request.data
        user_data['is_active'] = False

        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid(raise_exception=False):
            user_serializer.save()
            print(f"LOG:\nUser has been create.\n {user_data}")
            return Response({"user": user_serializer.data}, status=200)
        else:
            print("LOG:\nInvalid post request.")
            return Response({"msg":"ERR"}, status=400)


@api_view(['GET'])
def get_routes(request):
    routes = [
    '/create',
    '/login', 
    '/refresh-token',
    '/api-auth',
    '/verify-token']

    return Response(routes)