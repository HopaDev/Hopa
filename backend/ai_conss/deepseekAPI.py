from openai import OpenAI

import sys

client = OpenAI(api_key="sk-48bf4eb219d84a6b988780dc38849238", base_url="https://api.deepseek.com")


def api_consensus_keywords(content):
    """
    Function to send a message to the DeepSeek API and return the response.
    """
    # sysContent = f"请对下面用户输入的共识达成需求进行剖析。你只需要根据用户的内容输出下面几种类型：共识活动，主要关切内容，参与人员与提问者的关系." \
    #              f"输出格式:[共识活动:<文字内容（举例：XX的XX）>]"\
    #              "-[主要关切内容:<文字内容（举例：1.…… 2.……>]"\
    #              "-[参与人员与提问者的关系:<文字内容>]"\
    #              "-[关键词:<文字内容（概括本共识场景的可用于唯一性辨别的关键词，长度不超过4个字）>]"

    sysContent = f"请从下面这句来自用户的共识需求表达当中提取共识场景的关键词,要求至少2个,每个词不超过2个字,能够作为这种场景的唯一标识" \
                 f"输出格式:[关键词:关键词1,关键词2,......]"

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": sysContent},
            {"role": "user", "content": content},
        ],
        stream=False
    )
    print(response.choices[0].message.content)
    # 根据上面的输出格式，解析deepseek返回的内容
    if response.choices[0].message.content.startswith("[关键词:"):
        keywords = response.choices[0].message.content[5:-1]  # 去掉前缀和后缀
        return keywords.split(",")  # 返回一个关键词列表
    else:
        print("返回内容格式不正确")
        return None


def api_match_sheet(userContent,consensusSheet):
    '''
    用于之后的场景,orm操作收集到一批数据库中的共识场景模板之后,再次与用户输入的共识达成需求进行匹配
    '''


if __name__ == "__main__":
    request = "我需要和小组一起做马克思专业原理课程的展示"
    api(request)
