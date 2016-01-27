
// функция для изображений. Не используется
function imageRouting(){
	var pictureRow = document.getElementById('pictureRow');
	pictureRow.classList.toggle('hidden');

	var fileName = "";
	var textArea = document.getElementById('currentMantra');

	switch(textArea.value){
		case 'Кармапа XVI':
			fileName = 'img/Кармапа XVI.jpg'; break;
		case 'кармапа ченно':
			fileName = 'img/Кармапа XVI.jpg'; break;
		case 'Любящие глаза':
			fileName = 'img/Любящие глаза.jpg'; break;
		case 'ом мани пеме хунг':
			fileName = 'img/Любящие глаза.jpg'; break;
		case 'Будда Амитаба':
			fileName = 'img/Будда Амитаба.jpg'; break;
		case 'ом ами дэва хри':
			fileName = 'img/Будда Амитаба.jpg'; break;
		case 'Алмазный Ум':
			fileName = 'img/Алмазный Ум.jpg'; break;
		case 'Будда Медицины':
			fileName = 'img/Будда Медицины.jpg'; break;
		case 'тадьятха ом беканзе беканзе маха беканзе рандза самутгатэ соха':
			fileName = 'img/Будда Медицины.jpg'; break;
		case 'Будда Амитаюс':
			fileName = 'img/Будда Амитаюс.jpg'; break;
		default:
			fileName = 'img/default.jpg';
	}

	var img = document.querySelector('.row .jum img');
	img.src = fileName;
			
}



// Выводит статистику на экран
function showStatistic(){
	console.log(statisticArray);
	var statPanel = document.getElementById('statPanel');
	var statList = document.getElementById('statList');
	statList.innerHTML = '';

	if(statPanel.classList.contains('hidden'))
		statPanel.classList.remove('hidden');

	
	for(var i=0; i< statisticArray.length; i++){
		var liStat = document.createElement('li');
		liStat.className = 'list-group-item';
		if(statisticArray[i][0] !== 'unknown'){
			var statRow = document.createTextNode(statisticArray[i][0]+': '+statisticArray[i][2]);
		}else{
			var statRow = document.createElement('span');
			statRow.style.color = '#999';
			var statRowText = statisticArray[i][1].substring(0,13)+'...: '+statisticArray[i][2];
			statRowText = document.createTextNode(statRowText);
			statRow.appendChild(statRowText);
		}
		liStat.appendChild(statRow);
		statList.appendChild(liStat);
	}
		/*
		*/
}


// Добавляет новую запись в статистику
function addStatisticRecord(){
	var name = curMantraName;
	var text = curMantraText;
	var quantity = cntMantra;
	
	if(!name)
		name = 'unknown';

	for(var i=0; i< statisticArray.length; i++){
		if(statisticArray[i][1] == text){
			console.info('Найдено соответствие');
			if(statisticArray[i][0] == 'unknown')
				statisticArray[i][0] = name;
			statisticArray[i][2] += quantity;
			// Вывод статистики на экран
			showStatistic();
			return;
		}
	}

	// Добавляю новую запись если скрипт дошел сюда
	statisticArray[statisticArray.length] = [name, text, quantity];
	// Вывод статистики на экран
	showStatistic();
}


// Конструктор. Запускает listener-ы и другие функции, которые нужно запустить сразу 
function pageConstructor(){
	loadMantraList();
	textAreaFocus();
	blurInputMode();
	toggleMode();
	rangeListen();
	playListen();
	consoleListen();
	// Кнопка стоп stop
	document.getElementById('stop').addEventListener('click', stopButtonPressed, false);
}

// при нажатии кнопки PLAY или PAUSE
function playButtonPressed(){
	manuallyStopped = false;
	if(playState == 'stop'){
		// проверка все ли данные пришли
		if(getCurrentMantraData()){
			// Смена статуса и иконки в кнопке
			playPauseToggle();
			// Очистка консоли
			document.getElementById('console').innerHTML = '';
			// подсчет целевой временной метки
			aimTimestamp = new Date().getTime() + curTimeRestriction*60*1000;
			multiRows = false;
			// запуск новой мантры
			mantraIteration();
		}
	}else if(playState == 'play'){
		// Смена статуса и иконки в кнопке
		playPauseToggle();
		playState = 'pause';
		document.getElementById('console').classList.add('pause');
		// Вычисляю сколько осталось до целевой временной метки
		leftoverTime = aimTimestamp - new Date().getTime();
		//console.log('Ставлю паузу, вешаю модальное окно');
	}else if(playState == 'pause'){
		// Смена статуса и иконки в кнопке
		playPauseToggle();
		playState = 'play';
		characterIteration();
		document.getElementById('console').classList.remove('pause');
		// Вычисляю новую целевую временную метку
		aimTimestamp = new Date().getTime() + leftoverTime;
		//console.log('Снимаю с паузы, убираю модальное окно');
	}else{
		console.warn('playState не известен');
	}
}



