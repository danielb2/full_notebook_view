# 导航历史功能说明 / Navigation History Feature

## 中文说明

### 功能概述

本插件新增了类似 JetBrains IDE (如 CLion) 和 VSCode 的前进/后退导航功能,支持**文件内光标位置**和**跨文件**的导航历史记录喵~

### 使用方法

#### 1. 鼠标按键导航 (全局有效)
- **鼠标按键 3 (侧键后退)**: 后退到上一个光标位置或笔记
- **鼠标按键 4 (侧键前进)**: 前进到下一个光标位置或笔记
- **适用范围**: 
  - ✅ 编辑器区域 (通过 CodeMirror 6 插件实现)
  - ✅ 插件侧边栏面板

#### 2. 键盘快捷键 (需手动配置)
- 进入 **工具 → 选项 → 键盘快捷键**
- 搜索 `Navigate Back` 和 `Navigate Forward`
- 绑定快捷键(推荐 `Ctrl+Alt+Left` 和 `Ctrl+Alt+Right`)

#### 3. 命令面板
- 按 `Ctrl+P` (或 `Cmd+P`) 打开命令面板
- 输入 `Navigate Back` 或 `Navigate Forward`

#### 4. 工具栏按钮
- 编辑器工具栏会显示前进/后退按钮
- 点击按钮进行导航

### 工作原理

#### 自动记录光标位置
- 每 **2 秒**自动记录一次当前光标位置
- 切换笔记时立即记录光标位置
- 导航历史最多保存 **100 条**记录

#### 智能去重
- 相同笔记、相同光标位置、2秒内的记录会自动合并
- 避免因微小移动产生过多历史记录

#### 精确恢复
- 后退/前进时会:
  - 如果目标位置在不同笔记,自动切换笔记
  - 恢复到记录的精确光标位置(行号和列号)
  - 在插件面板中高亮显示当前笔记

#### CodeMirror 6 集成
- 通过内容脚本直接拦截编辑器内的鼠标按键事件
- 完全覆盖默认的鼠标侧键行为
- 无需额外配置,安装即用

### 适用场景

✅ **支持的场景**:
- ✅ 在编辑器内移动光标(点击、键盘方向键、搜索跳转等)
- ✅ 在编辑器内使用鼠标侧键导航
- ✅ 在插件的笔记本树形视图中点击笔记
- ✅ 在搜索结果中点击笔记
- ✅ 在大纲(Outline)标签页中浏览笔记标题
- ✅ 使用命令面板或快捷键导航

### 设置

进入 **工具 → 选项 → Full Notebook View** 可查看导航功能说明。

进入 **工具 → 选项 → 键盘快捷键** 可自定义快捷键。

---

## English Documentation

### Feature Overview

This plugin adds forward/backward navigation functionality similar to JetBrains IDEs (like CLion) and VSCode, supporting both **cursor position within files** and **cross-file** navigation history.

### Usage

#### 1. Mouse Button Navigation (Global)
- **Mouse Button 3 (Side Back Button)**: Navigate back to the previous cursor position or note
- **Mouse Button 4 (Side Forward Button)**: Navigate forward to the next cursor position or note
- **Works in**: 
  - ✅ Editor area (via CodeMirror 6 plugin)
  - ✅ Plugin sidebar panel

#### 2. Keyboard Shortcuts (Manual Configuration Required)
- Go to **Tools → Options → Keyboard Shortcuts**
- Search for `Navigate Back` and `Navigate Forward`
- Bind shortcuts (recommended: `Ctrl+Alt+Left` and `Ctrl+Alt+Right`)

#### 3. Command Palette
- Press `Ctrl+P` (or `Cmd+P`) to open command palette
- Type `Navigate Back` or `Navigate Forward`

#### 4. Toolbar Buttons
- Forward/backward buttons appear in the editor toolbar
- Click buttons to navigate

### How It Works

#### Automatic Cursor Position Recording
- Records cursor position every **2 seconds** automatically
- Records immediately when switching notes
- Navigation history stores up to **100 entries**

#### Smart Deduplication
- Entries with same note, same cursor position, within 2 seconds are merged
- Avoids excessive history from minor movements

#### Precise Restoration
- When navigating back/forward:
  - Automatically switches notes if target is in a different note
  - Restores exact cursor position (line and column numbers)
  - Highlights current note in the plugin panel

#### CodeMirror 6 Integration
- Intercepts mouse button events directly in the editor via content script
- Completely overrides default mouse side button behavior
- Works out of the box, no extra configuration needed

### Applicable Scenarios

✅ **Supported scenarios**:
- ✅ Moving cursor in the editor (click, keyboard arrows, search jumps, etc.)
- ✅ Using mouse side buttons in the editor
- ✅ Clicking notes in the plugin's notebook tree view
- ✅ Clicking notes in search results
- ✅ Browsing note headings in the Outline tab
- ✅ Using command palette or keyboard shortcuts

### Settings

Go to **Tools → Options → Full Notebook View** to see navigation feature notes.

Go to **Tools → Options → Keyboard Shortcuts** to customize shortcuts.

---

## 技术实现 / Technical Implementation

### 后端 (index.ts)
- 导航历史栈: `navigationHistory: NavigationEntry[]`
- 当前位置索引: `navigationIndex`
- 导航状态标记: `isNavigating` (防止循环添加历史)
- 定时器: 每2秒调用 `addToNavigationHistory()`

### CodeMirror 6 内容脚本 (codeMirrorPlugin.ts)
```typescript
EditorView.domEventHandlers({
    mousedown: (event: MouseEvent, view: EditorView) => {
        if (event.button === 3) {
            event.preventDefault();
            context.postMessage({ type: 'navigateBack' });
            return true;
        } else if (event.button === 4) {
            event.preventDefault();
            context.postMessage({ type: 'navigateForward' });
            return true;
        }
        return false;
    },
})
```

### 光标位置 API
- 获取光标: `editor.execCommand({ name: 'getCursor' })`
- 设置光标: `editor.execCommand({ name: 'setCursor', args: [line, ch] })`

### 事件监听
- `onNoteSelectionChange`: 切换笔记时记录位置
- `setInterval`: 每2秒自动记录光标位置
- CodeMirror 插件: 拦截编辑器鼠标按键事件
- 插件面板鼠标按键事件 (button 3/4)
- 全局命令系统

### 优势

✅ **完整的鼠标侧键支持**:
- 通过 CodeMirror 6 内容脚本实现编辑器内拦截
- 完全覆盖默认行为,无需额外配置

✅ **精确的光标位置记录**:
- 记录行号和列号
- 智能去重避免冗余

✅ **跨文件导航**:
- 自动切换笔记并恢复光标位置
