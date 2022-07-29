let tabs={
	search:1,
	result:2,
	mycourses:3,
	about:4,
	goToTab:function(tab){
		const search=document.querySelector('.search')
		const results=document.querySelector('.results')
		const mycourses=document.querySelector('.mycourses')
		const about=document.querySelector('.about')
		search.style.display='none'
		results.style.display='none'
		mycourses.style.display='none'
		about.style.display='none'
		switch(tab){
			case tabs.search:
				search.style.display='block'
				break
			case tabs.result:
				results.style.display='block'
				break
			case tabs.mycourses:
				mycourses.style.display='block'
				break
			case tabs.about:
				about.style.display='block'
				break
		}
	}
}