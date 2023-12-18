

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="shortcut icon" href="/img/favicon.ico" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/reset.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/style.css">
<link rel="stylesheet" media="screen" type="text/css" title="Style" href="/css/buy.css">
<script src="/js/jquery.js"></script>


<title>Оформить подписку</title>


</head>

<? require_once("include/metrikaYa.php"); ?>

<body>


<script>
$(document).ready(function(){			


$('[button_order]').click(function(){  

	<? if(1==1){ ?>
	$.ajax({
		type: "POST",					
		url: '/components/buy_1.php',
		data: {"name":"name", "mail":"9455469@mail.ru", "pay_method":"pay_method"},
		success: function(data){  

			console.log(222, data);

			if(data != '-1')
			{
				$("input[name='label']").val(data.trim());

				$('[form_post]').submit();
			}

		}
	});
	<?} ?>

});

	
<?// проверка, пустое поле или нет (если пустое == true) ?>		
function empty(mixed_var) { return ( mixed_var === "" || mixed_var === 0   || mixed_var === "0" || mixed_var === null  || mixed_var === false || mixed_var === "undefined" ); }

		
});
</script>



<div class="wrap">

	<div class="content">
		<div class="line_0"></div>

		<? include($_SERVER['DOCUMENT_ROOT']."/include/menu_1.php");  ?>
		
		<div class="block_line_1">
		
			<div class="offset_top_50"></div>
			<div class="t1">Оформить подписку</div>
			<div class="offset_top_30"></div>
			<div class="bl_buy_1">
				<div class="bl_buy_1_1">
					Чтобы оформить подписку, вам необходимо воспользоваться формой заказа.<br><br>  
					После оплаты, на указанную вами электронную почту придет письмо со ссылкой на программу.<br><br>  
					
					<b> Техническая поддержка:</b> <br>  
					Если есть вопросы после покупки программы, пишите на почту <b>engineering-plan@mail.ru</b>
				</div>
			</div>
			
			
			<div class="form_order_1">
				<div class="fd_1">Форма заказа</div>
				<div class="offset_top_30"></div>
				
				<div class="form_order_1_1">
					<div class="fd_2">Сумма</div>
					<div class="fd_2"></div>
				</div>
				
				<div class="form_order_1_2">
					<div class="fd_3"><div class="fd_3_1">20 руб.</div></div>
					
					<div class="clear"></div>
					
					<div class="button_order" button_order="">На месяц</div>
					<div class="offset_top_30"></div>					
				</div>	
				<div class="clear"></div>
			</div>
			
			<div class="clear"></div>
			
		</div>
		<div class="offset_top_50"></div>
			
		
		<form style="display:none;" form_post="" method="POST" action="https://yoomoney.ru/quickpay/confirm" <!--target="_blank" -->>
			<input type="hidden" name="receiver" value="41001994824535">
			<input type="hidden" name="label" value="">
			<input type="hidden" name="quickpay-form" value="button">
			<input type="hidden" name="sum" value="20" data-type="number">							
		</form>			
		

	</div>

</div>




<footer>
<? include($_SERVER['DOCUMENT_ROOT']."/include/footer_1.php");  ?>
</footer>




</body>
</html>



