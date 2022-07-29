const deptInput=document.querySelector('#deptCode')
let generalCoreList
fetch('xhrs.json')
	.then(res=>res.json())
	.then(data=>{
		// console.log(data)
		let depts=data.depts
		console.log(depts)
		console.log(data.generalCore)
		generalCoreList=data.generalCore
		depts.forEach(e => {
			// console.log(e)
			let option=document.createElement('option')
			option.value=e[0]
			option.innerText=e[1]
			deptInput.appendChild(option)
		})
	})
	.catch(err=>console.log(err))

const divForGU=document.querySelector('.divForGU')
/* current disable
deptInput.addEventListener("change",()=>{
	if(deptInput.value=='GU') {
		divForGU.classList.remove('notGU')
		return
	}
	divForGU.classList.add('notGU')
})
*/
let generalKindList=[[1,'97-105入學'],[2,'106-108入學'],[3,'109起入學']]
const generalKind=document.querySelector('.generalKind')
generalKindList.forEach(e=>{
	const generalKindChild=document.createElement('option')
	generalKindChild.value=e[0]
	// console.log(e[0])
	generalKindChild.innerText=e[1]
	generalKind.appendChild(generalKindChild)
})

const generalCore=document.querySelector('.generalCore')
generalKind.addEventListener('change',()=>{
	console.log('change')
	generalCore.innerHTML=''
	let generalCoreDefault=document.createElement('option')
	generalCoreDefault.value=''
	generalCoreDefault.innerText='請選擇'
	generalCore.appendChild(generalCoreDefault)
	console.log(generalKind.value)
	switch(generalKind.value){
		case "1":
			generalCoreList[0].forEach(e=>{
				let elem=document.createElement('option')
				elem.innerText=e[1]
				elem.value=e[0]
				generalCore.appendChild(elem)
			})
			break
		case "2":
			generalCoreList[1].forEach(e=>{
				let elem=document.createElement('option')
				elem.innerText=e[1]
				elem.value=e[0]
				generalCore.appendChild(elem)
			})
			break
		case "3":
			generalCoreList[2].forEach(e=>{
				let elem=document.createElement('option')
				elem.innerText=e[1]
				elem.value=e[0]
				generalCore.appendChild(elem)
			})
			break
	}
})

const url='https://script.google.com/macros/s/AKfycbxXa7gd9oF2suzq8qn9xjqM2dPSTzVWEE1f26Nazx9NfJDT7Z9-Y7vPfshhQOVOyMNv/exec'

const chn=document.querySelector('#chn')
const teacher=document.querySelector('#teacher')
const serial_number=document.querySelector('#serial_number')
const course_code=document.querySelector('#course_code')
const submit=document.querySelector('.submit')
const result=document.querySelector('.results-container')
let lastSearch
function CourseIsAdded(storedCourse,course){
	let state=false
	storedCourse.forEach(e=>{
		if(e.serial_no===course.serial_no){
			state=true
			return
		}
	})
	return state
}
function getCoursesFromLocalStorage(){
	let storedCourse=window.localStorage.getItem('course1111')
	if(storedCourse==null) storedCourse="[]"
	storedCourse=JSON.parse(storedCourse)
	return storedCourse
}
function addToLocalStorage(course){
	let storedCourse=getCoursesFromLocalStorage()
	if(CourseIsAdded(storedCourse,course)){
		console.log(`${course.chn_name} has already been added`)
		return
	}
	storedCourse.push(course)
	storedCourse=JSON.stringify(storedCourse)
	window.localStorage.setItem('course1111',storedCourse)
	console.log(`${course.chn_name} has been added successfully`)
}
function deleteCourse(serial_no){
	//pass in serialNO
	console.log(serial_no)
	let storedCourse=getCoursesFromLocalStorage()
	let removeElem=[...document.querySelectorAll(`.sn${serial_no}`)]
	removeElem.forEach(e=>e.remove())
	localStorage.setItem('course1111',JSON.stringify(storedCourse.filter(e=>e.serial_no!=serial_no)))
	course_showOrHide()
}
showOnHtml(...getCoursesFromLocalStorage())
function showOnHtml(...course){
	// console.log(course)
	showOnList(course)
	course.forEach(e=>{
		if(e.time_inf.indexOf(',')==-1){
			showOnTable(e.time_inf,e.chn_name,e.serial_no)
			return
		}
		//two separate time will go here
		e.time_inf.split(", ").forEach((time,i)=>{
			showOnTable(time,e.chn_name,e.serial_no)
		})

	})
}

