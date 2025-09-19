/**
 * ملف JavaScript الخاص بصفحة الأسئلة والأجوبة
 * يحتوي على جميع الوظائف المتعلقة بإدارة الأسئلة والإجابات
 */

class QnaPageManager {
    constructor() {
        this.allQuestions = [];
        this.filteredQuestions = [];
        this.currentCategory = 'all';
        this.currentSort = 'votes';
        this.currentPage = 1;
        this.questionsPerPage = 10;
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
        this.renderQuestions();
        this.updateStats();
        this.hideLoading();
    }

    async loadQuestions() {
        try {
            this.showLoading();
            const response = await qnaApi.getAll({ limit: 100, sort: '-votes' });
            
            if (response && response.data) {
                this.allQuestions = response.data;
                this.filteredQuestions = [...this.allQuestions];
            } else {
                // البيانات التجريبية في حالة عدم وجود اتصال بقاعدة البيانات
                this.loadFallbackData();
            }
        } catch (error) {
            console.error('خطأ في تحميل الأسئلة:', error);
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        this.allQuestions = [
            {
                id: 'q1',
                question: 'ما هي المعجزات التي أيد الله بها سيدنا موسى عليه السلام؟',
                answer: `
                    <p class="mb-4">أيد الله سيدنا موسى عليه السلام بمعجزات عديدة، منها:</p>
                    <ul class="list-disc mr-6 space-y-2">
                        <li><strong>العصا:</strong> تحولت إلى ثعبان عظيم يأكل عصي السحرة</li>
                        <li><strong>اليد البيضاء:</strong> كانت تخرج بيضاء من غير سوء عند إدخالها في جيبه</li>
                        <li><strong>الآيات التسع:</strong> الطوفان، والجراد، والقمل، والضفادع، والدم، والجدب، ونقص الثمرات، والطمس على الأموال، وشق البحر</li>
                        <li><strong>شق البحر:</strong> عندما ضرب البحر بعصاه فانشق اثني عشر طريقاً</li>
                        <li><strong>إنزال المن والسلوى:</strong> في التيه لبني إسرائيل</li>
                        <li><strong>إخراج الماء من الحجر:</strong> عندما ضربه بالعصا</li>
                    </ul>
                    <p class="mt-4">وكل هذه المعجزات كانت بإذن الله تعالى وقدرته.</p>
                `,
                category: 'قصص الأنبياء',
                votes: 15,
                is_published: true,
                created_at: new Date('2024-01-15').toISOString()
            },
            {
                id: 'q2',
                question: 'لماذا سميت غزوة بدر بيوم الفرقان؟',
                answer: `
                    <p class="mb-4">سميت غزوة بدر بيوم الفرقان لعدة أسباب:</p>
                    <ul class="list-disc mr-6 space-y-2">
                        <li><strong>الفرق بين الحق والباطل:</strong> ظهر فيها الحق جلياً وانكسر الباطل</li>
                        <li><strong>أول انتصار حاسم:</strong> كان أول انتصار عسكري حاسم للمسلمين</li>
                        <li><strong>نزول الملائكة:</strong> أنزل الله الملائكة لنصرة المؤمنين</li>
                        <li><strong>قتل صناديد قريش:</strong> قتل فيها كبار قريش مثل أبي جهل وعتبة وشيبة</li>
                        <li><strong>تثبيت دعائم الدولة:</strong> أثبتت قوة الدولة الإسلامية الناشئة</li>
                        <li><strong>الإشارة القرآنية:</strong> أشار إليها القرآن في قوله: "يَوْمَ الْفُرْقَانِ يَوْمَ الْتَقَى الْجَمْعَانِ"</li>
                    </ul>
                    <p class="mt-4">فكانت فاصلة بين عهدين: عهد الضعف وعهد القوة للمسلمين.</p>
                `,
                category: 'الغزوات',
                votes: 12,
                is_published: true,
                created_at: new Date('2024-01-20').toISOString()
            },
            {
                id: 'q3',
                question: 'ما هي أهم أعمال أبي بكر الصديق رضي الله عنه في خلافته؟',
                answer: `
                    <p class="mb-4">قام أبو بكر الصديق رضي الله عنه في خلافته بأعمال جليلة:</p>
                    <ul class="list-disc mr-6 space-y-2">
                        <li><strong>محاربة المرتدين:</strong> قضى على فتنة الردة وأعاد الجزيرة العربية للإسلام</li>
                        <li><strong>جمع القرآن:</strong> أمر بجمع القرآن الكريم في مصحف واحد بعد استشهاد حفاظه</li>
                        <li><strong>بداية الفتوحات:</strong> بدأ فتح العراق والشام</li>
                        <li><strong>إرسال الجيوش:</strong> أرسل خالد بن الوليد وأبا عبيدة بن الجراح</li>
                        <li><strong>تنظيم الدولة:</strong> حافظ على وحدة المسلمين بعد وفاة النبي ﷺ</li>
                        <li><strong>العدل والزهد:</strong> كان مثالاً في العدل والزهد في الحكم</li>
                        <li><strong>إنفاذ جيش أسامة:</strong> أنفذ جيش أسامة كما أمر النبي ﷺ</li>
                    </ul>
                    <p class="mt-4">فكان خير خليفة لخير رسول صلى الله عليه وسلم.</p>
                `,
                category: 'الصحابة',
                votes: 18,
                is_published: true,
                created_at: new Date('2024-01-25').toISOString()
            },
            {
                id: 'q4',
                question: 'كيف كانت أخلاق النبي محمد ﷺ قبل البعثة؟',
                answer: `
                    <p class="mb-4">كان النبي محمد ﷺ مثالاً في الأخلاق قبل البعثة:</p>
                    <ul class="list-disc mr-6 space-y-2">
                        <li><strong>الصدق:</strong> لقب بالصادق لصدقه المطلق</li>
                        <li><strong>الأمانة:</strong> لقب بالأمين لأمانته وحفظه للودائع</li>
                        <li><strong>الكرم:</strong> كان معروفاً بالجود والكرم</li>
                        <li><strong>العدل:</strong> حكّمته قريش في وضع الحجر الأسود</li>
                        <li><strong>الحكمة:</strong> كان مشهوراً بالحكمة وحسن الرأي</li>
                        <li><strong>الحياء:</strong> كان أشد حياءً من العذراء في خدرها</li>
                        <li><strong>النزاهة:</strong> لم يشارك في عبادة الأصنام أو شرب الخمر</li>
                        <li><strong>الرحمة:</strong> كان رحيماً بالضعفاء والمساكين</li>
                    </ul>
                    <p class="mt-4">لذلك قالت عنه خديجة رضي الله عنها: "كلا والله ما يخزيك الله أبداً، إنك لتصل الرحم، وتحمل الكل، وتكسب المعدوم، وتقري الضيف، وتعين على نوائب الحق".</p>
                `,
                category: 'السيرة النبوية',
                votes: 25,
                is_published: true,
                created_at: new Date('2024-01-30').toISOString()
            },
            {
                id: 'q5',
                question: 'ما الفرق بين النبي والرسول؟',
                answer: `
                    <p class="mb-4">هناك فروقات مهمة بين النبي والرسول:</p>
                    <div class="space-y-4">
                        <div>
                            <h4 class="font-bold text-teal-700 dark:text-teal-300 mb-2">النبي:</h4>
                            <ul class="list-disc mr-6 space-y-1">
                                <li>يوحى إليه بشريعة سابقة أو يجدد شريعة موجودة</li>
                                <li>قد لا يؤمر بالتبليغ أو يبلغ قومه فقط</li>
                                <li>كل رسول نبي وليس كل نبي رسولاً</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-bold text-teal-700 dark:text-teal-300 mb-2">الرسول:</h4>
                            <ul class="list-disc mr-6 space-y-1">
                                <li>يوحى إليه بشريعة جديدة</li>
                                <li>مأمور بالتبليغ والدعوة</li>
                                <li>يرسل إلى قوم مخالفين أو معاندين</li>
                                <li>غالباً ما يواجه عداوة شديدة</li>
                            </ul>
                        </div>
                    </div>
                    <p class="mt-4"><strong>مثال:</strong> داود وسليمان عليهما السلام أنبياء، بينما موسى وعيسى ومحمد عليهم السلام رسل وأنبياء.</p>
                    <p class="mt-2">وقد ذكر القرآن هذا الفرق في قوله تعالى: "وَمَا أَرْسَلْنَا مِن قَبْلِكَ مِن رَّسُولٍ وَلَا نَبِيٍّ".</p>
                `,
                category: 'عام',
                votes: 22,
                is_published: true,
                created_at: new Date('2024-02-05').toISOString()
            },
            {
                id: 'q6',
                question: 'من هم العشرة المبشرون بالجنة؟',
                answer: `
                    <p class="mb-4">العشرة المبشرون بالجنة هم الصحابة الذين بشرهم النبي ﷺ بالجنة في الدنيا:</p>
                    <div class="grid md:grid-cols-2 gap-4 mt-4">
                        <ul class="list-disc mr-6 space-y-2">
                            <li><strong>أبو بكر الصديق</strong> - الخليفة الأول</li>
                            <li><strong>عمر بن الخطاب</strong> - الفاروق</li>
                            <li><strong>عثمان بن عفان</strong> - ذو النورين</li>
                            <li><strong>علي بن أبي طالب</strong> - أبو الحسن</li>
                            <li><strong>طلحة بن عبيد الله</strong> - الفياض</li>
                        </ul>
                        <ul class="list-disc mr-6 space-y-2">
                            <li><strong>الزبير بن العوام</strong> - حواري الرسول</li>
                            <li><strong>عبد الرحمن بن عوف</strong> - الثري الزاهد</li>
                            <li><strong>سعد بن أبي وقاص</strong> - فاتح العراق</li>
                            <li><strong>سعيد بن زيد</strong> - من السابقين الأولين</li>
                            <li><strong>أبو عبيدة بن الجراح</strong> - أمين الأمة</li>
                        </ul>
                    </div>
                    <p class="mt-4">وقد جاء في الحديث أن النبي ﷺ قال: "أبو بكر في الجنة، وعمر في الجنة، وعثمان في الجنة، وعلي في الجنة..." وذكرهم جميعاً.</p>
                    <p class="mt-2 text-amber-600 dark:text-amber-400"><em>رضي الله عنهم أجمعين وأرضاهم.</em></p>
                `,
                category: 'الصحابة',
                votes: 20,
                is_published: true,
                created_at: new Date('2024-02-10').toISOString()
            }
        ];
        this.filteredQuestions = [...this.allQuestions];
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
                    this.searchQuestions(e.target.value);
                }, 300);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchQuestions(e.target.value);
                }
            });
        }

        // زر طرح سؤال
        const askQuestionBtn = document.getElementById('askQuestionBtn');
        if (askQuestionBtn) {
            askQuestionBtn.addEventListener('click', () => {
                this.showAskQuestionModal();
            });
        }

        // نموذج طرح السؤال
        const askForm = document.getElementById('askQuestionForm');
        if (askForm) {
            askForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitQuestion();
            });
        }
    }

    renderQuestions() {
        const container = document.getElementById('questionsContainer');
        if (!container) return;

        if (this.filteredQuestions.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();

        // تطبيق التصفح
        const startIndex = (this.currentPage - 1) * this.questionsPerPage;
        const endIndex = startIndex + this.questionsPerPage;
        const questionsToShow = this.filteredQuestions.slice(startIndex, endIndex);

        if (this.currentPage === 1) {
            container.innerHTML = '';
        }

        questionsToShow.forEach(question => {
            const questionElement = this.createQuestionElement(question);
            container.appendChild(questionElement);
        });

        // إظهار/إخفاء زر تحميل المزيد
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (endIndex < this.filteredQuestions.length) {
            loadMoreBtn.classList.remove('hidden');
            loadMoreBtn.onclick = () => this.loadMore();
        } else {
            loadMoreBtn.classList.add('hidden');
        }

        // إضافة الرسوم المتحركة
        setTimeout(() => {
            const newCards = container.querySelectorAll('.question-card:not(.animated)');
            newCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-fadeInUp', 'animated');
                }, index * 100);
            });
        }, 50);
    }

    createQuestionElement(question) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-card bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300';

        const date = new Date(question.created_at).toLocaleDateString('ar-SA');
        const categoryIcon = this.getCategoryIcon(question.category);

        questionDiv.innerHTML = `
            <div class="space-y-4">
                <!-- رأس السؤال -->
                <div class="flex items-start justify-between">
                    <div class="flex items-center space-x-3 space-x-reverse">
                        <div class="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                            <i class="${categoryIcon} text-teal-600 dark:text-teal-300"></i>
                        </div>
                        <div>
                            <span class="inline-block px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-sm rounded-full">
                                ${question.category}
                            </span>
                            <div class="text-sm text-slate-500 dark:text-slate-400 mt-1">${date}</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2 space-x-reverse">
                        <button onclick="qnaPageManager.voteQuestion('${question.id}', 1)" 
                                class="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400 transition-colors duration-200"
                                title="صوت للسؤال">
                            <i class="fas fa-thumbs-up"></i>
                        </button>
                        <span class="font-bold text-green-600 dark:text-green-400">${question.votes || 0}</span>
                    </div>
                </div>

                <!-- نص السؤال -->
                <div class="question-content">
                    <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-4 leading-relaxed">
                        ${question.question}
                    </h3>
                    
                    ${question.answer ? `
                        <div class="answer-content bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border-r-4 border-teal-500">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-lightbulb text-teal-600 dark:text-teal-400 ml-2"></i>
                                <span class="font-bold text-teal-700 dark:text-teal-300">الإجابة:</span>
                            </div>
                            <div class="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                                ${question.answer}
                            </div>
                        </div>
                    ` : `
                        <div class="pending-answer bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border-r-4 border-amber-500">
                            <div class="flex items-center text-amber-700 dark:text-amber-300">
                                <i class="fas fa-clock ml-2"></i>
                                <span class="font-medium">في انتظار الإجابة من المختصين...</span>
                            </div>
                        </div>
                    `}
                </div>

                <!-- أزرار الإجراءات -->
                <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-600">
                    <div class="flex items-center space-x-4 space-x-reverse">
                        <button onclick="qnaPageManager.shareQuestion('${question.id}')" 
                                class="flex items-center space-x-1 space-x-reverse text-slate-500 hover:text-blue-600 transition-colors duration-200">
                            <i class="fas fa-share-alt"></i>
                            <span class="text-sm">مشاركة</span>
                        </button>
                        <button onclick="qnaPageManager.reportQuestion('${question.id}')" 
                                class="flex items-center space-x-1 space-x-reverse text-slate-500 hover:text-red-600 transition-colors duration-200">
                            <i class="fas fa-flag"></i>
                            <span class="text-sm">إبلاغ</span>
                        </button>
                    </div>
                    <div class="text-sm text-slate-400 dark:text-slate-500">
                        رقم السؤال: ${question.id}
                    </div>
                </div>
            </div>
        `;

        return questionDiv;
    }

    getCategoryIcon(category) {
        const icons = {
            'قصص الأنبياء': 'fas fa-user-tie',
            'السيرة النبوية': 'fas fa-moon',
            'الغزوات': 'fas fa-shield-alt',
            'الصحابة': 'fas fa-users',
            'عام': 'fas fa-globe'
        };
        return icons[category] || 'fas fa-question-circle';
    }

    filterQuestions(category) {
        this.currentCategory = category;
        this.currentPage = 1;

        // تحديث أزرار الفلتر
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('bg-teal-100', 'text-teal-800', 'dark:bg-teal-900', 'dark:text-teal-200');
        });

        if (event && event.target) {
            event.target.classList.add('bg-teal-100', 'text-teal-800', 'dark:bg-teal-900', 'dark:text-teal-200');
        }

        // تطبيق الفلتر
        if (category === 'all') {
            this.filteredQuestions = [...this.allQuestions];
        } else {
            this.filteredQuestions = this.allQuestions.filter(q => q.category === category);
        }

        this.sortQuestions();
        this.renderQuestions();
        this.updateStats();
    }

    sortQuestions() {
        const sortBy = document.getElementById('sortSelect')?.value || this.currentSort;
        this.currentSort = sortBy;

        this.filteredQuestions.sort((a, b) => {
            switch (sortBy) {
                case 'votes':
                    return (b.votes || 0) - (a.votes || 0);
                case 'recent':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'oldest':
                    return new Date(a.created_at) - new Date(b.created_at);
                default:
                    return 0;
            }
        });

        this.currentPage = 1;
        this.renderQuestions();
    }

    searchQuestions(query) {
        if (!query || query.trim() === '') {
            if (this.currentCategory === 'all') {
                this.filteredQuestions = [...this.allQuestions];
            } else {
                this.filteredQuestions = this.allQuestions.filter(q => q.category === this.currentCategory);
            }
        } else {
            const searchTerm = query.toLowerCase().trim();
            let baseQuestions = this.currentCategory === 'all' 
                ? this.allQuestions 
                : this.allQuestions.filter(q => q.category === this.currentCategory);

            this.filteredQuestions = baseQuestions.filter(question => {
                return (
                    question.question?.toLowerCase().includes(searchTerm) ||
                    question.answer?.toLowerCase().includes(searchTerm) ||
                    question.category?.toLowerCase().includes(searchTerm)
                );
            });
        }

        this.sortQuestions();
        this.renderQuestions();
    }

    showAskQuestionModal() {
        const modal = document.getElementById('askQuestionModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeAskQuestionModal() {
        const modal = document.getElementById('askQuestionModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            // إعادة تعيين النموذج
            document.getElementById('askQuestionForm').reset();
        }
    }

    async submitQuestion() {
        const category = document.getElementById('questionCategory').value;
        const question = document.getElementById('questionText').value.trim();

        if (!question) {
            showToast('يرجى كتابة سؤالك', 'error');
            return;
        }

        try {
            const questionData = {
                question: question,
                category: category,
                answer: '', // فارغ في البداية
                is_published: false, // سيتم مراجعته قبل النشر
                votes: 0
            };

            // محاولة إرسال للـ API
            const response = await qnaApi.create(questionData);
            
            if (response) {
                showToast('تم إرسال سؤالك بنجاح وسيتم مراجعته قريباً', 'success');
                this.closeAskQuestionModal();
                
                // إضافة السؤال للقائمة محلياً
                const newQuestion = {
                    ...questionData,
                    id: 'temp_' + Date.now(),
                    created_at: new Date().toISOString()
                };
                this.allQuestions.unshift(newQuestion);
                this.filterQuestions(this.currentCategory);
            } else {
                throw new Error('فشل في الإرسال');
            }
        } catch (error) {
            console.error('خطأ في إرسال السؤال:', error);
            
            // إضافة محلية في حالة فشل الـ API
            const newQuestion = {
                id: 'local_' + Date.now(),
                question: question,
                category: category,
                answer: '',
                is_published: false,
                votes: 0,
                created_at: new Date().toISOString()
            };
            
            this.allQuestions.unshift(newQuestion);
            this.filterQuestions(this.currentCategory);
            this.closeAskQuestionModal();
            showToast('تم إضافة سؤالك مؤقتاً وسيتم مراجعته', 'success');
        }
    }

    async voteQuestion(questionId, voteChange) {
        try {
            // محاولة التصويت عبر الـ API
            const response = await qnaApi.vote(questionId, voteChange);
            
            if (response) {
                showToast('تم تسجيل تصويتك', 'success');
            } else {
                throw new Error('فشل في التصويت');
            }
        } catch (error) {
            console.error('خطأ في التصويت:', error);
            
            // التصويت المحلي في حالة فشل الـ API
            const question = this.allQuestions.find(q => q.id === questionId);
            if (question) {
                question.votes = (question.votes || 0) + voteChange;
                showToast('تم تسجيل تصويتك', 'success');
                this.renderQuestions();
            }
        }
    }

    shareQuestion(questionId) {
        const question = this.allQuestions.find(q => q.id === questionId);
        if (!question) return;

        const shareData = {
            title: question.question,
            text: `سؤال: ${question.question}`,
            url: `${window.location.origin}/qna.html#${questionId}`
        };

        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareData.url).then(() => {
                showToast('تم نسخ رابط السؤال للحافظة', 'success');
            }).catch(() => {
                showToast('فشل في نسخ الرابط', 'error');
            });
        }
    }

    reportQuestion(questionId) {
        const reason = prompt('يرجى توضيح سبب الإبلاغ عن هذا السؤال:');
        if (reason && reason.trim()) {
            showToast('تم إرسال بلاغك وسيتم مراجعته', 'success');
            // يمكن إضافة منطق إرسال البلاغ للمراجعة هنا
        }
    }

    loadMore() {
        this.currentPage++;
        this.renderQuestions();
    }

    updateStats() {
        const totalQuestions = this.allQuestions.length;
        const answeredQuestions = this.allQuestions.filter(q => q.answer && q.answer.trim()).length;
        const pendingQuestions = totalQuestions - answeredQuestions;

        document.getElementById('totalQuestions').textContent = totalQuestions;
        document.getElementById('answeredQuestions').textContent = answeredQuestions;
        document.getElementById('pendingQuestions').textContent = pendingQuestions;
    }

    showLoading() {
        const loadingState = document.getElementById('loadingState');
        const container = document.getElementById('questionsContainer');
        if (loadingState) loadingState.classList.remove('hidden');
        if (container) container.classList.add('hidden');
        this.isLoading = true;
    }

    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        const container = document.getElementById('questionsContainer');
        if (loadingState) loadingState.classList.add('hidden');
        if (container) container.classList.remove('hidden');
        this.isLoading = false;
    }

    showNoResults() {
        const noResults = document.getElementById('noResults');
        const container = document.getElementById('questionsContainer');
        if (noResults) noResults.classList.remove('hidden');
        if (container) container.innerHTML = '';
    }

    hideNoResults() {
        const noResults = document.getElementById('noResults');
        if (noResults) noResults.classList.add('hidden');
    }
}

