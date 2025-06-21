<? $vrs = '=2' ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="shortcut icon" href="/img/favicon.ico" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/reset.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/style.css">

<script src="thr/js/jquery.js"></script>
<script src="thr/js/three.min.js?<?=$vrs?>"></script>
<script src="thr/js/OBJLoader.js"></script>
<script src="thr/js/MTLLoader.js"></script>

<title>Инженерный план</title>


</head>

<? require_once("include/metrikaYa.php"); ?>

<body>

<script>
$(document).ready(function(){
	

changesize_1();


$(window).resize(function(){ changesize_1(); });


function changesize_1()
{ 
	var w_win = $(document).width();
	var w_bl_1 = w_win * 0.6;
	if(w_bl_1 < (210 * 4 + 5))
	{
		var rs = (w_bl_1 - 4) / 4;
		//$('[click_img]').css("width", rs);
		$('[bl2_img]').css("width", (rs * 4 + 4));
	}
	else
	{
		//$('[click_img]').css("width", 210);
		$('[bl2_img]').css("width", (210 * 4 + 4));
	}
}


	
<? // фото ?>
$(document).on('click', '[click_img]', function () { 
var img = $(this).attr('src');
//img = /(.+)-m\./.exec(img); 
//$('[fon]').html('<img src="'+img[1]+'.jpg" class="img_big_2">');
$('[fon]').html('<img src="'+img+'" class="img_big_2">');
$(".img_big_2").bind("load",function(){ 
$('[fon]').css({"display":"block"}); 
var h_html = $(this).height();
var h_okno = $(window).height();
var h_resul = (h_okno-h_html)/2;
$(this).css("margin-top", h_resul);
});
});		
<? // фото ?>




<? // закрытие fon ?>
$(document).on('click', '.img_big_2', function () { return false; });
$(document).on('click', '[fon]', function () { $('[fon]').css({"display":"none"}); $('[fon]').html(''); $('body').css("overflow", "auto"); });
<? // закрытие fon ?>	
	
});
</script>


<div class="fon" fon=""></div> <? // фон под big img ?>


