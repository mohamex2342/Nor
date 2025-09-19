/**
 * ملف JavaScript الخاص بصفحة قصص الأنبياء
 * يحتوي على جميع الوظائف المتعلقة بعرض وإدارة قصص الأنبياء
 */

class ProphetsPageManager {
    constructor() {
        this.allProphets = [];
        this.filteredProphets = [];
        this.currentFilter = 'all';
        this.isLoading = false;
        this.currentModal = null;
        
        this.init();
    }

    async init() {
        await this.loadProphets();
        this.setupEventListeners();
        this.renderProphets();
        this.hideLoading();
    }

    async loadProphets() {
        try {
            this.showLoading();
            const response = await prophetsApi.getAll({ limit: 50, sort: 'timeline' });
            
            if (response && response.data) {
                this.allProphets = response.data;
                this.filteredProphets = [...this.allProphets];
            } else {
                // البيانات التجريبية في حالة عدم وجود اتصال بقاعدة البيانات
                this.loadFallbackData();
            }
        } catch (error) {
            console.error('خطأ في تحميل قصص الأنبياء:', error);
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        this.allProphets = [
            {
                id: 'adam',
                name: 'Adam',
                name_arabic: 'آدم عليه السلام',
                story: 'أبو البشر وأول الأنبياء. خلقه الله من تراب ونفخ فيه من روحه. عاش في الجنة مع حواء حتى أغواهما إبليس فأكلا من الشجرة المحرمة. تاب الله عليهما وأهبطهما إلى الأرض.',
                lessons: 'التوبة والاستغفار، عظمة خلق الإنسان، الحذر من وسوسة الشيطان',
                timeline: '1',
                is_featured: true
            },
            {
                id: 'noah',
                name: 'Noah',
                name_arabic: 'نوح عليه السلام',
                story: 'دعا قومه 950 عاماً إلى عبادة الله وحده. لم يؤمن معه إلا قليل. أمره الله ببناء السفينة. أرسل الله الطوفان فأغرق الكافرين ونجى نوح ومن آمن معه.',
                lessons: 'الصبر في الدعوة، عدل الله، أهمية الإيمان والعمل الصالح',
                timeline: '2',
                is_featured: true
            },
            {
                id: 'ibrahim',
                name: 'Abraham',
                name_arabic: 'إبراهيم عليه السلام',
                story: 'خليل الرحمن، حطم أصنام قومه ودعاهم إلى عبادة الله. ابتلاه الله بذبح ابنه إسماعيل فاستجاب، ففداه الله بذبح عظيم. بنى الكعبة مع إسماعيل.',
                lessons: 'التوحيد ونبذ الشرك، الطاعة المطلقة لله، بناء البيت الحرام',
                timeline: '3',
                is_featured: true
            },
            {
                id: 'musa',
                name: 'Moses',
                name_arabic: 'موسى عليه السلام',
                story: 'كليم الله، أرسله الله إلى فرعون وقومه. أيده بالمعجزات والآيات. نجّى بني إسرائيل من فرعون وشق البحر لهم. أنزل عليه التوراة.',
                lessons: 'مقاومة الظلم، قدرة الله المطلقة، أهمية الرسالة السماوية',
                timeline: '4',
                is_featured: true
            },
            {
                id: 'isa',
                name: 'Jesus',
                name_arabic: 'عيسى عليه السلام',
                story: 'روح الله وكلمته، ولد من عذراء بقدرة الله. أيده الله بالمعجزات من إحياء الموتى وإبراء الأكمه والأبرص. رفعه الله إليه وسيعود.',
                lessons: 'خلق الله بغير أسباب، الرحمة والشفقة، زهد الدنيا والعبادة',
                timeline: '5',
                is_featured: true
            },
            {
                id: 'muhammad',
                name: 'Muhammad',
                name_arabic: 'محمد صلى الله عليه وسلم',
                story: 'خاتم الأنبياء والمرسلين، أرسله الله رحمة للعالمين. أنزل عليه القرآن الكريم. بلغ الرسالة وأدى الأمانة ونصح الأمة.',
                lessons: 'الخلق العظيم، الرحمة والعدل، اتباع السنة النبوية',
                timeline: '6',
                is_featured: true
            }
        ];
        this.filteredProphets = [...this.allProphets];
    }

    setupEventListeners() {
        // البحث
        const searchToggle = document.getElementById('searchToggle');
        const searchBar = document.getElementById('searchBar');
        const searchInput = document.getElementById('searchInput');

        if (searchToggle && searchBar) {
            searchToggle.addEventListener('click', () => {
                searchBar.classList.toggle('hidden');
                if (!searchBar.classList.contains('hidden')) {
                    searchInput?.focus();
                }
            });
        }

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchProphets(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchProphets(e.target.value);
                }
            });
        }

        // إغلاق النافذة عند النقر خارجها
        const modal = document.getElementById('prophetModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // إغلاق النافذة بالضغط على Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });
    }

    renderProphets() {
        const grid = document.getElementById('prophetsGrid');
        if (!grid) return;

        if (this.filteredProphets.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();

        const prophetsHTML = this.filteredProphets.map(prophet => {
            return this.createProphetCard(prophet);
        }).join('');

        grid.innerHTML = prophetsHTML;

        // إضافة الرسوم المتحركة
        setTimeout(() => {
            const cards = grid.querySelectorAll('.prophet-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-fadeInUp');
                }, index * 100);
            });
        }, 50);
    }

    createProphetCard(prophet) {
        const isOluluAzm = ['noah', 'ibrahim', 'musa', 'isa', 'muhammad'].includes(prophet.id);
        const badgeClass = isOluluAzm ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
        const badgeText = isOluluAzm ? 'من أولي العزم' : 'نبي كريم';

        return `
            <article class="prophet-card card group cursor-pointer transform transition-all duration-300 hover:scale-105" 
                     onclick="prophetsPageManager.showProphetDetails('${prophet.id}')">
                <div class="relative">
                    <!-- شارة النبي -->
                    <div class="absolute top-4 right-4 z-10">
                        <span class="inline-block px-3 py-1 text-xs font-medium rounded-full ${badgeClass}">
                            ${badgeText}
                        </span>
                    </div>

                    <!-- أيقونة النبي -->
                    <div class="text-center mb-6 pt-4">
                        <div class="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mx-auto"></div>
                    </div>

                    <!-- معلومات النبي -->
                    <div class="text-center mb-6">
                        <h3 class="font-amiri text-2xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            ${prophet.name_arabic}
                        </h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                            ${this.truncateText(prophet.story || '', 120)}
                        </p>
                    </div>

                    <!-- الدروس المستفادة -->
                    <div class="mb-6">
                        <h4 class="font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                            <i class="fas fa-lightbulb text-amber-500 ml-2"></i>
                            الدروس المستفادة
                        </h4>
                        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            ${this.truncateText(prophet.lessons || '', 80)}
                        </p>
                    </div>

                    <!-- أزرار الإجراءات -->
                    <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-600">
                        <button class="flex items-center space-x-2 space-x-reverse text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors text-sm font-medium">
                            <i class="fas fa-book-open"></i>
                            <span>اقرأ القصة كاملة</span>
                        </button>
                        <div class="flex items-center space-x-2 space-x-reverse text-slate-400">
                            <button onclick="event.stopPropagation(); prophetsPageManager.toggleFavorite('${prophet.id}')" 
                                    class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-red-500 transition-all duration-200"
                                    title="إضافة للمفضلة">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button onclick="event.stopPropagation(); prophetsPageManager.shareProphet('${prophet.id}')"
                                    class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-500 transition-all duration-200"
                                    title="مشاركة">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    showProphetDetails(prophetId) {
        const prophet = this.allProphets.find(p => p.id === prophetId);
        if (!prophet) return;

        const modal = document.getElementById('prophetModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        if (!modal || !modalTitle || !modalContent) return;

        modalTitle.textContent = prophet.name_arabic;

        modalContent.innerHTML = `
            <div class="space-y-6">
                <!-- صورة رمزية وتعريف -->
                <div class="text-center">
                    <div class="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl mb-4">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <h3 class="font-amiri text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        ${prophet.name_arabic}
                    </h3>
                    <div class="w-20 h-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mx-auto"></div>
                </div>

                <!-- القصة الكاملة -->
                <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                    <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center">
                        <i class="fas fa-book text-emerald-600 ml-3"></i>
                        القصة الكاملة
                    </h4>
                    <div class="prose dark:prose-invert max-w-none">
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-amiri">
                            ${prophet.story || 'قصة هذا النبي الكريم قيد الإعداد...'}
                        </p>
                    </div>
                </div>

                <!-- الدروس والعبر -->
                <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
                    <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center">
                        <i class="fas fa-lightbulb text-amber-500 ml-3"></i>
                        الدروس والعبر المستفادة
                    </h4>
                    <div class="prose dark:prose-invert max-w-none">
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            ${prophet.lessons || 'الدروس المستفادة من حياة هذا النبي الكريم قيد الإعداد...'}
                        </p>
                    </div>
                </div>

                <!-- معلومات إضافية -->
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                        <h5 class="font-medium text-slate-800 dark:text-white mb-2 flex items-center">
                            <i class="fas fa-clock text-blue-500 ml-2"></i>
                            الترتيب الزمني
                        </h5>
                        <p class="text-slate-600 dark:text-slate-300">
                            النبي رقم ${prophet.timeline || 'غير محدد'} في التسلسل الزمني
                        </p>
                    </div>
                    
                    <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                        <h5 class="font-medium text-slate-800 dark:text-white mb-2 flex items-center">
                            <i class="fas fa-star text-purple-500 ml-2"></i>
                            المكانة
                        </h5>
                        <p class="text-slate-600 dark:text-slate-300">
                            ${prophet.is_featured ? 'من الأنبياء المميزين' : 'نبي كريم'}
                        </p>
                    </div>
                </div>

                <!-- أزرار الإجراءات -->
                <div class="flex flex-wrap gap-3 pt-6 border-t border-slate-200 dark:border-slate-600">
                    <button onclick="prophetsPageManager.toggleFavorite('${prophet.id}')" 
                            class="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                        <i class="fas fa-heart"></i>
                        <span>إضافة للمفضلة</span>
                    </button>
                    <button onclick="prophetsPageManager.shareProphet('${prophet.id}')"
                            class="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                        <i class="fas fa-share-alt"></i>
                        <span>مشاركة</span>
                    </button>
                    <button onclick="prophetsPageManager.printProphet('${prophet.id}')"
                            class="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                        <i class="fas fa-print"></i>
                        <span>طباعة</span>
                    </button>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        this.currentModal = modal;
        document.body.style.overflow = 'hidden';

        // إضافة تأثير الظهور
        setTimeout(() => {
            modal.querySelector('.modal-content').classList.add('animate-fadeInUp');
        }, 50);
    }

    closeModal() {
        const modal = document.getElementById('prophetModal');
        if (modal) {
            modal.classList.add('hidden');
            this.currentModal = null;
            document.body.style.overflow = '';
        }
    }

    filterProphets(filter) {
        this.currentFilter = filter;

        // تحديث أزرار الفلتر
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-emerald-600', 'text-white');
            btn.classList.add('bg-white', 'dark:bg-slate-700', 'text-slate-700', 'dark:text-slate-200');
        });

        event.target.classList.remove('bg-white', 'dark:bg-slate-700', 'text-slate-700', 'dark:text-slate-200');
        event.target.classList.add('active', 'bg-emerald-600', 'text-white');

        // تطبيق الفلتر
        switch (filter) {
            case 'all':
                this.filteredProphets = [...this.allProphets];
                break;
            case 'featured':
                this.filteredProphets = this.allProphets.filter(p => p.is_featured);
                break;
            case 'olulu-azm':
                const oluluAzmIds = ['noah', 'ibrahim', 'musa', 'isa', 'muhammad'];
                this.filteredProphets = this.allProphets.filter(p => oluluAzmIds.includes(p.id));
                break;
            default:
                this.filteredProphets = [...this.allProphets];
        }

        this.renderProphets();
    }

    searchProphets(query) {
        if (!query || query.trim() === '') {
            this.filteredProphets = [...this.allProphets];
        } else {
            const searchTerm = query.toLowerCase().trim();
            this.filteredProphets = this.allProphets.filter(prophet => {
                return (
                    prophet.name_arabic?.toLowerCase().includes(searchTerm) ||
                    prophet.name?.toLowerCase().includes(searchTerm) ||
                    prophet.story?.toLowerCase().includes(searchTerm) ||
                    prophet.lessons?.toLowerCase().includes(searchTerm)
                );
            });
        }

        this.renderProphets();
    }

    toggleFavorite(prophetId) {
        const prophet = this.allProphets.find(p => p.id === prophetId);
        if (!prophet) return;

        // هنا يمكن إضافة منطق حفظ المفضلة في localStorage أو قاعدة البيانات
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const existingIndex = favorites.findIndex(fav => fav.id === prophetId);

        if (existingIndex >= 0) {
            favorites.splice(existingIndex, 1);
            showToast('تم إزالة النبي من المفضلة', 'info');
        } else {
            favorites.push({
                id: prophetId,
                type: 'prophet',
                name: prophet.name_arabic,
                added_at: new Date().toISOString()
            });
            showToast('تم إضافة النبي للمفضلة', 'success');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    shareProphet(prophetId) {
        const prophet = this.allProphets.find(p => p.id === prophetId);
        if (!prophet) return;

        const shareData = {
            title: `قصة ${prophet.name_arabic}`,
            text: `تعرف على قصة ${prophet.name_arabic} والدروس المستفادة من سيرته العطرة`,
            url: `${window.location.origin}/prophets.html#${prophetId}`
        };

        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            // نسخ الرابط للحافظة
            navigator.clipboard.writeText(shareData.url).then(() => {
                showToast('تم نسخ الرابط للحافظة', 'success');
            }).catch(() => {
                showToast('فشل في نسخ الرابط', 'error');
            });
        }
    }

    printProphet(prophetId) {
        const prophet = this.allProphets.find(p => p.id === prophetId);
        if (!prophet) return;

        const printContent = `
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>قصة ${prophet.name_arabic}</title>
                <style>
                    body { font-family: 'Amiri', serif; line-height: 1.8; margin: 20px; }
                    h1 { color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px; }
                    h2 { color: #047857; margin-top: 30px; }
                    .content { margin: 20px 0; }
                    .lessons { background: #f0f9ff; padding: 15px; border-right: 4px solid #0ea5e9; }
                </style>
            </head>
            <body>
                <h1>${prophet.name_arabic}</h1>
                <div class="content">
                    <h2>القصة:</h2>
                    <p>${prophet.story || ''}</p>
                </div>
                <div class="lessons">
                    <h2>الدروس المستفادة:</h2>
                    <p>${prophet.lessons || ''}</p>
                </div>
                <footer style="margin-top: 40px; text-align: center; color: #666;">
                    <p>من موقع نور الهداية</p>
                </footer>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    showLoading() {
        const loadingState = document.getElementById('loadingState');
        const grid = document.getElementById('prophetsGrid');
        if (loadingState) loadingState.classList.remove('hidden');
        if (grid) grid.classList.add('hidden');
        this.isLoading = true;
    }

    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        const grid = document.getElementById('prophetsGrid');
        if (loadingState) loadingState.classList.add('hidden');
        if (grid) grid.classList.remove('hidden');
        this.isLoading = false;
    }

    showNoResults() {
        const noResults = document.getElementById('noResults');
        const grid = document.getElementById('prophetsGrid');
        if (noResults) noResults.classList.remove('hidden');
        if (grid) grid.innerHTML = '';
    }

    hideNoResults() {
        const noResults = document.getElementById('noResults');
        if (noResults) noResults.classList.add('hidden');
    }
}

// وظائف عامة للاستخدام في HTML
function filterProphets(filter) {
    if (window.prophetsPageManager) {
        window.prophetsPageManager.filterProphets(filter);
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && window.prophetsPageManager) {
        window.prophetsPageManager.searchProphets(searchInput.value);
    }
}

function closeModal() {
    if (window.prophetsPageManager) {
        window.prophetsPageManager.closeModal();
    }
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.prophetsPageManager = new ProphetsPageManager();
    
    // معالجة الرابط المباشر إلى نبي معين
    const hash = window.location.hash.substring(1);
    if (hash) {
        setTimeout(() => {
            window.prophetsPageManager.showProphetDetails(hash);
        }, 1000);
    }
});

console.log('تم تحميل صفحة قصص الأنبياء بنجاح ✨');