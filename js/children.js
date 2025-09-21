/**
 * ملف JavaScript الخاص بقسم الأطفال
 * يحتوي على الألعاب والأنشطة التفاعلية للأطفال
 */

class ChildrenPageManager {
    constructor() {
        this.currentAgeGroup = '6-8';
        this.soundEnabled = true;
        this.stories = [];
        this.games = [];
        this.activities = [];
        
        // بيانات لعبة الذاكرة
        this.memoryCards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.attempts = 0;
        this.score = 0;
        
        // بيانات المسابقة
        this.quizQuestions = [];
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        
        // بيانات الألعاب الجديدة
        this.currentStarsCount = 0;
        this.shapesScore = 0;
        this.countingScore = 0;
        this.totalPoints = 0;
        
        this.init();
    }

    async init() {
        this.loadContent();
        this.setupEventListeners();
        this.loadSavedPoints();
        this.hideLoading();
    }

    loadContent() {
        // تحميل القصص المبسطة
        this.stories = [
            {
                id: 'adam_kids',
                title: '🌱 قصة سيدنا آدم للأطفال',
                summary: 'أبو الناس الذي خلقه الله من طين',
                content: `
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">👨‍🦱</div>
                        <h3 class="text-2xl font-bold text-emerald-600 mb-4">سيدنا آدم عليه السلام</h3>
                    </div>
                    <div class="space-y-4 text-lg leading-relaxed font-amiri">
                        <p>🏺 كان يا ما كان... خلق الله سيدنا آدم من طين الأرض</p>
                        <p>💨 ونفخ فيه الروح فأصبح إنساناً حياً يتحرك ويتكلم</p>
                        <p>🏡 وضعه الله في الجنة الجميلة مع زوجته حواء</p>
                        <p>🍎 وقال لهما: كلا من كل شيء إلا هذه الشجرة</p>
                        <p>😈 لكن الشيطان وسوس لهما فأكلا من الشجرة</p>
                        <p>😢 فنزلا إلى الأرض وندما على ما فعلا</p>
                        <p>🤲 فتابا إلى الله وغفر لهما</p>
                        <p><strong>🌟 الدرس: يجب أن نطيع الله ولا نعصيه</strong></p>
                    </div>
                `,
                ageGroup: ['3-5', '6-8', '9-12'],
                emoji: '👨‍🦱'
            },
            {
                id: 'noah_kids',
                title: '🚢 قصة سيدنا نوح والسفينة الكبيرة',
                summary: 'النبي الذي بنى سفينة عظيمة',
                content: `
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">🚢</div>
                        <h3 class="text-2xl font-bold text-blue-600 mb-4">سيدنا نوح عليه السلام</h3>
                    </div>
                    <div class="space-y-4 text-lg leading-relaxed font-amiri">
                        <p>👴 كان سيدنا نوح رجلاً طيباً يحب الله كثيراً</p>
                        <p>📢 دعا قومه 950 سنة ليعبدوا الله وحده</p>
                        <p>😠 لكن الناس الأشرار لم يسمعوا كلامه</p>
                        <p>🔨 أمر الله نوحاً ببناء سفينة كبيرة جداً</p>
                        <p>🐘🦁🐸 وضع فيها من كل الحيوانات زوجين اثنين</p>
                        <p>🌊 جاء طوفان عظيم غطى كل الأرض</p>
                        <p>✅ نجا نوح والمؤمنون والحيوانات في السفينة</p>
                        <p><strong>🌟 الدرس: الله ينجي من يؤمن به ويطيعه</strong></p>
                    </div>
                `,
                ageGroup: ['3-5', '6-8', '9-12'],
                emoji: '🚢'
            },
            {
                id: 'ibrahim_kids',
                title: '🔥 قصة سيدنا إبراهيم والنار',
                summary: 'النبي الشجاع الذي لم تحرقه النار',
                content: `
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">🔥</div>
                        <h3 class="text-2xl font-bold text-orange-600 mb-4">سيدنا إبراهيم عليه السلام</h3>
                    </div>
                    <div class="space-y-4 text-lg leading-relaxed font-amiri">
                        <p>🗿 رأى سيدنا إبراهيم قومه يعبدون تماثيل من الحجر</p>
                        <p>💭 فكر: كيف يعبدون شيئاً لا يتكلم ولا يتحرك؟</p>
                        <p>🔨 حطم جميع التماثيل إلا واحداً كبيراً</p>
                        <p>😡 غضب الناس وقرروا إحراقه بالنار</p>
                        <p>🔥 ألقوه في نار عظيمة مشتعلة</p>
                        <p>❄️ قال الله للنار: كوني برداً وسلاماً على إبراهيم</p>
                        <p>😊 خرج من النار سالماً لم تحرقه ولا ثيابه</p>
                        <p><strong>🌟 الدرس: من توكل على الله فالله يحميه</strong></p>
                    </div>
                `,
                ageGroup: ['6-8', '9-12'],
                emoji: '🔥'
            },
            {
                id: 'musa_kids',
                title: '🐍 قصة سيدنا موسى والعصا السحرية',
                summary: 'النبي الذي تحولت عصاه إلى ثعبان',
                content: `
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">🐍</div>
                        <h3 class="text-2xl font-bold text-green-600 mb-4">سيدنا موسى عليه السلام</h3>
                    </div>
                    <div class="space-y-4 text-lg leading-relaxed font-amiri">
                        <p>👑 كان فرعون ملكاً شريراً يظن أنه إله</p>
                        <p>👨‍🦯 أرسل الله موسى إليه بعصا بسيطة</p>
                        <p>✨ قال الله لموسى: ألق عصاك</p>
                        <p>🐍 تحولت العصا إلى ثعبان كبير يتحرك</p>
                        <p>😱 خاف فرعون والسحرة من هذه المعجزة</p>
                        <p>🏃‍♂️ آمن السحرة بالله وتركوا السحر</p>
                        <p>🌊 شق موسى البحر ونجى قومه من فرعون</p>
                        <p><strong>🌟 الدرس: قوة الله أعظم من كل شيء</strong></p>
                    </div>
                `,
                ageGroup: ['6-8', '9-12'],
                emoji: '🐍'
            },
            {
                id: 'muhammad_kids',
                title: '🌙 قصة النبي محمد ﷺ',
                summary: 'خاتم الأنبياء الذي أضاء العالم بالإسلام',
                content: `
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">🌙</div>
                        <h3 class="text-2xl font-bold text-blue-800 mb-4">النبي محمد ﷺ</h3>
                    </div>
                    <div class="space-y-4 text-lg leading-relaxed font-amiri">
                        <p>👶 ولد النبي محمد يتيماً في مكة المكرمة</p>
                        <p>🤝 كان يُعرف بالصادق الأمين قبل النبوة</p>
                        <p>🕳️ تعبد في غار حراء فجاءه جبريل</p>
                        <p>📖 قال له: اقرأ باسم ربك الذي خلق</p>
                        <p>📢 دعا الناس إلى عبادة الله وحده</p>
                        <p>🕋 فتح مكة وطهر الكعبة من الأصنام</p>
                        <p>🌍 انتشر الإسلام في كل العالم بفضله</p>
                        <p><strong>🌟 الدرس: يجب أن نحب النبي ونتبع سنته</strong></p>
                    </div>
                `,
                ageGroup: ['6-8', '9-12'],
                emoji: '🌙'
            },
            {
                id: 'ibrahim_kids',
                title: '🔥 قصة سيدنا إبراهيم للأطفال',
                summary: 'النبي الذي لم تحرقه النار',
                content: `
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">👴🏻</div>
                        <h3 class="text-2xl font-bold text-orange-600 mb-4">سيدنا إبراهيم عليه السلام</h3>
                    </div>
                    <div class="space-y-4 text-lg leading-relaxed font-amiri">
                        <p>🏛️ كان قوم إبراهيم يعبدون أصناماً من الحجر</p>
                        <p>🤔 فكان إبراهيم يفكر: كيف تعبد أصنام لا تتكلم؟</p>
                        <p>🔨 فكسر الأصنام كلها إلا الكبير منها</p>
                        <p>😡 فغضب القوم وقرروا أن يحرقوه</p>
                        <p>🔥 ألقوه في النار الكبيرة</p>
                        <p>❄️ فقال الله للنار: كوني برداً وسلاماً على إبراهيم</p>
                        <p>✨ فخرج من النار سالماً لم تحرقه!</p>
                        <p><strong>🌟 الدرس: الله ينجي من يؤمن به</strong></p>
                    </div>
                `,
                ageGroup: ['3-5', '6-8', '9-12'],
                emoji: '🔥'
            },
            {
                id: 'yusuf_kids',
                title: '👑 قصة سيدنا يوسف للأطفال',
                summary: 'النبي الجميل الذي صار ملكاً',
                content: `
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">👑</div>
                        <h3 class="text-2xl font-bold text-purple-600 mb-4">سيدنا يوسف عليه السلام</h3>
                    </div>
                    <div class="space-y-4 text-lg leading-relaxed font-amiri">
                        <p>⭐ رأى يوسف في المنام أحد عشر كوكباً والشمس والقمر</p>
                        <p>😍 كان يوسف أجمل الناس وأحبه أبوه يعقوب كثيراً</p>
                        <p>😢 غار إخوته منه فألقوه في بئر عميق</p>
                        <p>🐪 مرت قافلة فأخرجته وباعته عبداً في مصر</p>
                        <p>🏛️ وضعوه في السجن ظلماً وهو بريء</p>
                        <p>💭 فسر أحلام الملك وخرج من السجن</p>
                        <p>👑 فجعله الملك وزيراً على مصر كلها</p>
                        <p>❤️ وسامح إخوته الذين ظلموه</p>
                        <p><strong>🌟 الدرس: الصبر والمسامحة يؤديان للنجاح</strong></p>
                    </div>
                `,
                ageGroup: ['6-8', '9-12'],
                emoji: '👑'
            },
            {
                id: 'yunus_kids',
                title: '🐋 قصة سيدنا يونس للأطفال',
                summary: 'النبي الذي عاش في بطن الحوت',
                content: `
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">🐋</div>
                        <h3 class="text-2xl font-bold text-blue-600 mb-4">سيدنا يونس عليه السلام</h3>
                    </div>
                    <div class="space-y-4 text-lg leading-relaxed font-amiri">
                        <p>📢 دعا يونس قومه للإيمان بالله ولكنهم رفضوا</p>
                        <p>😔 فغضب وتركهم وركب سفينة في البحر</p>
                        <p>⛈️ فجاءت عاصفة شديدة والسفينة ستغرق</p>
                        <p>🎯 فألقوا القرعة ووقعت على يونس فألقوه في البحر</p>
                        <p>🐋 فجاء حوت كبير وابتلعه ولم يؤذه</p>
                        <p>🤲 في بطن الحوت سبح الله: لا إله إلا أنت سبحانك إني كنت من الظالمين</p>
                        <p>🏖️ فأمر الله الحوت فألقاه على الشاطئ سالماً</p>
                        <p>🌱 وأنبت الله عليه شجرة تظله</p>
                        <p><strong>🌟 الدرس: الاستغفار والصبر ينجيان من الكرب</strong></p>
                    </div>
                `,
                ageGroup: ['3-5', '6-8', '9-12'],
                emoji: '🐋'
            }
        ];

        // تحميل الألعاب
        this.games = [
            {
                id: 'memory',
                title: '🧠 لعبة الذاكرة',
                description: 'اعثر على الأزواج المتشابهة',
                icon: '🧠',
                action: 'showMemoryGame',
                ageGroup: ['6-8', '9-12']
            },
            {
                id: 'quiz',
                title: '🤔 مسابقة الأذكياء',
                description: 'أجب على الأسئلة واربح النقاط',
                icon: '🏆',
                action: 'showQuizGame',
                ageGroup: ['6-8', '9-12']
            },
            {
                id: 'shapes',
                title: '🔵 لعبة الأشكال',
                description: 'اعثر على الشكل المختلف',
                icon: '⭕',
                action: 'showShapesGame',
                ageGroup: ['3-5', '6-8']
            },
            {
                id: 'counting',
                title: '🔢 لعبة العد',
                description: 'عد النجوم واربح النقاط',
                icon: '⭐',
                action: 'showCountingGame',
                ageGroup: ['3-5', '6-8']
            },
            {
                id: 'puzzle',
                title: '🧩 ترتيب الصور',
                description: 'رتب قطع الصورة المبعثرة',
                icon: '🧩',
                action: 'showPuzzleGame',
                ageGroup: ['6-8', '9-12']
            },
            {
                id: 'word_search',
                title: '🔍 البحث عن الكلمات',
                description: 'اعثر على أسماء الأنبياء',
                icon: '🔍',
                action: 'showWordSearch',
                ageGroup: ['9-12']
            },
            {
                id: 'matching',
                title: '🔗 توصيل النقاط',
                description: 'وصل النبي مع معجزته',
                icon: '🔗',
                action: 'showMatchingGame',
                ageGroup: ['6-8', '9-12']
            },
            {
                id: 'timeline',
                title: '⏰ الخط الزمني',
                description: 'رتب الأحداث حسب التاريخ',
                icon: '⏰',
                action: 'showTimelineGame',
                ageGroup: ['9-12']
            }
        ];

        // تحميل الأنشطة
        this.activities = [
            {
                id: 'coloring',
                title: '🎨 صفحات التلوين',
                description: 'لون الرسوم الجميلة',
                icon: '🎨',
                action: 'showColoringActivity'
            },
            {
                id: 'drawing',
                title: '✏️ لوحة الرسم',
                description: 'ارسم ما تشاء بالألوان',
                icon: '✏️',
                action: 'showDrawingActivity'
            },
            {
                id: 'music',
                title: '🎵 صندوق الموسيقى',
                description: 'استمع للأناشيد الإسلامية',
                icon: '🎵',
                action: 'showMusicBox'
            },
            {
                id: 'story_builder',
                title: '🏗️ بناء القصص',
                description: 'اكتب قصتك بالصور',
                icon: '🏗️',
                action: 'showStoryBuilder'
            },
            {
                id: 'stickers',
                title: '🌟 ملصقات المكافآت',
                description: 'اجمع النجوم والملصقات',
                icon: '⭐',
                action: 'showStickersActivity'
            },
            {
                id: 'certificates',
                title: '🏅 شهادات التميز',
                description: 'احصل على شهادة إنجازك',
                icon: '🏅',
                action: 'showCertificatesActivity'
            }
        ];

        // أسئلة المسابقة
        this.quizQuestions = [
            {
                question: 'من هو أبو البشر؟ 👨‍🦱',
                answers: ['آدم عليه السلام', 'نوح عليه السلام', 'إبراهيم عليه السلام', 'موسى عليه السلام'],
                correct: 0,
                emoji: '👨‍🦱'
            },
            {
                question: 'من بنى السفينة الكبيرة؟ 🚢',
                answers: ['موسى عليه السلام', 'نوح عليه السلام', 'يوسف عليه السلام', 'داود عليه السلام'],
                correct: 1,
                emoji: '🚢'
            },
            {
                question: 'من الذي لم تحرقه النار؟ 🔥',
                answers: ['يونس عليه السلام', 'صالح عليه السلام', 'إبراهيم عليه السلام', 'لوط عليه السلام'],
                correct: 2,
                emoji: '🔥'
            },
            {
                question: 'عصا من تحولت إلى ثعبان؟ 🐍',
                answers: ['هارون عليه السلام', 'موسى عليه السلام', 'عيسى عليه السلام', 'يحيى عليه السلام'],
                correct: 1,
                emoji: '🐍'
            },
            {
                question: 'من هو خاتم الأنبياء؟ 🌙',
                answers: ['عيسى عليه السلام', 'محمد ﷺ', 'سليمان عليه السلام', 'زكريا عليه السلام'],
                correct: 1,
                emoji: '🌙'
            },
            {
                question: 'من عاش في بطن الحوت؟ 🐋',
                answers: ['يونس عليه السلام', 'إسماعيل عليه السلام', 'إدريس عليه السلام', 'شعيب عليه السلام'],
                correct: 0,
                emoji: '🐋'
            },
            {
                question: 'من الذي كان أجمل الناس؟ 👑',
                answers: ['يوسف عليه السلام', 'داود عليه السلام', 'سليمان عليه السلام', 'زكريا عليه السلام'],
                correct: 0,
                emoji: '👑'
            },
            {
                question: 'كم سنة دعا نوح قومه؟ 🚢',
                answers: ['100 سنة', '500 سنة', '950 سنة', '200 سنة'],
                correct: 2,
                emoji: '🚢'
            },
            {
                question: 'في أي غار تعبد النبي محمد ﷺ؟ 🕳️',
                answers: ['غار حراء', 'غار ثور', 'غار عدن', 'غار مكة'],
                correct: 0,
                emoji: '🕳️'
            },
            {
                question: 'ماذا قال الله للنار عندما ألقوا إبراهيم فيها؟ 🔥',
                answers: ['احترقي', 'كوني برداً وسلاماً', 'اشتعلي أكثر', 'اخمدي'],
                correct: 1,
                emoji: '🔥'
            },
            {
                question: 'كم كان عمر النبي محمد ﷺ عندما جاءه الوحي؟ 👨',
                answers: ['30 سنة', '40 سنة', '50 سنة', '25 سنة'],
                correct: 1,
                emoji: '👨'
            }
        ];

        this.renderContent();
    }

