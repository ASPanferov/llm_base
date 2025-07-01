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

            // Простая токенизация (в реальности используются более сложные алгоритмы)
            const tokens = [];
            const words = text.split(/(\s+|[^\w\s])/g).filter(t => t.trim());
            
            words.forEach(word => {
                if (word.length > 4) {
                    // Разбиваем длинные слова на части
                    const parts = [];
                    for (let i = 0; i < word.length; i += 3) {
                        parts.push(word.slice(i, i + 3));
                    }
                    tokens.push(...parts);
                } else {
                    tokens.push(word);
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
        const limits = [10, 20, 50, 100]; // Количество элементов для демонстрации

        const updateContext = () => {
            const value = parseInt(slider.value);
            display.textContent = `${sizes[value - 1]} токенов`;
            
            const limit = limits[value - 1];
            const items = [];
            
            // Генерируем элементы контекста
            for (let i = 0; i < Math.min(limit + 10, 60); i++) {
                const item = document.createElement('span');
                item.className = 'context-item';
                item.textContent = `token_${i + 1}`;
                
                if (i >= limit) {
                    item.classList.add('old');
                }
                
                items.push(item);
            }
            
            content.innerHTML = '';
            items.forEach(item => content.appendChild(item));
            
            // Анимация переполнения
            if (items.length > limit) {
                setTimeout(() => {
                    items.slice(limit).forEach(item => {
                        item.style.opacity = '0.3';
                        item.style.transform = 'translateX(-100px)';
                    });
                }, 500);
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
        const qualityFill = document.getElementById('quality-fill');
        const qualityText = document.getElementById('quality-text');
        const copyButton = document.getElementById('copy-prompt');

        const updatePrompt = () => {
            const parts = [];
            let quality = 0;

            if (roleSelect.value) {
                parts.push(roleSelect.value + '.');
                quality += 25;
                roleSelect.parentElement.classList.add('filled');
            } else {
                roleSelect.parentElement.classList.remove('filled');
            }

            if (contextInput.value.trim()) {
                parts.push('\nКонтекст: ' + contextInput.value.trim());
                quality += 20;
                contextInput.parentElement.classList.add('filled');
            } else {
                contextInput.parentElement.classList.remove('filled');
            }

            if (taskInput.value.trim()) {
                parts.push('\nЗадача: ' + taskInput.value.trim());
                quality += 35;
                taskInput.parentElement.classList.add('filled');
            } else {
                taskInput.parentElement.classList.remove('filled');
            }

            if (formatSelect.value) {
                parts.push('\n' + formatSelect.value + '.');
                quality += 20;
                formatSelect.parentElement.classList.add('filled');
            } else {
                formatSelect.parentElement.classList.remove('filled');
            }

            const prompt = parts.length > 0 ? parts.join('') : 'Ваш промпт появится здесь по мере заполнения полей...';
            generatedPrompt.textContent = prompt;

            // Обновление качества
            qualityFill.style.width = `${quality}%`;
            qualityText.textContent = `${quality}%`;
            
            if (quality < 40) {
                qualityFill.style.background = '#ef4444';
            } else if (quality < 70) {
                qualityFill.style.background = '#f59e0b';
            } else {
                qualityFill.style.background = '#10b981';
            }
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
            brainCold.style.opacity = 1 - value;
            brainHot.style.opacity = value;
            
            // Обновление примеров
            const lowResponses = lowTempResponses.slice(0, 3);
            const highResponses = [];
            
            // Выбираем случайные ответы для высокой температуры
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * highTempResponses.length);
                highResponses.push(highTempResponses[randomIndex]);
            }
            
            lowTempExample.querySelector('.responses').innerHTML = 
                lowResponses.map(r => `<p class="text-sm">${r}</p>`).join('');
            
            highTempExample.querySelector('.responses').innerHTML = 
                highResponses.map(r => `<p class="text-sm">${r}</p>`).join('');
            
            // Добавляем эффект "дрожания" для высокой температуры
            if (value > 0.7) {
                highTempExample.style.animation = 'shake 0.5s infinite';
            } else {
                highTempExample.style.animation = 'none';
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