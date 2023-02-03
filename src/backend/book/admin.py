from django.contrib import admin
from .models import Book, Chapter, Road, Crossroad, Path
from django import forms

from django.contrib import admin
from django.contrib.admin.models import LogEntry
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from django.utils.timesince import timesince
from jazzmin.utils import attr


    
class ChapterInline(admin.TabularInline):
    model = Chapter
    fields = [ "book", "title", "image", "audio"]
    extra = 0
    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):

        field = super().formfield_for_foreignkey(
            db_field, request, **kwargs)

        if db_field.name == 'next_chapter' or db_field.name == 'next_crossroad':
            book = request.book
            if book is not None:
                field.queryset = field.queryset.filter(
                    book__id=book.id)
                # widget changed to filter by building
                #field.widget.rel.limit_choices_to = {'book_id': book.id}
            else:
                field.queryset = field.queryset.none()
        return field


class RoadInline(admin.TabularInline):
    model = Road
    extra = 0 
    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):

        field = super().formfield_for_foreignkey(
            db_field, request, **kwargs)

        if db_field.name == 'next_chapter':
            book = request.book
            if book is not None:
                field.queryset = field.queryset.filter(
                    book__id=book.id)
                # widget changed to filter by building
                #field.widget.rel.limit_choices_to = {'book_id': book.id}
            else:
                field.queryset = field.queryset.none()

        return field

class CrossroadInline(admin.TabularInline):
    model = Crossroad
    extra = 0

    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):

        field = super().formfield_for_foreignkey(
            db_field, request, **kwargs)

        if db_field.name == 'next_chapter' or db_field.name == 'next_crossroad':
            book = request.book
            if book is not None:
                field.queryset = field.queryset.filter(
                    book__id=book.id)
                # widget changed to filter by building
                #field.widget.rel.limit_choices_to = {'book_id': book.id}
            else:
                field.queryset = field.queryset.none()
        return field

class PathInline(admin.TabularInline):
    model = Path
    readonly_fields = [ "book", "title", "image", "audio" ]
    fields = [ "is_start", "title" , "next_chapter", "next_crossroad" ]
    extra = 0   



@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    save_as = True
    save_on_top = True
    fields = [ "title", "author", "publisher", "year", "isbn", "description", "image"]
    
    inlines = (ChapterInline, RoadInline, CrossroadInline, PathInline)
    
    def get_form(self, request, obj=None, **kwargs):
        # just save obj reference for future processing in Inline
        request.book = obj
        return super().get_form(request, obj, **kwargs)

    


