// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');

// Подключаем Browsersync
const browserSync = require('browser-sync').create();

// Подключаем gulp-concat
const concat = require('gulp-concat');

// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

// Подключаем модули gulp-sass
const sass = require('gulp-sass')(require('sass'));

// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');

// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');

// Подключаем gulp-imagemin для работы с изображениями
const imagemin = require('gulp-imagemin');

// Подключаем gulp-htmlmin для минимизации файла html
const htmlmin = require('gulp-htmlmin');

// Подключаем модуль gulp-newer
const newer = require('gulp-newer');

// Подключаем модуль del
const del = require('del');

// Определяем логику работы Browsersync
function browsersync() {
	browserSync.init({
		// Инициализация Browsersync
		server: { baseDir: 'src/' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true, // Режим работы: true или false
	});
}

function scripts() {
	return src([
		// Берём файлы из источников
		'node_modules/jquery/dist/jquery.min.js',
		'src/js/jquery-ui.js',
		'src/js/jquery.validate.js',
		'src/js/slick.js',
		'src/js/script.js', // Пользовательские скрипты, использующие библиотеки, должны быть подключены в конце
	])
		.pipe(concat('script.min.js')) // Конкатенируем в один файл
		.pipe(uglify()) // Сжимаем JavaScript
		.pipe(dest('src/js/')) // Выгружаем готовый файл в папку назначения
		.pipe(browserSync.stream()); // Триггерим Browsersync для обновления страницы
}

function styles() {
	return src('src/sass/**/*.+(scss|sass)') // Выбираем источник
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.min.css')) // Конкатенируем в файл style.min.css
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } /* , format: 'beautify' */ })) // Минифицируем стили
		.pipe(dest('src/css/')) // Выгрузим результат в папку "src/css/"
		.pipe(browserSync.stream()); // Сделаем инъекцию в браузер
}

function html() {
	return src('src/**/*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest('dist/'));
}

function images() {
	return src('src/images/**/*') // Берём все изображения из папки источника
		.pipe(imagemin()) // Сжимаем и оптимизируем изображеня
		.pipe(dest('dist/images/')); // Выгружаем оптимизированные изображения в папку назначения
}

function cleanimg() {
	return del('dist/images/**/*', { force: true }); // Удаляем всё содержимое папки "dist/images/"
}

function buildcopy() {
	return src(
		[
			// Выбираем нужные файлы
			'src/css/**/*.min.css',
			'src/js/**/*.min.js',
			'src/icons/**/*',
		],
		{ base: 'src' }
	) // Параметр "base" сохраняет структуру проекта при копировании
		.pipe(dest('dist')); // Выгружаем в папку с финальной сборкой
}

function cleandist() {
	return del('dist/**/*', { force: true }); // Удаляем всё содержимое папки "dist/"
}

function startwatch() {
	// Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
	watch(['src/**/*.js', '!src/**/*.min.js'], scripts);

	// Мониторим файлы препроцессора на изменения
	watch('src/sass/**/*.+(scss|sass|css)', styles);

	// Мониторим файлы HTML на изменения
	watch('src/**/*.html').on('change', browserSync.reload);
}

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспорт функции images() в таск images
exports.images = images;

// Экспортируем функцию cleanimg() как таск cleanimg
exports.cleanimg = cleanimg;

// Экспортируем функцию html() как таск html
exports.html = html;

exports.cleandist = cleandist;

// Создаём новый таск "build", который последовательно выполняет нужные операции
exports.build = series(cleandist, html, styles, scripts, images, buildcopy);

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, scripts, browsersync, startwatch);
