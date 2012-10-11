# 文档
## 签出代码注意事项

- 克隆代码：`git clone git@gitlab.alibaba-inc.com:butterfly.git`
- 安装Node。
- 安装node-dev模块：`npm install -g node-dev`
- 安装依赖包：`npm install -d`
- 运行服务：`node-dev bin/app.js`

## 模拟数据源
- 字段模拟。常量`FIELDS`中存放了三个数据的字段值。从0开始。
- 前端发送ajax到`/data?id=1`获取数据。id的值可以从1到3。

# 注意事项
- 性能问题。即使在性能最好的Chrome上，也不能渲染太多数据。所以需要控制渲染的数据量。单元格不要超过500个比较合适。