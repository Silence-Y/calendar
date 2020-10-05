var time1 = document.querySelector('.time1');
var time2 = document.querySelector('.time2');
var time3 = document.querySelector('.time3');
var week = document.querySelector('.week');
var date = document.querySelector('.date');
var up = document.querySelector('.up');
var down = document.querySelector('.down');



// 即时时间
moment.locale('zh-cn');
function time(){
    time1.innerHTML = moment().format('LTS');
}
time();
setInterval(time,1000);

// 即时日期
var dayCn = window.calendar.solar2lunar(moment().year(), moment().month() + 1, moment().date());

time2.innerHTML = moment().format('LL') + ' ' + dayCn.IMonthCn + dayCn.IDayCn+ ' ' + (dayCn.Term ? dayCn.Trem : '');


//星期
var weekDay = moment.weekdaysMin(true);
weekDay.forEach(function(item){
    week.innerHTML += '<span>'+ item + '</span>';
});




// 获取某月的天数
function getEndDay(moment){
    return moment.daysInMonth();   //返回当前月的天数
}
// 获取某月第一天的星期
function getFirstWeek(moment){
    return moment.startOf('month').weekday();
}

// 生成日历
var today = moment();
setDate(today);  //默认传现在的日期
function setDate(m){
    // 用户传进来的moment对象不能修改，如果修改了就要克隆一下
    var lastEndDay = getEndDay(m.clone().subtract(1,'month'));  //上个月的最后一天
    var curEndDay = getEndDay(m);  //当前月的最后一天
    var week = getFirstWeek(m.clone());  //当前月第一天的星期的索引值
    // console.log(lastEndDay,curEndDay,week);

    var str = '';
    var nextMonthStart = 0;
    for(var i = 0; i < 42; i++){
        if(i < week){
            // 上个月
            str = '<li class="color">'
                + '<span>'+ lastEndDay +'</span>'
                +'<span>'+ getDayCn(m.year(), m.month(), lastEndDay)+'</span>'
                +'</li>'
                + str;
            lastEndDay--;  //先用，再减
        }else if(i >= week + curEndDay){
            // 下个月
            nextMonthStart++;  //先加再用
            str += '<li class="color">'
                + '<span>'+ nextMonthStart +'</span>'
                +'<span>'+ getDayCn(m.year(), m.month() + 2, nextMonthStart)+'</span>'
                +'</li>';
            
        }else{
            // 当前月
            var cl = m.date()==i - week + 1 ? 'active' : '';  //标记今天的日期
            if(m.year() != moment().year() || m.month() != moment().month()){
                cl = '';
            }
            str += '<li class="'+ cl +'">'
                + '<span>'+ (i - week + 1) +'</span>'
                +'<span>'+ getDayCn(m.year(), m.month() + 1, i - week + 1)+'</span>'
                +'</li>';
        }
    }
    time3.innerHTML = m.format('YYYY年MMM')
    date.innerHTML = str;
}
// 上个月
up.onclick = function(){
    setDate(today.subtract(1,'month'));
}
// 下个月
down.onclick = function(){
    setDate(today.add(1,'month'));
}

// 获取农历
function getDayCn(year, month, date){
    var dayCn = window.calendar.solar2lunar(year, month, date);
    console.log(dayCn);
    var result = '';

    if(dayCn.IDayCn == '初一'){
        result = dayCn.IMonthCn;
    }else if(dayCn.Term){
        result = dayCn.Term;
    }else if(dayCn.festival){
        result = dayCn.festival;
    }else if(dayCn.lunarFestival){
        result = dayCn.lunarFestival;
    }else{
        result = dayCn.IDayCn
    }
    return result;
}
// console.log(getDayCn(2020,4,19));