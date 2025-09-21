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

// وظيفة إظهار نافذة المقدمة
function showIntroModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-8">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="font-amiri text-3xl font-bold text-slate-800 dark:text-white">مرحباً بك في نور الهداية</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                
                <div class="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                    <div class="text-center mb-8">
                        <div class="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-mosque text-white text-3xl"></i>
                        </div>
                        <p class="text-lg font-medium">موقع متخصص في التراث الإسلامي الأصيل</p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl">
                            <h3 class="font-bold text-emerald-700 dark:text-emerald-300 mb-3 flex items-center">
                                <i class="fas fa-user-tie ml-2"></i>
                                قصص الأنبياء
                            </h3>
                            <p>استكشف حياة وقصص جميع الأنبياء والمرسلين مع الدروس والعبر المستفادة من كل قصة.</p>
                        </div>
                        
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                            <h3 class="font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center">
                                <i class="fas fa-moon ml-2"></i>
                                السيرة النبوية
                            </h3>
                            <p>تتبع حياة خاتم الأنبياء محمد ﷺ من الولادة حتى الوفاة مع التفاصيل التاريخية.</p>
                        </div>
                        
                        <div class="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl">
                            <h3 class="font-bold text-amber-700 dark:text-amber-300 mb-3 flex items-center">
                                <i class="fas fa-shield-alt ml-2"></i>
                                الغزوات والسرايا
                            </h3>
                            <p>تعرف على غزوات الرسول ﷺ والأحداث المهمة في تاريخ الدعوة الإسلامية.</p>
                        </div>
                        
                        <div class="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                            <h3 class="font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center">
                                <i class="fas fa-users ml-2"></i>
                                الصحابة الكرام
                            </h3>
                            <p>اكتشف حياة وإنجازات أصحاب رسول الله ﷺ ودورهم في نشر الإسلام.</p>
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-6 rounded-xl text-center">
                        <h3 class="font-bold text-xl mb-2">🎯 هدفنا</h3>
                        <p>نشر التراث الإسلامي الأصيل والدروس المستفادة من حياة الأنبياء والصحابة الكرام</p>
                    </div>
                </div>
                
                <div class="flex justify-center mt-8">
                    <button onclick="navigateToSection('prophets')" class="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300">
                        ابدأ رحلتك الآن
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إضافة تأثير الظهور
    setTimeout(() => {
        modal.querySelector('div > div').classList.add('animate-fadeIn');
    }, 100);
}

// وظيفة إظهار نافذة البحث
function showSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20';
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="font-amiri text-2xl font-bold text-slate-800 dark:text-white">البحث في الموقع</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <div class="relative">
                        <input type="text" id="globalSearch" placeholder="ابحث في قصص الأنبياء، السيرة، الغزوات..."
                               class="w-full p-4 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                        <i class="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                    </div>
                    
                    <div class="flex flex-wrap gap-2">
                        <button onclick="filterSearch('prophets')" class="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                            الأنبياء
                        </button>
                        <button onclick="filterSearch('seerah')" class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                            السيرة
                        </button>
                        <button onclick="filterSearch('battles')" class="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">
                            الغزوات
                        </button>
                        <button onclick="filterSearch('companions')" class="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                            الصحابة
                        </button>
                    </div>
                    
                    <div id="searchResults" class="mt-6 space-y-3 max-h-60 overflow-y-auto">
                        <div class="text-center text-slate-500 dark:text-slate-400 py-8">
                            <i class="fas fa-search text-3xl mb-2"></i>
                            <p>ابدأ الكتابة للبحث في محتوى الموقع</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // التركيز على حقل البحث
    setTimeout(() => {
        document.getElementById('globalSearch').focus();
    }, 100);
    
    // إضافة مستمع الأحداث للبحث
    document.getElementById('globalSearch').addEventListener('input', performGlobalSearch);
}

// وظيفة البحث العام
function performGlobalSearch() {
    const query = document.getElementById('globalSearch').value.trim();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!query) {
        resultsContainer.innerHTML = `
            <div class="text-center text-slate-500 dark:text-slate-400 py-8">
                <i class="fas fa-search text-3xl mb-2"></i>
                <p>ابدأ الكتابة للبحث في محتوى الموقع</p>
            </div>
        `;
        return;
    }
    
    // نتائج البحث التجريبية
    const searchResults = [
        { title: 'قصة سيدنا موسى عليه السلام', section: 'الأنبياء', link: 'prophets.html', icon: 'fas fa-user-tie' },
        { title: 'غزوة بدر الكبرى', section: 'الغزوات', link: 'battles.html', icon: 'fas fa-shield-alt' },
        { title: 'أبو بكر الصديق رضي الله عنه', section: 'الصحابة', link: 'companions.html', icon: 'fas fa-users' },
        { title: 'الهجرة النبوية الشريفة', section: 'السيرة', link: 'seerah.html', icon: 'fas fa-moon' }
    ];
    
    const filteredResults = searchResults.filter(result => 
        result.title.includes(query) || result.section.includes(query)
    );
    
    if (filteredResults.length === 0) {
        resultsContainer.innerHTML = `
            <div class="text-center text-slate-500 dark:text-slate-400 py-8">
                <i class="fas fa-search-minus text-3xl mb-2"></i>
                <p>لم يتم العثور على نتائج لـ "${query}"</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = filteredResults.map(result => `
        <div class="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer transition-colors" onclick="window.location.href='${result.link}'">
            <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center ml-3">
                <i class="${result.icon} text-emerald-600 dark:text-emerald-400"></i>
            </div>
            <div class="flex-1">
                <div class="font-medium text-slate-800 dark:text-white">${result.title}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">${result.section}</div>
            </div>
            <i class="fas fa-chevron-left text-slate-400"></i>
        </div>
    `).join('');
}

// وظيفة فلترة البحث
function filterSearch(section) {
    const sectionNames = {
        'prophets': 'الأنبياء',
        'seerah': 'السيرة',
        'battles': 'الغزوات',
        'companions': 'الصحابة'
    };
    
    document.getElementById('globalSearch').value = sectionNames[section];
    performGlobalSearch();
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