# Pi Agent 配置包

这是一个 **Pi package**，不是拷文件的 dotfiles。Omarchy 上装完 Pi 之后只需要：

```bash
pi install git:github.com/BubblePtr/pi-agent-config
```

会装上：

- 全局指令（`AGENTS.md`，通过 extension 注入系统提示）
- 默认模型 `radius / deepseek-v4.1-flash`、思考 `xhigh`、主题 `dark`，并在默认工具之外打开 `codemode`
- 现在在用的七个包：
  - `@earendil-works/pi-radius`：Radius 模型路由和 `radius_web_search`
  - `@tintinweb/pi-subagents`：`Agent` 子代理和 `SubagentWorkflow`
  - `@aliou/pi-guardrails`：路径访问限制、危险命令拦截、权限确认
  - `@ff-labs/pi-fff`：FFF 模糊文件 / 内容搜索
  - `nowledge-mem-pi`：Nowledge Mem 记忆
  - `pi-web-access`：`web_search`、`fetch_content` 等抓网页工具
  - `pi-powerline-footer`：powerline 状态栏

不包含 `auth.json`。凭证仍然在每台机器上 `/login`。

## 为什么是 package

Pi 的 `pi install` 只能分发 extension / skill / prompt / theme。默认模型和默认工具写不进别人的 `settings.json`，所以：

- 七个包作为 `dependencies`，`pi` 清单从 `node_modules/` 加载它们的资源（`npm test` 会检查每个依赖自己声明的资源都在清单里）
- `extensions/defaults.ts` 在 session 开始时套用 `defaults.json`（模型、思考级别、主题，以及和 `settings.json` 同语法的 `defaultTools`），并在还没有 `~/.pi/agent/AGENTS.md` 时把仓库里的 `AGENTS.md` 追加进系统提示

本机如果已经有 `~/.pi/agent/AGENTS.md`，extension 不会再注一份，避免重复。

## 安装

**macOS**

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
pi install git:github.com/BubblePtr/pi-agent-config
pi   # /login Radius
```

**Omarchy**

```bash
omarchy-pkg-add pi-coding-agent-bin
# pi install npm:… 需要系统里有 npm
pi install git:github.com/BubblePtr/pi-agent-config
pi
```

本机原来用 `npm:` 分列装这几个包的，先装这个包，再拆掉旧条目，避免同一套 extension 加载两次：

```bash
pi install git:github.com/BubblePtr/pi-agent-config
pi remove npm:@earendil-works/pi-radius
pi remove npm:@tintinweb/pi-subagents
pi remove npm:@aliou/pi-guardrails
pi remove npm:@ff-labs/pi-fff
pi remove npm:nowledge-mem-pi
pi remove npm:pi-web-access
pi remove npm:pi-powerline-footer
```

旧版本这个包里的 `context-mode` 和 `pi-subagents`（nicobailon 版）已经去掉，换成上面的 `@tintinweb/pi-subagents`。

`nowledge-mem-pi` 还要在那台机器上配 nmem 客户端（URL / API key）。

## 更新

```bash
pi update --extensions
```

会按 `package.json` 的 semver 拉依赖。改 `AGENTS.md` / `defaults.json` 后推这个仓库即可。

## 开发

```bash
npm install
npm test
pi install ./   # 用本地路径试
```
