# Generated by Django 4.0.3 on 2022-04-12 14:38

import book.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=128)),
                ('author', models.CharField(blank=True, max_length=128, null=True)),
                ('publisher', models.CharField(blank=True, max_length=128, null=True)),
                ('year', models.PositiveSmallIntegerField(blank=True, null=True)),
                ('isbn', models.CharField(blank=True, max_length=28, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('image', models.ImageField(default='default_book.png', upload_to='')),
                ('create_on', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Chapter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_start', models.BooleanField(default=False, help_text='Is this the start of the book?')),
                ('title', models.CharField(max_length=128)),
                ('chapter_no', models.SmallIntegerField()),
                ('image', models.ImageField(blank=True, null=True, upload_to=book.models.make_images_path)),
                ('audio', models.FileField(upload_to=book.models.make_audio_path)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='book', to='book.book')),
                ('next_chapter', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='book.chapter')),
            ],
        ),
        migrations.CreateModel(
            name='Road',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=128)),
                ('road_choice', models.CharField(max_length=256)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='book.book')),
                ('next_chapter', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='book.chapter')),
            ],
        ),
        migrations.CreateModel(
            name='Crossroad',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=128)),
                ('audio', models.FileField(upload_to=book.models.make_audio_path)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='book.book')),
                ('roads', models.ManyToManyField(to='book.road')),
            ],
        ),
        migrations.AddField(
            model_name='chapter',
            name='next_crossroad',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='book.crossroad'),
        ),
    ]
