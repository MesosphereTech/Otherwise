// 项目管理相关逻辑
class ProjectManager {
    constructor() {
        this.projects = [];
        this.currentFilters = {
            industry: [],
            stage: '',
            cooperation: [],
            timeRange: ''
        };
        this.currentSearchQuery = '';
        this.currentSortType = 'latest';
        this.currentPage = 1;
        this.projectsPerPage = 10;
    }

    init() {
        this.initializeMockData();
        this.loadProjects();
        this.setupEventListeners();
    }

    initializeMockData() {
        const existingProjects = JSON.parse(localStorage.getItem('mockProjects') || '[]');
        if (existingProjects.length === 0) {
            const mockProjects = [
                {
                    id: 'proj_' + Date.now() + '_1',
                    title: '基于深度学习的医疗影像智能诊断系统',
                    description: '我们开发了一套基于深度学习的医疗影像诊断系统，结合了最新的CNN和Transformer技术，能够对CT、MRI等医疗影像进行精确分析。系统在多个医院的临床试验中表现优异，诊断准确率达到95%以上，大幅提升了医生的诊断效率。\n\n目前技术已经成熟，正在寻找产业化合作伙伴，希望能够推进系统的大规模商业应用，造福更多患者。',
                    industry: '医疗健康',
                    technicalFields: ['深度学习', '医疗影像', 'CNN', 'Transformer', '人工智能'],
                    stage: 'ready',
                    expectedResults: '完成产品化开发，获得医疗器械认证，建立销售渠道，实现规模化应用',
                    cooperationType: ['资金', '产业化', '渠道'],
                    contactInfo: '邮箱: medical.ai@university.edu\n微信: medicalAI2024',
                    duration: 90,
                    allowPublicView: true,
                    requireApproval: true,
                    publisher: '张教授',
                    publisherType: '高等院校研究者',
                    publisherOrganization: '清华大学医学院',
                    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    deadline: new Date(Date.now() + 88 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'recruiting',
                    views: 245,
                    interestedCount: 12,
                    followCount: 8
                },
                {
                    id: 'proj_' + Date.now() + '_2',
                    title: '新型锂电池正极材料产业化技术',
                    description: '在实验室阶段成功合成了一种新型锂电池正极材料，相比传统LiCoO2材料，能量密度提高30%，循环寿命超过5000次，同时显著降低了成本。\n\n该材料已通过小批量测试，各项性能指标优异，现急需寻找具有电池制造经验的合作伙伴进行中试和产业化，共同推进这项颠覆性技术的商业化应用。',
                    industry: '新能源',
                    technicalFields: ['锂电池', '材料科学', '电化学', '工业化生产'],
                    stage: 'testing',
                    expectedResults: '完成中试放大，建立生产线，通过车规级认证，实现大规模生产',
                    cooperationType: ['技术', '资金', '产业化'],
                    contactInfo: '联系人: 李研究员\n机构: 中科院材料所\n手机: 138****5678',
                    duration: 120,
                    allowPublicView: true,
                    requireApproval: false,
                    publisher: '李研究员',
                    publisherType: '科研院所研究员',
                    publisherOrganization: '中科院材料研究所',
                    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    deadline: new Date(Date.now() + 115 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'recruiting',
                    views: 189,
                    interestedCount: 18,
                    followCount: 15
                },
                {
                    id: 'proj_' + Date.now() + '_3',
                    title: '智能农业物联网平台建设与应用',
                    description: '基于物联网、大数据和AI技术构建的智能农业监测平台，可实现对土壤湿度、温度、光照、作物生长状态等多维度数据的实时采集和智能分析，为精准农业提供科学决策支持。\n\n平台已在多个农业基地试点运行，效果显著，能够提高作物产量15-20%，节约用水30%。现寻求农业产业化合作伙伴和投资方，共同推广这一技术。',
                    industry: '农业科技',
                    technicalFields: ['物联网', '大数据', '人工智能', '精准农业', '传感器技术'],
                    stage: 'prototype',
                    expectedResults: '建立标准化产品，拓展应用场景，形成可复制的商业模式',
                    cooperationType: ['资金', '渠道', '产业化'],
                    contactInfo: '',
                    duration: 60,
                    allowPublicView: true,
                    requireApproval: true,
                    publisher: '王博士',
                    publisherType: '产业企业人员',
                    publisherOrganization: '绿色农业科技公司',
                    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    deadline: new Date(Date.now() + 57 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'recruiting',
                    views: 156,
                    interestedCount: 9,
                    followCount: 6
                },
                {
                    id: 'proj_' + Date.now() + '_4',
                    title: '区块链供应链金融平台',
                    description: '利用区块链技术构建去中心化的供应链金融平台，解决中小企业融资难、融资贵的问题。平台通过智能合约自动化处理应收账款质押、风险评估等流程，大幅提升融资效率。',
                    industry: '信息技术',
                    technicalFields: ['区块链', '智能合约', '金融科技', 'DeFi'],
                    stage: 'concept',
                    expectedResults: '完成平台开发，获得金融监管许可，建立合作银行网络',
                    cooperationType: ['技术', '资金', '人才'],
                    contactInfo: '暂不公开，请先表达合作兴趣',
                    duration: 180,
                    allowPublicView: true,
                    requireApproval: false,
                    publisher: '赵创始人',
                    publisherType: '独立研究者',
                    publisherOrganization: '区块链创新实验室',
                    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    deadline: new Date(Date.now() + 173 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'recruiting',
                    views: 98,
                    interestedCount: 5,
                    followCount: 3
                },
                {
                    id: 'proj_' + Date.now() + '_5',
                    title: '纳米材料在环保领域的应用研究',
                    description: '研发基于纳米技术的水处理材料，能够高效去除重金属离子和有机污染物，处理效果优于传统方法，且可重复使用，成本低廉。技术已申请多项专利，正在产业化阶段。',
                    industry: '环保技术',
                    technicalFields: ['纳米技术', '水处理', '环保材料'],
                    stage: 'scaling',
                    expectedResults: '建设生产基地，扩大市场份额，成为行业标准',
                    cooperationType: ['资金', '产业化'],
                    contactInfo: '联系邮箱: nano.env@research.org',
                    duration: 30,
                    allowPublicView: true,
                    requireApproval: true,
                    publisher: '钱教授',
                    publisherType: '高等院校研究者',
                    publisherOrganization: '北京理工大学',
                    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'ongoing',
                    views: 134,
                    interestedCount: 7,
                    followCount: 4
                }
            ];

            localStorage.setItem('mockProjects', JSON.stringify(mockProjects));
            console.log('Initialized mock projects data');
        }
    }

    loadProjects() {
        try {
            this.projects = JSON.parse(localStorage.getItem('mockProjects') || '[]');
            console.log('Loaded projects:', this.projects.length);
        } catch (e) {
            console.error('Failed to load projects:', e);
            this.projects = [];
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        
        if (searchInput && searchButton) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(searchInput.value);
                }
            });
            
            searchButton.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });

            // Real-time search suggestions
            if (window.utils?.debounce) {
                searchInput.addEventListener('input', window.utils.debounce((e) => {
                    this.showSearchSuggestions(e.target.value);
                }, 300));
            }
        }

