
from .serializers import userSerializer, historySerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import history
from .recommendationEngine import RecommendationSystem
from django.http import JsonResponse

class createUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = userSerializer
    permission_classes = [AllowAny]

# @api_view(['PUT'])
class addToHistory(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, show_id):
        try:
            user = request.user
            print(f"---------------Current user: {user}") 
            data = {
                'user_name':user,
                'showId':show_id
            }
            serializer = historySerializer(data=data, context={'request': request})
            if (serializer.is_valid()):
                history_entry = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET']) 
@permission_classes([AllowAny])
def getRecommendations(request, movie_Id):
    
    recommender = RecommendationSystem()
    recommendations = recommender.getrecommendation(movie_Id)
    '''recommendations.to_dict(orient='records') converts the DataFrame
     to a list of dictionaries. Each dictionary represents a row in the 
     DataFrame, with column names as keys and cell values as values.'''
    recommendations_list = recommendations.to_dict(orient='records')
    return JsonResponse(recommendations_list, safe=False)

