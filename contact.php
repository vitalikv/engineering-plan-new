

<!DOCTYPE html>
<head>
<link rel="shortcut icon" href="/img/favicon.ico" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/reset.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/style.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/contact.css">


<title>Обратная связь</title>


</head>
<body>


<script>
document.addEventListener("DOMContentLoaded", ()=>
{

const fieldName = document.querySelector('[mess_name]');
const fieldMail = document.querySelector('[mess_mail]');
const fieldText = document.querySelector('[mess_text]');
const btnMess = document.querySelector('[btn_mess]');
const elInf = document.querySelector('[inf]');


<?// подсказка в форме ?>

const t3 = "Сообщение";

fieldText.addEventListener("focusin", (e) => 
{
	if(e.target.innerHTML.trim() === t3) { e.target.innerHTML = ''; }
});

fieldText.addEventListener("focusout", (e) => 
{
	if(e.target.innerHTML.trim() === '') { e.target.innerHTML = t3; }
});

<?// подсказка в форме ?>





<?// отправка сообщения ?>

btnMess.onmousedown = () => { sendMess(); }	


async function sendMess()
{
	const name = fieldName.value.trim();
	const mail = fieldMail.value.trim();
	const text = fieldText.innerHTML.trim();				
	
	let answer = '';
	
	if(name === '') answer += 'Укажите имя';
	if(mail === '') answer += (answer === '') ? ' Укажите почту' : ' и почту';	
	
	if(answer === '')
	{
		const response = await fetch('/components/contact.php', 
		{
			method: 'POST',
			body: 'name='+name+'&mail='+mail+'&text='+text,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },				
		});
		answer = await response.text();

		fieldName.value = '';
		fieldMail.value = '';
		fieldText.innerHTML = '';		
	}	
	
	elInf.innerHTML = answer.trim();
}
<?// отправка сообщения ?>


});
</script>


<div class="wrap">

	<div class="content">
		<div class="line_0"></div>
		
		
		<? include($_SERVER['DOCUMENT_ROOT']."/include/menu_1.php");  ?>
			
		<div class="container">
			<div class="offset_top_50"></div>
		
			<? // форма сообщения ?>
			<div forma="">			
			<div class="vrm"><input mess_name="" class="mess_inp" type="text" value="" placeholder="Имя"></div>
			<div class="vrm"><input mess_mail="" class="mess_inp" type="text" value="" placeholder="Почта"></div>
			<div class="vrm"><div mess_text="" class="mess_text" contenteditable="true" spellcheck="false">Сообщение</div></div>

			<div class="butt_enter" btn_mess="">ОТПРАВИТЬ</div>
					
			<div class="mess_inf" inf=""></div>
			
			</div>
			<? // форма сообщения ?>

			<div class="offset_top_50"></div>
			
		</div>	
	</div>

</div>



<footer>
<? include($_SERVER['DOCUMENT_ROOT']."/include/footer_1.php");  ?>
</footer>





</body>
</html>



