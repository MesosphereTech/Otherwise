// 导航相关功能
class Navigation {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        this.clearInvalidUserData();
        this.updateActiveNavigation();
        this.setupUserMenu();
        this.updateUserStatus();
        this.setupBreadcrumb();
        this.setupSearch();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    updateActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const linkPage = href.replace('.html', '');
                if (linkPage === this.currentPage ||
                   (this.currentPage === 'index' && href === 'index.html')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    setupUserMenu() {
        const userMenuButton = document.getElementById('user-menu-button');
        const userMenu = document.getElementById('user-menu');
        
        if (userMenuButton && userMenu) {
            // 移除之前的事件监听器（如果存在）
            userMenuButton.removeEventListener('click', this.userMenuClickHandler);
            
            // 创建新的事件处理器
            this.userMenuClickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isHidden = userMenu.style.display === 'none' || userMenu.style.display === '';
                if (isHidden) {
                    userMenu.style.display = 'block';
                } else {
                    userMenu.style.display = 'none';
                }
            };
            
            // 添加点击事件监听器
            userMenuButton.addEventListener('click', this.userMenuClickHandler);

            // 点击外部关闭菜单
            if (!this.documentClickHandler) {
                this.documentClickHandler = (e) => {
                    if (userMenuButton && userMenu && 
                        !userMenuButton.contains(e.target) && 
                        !userMenu.contains(e.target)) {
                        userMenu.style.display = 'none';
                    }
                };
                document.addEventListener('click', this.documentClickHandler);
            }
        }
    }

    updateUserStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        let username = localStorage.getItem('username');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        // 修复错误的用户名显示
        if (username === 'GGod' || username === 'ggod' || !username || username.length < 2) {
            // 尝试从currentUser中获取正确的用户名
            if (currentUser.username && currentUser.username !== 'GGod' && currentUser.username !== 'ggod') {
                username = currentUser.username;
            } else {
                username = '张研究员';  // 设置默认用户名
            }
            localStorage.setItem('username', username);
        }

        const navButtons = document.getElementById('navButtons');

        if (!navButtons) {
            console.warn("Navigation buttons container #navButtons not found.");
            return;
        }

        // 清空之前的内容，防止重复
        navButtons.innerHTML = '';

        if (isLoggedIn && username) {
            const displayUsername = currentUser.username || username;
            const avatarLetter = displayUsername ? displayUsername[0].toUpperCase() : '?';
            const profileLink = 'profile.html';
            
            // 获取保存的头像
            const savedAvatar = localStorage.getItem('userAvatar');

            // 创建用户菜单容器
            const userMenuContainer = document.createElement('div');
            userMenuContainer.className = 'user-menu-container';
            
            userMenuContainer.innerHTML = `
                <button id="user-menu-button" class="user-menu-button">
                    <span style="width: 32px; height: 32px; background-color: var(--color-background-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
                         ${savedAvatar || currentUser.profile?.avatar ?
                            `<img src="${savedAvatar || currentUser.profile.avatar}" alt="User Avatar" style="width: 32px; height: 32px; object-fit: cover; border-radius: 50%;">`
                            :
                            `<span style="color: var(--color-text-secondary); font-size: 0.75rem; font-weight: 600;">${avatarLetter}</span>`
                         }
                    </span>
                    <span style="font-size: 0.875rem; color: var(--color-text-primary); white-space: nowrap;">${displayUsername}</span>
                    <svg style="width: 16px; height: 16px; color: var(--color-text-secondary); flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <div id="user-menu" class="user-menu-dropdown" style="display: none;">
                    <a href="${profileLink}" class="user-menu-item">个人中心</a>
                    <a href="projects.html" class="user-menu-item">项目话题</a>
                    <a href="create_topic.html" class="user-menu-item">发布话题</a>
                    <div class="user-menu-divider"></div>
                    <button onclick="window.otherwiseApp?.logout()" class="user-menu-item" id="logoutButton">退出登录</button>
                </div>
            `;
            
            navButtons.appendChild(userMenuContainer);
            this.setupUserMenu();

        } else {
            const loginContainer = document.createElement('div');
            loginContainer.className = 'flex items-center';
            loginContainer.style.gap = '1rem';
            
            loginContainer.innerHTML = `
                <a href="login.html" class="nav-link">登录</a>
                <a href="register.html" class="btn btn-primary">注册</a>
            `;
            
            navButtons.appendChild(loginContainer);
        }

