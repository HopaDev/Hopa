from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse, JsonResponse

from .deepseekAPI import api_consensus_keywords
from .utils import find_templates_by_keywords, load_consensus_template_data


def index(request):
    """
    A simple view that returns a greeting.
    """
    return HttpResponse("Hello, world! This is the AI Consensus app.")


def match(request):
    """
    A view that handles matching logic.
    """
    # 从request中提取出GET请求当中的require参数
    require = request.GET.get('require', None)
    if require is None:
        return HttpResponse("No requirement provided.")
    keywords = api_consensus_keywords(require)
    if not keywords:
        return HttpResponse("No keywords extracted from the requirement.")
    print(keywords)
    possible_titles = find_templates_by_keywords(keywords)
    if not possible_titles:
        return HttpResponse("No matching templates found for the provided keywords.")
    result_templates = []
    for title in possible_titles:
        print(f"Matching template found: {title}")
        tmplate = load_consensus_template_data(title)
        if tmplate:
            result_templates.append(tmplate)
    if not result_templates:
        return HttpResponse("No templates found for the matched keywords.")
    # 在这里可以添加更多的逻辑来处理匹配

    # print(f"Matched templates: {result_templates} found.")
    # 返回result_templates当中的第一个模板，作为响应当中的data，按照JSON格式返回
    response_data = {
        "data": result_templates[0],
        "message": "Templates matched successfully.",
        "status": "success"
    }
    return JsonResponse(response_data, safe=False)

