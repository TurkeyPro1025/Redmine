// 监听 Redmine 任务状态的变化，并在状态变为“已解决”时自动将完成度设置为 100%。

function setupStatusChangeListener() {
    // 将事件监听器附加到 document 上，而不是特定的 select 元素
    document.addEventListener('change', (event) => {
        // 检查事件是否由我们关心的 #issue_status_id 元素触发
        if (event.target && event.target.id === 'issue_status_id') {
            
            const statusSelect = event.target;
            const doneRatioSelect = document.getElementById('issue_done_ratio');
            const doneRatioContainer = document.getElementById('select2-issue_done_ratio-container');

            // 确保其他元素也存在
            if (!doneRatioSelect || !doneRatioContainer) {
                console.error("错误：无法找到'完成度'相关元素。");
                return;
            }

            // 获取当前选中的 <option> 元素的文本
            const selectedOptionText = statusSelect.options[statusSelect.selectedIndex].text;

            // 当状态变为“已解决”
            if (selectedOptionText === '已解决') {
                if (doneRatioSelect.value !== '100') {
                    doneRatioSelect.value = '100';
                    doneRatioContainer.textContent = '100 %';
                    doneRatioContainer.title = '100 %';

                    // 触发 change 事件，以通知 Redmine 和其他脚本
                    const changeEvent = new Event('change', { bubbles: true });
                    doneRatioSelect.dispatchEvent(changeEvent);
                }
            }
        }
    });

    console.log("Redmine 状态监听器已启动。");
}

// 直接执行
setupStatusChangeListener();