        // Filter functionality
        this.setupFilterListeners();
        
        // Sort functionality
        this.setupSortListeners();
    }

    setupFilterListeners() {
        // Industry checkboxes
        document.querySelectorAll('input[data-filter="industry"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilters();
            });
        });

        // Cooperation type checkboxes
        document.querySelectorAll('input[data-filter="cooperation"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilters();
            });
        });

        // Stage filter
        const stageFilter = document.getElementById('stageFilter');
        if (stageFilter) {
            stageFilter.addEventListener('change', () => {
                this.updateFilters();
            });
        }

        // Time filter
        const timeFilter = document.getElementById('timeFilter');
        if (timeFilter) {
            timeFilter.addEventListener('change', () => {
                this.updateFilters();
            });
        }
    }

    setupSortListeners() {
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button styles
                document.querySelectorAll('.sort-btn').forEach(b => {
                    b.classList.remove('text-black', 'font-medium', 'border-b-2', 'border-black');
                    b.classList.add('text-gray-500');
                });
                btn.classList.add('text-black', 'font-medium', 'border-b-2', 'border-black');
                btn.classList.remove('text-gray-500');

                this.currentSortType = btn.dataset.sort;
                this.applyFiltersAndRender();
            });
        });
    }

    updateFilters() {
        // Collect industry filters
        this.currentFilters.industry = [];
        document.querySelectorAll('input[data-filter="industry"]:checked').forEach(cb => {
            this.currentFilters.industry.push(cb.value);
        });

        // Collect cooperation filters
        this.currentFilters.cooperation = [];
        document.querySelectorAll('input[data-filter="cooperation"]:checked').forEach(cb => {
            this.currentFilters.cooperation.push(cb.value);
        });

        // Get stage filter
        const stageFilter = document.getElementById('stageFilter');
        this.currentFilters.stage = stageFilter ? stageFilter.value : '';

        // Get time filter
        const timeFilter = document.getElementById('timeFilter');
        this.currentFilters.timeRange = timeFilter ? timeFilter.value : '';

        this.applyFiltersAndRender();
    }

    performSearch(query) {
        this.currentSearchQuery = query.trim();
        console.log('Performing search for:', this.currentSearchQuery);
        
        if (this.currentSearchQuery) {
            this.showSearchResultsInfo(this.currentSearchQuery);
        } else {
            this.hideSearchResultsInfo();
        }

        this.applyFiltersAndRender();
    }

    showSearchSuggestions(query) {
        const suggestionContainer = document.getElementById('search-suggestions');
        if (!suggestionContainer) return;

        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            this.hideSearchSuggestions();
            return;
        }

        const suggestions = this.generateSearchSuggestions(trimmedQuery);
        
        if (suggestions.length > 0) {
            const suggestionsHTML = suggestions.map(suggestion =>
                `<div class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 border-b border-gray-100 last:border-b-0"
                      onclick="window.projectManager.performSearch('${suggestion.replace(/'/g, "\\'").replace(/"/g, '\\"')}')"
                      onmousedown="event.preventDefault();">
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

        // Add suggestions based on project data
        this.projects.forEach(project => {
            if (project.title && project.title.toLowerCase().includes(lowerQuery)) {
                suggestions.add(project.title);
            }
            if (project.technicalFields) {
                project.technicalFields.forEach(field => {
                    if (field.toLowerCase().includes(lowerQuery)) {
                        suggestions.add(field);
                    }
                });
            }
            if (project.publisher && project.publisher.toLowerCase().includes(lowerQuery)) {
                suggestions.add(project.publisher);
            }
            if (project.industry && project.industry.toLowerCase().includes(lowerQuery)) {
                suggestions.add(project.industry);
            }
        });

        // Add common search terms
        const commonTerms = [
            '人工智能', '机器学习', '深度学习', '区块链', '物联网',
            '新能源', '新材料', '生物技术', '医疗健康', '智能制造',
            '产业化', '技术转化', '投资', '合作', '创业'
        ];

        commonTerms.forEach(term => {
            if (term.toLowerCase().includes(lowerQuery)) {
                suggestions.add(term);
            }
        });

        return Array.from(suggestions).slice(0, 6);
    }

    hideSearchSuggestions() {
        const suggestionContainer = document.getElementById('search-suggestions');
        if (suggestionContainer) {
            suggestionContainer.classList.add('hidden');
            suggestionContainer.innerHTML = '';
        }
    }

    applyFiltersAndRender() {
        let filteredProjects = [...this.projects];

        // Apply search filter
        if (this.currentSearchQuery) {
            const searchTerm = this.currentSearchQuery.toLowerCase();
            filteredProjects = filteredProjects.filter(project =>
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                project.technicalFields.some(field => field.toLowerCase().includes(searchTerm)) ||
                project.publisher.toLowerCase().includes(searchTerm) ||
                project.industry.toLowerCase().includes(searchTerm) ||
                (project.publisherOrganization && project.publisherOrganization.toLowerCase().includes(searchTerm))
            );
        }

        // Apply industry filter
        if (this.currentFilters.industry.length > 0) {
            filteredProjects = filteredProjects.filter(project =>
                this.currentFilters.industry.includes(project.industry)
            );
        }

        // Apply stage filter
        if (this.currentFilters.stage) {
            filteredProjects = filteredProjects.filter(project =>
                project.stage === this.currentFilters.stage
            );
        }

        // Apply cooperation filter
        if (this.currentFilters.cooperation.length > 0) {
            filteredProjects = filteredProjects.filter(project =>
                project.cooperationType.some(type => this.currentFilters.cooperation.includes(type))
            );
        }

        // Apply time range filter
        if (this.currentFilters.timeRange) {
            const days = parseInt(this.currentFilters.timeRange);
            const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            filteredProjects = filteredProjects.filter(project =>
                new Date(project.publishedAt) >= cutoffDate
            );
        }

        // Apply sorting
        this.sortProjects(filteredProjects);

        // Reset to first page
        this.currentPage = 1;

        // Render results
        this.renderProjects(filteredProjects);
    }

    sortProjects(projects) {
        switch(this.currentSortType) {
            case 'latest':
                projects.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
                break;
            case 'popular':
                projects.sort((a, b) => (b.views + b.interestedCount) - (a.views + a.interestedCount));
                break;
            case 'urgent':
                projects.sort((a, b) => {
                    const deadlineA = new Date(a.deadline);
                    const deadlineB = new Date(b.deadline);
                    const now = new Date();
                    
                    // Active projects (before deadline) come first, sorted by deadline
                    const activeA = deadlineA > now;
                    const activeB = deadlineB > now;
                    
                    if (activeA && activeB) {
                        return deadlineA - deadlineB;
                    } else if (activeA && !activeB) {
                        return -1;
                    } else if (!activeA && activeB) {
                        return 1;
                    } else {
                        return deadlineB - deadlineA;
                    }
                });
                break;
            case 'collaboration':
                projects.sort((a, b) => b.interestedCount - a.interestedCount);
                break;
            default:
                // Default to latest
                projects.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        }
    }

    renderProjects(projects) {
        const container = document.getElementById('projectListContainer');
        const projectCountElement = document.getElementById('projectCount');
        const loadingIndicator = document.getElementById('loadingProjects');
        const noProjectsFound = document.getElementById('noProjectsFound');

        if (!container || !projectCountElement || !loadingIndicator || !noProjectsFound) {
            console.error('Project list container elements not found');
            return;
        }

        // Hide loading/not found messages initially
        loadingIndicator.classList.add('hidden');
        noProjectsFound.classList.add('hidden');

        projectCountElement.textContent = projects.length;

        if (projects.length === 0) {
            container.innerHTML = '';
            noProjectsFound.classList.remove('hidden');
            this.renderPagination(0);
            return;
        }

        // Implement pagination
        const startIndex = (this.currentPage - 1) * this.projectsPerPage;
        const endIndex = startIndex + this.projectsPerPage;
        const paginatedProjects = projects.slice(startIndex, endIndex);

        // Generate HTML for each project card
        container.innerHTML = paginatedProjects.map(project => {
            const publishTime = window.utils?.formatTime(new Date(project.publishedAt)) || '未知时间';
            const deadline = window.utils?.formatTime(new Date(project.deadline)) || '长期有效';
            const truncatedDesc = window.utils?.truncateText(project.description, 200) || '暂无描述';
            
            const statusClass = project.status === 'recruiting' ? 'bg-green-100 text-green-800' : 
                               project.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800';
            const statusText = project.status === 'recruiting' ? '招募中' : 
                              project.status === 'ongoing' ? '进行中' : '已结束';
            
            const stageText = this.getStageText(project.stage);
            
            return `
                <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer fade-in">
                    <div onclick="window.location.href='project_detail.html?id=${project.id}'" class="cursor-pointer">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex-1">
                                <h3 class="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">${project.title}</h3>
                                <p class="text-gray-600 mb-3 leading-relaxed">${truncatedDesc}</p>
                                <div class="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                    <span class="flex items-center">
                                        <span class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                                            <span class="text-gray-600 text-xs font-semibold">${project.publisher[0]}</span>
                                        </span>
                                        ${project.publisher} • ${project.publisherOrganization}
                                    </span>
                                    <span>•</span>
                                    <span>${publishTime}</span>
                                    <span>•</span>
                                    <span>${project.industry}</span>
                                </div>
                            </div>
                            <div class="flex flex-col items-end ml-6 flex-shrink-0">
                                <span class="px-3 py-1 rounded-full text-xs font-medium mb-2 ${statusClass}">${statusText}</span>
                                <div class="text-xs text-gray-500">截止: ${deadline}</div>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">${stageText}</span>
                            ${project.technicalFields.slice(0, 3).map(field => 
                                `<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">#${field}</span>`
                            ).join('')}
                            ${project.technicalFields.length > 3 ? `<span class="text-xs text-gray-500">+${project.technicalFields.length - 3}</span>` : ''}
                        </div>
                    </div>

                    <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div class="flex space-x-6 text-sm text-gray-500">
                            <span class="flex items-center">
                                <span class="text-blue-600 mr-1">👁️</span> ${project.views || 0}
                            </span>
                            <span class="flex items-center">
                                <span class="text-green-600 mr-1">🤝</span> ${project.interestedCount || 0}
                            </span>
                            <span class="flex items-center">
                                <span class="text-purple-600 mr-1">❤️</span> ${project.followCount || 0}
                            </span>
                        </div>
                        <div class="text-sm text-gray-500 flex items-center space-x-4">
                            <span>合作类型: ${project.cooperationType.slice(0, 2).join('、')}${project.cooperationType.length > 2 ? '等' : ''}</span>
                            <button class="apply-interest-button px-3 py-1 bg-black text-white rounded-md text-xs hover:bg-gray-800 transition-colors focus:outline-none"
                                    data-project-id="${project.id}" onclick="event.stopPropagation(); applyForProject('${project.id}')">
                                申请合作
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.renderPagination(projects.length);
    }

    getStageText(stage) {
        const stageMap = {
            'concept': '概念验证',
            'research': '实验研发',
            'prototype': '原型开发',
            'testing': '测试验证',
            'ready': '准备产业化',
            'scaling': '规模化生产'
        };
        return stageMap[stage] || stage;
    }

    renderPagination(totalItems) {
        const paginationContainer = document.getElementById('paginationContainer');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(totalItems / this.projectsPerPage);
        let paginationHTML = '';

        if (totalPages > 1) {
            paginationHTML += `<div class="flex space-x-2">`;

            // Previous Button
            paginationHTML += `<button class="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
                              ${this.currentPage === 1 ? 'disabled' : ''} onclick="window.projectManager.changePage(${this.currentPage - 1})">上一页</button>`;

            // Page numbers
            const maxPagesToShow = 7;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            if (startPage > 1) {
                paginationHTML += `<button class="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" onclick="window.projectManager.changePage(1)">1</button>`;
                if (startPage > 2) {
                    paginationHTML += `<span class="px-3 py-2 text-gray-500">...</span>`;
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                paginationHTML += `<button class="px-3 py-2 border border-gray-300 rounded-md ${i === this.currentPage ? 'bg-black text-white border-black' : 'text-gray-700 hover:bg-gray-50'}" 
                                  onclick="window.projectManager.changePage(${i})">${i}</button>`;
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    paginationHTML += `<span class="px-3 py-2 text-gray-500">...</span>`;
                }
                paginationHTML += `<button class="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" onclick="window.projectManager.changePage(${totalPages})">${totalPages}</button>`;
            }

            // Next Button
            paginationHTML += `<button class="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
                              ${this.currentPage === totalPages ? 'disabled' : ''} onclick="window.projectManager.changePage(${this.currentPage + 1})">下一页</button>`;

            paginationHTML += `</div>`;
        }

        paginationContainer.innerHTML = paginationHTML;
    }

    changePage(newPage) {
        const totalItems = this.projects.length; // This should be the filtered count, but for simplicity using all projects
        const totalPages = Math.ceil(totalItems / this.projectsPerPage);

        if (newPage >= 1 && newPage <= totalPages && newPage !== this.currentPage) {
            this.currentPage = newPage;
            this.applyFiltersAndRender();
            
            // Scroll to top of the list
            const container = document.getElementById('projectListContainer');
            if (container) {
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    showSearchResultsInfo(query) {
        const infoDiv = document.getElementById('searchResultsInfo');
        const termSpan = document.getElementById('searchTerm');
        if (infoDiv && termSpan) {
            termSpan.textContent = query;
            infoDiv.classList.remove('hidden');
        }
    }

    hideSearchResultsInfo() {
        const infoDiv = document.getElementById('searchResultsInfo');
        if (infoDiv) {
            infoDiv.classList.add('hidden');
        }
    }

    // Handle project creation form
    handleProjectSubmit(form) {
        if (!window.otherwiseApp?.currentUser?.isLoggedIn) {
            window.otherwiseApp?.showMessage('请先登录才能发布项目', 'error');
            return;
        }

        const formData = new FormData(form);
        
        // Get cooperation types
        const cooperationTypes = [];
        document.querySelectorAll('input[name="cooperationType"]:checked').forEach(cb => {
            cooperationTypes.push(cb.value);
        });

        if (cooperationTypes.length === 0) {
            window.otherwiseApp?.showMessage('请至少选择一种合作类型', 'error');
            return;
        }

        const projectData = {
            id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            title: formData.get('projectTitle')?.trim(),
            description: formData.get('projectDescription')?.trim(),
            industry: formData.get('industry'),
            technicalFields: formData.get('technicalFields')?.split(',').map(field => field.trim()).filter(field => field !== '') || [],
            stage: formData.get('projectStage'),
            expectedResults: formData.get('expectedResults')?.trim() || '',
            cooperationType: cooperationTypes,
            contactInfo: formData.get('contactInfo')?.trim() || '',
            duration: parseInt(formData.get('projectDuration')) || 30,
            allowPublicView: formData.get('allowPublicView') === 'on',
            requireApproval: formData.get('requireApproval') === 'on',
            publisher: window.otherwiseApp.currentUser.username,
            publisherType: this.getUserTypeText(window.otherwiseApp.currentUser.userType),
            publisherOrganization: window.otherwiseApp.currentUser.organization || '暂无',
            publishedAt: new Date().toISOString(),
            deadline: new Date(Date.now() + projectData.duration * 24 * 60 * 60 * 1000).toISOString(),
            status: 'recruiting',
            views: 0,
            interestedCount: 0,
            followCount: 0
        };

        // Validation
        if (!projectData.title || !projectData.description || !projectData.industry ||
            !projectData.technicalFields.length || !projectData.stage) {
            window.otherwiseApp?.showMessage('请填写所有必填项', 'error');
            return;
        }

        if (projectData.title.length < 5 || projectData.title.length > 100) {
            window.otherwiseApp?.showMessage('标题长度应在5-100字之间', 'error');
            return;
        }

        if (projectData.description.length < 50) {
            window.otherwiseApp?.showMessage('详细描述至少需要50字', 'error');
            return;
        }

        window.otherwiseApp?.showLoadingMessage('正在发布项目...');

        // Simulate API call delay
        setTimeout(() => {
            try {
                const existingProjects = JSON.parse(localStorage.getItem('mockProjects') || '[]');
                existingProjects.unshift(projectData); // Add to beginning
                localStorage.setItem('mockProjects', JSON.stringify(existingProjects));

                // Clear draft
                if (typeof clearDraft === 'function') {
                    clearDraft();
                }

                window.otherwiseApp?.showMessage('项目发布成功！', 'success');
                form.reset();

                // Redirect to project detail page
                setTimeout(() => {
                    window.location.href = `project_detail.html?id=${projectData.id}`;
                }, 1500);

            } catch (error) {
                console.error('Failed to save project:', error);
                window.otherwiseApp?.showMessage('项目发布失败，请重试', 'error');
            } finally {
                document.querySelectorAll('.app-message.bg-blue-500').forEach(msg => msg.remove());
            }
        }, 1500);
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
        return typeMap[userType] || userType || '其他';
    }
}

// Global functions for HTML onclick handlers
window.applyFilters = function() {
    if (window.projectManager) {
        window.projectManager.updateFilters();
        window.otherwiseApp?.showMessage('筛选条件已应用', 'info');
    }
};

window.clearFilters = function() {
    // Clear checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
    
    // Clear selects
    const stageFilter = document.getElementById('stageFilter');
    if (stageFilter) stageFilter.value = '';
    
    const timeFilter = document.getElementById('timeFilter');
    if (timeFilter) timeFilter.value = '';
    
    // Clear search
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    // Reset project manager state and re-render
    if (window.projectManager) {
        window.projectManager.currentSearchQuery = '';
        window.projectManager.currentFilters = {
            industry: [],
            stage: '',
            cooperation: [],
            timeRange: ''
        };
        window.projectManager.currentPage = 1;
        window.projectManager.hideSearchResultsInfo();
        window.projectManager.applyFiltersAndRender();
    }
    
    window.otherwiseApp?.showMessage('筛选条件已清空', 'success');
};

window.searchByTag = function(tag) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = tag;
    }
    if (window.projectManager) {
        window.projectManager.performSearch(tag);
    }
};

window.clearSearch = function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    if (window.projectManager) {
        window.projectManager.currentSearchQuery = '';
        window.projectManager.hideSearchResultsInfo();
        window.projectManager.applyFiltersAndRender();
    }
};

window.applyForProject = function(projectId) {
    if (!window.otherwiseApp?.currentUser?.isLoggedIn) {
        window.otherwiseApp?.showMessage('请先登录才能申请合作', 'error');
        setTimeout(() => {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
        }, 1500);
        return;
    }

    // Navigate to project detail page for full application
    window.location.href = `project_detail.html?id=${projectId}`;
};

// Initialize project manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('projects.html') || 
        window.location.pathname.includes('create_project.html')) {
        
        // Wait for main app to initialize
        if (window.otherwiseApp) {
            window.projectManager = new ProjectManager();
            window.projectManager.init();
        } else {
            setTimeout(() => {
                if (window.otherwiseApp) {
                    window.projectManager = new ProjectManager();
                    window.projectManager.init();
                }
            }, 500);
        }
    }

    // Handle project creation form submission
    const createProjectForm = document.getElementById('createProjectForm');
    if (createProjectForm) {
        createProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (window.projectManager) {
                window.projectManager.handleProjectSubmit(this);
            }
        });
    }
});