function showOnList(data){
	const a=document.querySelector('.mycourses-list')
	data.forEach((data,index)=>{
		let html=`<div class="course-container sn${data.serial_no}">
		<div class="course-flex">
			<div class="course-chn">${data.serial_no} ${data.chn_name}</div>
			<button class="course-add" onclick="deleteCourse('${data.serial_no}')">從課表刪除</button>
		</div>
		<div class="course-time">${data.time_inf}</div>
		<div class="course-flex">
			<div class="course-teacher">${data.teacher}</div>
			<button class="course-showMore">顯示更多</button>
		</div>
		
		<div class="course-hidden" style="display: none;">
			<div class="course-dept_chiabbr">${data.dept_chiabbr} ${data.course_code}</div>
			<div class="course-credit">${data.option_code} ${data.credit}學分
			`
			if(data.eng_teach)html+=
`					英語授課</div>
`
			html+=`
			<div class="course-restrict">限修：${data.restrict}</div>
			<div class="course-comment">備註：${data.comment}</div>
			<a href='https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/SyllabusCtrl?year=111&term=1&courseCode=${data.course_code}&courseGroup=${data.course_group}&deptCode=${data.dept_code}&formS=${data.form_s}&classes1${data.classes}=&deptGroup=${data.dept_group}' target="_blank"><button>課程綱要</button></a>
		</div>
		<button class="course-showLess" style="display: none;">顯示較少</button>
	</div>`
		a.innerHTML+=html
	})
	return 
}
function showOnTable(time_inf,chn,serial_no){
	time_inf=time_inf.split(' ')
	// console.log(time_inf)
	const day=chnNumberToNum(time_inf[0])
	let lessons
	if(time_inf[1].indexOf('-')==-1){
		lessons=lessonToNum(time_inf[1])
		document.querySelector(`#id${day}-${lessons}`).innerHTML+=`<p class="sn${serial_no}">${chn}</p>`
		return
	}
	lessons=time_inf[1].split('-')
	if(lessons[0].charCodeAt()>=65) lessons[0]=lessons[0].charCodeAt()-65+11
	if(lessons[1].charCodeAt()>=65) lessons[1]=lessons[1].charCodeAt()-65+11
	if(lessons[0].length===2)lessons[0]=10
	if(lessons[1].length===2)lessons[1]=10
	for(let i=lessons[0];i<=lessons[1];i++){
		document.querySelector(`#id${day}-${i}`).innerHTML+=`<p class="sn${serial_no}">${chn}</p>`
	}
	
}

function chnNumberToNum(str){
	if(str==='一')return 1
	if(str==='二')return 2
	if(str==='三')return 3
	if(str==='四')return 4
	if(str==='五')return 5
	if(str==='六')return 6
}

function addToMyCourse(course) {
	
	addToLocalStorage(course)
	showOnHtml(course)
	course_showOrHide()
}

submit.addEventListener('click',()=>{
	tabs.goToTab(tabs.result)
	result.innerText='loading'
	if(deptInput.value&&chn.value&&teacher.value&&serial_number.value&&course_code.value){
		//fill something in
		return
	}
	let kind='',core=''
	if(deptInput=='GU'){
		kind=generalKind.value
		core=generalCore.value
	}

	let urlToSend=`${url}?year=111&term=1&deptCode=${deptInput.value}&chn=${chn.value}&deptCode=${deptInput.value}&kind=${kind}&generalCore=${core}&teacher=${teacher.value}&serial_number=${serial_number.value}&course_code=${course_code.value}`
	console.log(urlToSend)
	fetch(urlToSend)
		.then(res=>res.json())
		.then(data=>{
			data=JSON.parse(data).List
			data.map(e=>{
				const a=e.chn_name.indexOf('<')
				if(a==-1){
					return e
				}
				e.chn_name=e.chn_name.slice(0,a-1)
				return e
			})
			console.log(data)
			result.innerHTML=``
			lastSearch=data
			data.forEach((data,index)=>{
				let html=`<div class="course-container">
				<div class="course-flex">
					<div class="course-chn">${data.serial_no} ${data.chn_name}</div>
					<button class="course-add" onclick="addToMyCourse(lastSearch[${index}])">新增至課表 <strong>+</strong></button>
				</div>
				<div class="course-time">${data.time_inf}</div>
				<div class="course-flex">
					<div class="course-teacher">${data.teacher}</div>
					<button class="course-showMore">顯示更多</button>
				</div>
				
				<div class="course-hidden" style="display: none;">
					<div class="course-dept_chiabbr">${data.dept_chiabbr} ${data.course_code}</div>
					<div class="course-credit">${data.option_code} ${data.credit}學分
					`
					if(data.eng_teach)html+=
`					英語授課</div>
`
					html+=`
					<div class="course-restrict">限修：${data.restrict}</div>
					<div class="course-comment">備註：${data.comment}</div>
					<a href='https://courseap2.itc.ntnu.edu.tw/acadmOpenCourse/SyllabusCtrl?year=111&term=1&courseCode=${data.course_code}&courseGroup=${data.course_group}&deptCode=${data.dept_code}&formS=${data.form_s}&classes1=${data.classes}&deptGroup=${data.dept_group}' target="_blank"><button>課程綱要</button></a>
				</div>
				<button class="course-showLess" style="display: none;">顯示較少</button>
			</div>`
				result.innerHTML+=html
			})
		})
		.then(()=>{
			course_showOrHide()
		})
})

