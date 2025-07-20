<div nameid="background_main_menu" style="display: flex; position: fixed; inset: 0px; background-color: rgba(0, 0, 0, 0.5); font-family: arial, sans-serif; color: rgb(102, 102, 102); z-index: 100;">
			<div nameid="window_main_menu" style=" 
		position: relative;
		margin: auto;
		width: 900px;
		height: 600px;			
		background: white;
		box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;">
				<div nameid="button_close_main_menu" style="
		position: absolute;
		width: 20px;
		height: 20px;
		top: 10px;
		right: 10px;
		transform: rotate(-45deg);
		font-size: 30px;
		text-align: center;
		text-decoration: none;
		line-height: 0.6em;
		color: #666;
		cursor: pointer;">
					+
				</div>
				<div style="
		height: 40px;
		background: #e8e8e8;
		border-bottom: 2px solid #f2f2f2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 30px;">
					<div style="		
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 29px;
		margin-top: 0.3em;
		padding-left: 20px;
		font-size: 18px;
		color: #666;">
						Меню
					</div>					
				</div>
				<div nameid="body" style="
		position: relative;
		flex-grow: 1;
		display: flex;
		overflow: auto;
		height: 100%;">
					<div><div style="
		display: flex;
		flex-direction: column;">
			<a href="/" style=" 
		margin: 5px 20px;
		padding: 5px 0;
		width: 150px;
		font-size: 15px;
		color: #666;
		text-decoration: none;
		text-align: center;
		border: 1px solid #b3b3b3;
		background: #f1f1f1;
		cursor: pointer;
		user-select: none; margin-top: 20px;">На главную</a>
			<div nameid="btnInfo" style=" 
		margin: 5px 20px;
		padding: 5px 0;
		width: 150px;
		font-size: 15px;
		color: #666;
		text-decoration: none;
		text-align: center;
		border: 1px solid #b3b3b3;
		background: #f1f1f1;
		cursor: pointer;
		user-select: none;">О программе</div>
			<div nameid="btnInstruction" style=" 
		margin: 5px 20px;
		padding: 5px 0;
		width: 150px;
		font-size: 15px;
		color: #666;
		text-decoration: none;
		text-align: center;
		border: 1px solid #b3b3b3;
		background: #f1f1f1;
		cursor: pointer;
		user-select: none;">Инструкция</div>
			<div nameid="btnDemo" style=" 
		margin: 5px 20px;
		padding: 5px 0;
		width: 150px;
		font-size: 15px;
		color: #666;
		text-decoration: none;
		text-align: center;
		border: 1px solid #b3b3b3;
		background: #f1f1f1;
		cursor: pointer;
		user-select: none;">Демо проекты</div>			
		</div></div>
					<div style="flex: 1 1 100%; flex-direction: column;"><div style="display: none;"> 
			<div style="display: flex; 
		align-items: center;
		justify-content: center;
		height: 50px;
		font-size: 17px;
		color: #666;"><strong>3D калькулятор блоков с учетом обрезков</strong></div>

