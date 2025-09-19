// Инициализация данных
const profiles = [
    {
        id: 1,
        name: "Анна Петрова",
        age: 28,
        location: "Москва",
        interests: ["Путешествия", "Кино", "Искусство"],
        gender: "Женский",
        online: true,
        lastOnline: "Только что"
    },
    {
        id: 2,
        name: "Иван Сидоров",
        age: 32,
        location: "Санкт-Петербург",
        interests: ["Спорт", "Музыка", "Книги"],
        gender: "Мужской",
        online: false,
        lastOnline: "2 часа назад"
    },
    {
        id: 3,
        name: "Мария Иванова",
        age: 25,
        location: "Казань",
        interests: ["Книги", "Кино", "Путешествия"],
        gender: "Женский",
        online: true,
        lastOnline: "Только что"
    },
    {
        id: 4,
        name: "Алексей Козлов",
        age: 30,
        location: "Новосибирск",
        interests: ["Спорт", "Автомобили", "Технологии"],
        gender: "Мужской",
        online: false,
        lastOnline: "1 день назад"
    },
    {
        id: 5,
        name: "Екатерина Смирнова",
        age: 29,
        location: "Екатеринбург",
        interests: ["Искусство", "Музыка", "Танцы"],
        gender: "Женский",
        online: false,
        lastOnline: "5 часов назад"
    },
    {
        id: 6,
        name: "Дмитрий Волков",
        age: 35,
        location: "Москва",
        interests: ["Бизнес", "Инвестиции", "Спорт"],
        gender: "Мужской",
        online: true,
        lastOnline: "Только что"
    },
    {
        id: 7,
        name: "Ольга Новикова",
        age: 26,
        location: "Нижний Новгород",
        interests: ["Фотография", "Путешествия", "Еда"],
        gender: "Женский",
        online: false,
        lastOnline: "3 дня назад"
    },
    {
        id: 8,
        name: "Артем Федоров",
        age: 31,
        location: "Санкт-Петербург",
        interests: ["Программирование", "Гейминг", "Наука"],
        gender: "Мужской",
        online: true,
        lastOnline: "Только что"
    }
];

// Генерация случайных аватарок
const getRandomAvatar = (id) => {
    const colors = ['#ff4b7d', '#8e44ad', '#3498db', '#2ecc71', '#e67e22', '#1abc9c'];
    return colors[id % colors.length];
};

// Инициализация сообщений
let messages = JSON.parse(localStorage.getItem('datingMessages')) || {};

// Инициализация эмодзи
const emojis = ['❤️', '😊', '😂', '😍', '🤔', '😎', '👍', '👋', '🎉', '💕', '😘', '🥰', '😁', '😢', '😡', '🤯'];

// Отображение профилей
function renderProfiles(profilesToRender) {
    const container = document.getElementById('profilesContainer');
    container.innerHTML = '';
    
    profilesToRender.forEach(profile => {
        const profileElement = document.createElement('div');
        profileElement.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
        profileElement.innerHTML = `
            <div class="profile-card">
                <div class="profile-img" style="background-color: ${getRandomAvatar(profile.id)};"></div>
                <div class="profile-info">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="profile-name">${profile.name}</div>
                        <div class="profile-age">${profile.age}</div>
                    </div>
                    <div class="profile-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${profile.location}
                    </div>
                    <div class="interests">
                        ${profile.interests.map(interest => `<span class="interest-badge">${interest}</span>`).join('')}
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <div>
                            <small class="text-muted">${profile.online ? '<span class="pulse-online"></span> Онлайн' : `Был(а) ${profile.lastOnline}`}</small>
                        </div>
                        <span class="badge bg-light text-dark">${profile.gender}</span>
                    </div>
                    <button class="btn btn-message mt-3" data-id="${profile.id}">
                        <i class="far fa-envelope me-2"></i>Написать
                    </button>
                </div>
            </div>
        `;
        container.appendChild(profileElement);
    });
    
    // Добавляем обработчики событий для кнопок сообщений
    document.querySelectorAll('.btn-message').forEach(button => {
        button.addEventListener('click', function() {
            const profileId = this.getAttribute('data-id');
            openMessageModal(profileId);
        });
    });
}

// Фильтрация профилей
function filterProfiles() {
    const nameFilter = document.getElementById('filterName').value.toLowerCase();
    const ageMin = parseInt(document.getElementById('filterAgeMin').value) || 18;
    const ageMax = parseInt(document.getElementById('filterAgeMax').value) || 99;
    const cityFilter = document.getElementById('filterCity').value;
    const interestsFilter = document.getElementById('filterInterests').value;
    const genderFilter = document.getElementById('filterGender').value;
    const statusFilter = document.getElementById('filterStatus').value;
    
    const filteredProfiles = profiles.filter(profile => {
        const matchesName = profile.name.toLowerCase().includes(nameFilter);
        const matchesAge = profile.age >= ageMin && profile.age <= ageMax;
        const matchesCity = cityFilter === '' || profile.location === cityFilter;
        const matchesInterests = interestsFilter === '' || profile.interests.includes(interestsFilter);
        const matchesGender = genderFilter === '' || profile.gender === genderFilter;
        
        let matchesStatus = true;
        if (statusFilter === 'Онлайн') {
            matchesStatus = profile.online;
        } else if (statusFilter === 'Недавно онлайн') {
            matchesStatus = !profile.online && profile.lastOnline.includes('час') || profile.lastOnline.includes('минут');
        }
        
        return matchesName && matchesAge && matchesCity && matchesInterests && matchesGender && matchesStatus;
    });
    
    renderProfiles(filteredProfiles);
}

