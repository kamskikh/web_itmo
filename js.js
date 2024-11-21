document.addEventListener('DOMContentLoaded', () => {
	const menuButton = document.querySelector('.menu-button');
	const navbarMenu = document.querySelector('.navbar__menu');

	menuButton.addEventListener('click', () => {
		// Переключение видимости меню
		const isMenuVisible = getComputedStyle(navbarMenu).display === 'flex';
		navbarMenu.style.display = isMenuVisible ? 'none' : 'flex';
	});

	// Автоматическое скрытие меню при изменении ширины экрана
	window.addEventListener('resize', () => {
		if (window.innerWidth > 1100) {
			navbarMenu.style.display = 'flex';
		} else {
			navbarMenu.style.display = 'none';
		}
	});
});




document.addEventListener('DOMContentLoaded', () => {
	const links = document.querySelectorAll('.navbar__link');
	const currentURL = window.location.pathname;

	links.forEach(link => {
		const linkHref = link.getAttribute('href').replace(/^\.+/, ''); // Убираем "./"

		console.log(linkHref, currentURL); // Проверяем, что сравниваются корректные значения

		if (linkHref === currentURL) {
			link.classList.add('active');
		} else {
			link.classList.remove('active'); // На всякий случай удаляем active с других ссылок
		}
	});
});



document.addEventListener('DOMContentLoaded', () => {
    const buildForm = document.getElementById('buildForm');
    const buildCards = document.getElementById('buildCards');
    const submitBuild = document.getElementById('submitBuild');


	
	const cpu = document.getElementById('cpu');
	const gpu = document.getElementById('gpu');
	const mb = document.getElementById('mb');
	const psu = document.getElementById('psu');

    // Загрузка данных из localStorage при загрузке страницы
    let savedBuilds = JSON.parse(localStorage.getItem('builds')) || [];
    let buildId = savedBuilds.length;

    // Функция для отображения сохранённых сборок
    const renderSavedBuilds = () => {
        buildCards.innerHTML = '';
        savedBuilds.forEach(build => {
            createBuildCard(build);
        });
    };

    // Функция для создания карточки сборки
    const createBuildCard = (build) => {
        const card = document.createElement('div');
        card.className = 'build-card';
        card.innerHTML = `
            <h3>${build.id}</h3>
            <p>Процессор: ${build.cpu}</p>
            <p>Видеокарта: ${build.gpu}</p>
            <p>Материнская плата: ${build.mb}</p>
            <p>Блок питания: ${build.psu}</p>
            <p><strong>Примерная цена:</strong> ${build.totalPrice} ₽</p>
            <!--<button class="edit-button" data-id="${build.id}">Редактировать</button> -->
            <button class="delete-button" data-id="${build.id}">Удалить</button>
        `;
        buildCards.appendChild(card);
    };

    // Обработчик удаления сборки
    const deleteBuild = (id) => {
        savedBuilds = savedBuilds.filter(build => build.id !== id);
        localStorage.setItem('builds', JSON.stringify(savedBuilds));
        renderSavedBuilds();
    };

    // Обработчик редактирования сборки
    const editBuild = (id) => {
        const build = savedBuilds.find(build => build.id === id);
        if (build) {
            // document.getElementById('cpu').value = `${build.cpu}:${build.totalPrice / 4}`;
            // document.getElementById('gpu').value = `${build.gpu}:${build.totalPrice / 4}`;
            // document.getElementById('mb').value = `${build.mb}:${build.totalPrice / 4}`;
            // document.getElementById('psu').value = `${build.psu}:${build.totalPrice / 4}`;

            deleteBuild(id); // Удаляем сборку для обновления
        }
    };

	// Функция для сброса красной рамки
	const resetBorder = (element) => {
		element.style.borderColor = ''; // Убираем красный цвет рамки
	};

	// Добавляем обработчики событий для сброса рамки при изменении значения
	[cpu, gpu, mb, psu].forEach((element) => {
		element.addEventListener('change', () => resetBorder(element));
	});

    // Сохранение сборки
    submitBuild.addEventListener('click', () => {
	
		if (!cpu.value || !gpu.value || !mb.value || !psu.value) {
			alert('Пожалуйста, выберите все комплектующие.');
			console.log(1);
			if (!cpu.value) {
				cpu.style.borderColor = 'red';
			}
			console.log(1);
			
			if (!gpu.value) {
				gpu.style.borderColor = 'red';
			}
			console.log(!gpu.value);
			
			if (!mb.value) {
				mb.style.borderColor = 'red';
			}
			console.log(1);
			
			if (!psu.value) {
				psu.style.borderColor = 'red';
			}
			console.log(1);

			return;
		}
	

		// Если все поля заполнены, сбрасываем рамки
		[cpu, gpu, mb, psu].forEach((element) => {
			element.style.borderColor = '';
		});

		const cpuData = cpu.value.split(':');
		const gpuData = gpu.value.split(':');
		const mbData = mb.value.split(':');
		const psuData = psu.value.split(':');
	
		const totalPrice =
			parseInt(cpuData[1]) +
			parseInt(gpuData[1]) +
			parseInt(mbData[1]) +
			parseInt(psuData[1]);
	
		const build = {
			id: `Сборка ${++buildId}`,
			cpu: cpuData[0],
			gpu: gpuData[0],
			mb: mbData[0],
			psu: psuData[0],
			totalPrice: totalPrice,
		};
	
		savedBuilds.push(build);
		localStorage.setItem('builds', JSON.stringify(savedBuilds));
		createBuildCard(build);
		buildForm.reset();
	});

    // Обработчики для кнопок "Удалить" и "Редактировать"
    buildCards.addEventListener('click', (event) => {
        const id = event.target.getAttribute('data-id');
        if (event.target.classList.contains('delete-button')) {
            deleteBuild(id);
        } else if (event.target.classList.contains('edit-button')) {
            editBuild(id);
        }
    });

    // Отображение сохранённых сборок при загрузке страницы
    renderSavedBuilds();
});



(function () {
	// Подписываемся на событие полной загрузки страницы
	window.addEventListener('load', () => {
		// Получаем время загрузки страницы
		const performanceData = window.performance.timing;
		const loadTime = (performanceData.domComplete - performanceData.navigationStart) / 1000; // в секундах
		const domContentLoadedTime = (performanceData.domContentLoadedEventEnd - performanceData.navigationStart) / 1000;

		// Создаем элемент для отображения информации
		const footer = document.querySelector('footer');
		const statsDiv = document.createElement('div');
		statsDiv.style.textAlign = 'center';
		statsDiv.style.marginTop = '10px';
		statsDiv.style.fontSize = '0.9rem';
		statsDiv.style.color = '#EEE';

		// Добавляем информацию о скорости загрузки
		statsDiv.innerHTML = `<p>Страница загрузилась за <strong>${loadTime.toFixed(2)}</strong> секунд.</p><p>Dom загрузился за <strong>${domContentLoadedTime.toFixed(2)}</strong></p>`;

		// Добавляем элемент в подвал страницы
		footer.appendChild(statsDiv);
	});
})();