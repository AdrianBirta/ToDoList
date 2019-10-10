$('input').attr('placeholder','What needs to be done?')

$('.new-item').keypress(function(event){
	if(event.keyCode === 13) {
		const value = $(this).val()
		$(this).val('');
		generateLi(value);
		saveToLocalStorage(value)
	}
})

$('.todo-items').on('click','input',function(){
	const $parent = $(this).closest('.list-item');
	$parent.toggleClass('completed')
	markOrRemoveCompleted($parent)
})
 
$('.todo-items').on('click','.delete-item', function(){

	const index = $(this).closest('.list-item').index();

	console.log(index, $(this).closest('.list-item'))

	markAsDeleted(index);

	$(this).closest('.list-item').remove();

})

borderItemsBottom()
function borderItemsBottom() {
	$('.items-all').addClass('border-click')
	let a = $('.items-all');
	let b = $('.items-active');
	let c = $('.items-completed');
	let z = [a,b,c]
	$.each(z, function(){
		$(this).mouseenter(function(){
			$(this).addClass('border-click-mouseover')
		})
		$(this).mouseleave(function(){
			$(this).removeClass('border-click-mouseover')
		})

		$(this).click(function(){			
			$(this).addClass('border-click')
			let x = $(this).siblings()
			x.removeClass('border-click')
			
		})
	})
}

$('.items-all').click(function(){
	let x='block';
	y=x;
	allItemsCheck(x, y);
	
})

$('.items-active').click(function(){
	let x='none';
	let y='block';
	allItemsCheck(x, y);

})

$('.items-completed').click(function(){
	let x='block';
	let y='none';
	allItemsCheck(x, y);
})


$('.items-clear-completed').click(function(){
	$('li').each(function(){
		if($(this).hasClass('completed')){
			const index = $(this).index();		
			markAsDeleted(index);
			$(this).remove();
		}
	})
})

function clearCompletedCounter (){
	let counterCompleted=0;
	$('li').each(function(){
		if($(this).hasClass('completed')){
			counterCompleted++;
		}
	})
	if(counterCompleted == 0){
		$('.items-clear-completed').addClass('hidden')
	} else if(counterCompleted > 0 ){
		$('.items-clear-completed').removeClass('hidden')
	}
}
setInterval(clearCompletedCounter, 1)
	
$('.completed-all').click(function(){

	let allCompleted = true;
	
	$('li').each(function(){
		if(!$(this).hasClass('completed')){
			allCompleted=false;
		}
	})

	if (!allCompleted){
		$('.completed-all i').css('color','gray')
		$('input[type="checkbox"]').prop("checked", true);
		$('li').addClass('completed')
	}
	else {
		$('.completed-all i').css('color','#ccc')
		$('input[type="checkbox"]').prop("checked", false);
		$('li').removeClass('completed')
	}

	

	
	$('li').each(function() {
		
		markOrRemoveCompleted($(this));
	})
		
})

function markOrRemoveCompleted($element) {
	const index = $element.index();
	console.log($element, index)
	if (!$element.hasClass('completed')) {
		removeCompleted(index);		
	} 
	else {
		markAsCompleted(index);
	}
}




function markAsDeleted(index) {
	const listItemsString = localStorage.getItem('listItems') //luam din localStorage

	const listItems = JSON.parse(listItemsString) 

	console.log(listItems)

	

	listItems.splice(index, 1)

	localStorage.setItem('listItems', JSON.stringify(listItems))
}

function markAsCompleted(index){ 
	const listItemsString = localStorage.getItem('listItems')

	const listItems = JSON.parse(listItemsString);

	listItems[index].completed = true //accesez cheia completed

	localStorage.setItem('listItems', JSON.stringify(listItems))
}

function removeCompleted(index){
	const listItemsString = localStorage.getItem('listItems')

	const listItems = JSON.parse(listItemsString);

	listItems[index].completed = false //accesez cheia completed

	localStorage.setItem('listItems', JSON.stringify(listItems))
}

function generateLi(value) {
	const checkbox = '<input type="checkbox" />'
	const deleteBtn = '<button class="delete-item"><i class="fas fa-times"></i></button>'
	const spanValue = '<span>' + value + '</span>'

	const newLi = $('<li />', {
		class: 'list-item',
		html: checkbox + spanValue + deleteBtn
	})

	$('.todo-items').append(newLi);
}

function saveToLocalStorage(value) {

	const listItemsString = localStorage.getItem('listItems')//citim din localStorage
	let listItems;

	if(listItemsString === null ) {
		listItems=[];
	} else {
		listItems = JSON.parse(listItemsString)
	}

	
	const obj = {
		completed: false,
		text: value,
	}


	listItems.push(obj)

	localStorage.setItem('listItems', JSON.stringify(listItems))
}

function chechkExistingItems() {
	const listItemsString = localStorage.getItem('listItems')//citim din localStorage
		
		if(listItemsString !== null ) {
			const listItems = JSON.parse(listItemsString)

			listItems.forEach(item => {
				generateLi(item.text)
			})	

		}
}

function checkCompletedItems() {
	const listItemsString = localStorage.getItem('listItems')

	if(listItemsString === null){
		return;
	}

	const listItems = JSON.parse(listItemsString)

	listItems.forEach((item, index) => {
		if(item.completed) {
			$($('.list-item')[index]).addClass('completed') // de pe cheia item
			$($('.list-item')[index]).find('input').attr('checked',true)
		}
	})
}



function allItemsCheck(x, y){
	$('li').each(function(){			
		if($(this).hasClass('completed')){
			$(this).css('display', x)
		}
		if(!$(this).hasClass('completed')){
			$(this).css('display', y)
		}
	})
}

function countAllLi(){
	let i=0;
	let j=0;
	$('li').each(function(){
		i++;			
		if($(this).hasClass('completed'))
		j++;
		
	})

	$('.items-left').text( (i-j) + ' items left');
	if(i == 0) {
		$('.bottom').css('display','none');
	}
	else {
		$('.bottom').css('display','flex');
	}

}



setInterval(countAllLi, 1);

chechkExistingItems();
checkCompletedItems();




