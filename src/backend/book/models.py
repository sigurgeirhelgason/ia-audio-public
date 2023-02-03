from django.db import models

import os
import uuid

from django.db import models
from django.dispatch import receiver
from .validators import validate_file_extension

from mutagen.mp3 import MP3

def make_audio_path(instance, filename):
   print (f"this is the instance: {instance.book}")
   bid = instance.book.id
   path = f'{bid}/audio/{filename}'
   return path

def make_images_path(instance, filename):
   print (f"this is the instance: {instance.book}")
   bid = instance.book.id
   path = f'{bid}/images/{filename}'
   return path

def return_audio_length(filename):
    audio_file = MP3(filename)
    print (f"this is the length: {audio_file.info.length}")
    return (audio_file.info.length*1000)



class Book(models.Model):
    title = models.CharField(max_length=128)
    author = models.CharField(max_length=128,null=True, blank=True)
    publisher = models.CharField(max_length=128,null=True, blank=True)
    year = models.PositiveSmallIntegerField(null=True, blank=True)
    isbn = models.CharField(max_length=28,null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(default="default_book.png", null=True, blank=True)
    create_on = models.DateTimeField(auto_now_add=True)
    

    
    def __str__(self) -> str:
        return f"{self.title}"




class Chapter(models.Model):
    book = models.ForeignKey(Book, 
        on_delete=models.CASCADE,
        related_name='book')
    is_start = models.BooleanField(default=False, help_text="Is this the start of the book?")
    is_end = models.BooleanField(default=False)
    title = models.CharField(max_length=128)
    image = models.ImageField(null=True, blank=True, upload_to=make_images_path)
    audio = models.FileField(upload_to=make_audio_path, validators=[validate_file_extension])
    next_chapter = models.ForeignKey(to='Chapter', on_delete=models.SET_NULL, null=True, blank=True)
    next_crossroad = models.ForeignKey(to='Crossroad', on_delete=models.SET_NULL, null=True, blank=True)
    duration = models.FloatField(null=True, blank=True)


    def __str__(self) -> str:   
        return f"{self.title}"
    
    def save(self, *args, **kwargs):
        super(Chapter, self).save(*args, **kwargs)
        if self.audio:
            self.duration = return_audio_length(self.audio.path)
        
        if not self.next_chapter and not self.next_crossroad:
            self.is_end = True
        else:
            self.is_end = False

        if self.is_start:
            try:
                temp = Chapter.objects.get(is_start=True)
                if self != temp:
                    temp.is_start = False
                    temp.save()
            except Chapter.DoesNotExist:
                pass
        super(Chapter, self).save(*args, **kwargs)

class Path(Chapter):

    class Meta:
        proxy = True


class Road(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    title = models.CharField(max_length=128)
    text = models.CharField(max_length=256, help_text="The option reader is given",)
    next_chapter = models.ForeignKey(Chapter,on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.title}"

class Crossroad(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    title = models.CharField(max_length=128)
    text = models.CharField(max_length=256, help_text="The question reader is given", null=True, blank=True)
    roads = models.ManyToManyField(Road)
    audio = models.FileField(upload_to=make_audio_path, null=True, blank=True)
    duration = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
            super(Crossroad, self).save(*args, **kwargs)
            if self.audio:
                self.duration = return_audio_length(self.audio.path)
            super(Crossroad, self).save(*args, **kwargs)
            

    def __str__(self) -> str:
        return f"{self.title}"
    

@receiver(models.signals.post_delete, sender=Chapter)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `Chapter.audio` object is deleted.
    """
    if instance.audio:
        if os.path.isfile(instance.audio.path):
            os.remove(instance.audio.path)

@receiver(models.signals.pre_save, sender=Chapter.audio)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `Chapter` object is updated
    with new file.
    """
    if not instance.pk:
        return False

    try:
        old_file = Chapter.objects.get(pk=instance.pk).audio
    except Chapter.audio.DoesNotExist:
        return False

    new_file = instance.audio
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)
