# 说明

## 前端使用

- 进入 `\hopa`文件夹，运行 `npm run dev`
- 随后可以在终端输入 `ipconfig` 获取WLAN下的ip地址，在手机上的浏览器中输入 `http://ip地址:3000`就可以查看


## 后端使用

- 进入`\backend\`文件夹下，先运行`python -m pip install Django`安装Django
- 运行`python manage.py makemigrations ai_conss`创建迁移文件
- 运行`python manage.py migrate`进行数据库迁移
- 运行`python manage.py runserver`启动后端服务
- 运行`python .\ai_conss\load.py`上传部分模板数据
- 随后就可以正常使用,开放在`http://localhost:8000`，目前只有`/ai_conss/match/`接口可以使用，其他接口还未完成


## 关于素材

- 共识模板样例在 `\hopa\src\assets\`文件夹下
