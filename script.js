// Интерактивный лендинг "Как работают нейросети"

class NeuralNetworkDemo {
    constructor() {
        this.currentSection = 0;
        this.sections = ['hero', 'tokens', 'context', 'prompts', 'temperature'];
        this.init();
    }

    init() {
        this.setupScrollTracking();
        this.setupTokenizer();
        this.setupContextWindow();
        this.setupPromptEngineering();
        this.setupTemperature();
        this.setupNavigation();
        this.setupAnimations();
    }

    // Отслеживание прокрутки и прогресс-бар
    setupScrollTracking() {
        const progressBar = document.getElementById('progress-bar');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;

            // Обновление активной навигации
            const sections = document.querySelectorAll('section');
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Токенизатор
    setupTokenizer() {
        const input = document.getElementById('token-input');
        const output = document.getElementById('tokenized-output');
        const counter = document.getElementById('token-count');

        const tokenColors = ['token-color-1', 'token-color-2', 'token-color-3', 'token-color-4', 'token-color-5'];

        const tokenize = (text) => {
            if (!text.trim()) {
                output.innerHTML = '<span class="text-gray-400">Токены появятся здесь...</span>';
                counter.textContent = '0 токенов';
                return;
            }

            // Улучшенная токенизация - более реалистичная
            const tokens = [];
            
            // Разбиваем на слова и знаки препинания
            const parts = text.split(/(\s+|[^\w\sА-Яа-я])/g).filter(t => t.trim());
            
            parts.forEach(part => {
                if (/^[а-яё]+$/i.test(part)) {
                    // Русские слова - разбиваем по слогам/морфемам
                    if (part.length > 6) {
                        const subparts = [];
                        // Примерное разбиение длинных русских слов
                        for (let i = 0; i < part.length; i += Math.floor(part.length / 3) + 1) {
                            subparts.push(part.slice(i, i + Math.floor(part.length / 3) + 1));
                        }
                        tokens.push(...subparts.filter(p => p));
                    } else {
                        tokens.push(part);
                    }
                } else if (/^[a-z]+$/i.test(part)) {
                    // Английские слова - разбиваем на морфемы
                    if (part.length > 5) {
                        const subparts = [];
                        // Простое разбиение английских слов
                        for (let i = 0; i < part.length; i += 3) {
                            subparts.push(part.slice(i, i + 3));
                        }
                        tokens.push(...subparts.filter(p => p));
                    } else {
                        tokens.push(part);
                    }
                } else {
                    // Знаки препинания и числа как отдельные токены
                    tokens.push(part);
                }
            });

            // Отображение токенов
            output.innerHTML = '';
            tokens.forEach((token, index) => {
                const span = document.createElement('span');
                span.className = `token ${tokenColors[index % tokenColors.length]}`;
                span.textContent = token;
                span.style.animationDelay = `${index * 0.1}s`;
                output.appendChild(span);
            });

            counter.textContent = `${tokens.length} токенов`;
        };

        input.addEventListener('input', (e) => tokenize(e.target.value));
        tokenize(input.value); // Инициализация
    }

    // Контекстное окно
    setupContextWindow() {
        const slider = document.getElementById('context-slider');
        const display = document.getElementById('context-size-display');
        const content = document.getElementById('context-content');

        const sizes = ['1K', '4K', '32K', '200K'];
        const limits = [8, 16, 32, 64]; // Количество видимых токенов
        
        // Создаем статичный набор примеров токенов
        const sampleTokens = [
            'Привет', ',', 'как', 'дела', '?', 'Что', 'нового', 'в', 'мире', 
            'нейро', 'сетей', '?', 'Сегодня', 'изучаем', 'основы', 'LLM',
            'модели', 'и', 'принципы', 'их', 'работы', '.', 'Это', 'очень',
            'интересная', 'тема', 'для', 'исследования', '!', 'Давайте',
            'разберем', 'каждый', 'аспект', 'подробно', '.', 'Токены',
            'являются', 'основой', 'понимания', 'текста', 'нейросетью',
            '.', 'Каждый', 'символ', 'имеет', 'значение', 'в', 'контексте',
            'всего', 'предложения', '.', 'Память', 'модели', 'ограничена',
            'размером', 'контекстного', 'окна', '.', 'За', 'пределами',
            'лимита', 'информация', 'теряется', '.'
        ];

        const updateContext = () => {
            const value = parseInt(slider.value);
            display.textContent = `${sizes[value - 1]} токенов`;
            
            const limit = limits[value - 1];
            content.innerHTML = '';
            
            // Показываем токены в рамках лимита
            for (let i = 0; i < Math.min(sampleTokens.length, limit + 8); i++) {
                const item = document.createElement('span');
                item.className = 'context-item';
                item.textContent = sampleTokens[i];
                
                // Плавное выделение токенов за пределами лимита
                if (i >= limit) {
                    item.style.opacity = '0.3';
                    item.style.filter = 'blur(1px)';
                    item.style.background = 'rgba(239, 68, 68, 0.2)';
                    item.style.borderColor = '#ef4444';
                } else {
                    item.style.opacity = '1';
                    item.style.filter = 'none';
                    item.style.background = 'rgba(59, 130, 246, 0.2)';
                    item.style.borderColor = '#3b82f6';
                }
                
                content.appendChild(item);
            }
            
            // Добавляем индикатор границы
            if (limit < sampleTokens.length) {
                const boundary = document.createElement('div');
                boundary.className = 'context-boundary';
                boundary.style.position = 'absolute';
                boundary.style.right = '0';
                boundary.style.top = '0';
                boundary.style.bottom = '0';
                boundary.style.width = '3px';
                boundary.style.background = 'linear-gradient(180deg, #ef4444, #dc2626)';
                boundary.style.borderRadius = '2px';
                content.parentElement.style.position = 'relative';
                content.parentElement.appendChild(boundary);
            }
        };

        slider.addEventListener('input', updateContext);
        updateContext();
    }

    // Промпт-инжиниринг
    setupPromptEngineering() {
        const roleSelect = document.getElementById('role-select');
        const contextInput = document.getElementById('context-input');
        const taskInput = document.getElementById('task-input');
        const formatSelect = document.getElementById('format-select');
        const generatedPrompt = document.getElementById('generated-prompt');
        const copyButton = document.getElementById('copy-prompt');

        const updatePrompt = () => {
            const parts = [];

            if (roleSelect.value) {
                parts.push(roleSelect.value + '.');
                roleSelect.parentElement.classList.add('filled');
            } else {
                roleSelect.parentElement.classList.remove('filled');
            }

            if (contextInput.value.trim()) {
                parts.push('\nКонтекст: ' + contextInput.value.trim());
                contextInput.parentElement.classList.add('filled');
            } else {
                contextInput.parentElement.classList.remove('filled');
            }

            if (taskInput.value.trim()) {
                parts.push('\nЗадача: ' + taskInput.value.trim());
                taskInput.parentElement.classList.add('filled');
            } else {
                taskInput.parentElement.classList.remove('filled');
            }

            if (formatSelect.value) {
                parts.push('\n' + formatSelect.value + '.');
                formatSelect.parentElement.classList.add('filled');
            } else {
                formatSelect.parentElement.classList.remove('filled');
            }

            const prompt = parts.length > 0 ? parts.join('') : 'Ваш промпт появится здесь по мере заполнения полей...';
            generatedPrompt.textContent = prompt;
        };

        [roleSelect, contextInput, taskInput, formatSelect].forEach(element => {
            element.addEventListener('input', updatePrompt);
            element.addEventListener('change', updatePrompt);
        });

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(generatedPrompt.textContent).then(() => {
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check mr-2"></i>Скопировано!';
                setTimeout(() => {
                    copyButton.innerHTML = originalText;
                }, 2000);
            });
        });

