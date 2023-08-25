let lessonNo = No
let lesson = lessonJSONs.filter(lesson=>lesson.no==lessonNo)
var url = "/eams/stdElectCourse!batchOperator.action?profileId=1342";
let eLG = lesson[0].expLessonGroups[0]?lesson[0].expLessonGroups[0].id:undefined
let data = `optype=true&operator0=${lesson[0].id}%3Atrue%3A0&lesson0=${lesson[0].id}&expLessonGroup_${lesson[0].id}=${eLG}`;
let intervalId
var success = (data, status, xhr) => {
// 在这里处理响应数据
console.log(data.match(/[\u4e00-\u9fa5]+/g));
};

// 使用 jQuery 的 post 函数发送请求
const start = () => {
    intervalId = setInterval(() => {$.post(url, data, success)},1000)
    console.log('start')
}
const stop = () => {
    clearInterval(intervalId)
    console.log('stop')
}
