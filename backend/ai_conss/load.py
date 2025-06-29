
import json

import os
from datetime import datetime

import django
import sys

# 替换成你的 Django 项目的 settings 路径
# 将项目的根目录加入 Python 路径，以便正确加载 settings
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 设置 Django 配置模块为 hopa_consensus.settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hopa_consensus.settings')

django.setup()

from ai_conss.models import ConsensusTemplate, Question, Option, ScaleSetting, RangeSetting


def save_consensus_template(data):
    template = ConsensusTemplate.objects.create(
        title=data["title"],
        description=data["description"]
    )

    for i, q in enumerate(data["questions"], start=1):
        question = Question.objects.create(
            template=template,
            question_text=q["question"],
            question_type=q["type"],
            order=i
        )

        if q["type"] in ["single_choice", "multi_choice"]:
            for opt_text in q.get("options", []):
                Option.objects.create(
                    question=question,
                    text=opt_text
                )

        elif q["type"] == "scale":
            ScaleSetting.objects.create(
                question=question,
                min_value=q["scale"][0],
                max_value=q["scale"][1]
            )

        elif q["type"] == "range":
            # 再加一个判断，根据unit的不同，需要对min_placeholder和max_placeholder进行处理

            print("问题类型为: " + q["type"])
            print("单位为:"+q["unit"])

            # “日期”，数据原形式为"2024-01-01"，需要转化为日期时间戳（integer）
            if q["unit"] == "日期":
                min_placeholder = int(datetime.strptime(q["min_placeholder"], "%Y-%m-%d").timestamp())
                max_placeholder = int(datetime.strptime(q["max_placeholder"], "%Y-%m-%d").timestamp())
            elif q["unit"] == "时钟":
                # “时钟”，数据原形式为"12:00"，需要转化为从0-1440的数字（integer）
                min_placeholder = int(datetime.strptime(q["min_placeholder"], "%H:%M").hour * 60 + datetime.strptime(q["min_placeholder"], "%H:%M").minute)
                max_placeholder = int(datetime.strptime(q["max_placeholder"], "%H:%M").hour * 60 + datetime.strptime(q["max_placeholder"], "%H:%M").minute)
            else:

                min_placeholder = q["min_placeholder"]
                max_placeholder = q["max_placeholder"]

            # "元/天/个/小时"等单位，数据原形式就是数字
            RangeSetting.objects.create(
                question=question,
                min_placeholder=min_placeholder,
                max_placeholder=max_placeholder,
                unit=q["unit"]
            )

        # long_text 不需要额外处理

    return template.id  # 返回创建成功的模板ID


if __name__ == "__main__":
    # 从本地.json文件加载数据并保存到数据库
    with open("ai_conss/case.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    for item in data:
        template_id = save_consensus_template(item)
        print(f"Consensus template saved with ID: {template_id}")

