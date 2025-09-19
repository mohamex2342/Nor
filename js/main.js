/**
 * ملف JavaScript الرئيسي لموقع نور الهداية
 * يحتوي على الوظائف الأساسية للموقع والتفاعلات
 */

// التحكم في الوضع الليلي
class DarkModeManager {
    constructor() {
        this.init();
    }

    init() {
        // فحص الحالة المحفوظة أو تفضيلات النظام
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            this.enableDarkMode();
        }

        // إضافة مستمع للزر
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggle());
        }

        // مراقبة تغييرات تفضيلات النظام
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    this.enableDarkMode();
                } else {
                    this.disableDarkMode();
                }
            }
        });
    }

    toggle() {
        if (document.documentElement.classList.contains('dark')) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        this.updateToggleIcon();
    }

    disableDarkMode() {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        this.updateToggleIcon();
    }

    updateToggleIcon() {
        const sunIcon = document.querySelector('#darkModeToggle .fa-sun');
        const moonIcon = document.querySelector('#darkModeToggle .fa-moon');
        
        if (document.documentElement.classList.contains('dark')) {
            if (sunIcon) sunIcon.classList.remove('hidden');
            if (moonIcon) moonIcon.classList.add('hidden');
        } else {
            if (sunIcon) sunIcon.classList.add('hidden');
            if (moonIcon) moonIcon.classList.remove('hidden');
        }
    }
}

// إدارة التنقل والقوائم
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        // التنقل السلس
        this.setupSmoothScrolling();
        
        // القوائم المنسدلة
        this.setupDropdowns();
        
        // شريط التنقل الثابت
        this.setupStickyNavbar();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('button');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (button && menu) {
                let timeout;
                
                dropdown.addEventListener('mouseenter', () => {
                    clearTimeout(timeout);
                    menu.classList.add('show');
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    timeout = setTimeout(() => {
                        menu.classList.remove('show');
                    }, 300);
                });
            }
        });
    }

    setupStickyNavbar() {
        const navbar = document.querySelector('nav');
        if (!navbar) return;

        let lastScrollY = window.scrollY;
        let isScrollingDown = false;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // التمرير لأسفل
                if (!isScrollingDown) {
                    navbar.style.transform = 'translateY(-100%)';
                    isScrollingDown = true;
                }
            } else {
                // التمرير لأعلى
                if (isScrollingDown) {
                    navbar.style.transform = 'translateY(0)';
                    isScrollingDown = false;
                }
            }

            lastScrollY = currentScrollY;
        });
    }
}

