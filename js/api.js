/**
 * ملف API للتعامل مع قاعدة البيانات
 * يحتوي على جميع وظائف التفاعل مع الجداول
 */

class ApiManager {
    constructor() {
        this.baseUrl = '';
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    /**
     * طلب عام للـ API
     */
    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const config = {
                headers: this.headers,
                ...options
            };

            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // إذا كان الاستجابة فارغة (مثل DELETE)
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error(`خطأ في API request لـ ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * الحصول على قائمة العناصر مع إعدادات التصفح
     */
    async getList(tableName, params = {}) {
        const searchParams = new URLSearchParams();
        
        // إعدادات الصفحات
        if (params.page) searchParams.append('page', params.page);
        if (params.limit) searchParams.append('limit', params.limit);
        
        // البحث
        if (params.search) searchParams.append('search', params.search);
        
        // الترتيب
        if (params.sort) searchParams.append('sort', params.sort);
        
        const endpoint = `tables/${tableName}?${searchParams.toString()}`;
        return await this.request(endpoint);
    }

    /**
     * الحصول على عنصر واحد
     */
    async getItem(tableName, id) {
        const endpoint = `tables/${tableName}/${id}`;
        return await this.request(endpoint);
    }

    /**
     * إنشاء عنصر جديد
     */
    async createItem(tableName, data) {
        const endpoint = `tables/${tableName}`;
        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * تحديث عنصر موجود (كامل)
     */
    async updateItem(tableName, id, data) {
        const endpoint = `tables/${tableName}/${id}`;
        return await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * تحديث عنصر موجود (جزئي)
     */
    async patchItem(tableName, id, data) {
        const endpoint = `tables/${tableName}/${id}`;
        return await this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    /**
     * حذف عنصر
     */
    async deleteItem(tableName, id) {
        const endpoint = `tables/${tableName}/${id}`;
        return await this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

// إنشاء مثيل عام من ApiManager
const api = new ApiManager();

/**
 * فئة خاصة لإدارة بيانات الأنبياء
 */
class ProphetsApi {
    constructor(apiManager) {
        this.api = apiManager;
        this.tableName = 'prophets';
    }

    async getAll(params = {}) {
        return await this.api.getList(this.tableName, params);
    }

    async getById(id) {
        return await this.api.getItem(this.tableName, id);
    }

    async getFeatured() {
        return await this.api.getList(this.tableName, { 
            limit: 10,
            sort: 'timeline'
        });
    }

    async search(query) {
        return await this.api.getList(this.tableName, {
            search: query,
            limit: 20
        });
    }

    async create(prophetData) {
        return await this.api.createItem(this.tableName, prophetData);
    }

    async update(id, prophetData) {
        return await this.api.updateItem(this.tableName, id, prophetData);
    }

    async delete(id) {
        return await this.api.deleteItem(this.tableName, id);
    }
}

/**
 * فئة خاصة لإدارة بيانات السيرة النبوية
 */
class SeerahApi {
    constructor(apiManager) {
        this.api = apiManager;
        this.tableName = 'seerah_sections';
    }

    async getAll(params = {}) {
        return await this.api.getList(this.tableName, {
            sort: 'order_num',
            ...params
        });
    }

    async getById(id) {
        return await this.api.getItem(this.tableName, id);
    }

    async getByPhase(phase) {
        return await this.api.getList(this.tableName, {
            search: phase,
            sort: 'order_num'
        });
    }

    async create(sectionData) {
        return await this.api.createItem(this.tableName, sectionData);
    }

    async update(id, sectionData) {
        return await this.api.updateItem(this.tableName, id, sectionData);
    }

    async delete(id) {
        return await this.api.deleteItem(this.tableName, id);
    }
}

/**
 * فئة خاصة لإدارة بيانات الغزوات
 */
class BattlesApi {
    constructor(apiManager) {
        this.api = apiManager;
        this.tableName = 'battles';
    }

    async getAll(params = {}) {
        return await this.api.getList(this.tableName, params);
    }

    async getById(id) {
        return await this.api.getItem(this.tableName, id);
    }

    async getChronological() {
        return await this.api.getList(this.tableName, {
            sort: 'hijri_date',
            limit: 50
        });
    }

    async search(query) {
        return await this.api.getList(this.tableName, {
            search: query,
            limit: 20
        });
    }

    async create(battleData) {
        return await this.api.createItem(this.tableName, battleData);
    }

    async update(id, battleData) {
        return await this.api.updateItem(this.tableName, id, battleData);
    }

    async delete(id) {
        return await this.api.deleteItem(this.tableName, id);
    }
}

/**
 * فئة خاصة لإدارة بيانات الصحابة
 */
class CompanionsApi {
    constructor(apiManager) {
        this.api = apiManager;
        this.tableName = 'companions';
    }

    async getAll(params = {}) {
        return await this.api.getList(this.tableName, params);
    }

    async getById(id) {
        return await this.api.getItem(this.tableName, id);
    }

    async getFeatured() {
        return await this.api.getList(this.tableName, {
            limit: 10
        });
    }

    async getByCategory(category) {
        return await this.api.getList(this.tableName, {
            search: category,
            limit: 50
        });
    }

    async search(query) {
        return await this.api.getList(this.tableName, {
            search: query,
            limit: 20
        });
    }

    async create(companionData) {
        return await this.api.createItem(this.tableName, companionData);
    }

    async update(id, companionData) {
        return await this.api.updateItem(this.tableName, id, companionData);
    }

    async delete(id) {
        return await this.api.deleteItem(this.tableName, id);
    }
}

/**
 * فئة خاصة لإدارة الأسئلة والأجوبة
 */
class QnaApi {
    constructor(apiManager) {
        this.api = apiManager;
        this.tableName = 'qna';
    }

    async getAll(params = {}) {
        return await this.api.getList(this.tableName, {
            sort: '-votes',
            ...params
        });
    }

    async getById(id) {
        return await this.api.getItem(this.tableName, id);
    }

    async getPublished() {
        return await this.api.getList(this.tableName, {
            sort: '-votes',
            limit: 50
        });
    }

    async getByCategory(category) {
        return await this.api.getList(this.tableName, {
            search: category,
            sort: '-votes'
        });
    }

    async search(query) {
        return await this.api.getList(this.tableName, {
            search: query,
            limit: 20
        });
    }

    async create(qnaData) {
        return await this.api.createItem(this.tableName, {
            ...qnaData,
            votes: 0,
            is_published: false
        });
    }

    async update(id, qnaData) {
        return await this.api.updateItem(this.tableName, id, qnaData);
    }

    async vote(id, voteChange = 1) {
        const item = await this.getById(id);
        if (item) {
            return await this.api.patchItem(this.tableName, id, {
                votes: (item.votes || 0) + voteChange
            });
        }
    }

    async delete(id) {
        return await this.api.deleteItem(this.tableName, id);
    }
}

/**
 * فئة خاصة لإدارة بيانات المستخدمين
 */
class UsersApi {
    constructor(apiManager) {
        this.api = apiManager;
        this.tableName = 'users';
    }

    async getAll(params = {}) {
        return await this.api.getList(this.tableName, params);
    }

    async getById(id) {
        return await this.api.getItem(this.tableName, id);
    }

    async getByEmail(email) {
        return await this.api.getList(this.tableName, {
            search: email,
            limit: 1
        });
    }

    async create(userData) {
        return await this.api.createItem(this.tableName, {
            ...userData,
            favorites: [],
            reading_progress: [],
            join_date: new Date().toISOString()
        });
    }

    async update(id, userData) {
        return await this.api.updateItem(this.tableName, id, userData);
    }

    async addToFavorites(userId, itemId, itemType) {
        const user = await this.getById(userId);
        if (user && user.favorites) {
            const favorites = [...user.favorites];
            const favoriteItem = { id: itemId, type: itemType, added_at: new Date().toISOString() };
            
            // التحقق من عدم وجود العنصر مسبقاً
            if (!favorites.some(fav => fav.id === itemId && fav.type === itemType)) {
                favorites.push(favoriteItem);
                return await this.api.patchItem(this.tableName, userId, {
                    favorites: favorites
                });
            }
        }
        return null;
    }

    async removeFromFavorites(userId, itemId, itemType) {
        const user = await this.getById(userId);
        if (user && user.favorites) {
            const favorites = user.favorites.filter(fav => 
                !(fav.id === itemId && fav.type === itemType)
            );
            return await this.api.patchItem(this.tableName, userId, {
                favorites: favorites
            });
        }
        return null;
    }

    async updateReadingProgress(userId, itemId, itemType, progress = 100) {
        const user = await this.getById(userId);
        if (user) {
            const readingProgress = user.reading_progress || [];
            const existingIndex = readingProgress.findIndex(p => 
                p.id === itemId && p.type === itemType
            );

            const progressItem = {
                id: itemId,
                type: itemType,
                progress: progress,
                updated_at: new Date().toISOString()
            };

            if (existingIndex >= 0) {
                readingProgress[existingIndex] = progressItem;
            } else {
                readingProgress.push(progressItem);
            }

            return await this.api.patchItem(this.tableName, userId, {
                reading_progress: readingProgress
            });
        }
        return null;
    }

    async delete(id) {
        return await this.api.deleteItem(this.tableName, id);
    }
}

// إنشاء مثيل من كل فئة API
const prophetsApi = new ProphetsApi(api);
const seerahApi = new SeerahApi(api);
const battlesApi = new BattlesApi(api);
const companionsApi = new CompanionsApi(api);
const qnaApi = new QnaApi(api);
const usersApi = new UsersApi(api);

/**
 * فئة مساعدة للبحث العام
 */
class SearchEngine {
    constructor() {
        this.apis = {
            prophets: prophetsApi,
            seerah: seerahApi,
            battles: battlesApi,
            companions: companionsApi,
            qna: qnaApi
        };
    }

    async searchAll(query, limit = 5) {
        try {
            const searchPromises = Object.entries(this.apis).map(async ([type, apiInstance]) => {
                try {
                    const result = await apiInstance.search(query);
                    return {
                        type: type,
                        results: result?.data?.slice(0, limit) || []
                    };
                } catch (error) {
                    console.error(`خطأ في البحث في ${type}:`, error);
                    return { type: type, results: [] };
                }
            });

            const allResults = await Promise.all(searchPromises);
            return allResults.filter(result => result.results.length > 0);

        } catch (error) {
            console.error('خطأ في البحث العام:', error);
            return [];
        }
    }

    async searchInCategory(category, query, limit = 10) {
        const apiInstance = this.apis[category];
        if (apiInstance) {
            try {
                return await apiInstance.search(query);
            } catch (error) {
                console.error(`خطأ في البحث في ${category}:`, error);
                return null;
            }
        }
        return null;
    }
}

// إنشاء مثيل من محرك البحث
const searchEngine = new SearchEngine();

/**
 * فئة مساعدة للإحصائيات
 */
class StatsManager {
    constructor() {
        this.apis = {
            prophets: prophetsApi,
            battles: battlesApi,
            companions: companionsApi,
            qna: qnaApi
        };
    }

    async getAllStats() {
        try {
            const statsPromises = Object.entries(this.apis).map(async ([type, apiInstance]) => {
                try {
                    const result = await apiInstance.getAll({ limit: 1 });
                    return {
                        type: type,
                        count: result?.total || 0
                    };
                } catch (error) {
                    console.error(`خطأ في جلب إحصائيات ${type}:`, error);
                    return { type: type, count: 0 };
                }
            });

            const allStats = await Promise.all(statsPromises);
            return Object.fromEntries(allStats.map(stat => [stat.type, stat.count]));

        } catch (error) {
            console.error('خطأ في جلب الإحصائيات:', error);
            return {
                prophets: 0,
                battles: 0,
                companions: 0,
                qna: 0
            };
        }
    }
}

// إنشاء مثيل من مدير الإحصائيات
const statsManager = new StatsManager();

/**
 * وظائف مساعدة عامة
 */

// معالجة الأخطاء
function handleApiError(error, context = '') {
    console.error(`خطأ API في ${context}:`, error);
    
    if (error.message.includes('404')) {
        showToast('العنصر المطلوب غير موجود', 'error');
    } else if (error.message.includes('500')) {
        showToast('خطأ في الخادم، يرجى المحاولة لاحقاً', 'error');
    } else if (error.message.includes('403')) {
        showToast('ليس لديك صلاحية لهذا الإجراء', 'error');
    } else {
        showToast('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى', 'error');
    }
}

// تنسيق التاريخ
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

// تنسيق النص
function truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// التحقق من صحة البيانات
function validateData(data, requiredFields = []) {
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            errors.push(`الحقل ${field} مطلوب`);
        }
    });
    
    return errors;
}

// تصدير جميع الوظائف والفئات للاستخدام العام
window.api = {
    core: api,
    prophets: prophetsApi,
    seerah: seerahApi,
    battles: battlesApi,
    companions: companionsApi,
    qna: qnaApi,
    users: usersApi,
    search: searchEngine,
    stats: statsManager,
    utils: {
        handleApiError,
        formatDate,
        truncateText,
        validateData
    }
};

console.log('تم تحميل API Manager بنجاح ✅');