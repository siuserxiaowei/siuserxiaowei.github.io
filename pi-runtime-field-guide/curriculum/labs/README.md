# Pi v1.5.0 课程实验

本目录代码由 `curriculum/source/*.json` 中的实验生成，和网页、逐章 Markdown 使用同一份内容。Node.js 需要 **22.19.0 或更新版本**。

## 运行离线检查

```bash
cd curriculum/labs
npm ci --ignore-scripts
npm run check
```

`npm run check` 运行第 02–07、09–11 章的确定性实验。它们使用 Pi v1.5.0 的真实 npm 包，模型输出由官方 Faux Provider 或本地流替身提供，不向模型供应商发请求。

也可单独运行：

```bash
node chapter-04.mjs
```

预期显示 `START → STEER → FOLLOW` 的输入顺序、三次请求准备与轮次结算，以及 settled 后的状态。各章的具体输出和断言见对应教程。

## 其他实验

- 第 01 章检查 Node、Pi 版本与运行模式。
- 第 08 章启动临时配置下的 RPC 子进程，只读状态，不发送模型 prompt。
- 第 12 章通过两次进程启动验证任务检查点恢复，按该章命令执行。
- 第 13 章使用自己新建的临时目录验证项目资源信任和工具权限的边界。
- 第 14 章需要实际配置 Multica runtime、Pi 和 Magpie 及可用模型账户。教程给出联测顺序和验收表，本次不把这条全链路标为已通过。

实验是机制验证，不是模型质量或跨供应商效果排名。每章会分别标明运行条件和验收范围。
