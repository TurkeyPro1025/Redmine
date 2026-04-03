// 监听 Redmine 任务状态的变化，并在状态变为“已解决”时自动将完成度设置为 100%。
function setupStatusChangeListener() {
    // Redmine 使用 Select2 后，状态显示的容器 ID 通常是 select2-issue_status_id-container
    const statusContainer = document.getElementById('select2-issue_status_id-container');

    if (!statusContainer) {
        console.error("未找到状态下拉框的 Select2 容器，脚本可能需要延迟加载。");
        return;
    }

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 当 Select2 的文本发生变化时
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const currentStatus = statusContainer.textContent.trim();
                console.log("检测到状态改变为:", currentStatus);

                if (currentStatus === '已解决') {
                    const doneRatioSelect = document.getElementById('issue_done_ratio');
                    const doneRatioContainer = document.getElementById('select2-issue_done_ratio-container');

                    if (doneRatioSelect && doneRatioContainer) {
                        if (doneRatioSelect.value !== '100') {
                            doneRatioSelect.value = '100';
                            
                            // 更新 Select2 假 UI 的显示
                            doneRatioContainer.textContent = '100 %';
                            doneRatioContainer.title = '100 %';

                            // 触发原生 change 事件通知页面
                            doneRatioSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                }
            }
        });
    });

    // 配置观察选项: 检测子节点变化或文本节点变化
    const config = { childList: true, characterData: true, subtree: true };

    // 传入目标节点和观察选项
    observer.observe(statusContainer, config);

    console.log("Redmine 状态 MutationObserver 监听器已启动。");
}

// 考虑到 Select2 可能需要一点时间初始化，建议加个小延迟或监听 DOMContentLoaded
setTimeout(setupStatusChangeListener, 1000);