    setupEventListeners() {
        // تأثيرات الصوت (افتراضية بدون صوت حقيقي)
        document.addEventListener('click', () => {
            if (this.soundEnabled) {
                // يمكن إضافة مؤثرات صوتية هنا
                this.playClickSound();
            }
        });
    }

    renderContent() {
        this.renderStories();
        this.renderGames();
        this.renderActivities();
    }

    renderStories() {
        const container = document.getElementById('storiesContainer');
        if (!container) return;

        const filteredStories = this.stories.filter(story => 
            story.ageGroup.includes(this.currentAgeGroup)
        );

        container.innerHTML = filteredStories.map(story => `
            <div class="story-card bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                 onclick="childrenPageManager.showStory('${story.id}')">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="text-3xl">${story.emoji}</div>
                    <div class="flex-1">
                        <h4 class="font-bold text-pink-700 dark:text-pink-300 mb-1">${story.title}</h4>
                        <p class="text-sm text-pink-600 dark:text-pink-400">${story.summary}</p>
                    </div>
                    <div class="text-pink-400">
                        <i class="fas fa-play-circle text-2xl"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderGames() {
        const container = document.getElementById('gamesContainer');
        if (!container) return;

        const filteredGames = this.games.filter(game => 
            game.ageGroup.includes(this.currentAgeGroup)
        );

        container.innerHTML = filteredGames.map(game => `
            <div class="game-card bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                 onclick="childrenPageManager.${game.action}()">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="text-3xl">${game.icon}</div>
                    <div class="flex-1">
                        <h4 class="font-bold text-blue-700 dark:text-blue-300 mb-1">${game.title}</h4>
                        <p class="text-sm text-blue-600 dark:text-blue-400">${game.description}</p>
                    </div>
                    <div class="text-blue-400">
                        <i class="fas fa-play-circle text-2xl"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderActivities() {
        const container = document.getElementById('activitiesContainer');
        if (!container) return;

        container.innerHTML = this.activities.map(activity => `
            <div class="activity-card bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
                 onclick="childrenPageManager.${activity.action}()">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="text-3xl">${activity.icon}</div>
                    <div class="flex-1">
                        <h4 class="font-bold text-green-700 dark:text-green-300 mb-1">${activity.title}</h4>
                        <p class="text-sm text-green-600 dark:text-green-400">${activity.description}</p>
                    </div>
                    <div class="text-green-400">
                        <i class="fas fa-play-circle text-2xl"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showStory(storyId) {
        const story = this.stories.find(s => s.id === storyId);
        if (!story) return;

        const modal = document.getElementById('storyModal');
        const title = document.getElementById('storyTitle');
        const content = document.getElementById('storyContent');

        title.textContent = story.title;
        content.innerHTML = story.content;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        this.playStorySound();
        
        // إعطاء نقاط للقراءة
        this.addPoints(15);
    }

    closeStoryModal() {
        const modal = document.getElementById('storyModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    showMemoryGame() {
        const gameContainer = document.getElementById('memoryGame');
        gameContainer.classList.remove('hidden');
        gameContainer.scrollIntoView({ behavior: 'smooth' });
        this.playGameSound();
    }

    startMemoryGame() {
        this.resetMemoryGame();
        this.createMemoryCards();
        this.renderMemoryCards();
    }

    resetMemoryGame() {
        this.memoryCards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.attempts = 0;
        this.score = 0;
        this.updateMemoryScore();
    }

    createMemoryCards() {
        const prophets = ['👨‍🦱', '🚢', '🔥', '🐍', '🌙', '⭐'];
        const cards = [...prophets, ...prophets]; // مضاعفة للأزواج
        
        // خلط البطاقات عشوائياً
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        this.memoryCards = cards.map((symbol, index) => ({
            id: index,
            symbol: symbol,
            isFlipped: false,
            isMatched: false
        }));
    }

    renderMemoryCards() {
        const container = document.getElementById('memoryCards');
        container.innerHTML = this.memoryCards.map(card => `
            <div class="memory-card w-20 h-20 bg-purple-300 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                card.isFlipped || card.isMatched ? 'bg-purple-100' : 'bg-purple-400 hover:bg-purple-300'
            }" onclick="childrenPageManager.flipCard(${card.id})">
                <div class="text-3xl ${card.isFlipped || card.isMatched ? '' : 'hidden'}">
                    ${card.symbol}
                </div>
                <div class="text-2xl ${card.isFlipped || card.isMatched ? 'hidden' : ''}">
                    ❓
                </div>
            </div>
        `).join('');
    }

    flipCard(cardId) {
        if (this.flippedCards.length === 2) return;
        
        const card = this.memoryCards[cardId];
        if (card.isFlipped || card.isMatched) return;

        card.isFlipped = true;
        this.flippedCards.push(card);
        this.renderMemoryCards();

        if (this.flippedCards.length === 2) {
            this.attempts++;
            this.updateMemoryScore();
            
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }

        this.playCardSound();
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.symbol === card2.symbol) {
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs++;
            this.score += 10;
            this.playSuccessSound();
            
            if (this.matchedPairs === this.memoryCards.length / 2) {
                setTimeout(() => {
                    this.showGameComplete('memory');
                }, 500);
            }
        } else {
            card1.isFlipped = false;
            card2.isFlipped = false;
            this.playErrorSound();
        }

        this.flippedCards = [];
        this.renderMemoryCards();
        this.updateMemoryScore();
    }

    updateMemoryScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('attempts').textContent = this.attempts;
    }

    showQuizGame() {
        const gameContainer = document.getElementById('quizGame');
        gameContainer.classList.remove('hidden');
        gameContainer.scrollIntoView({ behavior: 'smooth' });
        this.playGameSound();
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        this.showNextQuestion();
        document.getElementById('startQuizBtn').style.display = 'none';
    }

    showNextQuestion() {
        if (this.currentQuestionIndex >= this.quizQuestions.length) {
            this.showGameComplete('quiz');
            return;
        }

        const question = this.quizQuestions[this.currentQuestionIndex];
        document.getElementById('question').textContent = question.question;
        document.getElementById('questionNum').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = this.quizQuestions.length;
        document.getElementById('quizScore').textContent = this.quizScore;

        const answersContainer = document.getElementById('answers');
        answersContainer.innerHTML = question.answers.map((answer, index) => `
            <button class="answer-btn p-4 bg-orange-200 hover:bg-orange-300 dark:bg-orange-800 dark:hover:bg-orange-700 rounded-2xl font-bold text-orange-800 dark:text-orange-200 transition-all duration-200 transform hover:scale-105"
                    onclick="childrenPageManager.selectAnswer(${index})">
                ${answer} ${index === question.correct ? question.emoji : ''}
            </button>
        `).join('');
    }

    selectAnswer(answerIndex) {
        const question = this.quizQuestions[this.currentQuestionIndex];
        const answerButtons = document.querySelectorAll('.answer-btn');
        
        answerButtons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === question.correct) {
                btn.classList.add('bg-green-400', 'text-green-900');
                btn.classList.remove('bg-orange-200', 'text-orange-800');
            } else if (index === answerIndex && answerIndex !== question.correct) {
                btn.classList.add('bg-red-400', 'text-red-900');
                btn.classList.remove('bg-orange-200', 'text-orange-800');
            }
        });

        if (answerIndex === question.correct) {
            this.quizScore += 20;
            this.addPoints(20); // إضافة النقاط العامة
            this.playSuccessSound();
        } else {
            this.playErrorSound();
        }

        setTimeout(() => {
            this.currentQuestionIndex++;
            this.showNextQuestion();
        }, 2000);
    }

    showGameComplete(gameType) {
        let message, emoji;
        
        if (gameType === 'memory') {
            message = `🎉 أحسنت! أكملت لعبة الذاكرة!\n النقاط: ${this.score}\n المحاولات: ${this.attempts}`;
            emoji = '🧠';
        } else if (gameType === 'quiz') {
            const percentage = (this.quizScore / (this.quizQuestions.length * 20)) * 100;
            message = `🏆 انتهت المسابقة!\n نقاطك: ${this.quizScore}\n نسبة النجاح: ${percentage}%`;
            emoji = '🏆';
        }

        setTimeout(() => {
            alert(message);
            this.playVictorySound();
        }, 500);
    }

    // وظائف الأنشطة
    showColoringActivity() {
        this.showComingSoonMessage('صفحات التلوين الجميلة قادمة قريباً! 🎨');
    }

    showDrawingActivity() {
        this.showComingSoonMessage('لوحة الرسم التفاعلية قادمة قريباً! ✏️');
    }

    showStickersActivity() {
        this.showComingSoonMessage('ملصقات المكافآت قادمة قريباً! ⭐');
    }

    showCertificatesActivity() {
        this.showComingSoonMessage('شهادات التميز قادمة قريباً! 🏅');
    }

    showPuzzleGame() {
        this.showComingSoonMessage('لعبة ترتيب الصور قادمة قريباً! 🧩');
    }

    showMatchingGame() {
        this.showComingSoonMessage('لعبة توصيل النقاط قادمة قريباً! 🔗');
    }

    showComingSoonMessage(message) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md text-center animate-bounce">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-2xl font-bold text-slate-800 dark:text-white mb-4">قريباً جداً!</h3>
                <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">${message}</p>
                <button onclick="this.closest('.fixed').remove()" class="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-bold transform hover:scale-105 transition-all duration-200">
                    حسناً! 😊
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // ألعاب جديدة
    showShapesGame() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-4xl w-full">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-indigo-600">🔵 لعبة الأشكال</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
                </div>
                <p class="text-center text-lg mb-6">اعثر على الشكل المختلف!</p>
                <div class="grid grid-cols-4 gap-4 mb-6" id="shapesGrid">
                    <!-- سيتم ملء الأشكال -->
                </div>
                <div class="text-center">
                    <div class="text-lg font-bold text-indigo-700 dark:text-indigo-300 mb-4">
                        النقاط: <span id="shapesScore">0</span> ⭐
                    </div>
                    <button onclick="startShapesGame()" class="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold">
                        ابدأ اللعب 🎯
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.generateShapes();
    }
    
    generateShapes() {
        const shapes = ['🔵', '🔵', '🔵', '🔵', '🔵', '🔵', '🔵', '🔵',
                       '🔵', '🔵', '🔵', '🔵', '🔵', '🔵', '🔵', '⭐'];
        const grid = document.getElementById('shapesGrid');
        if (!grid) return;
        
        // خلط الأشكال
        for (let i = shapes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shapes[i], shapes[j]] = [shapes[j], shapes[i]];
        }
        
        grid.innerHTML = shapes.map((shape, index) => `
            <div class="shape-item w-16 h-16 flex items-center justify-center text-3xl cursor-pointer hover:scale-110 transition-transform bg-slate-100 dark:bg-slate-700 rounded-xl" 
                 onclick="selectShape(${index}, '${shape}')">
                ${shape}
            </div>
        `).join('');
    }
    
    showCountingGame() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-4xl w-full">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-emerald-600">🔢 لعبة عد النجوم</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
                </div>
                <div class="text-center mb-6">
                    <p class="text-lg mb-4">كم عدد النجوم التي تراها؟</p>
                    <div id="starsContainer" class="text-4xl mb-6 min-h-[100px] flex flex-wrap justify-center items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                        <!-- سيتم ملء النجوم -->
                    </div>
                    <div class="grid grid-cols-5 gap-4 max-w-md mx-auto mb-6">
                        ${[1,2,3,4,5,6,7,8,9,10].map(num => `
                            <button onclick="checkAnswer(${num})" class="count-btn w-12 h-12 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-lg font-bold text-lg transition-colors">
                                ${num}
                            </button>
                        `).join('')}
                    </div>
                    <div class="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-4">
                        النقاط: <span id="countingScore">0</span> ⭐
                    </div>
                    <button onclick="generateStars()" class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold">
                        نجوم جديدة ✨
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.generateStars();
    }
    
    generateStars() {
        const container = document.getElementById('starsContainer');
        if (!container) return;
        
        const count = Math.floor(Math.random() * 10) + 1;
        this.currentStarsCount = count;
        
        container.innerHTML = Array(count).fill('⭐').join(' ');
    }
    
    showMusicBox() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-2xl w-full">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-purple-600">🎵 صندوق الموسيقى</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
                </div>
                <div class="space-y-4">
                    <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                        <div class="text-4xl mb-2">🎵</div>
                        <h4 class="font-bold text-purple-700 dark:text-purple-300 mb-2">طبيب القلوب</h4>
                        <p class="text-sm text-purple-600 dark:text-purple-400 mb-3">عن الرسول محمد ﷺ</p>
                        <button class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm">
                            استمع 🎶
                        </button>
                    </div>
                    
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                        <div class="text-4xl mb-2">🎵</div>
                        <h4 class="font-bold text-blue-700 dark:text-blue-300 mb-2">أنا مسلم</h4>
                        <p class="text-sm text-blue-600 dark:text-blue-400 mb-3">نشيد تعليمي جميل</p>
                        <button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm">
                            استمع 🎶
                        </button>
                    </div>
                    
                    <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer">
                        <div class="text-4xl mb-2">🎵</div>
                        <h4 class="font-bold text-green-700 dark:text-green-300 mb-2">تعلموا واتتلوا</h4>
                        <p class="text-sm text-green-600 dark:text-green-400 mb-3">نشيد عن طلب العلم</p>
                        <button class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm">
                            استمع 🎶
                        </button>
                    </div>
                </div>
                <div class="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
                    🎧 الأناشيد الصوتية قادمة قريباً
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    showWordSearch() {
        this.showComingSoonMessage('🔍 لعبة البحث عن الكلمات قادمة قريباً! 🎉');
    }
    
    showTimelineGame() {
        this.showComingSoonMessage('⏰ لعبة الخط الزمني قادمة قريباً! 🎉');
    }
    
    showStoryBuilder() {
        this.showComingSoonMessage('🏗️ بناء القصص قادم قريباً! 🎉');
    }

    // وظائف الصوت (افتراضية)
    playClickSound() {
        if (this.soundEnabled) {
            console.log('🔊 Click sound');
        }
    }

    playStorySound() {
        if (this.soundEnabled) {
            console.log('📖 Story sound');
        }
    }

    playGameSound() {
        if (this.soundEnabled) {
            console.log('🎮 Game sound');
        }
    }

    playCardSound() {
        if (this.soundEnabled) {
            console.log('🃏 Card flip sound');
        }
    }

    playSuccessSound() {
        if (this.soundEnabled) {
            console.log('✅ Success sound');
        }
    }

    playErrorSound() {
        if (this.soundEnabled) {
            console.log('❌ Error sound');
        }
    }

    playVictorySound() {
        if (this.soundEnabled) {
            console.log('🏆 Victory sound');
        }
    }

    setAgeGroup(ageGroup) {
        this.currentAgeGroup = ageGroup;
        
        // تحديث أزرار العمر
        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.classList.remove('ring-4', 'ring-yellow-400');
        });
        event.target.classList.add('ring-4', 'ring-yellow-400');
        
        // إعادة تحميل المحتوى
        this.renderContent();
        this.playClickSound();
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const icon = document.getElementById('soundIcon');
        const button = document.getElementById('soundToggle');
        
        if (this.soundEnabled) {
            icon.className = 'fas fa-volume-up';
            button.classList.remove('bg-gray-100', 'text-gray-600');
            button.classList.add('bg-pink-100', 'text-pink-600');
        } else {
            icon.className = 'fas fa-volume-mute';
            button.classList.remove('bg-pink-100', 'text-pink-600');
            button.classList.add('bg-gray-100', 'text-gray-600');
        }
        
        this.playClickSound();
    }

    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        if (loadingState) loadingState.classList.add('hidden');
    }
    
    // نظام النقاط
    addPoints(points) {
        this.totalPoints += points;
        this.updatePointsDisplay();
        this.checkLevelUp();
        
        // حفظ النقاط في التخزين المحلي
        localStorage.setItem('childrenPoints', this.totalPoints);
    }
    
    updatePointsDisplay() {
        const pointsElement = document.getElementById('totalPoints');
        const progressBar = document.getElementById('progressBar');
        
        if (pointsElement) {
            pointsElement.textContent = this.totalPoints;
        }
        
        if (progressBar) {
            // حساب النسبة المئوية (كل 100 نقطة = مستوى جديد)
            const progress = (this.totalPoints % 100);
            progressBar.style.width = progress + '%';
        }
    }
    
    checkLevelUp() {
        const level = Math.floor(this.totalPoints / 100);
        let message = '';
        let emoji = '';
        
        if (this.totalPoints > 0 && this.totalPoints % 100 === 0) {
            switch (level) {
                case 1:
                    message = 'أصبحت نجماً! ⭐';
                    emoji = '⭐';
                    break;
                case 2:
                    message = 'أصبحت بطلاً! 🏆';
                    emoji = '🏆';
                    break;
                default:
                    message = `مستوى جديد! المستوى ${level} 🎉`;
                    emoji = '🎉';
            }
            
            // إظهار رسالة التهنئة
            setTimeout(() => {
                this.showLevelUpMessage(message, emoji);
            }, 1000);
        }
    }
    
    showLevelUpMessage(message, emoji) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md text-center animate-bounce">
                <div class="text-8xl mb-4">${emoji}</div>
                <h3 class="text-3xl font-bold text-emerald-600 mb-4">مبروك!</h3>
                <p class="text-xl text-slate-600 dark:text-slate-300 mb-6">${message}</p>
                <button onclick="this.closest('.fixed').remove()" class="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white rounded-2xl font-bold text-lg transform hover:scale-105 transition-all duration-200">
                    رائع! 🌟
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // إضافة تأثير الألعاب النارية
        this.createFireworksEffect();
    }
    
    createFireworksEffect() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.innerHTML = ['🎆', '✨', '🌟', '💫'][Math.floor(Math.random() * 4)];
                firework.style.position = 'fixed';
                firework.style.left = Math.random() * window.innerWidth + 'px';
                firework.style.top = Math.random() * window.innerHeight + 'px';
                firework.style.fontSize = (Math.random() * 20 + 15) + 'px';
                firework.style.zIndex = '1000';
                firework.style.pointerEvents = 'none';
                firework.style.animation = 'firework-float 3s ease-out forwards';
                
                document.body.appendChild(firework);
                
                setTimeout(() => {
                    firework.remove();
                }, 3000);
            }, i * 100);
        }
    }
    
    loadSavedPoints() {
        const savedPoints = localStorage.getItem('childrenPoints');
        if (savedPoints) {
            this.totalPoints = parseInt(savedPoints);
            this.updatePointsDisplay();
        }
    }
}

// وظائف عامة للاستخدام في HTML
function setAgeGroup(ageGroup) {
    if (window.childrenPageManager) {
        window.childrenPageManager.setAgeGroup(ageGroup);
    }
}

function toggleSound() {
    if (window.childrenPageManager) {
        window.childrenPageManager.toggleSound();
    }
}

function closeStoryModal() {
    if (window.childrenPageManager) {
        window.childrenPageManager.closeStoryModal();
    }
}

// وظائف للألعاب الجديدة
function startShapesGame() {
    if (window.childrenPageManager) {
        window.childrenPageManager.generateShapes();
    }
}

function selectShape(index, shape) {
    const manager = window.childrenPageManager;
    if (!manager) return;
    
    // الشكل المختلف هو النجمة
    if (shape === '⭐') {
        // إضافة النقاط
        const scoreElement = document.getElementById('shapesScore');
        if (scoreElement) {
            const currentScore = parseInt(scoreElement.textContent) + 10;
            scoreElement.textContent = currentScore;
        }
        
        // إضافة النقاط العامة
        manager.addPoints(10);
        
        // تأثير بصري للنجاح
        event.target.style.transform = 'scale(1.5)';
        event.target.style.backgroundColor = '#ffd700';
        event.target.style.borderRadius = '50%';
        
        // رسالة تهنئة
        setTimeout(() => {
            alert('أحسنت! 🎉 وجدت الشكل المختلف!');
            manager.generateShapes(); // جولة جديدة
        }, 500);
        
        // صوت النجاح
        manager.playSuccessSound();
    } else {
        // تأثير اهتزاز للخطأ
        event.target.style.animation = 'wobble 0.5s';
        setTimeout(() => {
            event.target.style.animation = '';
        }, 500);
        
        alert('حاول مرة أخرى! 😊 ابحث عن الشكل المختلف');
        manager.playErrorSound();
    }
}

function generateStars() {
    if (window.childrenPageManager) {
        window.childrenPageManager.generateStars();
    }
}

function checkAnswer(answer) {
    const manager = window.childrenPageManager;
    if (manager && manager.currentStarsCount) {
        if (answer === manager.currentStarsCount) {
            // إضافة النقاط
            const scoreElement = document.getElementById('countingScore');
            if (scoreElement) {
                const currentScore = parseInt(scoreElement.textContent) + 5;
                scoreElement.textContent = currentScore;
            }
            
            // إضافة النقاط العامة
            manager.addPoints(5);
            
            alert('إجابة صحيحة! 🎉 برافو!');
            manager.playSuccessSound();
            
            // نجوم جديدة تلقائياً
            setTimeout(() => {
                manager.generateStars();
            }, 1000);
        } else {
            alert('حاول مرة أخرى! 😊 عد بعناية أكثر');
            manager.playErrorSound();
        }
    }
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.childrenPageManager = new ChildrenPageManager();
    
    // إضافة تأثيرات مرئية ممتعة
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('game-card') || 
            e.target.classList.contains('story-card') || 
            e.target.classList.contains('activity-card')) {
            
            // إضافة تأثير النجوم
            createStarsEffect(e.target);
        }
    });
    
    // رسالة ترحيب للأطفال
    setTimeout(() => {
        showToast('🌟 أهلاً بك في قسم الأطفال الممتع! 🌟', 'success');
    }, 1000);
});

// تأثير النجوم عند النقر
function createStarsEffect(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.innerHTML = '⭐';
            star.style.position = 'fixed';
            star.style.left = x + (Math.random() - 0.5) * 100 + 'px';
            star.style.top = y + (Math.random() - 0.5) * 100 + 'px';
            star.style.fontSize = '20px';
            star.style.zIndex = '1000';
            star.style.pointerEvents = 'none';
            star.style.animation = 'float-up 2s ease-out forwards';
            
            document.body.appendChild(star);
            
            setTimeout(() => {
                star.remove();
            }, 2000);
        }, i * 200);
    }
}

// إضافة CSS للرسوم المتحركة
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes float-up {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(0.5);
        }
    }
    
    .children-section {
        animation: gentle-float 3s ease-in-out infinite;
    }
    
    @keyframes gentle-float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-5px);
        }
    }
    
    .memory-card:hover {
        animation: wobble 0.5s ease-in-out;
    }
    
    @keyframes wobble {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
    }
    
    @keyframes firework-float {
        0% {
            opacity: 1;
            transform: translateY(0) scale(0);
        }
        50% {
            opacity: 1;
            transform: translateY(-50px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(0.5);
        }
    }
    
    .children-section:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
`;
document.head.appendChild(styleSheet);

console.log('تم تحميل قسم الأطفال بنجاح! 🌟👶');