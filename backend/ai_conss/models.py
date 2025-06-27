from django.db import models

# Create your models here.


class ConsensusTemplate(models.Model):
    DoesNotExist = None
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    objects = models.Manager()  # 明确声明，供 IDE 识别


class Question(models.Model):
    QUESTION_TYPES = [
        ("single_choice", "Single Choice"),
        ("multi_choice", "Multiple Choice"),
        ("scale", "Scale"),
        ("range", "Range"),
        ("long_text", "Long Text"),
        ("date", "Date"),
    ]

    template = models.ForeignKey(ConsensusTemplate, related_name="questions", on_delete=models.CASCADE)
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    order = models.IntegerField()  # 控制展示顺序
    unit = models.CharField(max_length=50, blank=True, null=True)  # 对range等题型可能有单位（如“元”、“天”）

    objects = models.Manager()  # 明确声明，供 IDE 识别

    def __str__(self):
        return f"{self.template.title} - Q{self.order}"


class Option(models.Model):
    question = models.ForeignKey(Question, related_name="options", on_delete=models.CASCADE)
    text = models.CharField(max_length=300)
    order = models.IntegerField(default=0)  # 控制选项顺序（可选）

    objects = models.Manager()  # 明确声明，供 IDE 识别

    def __str__(self):
        return f"{self.question.id}: {self.text}"


class ScaleSetting(models.Model):
    DoesNotExist = None
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    min_value = models.IntegerField()
    max_value = models.IntegerField()
    objects = models.Manager()  # 明确声明，供 IDE 识别


class RangeSetting(models.Model):
    DoesNotExist = None
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    min_placeholder = models.IntegerField()
    max_placeholder = models.IntegerField()

    unit = models.CharField(max_length=20,null=True, blank=True)  # 添加单位字段，保存单位名称，如“元”
    objects = models.Manager()  # 明确声明，供 IDE 识别
