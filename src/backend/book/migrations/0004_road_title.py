# Generated by Django 4.0.3 on 2022-04-25 11:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0003_remove_road_road_choice_remove_road_title_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='road',
            name='title',
            field=models.CharField(default=1, max_length=128),
            preserve_default=False,
        ),
    ]
