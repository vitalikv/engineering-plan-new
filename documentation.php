

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="shortcut icon" href="/img/favicon.ico" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/reset.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/style.css?1">
<style>body { overflow: auto }</style>


<title>Инструкция</title>


</head>

<? require_once("include/metrikaYa.php"); ?>


<body>




<script>
document.addEventListener("DOMContentLoaded", ()=>
{
	const elems = document.querySelectorAll('[lesson]');
	const wrapV = document.querySelector('[nameId="wrapV"]');	

	elems.forEach((el)=> 
	{
		const id = el.getAttribute('lesson');		
		el.addEventListener('mousedown', (e) => { showLesson(id); });
	});
	
	wrapV.onmousedown = () => { hideLesson(); }
	
	function showLesson(id)
	{
		let video = '';

		if(id === '1'){ video = "https://rutube.ru/play/embed/7ac5775c54e7381f9ac01fb137aad92e"; }
		else if(id === '2'){ video = "https://rutube.ru/play/embed/1d999522d60e27e277481dc9eaf8fbd8"; }
		else if(id === '3'){ video = "https://rutube.ru/play/embed/9dc47b58bdddcf0b5d989e35a83ab715"; }
		else if(id === '4'){ video = "https://rutube.ru/play/embed/ab06bd1e538c225b483d7a23558a7844"; }
		else if(id === '5'){ video = "https://rutube.ru/play/embed/b60599b5d2bbb65e5f65342fbcd5dbc3"; }
		
		if(video === '') return;
		
		wrapV.innerHTML = 
		'<div class="img_big_2" nameId="wrapC"><iframe width="100%" height="100%" src="'+ video + '" frameBorder="0" allowFullScreen></iframe></div>';
		
		wrapV.style.display = 'block';

		const ratio = window.innerWidth * 0.7;
		
		const wrapC = wrapV.querySelector('[nameId="wrapC"]');
		wrapC.style.width = ratio + 'px';
		wrapC.style.height = ratio / 1.6666 + 'px';
		wrapC.style.marginTop = (window.innerHeight - ratio / 1.6666) / 2 + 'px';

		wrapC.onmousedown = () => { e.stopPropagation(); }
	}
	
	function hideLesson()
	{
		wrapV.style.display = 'none';
		wrapV.innerHTML = '';
	}
});
</script>


<div class="fon" nameId="wrapV"></div>



<div class="wrap">

	<div class="content">
		<div class="line_0"></div>

		<? include($_SERVER['DOCUMENT_ROOT']."/include/menu_1.php");  ?>
		
		<div class="block_line_1">
			<div class="offset_top_50"></div>
			<div class="t1">Инструкция</div>
			<div class="offset_top_30"></div>
			
			<div class="docum">
				<div class="docum_a" lesson="1">1. Обзор программы</div><br>
				<div class="docum_a" lesson="2">2. Построение стен</div><br>
				<div class="docum_a" lesson="3">3. Окна двери</div><br>
				<div class="docum_a" lesson="4">4. Добавление этажей</div><br>
				<div class="docum_a" lesson="5">5. Крыша</div><br>
			</div>
			
			<div class="docum_line"></div>
			<div class="docum_teh" style="display: none;">
				<b>Техническая поддержка:</b> <br>  
				Если есть вопросы по работе с программой, пишите на почту <b>engineering-plan@mail.ru</b>
			</div>
		</div>
		<div class="offset_top_30"></div>
	</div>

</div>




<footer>
<? include($_SERVER['DOCUMENT_ROOT']."/include/footer_1.php");  ?>
</footer>




</body>
</html>



