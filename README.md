# PttLB 网站

基于设计稿（`picture/` 下的 SVG）用原生 **HTML + CSS + JavaScript** 构建的游戏官网。页面间采用**单页软导航**（fetch + History API），切换不刷新页面；并已做**手机适配**（竖屏铺满屏幕、背景 cover、触摸支持、更大的点按目标）。

## 页面结构

| 文件 | 说明 |
| --- | --- |
| `index.html` | 首页（入口壳），使用 `first_page.svg` 的视觉风格；底部中间的 "tap to start"（外观与原始设计完全一致）现在是真实按钮 → 选择页 |
| `choose.html` | 选择页，使用 `choose_page.svg` 的视觉风格；中间三个独立小框，鼠标悬停变大并展示文字；点击最左侧框 → PttLB 页 |
| `pttlb.html` | PttLB 主菜单，使用 `PttLB_page.svg` 的视觉风格；Play Now / Gameshowcase / Download / About Us 四个按钮 |
| `play.html` | 「开始游戏」子页面 |
| `gameshowcase.html` | 「游戏展示」子页面 |
| `download.html` | 「下载游戏」子页面 |
| `about.html` | 「关于我们」子页面 |

> 除 `index.html` 外，其余文件既是完整可独立打开的页面，也会作为「内容片段」被 `index.html` 软导航加载（`js/main.js` 中的 `go()` / fetch 路由）。

## 通用功能（每个页面都有）

- **左上角齿轮图标**：点击后在页面最上方弹出「语言切换 + 音乐开关」，鼠标移开后自动收回。（右上角不再有装饰齿轮。）
- **语言切换**：中文 / English，通过 `data-i18n` 属性 + `js/main.js` 中的字典实现，偏好保存在 `localStorage`。
- **背景音乐（MP3 文件 + 零间隔连续播放，无弹窗）**：站点采用**单页软导航**——切换页面时不重新加载页面（fetch + History API），因此页面内**同一个 `<audio>` 元素**持续播放 `assets/audio/background.mp3`，音乐零间隔、绝不重播，且**不会弹出任何独立的音乐窗口**；关闭标签页即停止音乐。设置面板中在音乐开关旁提供**音量滑条**（0–100%，偏好保存在 `localStorage`）。

## 目录结构

```
css/style.css      共享主题样式（颜色取自设计稿：#DBFFFA / #B4EFF4 / #80E6F9 / #2E4F62 / #69BAC9）
js/main.js         齿轮菜单、语言切换、单页软导航路由、音乐控制（单个 <audio> 播放 WAV）
assets/img/        从 SVG 中提取出的 PNG 素材
assets/audio/background.mp3  背景音乐 MP3 文件（128kbps，全浏览器兼容）
assets/assets_manifest.json  素材提取清单
picture/           原始设计稿（SVG + 背景 PNG）
extract_assets.py  素材提取脚本（把 SVG 内嵌 base64 图片导出为 PNG）
generate_wav.py    背景音乐 WAV 生成脚本（用纯 Python 标准库合成）
```

## 本地运行

```bash
# 任选其一
python -m http.server 8080
npx serve .
```

然后访问 <http://localhost:8080>。

## 免费部署到 GitHub Pages（无需租服务器）

网站已适配 GitHub Pages **项目页子路径**（`https://用户名.github.io/仓库名/`），路由会自动识别子路径。

1. 把整个文件夹（含 `404.html`、`.nojekyll`）推到一个 GitHub 仓库：
   ```bash
   git init
   git add .
   git commit -m "deploy"
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```
2. 在 GitHub 仓库 → **Settings → Pages** → Source 选 `Deploy from a branch`，分支选 `main`、目录选 `/ (root)` → Save。
3. 等一两分钟，访问 `https://你的用户名.github.io/仓库名/` 即可。

说明：
- 路由对根域名（如自定义域名）与子路径都兼容，`404.html` 让未知地址回退到首页。
- 若想换成 Netlify/Vercel（根域名、无需 `404.html`），直接把本文件夹拖拽上传即可。
- 注意：仓库里不要提交 `picture/`（原始设计稿，约 7MB，仅本地用）和 `.venv/`，用 `.gitignore` 忽略它们。

## 主题风格

所有页面共用同一套配色与装饰语言：明亮插画背景 + 深蓝信息框（`#2E4F62`）、青色渐变按钮（`#B4EFF4 → #8FE6F5`）、青绿描边（`#69BAC9`），配以白色齿轮装饰，与原始设计稿保持一致。
