const lessonId2CountsUrl = 'https://eamis.nankai.edu.cn/eams/stdElectCourse!queryStdCount.action?projectId=1&semesterId=4263'
//注意修改semesterId,可从开发者模式网络标签发送的请求网址得到，或别的什么地方
//加载lessonId2Counts变量的URl
let lessonNo = NO
//选课课号 
let deleteNo = null
//退课课号
let intervalId = []
let checkInterval = []

//根据课号获取信息
const getInfo = (lessonNo,isTake) => {
    let lesson = lessonJSONs.filter(lesson=>lesson.no==lessonNo)
    let url = "/eams/stdElectCourse!batchOperator.action?profileId=1357";//不同阶段选课profileid不同，注意修改
    let eLG = lesson[0].expLessonGroups[0]?lesson[0].expLessonGroups[0].id:undefined
    let data
    //take or quit
    if(isTake == true){
        data = `optype=true&operator0=${lesson[0].id}%3Atrue%3A0&lesson0=${lesson[0].id}&expLessonGroup_${lesson[0].id}=${eLG}`;
    }
    else{
        data = `optype=false&operator0=${lesson[0].id}%3Afalse&lesson0=${lesson[0].id}`
    }
        return {lesson,url,data}
}
let info = getInfo(lessonNo,true) 
let deleteinfo = getInfo(deleteNo,false)
let reverseinfo = getInfo(deleteNo,true)
var success = (data, status, xhr) => {
// 在这里处理响应数据
    console.log(data.match(/[\u4e00-\u9fa5]+/g));
    if(data.includes('成功')){
        stop()
        stopCheck()
        console.log('success')
    }
};

// 使用 jQuery 的 post 函数发送请求
const start = () => {
    intervalId.push(setInterval(() => {$.post(info.url, info.data, success)},1000))
    console.log('start')
};
//退课
const startDelete = () => {
    if (deleteNo == null){
        returns
    }
    $.post(deleteinfo.url, deleteinfo.data, success)
    console.log('startDelete')
}
const stop = () => {
    intervalId.forEach(id=>clearInterval(id))
    intervalId = []
    console.log('stop')
}

// 一个不好的用途，补退选的时候捡漏，不建议使用，因为有可能是别人交换的
const reversedCheck = () => {
    $.get(lessonId2CountsUrl)//刷新lessonJSONs
    console.log('lesson:',info.lesson)
    let counts = lessonId2Counts[info.lesson[0].id]
    console.log(counts)
    if(counts.sc<counts.lc){
        startDelete()
        setTimeout(()=>{$.post(info.url, info.data, success)}, 1000);
        setTimeout(()=>{$.post(reverseinfo.url, reverseinfo.data, success)}, 1000);
        console.log('有余')
    }
}
//检查是否有课余量
const startCheck = ()=>{
    let id1 = setInterval(reversedCheck, 60000);//防止抢到别人交换的课，也防止被发现使用脚本，时间间隔请放大点，目前是一分钟。
    let id2 = setInterval(()=>{console.log(`running well at time:${new Date()}`)},60000)
    checkInterval.push(id1)
    checkInterval.push(id2)
    console.log('start check')
}
//stop
const stopCheck = () => {
    checkInterval.forEach(id=>clearInterval(id))
    checkInterval = []
    console.log('stop Check')
}