<div class="wrap" style="font-family: arial, sans-serif; color: #333; font-size: 16px;">

	<div class="content">
		<div class="line_0"></div>

		<? include($_SERVER['DOCUMENT_ROOT']."/include/menu_1.php");  ?>
		
		<div class="block_line_1">		
			<div class="offset_top_50"></div>
			<div class="t1">Строительная программа 3D онлайн</div>
			<div class="offset_top_30"></div>
			
			<div>
				<div id="scene-3d" class="youtube_1">
										
				</div>
				
				<div class="block_right_1">
					<div class="inb_1">
						<div style="padding: 20px; max-width: 600px; margin: auto;">

							<h2 style="margin-bottom: 1.2em; font-size: 24px;">
								Онлайн-планировщик дома 3D
							</h2>

							<h4 style="margin-top: 1.2em; margin-bottom: 0.5em; font-size: 1em;">
								🏡 Для кого:
							</h4>
							<ul style="padding-left: 20px; list-style-type: disc;">
								<li style="margin-bottom: 0.4em;">Для тех, кто строит дом или планирует ремонт</li>
							</ul>

							<h4 style="margin-top: 1.2em; margin-bottom: 0.5em; font-size: 1em;">
								🔍 Что можно делать:
							</h4>
							<ul style="padding-left: 20px; list-style-type: disc;">
								<li style="margin-bottom: 0.4em;">Рисовать план дома</li>
								<li style="margin-bottom: 0.4em;">Смотреть проект в 3D в режиме реального времени</li>
								<li style="margin-bottom: 0.4em;">Выбирать материалы стен, пола, крыши</li>
								<li style="margin-bottom: 0.4em;">Расставлять окна, двери и мебель</li>
								<li style="margin-bottom: 0.4em;">Сохранять и дорабатывать проект</li>
							</ul>

							<h4 style="margin-top: 1.2em; margin-bottom: 0.5em; font-size: 1em;">
								🛠 Зачем нужно:
							</h4>
							<ul style="padding-left: 20px; list-style-type: disc;">
								<li style="margin-bottom: 0.4em;">Чтобы наглядно представить будущий дом и избежать ошибок на стадии проектирования</li>
							</ul>

						</div>
						
						<a href="construction" style="display: flex; justify-content: center; align-items: center; width: 200px; height: 50px; margin: 0px auto 20px auto; border: solid 1px #b3b3b3; background: #76e199; cursor: pointer; text-decoration: none; box-shadow: 0 0 4px 0 rgba(0,0,0,0.5);">
							<div style="font-size: 26px; text-align: center; color: #fff;">
								Начать
							</div>
						</a>
						
					</div>
					
				</div>
				
				<div class="clear"></div>
			</div>		
		</div>
		
		<div class="offset_top_50"></div>
		
		<div class="block_line_2">	
			<div class="block_line_1">
				<div class="offset_top_30"></div>
				<div style="text-align: center; font-size: 24px;">Проекты:</div>
				<div class="offset_top_30"></div>
				
				<div class="modal_body_content_grid">
					<a class="ind_bl_1" href="construction?demo=1">
						<div class="block_form_1_image_wrap"><img src="/img/demo_1.jpg"></div>					
						<div class="ind_text_3">
							гараж
						</div>
					</a>
					<a class="ind_bl_1" href="construction?demo=2">
						<div class="block_form_1_image_wrap"><img src="/img/demo_2.jpg"></div>
						<div class="ind_text_3">
							одноэтажный дом
						</div>
					</a>			
					<a class="ind_bl_1" href="construction?demo=3">
						<div class="block_form_1_image_wrap"><img src="/img/demo_3.jpg"></div>
						<div class="ind_text_3">
							двухэтажный дом
						</div>
					</a>			
					<a class="ind_bl_1" href="construction?demo=4">
						<div class="block_form_1_image_wrap"><img src="/img/demo_4.jpg"></div>
						<div class="ind_text_3">
							трехэтажный дом
						</div>				
					</a>
					<a class="ind_bl_1" href="construction?demo=5">
						<div class="block_form_1_image_wrap"><img src="/img/demo_5.jpg"></div>
						<div class="ind_text_3">
							квартира
						</div>				
					</a>					
				</div>
				<div class="offset_top_50"></div>
			</div>
		</div>		
		

		
		<? if(1==2) {?>
		<div class="block_line_2">	
			<div class="block_line_1">
				<div class="offset_top_30"></div>
				<div style="text-align: center; font-size: 24px; color:#222;">Калькуляторы:</div>
				<div class="offset_top_30"></div>
				
				<div class="modal_body_content_grid">
					<a class="ind_bl_1" href="calculator/monolit_fundament">
						<div class="block_form_1_image_wrap"><img src="/img/screenshot_1.jpg"></div>					
						<div class="ind_text_3">
							монолитный фундамент
						</div>
					</a>
					<a class="ind_bl_1" href="/calculator/lentochnii_fundament">
						<div class="block_form_1_image_wrap"><img src="/img/screenshot_2.jpg"></div>
						<div class="ind_text_3">
							ленточный фундамент
						</div>
					</a>			
					<a class="ind_bl_1" href="calculator/svaynyy_fundament">
						<div class="block_form_1_image_wrap"><img src="/img/screenshot_3.jpg"></div>
						<div class="ind_text_3">
							свайный фундамент
						</div>
					</a>			
					<a class="ind_bl_1" href="calculator/ploshchad_uchastka">
						<div class="block_form_1_image_wrap"><img src="/img/screenshot_4.jpg"></div>
						<div class="ind_text_3">
							площадь участка
						</div>				
					</a>
					<a class="ind_bl_1" href="calculator/obyem_pomeshcheniya">
						<div class="block_form_1_image_wrap"><img src="/img/screenshot_5.jpg"></div>
						<div class="ind_text_3">
							объем и площадь помещения
						</div>				
					</a>	

					<a class="ind_bl_1" href="calculator/shtukaturka_na_stene">
						<div class="block_form_1_image_wrap"><img src="/img/screenshot_6.jpg"></div>					
						<div class="ind_text_3">
							расчет штукатурки на стене
						</div>
					</a>
					<a class="ind_bl_1" href="/calculator/raschet_kirpicha">
						<div class="block_form_1_image_wrap"><img src="/img/screenshot_7.jpg"></div>
						<div class="ind_text_3">
							расчет кирпича
						</div>
					</a>			
					<a class="ind_bl_1" href="calculator/raschet_blokov">
						<div class="block_form_1_image_wrap"><img src="/img/screenshot_8.jpg"></div>
						<div class="ind_text_3">
							расчет блоков
						</div>
					</a>								
				</div>
				<div class="offset_top_50"></div>
			</div>
		</div>	
		<div class="offset_top_50"></div>		
		
		
		
		

		<? } ?>		

			<div class="block_line_1">
				<div class="offset_top_50"></div>
				<div class="block_float_2">	

