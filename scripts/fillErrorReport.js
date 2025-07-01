/* 
    1、ALT + G 填充错误报告模板
    2、页面右侧显示《软件开发部Bug分析操作指导》
*/
const bugReasonData = {
    "1 需求问题": [
        "1-1 需求变更：当前需求与原始需求不同",
        "1-2 需求不明确：研发人员对需求理解不一致导致的问题",
        "1-3 需求迭代：之前版本未定义此需求",
        "1-4 需求未定义",
        "1-5 需求定义：需求本身如此定义",
        "1-6 需求理解错误",
    ],
    "2 设计问题": [
        "2-1 设计与需求不一致",
        "2-2 需求未定义的设计：需求未定义，研发人员自作主张的设计（未与产品经理确认）",
        "2-3 设计与规范标准不符：设计不符合行业标准、协议标准、公司标准、部门软件标准",
        "2-4 异常处理未考虑：设计未考虑的异常情况导致的问题",
        "2-5 设计遗漏：设计未考虑某种情况导致的问题",
        "2-6 设计未考虑用户体验",
        "2-7 设计不合理",
        "2-8 规范不完善",
        "2-9 设计未考虑性能",
        "2-10 客制化遗漏",
        "2-11 模块间接口问题",
    ],
    "3 实现问题": [
        "3-1 实现与设计不一致",
        "3-2 代码逻辑问题：",
        "3-3 内存操作问题：内存越界、内存泄露、空指针、野指针等问题",
        "3-4 资源使用问题：非法使用资源、资源消耗过多、死锁的问题",
        "3-5 算法问题：大量的拷贝、移动内存操作，不合适的循环或递归算法等",
        "3-6 编程语法问题：编程语言语法使用错误导致的问题",
        "3-7 实现遗漏：在实现中漏掉了对应的设计",
        "3-8 未使用已有模块",
        "3-9 API文档问题：实际API与API文档不一致，或者实际API与标准API不一致",
    ],
    "4 兼容性问题": ["4-1 协议标准兼容性", "4-2 第三方兼容性", "4-3 硬件兼容性", "4-4 外围设备兼容性", "4-5 操作系统兼容性"],
    "5 编译及流程问题": [
        "5-1 代码入库错误：包括合错代码、合错版本、漏合代码、有效代码被覆盖等",
        "5-2 编译环境问题：编译环境变化引起的问题等",
        "5-3 版本传递问题",
    ],
    "6 易用性问题": ["6-1 交互操作不友好", "6-2 UI界面信息不准确：提示信息不准确、中英文描述错误等", "6-3 浏览器兼容性"],
    "7 认证问题": ["7-1 HDMI认证", "7-2 Dolby认证", "7-3 Google CTS认证"],
    "8 其他问题": [
        "8-1 第三方Bug：软件中使用的第三方库、第三方应用、供应商软件Bug等",
        "8-2 文档问题：文档未更新、文档描述错误等",
        "8-3 性能问题：系统负荷超出设计的最大要求出现的问题",
        "8-4 硬件问题：硬件导致的问题，最终通过硬件修改解决",
        "8-5 Wifi性能问题",
        "8-6 方案限制：由于产品的方案设计，从而导致的某些问题",
        "8-7 眼图问题：",
        "8-8 新技术问题：",
        "8-9 FPGA问题",
        "8-10 接口变更问题",
        "8-11 线材问题",
        "8-12 纯硬件产品问题",
    ],
    "9 非软件Bug": [
        "9-1 非软件Bug",
        "9-2 非我司产品Bug",
        "9-3 产品接收",
        "9-4 外部环境问题",
        "9-5 环境配置问题",
        "9-6 后续未复现",
        "9-7 版本迭代问题：该轮迭代版本暂不支持的需求",
        "9-8 不是Bug",
    ],
    "10 第三方芯片或库使用": [
        "10-1 GSV芯片使用",
        "10-2 Mdin芯片使用",
        "10-3 ITE芯片使用",
        "10-4 EP芯片使用",
        "10-5 Aspeed芯片使用",
        "10-6 中电芯片使用",
        "10-7 Sigmastar芯片使用",
        "10-8 第三方库使用",
        "10-9 USB时序控制",
        "10-10 LT芯片使用",
    ],
    "11 方案限制": ["11-1 产品方案限制", "11-2 Dante方案限制", "11-3 DSC方案限制", "11-4 Aspeed方案限制"],
};
const bugTypeData = [
    "1 需求变更    ——解释：原本符合要求，但因新规范或新需求不再符合。",
    "2 需求理解不一致    ——解释：对需求的理解存在差异而导致的问题。",
    "3 实现遗漏    ——解释：明确需求被遗漏在开发中。",
    "4 历史问题    ——解释：以前存在的问题未被测试发现。",
    "5 新需求支持问题    ——解释：为支持新需求引入的错误。",
    "6 修改引入新问题    ——解释：修复旧Bug时引入的新问题。",
    "7 不是问题    ——解释：经确认是测试误测/后续未复现等。",
];
function fillErrorReport() {
    const follow = document.getElementsByClassName("select2-selection__rendered")[3];

    if (follow) {
        const ref = document.getElementById("issue_notes");
        if(!ref) return;
        ref.value += `故障现象：同问题描述
复现方法：同问题描述
故障原因：
解决办法：
代码变更：
自测情况：自测无异常
影响分析：无
测试建议：无
通用性分析：无

----------------------------------------------------------------------
故障原因分类：需参考《软件开发部Bug分析操作指导》中的分类进行
改进建议：如何做可以尽量避免该问题发生
故障引入类型：需参考《软件开发部Bug分析操作指导》中的分类进行
`;

        const sidebarDOM = document.getElementById("sidebar");

        if (sidebarDOM.querySelector(".bugReason")) {
            return;
        }

        if (sidebarDOM) {
            sidebarDOM.style.position = "relative";
        }

        // 创建一个通用的样式设置函数
        function createElementWithStyles(tag, styles, textContent = "") {
            const element = document.createElement(tag);
            Object.assign(element.style, styles);
            if (textContent) {
                element.textContent = textContent;
            }
            return element;
        }

        // 创建容器
        const bugReasonDOM = document.createElement("div");
        bugReasonDOM.classList.add("bugReason");
        Object.assign(bugReasonDOM.style, {
            boxSizing: "border-box",
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "600px",
            backgroundColor: "#e8f0fe",
            padding: "20px",
            overflowY: "auto",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
        });

        // 添加故障原因分类标题
        const bugReasonTitleDOM = createElementWithStyles(
            "div",
            {
                fontWeight: "bold",
                fontSize: "24px",
                color: "#0d78f2",
                marginBottom: "20px",
                borderBottom: "2px solid #0d78f2",
                paddingBottom: "8px",
            },
            "故障原因分类",
        );
        bugReasonDOM.appendChild(bugReasonTitleDOM);

        // 创建故障原因列表
        const bugReasonListDOM = createElementWithStyles("ul", {
            listStyleType: "none",
            padding: "0",
            margin: "0",
        });

        for (const [key, values] of Object.entries(bugReasonData)) {
            const li = createElementWithStyles(
                "li",
                {
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "#3aabee",
                    marginTop: "12px",
                },
                key,
            );

            const subUl = createElementWithStyles("ul", {
                listStyleType: "circle",
                marginLeft: "30px",
                color: "#546E7A",
                fontSize: "18px",
            });

            values.forEach((value) => {
                const subLi = createElementWithStyles("li", {}, value);
                subUl.appendChild(subLi);
            });

            li.appendChild(subUl);
            bugReasonListDOM.appendChild(li);
        }

        bugReasonDOM.appendChild(bugReasonListDOM);

        // 添加故障类型处理
        const bugTypeTitleDOM = createElementWithStyles(
            "div",
            {
                fontWeight: "bold",
                fontSize: "24px",
                color: "#0d78f2",
                marginTop: "30px",
                marginBottom: "20px",
                borderBottom: "2px solid #0d78f2",
                paddingBottom: "8px",
            },
            "故障引入类型",
        );
        bugReasonDOM.appendChild(bugTypeTitleDOM);

        const bugTypeListDOM = createElementWithStyles("ul", {
            listStyleType: "none",
            padding: "0",
            margin: "0",
        });

        bugTypeData.forEach((type) => {
            const li = createElementWithStyles(
                "li",
                {
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#3aabee",
                    marginTop: "12px",
                    whiteSpace: "pre-wrap",
                },
                type,
            );
            bugTypeListDOM.appendChild(li);
        });

        bugReasonDOM.appendChild(bugTypeListDOM);
        sidebarDOM.appendChild(bugReasonDOM);
    }
    console.log("已填充BUG模板");
}

// 添加键盘监听事件
document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key === "g") {
        fillErrorReport();
    }
});