<section style="
  max-width: 900px;
  margin: 10px auto;
  padding: 0 30px 30px 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  color: #333;">

  <p style="
    font-size: 16px;
    line-height: 1.7;
    color: #555;
    margin-bottom: 20px;">
    Онлайн-сервис для точного расчета строительных блоков при возведении стен, с учётом окон, дверей и других проёмов.
    Сервис учитывает не только стандартные блоки, но и возможность повторного использования обрезков.
  </p>

  <!-- Таблица: Возможности -->
  <h3 style="display: flex; 
		align-items: center;
		justify-content: center;
		height: 50px;
		font-size: 17px;
		color: #666;">
    Основные возможности
  </h3>
  <table style="
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
    font-size: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
    
    <thead style="background-color: #f2f2f2; color: #333;">
      <tr>
        <th style="padding: 12px; border-right: 1px solid #ddd; text-align: left;">Возможность</th>
        <th style="padding: 12px; text-align: left;">Описание</th>
      </tr>
    </thead>

    <tbody style="color: #555;">
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📐 Расчёт по проектным данным</strong></td>
        <td style="padding: 12px;">Ввод размеров стен, окон, дверей</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>🧱 Поддержка нескольких типов блоков</strong></td>
        <td style="padding: 12px;">Например: 0.6×0.3×0.3 м, 0.5×0.3×0.25 м и др.</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>✂️ Учет обрезанных блоков</strong></td>
        <td style="padding: 12px;">При резке блока остаётся кусок — он может быть использован в другом месте</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>♻️ Повторное использование обрезков</strong></td>
        <td style="padding: 12px;">Сервис старается использовать остатки вместо новых блоков</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📊 Отчет по каждому типу блока</strong></td>
        <td style="padding: 12px;">Сколько взято, сколько использовано полностью, из обрезков, осталось</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📈 Круговая диаграмма</strong></td>
        <td style="padding: 12px;">Визуализация использования объёмов (полностью / из обрезков / остатки)</td>
      </tr>
      <!--<tr>
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📄 Экспорт данных</strong></td>
        <td style="padding: 12px;">Таблицы и диаграммы можно сохранить в PDF или Excel</td>
      </tr>-->
    </tbody>
  </table>

  <!-- Таблица: Преимущества -->
  <h3 style="display: flex; 
		align-items: center;
		justify-content: center;
		height: 50px;
		font-size: 17px;
		color: #666;">
    Преимущества сервиса
  </h3>
  <table style="
    width: 100%;
    border-collapse: collapse;
    font-size: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);">

    <thead style="background-color: #f2f2f2; color: #333;">
      <tr>
        <th style="padding: 12px; border-right: 1px solid #ddd; text-align: left;">Преимущество</th>
        <th style="padding: 12px; text-align: left;">Почему это важно</th>
      </tr>
    </thead>

    <tbody style="color: #555;">
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📉 Снижение отходов</strong></td>
        <td style="padding: 12px;">За счет учета обрезков и их повторного использования</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>💰 Экономия бюджета</strong></td>
        <td style="padding: 12px;">Меньше закупок, меньше отходов — ниже общая стоимость проекта</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📦 Гибкость</strong></td>
        <td style="padding: 12px;">Работа с разными типами блоков</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>🖥️ Онлайн-доступ</strong></td>
        <td style="padding: 12px;">Не нужно устанавливать программу — работает в браузере</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📊 Наглядность</strong></td>
        <td style="padding: 12px;">Таблицы + диаграммы показывают результаты сразу</td>
      </tr>
    </tbody>
  </table>

  <!-- Информационный блок -->
  <div style="
    margin-top: 30px;
    padding: 15px 20px;
    background-color: #ecf7ff;
    border-left: 5px solid #4e79a7;
    font-size: 15px;
    color: #333;">
    💡 Сервис рассчитает не только количество, но и объемы: целые блоки, обрезки, использованные из остатков, и непримененные куски.
  </div>

