/**
 * ملف JavaScript الخاص بصفحة الصحابة الكرام
 * يحتوي على جميع الوظائف المتعلقة بعرض وإدارة تراجم الصحابة
 */

class CompanionsPageManager {
    constructor() {
        this.allCompanions = [];
        this.filteredCompanions = [];
        this.currentFilter = 'all';
        this.isLoading = false;
        this.currentModal = null;
        
        this.init();
    }

    async init() {
        await this.loadCompanions();
        this.setupEventListeners();
        this.renderCompanions();
        this.hideLoading();
    }

    async loadCompanions() {
        try {
            this.showLoading();
            const response = await companionsApi.getAll({ limit: 100, sort: 'name' });
            
            if (response && response.data) {
                this.allCompanions = response.data;
                this.filteredCompanions = [...this.allCompanions];
            } else {
                // البيانات التجريبية في حالة عدم وجود اتصال بقاعدة البيانات
                this.loadFallbackData();
            }
        } catch (error) {
            console.error('خطأ في تحميل الصحابة:', error);
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        this.allCompanions = [
            {
                id: 'abu_bakr',
                name: 'أبو بكر الصديق',
                kunya: 'أبو بكر',
                category: 'الخلفاء الراشدون',
                biography: 'عبد الله بن أبي قحافة، أول من آمن من الرجال، صاحب الرسول ﷺ في الهجرة، أول الخلفاء الراشدين. كان تاجراً معروفاً بالصدق والأمانة قبل الإسلام. لقب بالصديق لتصديقه للنبي ﷺ في حادثة الإسراء والمعراج. توفي سنة 13 هـ بعد خلافة دامت سنتين وثلاثة أشهر.',
                contributions: 'جمع القرآن في مصحف واحد، قضى على فتنة الردة، بدأ الفتوحات الإسلامية في العراق والشام، حافظ على وحدة الدولة الإسلامية بعد وفاة النبي ﷺ',
                is_featured: true,
                virtues: 'أول من آمن، صاحب الغار، خليفة رسول الله ﷺ، الصديق الأكبر',
                death_year: '13 هـ'
            },
            {
                id: 'umar',
                name: 'عمر بن الخطاب',
                kunya: 'أبو حفص',
                category: 'الخلفاء الراشدون',
                biography: 'الفاروق، ثاني الخلفاء الراشدين، أعز الله به الإسلام بعد إسلامه. كان من أشراف قريش في الجاهلية، عرف بالقوة والشجاعة والعدل. أسلم في السنة السادسة من البعثة وكان إسلامه فتحاً للمسلمين. استشهد على يد أبي لؤلؤة المجوسي سنة 23 هـ.',
                contributions: 'وضع التقويم الهجري، فتح بيت المقدس وإيلياء، أنشأ الدواوين، وسع الدولة الإسلامية، أسس نظام القضاء المستقل، وضع أسس الإدارة في الإسلام',
                is_featured: true,
                virtues: 'الفاروق، أمير المؤمنين، من العشرة المبشرين بالجنة، العادل الذي خاف منه الشيطان',
                death_year: '23 هـ'
            },
            {
                id: 'othman',
                name: 'عثمان بن عفان',
                kunya: 'أبو عبد الله',
                category: 'الخلفاء الراشدون',
                biography: 'ذو النورين، ثالث الخلفاء الراشدين، تزوج ابنتي الرسول ﷺ رقية ثم أم كلثوم. كان من أغنياء قريش وأكرمهم، أنفق ماله في سبيل الله. اشترى بئر رومة وتصدق بها للمسلمين. جهز جيش العسرة بماله. استشهد في داره سنة 35 هـ.',
                contributions: 'جمع القرآن في مصحف واحد ووزعه على الأمصار، توسيع الحرمين الشريفين، الفتوحات البحرية، توسع الدولة الإسلامية شرقاً وغرباً',
                is_featured: true,
                virtues: 'ذو النورين، من العشرة المبشرين بالجنة، الحيي الذي تستحي منه الملائكة، جامع القرآن',
                death_year: '35 هـ'
            },
            {
                id: 'ali',
                name: 'علي بن أبي طالب',
                kunya: 'أبو الحسن',
                category: 'الخلفاء الراشدون',
                biography: 'ابن عم الرسول ﷺ وزوج ابنته فاطمة، أول من أسلم من الصبيان، نام في فراش النبي ليلة الهجرة. عرف بالشجاعة والحكمة والعلم. كان أحد أبطال المسلمين في الغزوات، فتح حصن خيبر. رابع الخلفاء الراشدين، استشهد سنة 40 هـ على يد عبد الرحمن بن ملجم.',
                contributions: 'الجهاد في سبيل الله، نشر العلم والفقه، العدل في الحكم، إرساء قواعد البلاغة والحكمة، نهج البلاغة',
                is_featured: true,
                virtues: 'باب مدينة العلم، أسد الله الغالب، من العشرة المبشرين بالجنة، أبو الحسن والحسين',
                death_year: '40 هـ'
            },
            {
                id: 'khadija',
                name: 'خديجة بنت خويلد',
                kunya: 'أم المؤمنين',
                category: 'صحابيات',
                biography: 'أم المؤمنين، زوجة الرسول ﷺ الأولى، أول من آمن على الإطلاق. كانت تاجرة غنية معروفة بالطهارة والعفاف. تزوجها النبي ﷺ وعمره 25 سنة وعمرها 40 سنة. ثبتته ودعمته عند نزول الوحي. توفيت في عام الحزن قبل الهجرة بثلاث سنوات.',
                contributions: 'دعمت الرسول ﷺ معنوياً ومادياً، أنفقت مالها في سبيل الدعوة، ثبتت النبي عند بداية الوحي، كانت أول المؤمنين',
                is_featured: true,
                virtues: 'أم المؤمنين، أول من آمن، الطاهرة، سيدة نساء العالمين في زمانها',
                death_year: 'قبل الهجرة'
            },
            {
                id: 'aisha',
                name: 'عائشة بنت أبي بكر',
                kunya: 'أم المؤمنين',
                category: 'صحابيات',
                biography: 'أم المؤمنين، زوجة الرسول ﷺ، ابنة أبي بكر الصديق. عالمة فقيهة، راوية لأكثر من 2000 حديث. كانت من أذكى نساء عصرها وأعلمهن بالدين. توفي النبي ﷺ في حجرها. عاشت بعده 48 سنة تعلم الناس وتروي الأحاديث.',
                contributions: 'نقل السنة النبوية، تعليم النساء والرجال، الفقه والتفسير، حفظ آلاف الأحاديث النبوية، الإفتاء والتعليم',
                is_featured: true,
                virtues: 'أم المؤمنين، الصديقة بنت الصديق، أعلم النساء، المبرأة من فوق سبع سماوات',
                death_year: '58 هـ'
            },
            {
                id: 'hamza',
                name: 'حمزة بن عبد المطلب',
                kunya: 'أبو عمارة',
                category: 'قادة وفاتحون',
                biography: 'عم الرسول ﷺ وأخوه من الرضاعة، أسد الله وأسد رسوله. كان من أشجع العرب وأقواهم. أسلم في السنة الثانية من البعثة غضباً لرسول الله ﷺ. شارك في غزوة بدر وأبلى بلاءً حسناً. استشهد في غزوة أحد على يد وحشي الحبشي.',
                contributions: 'الدفاع عن الرسول والدعوة الإسلامية، القتال في سبيل الله، حماية المسلمين في مكة، البطولة في المعارك',
                is_featured: true,
                virtues: 'أسد الله وأسد رسوله، سيد الشهداء، عم الرسول ﷺ وحاميه',
                death_year: '3 هـ (أحد)'
            },
            {
                id: 'khalid',
                name: 'خالد بن الوليد',
                kunya: 'أبو سليمان',
                category: 'قادة وفاتحون',
                biography: 'سيف الله المسلول، أحد أعظم القادة العسكريين في التاريخ. كان قائداً لقريش قبل إسلامه، أسلم بعد صلح الحديبية. لم يهزم في معركة قط لا في الجاهلية ولا في الإسلام. قاد الفتوحات في العراق والشام. توفي في حمص سنة 21 هـ.',
                contributions: 'قتال أهل الردة، فتح العراق، فتح بلاد الشام، انتصارات عسكرية لا تحصى، وضع أسس الاستراتيجية العسكرية الإسلامية',
                is_featured: true,
                virtues: 'سيف الله المسلول، القائد المظفر، فاتح العراق والشام، العبقري العسكري',
                death_year: '21 هـ'
            },
            {
                id: 'saad',
                name: 'سعد بن أبي وقاص',
                kunya: 'أبو إسحاق',
                category: 'العشرة المبشرون',
                biography: 'من السابقين الأولين للإسلام ومن العشرة المبشرين بالجنة. أول من رمى بسهم في سبيل الله. قائد معركة القادسية التي فتحت العراق وأسقطت الإمبراطورية الساسانية. كان مستجاب الدعوة. توفي سنة 55 هـ وهو آخر من مات من العشرة المبشرين.',
                contributions: 'فتح العراق وإسقاط الإمبراطورية الساسانية، قيادة معركة القادسية، نشر الإسلام في المشرق، القتال في جميع الغزوات مع النبي ﷺ',
                is_featured: true,
                virtues: 'من العشرة المبشرين بالجنة، أول من رمى بسهم في الإسلام، مستجاب الدعوة، فاتح العراق',
                death_year: '55 هـ'
            },
            {
                id: 'ibn_abbas',
                name: 'عبد الله بن عباس',
                kunya: 'أبو العباس',
                category: 'علماء وفقهاء',
                biography: 'ابن عم الرسول ﷺ، حبر الأمة وترجمان القرآن. دعا له النبي ﷺ بالفقه في الدين والحكمة. كان من أعلم الصحابة بالتفسير والفقه واللغة. روى الكثير من الأحاديث وفسر القرآن. توفي سنة 68 هـ في الطائف.',
                contributions: 'تفسير القرآن الكريم، نقل العلم والحديث، الفقه والاجتهاد، تعليم الأجيال، وضع أسس علم التفسير',
                is_featured: true,
                virtues: 'حبر الأمة، ترجمان القرآن، من أعلم الصحابة، ابن عم النبي ﷺ',
                death_year: '68 هـ'
            },
            {
                id: 'abu_hurairah',
                name: 'أبو هريرة الدوسي',
                kunya: 'أبو هريرة',
                category: 'علماء وفقهاء',
                biography: 'عبد الرحمن بن صخر الدوسي، أكثر الصحابة رواية للحديث النبوي. أسلم سنة 7 هـ ولازم النبي ﷺ ملازمة شديدة. روى أكثر من 5374 حديث. كان فقيراً متفرغاً لطلب العلم. دعا له النبي ﷺ بقوة الحفظ فلم ينس شيئاً سمعه. توفي سنة 59 هـ.',
                contributions: 'حفظ ونقل السنة النبوية، رواية آلاف الأحاديث، تعليم الناس، نشر العلم النبوي في الأمصار',
                is_featured: true,
                virtues: 'أكثر الصحابة رواية للحديث، الحافظ المتقن، صاحب الذاكرة القوية، محب العلم',
                death_year: '59 هـ'
            },
            {
                id: 'fatimah',
                name: 'فاطمة بنت محمد',
                kunya: 'أم أبيها',
                category: 'صحابيات',
                biography: 'ابنة رسول الله ﷺ وزوجة علي بن أبي طالب، أم الحسن والحسين. سيدة نساء العالمين. كانت أحب الناس إلى النبي ﷺ بعد عائشة. عرفت بالزهد والتقوى والصبر. توفيت بعد وفاة أبيها بستة أشهر سنة 11 هـ.',
                contributions: 'القدوة في التقوى والصبر، تربية الحسن والحسين، نموذج للمرأة المسلمة، حفظ آل البيت',
                is_featured: true,
                virtues: 'سيدة نساء العالمين، البتول، أم أبيها، بضعة من النبي ﷺ',
                death_year: '11 هـ'
            }
        ];
        this.filteredCompanions = [...this.allCompanions];
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
                    this.searchCompanions(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchCompanions(e.target.value);
                }
            });
        }

        // إغلاق النافذة عند النقر خارجها
        const modal = document.getElementById('companionModal');
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

    renderCompanions() {
        const grid = document.getElementById('companionsGrid');
        if (!grid) return;

        if (this.filteredCompanions.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();

        const companionsHTML = this.filteredCompanions.map(companion => {
            return this.createCompanionCard(companion);
        }).join('');

        grid.innerHTML = companionsHTML;

        // إضافة الرسوم المتحركة
        setTimeout(() => {
            const cards = grid.querySelectorAll('.companion-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-fadeInUp');
                }, index * 100);
            });
        }, 50);
    }

    createCompanionCard(companion) {
        const isKhalifa = companion.category === 'الخلفاء الراشدون';
        const isSahabiya = companion.category === 'صحابيات';
        const isAshra = companion.category === 'العشرة المبشرون';
        
        let badgeClass, badgeText, gradientClass;
        
        if (isKhalifa) {
            badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            badgeText = 'خليفة راشد';
            gradientClass = 'from-green-400 to-emerald-500';
        } else if (isSahabiya) {
            badgeClass = 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
            badgeText = 'صحابية';
            gradientClass = 'from-pink-400 to-rose-500';
        } else if (isAshra) {
            badgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
            badgeText = 'من العشرة';
            gradientClass = 'from-amber-400 to-orange-500';
        } else {
            badgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            badgeText = 'صحابي كريم';
            gradientClass = 'from-purple-400 to-violet-500';
        }

        const iconClass = isSahabiya ? 'fa-female' : 'fa-male';

        return `
            <article class="companion-card card group cursor-pointer transform transition-all duration-300 hover:scale-105" 
                     onclick="companionsPageManager.showCompanionDetails('${companion.id}')">
                <div class="relative">
                    <!-- شارة الصحابي -->
                    <div class="absolute top-4 right-4 z-10">
                        <span class="inline-block px-3 py-1 text-xs font-medium rounded-full ${badgeClass}">
                            ${badgeText}
                        </span>
                    </div>

                    <!-- أيقونة الصحابي -->
                    <div class="text-center mb-6 pt-4">
                        <div class="w-20 h-20 mx-auto bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            <i class="fas ${iconClass}"></i>
                        </div>
                        <div class="w-16 h-1 bg-gradient-to-r ${gradientClass} rounded-full mx-auto"></div>
                    </div>

                    <!-- معلومات الصحابي -->
                    <div class="text-center mb-6">
                        <h3 class="font-amiri text-2xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            ${companion.name}
                        </h3>
                        ${companion.kunya ? `<p class="text-slate-500 dark:text-slate-400 text-sm mb-3">${companion.kunya}</p>` : ''}
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                            ${this.truncateText(companion.biography || '', 120)}
                        </p>
                    </div>

                    <!-- المناقب -->
                    <div class="mb-6">
                        <h4 class="font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                            <i class="fas fa-star text-amber-500 ml-2"></i>
                            المناقب والفضائل
                        </h4>
                        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            ${this.truncateText(companion.virtues || '', 80)}
                        </p>
                    </div>

                    <!-- معلومات إضافية -->
                    <div class="mb-6 flex items-center justify-between text-sm">
                        <div class="flex items-center space-x-1 space-x-reverse text-slate-500 dark:text-slate-400">
                            <i class="fas fa-users text-purple-500"></i>
                            <span>${companion.category}</span>
                        </div>
                        ${companion.death_year ? `
                        <div class="flex items-center space-x-1 space-x-reverse text-slate-500 dark:text-slate-400">
                            <i class="fas fa-calendar text-purple-500"></i>
                            <span>${companion.death_year}</span>
                        </div>
                        ` : ''}
                    </div>

                    <!-- أزرار الإجراءات -->
                    <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-600">
                        <button class="flex items-center space-x-2 space-x-reverse text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-sm font-medium">
                            <i class="fas fa-book-open"></i>
                            <span>قراءة الترجمة</span>
                        </button>
                        <div class="flex items-center space-x-2 space-x-reverse text-slate-400">
                            <button onclick="event.stopPropagation(); companionsPageManager.toggleFavorite('${companion.id}')" 
                                    class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-red-500 transition-all duration-200"
                                    title="إضافة للمفضلة">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button onclick="event.stopPropagation(); companionsPageManager.shareCompanion('${companion.id}')"
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

    showCompanionDetails(companionId) {
        const companion = this.allCompanions.find(c => c.id === companionId);
        if (!companion) return;

        const modal = document.getElementById('companionModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        if (!modal || !modalTitle || !modalContent) return;

        modalTitle.textContent = companion.name;

        const isSahabiya = companion.category === 'صحابيات';
        const iconClass = isSahabiya ? 'fa-female' : 'fa-male';
        const gradientClass = isSahabiya ? 'from-pink-400 to-rose-500' : 'from-purple-400 to-violet-500';

        modalContent.innerHTML = `
            <div class="space-y-8">
                <!-- رأس الترجمة -->
                <div class="text-center border-b border-slate-200 dark:border-slate-600 pb-6">
                    <div class="w-24 h-24 mx-auto bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center text-white text-4xl mb-4">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <h2 class="font-amiri text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        ${companion.name}
                    </h2>
                    ${companion.kunya ? `<p class="text-slate-500 dark:text-slate-400 text-xl mb-4">${companion.kunya}</p>` : ''}
                    <div class="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full font-medium">
                        ${companion.category}
                    </div>
                </div>

                <!-- الترجمة والسيرة -->
                <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                    <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center">
                        <i class="fas fa-user text-purple-500 ml-3"></i>
                        الترجمة والسيرة
                    </h4>
                    <div class="prose dark:prose-invert max-w-none">
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-amiri">
                            ${companion.biography || 'ترجمة هذا الصحابي الكريم قيد الإعداد...'}
                        </p>
                    </div>
                </div>

                <!-- المناقب والفضائل -->
                <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
                    <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center">
                        <i class="fas fa-star text-amber-500 ml-3"></i>
                        المناقب والفضائل
                    </h4>
                    <div class="prose dark:prose-invert max-w-none">
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            ${companion.virtues || 'المناقب والفضائل قيد الإعداد...'}
                        </p>
                    </div>
                </div>

                <!-- الإسهامات والأعمال -->
                <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6">
                    <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center">
                        <i class="fas fa-hands-helping text-emerald-500 ml-3"></i>
                        الإسهامات والأعمال
                    </h4>
                    <div class="prose dark:prose-invert max-w-none">
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            ${companion.contributions || 'الإسهامات والأعمال قيد الإعداد...'}
                        </p>
                    </div>
                </div>

                <!-- معلومات إضافية -->
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                        <h5 class="font-medium text-slate-800 dark:text-white mb-2 flex items-center">
                            <i class="fas fa-users text-blue-500 ml-2"></i>
                            الفئة
                        </h5>
                        <p class="text-slate-600 dark:text-slate-300">
                            ${companion.category}
                        </p>
                    </div>
                    
                    ${companion.death_year ? `
                    <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                        <h5 class="font-medium text-slate-800 dark:text-white mb-2 flex items-center">
                            <i class="fas fa-calendar text-gray-500 ml-2"></i>
                            سنة الوفاة
                        </h5>
                        <p class="text-slate-600 dark:text-slate-300">
                            ${companion.death_year}
                        </p>
                    </div>
                    ` : ''}
                </div>

                <!-- الروابط المرتبطة -->
                <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                    <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center">
                        <i class="fas fa-link text-emerald-500 ml-3"></i>
                        مواضيع مرتبطة
                    </h4>
                    <div class="grid md:grid-cols-3 gap-3">
                        <a href="seerah.html" class="flex items-center space-x-2 space-x-reverse p-3 bg-white dark:bg-slate-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors">
                            <i class="fas fa-moon text-blue-500"></i>
                            <span class="text-slate-700 dark:text-slate-200">السيرة النبوية</span>
                        </a>
                        <a href="battles.html" class="flex items-center space-x-2 space-x-reverse p-3 bg-white dark:bg-slate-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors">
                            <i class="fas fa-shield-alt text-amber-500"></i>
                            <span class="text-slate-700 dark:text-slate-200">الغزوات</span>
                        </a>
                        <a href="qna.html" class="flex items-center space-x-2 space-x-reverse p-3 bg-white dark:bg-slate-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors">
                            <i class="fas fa-question-circle text-teal-500"></i>
                            <span class="text-slate-700 dark:text-slate-200">أسئلة وأجوبة</span>
                        </a>
                    </div>
                </div>

                <!-- أزرار الإجراءات -->
                <div class="flex flex-wrap gap-3 pt-6 border-t border-slate-200 dark:border-slate-600">
                    <button onclick="companionsPageManager.toggleFavorite('${companion.id}')" 
                            class="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors font-medium">
                        <i class="fas fa-heart"></i>
                        <span>إضافة للمفضلة</span>
                    </button>
                    <button onclick="companionsPageManager.shareCompanion('${companion.id}')"
                            class="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors font-medium">
                        <i class="fas fa-share-alt"></i>
                        <span>مشاركة</span>
                    </button>
                    <button onclick="companionsPageManager.printCompanion('${companion.id}')"
                            class="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium">
                        <i class="fas fa-print"></i>
                        <span>طباعة</span>
                    </button>
                    <button onclick="companionsPageManager.downloadCompanion('${companion.id}')"
                            class="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl transition-colors font-medium">
                        <i class="fas fa-download"></i>
                        <span>تحميل</span>
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
        const modal = document.getElementById('companionModal');
        if (modal) {
            modal.classList.add('hidden');
            this.currentModal = null;
            document.body.style.overflow = '';
        }
    }

    filterCompanions(filter) {
        this.currentFilter = filter;

        // تحديث أزرار الفلتر
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-purple-600', 'text-white');
            btn.classList.add('bg-white', 'dark:bg-slate-700', 'text-slate-700', 'dark:text-slate-200');
        });

        event.target.classList.remove('bg-white', 'dark:bg-slate-700', 'text-slate-700', 'dark:text-slate-200');
        event.target.classList.add('active', 'bg-purple-600', 'text-white');

        // تطبيق الفلتر
        switch (filter) {
            case 'all':
                this.filteredCompanions = [...this.allCompanions];
                break;
            case 'khulafa':
                this.filteredCompanions = this.allCompanions.filter(c => c.category === 'الخلفاء الراشدون');
                break;
            case 'ashra':
                this.filteredCompanions = this.allCompanions.filter(c => c.category === 'العشرة المبشرون');
                break;
            case 'sahabiyat':
                this.filteredCompanions = this.allCompanions.filter(c => c.category === 'صحابيات');
                break;
            case 'ulama':
                this.filteredCompanions = this.allCompanions.filter(c => c.category === 'علماء وفقهاء');
                break;
            default:
                this.filteredCompanions = [...this.allCompanions];
        }

        this.renderCompanions();
    }

    searchCompanions(query) {
        if (!query || query.trim() === '') {
            this.filteredCompanions = [...this.allCompanions];
        } else {
            const searchTerm = query.toLowerCase().trim();
            this.filteredCompanions = this.allCompanions.filter(companion => {
                return (
                    companion.name?.toLowerCase().includes(searchTerm) ||
                    companion.kunya?.toLowerCase().includes(searchTerm) ||
                    companion.biography?.toLowerCase().includes(searchTerm) ||
                    companion.contributions?.toLowerCase().includes(searchTerm) ||
                    companion.virtues?.toLowerCase().includes(searchTerm) ||
                    companion.category?.toLowerCase().includes(searchTerm)
                );
            });
        }

        this.renderCompanions();
    }

    toggleFavorite(companionId) {
        const companion = this.allCompanions.find(c => c.id === companionId);
        if (!companion) return;

        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const existingIndex = favorites.findIndex(fav => fav.id === companionId);

        if (existingIndex >= 0) {
            favorites.splice(existingIndex, 1);
            showToast('تم إزالة الصحابي من المفضلة', 'info');
        } else {
            favorites.push({
                id: companionId,
                type: 'companion',
                name: companion.name,
                added_at: new Date().toISOString()
            });
            showToast('تم إضافة الصحابي للمفضلة', 'success');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    shareCompanion(companionId) {
        const companion = this.allCompanions.find(c => c.id === companionId);
        if (!companion) return;

        const shareData = {
            title: `${companion.name}`,
            text: `تعرف على ترجمة ${companion.name} وإسهاماته في الإسلام`,
            url: `${window.location.origin}/companions.html#${companionId}`
        };

        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareData.url).then(() => {
                showToast('تم نسخ الرابط للحافظة', 'success');
            }).catch(() => {
                showToast('فشل في نسخ الرابط', 'error');
            });
        }
    }

    printCompanion(companionId) {
        const companion = this.allCompanions.find(c => c.id === companionId);
        if (!companion) return;

        const printContent = `
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>${companion.name}</title>
                <style>
                    body { font-family: 'Amiri', serif; line-height: 1.8; margin: 20px; }
                    h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
                    h2 { color: #6d28d9; margin-top: 30px; }
                    .content { margin: 20px 0; }
                    .section { background: #faf5ff; padding: 15px; border-right: 4px solid #8b5cf6; margin: 20px 0; }
                    .info { display: flex; gap: 20px; margin: 15px 0; }
                </style>
            </head>
            <body>
                <h1>${companion.name}</h1>
                ${companion.kunya ? `<div class="info"><div><strong>الكنية:</strong> ${companion.kunya}</div></div>` : ''}
                <div class="info">
                    <div><strong>الفئة:</strong> ${companion.category}</div>
                    ${companion.death_year ? `<div><strong>سنة الوفاة:</strong> ${companion.death_year}</div>` : ''}
                </div>
                
                <div class="section">
                    <h2>الترجمة والسيرة:</h2>
                    <p>${companion.biography || ''}</p>
                </div>
                
                <div class="section">
                    <h2>المناقب والفضائل:</h2>
                    <p>${companion.virtues || ''}</p>
                </div>
                
                <div class="section">
                    <h2>الإسهامات والأعمال:</h2>
                    <p>${companion.contributions || ''}</p>
                </div>
                
                <footer style="margin-top: 40px; text-align: center; color: #666;">
                    <p>من موقع نور الهداية - الصحابة الكرام</p>
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

    downloadCompanion(companionId) {
        const companion = this.allCompanions.find(c => c.id === companionId);
        if (!companion) return;

        const content = `
${companion.name}
${'='.repeat(companion.name.length)}

الكنية: ${companion.kunya || 'غير محدد'}
الفئة: ${companion.category}
سنة الوفاة: ${companion.death_year || 'غير محدد'}

الترجمة والسيرة:
${companion.biography || ''}

المناقب والفضائل:
${companion.virtues || ''}

الإسهامات والأعمال:
${companion.contributions || ''}

---
من موقع نور الهداية
        `.trim();

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${companion.name.replace(/[^\w\s]/gi, '')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast('تم تحميل الملف بنجاح', 'success');
    }

    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    showLoading() {
        const loadingState = document.getElementById('loadingState');
        const grid = document.getElementById('companionsGrid');
        if (loadingState) loadingState.classList.remove('hidden');
        if (grid) grid.classList.add('hidden');
        this.isLoading = true;
    }

    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        const grid = document.getElementById('companionsGrid');
        if (loadingState) loadingState.classList.add('hidden');
        if (grid) grid.classList.remove('hidden');
        this.isLoading = false;
    }

    showNoResults() {
        const noResults = document.getElementById('noResults');
        const grid = document.getElementById('companionsGrid');
        if (noResults) noResults.classList.remove('hidden');
        if (grid) grid.innerHTML = '';
    }

    hideNoResults() {
        const noResults = document.getElementById('noResults');
        if (noResults) noResults.classList.add('hidden');
    }
}

// وظائف عامة للاستخدام في HTML
function filterCompanions(filter) {
    if (window.companionsPageManager) {
        window.companionsPageManager.filterCompanions(filter);
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && window.companionsPageManager) {
        window.companionsPageManager.searchCompanions(searchInput.value);
    }
}

function closeModal() {
    if (window.companionsPageManager) {
        window.companionsPageManager.closeModal();
    }
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.companionsPageManager = new CompanionsPageManager();
    
    // معالجة الرابط المباشر إلى صحابي معين
    const hash = window.location.hash.substring(1);
    if (hash) {
        setTimeout(() => {
            window.companionsPageManager.showCompanionDetails(hash);
        }, 1000);
    }
});

console.log('تم تحميل صفحة الصحابة الكرام بنجاح ✨');