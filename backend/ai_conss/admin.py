from django.contrib import admin
from .models import (
    ConsensusTemplate,
    Question,
    Option,
    ScaleSetting,
    RangeSetting
)


# Inline 表：Option（用于单/多选题）
class OptionInline(admin.TabularInline):
    model = Option
    extra = 2  # 默认显示2个空白选项
    max_num = 10


# Inline 表：ScaleSetting（用于 scale 类型）
class ScaleSettingInline(admin.StackedInline):
    model = ScaleSetting
    extra = 0
    max_num = 1


# Inline 表：RangeSetting（用于 range 类型）
class RangeSettingInline(admin.StackedInline):
    model = RangeSetting
    extra = 0
    max_num = 1


# Question Admin 注册：根据题型自动显示不同 inline
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("question_text", "question_type", "template", "order")
    list_filter = ("question_type", "template")
    ordering = ("template", "order")

    def get_inline_instances(self, request, obj=None):
        inlines = []
        if obj:
            if obj.question_type in ["single_choice", "multi_choice"]:
                inlines.append(OptionInline(self.model, self.admin_site))
            if obj.question_type == "scale":
                inlines.append(ScaleSettingInline(self.model, self.admin_site))
            if obj.question_type == "range":
                inlines.append(RangeSettingInline(self.model, self.admin_site))
        return inlines


# Inline 表：Question（用于 ConsensusTemplate）
class QuestionInline(admin.StackedInline):
    model = Question
    extra = 1


# ConsensusTemplate Admin 注册
class ConsensusTemplateAdmin(admin.ModelAdmin):
    list_display = ("title", "description", "created_at")
    search_fields = ("title", "description")
    inlines = [QuestionInline]


# 注册所有模型
admin.site.register(ConsensusTemplate, ConsensusTemplateAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Option)
admin.site.register(ScaleSetting)
admin.site.register(RangeSetting)
