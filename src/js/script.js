$(function () {
	// Активируем календарь для поля Date формы выбора тура
	$('#date').datepicker({
		dateFormat: 'dd.mm.yy',
	});

	// Делаем валидацию формы выбора тура
	$('#selection-form').validate({
		rules: {
			Location: 'required',
			Activity: 'required',
			Grade: 'required',
			Date: 'required',
		},
		messages: {
			Location: 'Choose location, please!',
			Activity: 'Choose activity, please!',
			Grade: 'Choose grade, please!',
			Date: 'Choose date, please!',
		},
	});

	// Подключаем Slick-slider
	$('.testimonials__slider').slick({
		infinite: false,
		speed: 500,
		fade: true,
		cssEase: 'linear',
	});
});
