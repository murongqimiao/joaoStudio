export const addGameListener = (gameNew) => {
    document.onkeydown = function (e) {    //对整个页面监听  
        var keyNum = window.event ? e.keyCode : e.which;       //获取被按下的键值  
        switch (keyNum) {
            case 37:
            case 74: // J
                gameNew.keyActiveCollect('add', 'J')
                break;
            case 40:
            case 75: // K
                gameNew.keyActiveCollect('add', 'K')
                break;
            case 39:
            case 76: // L
                gameNew.keyActiveCollect('add', 'L')
                break
            case 38:
            case 73: // I
                gameNew.keyActiveCollect('add', 'I')
                break
            case 68:
                gameNew.keyActiveCollect('add', 'D')
            default: () => { }
        }
    }
    document.onkeyup = (e) => { // 监听键盘抬起 停止对应行为
        var keyNum = window.event ? e.keyCode : e.which;
        switch (keyNum) {
            case 37:
            case 74: // J
                gameNew.keyActiveCollect('remove', 'J')
                break;
            case 40:
            case 75: // K
                gameNew.keyActiveCollect('remove', 'K')
                break;
            case 39:
            case 76: // L
                gameNew.keyActiveCollect('remove', 'L')
                break
            case 38:
            case 73: // I
                gameNew.keyActiveCollect('remove', 'I')
                break
            case 68:
                gameNew.keyActiveCollect('remove', 'D')
            default: () => { }
        }
    }

}