from django.test import TestCase, SimpleTestCase
from django.urls import reverse, resolve
from django.contrib import admin

# Create your tests here.

class APITestCase(SimpleTestCase):
    def test_login()