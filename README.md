# layout
Website Gui

WYSIWYG, SSR


### data
```
{
	id:"123",
	type:"text",
	data:{
		text:"123"
	},
	style:{
		"custom":{
			style:{},
			classes:[]
		},
		"padding": "20px 10px",
    	"margin": "1px 1px",
    	"border": "1px #64a4ff solid",
    	"box-shadow": "1px 1px 10px rgba(0, 0, 0, 0.1)",
    	"border-radius": "1px 1px 2px 2px",
    	"background": {type:"color",color:"#fff"},
    	"letter-spacing": "8px",
    	"text-align": "left",
	},
	animate:[
		{model:"FadeIn",time:"0.5s"}
	],
	methods:{
		click:"function (){console.log(this)}"
	}
}
```

**说明**

|字段|属性|
|-|-|
|id|组件的id,至少要保证一个页面中id是唯一的|
|type|组件类型|
|data|每个组件自己的值|
|methods|用户自定义的function, 在组件中需要显示调用他|
|animate|多个动画|
|sytle|可能是原始的css, 也可能是一个封装后的属性比如`background`,组件自己分开判断渲染|
|style.custom|自定义样式, 需要原封不动的渲染到dom的`style`,`class`|

