var workdaySchedule = {};
var holidays = {};

// 获取节假日信息
async function fetchHolidays(year, month) {
    // 从存储中获取API密钥
    let API_KEY = await new Promise((resolve, reject) => {
        chrome.storage.local.get("CalendarificAPI_KEY", (result) => {
            if (chrome.runtime.lastError) {
                console.error("获取API密钥时出错：", chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else if (!result.CalendarificAPI_KEY) {
                console.error("未找到API密钥");
                resolve(''); // 返回空字符串
            } else {
                // console.log("获取到的 API 密钥:", result.CalendarificAPI_KEY);
                resolve(result.CalendarificAPI_KEY || '');
            }
        });
    });
    const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=CN&year=${year}&month=${month}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        // console.log(data.response.holidays);
        return data.response.holidays;
    } catch (error) {
        console.error("获取节假日信息失败:", error);
        return [];
    }
}

// 处理节假日信息
async function processHolidays(year, month) {
    const holidays = await fetchHolidays(year, month);
    const workingWeekends = [];
    const holidayDates = [];

    holidays.forEach(holiday => {
        if (holiday.primary_type === 'Working day on weekend') {
            workingWeekends.push(holiday.date.iso);
        } else if (holiday.primary_type === 'National holiday') {
            holidayDates.push(holiday.date.iso);
        }
    });

    return { workingWeekends, holidayDates };
}

// 生成并存储节假日信息
async function generateHolidayJson(year, month) {
    const { workingWeekends, holidayDates } = await processHolidays(year, month);
    const holidayData = { workingWeekends, holidayDates };
    const key = `holidays_${year}_${month}`;
    
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "setHolidayData", key, data: holidayData }, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}

// 从存储中获取节假日信息
async function getHolidayData(year, month) {
    const key = `holidays_${year}_${month}`;
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "getHolidayData", key }, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}

// 判断某一日期是否是工作日
async function isWorkingDay(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dateString = formatDate(date);
    const weekday = date.getDay();

    let holidayData = await getHolidayData(year, month);
    if (!holidayData) {
        await generateHolidayJson(year, month);
        holidayData = await getHolidayData(year, month);
    }

    const { workingWeekends, holidayDates } = holidayData;

    if (workingWeekends.includes(dateString)) {
        return true;
    } else if (holidayDates.includes(dateString)) {
        return false;
    } else if (weekday === 0 || weekday === 6) {
        return false;
    } else {
        return true;
    }
}

// 初始化函数
async function initialize() {
    if(!window.location.href.includes('time_entries')){
        return;
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    await generateHolidayJson(year, month);
    processUserTimeEntries();
}

// 处理用户时间条目页面
async function processUserTimeEntries() {
    const currentUrl = window.location.href;
    const isUserTimeEntries = currentUrl.includes('time_entries');

    if (isUserTimeEntries) {
        console.log("正在处理用户时间条目页面");
        const table = document.getElementById('time-report');
        if (table) {
            const headerRow = table.querySelector('thead tr');
            const dataRows = table.querySelectorAll('tbody tr');
            const totalRow = table.querySelectorAll('tbody tr.total td.hours');

            // 获取日期列的索引
            const dateIndices = Array.from(headerRow.querySelectorAll('th.period')).map((th, index) => ({
                date: th.textContent.trim(),
                index: index + 1  // +1 因为第一列是用户名
            }));

            const totalRowHours = ['合计'];
            // 处理合计列
            for (const hours of totalRow) {
                totalRowHours.push(parseFloat(hours.textContent));
                if(!isNaN(hours.textContent) && parseFloat(hours.textContent) < 8) {
                    hours.style.setProperty('background-color', '#FF6347', 'important'); // 番茄红
                }
            }
            
            // 处理每一行数据
            for (const row of dataRows) {
                for (const {date, index} of dateIndices) {
                    const cell = row.cells[index];
                    if (cell) {
                        const hours = parseFloat(cell.textContent);
                        const isWorking = await isWorkingDay(new Date(date));
                        if (!isWorking) {
                            cell.style.setProperty('background-color', '#E0FFE0', 'important'); // 浅绿色
                        } else if (isWorking && (!isNaN(hours) && hours < 8) && (isNaN(totalRowHours[index]) || totalRowHours[index] < 8)) {
                            cell.style.setProperty('background-color', '#FF6347', 'important'); // 番茄红
                        }
                    }
                }
            }
        } else {
            console.log("未找到时间报告表格");
        }

        console.log("样式应用完成");
    }
}

// 辅助函数：格式化日期为 year-month-day
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 保留 openUserTimeEntries 函数以防其他地方调用
// function openUserTimeEntries() {
//     chrome.runtime.sendMessage({ action: "open_user_time_entries" });
// }

// 初始化
initialize();