export const addGameListener = (gameNew) => {

    const handle = (keyNum, event) => {
        switch (keyNum) {
            case 37:
            case 74: // J
                gameNew.keyActiveCollect(event, 'J')
                break;
            case 83: // S
                gameNew.keyActiveCollect(event, 'S')
                break;
            case 40:
            case 75: // K
                gameNew.keyActiveCollect(event, 'K')
                break;
            case 39:
            case 76: // L
                gameNew.keyActiveCollect(event, 'L')
                break
            case 38:
            case 73: // I
                gameNew.keyActiveCollect(event, 'I')
                break
            case 68:
                gameNew.keyActiveCollect(event, 'D')
                break;
            case 67: // C
                gameNew.keyActiveCollect(event, 'C')
                break;
            case 88: // X 
                gameNew.keyActiveCollect(event, 'X')
                break;
            default: () => { }
        }
    }    

    document.onkeydown = function (e) {    //对整个页面监听  
        var keyNum = window.event ? e.keyCode : e.which;       //获取被按下的键值  
        handle(keyNum, 'add')
    }
    document.onkeyup = (e) => { // 监听键盘抬起 停止对应行为
        var keyNum = window.event ? e.keyCode : e.which;
        handle(keyNum, 'remove')
    }
}