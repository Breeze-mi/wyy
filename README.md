vue + electron 的简单封装

# 前置要求

- 安装 Node.js node >= 20
- 使用 pnpm

# 安装依赖

```shell
pnpm p-install

# 如果在 大陆 环境，需要修改环境变量 ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/'
# 但是这些已经封装好了
# 可以使用 pnpm p-install:zh
# 但如果提前设置了环境变量 ELECTRON_MIRROR，则不需要使用 pnpm p-install:zh
```

# 运行

```shell
pnpm dev
```

# 打包

```shell
pnpm build
```
