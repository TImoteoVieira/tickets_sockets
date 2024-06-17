from django.contrib import admin

# Register your models here.


from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'user', 'created_at')
    search_fields = ('id', 'description', 'user', 'created_at')
    list_filter = ('id', 'description', 'user', 'created_at')
    # ordering = ('id', 'description', 'user', 'created_at')
    # date_hierarchy = ('id', 'description', 'user', 'created_at')
    # readonly_fields = ('id', 'description', 'user', 'created_at')
    # list_per_page = 10
    # list_max_show_all = 100
    # list_select_related = ('id', 'description', 'user', 'created_at')