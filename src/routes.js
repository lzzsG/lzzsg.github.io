//路由配置比较复杂，提取到一个单独的文件中// src/routes.js// src/routes.js// src/routes.js
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TestPage from './pages/TestPage';
import MarkdownPage from './pages/MarkdownPage';
import NewMarkdownPage from './pages/NewMarkdownPage';
import NewBlogPage from './pages/NewBlogPage';
import CodeExplanationPage from './pages/CodeExplanationPage';
import D3Page from './pages/D3Pages';
import blogConfig from './blogConfig.json';

const generateRoutesFromConfig = (config) => {
    const routes = [];

    config.sections.forEach(section => {
        if (section.type === 'series') {
            section.articles.forEach(article => {
                if (article.linkType === 'internal' && article.filePath) {
                    routes.push({
                        path: article.link,
                        element: <NewMarkdownPage filePath={article.filePath} />,
                    });
                }
            });
        } else if (section.type === 'code') {
            section.articles.forEach(article => {
                routes.push({
                    path: article.link,
                    element: <CodeExplanationPage
                        codeFile={article.codeFile}
                        markdownFile={article.markdownFile}
                    />,
                });
            });
        } else {
            if (section.linkType === 'internal' && section.filePath) {
                routes.push({
                    path: section.link,
                    element: <NewMarkdownPage filePath={section.filePath} />,
                });
            }
        }
    });

    return routes;
};

const routes = [
    ...generateRoutesFromConfig(blogConfig),
    // 其他已有的路由
    // 首页
    {
        path: "/",
        element: <HomePage />,  // 中文默认路径
    },

    {
        path: "/en/",
        element: <HomePage />,
    },
    // About 页面
    {
        path: "/en/about",
        element: <AboutPage />,
    },
    {
        path: "/about",
        element: <AboutPage />,  // 中文默认路径
    },

    // Test 页面
    {
        path: "/en/test",
        element: <TestPage />,
    },
    {
        path: "/test",
        element: <TestPage />,  // 中文默认路径
    },

    // Blog 页面（不带前缀）
    {
        path: '/blog',
        element: <NewBlogPage configData={blogConfig} />,
    },

    // 英文 Blog 页面
    {
        path: '/en/blog',
        element: <NewBlogPage configData={blogConfig} />,
    },

    // 代码解释页面
    {
        path: '/code',
        element: <CodeExplanationPage
            codeFile="/code.c"
            markdownFile="/explanation.md"
        />,
    },

    // Markdown 测试页面
    {
        path: '/en/blog/markdown-test',
        element: <MarkdownPage
            filePath="/md/WhatToOut.md"
            i18nKey="WhatToOut"
        />,
    },
    {
        path: '/blog/markdown-test',
        element: <MarkdownPage
            filePath="/md/WhatToOut.md"
            i18nKey="WhatToOut"
        />,  // 中文默认路径
    },

    // 学习页面
    {
        path: '/en/blog/learning',
        element: <MarkdownPage
            filePath="/md/single/learning.md"
            i18nKey="learning"
        />,
    },
    {
        path: '/blog/learning',
        element: <MarkdownPage
            filePath="/md/single/learning.md"
            i18nKey="learning"
        />,  // 中文默认路径
    },

    // 5A 页面
    {
        path: '/en/blog/5A',
        element: <MarkdownPage
            filePath="/md/single/5A.md"
            i18nKey="5A"
        />,
    },
    {
        path: '/blog/5A',
        element: <MarkdownPage
            filePath="/md/single/5A.md"
            i18nKey="5A"
        />,  // 中文默认路径
    },

    // D3 页面
    {
        path: '/en/D3',
        element: <D3Page />,
    },
    {
        path: '/D3',
        element: <D3Page />,  // 中文默认路径
    },

    // Bare Metal 系列
    {
        path: "/en/blog/bare-metal/0-About-bare-metal-programming",
        element: <MarkdownPage
            i18nKey="bareMetal.0-About-bare-metal-programming"
            filePath="/md/bare-metal/0-About-bare-metal-programming.md"
        />,
    },
    {
        path: "/blog/bare-metal/0-About-bare-metal-programming",
        element: <MarkdownPage
            i18nKey="bareMetal.0-About-bare-metal-programming"
            filePath="/md/bare-metal/0-About-bare-metal-programming.md"
        />,  // 中文默认路径
    },

    {
        path: "/en/blog/bare-metal/1-Development-environment-setup",
        element: <MarkdownPage
            i18nKey="bareMetal.1-Development-environment-setup"
            filePath="/md/bare-metal/1-Development-environment-setup.md"
        />,
    },
    {
        path: "/blog/bare-metal/1-Development-environment-setup",
        element: <MarkdownPage
            i18nKey="bareMetal.1-Development-environment-setup"
            filePath="/md/bare-metal/1-Development-environment-setup.md"
        />,  // 中文默认路径
    },

    {
        path: "/en/blog/bare-metal/2-Create-project",
        element: <MarkdownPage
            i18nKey="bareMetal.2-Create-project"
            filePath="/md/bare-metal/2-Create-project.md"
        />,
    },
    {
        path: "/blog/bare-metal/2-Create-project",
        element: <MarkdownPage
            i18nKey="bareMetal.2-Create-project"
            filePath="/md/bare-metal/2-Create-project.md"
        />,  // 中文默认路径
    },

    {
        path: "/en/blog/bare-metal/3-Writing-boot-code",
        element: <MarkdownPage
            i18nKey="bareMetal.3-Writing-boot-code"
            filePath="/md/bare-metal/3-Writing-boot-code.md"
        />,
    },
    {
        path: "/blog/bare-metal/3-Writing-boot-code",
        element: <MarkdownPage
            i18nKey="bareMetal.3-Writing-boot-code"
            filePath="/md/bare-metal/3-Writing-boot-code.md"
        />,  // 中文默认路径
    },
    {
        path: "/:lang/blog/bare-metal/4-Writing-the-main-program",
        element: <MarkdownPage
            i18nKey="bareMetal.4-Writing-the-main-program"
            filePath="/md/bare-metal/4-Writing-the-main-program.md"
        />,
    },
    {
        path: "/:lang/blog/bare-metal/4½-Supplement-for-the-main-program-of-operating-systems",
        element: <MarkdownPage
            i18nKey="bareMetal.4½-Supplement-for-the-main-program-of-operating-systems"
            filePath="/md/bare-metal/4½-Supplement-for-the-main-program-of-operating-systems.md"
        />,
    },
    {
        path: "/:lang/blog/bare-metal/5-Compiling-code",
        element: <MarkdownPage
            i18nKey="bareMetal.5-Compiling-code"
            filePath="/md/bare-metal/5-Compiling-code.md"
        />,
    },
    {
        path: "/:lang/blog/bare-metal/6-Linking-code",
        element: <MarkdownPage
            i18nKey="bareMetal.6-Linking-code"
            filePath="/md/bare-metal/6-Linking-code.md"
        />,
    },
    {
        path: "/:lang/blog/bare-metal/7-Generating-image-files",
        element: <MarkdownPage
            i18nKey="bareMetal.7-Generating-image-files"
            filePath="/md/bare-metal/7-Generating-image-files.md"
        />,
    },
    {
        path: "/:lang/blog/bare-metal/8-Running-on-the-target-platform",
        element: <MarkdownPage
            i18nKey="bareMetal.8-Running-on-the-target-platform"
            filePath="/md/bare-metal/8-Running-on-the-target-platform.md"
        />,
    },
];

export default routes;


