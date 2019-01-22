## 依赖资源

- `./css/swiper.min.css` 日历组件滑动css库
- `./js/swiper.js` 日历组件滑动js库
- `./js/LunarCalendar.min.js` 农历js库 
## 配置和使用方法

__DOM结构__

一个`div`即可

```html
<div id="test"></div>
```

__初始化__

以下代码是用法

```js
        new WeekCalendar({
            el: "#test",
            format:'-',
            onClick :function(data){//点击日期触发 参数 返回点击后的日期
                console.log(data)
            },transitionEnd:function(data){//滑动结束后触发 参数 返回滑动后的日期
                console.log(data) 
            },init:function(data){//滑动结束后触发 参数 返回今天的的日期
                console.log(data)
            }
        });
```