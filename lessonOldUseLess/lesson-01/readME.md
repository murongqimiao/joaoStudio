### lesson 01
创造一个动画对象

雪碧图 -> 会动的动画

|- assets  ···············  存放静态资源
|
|- data.js ···············  存放填充动画类的数据
|
|- index
    |- Game  ·············  帧动画整体数据, 处理待渲染数据
    |- Role  ·············  初始化动画对象, 通过currentEvent计算当前需要渲染哪张图片资源的哪个位置