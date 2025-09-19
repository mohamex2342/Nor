/**
 * ملف JavaScript الخاص بصفحة السيرة النبوية
 * يحتوي على جميع الوظائف المتعلقة بعرض وإدارة السيرة النبوية
 */

class SeerahPageManager {
    constructor() {
        this.allSections = [];
        this.currentModal = null;
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        await this.loadSeerahSections();
        this.setupEventListeners();
        this.renderTimeline();
        this.hideLoading();
    }

    async loadSeerahSections() {
        try {
            this.showLoading();
            const response = await seerahApi.getAll({ limit: 50, sort: 'order_num' });
            
            if (response && response.data) {
                this.allSections = response.data;
            } else {
                // البيانات التجريبية في حالة عدم وجود اتصال بقاعدة البيانات
                this.loadFallbackData();
            }
        } catch (error) {
            console.error('خطأ في تحميل السيرة النبوية:', error);
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        this.allSections = [
            {
                id: 'pre_mission',
                title: 'مرحلة ما قبل البعثة',
                phase: 'مرحلة ما قبل البعثة',
                hijri_year: 'قبل البعثة',
                order_num: 1,
                content: `
                    <p>ولد الرسول صلى الله عليه وسلم في عام الفيل (571م) في مكة المكرمة من قبيلة قريش العريقة. كان أبوه عبد الله بن عبد المطلب، وأمه آمنة بنت وهب.</p>
                    
                    <h3>الطفولة واليتم المبكر:</h3>
                    <p>توفي والده عبد الله قبل ولادته، فنشأ يتيماً في كنف جده عبد المطلب. عندما بلغ السادسة من عمره، توفيت أمه آمنة، وفي الثامنة توفي جده، فكفله عمه أبو طالب.</p>
                    
                    <h3>الشباب والعمل:</h3>
                    <p>عمل في رعي الغنم، ثم في التجارة. كان معروفاً بالصادق الأمين قبل البعثة. تزوج من خديجة بنت خويلد رضي الله عنها عندما كان عمره 25 عاماً.</p>
                    
                    <h3>التحنث في غار حراء:</h3>
                    <p>كان يتعبد في غار حراء الليالي ذوات العدد، يتفكر في خلق الله ويبتعد عن ضلالات الجاهلية وعبادة الأصنام.</p>
                `
            },
            {
                id: 'mecca_period',
                title: 'البعثة في مكة',
                phase: 'البعثة في مكة',
                hijri_year: '1-13 هـ',
                order_num: 2,
                content: `
                    <h3>بداية الوحي:</h3>
                    <p>نزل جبريل عليه السلام على النبي ﷺ في غار حراء وهو في الأربعين من عمره، فكانت أول آية نزلت: "اقرأ باسم ربك الذي خلق".</p>
                    
                    <h3>الدعوة السرية:</h3>
                    <p>بدأت الدعوة سراً لمدة ثلاث سنوات. آمنت خديجة أولاً، ثم أبو بكر من الرجال، وعلي من الصبيان، وزيد بن حارثة من الموالي.</p>
                    
                    <h3>الدعوة الجهرية:</h3>
                    <p>بعد نزول "وأنذر عشيرتك الأقربين" أعلن النبي ﷺ دعوته جهراً. واجه أذى شديداً من قريش، فهاجر بعض المسلمين إلى الحبشة.</p>
                    
                    <h3>عام الحزن:</h3>
                    <p>توفي أبو طالب وخديجة رضي الله عنها في نفس العام، فسمي بعام الحزن. اشتد أذى قريش بعد فقدان الحماية.</p>
                `
            },
            {
                id: 'hijra',
                title: 'الهجرة إلى المدينة',
                phase: 'الهجرة',
                hijri_year: '13-14 هـ',
                order_num: 3,
                content: `
                    <h3>بيعة العقبة:</h3>
                    <p>بايع الأنصار من المدينة الرسول ﷺ في بيعة العقبة الأولى والثانية، ووعدوه بالحماية والنصرة إذا هاجر إليهم.</p>
                    
                    <h3>الإذن بالهجرة:</h3>
                    <p>أذن الله لرسوله بالهجرة بعد أن خطط كفار قريش لقتله. هاجر مع صاحبه أبي بكر الصديق رضي الله عنه.</p>
                    
                    <h3>رحلة الهجرة:</h3>
                    <p>خرجا من مكة خفية واختبئا في غار ثور ثلاثة أيام. وصلا إلى المدينة بعد رحلة استغرقت أسبوعين تقريباً.</p>
                    
                    <h3>الوصول إلى المدينة:</h3>
                    <p>استقبله أهل المدينة بالترحيب والفرح. بدأ التقويم الهجري من هذا التاريخ المبارك.</p>
                `
            },
            {
                id: 'medina_period',
                title: 'المدينة المنورة',
                phase: 'المدينة المنورة',
                hijri_year: '1-11 هـ',
                order_num: 4,
                content: `
                    <h3>بناء المسجد النبوي:</h3>
                    <p>أول عمل قام به النبي ﷺ هو بناء المسجد النبوي الذي كان مركزاً للعبادة والحكم والتعليم.</p>
                    
                    <h3>المؤاخاة بين المهاجرين والأنصار:</h3>
                    <p>آخى الرسول ﷺ بين المهاجرين والأنصار، فكانت هذه المؤاخاة نموذجاً فريداً في التكافل الاجتماعي.</p>
                    
                    <h3>وضع الدستور:</h3>
                    <p>وضع النبي ﷺ دستوراً ينظم العلاقات بين سكان المدينة من المسلمين واليهود والقبائل العربية.</p>
                    
                    <h3>الغزوات والفتوحات:</h3>
                    <p>خاض النبي ﷺ العديد من الغزوات للدفاع عن الدولة الإسلامية الناشئة، أشهرها بدر وأحد والأحزاب.</p>
                    
                    <h3>فتح مكة:</h3>
                    <p>في العام الثامن للهجرة، فتح النبي ﷺ مكة فتحاً مبيناً، وطهر الكعبة من الأصنام، ودخل الناس في دين الله أفواجاً.</p>
                `
            },
            {
                id: 'death',
                title: 'الوفاة والانتقال إلى الرفيق الأعلى',
                phase: 'الوفاة',
                hijri_year: '11 هـ',
                order_num: 5,
                content: `
                    <h3>حجة الوداع:</h3>
                    <p>في العام العاشر للهجرة، حج النبي ﷺ حجة الوداع، وألقى خطبته الشهيرة التي جمعت أصول الإسلام ومبادئه.</p>
                    
                    <h3>مرض الوفاة:</h3>
                    <p>مرض النبي ﷺ في بيت عائشة رضي الله عنها، وكان يصلي بالناس وهو مريض. في أيامه الأخيرة، أوصى بالصلاة وما ملكت الأيمان.</p>
                    
                    <h3>الانتقال إلى الرفيق الأعلى:</h3>
                    <p>توفي النبي ﷺ في يوم الاثنين 12 ربيع الأول من العام 11 للهجرة، وله من العمر 63 عاماً، بعد أن بلغ الرسالة وأدى الأمانة.</p>
                    
                    <h3>اختيار الخليفة:</h3>
                    <p>بعد وفاة النبي ﷺ، اجتمع المسلمون في سقيفة بني ساعدة واختاروا أبا بكر الصديق خليفة للمسلمين.</p>
                `
            }
        ];
    }

    setupEventListeners() {
        // إغلاق النافذة عند النقر خارجها
        const modal = document.getElementById('sectionModal');
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

    renderTimeline() {
        const timeline = document.getElementById('seerahTimeline');
        if (!timeline) return;

        const timelineHTML = `
            <div class="relative">
                <!-- خط الزمن -->
                <div class="absolute right-4 md:right-1/2 md:transform md:-translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-600 rounded-full" style="height: calc(100% - 40px); top: 40px;"></div>
                
                ${this.allSections.map((section, index) => this.createTimelineItem(section, index)).join('')}
            </div>
        `;

        timeline.innerHTML = timelineHTML;

        // إضافة الرسوم المتحركة
        setTimeout(() => {
            const items = timeline.querySelectorAll('.timeline-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate-fadeInUp');
                }, index * 200);
            });
        }, 100);
    }

    createTimelineItem(section, index) {
        const isRight = index % 2 === 0;
        const colors = [
            'from-blue-500 to-purple-600',
            'from-emerald-500 to-blue-600',
            'from-purple-500 to-pink-600',
            'from-amber-500 to-orange-600',
            'from-red-500 to-pink-600'
        ];
        const gradientClass = colors[index] || colors[0];
        
        return `
            <div class="timeline-item relative mb-16 opacity-0 transform translate-y-8 transition-all duration-600 cursor-pointer group"
                 onclick="seerahPageManager.showSectionDetails('${section.id}')">
                
                <!-- النقطة في الخط الزمني -->
                <div class="absolute right-0 md:right-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-gradient-to-br ${gradientClass} rounded-full border-4 border-white dark:border-slate-800 shadow-lg group-hover:scale-125 transition-transform duration-300 z-10">
                    <div class="absolute inset-2 bg-white dark:bg-slate-800 rounded-full"></div>
                </div>
                
                <!-- محتوى المرحلة -->
                <div class="mr-16 md:mr-0 ${isRight ? 'md:ml-8 md:text-right' : 'md:mr-8 md:text-left'} ${isRight ? 'md:pr-16' : 'md:pl-16'}">
                    <div class="card group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                        
                        <!-- رأس البطاقة -->
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-3 space-x-reverse">
                                <div class="w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center text-white">
                                    <span class="font-bold text-lg">${section.order_num}</span>
                                </div>
                                <div>
                                    <h3 class="font-amiri text-xl font-bold text-slate-800 dark:text-white">
                                        ${section.title}
                                    </h3>
                                    <p class="text-slate-500 dark:text-slate-400 text-sm">
                                        ${section.hijri_year}
                                    </p>
                                </div>
                            </div>
                            <div class="text-slate-400 dark:text-slate-500">
                                <i class="fas fa-arrow-left group-hover:translate-x-1 transition-transform duration-200"></i>
                            </div>
                        </div>
                        
                        <!-- معاينة المحتوى -->
                        <div class="prose dark:prose-invert max-w-none">
                            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                                ${this.extractPreview(section.content)}
                            </p>
                        </div>
                        
                        <!-- الأزرار -->
                        <div class="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
                            <button class="flex items-center space-x-2 space-x-reverse text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                                <i class="fas fa-book-open"></i>
                                <span>قراءة التفاصيل</span>
                            </button>
                            <div class="flex items-center space-x-2 space-x-reverse">
                                <button onclick="event.stopPropagation(); seerahPageManager.sharePeriod('${section.id}')"
                                        class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 transition-all duration-200"
                                        title="مشاركة">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                                <button onclick="event.stopPropagation(); seerahPageManager.printPeriod('${section.id}')"
                                        class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-gray-500 transition-all duration-200"
                                        title="طباعة">
                                    <i class="fas fa-print"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    extractPreview(content) {
        if (!content) return 'محتوى هذه المرحلة قيد الإعداد...';
        
        // استخراج النص من HTML وقص الطول
        const textOnly = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        return textOnly.length > 200 ? textOnly.substring(0, 200) + '...' : textOnly;
    }

    showSectionDetails(sectionId) {
        const section = this.allSections.find(s => s.id === sectionId);
        if (!section) return;

        const modal = document.getElementById('sectionModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        if (!modal || !modalTitle || !modalContent) return;

        modalTitle.textContent = section.title;

        modalContent.innerHTML = `
            <div class="space-y-8">
                <!-- رأس المرحلة -->
                <div class="text-center border-b border-slate-200 dark:border-slate-600 pb-6">
                    <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mb-4">
                        <span class="font-bold">${section.order_num}</span>
                    </div>
                    <h2 class="font-amiri text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        ${section.title}
                    </h2>
                    <p class="text-slate-500 dark:text-slate-400 text-lg">
                        ${section.hijri_year}
                    </p>
                    <div class="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mt-4"></div>
                </div>

                <!-- المحتوى التفصيلي -->
                <div class="prose dark:prose-invert max-w-none">
                    <div class="text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-4 font-amiri">
                        ${section.content || 'محتوى هذه المرحلة قيد الإعداد...'}
                    </div>
                </div>

                <!-- معلومات إضافية -->
                <div class="grid md:grid-cols-2 gap-6 mt-8">
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                        <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-3 flex items-center">
                            <i class="fas fa-calendar-alt text-blue-500 ml-3"></i>
                            التوقيت
                        </h4>
                        <p class="text-slate-600 dark:text-slate-300">
                            ${section.hijri_year}
                        </p>
                    </div>
                    
                    <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                        <h4 class="font-bold text-lg text-slate-800 dark:text-white mb-3 flex items-center">
                            <i class="fas fa-map-marked-alt text-purple-500 ml-3"></i>
                            المرحلة
                        </h4>
                        <p class="text-slate-600 dark:text-slate-300">
                            ${section.phase}
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
                        <a href="battles.html" class="flex items-center space-x-2 space-x-reverse p-3 bg-white dark:bg-slate-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-800 transition-colors">
                            <i class="fas fa-shield-alt text-amber-500"></i>
                            <span class="text-slate-700 dark:text-slate-200">الغزوات</span>
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
                    <button onclick="seerahPageManager.sharePeriod('${section.id}')" 
                            class="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors font-medium">
                        <i class="fas fa-share-alt"></i>
                        <span>مشاركة</span>
                    </button>
                    <button onclick="seerahPageManager.printPeriod('${section.id}')"
                            class="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium">
                        <i class="fas fa-print"></i>
                        <span>طباعة</span>
                    </button>
                    <button onclick="seerahPageManager.downloadPeriod('${section.id}')"
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
        const modal = document.getElementById('sectionModal');
        if (modal) {
            modal.classList.add('hidden');
            this.currentModal = null;
            document.body.style.overflow = '';
        }
    }

    sharePeriod(sectionId) {
        const section = this.allSections.find(s => s.id === sectionId);
        if (!section) return;

        const shareData = {
            title: `${section.title} - السيرة النبوية`,
            text: `تعرف على ${section.title} من السيرة النبوية الشريفة`,
            url: `${window.location.origin}/seerah.html#${sectionId}`
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

    printPeriod(sectionId) {
        const section = this.allSections.find(s => s.id === sectionId);
        if (!section) return;

        const printContent = `
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>${section.title} - السيرة النبوية</title>
                <style>
                    body { font-family: 'Amiri', serif; line-height: 1.8; margin: 20px; }
                    h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                    h2 { color: #1d4ed8; margin-top: 30px; }
                    h3 { color: #1e40af; margin-top: 20px; }
                    .content { margin: 20px 0; }
                    .period-info { background: #eff6ff; padding: 15px; border-right: 4px solid #3b82f6; margin: 20px 0; }
                    p { margin: 10px 0; }
                </style>
            </head>
            <body>
                <h1>${section.title}</h1>
                <div class="period-info">
                    <strong>التوقيت:</strong> ${section.hijri_year}<br>
                    <strong>المرحلة:</strong> ${section.phase}
                </div>
                <div class="content">
                    ${section.content || ''}
                </div>
                <footer style="margin-top: 40px; text-align: center; color: #666;">
                    <p>من موقع نور الهداية - السيرة النبوية الشريفة</p>
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

    downloadPeriod(sectionId) {
        const section = this.allSections.find(s => s.id === sectionId);
        if (!section) return;

        const content = `
${section.title}
${'='.repeat(section.title.length)}

التوقيت: ${section.hijri_year}
المرحلة: ${section.phase}

${section.content ? section.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : ''}

---
من موقع نور الهداية
        `.trim();

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${section.title}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast('تم تحميل الملف بنجاح', 'success');
    }

    showLoading() {
        const loadingState = document.getElementById('loadingState');
        const timeline = document.getElementById('seerahTimeline');
        if (loadingState) loadingState.classList.remove('hidden');
        if (timeline) timeline.classList.add('hidden');
        this.isLoading = true;
    }

    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        const timeline = document.getElementById('seerahTimeline');
        if (loadingState) loadingState.classList.add('hidden');
        if (timeline) timeline.classList.remove('hidden');
        this.isLoading = false;
    }
}

// وظائف عامة للاستخدام في HTML
function closeModal() {
    if (window.seerahPageManager) {
        window.seerahPageManager.closeModal();
    }
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.seerahPageManager = new SeerahPageManager();
    
    // معالجة الرابط المباشر إلى مرحلة معينة
    const hash = window.location.hash.substring(1);
    if (hash) {
        setTimeout(() => {
            window.seerahPageManager.showSectionDetails(hash);
        }, 1500);
    }
});

console.log('تم تحميل صفحة السيرة النبوية بنجاح ✨');