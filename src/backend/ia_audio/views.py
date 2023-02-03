from django.shortcuts import redirect

#redirect to the login page
def redirect_view(request):
    response = redirect('/admin/')
    return response