// Открытие модального окна сообщений
function openMessageModal(profileId) {
    const profile = profiles.find(p => p.id == profileId);
    if (!profile) return;
    
    document.getElementById('messageUserName').textContent = profile.name;
    document.getElementById('messageUserStatus').innerHTML = profile.online 
        ? '<span class="pulse-online"></span> Онлайн' 
        : `Был(а) ${profile.lastOnline}`;
    
    // Загрузка сообщений
    loadMessages(profileId);
    
    // Показать модальное окно
    document.getElementById('messageModal').style.display = 'block';
    
    // Сохраняем текущий открытый профиль
    document.getElementById('messageModal').setAttribute('data-current-profile', profileId);
}

// Загрузка сообщений
function loadMessages(profileId) {
    const messageBody = document.getElementById('messageBody');
    messageBody.innerHTML = '';
    
    // Получаем сообщения для этого профиля
    const profileMessages = messages[profileId] || [];
    
    if (profileMessages.length === 0) {
        messageBody.innerHTML = `
            <div class="d-flex flex-column align-items-center justify-content-center h-100">
                <i class="fas fa-comments fa-4x mb-3 text-muted"></i>
                <h5>Начните общение</h5>
                <p class="text-center text-muted">Отправьте первое сообщение и начните знакомство</p>
            </div>
        `;
        return;
    }
    
    // Отображаем сообщения
    profileMessages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${msg.sent ? 'sent' : 'received'}`;
        
        // Форматируем время
        const time = new Date(msg.timestamp);
        const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <div class="message-text">${msg.text}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        messageBody.appendChild(messageElement);
    });
    
    // Прокрутка вниз
    messageBody.scrollTop = messageBody.scrollHeight;
}

// Отправка сообщения
function sendMessage() {
    const input = document.getElementById('messageInput');
    const messageText = input.value.trim();
    
    if (!messageText) return;
    
    const profileId = document.getElementById('messageModal').getAttribute('data-current-profile');
    
    if (!messages[profileId]) {
        messages[profileId] = [];
    }
    
    // Добавляем новое сообщение
    const newMessage = {
        text: messageText,
        sent: true,
        timestamp: Date.now()
    };
    
    messages[profileId].push(newMessage);
    
    // Сохраняем в localStorage
    localStorage.setItem('datingMessages', JSON.stringify(messages));
    
    // Обновляем сообщения
    loadMessages(profileId);
    
    // Очищаем поле ввода
    input.value = '';
    
    // Закрываем панель эмодзи, если открыта
    document.getElementById('emojiPicker').style.display = 'none';
}

// Инициализация панели эмодзи
function initEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');
    emojiPicker.innerHTML = '';
    
    emojis.forEach(emoji => {
        const emojiElement = document.createElement('span');
        emojiElement.className = 'emoji-item';
        emojiElement.textContent = emoji;
        emojiElement.addEventListener('click', function() {
            document.getElementById('messageInput').value += emoji;
        });
        emojiPicker.appendChild(emojiElement);
    });
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    // Первоначальная отрисовка профилей
    renderProfiles(profiles);
    
    // Инициализация панели эмодзи
    initEmojiPicker();
    
    // Настройка обработчиков событий для фильтров
    document.querySelectorAll('#filterName, #filterAgeMin, #filterAgeMax, #filterCity, #filterInterests, #filterGender, #filterStatus').forEach(element => {
        element.addEventListener('input', filterProfiles);
        element.addEventListener('change', filterProfiles);
    });
    
    // Сброс фильтров
    document.getElementById('resetFilters').addEventListener('click', function() {
        document.getElementById('filterName').value = '';
        document.getElementById('filterAgeMin').value = '';
        document.getElementById('filterAgeMax').value = '';
        document.getElementById('filterCity').value = '';
        document.getElementById('filterInterests').value = '';
        document.getElementById('filterGender').value = '';
        document.getElementById('filterStatus').value = '';
        filterProfiles();
    });
    
    // Закрытие модального окна сообщений
    document.getElementById('closeMessage').addEventListener('click', function() {
        document.getElementById('messageModal').style.display = 'none';
    });
    
    // Отправка сообщения
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
    
    // Отправка сообщения по Enter
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Переключение панели эмодзи
    document.getElementById('emojiToggle').addEventListener('click', function() {
        const emojiPicker = document.getElementById('emojiPicker');
        emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
    });
});