// وظائف عامة للاستخدام في HTML
function filterQuestions(category) {
    if (window.qnaPageManager) {
        window.qnaPageManager.filterQuestions(category);
    }
}

function sortQuestions() {
    if (window.qnaPageManager) {
        window.qnaPageManager.sortQuestions();
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && window.qnaPageManager) {
        window.qnaPageManager.searchQuestions(searchInput.value);
    }
}

function showAskQuestionModal() {
    if (window.qnaPageManager) {
        window.qnaPageManager.showAskQuestionModal();
    }
}

function closeAskQuestionModal() {
    if (window.qnaPageManager) {
        window.qnaPageManager.closeAskQuestionModal();
    }
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.qnaPageManager = new QnaPageManager();
    
    // معالجة الرابط المباشر إلى سؤال معين
    const hash = window.location.hash.substring(1);
    if (hash) {
        setTimeout(() => {
            const questionElement = document.querySelector(`[data-question-id="${hash}"]`);
            if (questionElement) {
                questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                questionElement.classList.add('ring-4', 'ring-teal-400', 'ring-opacity-50');
                setTimeout(() => {
                    questionElement.classList.remove('ring-4', 'ring-teal-400', 'ring-opacity-50');
                }, 3000);
            }
        }, 1000);
    }

    // إغلاق النافذة عند النقر خارجها
    document.getElementById('askQuestionModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'askQuestionModal') {
            closeAskQuestionModal();
        }
    });

    // إغلاق النافذة بالضغط على Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAskQuestionModal();
        }
    });
});

console.log('تم تحميل صفحة الأسئلة والأجوبة بنجاح ✨');