


// Вешает на console событие переключающее автоматический скроллинг
function consoleListen(){
	document.getElementById('console').addEventListener('click', function(e){
		if(autoScroll)
			autoScroll = false;
		else
			autoScroll = true;

	}, false);
};


// Руководит вводом мантры
function mantraIteration(){
	if(checkExpression()){
		charNum = 0;
		document.getElementById('console').innerHTML += curMantraText[charNum];
		setTimeout(function(){characterIteration()}, speed);
	}else{
		console.info('отправляю название и количество на статистику. Мантр: '+cntMantra);
		cntMantra = 0;
	}
}
// Руководит побуквенным вводом и перезапускает функцию руководящую вводом мантры в целом (mantraIteration)
function characterIteration(){
	charNum++;

	
	if(curMantraText[charNum] == '|'){
		multiRows = true;
		document.getElementById('console').appendChild(document.createElement('br'));
		// Прокрутка вниз консоли если флаг включен (выкл/вкл двойным кликом на консоли)
		if(autoScroll)
			document.getElementById('console').scrollTop = document.getElementById('console').scrollHeight;
		
		charNum++;
	}
	document.getElementById('console').innerHTML += curMantraText[charNum];

	if(charNum< curMantraText.length-1){

		setTimeout(function(){characterIteration()}, speed);
	}else{
		// Перевод на новую строку и прокрутка вниз
		document.getElementById('console').appendChild(document.createElement('br'));
		if(multiRows){
			document.getElementById('console').appendChild(document.createElement('br'));
		}
		// Прокрутка вниз консоли если флаг включен (выкл/вкл двойным кликом на консоли)
		if(autoScroll)
			document.getElementById('console').scrollTop = document.getElementById('console').scrollHeight;

		cntMantra++;
		

		mantraIteration();
	}
	/*
	if(pause){
		pauseChecker();
	}
	*/
}

// Проверка соблюдается ли условие для следующих итераций
function checkExpression(){
	// Вывожу текущее количество мантр на экран в панель управления
		var currentCount = document.getElementById('currentCount');
		currentCount.innerHTML = cntMantra;

	if(curReproductionMode == 'Кол-во '){
		
		var percentDone = cntMantra*100/curQuantityRestriction;
		document.getElementById('percent1').innerHTML = Math.floor(percentDone)+'%';
		document.getElementById('percent2').style.width = percentDone+'%';

	//	console.info(cntMantra+'<'+curQuantityRestriction);
		return cntMantra<curQuantityRestriction;
	}else if(curReproductionMode == 'Время '){
		console.info(new Date().getTime()+'<'+ aimTimestamp);
		return new Date().getTime()< aimTimestamp;
	}
}


// Прослушка кнопки play
function playListen(){
	var play = document.getElementById('play');
	play.addEventListener('click', function(){playButtonPressed()}, false);
}

// Принимает данные currentMantra и modeInputArea, проверяет их наличие. Отмечает какой включен режим
function getCurrentMantraData(){
	var currentMantra = document.getElementById('currentMantra');
	var modeInputArea = document.getElementById('modeInputArea');
	// Проверяю все ли данные пришли
	if(currentMantra.value && modeInputArea.value){
		console.info('Все значения получены');
		var isInList = false;
		// Проверяю есть ли текущая мантра в списке
		for(prop in mantraList){
			if(prop == currentMantra.value){
				isInList = true;
			}
		}

		if(isInList){
			curMantraName = currentMantra.value;
			curMantraText = mantraList[currentMantra.value];
		}else{
			curMantraName = '';
			curMantraText = currentMantra.value;
		}
		// Узнаю какой включен режим
		var modeBtn = document.getElementById('modeBtn');
		curReproductionMode = modeBtn.firstChild.nodeValue;
		// В зависимости от того какой включен режим, сохраняю значения ограничений
		if(curReproductionMode == 'Кол-во '){
			curTimeRestriction = '';
			curQuantityRestriction = modeInputArea.value;
		}else if(curReproductionMode == 'Время '){
			curTimeRestriction = modeInputArea.value;
			curQuantityRestriction = '';
		}
		readyForBegining = true;
		return true;
	}else{ // Подсветка красным незаполненых полей
		if(currentMantra.value){
			console.warn('Нет данных об ограничениях')
			modeInputArea.focus();
			modeInputArea.classList.add('emptyInput');
			modeInputArea.addEventListener('input', blurEmptyInputMode, false);
			modeInputArea.addEventListener('blur', blurEmptyInputMode, false);
		}else if(modeInputArea.value){
			console.warn('Нет данных о мантре')
			currentMantra.focus();
			currentMantra.classList.add('emptyInput');
			currentMantra.addEventListener('input', blurEmptyInputMantra, false);
			currentMantra.addEventListener('blur', blurEmptyInputMantra, false);
		}else if(!currentMantra.value && !modeInputArea.value){
			console.warn('Поля мантры и ограничения не заполнены');
			modeInputArea.focus();
			modeInputArea.classList.add('emptyInput');
			modeInputArea.addEventListener('input', blurEmptyInputMode, false);
			modeInputArea.addEventListener('blur', blurEmptyInputMode, false);
			currentMantra.classList.add('emptyInput');
			currentMantra.addEventListener('input', blurEmptyInputMantra, false);
			currentMantra.addEventListener('blur', blurEmptyInputMantra, false);
		}
		return false;
	}
}
// Функция для событий. Подсвечивает поле текущей мантры красным и удаляет события которые могли бы ее вызвать снова
function blurEmptyInputMantra(){
	// currentMantra берется из контекста
	currentMantra.classList.remove('emptyInput');
	currentMantra.removeEventListener('input', blurEmptyInputMantra, false);
	currentMantra.removeEventListener('blur', blurEmptyInputMantra, false);
}

