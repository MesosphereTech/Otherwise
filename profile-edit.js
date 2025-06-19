// 个人资料编辑和管理逻辑
class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.userTags = [];
        this.subscribedTopics = [];
    }

    init() {
        this.loadCurrentUser();
        if (!this.currentUser || !this.currentUser.isLoggedIn) {
            console.warn("ProfileManager initialized without a logged-in user.");
             return;
        }

        this.loadUserProfile();
        this.loadSubscribedTopics();

        this.bindEvents();
        this.initTabSwitching();
        this.loadUserContent();
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.currentUser.isLoggedIn = true;
            } catch (e) {
                console.error("Failed to parse currentUser data:", e);
                this.currentUser = null;
            }
        } else {
             const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
             const username = localStorage.getItem('username');
             if(isLoggedIn && username) {
                  this.currentUser = { username: username, isLoggedIn: true };
             } else {
                this.currentUser = null;
             }
        }
    }

    loadUserProfile() {
        if (!this.currentUser || !this.currentUser.username) {
             console.warn("Cannot load profile, user not identified.");
            return;
        }
        const profileKey = `profile_${this.currentUser.username}`;
        let profile = localStorage.getItem(profileKey);
        
        if (profile) {
            profile = JSON.parse(profile);
            this.currentUser.profile = profile;
        } else {
            profile = {
                nickname: this.currentUser.username,
                userType: this.currentUser.userType || 'other',
                organization: this.currentUser.organization || '未设置',
                researchField: this.currentUser.researchField || '未设置',
                bio: '这位用户还没有填写个人简介',
                tags: ['新用户'],
                avatar: null,
                stats: {
                    followers: 0,
                    following: 0,
                    projects: 0,
                     subscribedTopics: 0
                }
            };
             this.currentUser.profile = profile;
            this.saveProfile(profile);
        }

        this.userTags = profile.tags || [];
        this.updateProfileDisplay(this.currentUser.profile);
    }

     loadSubscribedTopics() {
         if (!this.currentUser || !this.currentUser.id) {
             console.warn("Cannot load subscriptions, user ID not available.");
             return;
         }

         if (window.otherwiseApp && window.otherwiseApp.subscriptionManager) {
             this.subscribedTopics = window.otherwiseApp.getUserSubscriptions() || [];
         } else {
             const subscriptionKey = `userSubscriptions_${this.currentUser.id}`;
             const subscribedData = localStorage.getItem(subscriptionKey);

             if (subscribedData) {
                 try {
                      this.subscribedTopics = JSON.parse(subscribedData);
                 } catch (e) {
                     console.error("Failed to parse subscribed topics from localStorage:", e);
                     this.subscribedTopics = [];
                 }
             } else {
                 this.subscribedTopics = [];
             }
         }

          if (this.currentUser.profile?.stats) {
              this.currentUser.profile.stats.subscribedTopics = this.subscribedTopics.length;
               this.updateProfileStatsDisplay(this.currentUser.profile.stats);
          }

         console.log("Loaded subscribed topics:", this.subscribedTopics);
     }

    updateProfileDisplay(profile) {
        document.getElementById('displayNickname').textContent = profile.nickname;
        document.getElementById('displayUserType').textContent = this.getUserTypeText(profile.userType);
        document.getElementById('displayOrganization').textContent = profile.organization;
        document.getElementById('displayResearchField').textContent = profile.researchField;
        document.getElementById('displayBio').textContent = profile.bio || '暂无简介';

        this.updateProfileStatsDisplay(profile.stats);

        const avatarImg = document.getElementById('avatarImage');
        const avatarPlaceholder = document.getElementById('avatarPlaceholder');
        if (profile.avatar) {
            avatarImg.src = profile.avatar;
            avatarImg.style.display = 'block';
            avatarPlaceholder.style.display = 'none';
        } else {
             avatarPlaceholder.textContent = profile.nickname ? profile.nickname[0].toUpperCase() : '?';
            avatarImg.style.display = 'none';
            avatarPlaceholder.style.display = 'flex';
        }

        this.updateTagsDisplay();
    }

     updateProfileStatsDisplay(stats) {
          document.getElementById('followersCount').textContent = stats.followers;
          document.getElementById('followingCount').textContent = stats.following;
          document.getElementById('projectsCount').textContent = stats.projects;
           const subscribedCountElement = document.getElementById('subscribedTopicsCount');
           if(subscribedCountElement) {
                subscribedCountElement.textContent = stats.subscribedTopics || 0;
           }
     }

    updateTagsDisplay() {
        const tagsContainer = document.getElementById('displayTags');
        if(tagsContainer) {
            tagsContainer.innerHTML = this.userTags.map(tag => 
                `<span class="tag">#${tag}</span>`
            ).join(' ');
        }
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

    bindEvents() {
        const avatarInput = document.getElementById('avatarInput');
        if(avatarInput) {
             avatarInput.addEventListener('change', this.handleAvatarUpload.bind(this));
        } else {
             console.warn("Avatar input #avatarInput not found.");
        }

        const editProfileForm = document.getElementById('editProfileForm');
         if(editProfileForm) {
            editProfileForm.addEventListener('submit', this.handleProfileUpdate.bind(this));
         } else {
            console.warn("Edit profile form #editProfileForm not found.");
         }

        const newTagInput = document.getElementById('newTagInput');
        if(newTagInput) {
            newTagInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addTag();
                }
            });
        } else {
            console.warn("New tag input #newTagInput not found.");
        }
    }

    initTabSwitching() {
        const tabButtons = document.querySelectorAll('.profile-tab');
        const tabContents = document.querySelectorAll('.tab-content');

        if(tabButtons.length === 0 || tabContents.length === 0) {
             console.log("Profile tabs or contents not found on this page.");
            return;
        }
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                tabButtons.forEach(btn => {
                    btn.classList.remove('active', 'border-black', 'text-black');
                    btn.classList.add('border-transparent', 'text-gray-500');
                });
                
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });
                
                button.classList.add('active', 'border-black', 'text-black');
                button.classList.remove('border-transparent', 'text-gray-500');

                const targetContent = document.getElementById(tabId);
                if(targetContent) {
                     targetContent.classList.remove('hidden');
                } else {
                     console.warn(`Content area for tab '${tabId}' not found.`);
                }

                this.loadTabContent(tabId);
            });
        });
    }

    loadTabContent(tabId) {
         console.log(`Loading content for tab: ${tabId}`);
        switch (tabId) {
            case 'overview':
                this.loadOverviewContent();
                break;
            case 'projects':
                this.loadProjectsContent();
                break;
            case 'discussions':
                this.loadDiscussionsContent();
                break;
            case 'negations':
                this.loadNegationsContent();
                break;
             case 'subscriptions':
                 this.loadSubscriptionsContent();
                 break;
        }
    }

    loadUserContent() {
         const initialTabButton = document.querySelector('.profile-tab.active') || document.querySelector('.profile-tab[data-tab="overview"]');
         if (initialTabButton) {
              this.loadTabContent(initialTabButton.dataset.tab);
         } else {
             console.warn("No initial profile tab found or default 'overview'.");
         }
    }

    loadOverviewContent() {
        const activities = [
            { type: 'project', title: '参与了项目"医疗AI诊断系统"', time: utils.formatTime(Date.now() - 2 * 60 * 60 * 1000) },
            { type: 'negation', title: '对"量子计算商业化"提出了否定意见', time: utils.formatTime(Date.now() - 1 * 24 * 60 * 60 * 1000) },
            { type: 'follow', title: '关注了张教授', time: utils.formatTime(Date.now() - 3 * 24 * 60 * 60 * 1000) }
        ];

        const activityContainer = document.getElementById('recentActivity');
        if(activityContainer) {
             if (activities.length === 0) {
                 activityContainer.innerHTML = `<div class="text-sm text-gray-500">暂无最近活动</div>`;
             } else {
                 activityContainer.innerHTML = activities.map(activity => `
                     <div class="flex items-center space-x-3 py-2">
                         <div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                         <div class="flex-1">
                             <p class="text-sm text-gray-900">${activity.title}</p>
                             <p class="text-xs text-gray-500">${activity.time}</p>
                         </div>
                     </div>
                 `).join('');
             }
        }

        // Load subscription updates
        this.loadSubscriptionUpdates();
    }

    loadSubscriptionUpdates() {
        const followedTopicsContainer = document.getElementById('followedTopics');
        if (!followedTopicsContainer) return;

        // Get subscribed topics and simulate recent updates
        const allMockTopics = JSON.parse(localStorage.getItem('mockTopics') || '[]');
        const subscribedTopicIds = this.subscribedTopics.map(sub => sub.topicId);
        const subscribedTopicsData = allMockTopics.filter(topic => subscribedTopicIds.includes(topic.id));

        if (subscribedTopicsData.length === 0) {
            followedTopicsContainer.innerHTML = `<div class="text-sm text-gray-500">暂无订阅的话题，<a href="projects.html" class="text-blue-600 hover:underline">去发现感兴趣的话题</a></div>`;
            return;
        }

        // Generate mock updates for subscribed topics
        const updates = subscribedTopicsData.slice(0, 3).map(topic => ({
            title: topic.title,
            update: `收到 ${Math.floor(Math.random() * 10) + 1} 条新讨论`,
            time: utils.formatTime(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
        }));

        followedTopicsContainer.innerHTML = updates.map(topic => `
            <div class="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors cursor-pointer" onclick="window.location.href='projects.html'">
                <h5 class="text-sm font-medium text-gray-900 mb-1">${utils.truncateText(topic.title, 30)}</h5>
                <p class="text-xs text-gray-600">${topic.update}</p>
                <p class="text-xs text-gray-500 mt-1">${topic.time}</p>
            </div>
        `).join('');
    }

    loadProjectsContent() {
         const allMockTopics = JSON.parse(localStorage.getItem('mockTopics') || '[]');
         const userTopics = allMockTopics.filter(topic => topic.authorUsername === this.currentUser?.username);

        const container = document.getElementById('myProjectsList');
         if(!container) {
             console.warn("My Projects List container #myProjectsList not found.");
            return;
         }

        // Update the projects count in profile stats
        if (this.currentUser.profile?.stats) {
            this.currentUser.profile.stats.projects = userTopics.length;
            this.saveProfile(this.currentUser.profile);
            this.updateProfileStatsDisplay(this.currentUser.profile.stats);
        }

        if (userTopics.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <div class="mb-4">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <p class="text-lg font-medium text-gray-900 mb-2">还没有发布话题</p>
                    <p class="text-gray-500 mb-4">分享您的研究成果或项目，寻找合作伙伴</p>
                    <button onclick="window.createProject()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800">
                        发布第一个话题
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = userTopics.map(topic => `
                <div class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer" onclick="window.location.href='topic_discussion.html?id=${topic.id}'">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-semibold text-gray-900">${utils.truncateText(topic.title, 40)}</h4>
                        <span class="px-2 py-1 rounded text-xs ${topic.status === 'recruiting' ? 'bg-green-100 text-green-800' : topic.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}">
                            ${topic.status === 'recruiting' ? '招募中' : topic.status === 'ongoing' ? '进行中' : '已封卷'}
                         </span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3">${utils.truncateText(topic.description, 100)}</p>
                    <div class="flex flex-wrap gap-1 mb-3">
                        ${(topic.tags || []).slice(0, 3).map(tag => `<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">#${tag}</span>`).join('')}
                        ${topic.tags && topic.tags.length > 3 ? `<span class="text-xs text-gray-500">+${topic.tags.length - 3}</span>` : ''}
                    </div>
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <div class="flex space-x-4">
                            <span>👍 ${topic.likes}</span>
                            <span>👎 ${topic.dislikes}</span>
                            <span>💬 ${topic.comments}</span>
                            <span>👥 ${topic.followers}</span>
                        </div>
                        <span class="text-xs">${utils.formatTime(new Date(topic.createdAt))}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    loadDiscussionsContent() {
        const discussions = [
            {
                topicTitle: '关于区块链在供应链中的应用',
                comment: '我觉得区块链在这里的应用会面临数据上链的真实性问题...',
                type: 'negation',
                time: utils.formatTime(Date.now() - 1 * 24 * 60 * 60 * 1000),
                topicId: 99
            },
            {
                topicTitle: '新型锂电池材料的大规模制备技术',
                comment: '我认为这个新材料很有潜力，特别是在能量密度方面...',
                type: 'support',
                time: utils.formatTime(Date.now() - 2 * 24 * 60 * 60 * 1000),
                topicId: 2
            }
        ];

        const container = document.getElementById('myDiscussionsList');
         if(!container) {
             console.warn("My Discussions List container #myDiscussionsList not found.");
            return;
         }

         if (discussions.length === 0) {
              container.innerHTML = `
                  <div class="text-center py-8 text-gray-500">
                      <div class="mb-4">
                          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                      </div>
                      <p class="text-lg font-medium text-gray-900 mb-2">还没有参与讨论</p>
                      <p class="text-gray-500 mb-4">参与感兴趣的话题讨论，分享您的观点</p>
                      <a href="projects.html" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          浏览话题
                      </a>
                  </div>`;
         } else {
             container.innerHTML = discussions.map(discussion => `
                 <div class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer" onclick="window.location.href='topic_discussion.html?id=${discussion.topicId}'">
                     <h4 class="font-semibold text-gray-900 mb-2">${utils.truncateText(discussion.topicTitle, 40)}</h4>
                      <p class="text-sm text-gray-600 mb-3">${utils.truncateText(discussion.comment, 100)}</p>
                     <div class="flex justify-between items-center text-sm text-gray-500">
                         <span class="px-2 py-1 rounded text-xs ${discussion.type === 'support' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${discussion.type === 'support' ? '支持' : '否定'}</span>
                         <span>${discussion.time}</span>
                     </div>
                 </div>
             `).join('');
         }
    }

    loadNegationsContent() {
        const negations = [
            {
                topicTitle: '对"量子计算商业化可行性"的否定',
                content: '当前量子计算技术还面临很多技术挑战...',
                likes: 8,
                time: utils.formatTime(Date.now() - 2 * 24 * 60 * 60 * 1000),
                 topicId: 101
            }
        ];

        const container = document.getElementById('myNegationsList');
         if(!container) {
              console.warn("My Negations List container #myNegationsList not found.");
             return;
         }

         if (negations.length === 0) {
              container.innerHTML = `
                  <div class="text-center py-8 text-gray-500">
                      <div class="mb-4">
                          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                          </svg>
                      </div>
                      <p class="text-lg font-medium text-gray-900 mb-2">还没有否定记录</p>
                      <p class="text-gray-500">提出建设性的否定意见，促进讨论深入</p>
                  </div>`;
         } else {
             container.innerHTML = negations.map(negation => `
                 <div class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer" onclick="window.location.href='topic_discussion.html?id=${negation.topicId}'">
                     <div class="flex justify-between items-start mb-2">
                         <h4 class="font-semibold text-gray-900">${utils.truncateText(negation.topicTitle, 40)}</h4>
                         <span class="text-red-600 text-sm font-medium">否定</span>
                     </div>
                     <p class="text-sm text-gray-600 mb-2">${utils.truncateText(negation.content, 100)}</p>
                     <div class="flex justify-between items-center text-xs text-gray-500">
                         <span>👍 ${negation.likes} 个赞同</span>
                         <span>${negation.time}</span>
                     </div>
                 </div>
             `).join('');
         }
    }

     loadSubscriptionsContent() {
         console.log("Loading subscribed topics content...");
         const container = document.getElementById('mySubscriptionsList');
          if(!container) {
              console.warn("My Subscriptions List container #mySubscriptionsList not found. Please add this div to profile.html");
              return;
          }

          if (this.subscribedTopics.length === 0) {
               container.innerHTML = `
                   <div class="text-center py-8 text-gray-500">
                       <div class="mb-4">
                           <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                           </svg>
                       </div>
                       <p class="text-lg font-medium text-gray-900 mb-2">还没有订阅话题</p>
                       <p class="text-gray-500 mb-4">订阅感兴趣的话题，及时获取最新动态</p>
                       <a href="projects.html" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800">
                           去发现话题
                       </a>
                   </div>
               `;
          } else {
               const allMockTopics = JSON.parse(localStorage.getItem('mockTopics') || '[]');
               const subscribedTopicDetails = allMockTopics.filter(topic =>
                    this.subscribedTopics.some(sub => sub.topicId == topic.id)
               );

               if (subscribedTopicDetails.length === 0) {
                    container.innerHTML = `<div class="text-center py-8 text-gray-500">
                        <p>订阅的话题信息加载失败</p>
                        <button onclick="profileManager.loadSubscribedTopics(); profileManager.loadSubscriptionsContent();" class="mt-2 text-blue-600 hover:underline">重新加载</button>
                    </div>`;
               } else {
                    container.innerHTML = subscribedTopicDetails.map(topic => {
                        const subscription = this.subscribedTopics.find(sub => sub.topicId == topic.id);
                        const subscribedTime = subscription ? utils.formatTime(new Date(subscription.subscribedAt)) : '未知';
                        
                        return `
                        <div class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                             <div class="flex justify-between items-start mb-3">
                                 <div class="flex-1 cursor-pointer" onclick="window.location.href='topic_discussion.html?id=${topic.id}'">
                                     <h4 class="font-semibold text-gray-900 mb-1">${utils.truncateText(topic.title, 40)}</h4>
                                     <p class="text-sm text-gray-600 mb-2">${utils.truncateText(topic.description, 100)}</p>
                                     <div class="flex flex-wrap gap-1 mb-2">
                                         ${(topic.tags || []).slice(0, 3).map(tag => `<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">#${tag}</span>`).join('')}
                                     </div>
                                 </div>
                                 <div class="ml-4 flex flex-col items-end">
                                     <span class="px-2 py-1 rounded text-xs ${topic.status === 'recruiting' ? 'bg-green-100 text-green-800' : topic.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} mb-2">
                                         ${topic.status === 'recruiting' ? '招募中' : topic.status === 'ongoing' ? '进行中' : '已封卷'}
                                     </span>
                                      <button class="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200 focus:outline-none" onclick="event.stopPropagation(); profileManager.unsubscribe(${topic.id})">取消订阅</button>
                                 </div>
                             </div>
                             <div class="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                                 <div class="flex space-x-4">
                                     <span>💬 ${topic.comments}</span>
                                     <span>👍 ${topic.likes}</span>
                                      <span>👎 ${topic.dislikes}</span>
                                 </div>
                                  <span class="text-xs">订阅于 ${subscribedTime}</span>
                             </div>
                        </div>
                    `}).join('');
               }
          }
     }

     unsubscribe(topicId) {
         console.log("Attempting to unsubscribe from topic:", topicId);
         if (!this.currentUser || !this.currentUser.id) {
              window.otherwiseApp.showMessage('请先登录', 'error');
             return;
         }

         window.otherwiseApp.showLoadingMessage('正在取消订阅...');

         setTimeout(() => {
             let success = false;

             if (window.otherwiseApp && window.otherwiseApp.subscriptionManager) {
                 success = window.otherwiseApp.unsubscribeFromTopic(topicId);
             } else {
                 // Fallback to direct localStorage manipulation
                 const initialCount = this.subscribedTopics.length;
                 this.subscribedTopics = this.subscribedTopics.filter(sub => sub.topicId != topicId);

                 if (this.subscribedTopics.length < initialCount) {
                     const subscriptionKey = `userSubscriptions_${this.currentUser.id}`;
                     localStorage.setItem(subscriptionKey, JSON.stringify(this.subscribedTopics));
                     success = true;
                 }
             }

             if (success) {
                 // Update profile stats and display
                 if (this.currentUser.profile?.stats) {
                     this.currentUser.profile.stats.subscribedTopics = this.subscribedTopics.length;
                     this.saveProfile(this.currentUser.profile);
                     this.updateProfileStatsDisplay(this.currentUser.profile.stats);
                 }

                 // Reload the subscriptions tab content
                 this.loadSubscriptionsContent();

                 window.otherwiseApp?.showMessage('取消订阅成功', 'success');
                 console.log("Unsubscribed successfully. Current subscriptions:", this.subscribedTopics);
             } else {
                 window.otherwiseApp?.showMessage('取消订阅失败', 'error');
                 console.error("Failed to unsubscribe. Topic ID not found in subscriptions?");
             }

             // Hide loading message
             document.querySelectorAll('.app-message.bg-blue-500').forEach(msg => msg.remove());

         }, 800);
     }

    handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            window.otherwiseApp.showMessage('请选择图片文件', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            window.otherwiseApp.showMessage('图片大小不能超过2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarDataUrl = e.target.result;
             const avatarImg = document.getElementById('avatarImage');
             const avatarPlaceholder = document.getElementById('avatarPlaceholder');

             if(avatarImg) {
                 avatarImg.src = avatarDataUrl;
                 avatarImg.style.display = 'block';
             }
             if(avatarPlaceholder) {
                 avatarPlaceholder.style.display = 'none';
             }

            if (this.currentUser?.profile) {
                this.currentUser.profile.avatar = avatarDataUrl;
                this.saveProfile(this.currentUser.profile);
                window.otherwiseApp.showMessage('头像更新成功', 'success');
                 if(window.navigation) {
                     window.navigation.updateUserStatus();
                 }
            } else {
                 console.error("Current user profile not available to save avatar.");
                 window.otherwiseApp.showMessage('更新头像失败', 'error');
            }
        };
        reader.onerror = (error) => {
             console.error("FileReader error:", error);
             window.otherwiseApp.showMessage('读取图片文件失败', 'error');
        }
        reader.readAsDataURL(file);
    }

    async handleProfileUpdate(e) {
        e.preventDefault();

        const formData = {
            nickname: document.getElementById('editNickname')?.value.trim() || '',
            userType: document.getElementById('editUserType')?.value || '',
            organization: document.getElementById('editOrganization')?.value.trim() || '',
            researchField: document.getElementById('editResearchField')?.value.trim() || '',
            bio: document.getElementById('editBio')?.value.trim() || ''
        };

        if (!formData.nickname) {
            window.otherwiseApp.showMessage('昵称不能为空', 'error');
            return;
        }

        if (formData.bio.length > 500) {
            window.otherwiseApp.showMessage('个人简介不能超过500字', 'error');
            return;
        }

         if (!this.currentUser?.profile) {
              console.error("Current user profile not available for update.");
              window.otherwiseApp.showMessage('更新失败：用户资料未加载', 'error');
              return;
         }

        try {
             window.otherwiseApp.showLoadingMessage('正在保存资料...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            Object.assign(this.currentUser.profile, formData);
            this.currentUser.profile.tags = [...this.userTags];

            this.saveProfile(this.currentUser.profile);
            this.updateProfileDisplay(this.currentUser.profile);

             if(window.otherwiseApp) {
                 window.otherwiseApp.currentUser = {
                      ...window.otherwiseApp.currentUser,
                      ...this.currentUser
                 };
                 localStorage.setItem('currentUser', JSON.stringify(window.otherwiseApp.currentUser));
             }
             if(window.navigation) {
                  window.navigation.updateUserStatus();
             }

            this.closeEditModal();
            window.otherwiseApp.showMessage('资料更新成功', 'success');

        } catch (error) {
            console.error("Profile update failed:", error);
            window.otherwiseApp.showMessage('更新失败，请重试', 'error');
        } finally {
             document.querySelectorAll('.app-message.bg-blue-500').forEach(msg => msg.remove());
        }
    }

    saveProfile(profile) {
         if (!this.currentUser || !this.currentUser.username) {
              console.error("Cannot save profile, user not identified.");
             return;
         }
        const profileKey = `profile_${this.currentUser.username}`;
        localStorage.setItem(profileKey, JSON.stringify(profile));
        console.log("Profile saved to localStorage:", profile);
    }

    addTag() {
        const input = document.getElementById('newTagInput');
        const tag = input?.value.trim();
        
        if (!tag || !input) return;
        
        if (this.userTags.includes(tag)) {
            window.otherwiseApp.showMessage('标签已存在', 'warning');
            return;
        }

        if (this.userTags.length >= 10) {
            window.otherwiseApp.showMessage('最多可添加10个标签', 'warning');
            return;
        }

        this.userTags.push(tag);
        input.value = '';
        this.updateCurrentTagsDisplay();
    }

    removeTag(tagToRemove) {
        this.userTags = this.userTags.filter(tag => tag !== tagToRemove);
        this.updateCurrentTagsDisplay();
    }

    updateCurrentTagsDisplay() {
        const container = document.getElementById('currentTags');
        if(container) {
             container.innerHTML = this.userTags.map(tag => `
                 <span class="tag" style="display: inline-flex; align-items: center; gap: 0.25rem;">
                     #${tag}
                     <button type="button" onclick="profileManager.removeTag('${tag.replace(/'/g, "\\'")}')" style="background: none; border: none; color: var(--color-text-secondary); cursor: pointer; font-size: 1rem; line-height: 1;">×</button>
                 </span>
             `).join(' ');
        }
    }

    openEditModal() {
         const modal = document.getElementById('editProfileModal');
         if(!modal) {
             console.error("Edit profile modal #editProfileModal not found.");
            return;
         }

        if (!this.currentUser?.profile) {
             console.error("User profile not loaded, cannot open edit modal.");
             window.otherwiseApp.showMessage('用户资料加载失败，无法编辑', 'error');
             return;
        }

        const profile = this.currentUser.profile;
        const editNickname = document.getElementById('editNickname');
        const editUserType = document.getElementById('editUserType');
        const editOrganization = document.getElementById('editOrganization');
        const editResearchField = document.getElementById('editResearchField');
        const editBio = document.getElementById('editBio');
        const newTagInput = document.getElementById('newTagInput');

        if(editNickname) editNickname.value = profile.nickname || '';
        if(editUserType) editUserType.value = profile.userType || 'other';
        if(editOrganization) editOrganization.value = profile.organization || '';
        if(editResearchField) editResearchField.value = profile.researchField || '';
        if(editBio) editBio.value = profile.bio || '';

         this.userTags = [...(profile.tags || [])];
        this.updateCurrentTagsDisplay();
        if(newTagInput) newTagInput.value = '';

        modal.style.display = 'block';
         modal.focus();
    }

    closeEditModal() {
         const modal = document.getElementById('editProfileModal');
         if(modal) {
             modal.style.display = 'none';
         }
    }
}

window.triggerAvatarUpload = function() {
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.click();
    } else {
        console.error("Avatar input element not found.");
    }
};

window.openEditModal = function() {
    if (window.profileManager) {
        window.profileManager.openEditModal();
    } else {
         console.error("profileManager not initialized.");
         window.otherwiseApp?.showMessage('应用初始化中，请稍后...', 'warning');
    }
};

window.closeEditModal = function() {
    if (window.profileManager) {
        window.profileManager.closeEditModal();
    } else {
         console.error("profileManager not initialized.");
    }
};

let profileManager;
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('profile.html')) {
         if (window.otherwiseApp && window.otherwiseApp.currentUser !== undefined) {
             if (window.otherwiseApp.currentUser?.isLoggedIn) {
                 profileManager = new ProfileManager();
                 window.profileManager = profileManager;
                 profileManager.init();
             } else {
                 console.log("Not logged in, ProfileManager not initialized.");
             }
         } else {
             console.error("otherwiseApp or currentUser not available when trying to initialize ProfileManager.");
         }
    }
});

window.addTag = function() {
     if (window.profileManager) {
        window.profileManager.addTag();
    } else {
         console.error("profileManager not initialized, cannot add tag.");
         window.otherwiseApp?.showMessage('页面加载中，请稍后重试。', 'warning');
    }
};

