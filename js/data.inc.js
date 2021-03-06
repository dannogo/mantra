//Список мантр
var mantraList = {
	'Кармапа XVI':'кармапа ченно',
	'Любящие глаза':'ом мани пеме хунг',
	'Будда Амитаба':'ом ами дэва хри',
	'Алмазный Ум':'ом бэнза сато самайа|манупалая|бэнза сато тенопа|титтха дридо мэ бхава|сутокайо мэ бхава|супокайо мэ бхава|ануракто мэ бхава|сарва сиддхи мэмтрайаца|сарва карма суца мэ|цитам шрийа куру хунг|ха ха ха ха хо бхагавэн|сарва татхагата бэнза ма|мэ мюнца бензи бхава|маха самайо сато а',
	'Будда Медицины':'тадьятха ом беканзе беканзе маха беканзе рандза самутгатэ соха',
	'Будда Амитаюс':'ом намо бхагавате|апарамита айур джана|субини ци та тендзо рандзая татхагатая|архате самьяк сам буддхая тейата|ом пунье пунье маха пунье|апаримита пунье апаримита пунье|джяна сам бхаро па ци те ом сарва|самскара пари шуддха дхарма те гагана|самутгате собхава бишуддхе маха|на йа пари варе соха'	
};


// Цвета
var danger = "#d2322d";
var success = "#5cb85c";
var info = "#31708f";
var warning = "#f5821f";

// Переменные для временного хранения данных о колличестве раз и минут в разных режимах
var minutes;
var times;

// Переменная для скорости отрисовки. Меняется ползунком в панели управления
var speed;


// Данные о текущей мантре, режиме и ограничениям
var curMantraName;
var curMantraText;
var curReproductionMode;
var curTimeRestriction;
var curQuantityRestriction;

// Флаг паузы DEPRECATED
var pause = false;
var manuallyStopped = false;

// Вместо флага pause. Возможные значения: stop, play, pause
var playState = 'stop';

// Показывает есть ли все данные для работы
var readyForBegining = false;

//счетчик мантры
var cntMantra = 0;
// Номер буквы в мантре
var charNum;

// Флаг показывающий одно или много строчная мантра. Для выставления дополнительного <br>
var multiRows = false;
// Для timestamp назначения (ограничения)
var aimTimestamp;

// Флаг прокрутки консоли
var autoScroll = true;

// Время оставшееся до окончания воспроизведения. Для реализации паузы
var leftoverTime;

// Массива для статистики
var statisticArray = [];