</section>

		</div><div style="">
    <div style="display: flex; 
		align-items: center;
		justify-content: center;
		height: 50px;
		font-size: 17px;
		color: #666;">
        <strong>Инструкция</strong>
    </div>

    <section nameid="content" style="color: #444; padding: 0 25px 25px; max-width: 800px; margin: auto; line-height: 1.6;">

        <div style="margin-top: 15px; border-bottom: 1px solid #e1e1e1; padding-bottom: 15px;">
            <div style="font-weight: 600; color: #333; font-size: 17px; margin-bottom: 12px; display: flex; align-items: center;">
                <span style="background: #505050; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">1</span>
                Создание проекта
            </div>
            <ul style="padding-left: 20px; margin: 10px 0 0 0;">
                <li style="margin-bottom: 6px;">Перейдите во вкладку <strong style="color: #404040;">«Планировка»</strong></li>
                <li>Создайте схему помещения или здания</li>
            </ul>

			<div style="margin-top: 10px; background: #f5f5f5; padding: 10px 10px 10px 20px; border-left: 4px solid #505050;">
				<a href="/documentation" style="cursor: pointer; color: #075cff; text-decoration: none;" target="_blank">
					Видеоинструкция по проектированию дома
				</a>
			</div>			
        </div>

        <div style="text-align: center; margin: 20px 0; background: #fafafa; padding: 15px; border: 1px solid #eaeaea;">
            <img nameid="" src="/p2/img/widgets/blocks/menu/1.jpg" style="max-width: 100%; height: auto; cursor: pointer;">
            <div style="font-size: 13px; color: #777; margin-top: 8px;">Рис. 1 - Интерфейс модуля планировки</div>
        </div>

        <div style="margin-top: 25px; border-bottom: 1px solid #e1e1e1; padding-bottom: 15px;">
            <div style="font-weight: 600; color: #333; font-size: 17px; margin-bottom: 12px; display: flex; align-items: center;">
                <span style="background: #505050; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">2</span>
                Переход к расчету блоков
            </div>
            <ul style="padding-left: 20px; margin: 10px 0 0 0;">
                <li>После создания проекта выберите в меню вкладку <strong style="color: #404040;">«Расчет блоков»</strong></li>
            </ul>
        </div>

        <div style="margin-top: 25px; border-bottom: 1px solid #e1e1e1; padding-bottom: 15px;">
            <div style="font-weight: 600; color: #333; font-size: 17px; margin-bottom: 12px; display: flex; align-items: center;">
                <span style="background: #505050; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">3</span>
                Настройка параметров
            </div>
            <ul style="padding-left: 20px; margin: 10px 0 0 0;">
                <li style="margin-bottom: 6px;">В правой панели откройте вкладку <strong style="color: #404040;">«Настройки»</strong>:</li>
                <ul style="padding-left: 20px; margin: 5px 0;">
                    <li style="margin-bottom: 5px;">Укажите типоразмеры блоков (единые для всех стен или индивидуальные)</li>
                    <li>Задайте толщину растворного шва (учитывается для всех стен)</li>
                </ul>
            </ul>
        </div>

        <div style="text-align: center; margin: 20px 0; background: #fafafa; padding: 15px; border: 1px solid #eaeaea;">
            <img nameid="" src="/p2/img/widgets/blocks/menu/2.jpg" style="max-width: 100%; height: auto; cursor: pointer;">
            <div style="font-size: 13px; color: #777; margin-top: 8px;">Рис. 2 - Панель параметров расчета</div>
        </div>

        <div style="margin-top: 25px; border-bottom: 1px solid #e1e1e1; padding-bottom: 15px;">
            <div style="font-weight: 600; color: #333; font-size: 17px; margin-bottom: 12px; display: flex; align-items: center;">
                <span style="background: #505050; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">4</span>
                Выполнение расчета
            </div>
            <ul style="padding-left: 20px; margin: 10px 0 0 0;">
                <li style="margin-bottom: 6px;">Перейдите во вкладку <strong style="color: #404040;">«Расчет»</strong></li>
                <li style="margin-bottom: 6px;">Нажмите кнопку <strong style="color: #404040;">«Рассчитать»</strong></li>
                <li>Система визуализирует блоки в 3D-модели</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 20px 0; background: #fafafa; padding: 15px; border: 1px solid #eaeaea;">
            <img nameid="" src="/p2/img/widgets/blocks/menu/3.jpg" style="max-width: 100%; height: auto; cursor: pointer;">
			<img nameid="" src="/p2/img/widgets/blocks/menu/4.jpg" style="max-width: 100%; height: auto; cursor: pointer;">
            <div style="font-size: 13px; color: #777; margin-top: 8px;">Рис. 3 - Визуализация результатов расчета</div>
        </div>

        <div style="margin-top: 25px;">
            <div style="font-weight: 600; color: #333; font-size: 17px; margin-bottom: 12px; display: flex; align-items: center;">
                <span style="background: #505050; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">5</span>
                Анализ результатов
            </div>
            <ul style="padding-left: 20px; margin: 10px 0 0 0;">
                <li style="margin-bottom: 6px;">Для детальной информации нажмите <strong style="color: #404040;">«Статистика»</strong>:</li>
                <ul style="padding-left: 20px; margin: 5px 0;">
                    <li style="margin-bottom: 5px;">Таблицы с количеством блоков по категориям</li>
                    <li>Графики и дополнительные метрики расхода материалов</li>
                </ul>
            </ul>
        </div>

        <div style="text-align: center; margin: 20px 0; background: #fafafa; padding: 15px; border: 1px solid #eaeaea;">
            <img nameid="" src="/p2/img/widgets/blocks/menu/5.jpg" style="max-width: 100%; height: auto; cursor: pointer;">
            <div style="font-size: 13px; color: #777; margin-top: 8px;">Рис. 4 - Детальная статистика материалов</div>
        </div>

        <div style="margin-top: 30px; background: #f5f5f5; padding: 20px; border-radius: 2px; text-align: center; border-left: 4px solid #505050;">
            <div style="font-weight: 600; color: #333; font-size: 16px;">Расчет завершен</div>
            <p style="margin: 10px 0 0; color: #555;">Теперь вы можете использовать точные данные для закупки материалов и строительства</p>
        </div>

    </section>
</div><div style="display: none;"> 
			<div style="display: flex; 
		align-items: center;
		justify-content: center;
		height: 50px;
		font-size: 17px;
		color: #666;"><strong>Демо проекты</strong></div>
			<div nameid="content" style="width: 700px;
		height: 400px;">
				<div nameid="wrapDemo" style="width: 100%; height: 100%; display: grid; 
		grid-template-columns: auto auto auto;
		justify-content: center;
		align-items: center;"></div>
			</div>
		</div></div>
				</div>
				<div style="	
		height: 10px;
		min-height: 10px;
		background: #e8e8e8;
		border-top: 2px solid #f2f2f2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 30px;"></div>
			</div>				
		</div>