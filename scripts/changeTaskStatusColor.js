// 优化提单列表的排版
const table = document.getElementsByTagName("table");
if (table) {
    const style = document.createElement("style");
    style.innerHTML = `
        table.list th.project, table.list td.project,
        table.list th.fixed_version, table.list td.fixed_version,
        table.list td.updated_on, table.list td.due_date{
            text-wrap: initial;
            word-wrap: break-word;
            white-space: normal;
        }
    `;
    document.head.appendChild(style);
}