// Функция для событий. Подсвечивает поле Ограничения красным и удаляет события которые могли бы ее вызвать снова
function blurEmptyInputMode(){
	// modeInputArea берется из контекста
	modeInputArea.classList.remove('emptyInput');
	modeInputArea.removeEventListener('input', blurEmptyInputMode, false);
	modeInputArea.removeEventListener('blur', blurEmptyInputMode, false);
}

// Вешают событие change на ползунок
function rangeListen(){
	var range = document.getElementById('range');
		speed = range.max-(range.value - range.min);
	range.addEventListener('change', function(e){
		speed = range.max-(range.value - range.min);
	}, false);
}

// Запоминание значений в поле минуты/разы режима 
function blurInputMode(){
	var modeInputArea = document.getElementById('modeInputArea');
	var modeBtn = document.getElementById('modeBtn');
	modeInputArea.addEventListener('blur', function(e){
		if(modeBtn.firstChild.nodeValue == 'Кол-во '){
			times = modeInputArea.value;
		}else if(modeBtn.firstChild.nodeValue == 'Время '){
			minutes = modeInputArea.value;
		}

	}, false)
}


// Переключение режимов Кол-во/Время
function toggleMode(){
	var modeBtn = document.getElementById('modeBtn');
	var modeAlternative = document.getElementById('modeAlternative');
	
	modeAlternative.addEventListener('click', function(e){
		var tempora = modeAlternative.firstChild.nodeValue;
		modeAlternative.firstChild.nodeValue = modeBtn.firstChild.nodeValue;
		modeBtn.firstChild.nodeValue = tempora;
		var modeInputArea = document.getElementById('modeInputArea');
		modeInputArea.value = '';
		if(tempora == "Кол-во "){
			if(times){
				modeInputArea.value = times;
			}
			modeInputArea.placeholder = "раз";
		}else if(tempora == "Время "){
			if(minutes){
				modeInputArea.value = minutes;
			}
			modeInputArea.placeholder = "минут";
		}else{
			modeInputArea.placeholder = "...";
		}
		modeInputArea.focus();
	}, false);
}


