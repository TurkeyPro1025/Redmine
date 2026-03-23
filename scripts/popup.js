console.log("popup.js 已加载");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM 已加载完成");

    // 检查快捷键是否失效并给出提示
    if (chrome.commands && chrome.commands.getAll) {
        chrome.commands.getAll((commands) => {
            let missingShortcuts = [];
            commands.forEach((command) => {
                // 如果发现快捷键为空，而且不是激活插件的默认命令
                if (command.name !== "_execute_action" && (!command.shortcut || command.shortcut.trim() === "")) {
                    missingShortcuts.push(command.description || command.name);
                }
            });

            if (missingShortcuts.length > 0) {
                const warningDiv = document.createElement("div");
                warningDiv.style.color = "#d9534f";
                warningDiv.style.backgroundColor = "#fdf2f2";
                warningDiv.style.border = "1px solid #ebccd1";
                warningDiv.style.padding = "10px";
                warningDiv.style.borderRadius = "4px";
                warningDiv.style.marginBottom = "15px";
                warningDiv.style.fontSize = "13px";
                warningDiv.innerHTML = `
                    <p style="margin: 0 0 5px 0;"><strong>⚠️ 检测到快捷键已失效：</strong><br>${missingShortcuts.join("、")}</p>
                    <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">可能因与其他软件冲突被浏览器自动置空。</p>
                    <a href="#" id="fix-shortcut-link-alert" style="color: #3498db; text-decoration: underline;">点击这里重新绑定快捷键</a>
                `;
                document.body.prepend(warningDiv);

                document.getElementById("fix-shortcut-link-alert").addEventListener("click", (e) => {
                    e.preventDefault();
                    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
                });
            }
        });
    }

    const apiKeyDOM = document.getElementById("apiKey");
    const shortcutsLink = document.getElementById("shortcutsLink");
    
    if (!apiKeyDOM) {
        console.error("未找到 id 为 'apiKey' 的元素");
        return;
    }

    // 添加快捷键链接点击事件
    if (shortcutsLink) {
        shortcutsLink.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
        });
    }

    // 添加 README 链接点击事件
    const readmeLink = document.getElementById("readmeLink");
    if (readmeLink) {
        readmeLink.addEventListener('click', (e) => {
            e.preventDefault();
            const readmeUrl = chrome.runtime.getURL('README.pdf');
            chrome.tabs.create({ url: readmeUrl });
        });
    }

    // 从存储中获取API密钥
    chrome.storage.local.get("CalendarificAPI_KEY", (result) => {
        if (chrome.runtime.lastError) {
            console.error("获取API密钥时出错：", chrome.runtime.lastError);
        } else {
            // console.log("获取到的 API 密钥:", result.CalendarificAPI_KEY);
            apiKeyDOM.value = result.CalendarificAPI_KEY || '';
        }
    });

    // 监听输入变化并保存API密钥
    apiKeyDOM.addEventListener("input", () => {
        const apiKeyInput = apiKeyDOM.value;
        console.log("当前输入的 API 密钥:", apiKeyInput);
        
        chrome.storage.local.set({CalendarificAPI_KEY: apiKeyInput}, () => {
            if (chrome.runtime.lastError) {
                console.error("保存API密钥时出错：", chrome.runtime.lastError);
            } else {
                console.log("API 密钥已保存");
            }
        });
    });
});
