# Pi v1.5.0：14 章源码与实践教程

全部 14 章已按 Pi v1.5.0 重写。固定源码 `f9a26365568127461c47a07a37dcb42c140a3ac5`；核验时间 2026-11-03T21:19:39+08:00。

[完整网页](https://siuserxiaowei.github.io/pi-runtime-field-guide/curriculum/) · [首页逐章阅读](https://siuserxiaowei.github.io/pi-runtime-field-guide/#curriculum)

1. [Pi v1.5.0：包边界、安装与四种入口](01.md)
2. [pi-ai：用 Models 集合统一模型、错误与用量](02.md)
3. [消息与上下文：把历史、执行工具和模型请求分清](03.md)
4. [新版 Agent Loop：两个队列与明确的请求边界](04.md)
5. [流式与取消：看到片段，不等于允许执行](05.md)
6. [工具管道：参数验证、并发与 MCP / Codemode](06.md)
7. [重试与副作用：先判断能不能再做一次](07.md)
8. [事件与集成：什么时候真的结束了](08.md)
9. [上下文预算：历史保存与模型可见内容分开管理](09.md)
10. [压缩与分支摘要：重建工作现场，不删除历史](10.md)
11. [会话树、上下文编辑与 CLI 恢复](11.md)
12. [独立 Pi Durable：任务检查点、存储与崩溃恢复](12.md)
13. [信任资源不等于限制权限：真正的安全边界](13.md)
14. [三层实践：Multica、Pi 与 Magpie](14.md)

## 实验说明

每章标明运行条件、代码/步骤、预期结果与验收。课程附带 [离线实验](labs/README.md)，运行使用固定版本 npm 包与确定性模型替身，不调用付费模型。需要真实账号的联合测试单独标明。

## 维护

编辑 `source/*.json`，运行 `python3 scripts/build_curriculum.py`，同时生成本目录 Markdown、浏览器数据和完整阅读页。

[8 月课程数据归档](archive/2026-08-26-chapters.json) · [三层架构研究](../research/updates/2026-11-03-agent-stack-field-study.md)
