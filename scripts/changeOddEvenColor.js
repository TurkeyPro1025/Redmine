// 获取 “我的工作台” 下 总工时项的 TR 标签，背景色改为 #dde0e0
const myWorkPlaceDOM = document.getElementById('my-page');
if (myWorkPlaceDOM) {
    const nextDOM = myWorkPlaceDOM.querySelector('#block-timelog');
    if (nextDOM) {
        const targetTrDOM = nextDOM.getElementsByClassName('odd');
        if (targetTrDOM.length > 0) {
            for (let i = 0; i < targetTrDOM.length; i++) {
                targetTrDOM[i].style.backgroundColor = '#dde0e0';
            }
        }
    }
}
