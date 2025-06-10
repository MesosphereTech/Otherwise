// 主应用逻辑文件
class OtherwiseApp {
    constructor() {
        this.currentUser = null;
        this.projects = []; 
        this.subscriptionManager = new SubscriptionManager();
        this.init();
    }

    init() {
        this.loadUserSession();
        this.bindEvents();
        this.loadInitialData();
    }

    loadUserSession() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const username = localStorage.getItem('username');
        
        if (isLoggedIn === 'true' && username) {
            const currentUserData = localStorage.getItem('currentUser');
            if (currentUserData) {
                 try {
                    this.currentUser = JSON.parse(currentUserData);
                    this.currentUser.isLoggedIn = true;
                 } catch (e) {
                    console.error("Failed to parse currentUser from localStorage:", e);
                     this.currentUser = {
                        username: username,
                        isLoggedIn: true
                    };
                 }
            } else {
                 this.currentUser = {
                    username: username,
                    isLoggedIn: true
                };
            }
        } else {
            this.currentUser = null;
        }
    }

    bindEvents() {
        document.addEventListener('submit', this.handleFormSubmit.bind(this));
        document.addEventListener('click', this.handleClicks.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleFormSubmit(event) {
        if (event.target.id === 'loginForm' || event.target.id === 'registerForm') {
             event.preventDefault();
        }
        
        const form = event.target;
        
        if (form.id === 'loginForm') {
            console.log("Login form submission intercepted by main.js, passing to Auth class if event listener exists there.");
        } else if (form.id === 'registerForm') {
             console.log("Register form submission intercepted by main.js, passing to Auth class if event listener exists there.");
        } else if (form.id === 'createTopicForm') {
             event.preventDefault();
             this.handleTopicSubmit(form);
        }
    }

    handleClicks(event) {
        const target = event.target;
        
        if (target.closest('.message') && target.classList.contains('close-btn')) {
            target.closest('.message').remove();
            return;
         }

        if (target.classList.contains('profile-tab') || target.classList.contains('discussion-tab')) {
             return; 
        }
        
        if (target.classList.contains('sort-btn')) {
             return;
        }
        
         if (target.id === 'logoutButton' || target.closest('#navButtons')?.querySelector('button[onclick="window.otherwiseApp?.logout()"]') === target) {
             this.logout();
         }
          if (target.id === 'createProjectButton' || target.closest('.flex')?.querySelector('button[onclick="createProject()"]') === target) {
              this.createProject();
          }
    }

    handleKeyDown(event) {
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.fixed.inset-0:not(.hidden)');
            openModals.forEach(modal => {
                 if (modal.id === 'forgotPasswordModal' && typeof closeForgotPasswordModal === 'function') {
                    closeForgotPasswordModal();
                 } else if (modal.id === 'editProfileModal' && typeof closeEditModal === 'function') {
                    closeEditModal();
                 } else if (modal.id === 'termsModal' && typeof closeModal === 'function') {
                     closeModal('termsModal');
                 } else if (modal.id === 'privacyModal' && typeof closeModal === 'function') {
                     closeModal('privacyModal');
                 }
                  else {
                    modal.classList.add('hidden');
                  }
            });
        }
        
        if (event.ctrlKey && event.key === 'Enter') {
            const commentInput = document.getElementById('commentInput');
            if (commentInput && document.activeElement === commentInput) {
                if (typeof postComment === 'function') {
                   postComment();
                } else {
                   console.warn("postComment function not found, cannot post comment via Ctrl+Enter.");
                }
            }
        }
    }

    postComment() {
        if (!this.currentUser || !this.currentUser.isLoggedIn) {
            this.showMessage('请先登录才能发表观点', 'error');
            return;
        }

        const commentInput = document.getElementById('commentInput');
        const comment = commentInput.value.trim();
        
        if (comment === '') {
            this.showMessage('请输入您的观点', 'error');
            return;
        }

        const opinionTypeRadio = document.querySelector('input[name="opinion-type"]:checked');
        if (!opinionTypeRadio) {
            this.showMessage('请选择意见类型（否定或支持）', 'error');
            return;
        }
        const opinionType = opinionTypeRadio.value;

        console.log(`Posting comment (${opinionType}): ${comment}`);
        this.showMessage('观点发表成功！', 'success');
        commentInput.value = '';
        
        this.addCommentToPage(comment, opinionType);
        
        if (opinionTypeRadio) {
             opinionTypeRadio.checked = false;
        }
    }

    addCommentToPage(comment, type) {
        const discussionList = document.getElementById('discussionList');
        if (!discussionList) return;

        const now = new Date();
        const formattedTime = '刚刚';

        const borderColor = type === 'negation' ? 'border-red-500' : 'border-green-500';
        const bgColor = type === 'negation' ? 'bg-red-100' : 'bg-green-100';
        const textColor = type === 'negation' ? 'text-red-600' : 'text-green-600';
        const badgeColor = type === 'negation' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600';
        const typeText = type === 'negation' ? '否定' : '支持';
        const username = this.currentUser?.username || '匿名用户';

        const commentHTML = `
            <div class="border-l-4 ${borderColor} pl-4 py-2 fade-in">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center space-x-3">
                        <span class="w-8 h-8 ${bgColor} rounded-full flex items-center justify-center">
                            <span class="${textColor} text-xs font-semibold">${username[0].toUpperCase()}</span>
                        </span>
                        <div>
                            <span class="font-medium text-gray-900">${username}</span>
                            ${this.currentUser?.userType ? `<span class="text-gray-500 text-sm ml-2">• ${this.getUserTypeText(this.currentUser.userType)}</span>` : ''}
                            <span class="${badgeColor} text-xs px-2 py-1 rounded ml-2">${typeText}</span>
                        </div>
                    </div>
                    <span class="text-sm text-gray-500">${formattedTime}</span>
                </div>
                <p class="text-gray-700 mb-3">${comment}</p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <button class="hover:text-gray-700">👍 0</button>
                    <button class="hover:text-gray-700">回复</button>
                    ${type === 'negation' ? '<button class="hover:text-gray-700">继续否定</button>' : ''}
                </div>
            </div>
        `;

        discussionList.insertAdjacentHTML('afterbegin', commentHTML);
    }

    getUserTypeText(userType) {
        const typeMap = {
            'university': '高等院校研究者',
            'research': '科研院所研究员', 
            'industry': '产业企业人员',
            'independent': '独立研究者',
            'investor': '投资方代表',
            'student': '在校学生',
            'other': '其他'
        };
        return typeMap[userType] || userType;
    }

    loadInitialData() {
        console.log("Loading initial application data...");
    }

    loadProjects() {
        this.projects = [
            {
                id: 1,
                title: '基于深度学习的医疗诊断系统产业化',
                author: '张教授',
                organization: '清华大学',
                status: 'recruiting',
                likes: 15,
                dislikes: 3,
                comments: 12,
                followers: 8,
                tags: ['人工智能', '医疗健康', '产业化'],
                description: '我们开发了一套基于深度学习的医疗影像诊断系统...',
                requirements: '产业合作、资金支持'
            },
            {
                id: 2,
                title: '新型锂电池材料的大规模制备技术',
                author: '李研究员',
                organization: '中科院',
                status: 'ongoing',
                likes: 22,
                dislikes: 7,
                comments: 34,
                followers: 15,
                 tags: ['新能源', '材料科学', '工业化'],
                 description: '我们在实验室阶段成功合成了一种新型锂电池正极材料...',
                 requirements: '制造伙伴、技术支持'
            }
        ];
        console.log("Mock projects/topics loaded:", this.projects);
    }

    handleTopicSubmit(form) {
        if (!this.currentUser || !this.currentUser.isLoggedIn) {
            this.showMessage('请先登录才能发布项目话题', 'error');
             setTimeout(() => { window.location.href = 'login.html?redirect=create_topic.html'; }, 1000);
            return;
        }

        const formData = new FormData(form);
        const topicData = {
            title: formData.get('topicTitle')?.trim(),
            description: formData.get('topicDescription')?.trim(),
            tags: formData.get('topicTags')?.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            stage: formData.get('projectStage'),
            collaborationNeeds: formData.get('collaborationNeeds')?.trim(),
            contactInfo: formData.get('contactInfo')?.trim(),
            discussionDuration: parseInt(formData.get('discussionDuration')) || 30,
            allowAnonymous: formData.get('allowAnonymous') === 'on',
            requireReview: formData.get('requireReview') === 'on',
            authorId: this.currentUser.id,
            authorUsername: this.currentUser.username,
            authorUserType: this.currentUser.userType,
            organization: this.currentUser.organization,
            createdAt: new Date().toISOString(),
            status: 'recruiting',
            likes: 0,
            dislikes: 0,
            comments: 0,
            followers: 0,
            id: utils.generateId()
        };

        // Validation
        if (!topicData.title || !topicData.description) {
            this.showMessage('主题名称和描述是必填项', 'error');
            return;
        }

        if (topicData.title.length < 5 || topicData.title.length > 100) {
            this.showMessage('标题长度应在5-100字之间', 'error');
            return;
        }

        if (topicData.description.length < 50 || topicData.description.length > 5000) {
            this.showMessage('描述长度应在50-5000字之间', 'error');
            return;
        }

        if (topicData.tags.length === 0) {
            this.showMessage('请至少添加一个标签', 'error');
            return;
        }

        this.showLoadingMessage('正在发布话题...');
         const submitButton = form.querySelector('button[type="submit"]');
         if(submitButton) {
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            const submitText = submitButton.querySelector('#submitText');
            const submitLoading = submitButton.querySelector('#submitLoading');
            if (submitText) submitText.classList.add('hidden');
            if (submitLoading) submitLoading.classList.remove('hidden');
         }

        setTimeout(() => {
            const existingTopics = JSON.parse(localStorage.getItem('mockTopics') || '[]');
            existingTopics.push(topicData);
            localStorage.setItem('mockTopics', JSON.stringify(existingTopics));

            // Clear draft after successful submission
            if (typeof clearDraft === 'function') {
                clearDraft();
            }

            this.showMessage('话题发布成功！', 'success');
             form.reset();
             setTimeout(() => {
                window.location.href = `topic_discussion.html?id=${topicData.id}`;
             }, 1500);

             if(submitButton) {
                 submitButton.disabled = false;
                 const submitText = submitButton.querySelector('#submitText');
                 const submitLoading = submitButton.querySelector('#submitLoading');
                 if (submitText) submitText.classList.remove('hidden');
                 if (submitLoading) submitLoading.classList.add('hidden');
             }

        }, 1500);
    }

    // Subscription management methods
    subscribeToTopic(topicId) {
        return this.subscriptionManager.subscribe(this.currentUser.id, topicId);
    }

    unsubscribeFromTopic(topicId) {
        return this.subscriptionManager.unsubscribe(this.currentUser.id, topicId);
    }

    isSubscribedToTopic(topicId) {
        return this.subscriptionManager.isSubscribed(this.currentUser.id, topicId);
    }

    getUserSubscriptions() {
        return this.subscriptionManager.getUserSubscriptions(this.currentUser.id);
    }

    showMessage(text, type = 'info') {
        document.querySelectorAll('.app-message').forEach(msg => msg.remove());

        const messageContainer = document.createElement('div');
        messageContainer.className = `app-message fixed bottom-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg text-white text-sm fade-in ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-gray-700'}`;
        messageContainer.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${text}</span>
                <button class="ml-4 text-white opacity-75 hover:opacity-100 close-btn">✕</button>
            </div>
        `;
        
        document.body.appendChild(messageContainer);
        
        setTimeout(() => {
            messageContainer.classList.remove('fade-in');
            messageContainer.classList.add('fade-out');
            messageContainer.addEventListener('animationend', () => messageContainer.remove());
        }, 3000);
    }

     showLoadingMessage(text) {
         document.querySelectorAll('.app-message').forEach(msg => msg.remove());

         const messageContainer = document.createElement('div');
         messageContainer.className = `app-message fixed bottom-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg text-white text-sm bg-blue-500 fade-in`;
         messageContainer.innerHTML = `
            <div class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>${text}</span>
            </div>
         `;
         document.body.appendChild(messageContainer);
     }

    closeModals() {
        console.log("Attempting to close generic modals.");
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
         document.querySelectorAll('.fixed.inset-0:not(.hidden)').forEach(el => {
             if(el.id === 'forgotPasswordModal' || el.id === 'editProfileModal' || el.id === 'termsModal' || el.id === 'privacyModal') {
                  el.classList.add('hidden');
             }
         });
    }

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('rememberLogin');
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        
        this.showMessage('已安全退出', 'success');
        
        if (window.navigation) {
            window.navigation.updateUserStatus();
        }

        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 1000);
    }

    createProject() {
        if (!this.currentUser || !this.currentUser.isLoggedIn) {
            this.showMessage('请先登录才能发布项目话题', 'error');
            setTimeout(() => {
                window.location.href = 'login.html?redirect=create_topic.html';
            }, 1000);
            return;
        }
        
        window.location.href = 'create_topic.html';
    }
}

// Subscription Manager Class
class SubscriptionManager {
    constructor() {
        this.storagePrefix = 'userSubscriptions_';
    }

    subscribe(userId, topicId) {
        if (!userId || !topicId) return false;

        const subscriptions = this.getUserSubscriptions(userId);
        const existingSubscription = subscriptions.find(sub => sub.topicId == topicId);

        if (existingSubscription) {
            return false; // Already subscribed
        }

        subscriptions.push({
            topicId: topicId,
            subscribedAt: new Date().toISOString()
        });

        this.saveUserSubscriptions(userId, subscriptions);
        return true;
    }

    unsubscribe(userId, topicId) {
        if (!userId || !topicId) return false;

        let subscriptions = this.getUserSubscriptions(userId);
        const initialLength = subscriptions.length;

        subscriptions = subscriptions.filter(sub => sub.topicId != topicId);

        if (subscriptions.length === initialLength) {
            return false; // Was not subscribed
        }

        this.saveUserSubscriptions(userId, subscriptions);
        return true;
    }

    isSubscribed(userId, topicId) {
        if (!userId || !topicId) return false;

        const subscriptions = this.getUserSubscriptions(userId);
        return subscriptions.some(sub => sub.topicId == topicId);
    }

    getUserSubscriptions(userId) {
        if (!userId) return [];

        const key = this.storagePrefix + userId;
        const data = localStorage.getItem(key);

        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error('Failed to parse subscription data:', e);
                return [];
            }
        }

        return [];
    }

    saveUserSubscriptions(userId, subscriptions) {
        if (!userId) return;

        const key = this.storagePrefix + userId;
        localStorage.setItem(key, JSON.stringify(subscriptions));
    }

    getSubscriptionCount(userId) {
        return this.getUserSubscriptions(userId).length;
    }

    getTopicSubscribers(topicId) {
        // This would normally be done on the server side
        // For demo purposes, we'll search through all users
        const subscribers = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.storagePrefix)) {
                try {
                    const userId = key.replace(this.storagePrefix, '');
                    const subscriptions = JSON.parse(localStorage.getItem(key));
                    
                    if (subscriptions.some(sub => sub.topicId == topicId)) {
                        subscribers.push(userId);
                    }
                } catch (e) {
                    // Skip invalid data
                }
            }
        }
        
        return subscribers;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.otherwiseApp = new OtherwiseApp();
});

window.logout = function() {
    if (window.otherwiseApp) {
        window.otherwiseApp.logout();
    } else {
        console.error("otherwiseApp not initialized, cannot logout.");
         localStorage.removeItem('isLoggedIn');
         localStorage.removeItem('username');
         localStorage.removeItem('rememberLogin');
         localStorage.removeItem('currentUser');
         window.location.href = 'index.html';
    }
};

window.createProject = function() {
    if (window.otherwiseApp) {
        window.otherwiseApp.createProject();
    } else {
        console.error("otherwiseApp not initialized, cannot create project.");
          alert('应用未加载，请刷新页面。');
    }
};

window.postComment = function() {
    if (window.otherwiseApp) {
        window.otherwiseApp.postComment();
    } else {
        console.error("otherwiseApp not initialized, cannot post comment.");
         alert('应用未加载，无法发表观点。');
    }
};

const utils = {
    formatTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        const minute = 60 * 1000;
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;
        const year = day * 365;
        
        if (diff < minute) {
            return '刚刚';
        } else if (diff < hour) {
            return Math.floor(diff / minute) + '分钟前';
        } else if (diff < day) {
            return Math.floor(diff / hour) + '小时前';
        } else if (diff < week) {
            return Math.floor(diff / day) + '天前';
        } else if (diff < year) {
             return Math.floor(diff / week) + '周前';
        }
         else {
            return time.toLocaleDateString();
        }
    },

    truncateText(text, maxLength = 150) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
     
     getUrlParams() {
         const params = new URLSearchParams(window.location.search);
         const result = {};
         for (const [key, value] of params) {
             result[key] = value;
         }
         return result;
     }
};

window.utils = utils;

