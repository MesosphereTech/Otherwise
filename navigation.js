// 导航相关功能
class Navigation {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
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
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const linkPage = href.replace('.html', '');
                if (linkPage === this.currentPage ||
                   (this.currentPage === 'index' && href === 'index.html')) {
                    link.classList.add('text-gray-900', 'font-medium');
                    link.classList.remove('text-gray-600');
                } else {
                    link.classList.add('text-gray-600');
                    link.classList.remove('text-gray-900', 'font-medium');
                }
            }
        });
    }

    setupUserMenu() {
        const userMenuButton = document.getElementById('user-menu-button');
        const userMenu = document.getElementById('user-menu');
        
        if (userMenuButton && userMenu) {
            userMenuButton.addEventListener('click', () => {
                const isHidden = userMenu.classList.contains('hidden');
                if (isHidden) {
                    userMenu.classList.remove('hidden');
                } else {
                    userMenu.classList.add('hidden');
                }
            });

            document.addEventListener('click', (e) => {
                if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.add('hidden');
                }
            });
        }
    }

    updateUserStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const username = localStorage.getItem('username');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        const navButtons = document.getElementById('navButtons');

        if (!navButtons) {
            console.warn("Navigation buttons container #navButtons not found.");
            return;
        }

        if (isLoggedIn && username) {
            const displayUsername = currentUser.username || username;
             const avatarLetter = displayUsername ? displayUsername[0].toUpperCase() : '?';
             const profileLink = 'profile.html';

            navButtons.innerHTML = `
                <div class="relative">
                    <button id="user-menu-button" class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                        <span class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                             ${currentUser.profile?.avatar ?
                                `<img src="${currentUser.profile.avatar}" alt="User Avatar" class="w-full h-full object-cover">`
                                :
                                `<span class="text-gray-600 text-xs font-semibold">${avatarLetter}</span>`
                             }
                        </span>
                        <span class="hidden md:inline">${displayUsername}</span>
                        <svg class="w-4 h-4 hidden md:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <div id="user-menu" class="hidden absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 origin-top-right">
                        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                            <a href="${profileLink}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">个人中心</a>
                            <a href="projects.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">项目话题</a>
                             <a href="create_topic.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">发布话题</a>
                            <div class="border-t border-gray-100"></div>
                            <button onclick="window.otherwiseApp?.logout()" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" id="logoutButton">退出登录</button>
                        </div>
                    </div>
                </div>
            `;
            
            this.setupUserMenu();

        } else {
            navButtons.innerHTML = `
                 <div class="hidden md:block">
                     <a href="login.html" class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">登录</a>
                     <a href="register.html" class="bg-black text-white hover:bg-gray-800 px-4 py-2 text-sm font-medium rounded-md">注册</a>
                 </div>
            `;
        }

        this.updateActiveNavigation();
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
    window.navigation = new Navigation();
});

