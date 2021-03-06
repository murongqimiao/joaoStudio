/**
 * check imgs load status 
 */

const renderLoadStatusInWindow = (percent) => {
    const el = document.querySelector('#load-status')
    const msg = percent === 100 ? `加载完成` : `...已加载${Math.floor(percent * 100)}%`
    if (el) el.innerHTML = msg
}

const removeLoadStatusInWindow = () => {
    const el = document.querySelector('#load-status')
    el.parentElement.removeChild(el)
}

export const loadInitResources = (cb) => {
    /**
     * 向项目中添加本地图片资源
     */
    let files = require.context("../assets", true, /\.png/)
    let filesPaths = files.keys()
    loadImgs(filesPaths, cb)
    
    /**
     * 向项目中添加plist标注
     */
    let plistFiles = require.context("../assets", true, /\.plist/)
    let plistFilesPaths = plistFiles.keys()
    plistFilesPaths.forEach(v => {
        loadXml("./assets/" + v)
    })
}

const loadImgs = (imgList, completeFunc) => {
    const game = window.__game
    const currentLoadImgs = {}
    let maxNumber = null
    let currentLoadNumber = 0

    game.gameStatus.loading = true // start loading modal

    // start load img
    imgList.forEach(v => {
        let _img = new Image()
        _img.src = "./assets/" + v
        currentLoadImgs[_img.src] = 0
        _img.onload = () => {
            currentLoadImgs[_img.src] = 1
            maxNumber = Object.keys(currentLoadImgs).length
            currentLoadNumber = Object.keys(currentLoadImgs).map(v => currentLoadImgs[v]).filter(v => v).length

            window.resources = Object.assign({}, (window.resources || {}), { [`${v.replaceAll('png', '').replaceAll('.', '').replaceAll('/', '_')}`]: _img })
            
            // update loading status
            game.gameStatus.waitForLoad = maxNumber // total imgs
            game.gameStatus.loadImgs = currentLoadNumber // has load imgs
            renderLoadStatusInWindow(currentLoadNumber/maxNumber)

            // load complete
            if (maxNumber === currentLoadNumber) {
                removeLoadStatusInWindow()
                game.gameStatus.loading = false
                completeFunc()
            }
        }
    })
}


const loadXml = (file) => {
    let xmlDoc = ''
    try //Internet Explorer  
    {  
        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");  
        xmlDoc.async=false;  
        xmlDoc.load(file);  
        parseXml(xmlDoc, name)
    } catch(e) {  
        try //Firefox, Mozilla, Opera, etc.  
        {  
            xmlDoc=document.implementation.createDocument("","",null);  
            xmlDoc.async=false;  
            xmlDoc.load(file);  
            parseXml(xmlDoc, name)
        } catch(e) {  
            try //Google Chrome  
            {  
                var xmlhttp = new window.XMLHttpRequest();  
                xmlhttp.open("GET",file,);  
                // 如果已指明，responseType 必须是空字符串或 "document"
                xmlhttp.responseType = 'document';
                // overrideMimeType() 用来强制解析 response 为 XML
                xmlhttp.overrideMimeType('text/xml');
                xmlhttp.onload = function () {
                  if (xmlhttp.readyState === xmlhttp.DONE) {
                    if (xmlhttp.status === 200) {
                      xmlDoc = xmlhttp.responseXML.documentElement;
                      parseXml(xmlDoc, name)
                    }
                  }
                };
                xmlhttp.send(null);  
            } catch(e) {  
                console.log("err", e)
            }  
        }  
    }
    let name = file.split('/').pop()
}

const parseXml = (xmlDoc, name) => {
    let dom = xmlDoc.querySelector('dict')
    let result = {}
    const parseDom = (dom, object) => {
        let childLength = dom.children.length
        if (!childLength) {
            return dom.innerHTML
        } else {
            for (let i = 0; i < childLength; i++) {
                let _dom = dom.children[i]
                if (_dom.tagName === 'key') {
                    if (!object[_dom.innerHTML]) { object[_dom.innerHTML] = {} }
                    object[_dom.innerHTML] = parseDom(dom.children[i + 1], object[_dom.innerHTML])
                }
            }
            return object
        }
    }
    if (!window.plist) { window.plist = {} }
    window.plist[name] = parseDom(dom, result) 
}

export const getPicByPicName = (name) => {
    let result = {}
    Object.keys(window.plist).forEach(key => {
        if (window.plist[key].frames[name]) {
            result = Object.assign(window.plist[key].frames[name],window.plist[key].metadata)
        }
    })
    return window.resources['_icon_' + result.realTextureFileName.split(".")[0]]
}

export const computedCurRenderBother = (name) => {
    /**
     *   params
     *   format: "2"
     *   frame: "{{320,720},{34,56}}"
     *   offset: "{0,0}"
     *   realTextureFileName: "icon.png"
     *   rotated: ""
     *   size: "{1024,1024}"
     *   smartupdate: "$TexturePacker:SmartUpdate:62d22c6b0ec3743f08c407ddc95a3042$"
     *   sourceColorRect: "{{15,4},{34,56}}"
     *   sourceSize: "{64,64}"
     *   textureFileName: "icon.png"
     * 
     *   结果是
     *   curRenderBother 
     *   centerOrigin: "187_219"
     *   frameStayTime: 7
     *   imgSizeInfo: "374_438"
     *   name: "_skill_new_jn10020_7_stand_0"
     *   shape: "rectangle"
     *   volumeInfo: "100_100_70_70_0
     */
    let params = {}
    Object.keys(window.plist).forEach(key => {
      if (window.plist[key].frames[name]) {
          params = Object.assign(window.plist[key].frames[name],window.plist[key].metadata)
      }
    })
    let result = {
        centerOrigin: "0_0",
        imgSizeInfo: "0_0",
        name: params.realTextureFileName,
        shape: "rectangle",
        volumeInfo: "0_0_0_0_0",
        offset: "0_0"
    }
    result.imgSizeInfo = params.frame.split("},{")[1].replaceAll("}}", "").replaceAll(",", "_")
    result.centerOrigin = result.imgSizeInfo.split("_").map((v, index) =>  index === 0 ? Number(v / 2) : Number(v)).join("_")
    result.offset = params.frame.split("},{")[0].replaceAll("{{", "").replaceAll(",", "_")
    result.volumeInfo = "0_0_" + result.imgSizeInfo + "_0"
    return result
}