// إدارة المحتوى التفاعلي
class ContentManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadLatestContent();
        this.setupAnimations();
        this.loadStats();
    }

    async loadLatestContent() {
        try {
            const latestContainer = document.getElementById('latest-content');
            if (!latestContainer) return;

            // تحميل آخر المقالات من قاعدة البيانات
            const [prophets, battles, companions] = await Promise.all([
                this.fetchData('prophets', 2),
                this.fetchData('battles', 2),
                this.fetchData('companions', 2)
            ]);

            let contentHTML = '';

            // إضافة محتوى الأنبياء
            if (prophets?.data) {
                prophets.data.forEach(prophet => {
                    contentHTML += this.createContentCard({
                        title: `قصة ${prophet.name_arabic}`,
                        description: prophet.lessons?.substring(0, 120) + '...',
                        category: 'قصص الأنبياء',
                        categoryColor: 'emerald',
                        icon: 'fa-user-tie',
                        link: `#prophet-${prophet.id}`
                    });
                });
            }

            // إضافة محتوى الغزوات
            if (battles?.data) {
                battles.data.forEach(battle => {
                    contentHTML += this.createContentCard({
                        title: battle.name,
                        description: battle.description?.substring(0, 120) + '...',
                        category: 'الغزوات',
                        categoryColor: 'amber',
                        icon: 'fa-shield-alt',
                        link: `#battle-${battle.id}`
                    });
                });
            }

            // إضافة محتوى الصحابة
            if (companions?.data) {
                companions.data.forEach(companion => {
                    contentHTML += this.createContentCard({
                        title: companion.name,
                        description: companion.biography?.substring(0, 120) + '...',
                        category: 'الصحابة',
                        categoryColor: 'purple',
                        icon: 'fa-users',
                        link: `#companion-${companion.id}`
                    });
                });
            }

            latestContainer.innerHTML = contentHTML;

        } catch (error) {
            console.error('خطأ في تحميل المحتوى الأخير:', error);
            this.showFallbackContent();
        }
    }

    createContentCard({ title, description, category, categoryColor, icon, link }) {
        return `
            <article class="card group cursor-pointer" onclick="navigateToContent('${link}')">
                <div class="flex items-start space-x-4 space-x-reverse">
                    <div class="w-12 h-12 bg-gradient-to-br from-${categoryColor}-500 to-${categoryColor}-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="mb-2">
                            <span class="inline-block px-3 py-1 bg-${categoryColor}-100 dark:bg-${categoryColor}-900 text-${categoryColor}-700 dark:text-${categoryColor}-300 text-sm rounded-full">
                                ${category}
                            </span>
                        </div>
                        <h3 class="font-bold text-lg text-slate-800 dark:text-white mb-2 group-hover:text-${categoryColor}-600 transition-colors">
                            ${title}
                        </h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            ${description}
                        </p>
                        <div class="mt-4 flex items-center text-${categoryColor}-600 dark:text-${categoryColor}-400">
                            <span class="text-sm font-medium">اقرأ المزيد</span>
                            <i class="fas fa-arrow-left mr-2 group-hover:translate-x-1 transition-transform"></i>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    showFallbackContent() {
        const latestContainer = document.getElementById('latest-content');
        if (!latestContainer) return;

        const fallbackContent = [
            {
                title: 'قصة سيدنا إبراهيم عليه السلام',
                description: 'تعرف على قصة خليل الرحمن وكيف حطم الأصنام ودعا قومه إلى عبادة الله وحده...',
                category: 'قصص الأنبياء',
                categoryColor: 'emerald',
                icon: 'fa-user-tie'
            },
            {
                title: 'غزوة بدر الكبرى',
                description: 'أول معركة فاصلة في تاريخ الإسلام والتي سميت بيوم الفرقان...',
                category: 'الغزوات',
                categoryColor: 'amber',
                icon: 'fa-shield-alt'
            },
            {
                title: 'أبو بكر الصديق رضي الله عنه',
                description: 'تعرف على حياة الصديق وفضائله وكيف كان أول من آمن من الرجال...',
                category: 'الصحابة',
                categoryColor: 'purple',
                icon: 'fa-users'
            }
        ];

        let contentHTML = '';
        fallbackContent.forEach(item => {
            contentHTML += this.createContentCard(item);
        });

        latestContainer.innerHTML = contentHTML;
    }

    async fetchData(tableName, limit = 10) {
        try {
            const response = await fetch(`/tables/${tableName}?limit=${limit}&sort=-created_at`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`خطأ في تحميل بيانات ${tableName}:`, error);
            return null;
        }
    }

    setupAnimations() {
        // إعداد الرسوم المتحركة عند التمرير
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                }
            });
        }, observerOptions);

        // مراقبة العناصر القابلة للحركة
        document.querySelectorAll('.section-card, .stats-card, .card').forEach(el => {
            observer.observe(el);
        });
    }

    async loadStats() {
        try {
            const [prophetsCount, battlesCount, companionsCount] = await Promise.all([
                this.fetchData('prophets', 1000),
                this.fetchData('battles', 1000),
                this.fetchData('companions', 1000)
            ]);

            // تحديث العدادات
            this.animateCounter('prophets-count', prophetsCount?.total || 25, 25);
            this.animateCounter('battles-count', battlesCount?.total || 28, 28);
            this.animateCounter('companions-count', companionsCount?.total || 100, 100);
            this.animateCounter('stories-count', 500, 500);

        } catch (error) {
            console.error('خطأ في تحميل الإحصائيات:', error);
        }
    }

    animateCounter(elementId, targetValue, fallbackValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const finalValue = targetValue || fallbackValue;
        const duration = 2000;
        const increment = finalValue / (duration / 16);
        let currentValue = 0;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            
            if (finalValue > 100) {
                element.textContent = Math.floor(currentValue) + '+';
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, 16);
    }
}

// إدارة البحث
class SearchManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupSearchHandlers();
    }

    setupSearchHandlers() {
        // يمكن إضافة وظائف البحث هنا لاحقاً
    }
}

// إدارة المفضلة
class FavoritesManager {
    constructor() {
        this.favorites = this.loadFavorites();
        this.init();
    }

    init() {
        // سيتم إضافة وظائف المفضلة لاحقاً
    }

    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('favorites') || '[]');
        } catch {
            return [];
        }
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    addToFavorites(item) {
        if (!this.isFavorite(item.id)) {
            this.favorites.push(item);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    removeFromFavorites(itemId) {
        const index = this.favorites.findIndex(item => item.id === itemId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    isFavorite(itemId) {
        return this.favorites.some(item => item.id === itemId);
    }
}

// وظائف التنقل
function navigateToSection(sectionName) {
    const routes = {
        'prophets': 'prophets.html',
        'seerah': 'seerah.html',
        'battles': 'battles.html',
        'companions': 'companions.html',
        'children': 'children.html',
        'qna': 'qna.html'
    };

    const route = routes[sectionName];
    if (route) {
        window.location.href = route;
    }
}

function navigateToContent(link) {
    // التنقل إلى محتوى محدد
    if (link.startsWith('#')) {
        // رابط داخلي
        const element = document.querySelector(link);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        // رابط خارجي
        window.location.href = link;
    }
}

// وظائف المساعدة
function showToast(message, type = 'info') {
    // إظهار رسالة منبثقة
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
    const colors = {
        'success': 'bg-emerald-500 text-white',
        'error': 'bg-red-500 text-white',
        'warning': 'bg-amber-500 text-white',
        'info': 'bg-blue-500 text-white'
    };
    
    toast.className += ` ${colors[type] || colors.info}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // إظهار التوست
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // إخفاء التوست بعد 3 ثوان
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// تهيئة الموقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة جميع المكونات
    new DarkModeManager();
    new NavigationManager();
    new ContentManager();
    new SearchManager();
    new FavoritesManager();
    
    // إظهار رسالة ترحيب
    setTimeout(() => {
        showToast('أهلاً وسهلاً بك في موقع نور الهداية', 'success');
    }, 1000);
    
    console.log('تم تحميل موقع نور الهداية بنجاح ✨');
});

// تحسين الأداء
window.addEventListener('load', function() {
    // إزالة شاشة التحميل إذا وجدت
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
    
    // تفعيل lazy loading للصور
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// معالجة الأخطاء العامة
window.addEventListener('error', function(e) {
    console.error('خطأ في الصفحة:', e.error);
    showToast('حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.', 'error');
});

// حفظ حالة التطبيق قبل إغلاق الصفحة
window.addEventListener('beforeunload', function() {
    // حفظ أي بيانات مهمة
    const scrollPosition = window.scrollY;
    sessionStorage.setItem('scrollPosition', scrollPosition);
});

// استعادة حالة التطبيق بعد تحميل الصفحة
window.addEventListener('load', function() {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem('scrollPosition');
    }
});