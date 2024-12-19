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
		const linkHref = new URL(link.href).pathname; // Убираем "./"

		console.log(linkHref, currentURL); // Проверяем, что сравниваются корректные значения

		if (linkHref === currentURL) {
			link.classList.add('active');
		} else {
			link.classList.remove('active'); // На всякий случай удаляем active с других ссылок
		}
	});
});



// Словарь оборудования
const equipmentData = {
    cpu: [
        { id: 1, name: "Intel Core i5-12400", price: 15000 },
        { id: 2, name: "Intel Core i7-12700", price: 25000 },
        { id: 3, name: "AMD Ryzen 5 5600X", price: 20000 },
        { id: 4, name: "AMD Ryzen 7 5800X", price: 30000 },
        { id: 4, name: "AMD Ryzen 7 5700", price: 25000 }
    ],
    gpu: [
        { id: 1, name: "NVIDIA RTX 4060", price: 30000 },
        { id: 2, name: "NVIDIA RTX 4070", price: 50000 },
        { id: 3, name: "AMD RX 6700 XT", price: 45000 },
        { id: 4, name: "AMD RX 7900 XTX", price: 100000 }
    ],
    mb: [
        { id: 1, name: "MSI B550M PRO-VDH", price: 8000 },
        { id: 2, name: "ASUS ROG STRIX B550-F", price: 15000 },
        { id: 3, name: "Gigabyte Z690 Aorus Elite", price: 20000 }
    ],
    psu: [
        { id: 1, name: "Corsair RM650", price: 7000 },
        { id: 2, name: "Cooler Master MWE 750", price: 8000 },
        { id: 3, name: "Seasonic Focus GX-850", price: 10000 }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const buildForm = document.getElementById('buildForm');
    const buildCards = document.getElementById('buildCards');
    const submitBuild = document.getElementById('submitBuild');
    const buildCardTemplate = document.getElementById('buildCardTemplate').content;

    const cpu = document.getElementById('cpu');
    const gpu = document.getElementById('gpu');
    const mb = document.getElementById('mb');
    const psu = document.getElementById('psu');

    // Загрузка данных из localStorage при загрузке страницы
    let savedBuilds = JSON.parse(localStorage.getItem('builds')) || [];
    
    // Определение максимального buildId из сохранённых данных
    let buildId = savedBuilds.length > 0 
        ? Math.max(...savedBuilds.map(build => parseInt(build.id.replace('Сборка ', ''), 10))) 
        : 0;

    // Функция для заполнения select элементами из equipmentData
    const populateSelectOptions = () => {
        const components = ['cpu', 'gpu', 'mb', 'psu'];
        components.forEach(component => {
            const selectElement = document.getElementById(component);
            equipmentData[component].forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.name} (${item.price.toLocaleString()} ₽)`;
                selectElement.appendChild(option);
            });
        });
    };

    populateSelectOptions();

    // Функция для отображения сохранённых сборок
    const renderSavedBuilds = () => {
        buildCards.innerHTML = '';
        savedBuilds.forEach(build => {
            createBuildCard(build);
        });
    };

    // Функция для создания карточки сборки
    const createBuildCard = (build) => {
        const card = buildCardTemplate.cloneNode(true);

        const cpuData = equipmentData.cpu.find(item => item.id === build.cpuId);
        const gpuData = equipmentData.gpu.find(item => item.id === build.gpuId);
        const mbData = equipmentData.mb.find(item => item.id === build.mbId);
        const psuData = equipmentData.psu.find(item => item.id === build.psuId);

        const totalPrice = cpuData.price + gpuData.price + mbData.price + psuData.price;

        card.querySelector('.build-card-title').textContent = `${build.id}`;
        card.querySelector('.build-card-cpu').textContent = `Процессор: ${cpuData.name}`;
        card.querySelector('.build-card-gpu').textContent = `Видеокарта: ${gpuData.name}`;
        card.querySelector('.build-card-mb').textContent = `Материнская плата: ${mbData.name}`;
        card.querySelector('.build-card-psu').textContent = `Блок питания: ${psuData.name}`;
        card.querySelector('.build-card-price').innerHTML = `<strong>Примерная цена:</strong> ${totalPrice.toLocaleString()} ₽`;
        card.querySelector('.delete-button').setAttribute('data-id', build.id);

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
            [cpu, gpu, mb, psu].forEach((element) => {
                if (!element.value) {
                    element.style.borderColor = 'red';
                } else {
                    element.style.borderColor = '';
                }
            });
            return;
        }

        // Если все поля заполнены, сбрасываем рамки
        [cpu, gpu, mb, psu].forEach((element) => {
            element.style.borderColor = '';
        });

        const build = {
            id: `Сборка ${++buildId}`,
            cpuId: parseInt(cpu.value),
            gpuId: parseInt(gpu.value),
            mbId: parseInt(mb.value),
            psuId: parseInt(psu.value)
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



document.addEventListener('DOMContentLoaded', () => {
    const commentsContainer = document.getElementById('comments');
    const preloader = document.getElementById('preloader');

    const fetchComments = () => {
        // Генерируем случайное число для выбора URL
        const randomValue = Math.random();
        const randomValue2 = Math.floor(Math.random() * 450);
        const url = randomValue < 0.5 
            ? `https://jsonplaceholder.typicode.com/comments?id_gte=${randomValue2}&_limit=10` 
            : `https://jsonplaceholder.typicode.com/comments?id_lte=${randomValue2}&_limit=10`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(comments => {
                renderComments(comments);
            })
            .catch(error => {
                commentsContainer.innerHTML = '<p>⚠ Что-то пошло не так</p>';
            })
            .finally(() => {
                preloader.style.display = 'none';
            });
    };

    const renderComments = (comments) => {
        const commentTemplate = document.getElementById('commentTemplate');
        const commentsWrapper = document.querySelector('.swiper-wrapper');
        // Очищаем контейнер с комментариями
        commentsWrapper.innerHTML = '';
        // Создаём и добавляем каждый комментарий как слайд
        comments.forEach(comment => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');

            const commentElement = commentTemplate.content.cloneNode(true);
            commentElement.querySelector('.comment-title').textContent = comment.name;
            commentElement.querySelector('.comment-body').textContent = comment.body;
            commentElement.querySelector('.comment-email').textContent = comment.email;

            slide.appendChild(commentElement);
            commentsWrapper.appendChild(slide);
        });

        // Инициализируем слайдер после добавления комментариев
        const swiper = new Swiper('.comments-section .swiper-container', {
            loop: true,
            navigation: {
                nextEl: '.comments-section .swiper-button-next',
                prevEl: '.comments-section .swiper-button-prev',
            },
            pagination: {
                el: '.comments-section .swiper-pagination',
                clickable: true,
            },
        });
    };

    fetchComments();
});