        this.updateActiveNavigation();
    }

    // 清除错误的用户数据
    clearInvalidUserData() {
        const username = localStorage.getItem('username');
        if (username === 'GGod' || username === 'ggod') {
            localStorage.removeItem('username');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            console.log('Cleared invalid user data');
            this.updateUserStatus();
        }
    }

    setupBreadcrumb() {
        const breadcrumbContainer = document.getElementById('breadcrumb');
        if (!breadcrumbContainer) {
            return;
        }

        const breadcrumbMap = {
            'index': [{ text: '首页', url: 'index.html' }],
            'projects': [
                { text: '首页', url: 'index.html' },
                { text: '项目话题', url: 'projects.html' }
            ],
            'topic_discussion': [
                { text: '首页', url: 'index.html' },
                { text: '项目话题', url: 'projects.html' },
                { text: '话题详情', url: '#' }
            ],
            'create_topic': [
                 { text: '首页', url: 'index.html' },
                 { text: '项目话题', url: 'projects.html' },
                 { text: '发布话题', url: 'create_topic.html' }
            ],
            'profile': [
                { text: '首页', url: 'index.html' },
                { text: '个人中心', url: 'profile.html' }
            ],
            'login': [
                { text: '首页', url: 'index.html' },
                { text: '登录', url: 'login.html' }
            ],
            'register': [
                { text: '首页', url: 'index.html' },
                { text: '注册', url: 'register.html' }
            ]
        };

        const breadcrumbs = breadcrumbMap[this.currentPage] || [];
        if (breadcrumbs.length > 0) {
            const breadcrumbHTML = breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                if (isLast) {
                    return `<span class="text-gray-500">${item.text}</span>`;
                } else {
                    return `<a href="${item.url}" class="text-gray-600 hover:text-gray-900">${item.text}</a>`;
                }
            }).join(' <span class="text-gray-400 mx-2">/</span> ');

            breadcrumbContainer.innerHTML = breadcrumbHTML;
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const searchContainer = searchInput?.closest('.search-container');
        const suggestionContainer = document.getElementById('search-suggestions');

        if (!searchInput || !searchButton || !suggestionContainer || !searchContainer) {
            return;
        }

         searchContainer.style.position = 'relative';
         suggestionContainer.style.position = 'absolute';
         suggestionContainer.style.top = '100%';
         suggestionContainer.style.left = '0';
         suggestionContainer.style.right = '0';
         suggestionContainer.style.zIndex = '50';
         suggestionContainer.classList.add('bg-white', 'border', 'border-gray-200', 'rounded-md', 'shadow-lg', 'mt-1', 'hidden');

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(searchInput.value);
                this.hideSearchSuggestions();
            }
        });

        searchButton.addEventListener('click', () => {
            this.performSearch(searchInput.value);
            this.hideSearchSuggestions();
        });

         if (window.utils && window.utils.debounce) {
             searchInput.addEventListener('input', window.utils.debounce((e) => {
                this.showSearchSuggestions(e.target.value);
            }, 300));
         } else {
             console.warn("Debounce utility not available. Search suggestions may not be debounced.");
             searchInput.addEventListener('input', (e) => {
                 this.showSearchSuggestions(e.target.value);
             });
         }

         document.addEventListener('click', (e) => {
             if (!searchContainer.contains(e.target)) {
                 this.hideSearchSuggestions();
             }
         });
          
          searchInput.addEventListener('blur', () => {
               setTimeout(() => {
                  if (!suggestionContainer.contains(document.activeElement)) {
                     this.hideSearchSuggestions();
                  }
               }, 100);
          });
           
           searchInput.addEventListener('focus', () => {
                if (searchInput.value.trim()) {
                     this.showSearchSuggestions(searchInput.value);
                }
           });
    }

    performSearch(query) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;
        
        console.log('Searching for:', trimmedQuery);
        
        // Check if already on projects page
        if (this.currentPage === 'projects') {
            // Trigger search on current page
            if (typeof performSearch === 'function') {
                performSearch(trimmedQuery);
            } else {
                console.warn('performSearch function not available on projects page');
            }
        } else {
            // Navigate to projects page with search
            window.location.href = `projects.html?search=${encodeURIComponent(trimmedQuery)}`;
        }
    }

    showSearchSuggestions(query) {
        const suggestionContainer = document.getElementById('search-suggestions');
        if (!suggestionContainer) return;

        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            this.hideSearchSuggestions();
            return;
        }

        // Get suggestions from multiple sources
        const suggestions = this.generateSearchSuggestions(trimmedQuery);

        if (suggestions.length > 0) {
            const suggestionsHTML = suggestions.map(suggestion =>
                `<div class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 border-b border-gray-100 last:border-b-0"
                      onmousedown="event.preventDefault(); navigation.performSearch('${suggestion.replace(/'/g, "\\'").replace(/"/g, '\\"')}')"
                      onclick="this.onmousedown()">
                      <div class="flex items-center">
                          <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                          </svg>
                          ${suggestion}
                      </div>
                 </div>`
            ).join('');

            suggestionContainer.innerHTML = suggestionsHTML;
            suggestionContainer.classList.remove('hidden');
        } else {
            this.hideSearchSuggestions();
        }
    }

    generateSearchSuggestions(query) {
        const suggestions = new Set();
        const lowerQuery = query.toLowerCase();

        // Get suggestions from topic data
        const allTopics = JSON.parse(localStorage.getItem('mockTopics') || '[]');
        
        // Add matching titles
        allTopics.forEach(topic => {
            if (topic.title && topic.title.toLowerCase().includes(lowerQuery)) {
                suggestions.add(topic.title);
            }
        });

        // Add matching tags
        allTopics.forEach(topic => {
            if (topic.tags) {
                topic.tags.forEach(tag => {
                    if (tag.toLowerCase().includes(lowerQuery)) {
                        suggestions.add(tag);
                    }
                });
            }
        });

        // Add matching organizations
        allTopics.forEach(topic => {
            if (topic.organization && topic.organization.toLowerCase().includes(lowerQuery)) {
                suggestions.add(topic.organization);
            }
        });

        // Add common search terms
        const commonTerms = [
            '人工智能', '机器学习', '深度学习', '区块链', '物联网',
            '新能源', '新材料', '生物技术', '医疗健康', '智能制造',
            '产业化', '技术转化', '投资', '合作', '创业'
        ];

        commonTerms.forEach(term => {
            if (term.includes(lowerQuery) || lowerQuery.includes(term)) {
                suggestions.add(term);
            }
        });

        return Array.from(suggestions).slice(0, 6); // Limit to 6 suggestions
    }

    hideSearchSuggestions() {
        const suggestionContainer = document.getElementById('search-suggestions');
        if (suggestionContainer) {
            suggestionContainer.classList.add('hidden');
            suggestionContainer.innerHTML = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 确保只初始化一次Navigation
    if (!window.navigation) {
        window.navigation = new Navigation();
        console.log('Navigation initialized');
    } else {
        console.log('Navigation already exists, refreshing user status');
        window.navigation.updateUserStatus();
    }
});

