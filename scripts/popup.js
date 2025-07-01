console.log("popup.js 已加载");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM 已加载完成");

    const apiKeyDOM = document.getElementById("apiKey");
    
    if (!apiKeyDOM) {
        console.error("未找到 id 为 'apiKey' 的元素");
        return;
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
