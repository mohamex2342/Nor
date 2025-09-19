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
        
        this.init();
    }

    async init() {
        this.loadContent();
        this.setupEventListeners();
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
                id: 'puzzle',
                title: '🧩 ترتيب الصور',
                description: 'رتب قطع الصورة المبعثرة',
                icon: '🧩',
                action: 'showPuzzleGame',
                ageGroup: ['3-5', '6-8']
            },
            {
                id: 'matching',
                title: '🔗 توصيل النقاط',
                description: 'وصل النبي مع معجزته',
                icon: '🔗',
                action: 'showMatchingGame',
                ageGroup: ['3-5', '6-8', '9-12']
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
        alert(message);
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
`;
document.head.appendChild(styleSheet);

console.log('تم تحميل قسم الأطفال بنجاح! 🌟👶');