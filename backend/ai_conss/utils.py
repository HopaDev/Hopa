from .models import ConsensusTemplate, Question, Option, ScaleSetting, RangeSetting
from functools import reduce
from typing import List, Set


def load_consensus_template_data(title: str) -> dict:
    """
    根据共识模板标题，从数据库加载结构化模板数据（供内部使用）
    """
    try:
        template = ConsensusTemplate.objects.get(title=title)
    except ConsensusTemplate.DoesNotExist:
        return None  # 或者 raise ValueError("模板不存在")

    questions_list = []
    for q in template.questions.all().order_by('order'):
        question_data = {
            "id": q.id,
            "type": q.question_type,
            "question": q.question_text,
        }

        if q.question_type in ["single_choice", "multi_choice"]:
            question_data["options"] = [opt.text for opt in q.options.order_by("order")]
        elif q.question_type == "scale":
            try:
                scale = ScaleSetting.objects.get(question=q)
                question_data["scale"] = [scale.min_value, scale.max_value]
            except ScaleSetting.DoesNotExist:
                question_data["scale"] = []
        elif q.question_type == "range":
            try:
                range_obj = RangeSetting.objects.get(question=q)
                question_data["unit"] = range_obj.unit
                question_data["min_placeholder"] = range_obj.min_placeholder
                question_data["max_placeholder"] = range_obj.max_placeholder
            except RangeSetting.DoesNotExist:
                question_data.update({
                    "unit": q.unit,
                    "min_placeholder": None,
                    "max_placeholder": None,
                })

        questions_list.append(question_data)

    return {
        "title": template.title,
        "description": template.description,
        "questions": questions_list
    }


def find_templates_by_keywords(keywords: List[str]) -> Set[str]:
    """
    根据多个关键词，返回共识模板标题的匹配结果

    优先找不同关键词对应的标题集合的交集

    如果没有交集，则返回所有关键词对应的标题集合的并集
    """
    if not keywords:
        return set()

    # 每个关键词对应一个匹配结果集合
    matched_sets = []
    for keyword in keywords:
        print(f"Searching for keyword: {keyword}")
        keyword = keyword.strip().lower()
        matches = ConsensusTemplate.objects.filter(title__icontains=keyword)
        matched_titles = set([t.title for t in matches])
        print(f"Matched titles for '{keyword}': {matched_titles}")
        matched_sets.extend(matched_titles)

    if not matched_sets:
        return set()
    # 计算所有匹配标题的交集
    intersection = reduce(lambda x, y: x.intersection(y), [set(matched_sets)]) if matched_sets else set()
    if intersection:
        print(f"Intersection found: {intersection}")
        return intersection
    else:
        # 如果没有交集，则返回所有匹配标题的并集
        union = set(matched_sets)
        print(f"No intersection, returning union: {union}")
        return union
