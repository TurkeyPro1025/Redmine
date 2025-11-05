// scripts/background.js
function openTab(type) {
    // 获取当前活动标签页的信息
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;

        const currentTab = tabs[0];
        const currentUrl = new URL(currentTab.url);

        let url = '';
        
        // 检查当前页面是否是目标页面
        if (type == "time_entries") {
            if (currentUrl.pathname.includes('time_entries')) {
                console.log("当前页面已是用户时间条目页面");
                return;
            }
            url = `http://192.168.1.145/time_entries/report?utf8=%E2%9C%93&set_filter=1&sort=spent_on%3Adesc&f%5B%5D=spent_on&op%5Bspent_on%5D=%3E%3Ct-&v%5Bspent_on%5D%5B%5D=31&f%5B%5D=user_id&op%5Buser_id%5D=%3D&v%5Buser_id%5D%5B%5D=me&f%5B%5D=&group_by=&t%5B%5D=hours&t%5B%5D=&columns=day&criteria%5B%5D=project&encoding=gb18030`;
        } else if (type == "task") {
            url = `http://192.168.1.145/issues?utf8=%E2%9C%93&set_filter=1&sort=id%3Adesc&f%5B%5D=status_id&op%5Bstatus_id%5D=o&f%5B%5D=assigned_to_id&op%5Bassigned_to_id%5D=%3D&v%5Bassigned_to_id%5D%5B%5D=me&f%5B%5D=&c%5B%5D=project&c%5B%5D=tracker&c%5B%5D=cf_9&c%5B%5D=status&c%5B%5D=subject&c%5B%5D=assigned_to&c%5B%5D=fixed_version&c%5B%5D=updated_on&c%5B%5D=due_date&c%5B%5D=done_ratio&group_by=&t%5B%5D=`;
            console.log('[ currentUrl.pathname ] >>>', currentUrl)
            if (currentUrl.href == url) {
                console.log("当前页面已是用户任务页面");
                return;
            }
        }

        // 打开新标签页
        chrome.tabs.create({ url: url });
    });
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setHolidayData") {
        chrome.storage.local.set({ [request.key]: request.data }, () => {
            sendResponse({ success: true });
        });
        return true; // 保持消息通道开放
    } else if (request.action === "getHolidayData") {
        chrome.storage.local.get(request.key, (result) => {
            sendResponse(result[request.key]);
        });
        return true; // 保持消息通道开放
    } else if (request.action === "open_user_time_entries") {
        // 处理打开用户时间条目的逻辑
    }
});

// 监听快捷键
chrome.commands.onCommand.addListener((command) => {
    console.log('[ command ] >>>', command)
    if (command === "open_user_time_entries") {
        openTab("time_entries");
    } else if (command === "open_user_task") {
        openTab("task");
    } else if (command === "fill_user_form") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs || tabs.length === 0) {
                return;
            }

            const activeTab = tabs[0];
            if (!activeTab || activeTab.id === undefined) {
                return;
            }

            chrome.tabs.sendMessage(activeTab.id, { command: "fill_user_form" });
        });
    }
});