        updatePrompt();
    }

    // Температура
    setupTemperature() {
        const slider = document.getElementById('temperature-slider');
        const display = document.getElementById('temperature-display');
        const brainCold = document.querySelector('.brain-cold');
        const brainHot = document.querySelector('.brain-hot');
        const lowTempExample = document.getElementById('low-temp-example');
        const highTempExample = document.getElementById('high-temp-example');

        const lowTempResponses = [
            '"AI Solutions"',
            '"Smart Technology"',
            '"Neural Networks Inc"',
            '"Artificial Intelligence Co"',
            '"Machine Learning Systems"'
        ];

        const highTempResponses = [
            '"QuantumMind"',
            '"SynapseFlow"',
            '"CogniSpark"',
            '"NeuralNova"',
            '"ThinkWeave"',
            '"BrainStorm AI"',
            '"MindCraft"',
            '"SynapSync"',
            '"NeuralNexus"',
            '"CogniVerse"'
        ];

        const updateTemperature = () => {
            const value = parseFloat(slider.value);
            display.textContent = value.toFixed(1);
            
            // Обновление цвета индикатора
            const hue = (1 - value) * 240; // От синего (240) к красному (0)
            display.style.background = `hsl(${hue}, 70%, 50%)`;
            
            // Анимация мозга
            if (brainCold) brainCold.style.opacity = 1 - value;
            if (brainHot) brainHot.style.opacity = value;
            
            // Статичные примеры в зависимости от температуры
            let lowResponses, highResponses;
            
            if (value <= 0.3) {
                lowResponses = ['"AI Solutions"', '"Smart Technology"', '"Neural Networks Inc"'];
                highResponses = ['"AI Solutions"', '"Smart Tech"', '"Neural Corp"'];
            } else if (value <= 0.7) {
                lowResponses = ['"AI Solutions"', '"Smart Technology"', '"Neural Networks Inc"'];
                highResponses = ['"CogniTech"', '"SynapseFlow"', '"MindForge"'];
            } else {
                lowResponses = ['"AI Solutions"', '"Smart Technology"', '"Neural Networks Inc"'];
                highResponses = ['"QuantumDream"', '"CosmoMind"', '"InfinityThink"'];
            }
            
            if (lowTempExample) {
                lowTempExample.querySelector('.responses').innerHTML = 
                    lowResponses.map(r => `<p class="text-sm">${r}</p>`).join('');
            }
            
            if (highTempExample) {
                highTempExample.querySelector('.responses').innerHTML = 
                    highResponses.map(r => `<p class="text-sm">${r}</p>`).join('');
                
                // Визуальные эффекты для высокой температуры
                if (value > 0.7) {
                    highTempExample.style.transform = 'scale(1.02)';
                    highTempExample.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
                } else {
                    highTempExample.style.transform = 'scale(1)';
                    highTempExample.style.boxShadow = 'none';
                }
            }
        };

        // Добавляем CSS для анимации дрожания
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
        `;
        document.head.appendChild(style);

        slider.addEventListener('input', updateTemperature);
        updateTemperature();
    }

    // Навигация
    setupNavigation() {
        const startButton = document.getElementById('start-journey');
        const navLinks = document.querySelectorAll('.nav-link');

        startButton.addEventListener('click', () => {
            document.getElementById('tokens').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                document.getElementById(targetId).scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        });
    }

    // Анимации при скролле
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Запускаем специальные анимации для каждой секции
                    const sectionId = entry.target.id;
                    this.animateSection(sectionId);
                }
            });
        }, observerOptions);

        // Наблюдаем за всеми секциями
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('animate-on-scroll');
            observer.observe(section);
        });
    }

    animateSection(sectionId) {
        switch(sectionId) {
            case 'hero':
                this.animateHero();
                break;
            case 'tokens':
                this.animateTokens();
                break;
            case 'context':
                this.animateContext();
                break;
            case 'prompts':
                this.animatePrompts();
                break;
            case 'temperature':
                this.animateTemperature();
                break;
        }
    }

    animateHero() {
        // Анимация появления нейронной сети
        gsap.fromTo('.neural-brain', 
            { scale: 0, rotation: -180, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, duration: 2, ease: "back.out(1.7)" }
        );
        
        // Анимация заголовка
        gsap.fromTo('h1', 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.5 }
        );
    }

    animateTokens() {
        // Автоматическая демонстрация токенизации
        const input = document.getElementById('token-input');
        const originalValue = input.value;
        input.value = '';
        
        let i = 0;
        const typeText = () => {
            if (i < originalValue.length) {
                input.value += originalValue[i];
                input.dispatchEvent(new Event('input'));
                i++;
                setTimeout(typeText, 100);
            }
        };
        
        setTimeout(typeText, 500);
    }

    animateContext() {
        // Анимация заполнения контекстного окна
        const slider = document.getElementById('context-slider');
        const originalValue = slider.value;
        
        // Показываем все размеры по очереди
        let currentValue = 1;
        const animateSlider = () => {
            if (currentValue <= 4) {
                slider.value = currentValue;
                slider.dispatchEvent(new Event('input'));
                currentValue++;
                setTimeout(animateSlider, 1000);
            } else {
                // Возвращаем к исходному значению
                slider.value = originalValue;
                slider.dispatchEvent(new Event('input'));
            }
        };
        
        setTimeout(animateSlider, 500);
    }

    animatePrompts() {
        // Постепенное заполнение полей промпта
        const fields = [
            { element: document.getElementById('role-select'), value: 'Ты опытный программист' },
            { element: document.getElementById('context-input'), value: 'Мне нужно создать веб-приложение для управления задачами' },
            { element: document.getElementById('task-input'), value: 'Напиши функцию на JavaScript для сортировки списка задач по приоритету' },
            { element: document.getElementById('format-select'), value: 'Ответь в формате списка' }
        ];
        
        fields.forEach((field, index) => {
            setTimeout(() => {
                if (field.element.tagName === 'SELECT') {
                    field.element.value = field.value;
                } else {
                    this.typeInField(field.element, field.value);
                }
                field.element.dispatchEvent(new Event('input'));
            }, index * 1000);
        });
    }

    animateTemperature() {
        // Демонстрация разных значений температуры
        const slider = document.getElementById('temperature-slider');
        const values = [0.1, 0.5, 0.9, 0.7];
        
        values.forEach((value, index) => {
            setTimeout(() => {
                slider.value = value;
                slider.dispatchEvent(new Event('input'));
            }, index * 1000);
        });
    }

    typeInField(element, text) {
        element.value = '';
        let i = 0;
        const type = () => {
            if (i < text.length) {
                element.value += text[i];
                i++;
                setTimeout(type, 50);
            }
        };
        type();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new NeuralNetworkDemo();
    
    // Добавляем дополнительные интерактивные элементы
    setupParticles();
    setupKeyboardShortcuts();
});

// Система частиц для фона
function setupParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.1
        };
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
            ctx.fill();
        });
        
        // Рисуем связи между близкими частицами
        particles.forEach((particle1, i) => {
            particles.slice(i + 1).forEach(particle2 => {
                const distance = Math.sqrt(
                    Math.pow(particle1.x - particle2.x, 2) + 
                    Math.pow(particle1.y - particle2.y, 2)
                );
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle1.x, particle1.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Создаем частицы
    for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
    }
    
    animate();
}

// Горячие клавиши
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    document.getElementById('tokens').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '2':
                    e.preventDefault();
                    document.getElementById('context').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '3':
                    e.preventDefault();
                    document.getElementById('prompts').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '4':
                    e.preventDefault();
                    document.getElementById('temperature').scrollIntoView({ behavior: 'smooth' });
                    break;
            }
        }
    });
}