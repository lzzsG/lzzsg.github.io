---
layout: post
title: 关于本站
date: 2024-12-19 23:10 +0800
description: 关于本站的相关介绍和使用方法
---

### YAML Front Matter

```yaml
---
title: 文本与排版
description: 文本、排版、数学公式、图表、流程图、图片、视频等示例。
date: 2019-08-08 11:33:00 +0800
categories: [博客, 演示]
tags: [排版]
pin: true
math: true
mermaid: true
image:
  path: /assets/img/img-test.jpg
  lqip: data:image/webp;base64,UklGRpoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA
  alt: Chirpy主题在多种设备上的响应式渲染。
---
```

| 字段名称          | 描述                                                                 | 示例值                              |
| ----------------- | -------------------------------------------------------------------- | ----------------------------------- |
| **`title`**       | 页面标题，通常显示在网页顶部或标签栏中。                             | 文本与排版                          |
| **`description`** | 页面内容的简要描述，用于 SEO 和社交分享。                            | 文本、排版、数学公式、图表等示例    |
| **`author`**      | 内容作者。                                                           | cotes                               |
| **`date`**        | 内容的创建或发布日期，格式为 `YYYY-MM-DD HH:mm:ss +时区`。           | 2019-08-08 11:33:00 +0800           |
| **`categories`**  | 内容的分类，支持多层级归类。                                         | [博客, 演示]                        |
| **`tags`**        | 文章的主题标签，通常用于搜索和过滤内容。                             | [排版]                              |
| **`pin`**         | 是否将文章置顶显示，`true` 表示置顶。                                | true                                |
| **`math`**        | 是否启用数学公式支持，`true` 通过 MathJax 渲染数学公式。             | true                                |
| **`mermaid`**     | 是否启用流程图支持，`true` 通过 Mermaid 渲染流程图、甘特图等。       | true                                |
| **`image.path`**  | 页面图片路径，指定图片的存储位置。                                   | /assets/img/img-test.jpg            |
| **`image.lqip`**  | 低质量占位符图片的 Base64 编码，用于快速显示模糊效果。               | data:image/webp;base64,...          |
| **`image.alt`**   | 图片替代文本，若图片加载失败显示此文字，同时有助于无障碍设计和 SEO。 | Chirpy 主题在多种设备上的响应式渲染 |

---

## jekyll-compose 使用

Jekyll::Compose 是一个帮助你更方便地管理 Jekyll 博客内容的插件，提供了一些命令来简化创建和管理草稿、文章、页面以及其他文件的操作。下面何使用它的指南：

> 由 ChatGPT 翻译自 [jekyll-compose/README.md](https://github.com/jekyll/jekyll-compose/blob/master/README.md)
 {: .prompt-info }

### **安装**

1. 打开你的 Jekyll 项目目录，编辑 `Gemfile`，添加以下内容：

   ```ruby
   gem 'jekyll-compose', group: [:jekyll_plugins]
   ```

2. 安装依赖：

   ```bash
   bundle install
   ```

### **基本用法**

在安装插件后，可以使用以下命令管理你的 Jekyll 博客内容。所有命令都需要以 `bundle exec` 前缀运行。

#### **查看可用命令**

运行以下命令查看 `jekyll-compose` 提供的所有命令：

```bash
bundle exec jekyll help
```

#### **1. 创建文章**

- 创建一篇新文章：

  ```bash
  bundle exec jekyll post "My New Post"
  ```

  这会在 `_posts` 目录中创建一个新文件，文件名类似于：`_posts/YYYY-MM-DD-my-new-post.md`。

- 自定义时间戳格式：

  ```bash
  bundle exec jekyll post "My New Post" --timestamp-format "%Y-%m-%d %H:%M:%S %z"
  ```

- 使用 `compose` 命令（等同于 `post` 命令）：

  ```bash
  bundle exec jekyll compose "My New Post" --post
  ```

#### **2. 创建草稿**

- 创建草稿：

  ```bash
  bundle exec jekyll draft "My New Draft"
  ```

  这会在 `_drafts` 目录中创建一个文件，文件名为：`my-new-draft.md`。

- 使用 `compose` 命令：

  ```bash
  bundle exec jekyll compose "My New Draft" --draft
  ```

#### **3. 发布草稿**

将草稿移动到 `_posts` 目录，并自动添加日期：

```bash
bundle exec jekyll publish _drafts/my-new-draft.md
```

- 指定发布日期：

  ```bash
  bundle exec jekyll publish _drafts/my-new-draft.md --date 2024-12-19
  ```

#### **4. 取消发布文章**

将文章从 `_posts` 移回 `_drafts`：

```bash
bundle exec jekyll unpublish _posts/YYYY-MM-DD-my-new-post.md
```

#### **5. 创建页面**

创建新页面（放在 Jekyll 项目的根目录）：

```bash
bundle exec jekyll page "My New Page"
```

#### **6. 重命名草稿或文章**

- 重命名草稿：

  ```bash
  bundle exec jekyll rename _drafts/my-old-draft.md "My Renamed Draft"
  ```

- 重命名文章：

  ```bash
  bundle exec jekyll rename _posts/YYYY-MM-DD-my-old-post.md "My New Post"
  ```

### **高级配置**

#### **1. 自动打开新文件**

可以在配置文件 `_config.yml` 中设置：

```yaml
jekyll_compose:
  auto_open: true
```

确保设置了环境变量 `JEKYLL_EDITOR`、`EDITOR` 或 `VISUAL`，例如：

```bash
export JEKYLL_EDITOR=code
```

这会自动使用 Visual Studio Code 打开新创建的文件。

#### **2. 自定义默认的 YAML 前置数据**

可以在 `_config.yml` 中为草稿、文章和其他集合指定默认的前置数据。例如：

```yaml
jekyll_compose:
  default_front_matter:
    drafts:
      description: ""
      tags: []
    posts:
      description: ""
      category: "blog"
      tags: []
      published: false
```

### **创建集合文件**

如果你有自定义集合（比如 `things`），可以用以下命令创建文件：

```bash
bundle exec jekyll compose "My New Thing" --collection "things"
```

### **故障排查**

- 如果插件命令无效，确保在 Jekyll 项目目录运行，并通过 `bundle exec` 调用。
- 检查 `Gemfile` 中是否正确添加了插件，以及运行了 `bundle install`。

通过这些命令，你可以更高效地管理 Jekyll 博客内容！
