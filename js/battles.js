/**
 * ملف JavaScript الخاص بصفحة الغزوات والسرايا
 * يحتوي على جميع الوظائف المتعلقة بعرض وإدارة الغزوات
 */

class BattlesPageManager {
    constructor() {
        this.allBattles = [];
        this.filteredBattles = [];
        this.currentFilter = 'all';
        this.isLoading = false;
        this.currentModal = null;
        
        this.init();
    }

    async init() {
        await this.loadBattles();
        this.setupEventListeners();
        this.renderBattles();
        this.hideLoading();
    }

    async loadBattles() {
        try {
            this.showLoading();
            const response = await battlesApi.getAll({ limit: 50, sort: 'hijri_date' });
            
            if (response && response.data) {
                this.allBattles = response.data;
                this.filteredBattles = [...this.allBattles];
            } else {
                // البيانات التجريبية في حالة عدم وجود اتصال بقاعدة البيانات
                this.loadFallbackData();
            }
        } catch (error) {
            console.error('خطأ في تحميل الغزوات:', error);
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        this.allBattles = [
            {
                id: 'badr',
                name: 'غزوة بدر الكبرى',
                description: 'أول معركة فاصلة في تاريخ الإسلام، سميت يوم الفرقان',
                hijri_date: '17 رمضان 2هـ',
                location: 'بدر',
                start_events: 'خرج الرسول ﷺ لملاحقة قافلة قريش التجارية، ولكن استعدت قريش جيشاً لقتال المسلمين',
                main_events: 'التقى الجيشان في بدر. دعا الرسول ربه واستغاث. قتل عتبة وشيبة والوليد وأبو جهل. نصر الله المسلمين بالملائكة.',
                results: 'انتصار عظيم للمسلمين. 70 قتيل و 70 أسير من قريش. 14 شهيد من المسلمين. قوي مركز الدولة الإسلامية.',
                lessons: 'النصر من عند الله، أهمية الدعاء والاستغاثة، قيمة التضحية في سبيل الله',
                type: 'major',
                period: 'medina'
            },
            {
                id: 'uhud',
                name: 'غزوة أحد',
                description: 'معركة عظة وابتلاء للمسلمين',
                hijri_date: '7 شوال 3هـ',
                location: 'جبل أحد',
                start_events: 'جاءت قريش بجيش عظيم (3000 مقاتل) للانتقام من هزيمة بدر',
                main_events: 'بدأت المعركة بانتصار المسلمين. خالف الرماة أوامر الرسول وتركوا مواقعهم. هاجم خالد بن الوليد من الخلف. جرح الرسول ﷺ.',
                results: 'استشهاد حمزة و 70 من المسلمين. انسحبت قريش دون تحقيق هدفها في احتلال المدينة.',
                lessons: 'أهمية الطاعة، عواقب مخالفة الأوامر، الصبر عند الابتلاء',
                type: 'major',
                period: 'medina'
            },
            {
                id: 'ahzab',
                name: 'غزوة الأحزاب (الخندق)',
                description: 'معركة الخندق والحصار',
                hijri_date: 'شوال 5هـ',
                location: 'المدينة المنورة',
                start_events: 'تحالفت قبائل عديدة لمحاصرة المدينة. اقترح سلمان الفارسي حفر خندق',
                main_events: 'حاصرت الأحزاب المدينة شهراً. غدرت بنو قريظة. قتل عمرو بن عبد ود. أرسل الله ريحاً فرقت الأحزاب.',
                results: 'انسحبت الأحزاب خائبة. قضى على بني قريظة. أمن المدينة نهائياً.',
                lessons: 'قيمة الشورى، أهمية التخطيط، عواقب الغدر ونقض العهد',
                type: 'major',
                period: 'medina'
            },
            {
                id: 'mecca_conquest',
                name: 'فتح مكة المكرمة',
                description: 'الفتح المبين وعودة الرسول منتصراً',
                hijri_date: '20 رمضان 8هـ',
                location: 'مكة المكرمة',
                start_events: 'نقضت قريش صلح الحديبية. تحرك الرسول ﷺ بجيش 10 آلاف مقاتل',
                main_events: 'دخل الرسول ﷺ مكة من أربعة اتجاهات. لم تقاوم قريش إلا قليلاً. حطم الأصنام وطهر الكعبة.',
                results: 'اعتنق معظم أهل مكة الإسلام. عفو عام عن أهل مكة. عادت مكة إلى الإسلام.',
                lessons: 'العفو عند المقدرة، الحلم والرحمة، نصر الله للمؤمنين',
                type: 'major',
                period: 'medina'
            },
            {
                id: 'hunayn',
                name: 'غزوة حنين',
                description: 'معركة ضد قبيلتي هوازن وثقيف',
                hijri_date: 'شوال 8هـ',
                location: 'وادي حنين',
                start_events: 'تحالفت قبيلتا هوازن وثقيف لمقاتلة المسلمين بعد فتح مكة',
                main_events: 'أعجب بعض المسلمين بكثرتهم فهُزموا في البداية. ثبت النبي ﷺ ونادى المسلمين. عاد المسلمون وانتصروا.',
                results: 'انتصار المسلمين وغنائم كثيرة. إسلام بعض قبائل هوازن. توزيع الغنائم على المؤلفة قلوبهم.',
                lessons: 'الثقة يجب أن تكون بالله وحده، خطر الإعجاب بالنفس، حكمة القائد في إدارة الأزمات',
                type: 'major',
                period: 'medina'
            },
            {
                id: 'tabuk',
                name: 'غزوة تبوك',
                description: 'آخر غزوات الرسول ﷺ وغزوة العسرة',
                hijri_date: 'رجب 9هـ',
                location: 'تبوك',
                start_events: 'بلغ النبي ﷺ أن الروم تجمع جيشاً لغزو المسلمين من الشام',
                main_events: 'خرج النبي ﷺ بجيش كبير في وقت شدة وحر. وصل إلى تبوك ولم يجد عدواً. أقام هناك عدة أيام.',
                results: 'أظهر قوة المسلمين للقبائل العربية والروم. عاد دون قتال. تخلف بعض المسلمين وتابوا.',
                lessons: 'أهمية الاستعداد والتأهب، قبول التوبة، اختبار الإيمان في الشدة',
                type: 'major',
                period: 'medina'
            },
            {
                id: 'muta',
                name: 'غزوة مؤتة',
                description: 'أول غزوة يقودها خالد بن الوليد',
                hijri_date: 'جمادى الأولى 8هـ',
                location: 'مؤتة (الأردن)',
                start_events: 'أرسل النبي ﷺ جيشاً بقيادة زيد بن حارثة للرد على قتل الحارث بن عمير',
                main_events: 'استشهد زيد ثم جعفر ثم عبد الله بن رواحة. تولى خالد بن الوليد القيادة وانسحب بالجيش.',
                results: 'انسحاب آمن للجيش الإسلامي. إظهار شجاعة المسلمين. بداية شهرة خالد كقائد.',
                lessons: 'التضحية والفداء، أهمية القيادة الحكيمة، الشجاعة في المعارك',
                type: 'major',
                period: 'medina'
            },
            {
                id: 'khaybar',
                name: 'غزوة خيبر',
                description: 'فتح حصون خيبر اليهودية',
                hijri_date: 'محرم 7هـ',
                location: 'خيبر',
                start_events: 'خطط يهود خيبر مع الأحزاب ضد المسلمين، فقرر النبي ﷺ توجيه ضربة لهم',
                main_events: 'حاصر المسلمون حصون خيبر واحداً بعد الآخر. فتح علي بن أبي طالب حصن القموص. استسلم يهود خيبر.',
                results: 'فتح جميع حصون خيبر. عقد صلح مع يهود خيبر للبقاء مقابل نصف الثمار. غنائم كثيرة.',
                lessons: 'عاقبة الغدر والخيانة، العدل مع المغلوبين، شجاعة علي بن أبي طالب',
                type: 'major',
                period: 'medina'
            }
        ];
        this.filteredBattles = [...this.allBattles];
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
                    this.searchBattles(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchBattles(e.target.value);
                }
            });
        }

        // إغلاق النافذة عند النقر خارجها
        const modal = document.getElementById('battleModal');
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

    renderBattles() {
        const grid = document.getElementById('battlesGrid');
        if (!grid) return;

        if (this.filteredBattles.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();

        const battlesHTML = this.filteredBattles.map(battle => {
            return this.createBattleCard(battle);
        }).join('');

        grid.innerHTML = battlesHTML;

        // إضافة الرسوم المتحركة
        setTimeout(() => {
            const cards = grid.querySelectorAll('.battle-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-fadeInUp');
                }, index * 100);
            });
        }, 50);
    }

    createBattleCard(battle) {
        const isMajor = battle.type === 'major';
        const badgeClass = isMajor ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
        const badgeText = isMajor ? 'غزوة كبرى' : 'غزوة';

        return `
            <article class="battle-card card group cursor-pointer transform transition-all duration-300 hover:scale-105" 
                     onclick="battlesPageManager.showBattleDetails('${battle.id}')">
                <div class="relative">
                    <!-- شارة الغزوة -->
                    <div class="absolute top-4 right-4 z-10">
                        <span class="inline-block px-3 py-1 text-xs font-medium rounded-full ${badgeClass}">
                            ${badgeText}
                        </span>
                    </div>

                    <!-- أيقونة الغزوة -->
                    <div class="text-center mb-6 pt-4">
                        <div class="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto"></div>
                    </div>

                    <!-- معلومات الغزوة -->
                    <div class="text-center mb-6">
                        <h3 class="font-amiri text-2xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            ${battle.name}
                        </h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-3">
                            ${this.truncateText(battle.description || '', 120)}
                        </p>
                        <div class="flex items-center justify-center space-x-4 space-x-reverse text-sm text-slate-500 dark:text-slate-400">
                            <div class="flex items-center space-x-1 space-x-reverse">
                                <i class="fas fa-calendar-alt text-amber-500"></i>
                                <span>${battle.hijri_date}</span>
                            </div>
                            <div class="flex items-center space-x-1 space-x-reverse">
                                <i class="fas fa-map-marker-alt text-amber-500"></i>
                                <span>${battle.location}</span>
                            </div>
                        </div>
                    </div>

                    <!-- الدروس المستفادة -->
                    <div class="mb-6">
                        <h4 class="font-medium text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                            <i class="fas fa-lightbulb text-amber-500 ml-2"></i>
                            الدروس المستفادة
                        </h4>
                        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            ${this.truncateText(battle.lessons || '', 80)}
                        </p>
                    </div>

                    <!-- أزرار الإجراءات -->
                    <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-600">
                        <button class="flex items-center space-x-2 space-x-reverse text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors text-sm font-medium">
                            <i class="fas fa-book-open"></i>
                            <span>قراءة التفاصيل</span>
                        </button>
                        <div class="flex items-center space-x-2 space-x-reverse text-slate-400">
                            <button onclick="event.stopPropagation(); battlesPageManager.toggleFavorite('${battle.id}')" 
                                    class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-red-500 transition-all duration-200"
                                    title="إضافة للمفضلة">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button onclick="event.stopPropagation(); battlesPageManager.shareBattle('${battle.id}')"
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

    showBattleDetails(battleId) {
        const battle = this.allBattles.find(b => b.id === battleId);
        if (!battle) return;

        const modal = document.getElementById('battleModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        if (!modal || !modalTitle || !modalContent) return;

        modalTitle.textContent = battle.name;

        modalContent.innerHTML = `
            <div class="space-y-8">
                <!-- رأس الغزوة -->
                <div class="text-center border-b border-slate-200 dark:border-slate-600 pb-6">
                    <div class="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-4xl mb-4">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h2 class="font-amiri text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        ${battle.name}
                    </h2>
                    <p class="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-4">
                        ${battle.description}
                    </p>
                    <div class="flex items-center justify-center space-x-6 space-x-reverse text-sm text-slate-500 dark:text-slate-400">
                        <div class="flex items-center space-x-1 space-x-reverse">
                            <i class="fas fa-calendar-alt text-amber-500"></i>
                            <span>${battle.hijri_date}</span>
                        </div>
                        <div class="flex items-center space-x-1 space-x-reverse">
                            <i class="fas fa-map-marker-alt text-amber-500"></i>
                            <span>${battle.location}</span>
                        </div>
                    </div>
                </div>

                <!-- أحداث الغزوة -->
                <div class="grid gap-6">
                    <!-- بداية الأحداث -->
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                        <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center">
                            <i class="fas fa-play-circle text-blue-500 ml-3"></i>
                            بداية الأحداث
                        </h4>
                        <div class="prose dark:prose-invert max-w-none">
                            <p class="text-slate-600 dark:text-slate-300 leading-relaxed font-amiri text-lg">
                                ${battle.start_events || 'تفاصيل بداية الأحداث قيد الإعداد...'}
                            </p>
                        </div>
                    </div>

                    <!-- سير المعركة -->
                    <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
                        <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center">
                            <i class="fas fa-sword text-amber-500 ml-3"></i>
                            سير المعركة
                        </h4>
                        <div class="prose dark:prose-invert max-w-none">
                            <p class="text-slate-600 dark:text-slate-300 leading-relaxed font-amiri text-lg">
                                ${battle.main_events || 'تفاصيل سير المعركة قيد الإعداد...'}
                            </p>
                        </div>
                    </div>

                    <!-- النتائج -->
                    <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                        <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center">
                            <i class="fas fa-trophy text-green-500 ml-3"></i>
                            النتائج والعواقب
                        </h4>
                        <div class="prose dark:prose-invert max-w-none">
                            <p class="text-slate-600 dark:text-slate-300 leading-relaxed font-amiri text-lg">
                                ${battle.results || 'تفاصيل النتائج قيد الإعداد...'}
                            </p>
                        </div>
                    </div>

                    <!-- الدروس المستفادة -->
                    <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                        <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center">
                            <i class="fas fa-lightbulb text-purple-500 ml-3"></i>
                            الدروس والعبر المستفادة
                        </h4>
                        <div class="prose dark:prose-invert max-w-none">
                            <p class="text-slate-600 dark:text-slate-300 leading-relaxed font-amiri text-lg">
                                ${battle.lessons || 'الدروس المستفادة قيد الإعداد...'}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- معلومات إضافية -->
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                        <h5 class="font-medium text-slate-800 dark:text-white mb-2 flex items-center">
                            <i class="fas fa-flag text-red-500 ml-2"></i>
                            نوع المعركة
                        </h5>
                        <p class="text-slate-600 dark:text-slate-300">
                            ${battle.type === 'major' ? 'غزوة كبرى' : 'غزوة أو سرية'}
                        </p>
                    </div>
                    
                    <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                        <h5 class="font-medium text-slate-800 dark:text-white mb-2 flex items-center">
                            <i class="fas fa-clock text-blue-500 ml-2"></i>
                            الفترة الزمنية
                        </h5>
                        <p class="text-slate-600 dark:text-slate-300">
                            ${battle.period === 'mecca' ? 'الفترة المكية' : 'الفترة المدنية'}
                        </p>
                    </div>
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
                        <a href="companions.html" class="flex items-center space-x-2 space-x-reverse p-3 bg-white dark:bg-slate-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors">
                            <i class="fas fa-users text-purple-500"></i>
                            <span class="text-slate-700 dark:text-slate-200">الصحابة</span>
                        </a>
                        <a href="qna.html" class="flex items-center space-x-2 space-x-reverse p-3 bg-white dark:bg-slate-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors">
                            <i class="fas fa-question-circle text-teal-500"></i>
                            <span class="text-slate-700 dark:text-slate-200">أسئلة وأجوبة</span>
                        </a>
                    </div>
                </div>

                <!-- أزرار الإجراءات -->
                <div class="flex flex-wrap gap-3 pt-6 border-t border-slate-200 dark:border-slate-600">
                    <button onclick="battlesPageManager.toggleFavorite('${battle.id}')" 
                            class="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors font-medium">
                        <i class="fas fa-heart"></i>
                        <span>إضافة للمفضلة</span>
                    </button>
                    <button onclick="battlesPageManager.shareBattle('${battle.id}')"
                            class="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors font-medium">
                        <i class="fas fa-share-alt"></i>
                        <span>مشاركة</span>
                    </button>
                    <button onclick="battlesPageManager.printBattle('${battle.id}')"
                            class="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium">
                        <i class="fas fa-print"></i>
                        <span>طباعة</span>
                    </button>
                    <button onclick="battlesPageManager.downloadBattle('${battle.id}')"
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
        const modal = document.getElementById('battleModal');
        if (modal) {
            modal.classList.add('hidden');
            this.currentModal = null;
            document.body.style.overflow = '';
        }
    }

    filterBattles(filter) {
        this.currentFilter = filter;

        // تحديث أزرار الفلتر
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-amber-600', 'text-white');
            btn.classList.add('bg-white', 'dark:bg-slate-700', 'text-slate-700', 'dark:text-slate-200');
        });

        event.target.classList.remove('bg-white', 'dark:bg-slate-700', 'text-slate-700', 'dark:text-slate-200');
        event.target.classList.add('active', 'bg-amber-600', 'text-white');

        // تطبيق الفلتر
        switch (filter) {
            case 'all':
                this.filteredBattles = [...this.allBattles];
                break;
            case 'major':
                this.filteredBattles = this.allBattles.filter(b => b.type === 'major');
                break;
            case 'mecca':
                this.filteredBattles = this.allBattles.filter(b => b.period === 'mecca');
                break;
            case 'medina':
                this.filteredBattles = this.allBattles.filter(b => b.period === 'medina');
                break;
            default:
                this.filteredBattles = [...this.allBattles];
        }

        this.renderBattles();
    }

    searchBattles(query) {
        if (!query || query.trim() === '') {
            this.filteredBattles = [...this.allBattles];
        } else {
            const searchTerm = query.toLowerCase().trim();
            this.filteredBattles = this.allBattles.filter(battle => {
                return (
                    battle.name?.toLowerCase().includes(searchTerm) ||
                    battle.description?.toLowerCase().includes(searchTerm) ||
                    battle.location?.toLowerCase().includes(searchTerm) ||
                    battle.lessons?.toLowerCase().includes(searchTerm) ||
                    battle.main_events?.toLowerCase().includes(searchTerm)
                );
            });
        }

        this.renderBattles();
    }

    toggleFavorite(battleId) {
        const battle = this.allBattles.find(b => b.id === battleId);
        if (!battle) return;

        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const existingIndex = favorites.findIndex(fav => fav.id === battleId);

        if (existingIndex >= 0) {
            favorites.splice(existingIndex, 1);
            showToast('تم إزالة الغزوة من المفضلة', 'info');
        } else {
            favorites.push({
                id: battleId,
                type: 'battle',
                name: battle.name,
                added_at: new Date().toISOString()
            });
            showToast('تم إضافة الغزوة للمفضلة', 'success');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    shareBattle(battleId) {
        const battle = this.allBattles.find(b => b.id === battleId);
        if (!battle) return;

        const shareData = {
            title: `${battle.name}`,
            text: `تعرف على ${battle.name} وأحداثها والدروس المستفادة منها`,
            url: `${window.location.origin}/battles.html#${battleId}`
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

    printBattle(battleId) {
        const battle = this.allBattles.find(b => b.id === battleId);
        if (!battle) return;

        const printContent = `
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>${battle.name}</title>
                <style>
                    body { font-family: 'Amiri', serif; line-height: 1.8; margin: 20px; }
                    h1 { color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 10px; }
                    h2 { color: #b45309; margin-top: 30px; }
                    .content { margin: 20px 0; }
                    .section { background: #fef3c7; padding: 15px; border-right: 4px solid #f59e0b; margin: 20px 0; }
                    .info { display: flex; gap: 20px; margin: 15px 0; }
                </style>
            </head>
            <body>
                <h1>${battle.name}</h1>
                <div class="info">
                    <div><strong>التاريخ:</strong> ${battle.hijri_date}</div>
                    <div><strong>المكان:</strong> ${battle.location}</div>
                </div>
                <p>${battle.description}</p>
                
                <div class="section">
                    <h2>بداية الأحداث:</h2>
                    <p>${battle.start_events || ''}</p>
                </div>
                
                <div class="section">
                    <h2>سير المعركة:</h2>
                    <p>${battle.main_events || ''}</p>
                </div>
                
                <div class="section">
                    <h2>النتائج:</h2>
                    <p>${battle.results || ''}</p>
                </div>
                
                <div class="section">
                    <h2>الدروس المستفادة:</h2>
                    <p>${battle.lessons || ''}</p>
                </div>
                
                <footer style="margin-top: 40px; text-align: center; color: #666;">
                    <p>من موقع نور الهداية - الغزوات والسرايا النبوية</p>
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

    downloadBattle(battleId) {
        const battle = this.allBattles.find(b => b.id === battleId);
        if (!battle) return;

        const content = `
${battle.name}
${'='.repeat(battle.name.length)}

التاريخ: ${battle.hijri_date}
المكان: ${battle.location}
الوصف: ${battle.description}

بداية الأحداث:
${battle.start_events || ''}

سير المعركة:
${battle.main_events || ''}

النتائج:
${battle.results || ''}

الدروس المستفادة:
${battle.lessons || ''}

---
من موقع نور الهداية
        `.trim();

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${battle.name.replace(/[^\w\s]/gi, '')}.txt`;
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
        const grid = document.getElementById('battlesGrid');
        if (loadingState) loadingState.classList.remove('hidden');
        if (grid) grid.classList.add('hidden');
        this.isLoading = true;
    }

    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        const grid = document.getElementById('battlesGrid');
        if (loadingState) loadingState.classList.add('hidden');
        if (grid) grid.classList.remove('hidden');
        this.isLoading = false;
    }

    showNoResults() {
        const noResults = document.getElementById('noResults');
        const grid = document.getElementById('battlesGrid');
        if (noResults) noResults.classList.remove('hidden');
        if (grid) grid.innerHTML = '';
    }

    hideNoResults() {
        const noResults = document.getElementById('noResults');
        if (noResults) noResults.classList.add('hidden');
    }
}

// وظائف عامة للاستخدام في HTML
function filterBattles(filter) {
    if (window.battlesPageManager) {
        window.battlesPageManager.filterBattles(filter);
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && window.battlesPageManager) {
        window.battlesPageManager.searchBattles(searchInput.value);
    }
}

function closeModal() {
    if (window.battlesPageManager) {
        window.battlesPageManager.closeModal();
    }
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.battlesPageManager = new BattlesPageManager();
    
    // معالجة الرابط المباشر إلى غزوة معينة
    const hash = window.location.hash.substring(1);
    if (hash) {
        setTimeout(() => {
            window.battlesPageManager.showBattleDetails(hash);
        }, 1000);
    }
});

console.log('تم تحميل صفحة الغزوات والسرايا بنجاح ✨');