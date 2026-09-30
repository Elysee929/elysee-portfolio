# Elysee · 个人作品集

中文为主的视觉设计作品集概念版，GSAP 3.13.0 驱动。

## 预览

在本目录运行 `python3 -m http.server 4173 --directory docs`，浏览 http://127.0.0.1:4173。
无需构建步骤。网站文件均在 docs 内，可作为静态网站托管。

## 内容修改

- docs/index.html：姓名、导航、作品列表、关于、联系、页脚。
- docs/style.css：配色、排版、移动布局。
- docs/app.js：四个项目的详情数据及交互。
- docs/assets：本地图片和 GSAP 库。

已使用 Elysee 署名；作品仍为明确标注的示例，联系信息留空。发布真实个人作品集前替换示例内容。

## 交互

首屏画廊支持自动旋转、暂停、左右按钮和水平拖动；页面滚动驱动空间旋转。项目点击打开详情，Esc 关闭并恢复焦点，支持下一作品。提供 prefers-reduced-motion 支持和移动布局。

## 素材

- orbit.jpg：AI 生成的原创概念图。
- bloom.jpg：Abhijit Sinha / Unsplash，https://unsplash.com/photos/L0_lpxyLS0s ，用于示例。作品详情与图片来源对话框含署名。
- GSAP / ScrollTrigger 3.13.0：https://gsap.com ，分发文件保留许可头。

手机交互：横向滑动旋转，纵向滑动滚动页面；拖动结束抑制误触。项目详情关闭后恢复阅读位置。

测试：`node --test tests/gestures.test.cjs`。
