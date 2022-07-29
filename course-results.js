function course_showOrHide(){
	const course_showMore=[...document.querySelectorAll('.course-showMore')]
	const course_showLess=[...document.querySelectorAll('.course-showLess')]
	const course_hidden=[...document.querySelectorAll('.course-hidden')]

	course_showMore.forEach((elem,i)=>{
		elem.addEventListener('click',()=>{
			course_hidden[i].style.display="block"
			course_showMore[i].style.display="none"
			course_showLess[i].style.display="block"
		})
	})
	course_showLess.forEach((elem,i)=>{
		elem.addEventListener('click',()=>{
			course_hidden[i].style.display="none"
			course_showMore[i].style.display="block"
			course_showLess[i].style.display="none"
		})
	})
}
course_showOrHide()