// При выделении текстового поля удаляет value, снимает checked с radio кнопки, ставит placeholder и еще некоторые действия выполняет
function addMantra(textArea){
	var parent = textArea.parentNode;
	var btn1exists = false;
	for(var i=0; i< parent.childNodes.length; i++){
		//if(parent.childNodes[i].nodeType == 1){
			if(parent.childNodes[i].id == 'btnAddMantra'){
				btn1exists = true;

			}
		//}
	}
	if(!btn1exists){
		var btnAdd = document.createElement('button');
		btnAdd.className = 'btn btn-info btn-block btn-xs';
		btnAdd.id = 'btnAddMantra';
		var span = document.createElement('span');
		span.className = 'glyphicon glyphicon-plus';
		var btnAddMantra = document.createTextNode('Добавить');
		btnAdd.appendChild(span);
		btnAdd.appendChild(btnAddMantra);
		var mantraNameFlag = false;
		
		parent.appendChild(btnAdd);
		btnAdd.addEventListener('blur', blur, false);
		btnAdd.addEventListener('click', function(e){
			if(!mantraNameFlag){
			var newInput = document.createElement('input');
			newInput.className = 'form-control btn-block';
			newInput.id = 'newMantraName';
			newInput.type = 'text';
			newInput.placeholder = 'Название мантры';

			//parent.appendChild(newInput);
			parent.insertBefore(newInput, btnAdd);
			newInput.focus();
			newInput.addEventListener('blur', blur, false);
			mantraNameFlag = true;
			btnAdd.classList.remove('btn-info');
			btnAdd.classList.add('btn-primary');
			btnAdd.firstChild.classList.remove('glyphicon-plus');
			btnAdd.firstChild.classList.add('glyphicon-floppy-disk');
			btnAdd.lastChild.nodeValue = 'Сохранить';
			}else{
				var inputMantraText = document.getElementById('currentMantra');
				var inputMantraName = document.getElementById('newMantraName');
	
				mantraList[inputMantraName.value] = inputMantraText.value;
				//console.info(mantraList);
				var mantraUl = document.getElementById('mantraList');
				/*
				for(var i=0; i< mantraUl.length; i++){
					mantraUl[i]
				}
				*/
				while(mantraUl.childNodes[0]){
					mantraUl.removeChild(mantraUl.childNodes[0]);
				}
				loadMantraList();
				removeElementsForBlur();
				inputMantraText.value = inputMantraName.value;

				var lis = document.querySelectorAll('input[name=mantra]');
				//console.info();
				lis[lis.length-1].checked = true;
				/*
				for(var i=0; i< node.length; i++){
					if(node[i].checked == true){
						node[i].checked = false;
					}
				}
				*/
			}
		}, false);
	}
	document.getElementById('currentMantra').addEventListener('blur', blur);
	document.getElementById('currentMantra').addEventListener('blur', blur, false);
		
}
// Удаляет текстовое поле названия мантры, и кнопку Добавить/Сохранить, если с этих элементов снят фокус
function removeElementsForBlur(){
	var btnAdd = document.getElementById('btnAddMantra');
	btnAdd.parentNode.removeChild(btnAdd);
	var newInput = document.getElementById('newMantraName');
	if(newInput)
		newInput.parentNode.removeChild(newInput);
	var textArea = document.getElementById('currentMantra');
	textArea.placeholder = '';
}

function blur(){

	setTimeout("if(isFullBlur()){removeElementsForBlur();}else{}", 200);
};

// Если ни один из элементов в нижней панели списка мантр не в фокусе, возвращает true
function isFullBlur(){
	if($('#newMantraName').is(':focus') || $('#btnAddMantra').is(':focus') || $('#currentMantra').is(':focus')){
		return false;
	}else{
		return true;
	}
}

function textAreaFocus(){
	var textArea = document.getElementById('currentMantra');
	textArea.addEventListener('focus', function(e){
		textArea.value = '';
		textArea.placeholder = 'Текст мантры';
		var node = document.querySelectorAll('input[name=mantra]');
		for(var i=0; i< node.length; i++){
			if(node[i].checked == true){
				node[i].checked = false;
			}
		}
		addMantra(textArea);
	}, false);
}

// Выводит список доступных мантр
function loadMantraList(){
	if(mantraList){
		for (var key in mantraList){
			var node = document.getElementById('mantraList');
			
			var li = document.createElement('li');
			li.className = 'list-group-item';
			var div = document.createElement('div');
			div.className = 'radio';
			var label = document.createElement('label');
			var input = document.createElement('input');
			input.type = "radio";
			input.name = "mantra";
			input.dataset.info = key;
			
			var val = document.createTextNode(key);
			
			label.appendChild(input);
			label.appendChild(val);
			div.appendChild(label);
			li.appendChild(div);
			node.appendChild(li);
			
			addEventToMantraList();
		}
	}else{
		console.warn('Массив с мантрами не найден, либо он пуст.');
	}
}

function addEventToMantraList(){
	var ul = document.getElementById('mantraList');
	ul.addEventListener('click', function(e){
		if(e.target.tagName == 'INPUT'){
			// Вставляю в текстовое поле текущую мантру
			var curMa = document.getElementById('currentMantra')
			curMa.value = e.target.dataset.info;
			if(curMa.classList.contains('emptyInput')){
				curMa.classList.remove('emptyInput');
			}
		}
	}, false);
}