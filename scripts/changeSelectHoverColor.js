// 修改下拉框的鼠标悬浮高亮颜色
const style = document.createElement('style');
style.innerHTML = `
    .select2-results__option--highlighted {
        background-color: #4898f3 !important;
        color: #ffffff !important;
    }
`;
document.head.appendChild(style);