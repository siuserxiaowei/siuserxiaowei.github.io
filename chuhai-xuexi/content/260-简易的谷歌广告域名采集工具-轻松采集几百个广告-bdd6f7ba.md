# 260：简易的谷歌广告域名采集工具-轻松采集几百个广告.otl

- 来源路径：单条分享/260：简易的谷歌广告域名采集工具-轻松采集几百个广告.otl
- 金山链接：https://www.kdocs.cn/l/ceTYJ45Ijguv
- 文件 ID：`mNpoSzkAxrMxgAmtW3BvxxmD23XvE5vBA`
260：简易的谷歌广告域名采集工具-轻松采集几百个广告  
我发现谷歌广告现在搜索后，可以呈列表形式展示：  
![image]()
页面链接：[https://adstransparency.google.com/search?region=anywhere&query=](https://adstransparency.google.com/search?region=anywhere&query=)[关键字]  
把[关键词]这部分换成我们想查询的单词，比如：[https://adstransparency.google.com/search?region=anywhere&query=name](https://adstransparency.google.com/search?region=anywhere&query=name)  
表示查询与“name”有关的广告公司或域名；当然我们要的是域名。  
  
比如我们查询 .ai 可以看到很多ai工具的广告，查询 test，可以看到很多测试类的广告；  
就看你想查询什么样的广告。  
  
然后我写了一个Web Scraper的采集规则，工程代码如下：  

```python
{"_id":"google_ad","startUrl":["https://adstransparency.google.com/search?region=anywhere&query=.ai","https://adstransparency.google.com/search?region=anywhere&query=text"],"selectors":[{"id":"data","parentSelectors":["_root"],"type":"SelectorElementClick","clickActionType":"real","clickElementSelector":"[aria-selected='false'] material-ripple","clickElementUniquenessType":"uniqueHTMLText","clickType":"clickOnce","delay":0,"discardInitialElements":"do-not-discard","multiple":false,"selector":"div.search-results-container"},{"id":"domain","parentSelectors":["data"],"type":"SelectorElementClick","clickActionType":"real","clickElementSelector":".next-page-button material-ripple","clickElementUniquenessType":"uniqueText","clickType":"clickMore","delay":500,"discardInitialElements":"do-not-discard","multiple":true,"selector":"material-select-item"},{"id":"text","parentSelectors":["domain"],"type":"SelectorText","selector":"div.name","multiple":false,"regex":"","multipleType":"singleColumn","version":2}]}
```

这份代码直接导入就可以运行使用，把上面显示的百来个域名下载下来，如果多条查询链接，可以一次下载几百个甚至更多。  
  
关于Web Scraper，不知道的朋友可以在官网下载：[https://webscraper.io/](https://webscraper.io/)  
![image]()
用谷歌浏览器打开，点击安装，会跳转到插件市场，蓝色按钮安装：  
![image]()
然后就可以再开发者工具上看到(谷歌浏览器按f12打开开发者工具)：  
![image]()
  
刚安装的时候是没有工程文件的，要通过这里去导入我的工程代码：  
![image]()
![image]()
把我的代码黏贴进去，下面随便命名，保存就可以看到有工程项目了：  
![image]()
  
点击目标工程，再点击“scrape”，就可以运行代码了：  
![image]()
![image]()
采集完之后，就可以看到：  
![image]()
点击导出就可以把数据以表格形式下载：  
![image]()
  
下载下来的表格里还有公司的字段，这个不想采集，但是Web Scraper更新后有些没明白他的规则，暂时没有去除，我们只要域名就可以：  
![image]()
  
刚导入我的代码，链接是我默认的，需要修改成你想查询的单词链接，  
只需要在目标链接上做下修改，点击进入工程项目后选择编辑：  
![image]()
![image]()
把后面的关键词改成你想查询的单词；  
也可以通过点击上图中右边的加号，去增加要查询的单词：  
![image]()
xxx换成单词，点击蓝色按钮保存即可，然后重新去运行。  
  
关于Web Scraper有些朋友可能不熟悉，如果你使用遇到问题，可以来找我。  