(function () {
    "use strict";

    var leftMove = 0;
    var rightMove = 0;
    var date = new Date();
    var day = date.getDay();
    var bannerSwiper = undefined;
    var container = createEl('div', { 'class': 'container' });
    //周六
    var now = new Date(date.getTime() - 86400000 * day).getTime();
    function WeekCalendar(option) {
        this.option = option;
        this.init();
    }
    var swiperWrapper = createEl('div', { 'class': 'swiper-wrapper' });
    WeekCalendar.prototype = {
        init: function () {
            var self = this;
            "use strict";
            var el = document.querySelector(this.option.el);

            var header = this.createHeader();
            container.appendChild(header);
            var currentWeekList = this.createWeekList({ date: new Date(now), format: this.option.format }, true);
            var nextWeekList = this.createWeekList({ date: new Date(now + 86400000 * 7), format: this.option.format }, true);
            var perWeekList = this.createWeekList({ date: new Date(now - 86400000 * 7), format: this.option.format }, true);
            swiperWrapper.appendChild(perWeekList);
            swiperWrapper.appendChild(currentWeekList);
            swiperWrapper.appendChild(nextWeekList);
            var banner = createEl('div', { 'class': 'swiper-container', 'id': 'banner' });
            banner.appendChild(swiperWrapper);
            container.appendChild(banner);
            container.appendChild(this.createFoot(date));
            el.appendChild(container);
            this.addEvent();
            var att = attribute(currentWeekList.querySelector('.today').parentNode, 'calendar-date');
            this.option.init && this.option.init(att);
            bannerSwiper = new Swiper('#banner', {
                speed: 500,
                loop: false,
                initialSlide: 1,
                slideActiveClass: 'my-slide-active',
                slideNextClass: 'my-slide-next',
                slidePrevClass: 'my-slide-prev',

                on: {
                    slideNextTransitionEnd: function (event) {
                        "use strict";

                        if (bannerSwiper) {
                            leftMove++;
                            var activeDate = new Date(now + 86400000 * 7 * leftMove);
                            var nextDate = new Date(activeDate.getTime() + 86400000 * 7);

                            var nextEl = self.createWeekList({
                                date: nextDate,
                                format: self.option.format
                            }, true);
                            bannerSwiper.appendSlide(nextEl);
                            self.addEvent();
                            var att = attribute(bannerSwiper.slides[this.activeIndex].querySelector('.today').parentNode, 'calendar-date');
                            var clickDate = new Date(Date.parse(att));
                            var foot = container.querySelector('.calendar-foot')
                            container.removeChild(foot);
                            foot = self.createFoot(clickDate);
                            container.appendChild(foot);
                            self.option.transitionEnd && self.option.transitionEnd(att);
                        }
                    },
                    slidePrevTransitionEnd: function (event) {
                        "use strict";
                        if (bannerSwiper) {
                            rightMove--;
                            var activeDate = new Date(now + 86400000 * 7 * rightMove);
                            var pervDate = new Date(activeDate.getTime() - 86400000 * 7);
                            var pervEl = self.createWeekList({
                                date: pervDate,
                                format: self.option.format
                            }, true);
                            bannerSwiper.prependSlide(pervEl);
                            self.addEvent();
                            var att = attribute(bannerSwiper.slides[this.activeIndex].querySelector('.today').parentNode, 'calendar-date');
                            var clickDate = new Date(Date.parse(att));
                            var foot = container.querySelector('.calendar-foot')
                            container.removeChild(foot);
                            foot = self.createFoot(clickDate);
                            container.appendChild(foot);
                            self.option.transitionEnd && self.option.transitionEnd(att);
                        }
                    }
                }


            });
        },
        createHeader: function () {
            "use strict";
            var weekArr = ['日', '一', '二', '三', '四', '五', '六'];
            var ulEl = createEl('ul');
            for (var i = 0; i < 7; i++) {
                var liEl = createEl('li', {}, weekArr[i]);
                ulEl.appendChild(liEl);
            }
            return ulEl;
        },
        createWeekList: function (data, currentNode) {
            "use strict";
            var swiperdiv = createEl('div');
            swiperdiv.classList.add('swiper-slide');
            var calendar = createEl('div');
            calendar.classList.add('calendar');
            var today = new Date();
            var date = new Date(data.date);
            for (var i = 0; i < 7; i++) {
                var currentdate = new Date(date.getTime() + 86400000 * i);
                var divEL = createEl('div', { 'calendar-date': [currentdate.getFullYear(), currentdate.getMonth() + 1, currentdate.getDate()].join(data.format) });
                var daycontainer = createEl('div');
                daycontainer.classList.add('day-container')
                divEL.appendChild(daycontainer);
                var spEl1 = createEl('span', {}, currentdate.getDate());
                var lunar = LunarCalendar.solarToLunar(currentdate.getFullYear(), currentdate.getMonth() + 1, currentdate.getDate());

                var spEl2 = createEl('span', {}, lunar.lunarFestival || lunar.solarFestival || lunar.lunarDayName);
                daycontainer.appendChild(spEl1);
                daycontainer.appendChild(spEl2);
                calendar.appendChild(divEL);
                if (currentNode) {
                    if (day === i) {
                        daycontainer.classList.add('today');
                    }
                }
                if (today.getFullYear() === currentdate.getFullYear()
                    && today.getMonth() === currentdate.getMonth() &&
                    today.getDate() === currentdate.getDate()) {
                    daycontainer.classList.add('selectColor');
                }


            }
            swiperdiv.appendChild(calendar);
            return swiperdiv;

        },
        createFoot: function (date) {
            "use strict";
            var lunar = LunarCalendar.solarToLunar(date.getFullYear(), date.getMonth() + 1, date.getDate())
            var lunarYearArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
            var footEl = createEl('div');
            var pEl = createEl('p');
            var num = lunar.lunarYear;
            var lunarYearq = parseInt((num % 10000) / 1000);
            var lunarYearb = parseInt((num % 1000) / 100)
            var lunarYears = parseInt((num % 100) / 10);
            var lunarYearg = parseInt(num % 10);
            pEl.innerHTML = '农历：<span>' + lunarYearArr[lunarYearq] + lunarYearArr[lunarYearb] + lunarYearArr[lunarYears] + lunarYearArr[lunarYearg] + '年' + lunar.lunarMonthName + lunar.lunarDayName + '</span>';
            var pEl2 = createEl('p');
            pEl2.innerHTML = '公历：<span>' + ([date.getFullYear(), '年', date.getMonth() + 1, '月', date.getDate(), '日'].join('')) + '</span>';
            footEl.appendChild(pEl);
            footEl.appendChild(pEl2);

            if (lunar.lunarFestival) {
                var pEl3 = createEl('p');
                pEl3.innerHTML = '节日：<span>' + lunar.lunarFestival + '</span>';
                footEl.appendChild(pEl3);
            }
            if (lunar.solarFestival) {
                var pEl4 = createEl('p');
                pEl4.innerHTML = '节日：<span>' + lunar.solarFestival + '</span>';
                footEl.appendChild(pEl4);
            }
            footEl.classList.add('calendar-foot');
            return footEl;
        },
        addEvent: function () {
            "use strict";
            var self = this;
            Array.prototype.forEach.call(swiperWrapper.querySelectorAll('.calendar>div'), function (node) {
                node.onclick = function (e) {
                    window.event ? window.event.cancelBubble = true : event.stopPropagation();
                    var clickDate = new Date(Date.parse(attribute(this, 'calendar-date')));
                    day = clickDate.getDay();

                    bannerSwiper.slides.each(function () {
                        this.querySelector('.calendar .today').classList.remove('today');
                        this.querySelectorAll('.calendar>div')[day].querySelector('.day-container').classList.add('today');

                    });
                    var foot = container.querySelector('.calendar-foot')
                    container.removeChild(foot);
                    foot = self.createFoot(clickDate);
                    container.appendChild(foot);
                    self.option.onClick && self.option.onClick(attribute(this, 'calendar-date'));
                }
            });
        }

    };
    function createEl(tagName, attr, html) {
        "use strict";
        if (!tagName) return;
        attr = attr || {};
        html = html || '';
        var element = document.createElement(tagName);

        for (var i in attr) {
            element.setAttribute(i, attr[i]);
        }

        element.innerHTML = html;
        return element;
    }
    /**
 * 操作对象属性
 */
    function attribute(obj, attr, val) {
        "use strict";
        switch (arguments.length) {
            case 3:
                obj.setAttribute(attr, val);
                break;
            case 2:
                return obj.getAttribute(attr);
                break;
        }
    }
    window.WeekCalendar = WeekCalendar;
})()