// Нажата кнопка STOP СТОП
function stopButtonPressed(){
	readyForBegining = false;
	playState ='stop'
	// Отправляю статистику 
	addStatisticRecord();
	
	cntMantra = 0;
	manuallyStopped = true;
	// Обнуляю все данные по текущей мантре
	curMantraName = '';
	curMantraText = '';
	curReproductionMode = '';
	curTimeRestriction = '';
	curQuantityRestriction = '';

	// Очистить console и поставить заставку . Заставка
	document.getElementById('console').innerHTML = '<img src="img/eyes.jpg" alt="фото Глаза Будды" class="img-responsive" style="margin: 0 auto; width: 390px;">';

	// Очистить шкалу прогресса, индикатор процентов и количества мантр
	document.getElementById('percent1').innerHTML = '&nbsp;';
	document.getElementById('percent2').style.width = 0 +'%';
	document.getElementById('currentCount').innerHTML = '&nbsp;';
}


// смена статуса и иконки в кнопке play
function playPauseToggle(){
	var playBtn = document.getElementById('play');
	// меняю статус playState
	if(playState == 'stop')
		playState = 'play';
	else if(playState == 'play')
		playState = 'pause';
	else if(playState == 'pause')
		playState = 'play';
	/*
	else if(playState == 'repeat')
		playState = 'pause';
	*/

	// Меняю иконку
	playBtn.firstChild.classList.toggle('glyphicon-play');
	playBtn.firstChild.classList.toggle('glyphicon-pause');
}


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
		playState = 'stop';
		// Меняю иконку
		var playBtn = document.getElementById('play');
		playBtn.firstChild.classList.toggle('glyphicon-play');
		playBtn.firstChild.classList.toggle('glyphicon-pause');
		if(!manuallyStopped){
			// Отправляю статистику 
			addStatisticRecord();
			
			cntMantra = 0;
		}
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
	if(playState !== 'stop')
		document.getElementById('console').innerHTML += curMantraText[charNum];

	if(charNum< curMantraText.length-1){
		// if playState == 'play'
		if(playState == 'play'){
			setTimeout(function(){characterIteration()}, speed);
		}
	}else{
		// Перевод на новую строку и прокрутка вниз
		if(!manuallyStopped)
			document.getElementById('console').appendChild(document.createElement('br'));
		if(multiRows){
			if(!manuallyStopped)
				document.getElementById('console').appendChild(document.createElement('br'));
		}
		// Прокрутка вниз консоли если флаг включен (выкл/вкл двойным кликом на консоли)
		if(autoScroll)
			document.getElementById('console').scrollTop = document.getElementById('console').scrollHeight;

		if(!manuallyStopped){
			cntMantra++;
		}
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
		if(!manuallyStopped){
			currentCount.innerHTML = cntMantra;
		}

	if(curReproductionMode == 'Кол-во '){
		var percentDone = cntMantra*100/curQuantityRestriction;
		document.getElementById('percent1').innerHTML = Math.floor(percentDone)+'%';
		document.getElementById('percent2').style.width = percentDone+'%';

	//	console.info(cntMantra+'<'+curQuantityRestriction);
		return cntMantra<curQuantityRestriction;
	}else if(curReproductionMode == 'Время '){
		//console.info(new Date().getTime()+'<'+ aimTimestamp);
		console.info(((aimTimestamp - new Date().getTime())*100)/100000);
		// Вычисление процентов, с учетом возможных пауз
		var x = ((aimTimestamp - new Date().getTime())*100)/(curTimeRestriction*60*1000);
		var percentValue = 100-x;
		if(percentValue>100)
			percentValue = 100;
		document.getElementById('percent1').innerHTML = Math.floor(percentValue)+'%';
		document.getElementById('percent2').style.width = percentValue+'%';

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
		//console.info('Все значения получены');
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
		readyForBegining = false;
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