<section style="max-width: 800px; margin: auto; padding: 20px;">
  
  <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">
    🧮 Онлайн-калькулятор блоков
  </h2>

  <p style="font-size: 16px; color: #555; line-height: 1.6;">
    Рассчитайте точное количество строительных блоков для вашего проекта с учетом окон, дверей и других проемов.
    Сервис учитывает не только стандартные блоки, но и обрезки, которые могут быть повторно использованы.
    Это позволяет значительно снизить количество отходов и сэкономить бюджет.
  </p>

  <h3 style="color: #333; font-size: 20px; margin-top: 30px; margin-bottom: 15px;">
    ✅ Что вы получите:
  </h3>
  <ul style="list-style: none; padding-left: 20px; color: #555; font-size: 15px; line-height: 1.6;">
    <li>✔️ Общий объем необходимых блоков</li>
    <li>✔️ Количество целых блоков</li>
    <li>✔️ Использование обрезков вместо новых блоков</li>
    <li>✔️ Объем и количество оставшихся кусков</li>
    <li>✔️ Наглядные таблицы и диаграммы по каждому типу блока</li>
  </ul>

  <h3 style="color: #333; font-size: 20px; margin-top: 30px; margin-bottom: 15px;">
    🧩 Для кого?
  </h3>
  <p style="color: #555; font-size: 15px; line-height: 1.6;">
    Сервис полезен как профессионалам — архитекторам, прорабам, бригадирам, так и частным застройщикам.
    Подходит для расчета стен в жилых домах, хозпостройках и коммерческих объектах.
  </p>

  <h3 style="color: #333; font-size: 20px; margin-top: 30px; margin-bottom: 15px;">
    📊 Простота и эффективность
  </h3>
  <p style="color: #555; font-size: 15px; line-height: 1.6;">
    Загрузите данные из вашей 3D-модели или введите параметры стен, окон и дверей вручную — и получите готовый расчет всего за несколько кликов.
    Все результаты можно экспортировать в Excel или распечатать.
  </p>

</section>



					<a href="calc-blocks" style="display: flex; justify-content: center; align-items: center; width: 200px; height: 50px; margin: 50px auto 0px auto; border: solid 1px #b3b3b3; background: #76e199; cursor: pointer; text-decoration: none; box-shadow: 0 0 4px 0 rgba(0,0,0,0.5);">
						<div style="font-size: 26px; text-align: center; font-family: arial, sans-serif; color: #fff;">
							Расчет блоков
						</div>
					</a>
					
				</div>
				
				<div class="block_right_2">
					<div class="modal_body_content_grid_2" bl2_img="">
						<img src="/img/ind/screenshot(1).jpg" class="ind_bl_2" click_img="">
						<img src="/img/ind/screenshot(2).jpg" class="ind_bl_2" click_img="">
						<img src="/img/ind/screenshot(3).jpg" class="ind_bl_2" click_img="">
						<img src="/img/ind/screenshot(4).jpg" class="ind_bl_2" click_img="">
						<img src="/img/ind/screenshot(5).jpg" class="ind_bl_2" click_img="">
						<img src="/img/ind/screenshot(6).jpg" class="ind_bl_2" click_img="">		
						
						<img src="/img/ind/screenshot(7).jpg" class="ind_bl_2" click_img="">
						<img src="/img/ind/screenshot(8).jpg" class="ind_bl_2" click_img="">
						<img src="/img/ind/screenshot(9).jpg" class="ind_bl_2" click_img="">
						<img src="/img/ind/screenshot(10).jpg" class="ind_bl_2" click_img="">
						<img src="/img/ind/screenshot(11).jpg" class="ind_bl_2" click_img="">
						<img src="/img/ind/screenshot(12).jpg" class="ind_bl_2" click_img="">
						<div class="clear"></div>						
					</div>
					<div class="clear"></div>
				</div>
				
				<div class="clear"></div>
				<div class="offset_top_50"></div>
			</div>
		
		<div class="offset_top_50"></div>

		
	</div>

</div>


<footer>
<? include($_SERVER['DOCUMENT_ROOT']."/include/footer_1.php");  ?>
</footer>





<script src="thr/scene-3d.js"></script>



</body>
</html>



