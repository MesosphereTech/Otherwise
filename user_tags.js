/**
 * 用户资源标签系统
 * 为产学研三方用户提供多维度标签管理
 */

class UserTagSystem {
    constructor() {
        this.tagCategories = {
            // 身份类型
            identity: {
                name: '身份类型',
                icon: '👤',
                tags: ['高校研究者', '科研院所', '产业企业', '投资机构', '政府部门', '创业者', '学生', '自由职业者']
            },
            // 研究方向
            research: {
                name: '研究方向',
                icon: '🔬',
                tags: ['人工智能', '机器学习', '深度学习', '计算机视觉', '自然语言处理', '机器人技术', '生物医学', '材料科学', '能源技术', '环境科学']
            },
            // 技术能力
            technical: {
                name: '技术能力',
                icon: '⚙️',
                tags: ['算法开发', '软件开发', '硬件设计', '数据分析', '系统架构', '产品设计', '项目管理', '技术转化']
            },
            // 行业领域
            industry: {
                name: '行业领域',
                icon: '🏭',
                tags: ['医疗健康', '金融科技', '教育科技', '智能制造', '新能源', '生物技术', '农业科技', '交通出行']
            },
            // 资源类型
            resources: {
                name: '可提供资源',
                icon: '💼',
                tags: ['研发资金', '实验设备', '数据资源', '技术团队', '市场渠道', '政策支持', '投资资金', '孵化服务']
            },
            // 合作角色
            roles: {
                name: '合作角色',
                icon: '🤝',
                tags: ['技术负责人', '项目经理', '产品经理', '市场负责人', '投资人', '顾问', '合作伙伴', '服务提供商']
            },
            // 地理位置
            location: {
                name: '地理位置',
                icon: '📍',
                tags: ['北京', '上海', '深圳', '杭州', '广州', '成都', '西安', '南京', '武汉', '天津', '重庆', '苏州', '其他城市', '海外']
            },
            // 经验等级
            experience: {
                name: '经验等级',
                icon: '⭐',
                tags: ['初级(0-2年)', '中级(3-5年)', '高级(6-10年)', '专家(10年以上)', '权威专家', '行业领袖']
            }
        };
        
        this.userTags = this.loadUserTags();
        this.initializeTagSystem();
    }
    
    // 初始化标签系统
    initializeTagSystem() {
        this.createTagManagementUI();
        this.setupTagSearch();
        this.setupTagRecommendation();
    }
    
    // 加载用户标签
    loadUserTags() {
        return JSON.parse(localStorage.getItem('userTags') || '{}');
    }
    
    // 保存用户标签
    saveUserTags() {
        localStorage.setItem('userTags', JSON.stringify(this.userTags));
    }
    
    // 添加用户标签
    addUserTag(userId, category, tag) {
        if (!this.userTags[userId]) {
            this.userTags[userId] = {};
        }
        if (!this.userTags[userId][category]) {
            this.userTags[userId][category] = [];
        }
        
        if (!this.userTags[userId][category].includes(tag)) {
            this.userTags[userId][category].push(tag);
            this.saveUserTags();
            this.updateTagDisplay(userId);
            return true;
        }
        return false;
    }
    
    // 移除用户标签
    removeUserTag(userId, category, tag) {
        if (this.userTags[userId] && this.userTags[userId][category]) {
            this.userTags[userId][category] = this.userTags[userId][category].filter(t => t !== tag);
            if (this.userTags[userId][category].length === 0) {
                delete this.userTags[userId][category];
            }
            this.saveUserTags();
            this.updateTagDisplay(userId);
            return true;
        }
        return false;
    }
    
    // 获取用户标签
    getUserTags(userId) {
        return this.userTags[userId] || {};
    }
    
    // 标签匹配度计算
    calculateTagMatch(userId1, userId2) {
        const tags1 = this.getUserTags(userId1);
        const tags2 = this.getUserTags(userId2);
        
        let matchScore = 0;
        let totalTags = 0;
        
        Object.keys(this.tagCategories).forEach(category => {
            const userTags1 = tags1[category] || [];
            const userTags2 = tags2[category] || [];
            
            totalTags += Math.max(userTags1.length, userTags2.length);
            
            userTags1.forEach(tag => {
                if (userTags2.includes(tag)) {
                    // 根据标签类型给予不同权重
                    const weight = this.getTagWeight(category);
                    matchScore += weight;
                }
            });
        });
        
        return totalTags > 0 ? matchScore / totalTags : 0;
    }
    
    // 获取标签权重
    getTagWeight(category) {
        const weights = {
            identity: 1.5,     // 身份类型权重较高
            research: 2.0,     // 研究方向权重最高
            technical: 1.8,    // 技术能力权重高
            industry: 1.6,     // 行业领域权重较高
            resources: 1.4,    // 资源类型权重中等
            roles: 1.2,        // 合作角色权重中等
            location: 0.8,     // 地理位置权重较低
            experience: 1.0    // 经验等级权重一般
        };
        return weights[category] || 1.0;
    }
    
    // 推荐匹配用户
    recommendMatchingUsers(userId, limit = 10) {
        const userTags = this.getUserTags(userId);
        const allUsers = Object.keys(this.userTags).filter(id => id !== userId);
        
        const matches = allUsers.map(targetUserId => {
            const targetTags = this.getUserTags(targetUserId);
            let matchScore = 0;
            
            Object.keys(userTags).forEach(category => {
                const userCategoryTags = userTags[category] || [];
                const targetCategoryTags = targetTags[category] || [];
                
                userCategoryTags.forEach(tag => {
                    if (targetCategoryTags.includes(tag)) {
                        matchScore += 1;
                    }
                });
            });
            
            return {
                userId: targetUserId,
                matchScore: matchScore,
                tags: targetTags
            };
        });
        
        return matches
            .filter(match => match.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, limit);
    }
    
    // 智能标签推荐
    recommendTags(userId, category) {
        const userTags = this.getUserTags(userId);
        const categoryTags = userTags[category] || [];
        
        // 基于相似用户的标签进行推荐
        const similarUsers = this.recommendMatchingUsers(userId, 5);
        const tagFrequency = {};
        
        similarUsers.forEach(user => {
            const userCategoryTags = user.tags[category] || [];
            userCategoryTags.forEach(tag => {
                if (!categoryTags.includes(tag)) {
                    tagFrequency[tag] = (tagFrequency[tag] || 0) + user.matchScore;
                }
            });
        });
        
        return Object.entries(tagFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([tag]) => tag);
    }
    
    // 搜索用户（基于标签）
    searchUsersByTags(searchTags, categories = null) {
        const results = [];
        
        Object.entries(this.userTags).forEach(([userId, userTags]) => {
            let matchCount = 0;
            let totalSearchTags = 0;
            
            searchTags.forEach(searchTag => {
                totalSearchTags++;
                const searchLower = searchTag.toLowerCase();
                
                Object.entries(userTags).forEach(([category, tags]) => {
                    if (categories && !categories.includes(category)) return;
                    
                    tags.forEach(tag => {
                        if (tag.toLowerCase().includes(searchLower)) {
                            matchCount++;
                        }
                    });
                });
            });
            
            if (matchCount > 0) {
                results.push({
                    userId,
                    matchCount,
                    matchRatio: matchCount / totalSearchTags,
                    tags: userTags
                });
            }
        });
        
        return results.sort((a, b) => b.matchRatio - a.matchRatio);
    }
    
    // 生成标签统计
    generateTagStatistics() {
        const stats = {};
        
        Object.keys(this.tagCategories).forEach(category => {
            stats[category] = {};
        });
        
        Object.values(this.userTags).forEach(userTags => {
            Object.entries(userTags).forEach(([category, tags]) => {
                tags.forEach(tag => {
                    if (!stats[category][tag]) {
                        stats[category][tag] = 0;
                    }
                    stats[category][tag]++;
                });
            });
        });
        
        return stats;
    }
    
    // 创建标签管理UI
    createTagManagementUI() {
        // 这个方法将在个人资料页面中被调用
        return `
            <div id="tagManagementUI" class="card" style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">🏷️ 资源标签管理</h3>
                
                <div id="tagCategories" style="display: flex; flex-direction: column; gap: 1rem;">
                    ${Object.entries(this.tagCategories).map(([categoryId, category]) => `
                        <div class="tag-category" data-category="${categoryId}">
                            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem;">
                                <h4 style="font-size: 1rem; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
                                    <span>${category.icon}</span>
                                    <span>${category.name}</span>
                                </h4>
                                <button onclick="toggleTagCategory('${categoryId}')" class="btn btn-ghost btn-sm">
                                    编辑
                                </button>
                            </div>
                            
                            <div class="user-tags" id="userTags_${categoryId}" style="display: flex; flex-wrap: wrap; gap: 0.25rem; margin-bottom: 0.5rem;">
                                <!-- 用户已选标签 -->
                            </div>
                            
                            <div class="available-tags" id="availableTags_${categoryId}" style="display: none; flex-wrap: wrap; gap: 0.25rem; padding: 0.75rem; background-color: var(--color-background-secondary); border-radius: var(--radius-md);">
                                ${category.tags.map(tag => `
                                    <button onclick="toggleUserTag('${categoryId}', '${tag}')" 
                                            class="tag-option" 
                                            data-category="${categoryId}" 
                                            data-tag="${tag}"
                                            style="padding: 0.25rem 0.5rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background-color: var(--color-background); font-size: 0.75rem; cursor: pointer;">
                                        ${tag}
                                    </button>
                                `).join('')}
                            </div>
                            
                            <div class="tag-recommendations" id="recommendations_${categoryId}" style="display: none; margin-top: 0.5rem;">
                                <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 0.25rem;">💡 推荐标签：</div>
                                <div id="recommendedTags_${categoryId}" style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                                    <!-- 推荐标签 -->
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-border);">
                    <h4 style="font-size: 1rem; font-weight: 500; margin-bottom: 0.5rem;">🎯 匹配度分析</h4>
                    <div id="matchAnalysis" style="font-size: 0.875rem; color: var(--color-text-secondary);">
                        完善标签信息后，系统将为您推荐匹配的合作伙伴
                    </div>
                </div>
            </div>
        `;
    }
    
    // 更新标签显示
    updateTagDisplay(userId) {
        const userTags = this.getUserTags(userId);
        
        Object.keys(this.tagCategories).forEach(categoryId => {
            const container = document.getElementById(`userTags_${categoryId}`);
            if (container) {
                const categoryTags = userTags[categoryId] || [];
                container.innerHTML = categoryTags.map(tag => `
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.5rem; background-color: var(--color-primary); color: var(--color-secondary); border-radius: var(--radius-sm); font-size: 0.75rem;">
                        ${tag}
                        <button onclick="removeUserTag('${userId}', '${categoryId}', '${tag}')" style="background: none; border: none; color: var(--color-secondary); cursor: pointer; padding: 0; margin-left: 0.25rem;">×</button>
                    </span>
                `).join('');
                
                // 更新可用标签按钮状态
                const availableContainer = document.getElementById(`availableTags_${categoryId}`);
                if (availableContainer) {
                    availableContainer.querySelectorAll('.tag-option').forEach(btn => {
                        const tag = btn.dataset.tag;
                        if (categoryTags.includes(tag)) {
                            btn.style.backgroundColor = 'var(--color-primary)';
                            btn.style.color = 'var(--color-secondary)';
                            btn.style.borderColor = 'var(--color-primary)';
                        } else {
                            btn.style.backgroundColor = 'var(--color-background)';
                            btn.style.color = 'var(--color-text-primary)';
                            btn.style.borderColor = 'var(--color-border)';
                        }
                    });
                }
            }
        });
        
        this.updateMatchAnalysis(userId);
    }
    
    // 更新匹配度分析
    updateMatchAnalysis(userId) {
        const container = document.getElementById('matchAnalysis');
        if (!container) return;
        
        const recommendations = this.recommendMatchingUsers(userId, 3);
        
        if (recommendations.length === 0) {
            container.innerHTML = '暂无匹配的用户，请完善更多标签信息';
            return;
        }
        
        container.innerHTML = `
            <div style="margin-bottom: 0.5rem;">为您找到 ${recommendations.length} 个高匹配度用户：</div>
            ${recommendations.map(rec => `
                <div style="display: flex; justify-content: between; align-items: center; padding: 0.5rem; background-color: var(--color-background-secondary); border-radius: var(--radius-sm); margin-bottom: 0.25rem;">
                    <span>用户 ${rec.userId}</span>
                    <span style="color: var(--color-primary); font-weight: 500;">${Math.round(rec.matchScore * 100)}% 匹配</span>
                </div>
            `).join('')}
        `;
    }
}

// 全局标签系统实例
window.userTagSystem = new UserTagSystem();

// 全局函数
function toggleTagCategory(categoryId) {
    const availableContainer = document.getElementById(`availableTags_${categoryId}`);
    const recommendContainer = document.getElementById(`recommendations_${categoryId}`);
    
    if (availableContainer.style.display === 'none') {
        availableContainer.style.display = 'flex';
        recommendContainer.style.display = 'block';
        
        // 加载推荐标签
        const userId = getCurrentUserId();
        const recommendations = window.userTagSystem.recommendTags(userId, categoryId);
        const recContainer = document.getElementById(`recommendedTags_${categoryId}`);
        
        recContainer.innerHTML = recommendations.map(tag => `
            <button onclick="toggleUserTag('${categoryId}', '${tag}')" 
                    style="padding: 0.25rem 0.5rem; border: 1px dashed var(--color-border); border-radius: var(--radius-sm); background-color: var(--color-background-tertiary); font-size: 0.75rem; cursor: pointer; color: var(--color-text-secondary);">
                + ${tag}
            </button>
        `).join('');
    } else {
        availableContainer.style.display = 'none';
        recommendContainer.style.display = 'none';
    }
}

function toggleUserTag(categoryId, tag) {
    const userId = getCurrentUserId();
    const userTags = window.userTagSystem.getUserTags(userId);
    const categoryTags = userTags[categoryId] || [];
    
    if (categoryTags.includes(tag)) {
        window.userTagSystem.removeUserTag(userId, categoryId, tag);
    } else {
        window.userTagSystem.addUserTag(userId, categoryId, tag);
    }
}

function getCurrentUserId() {
    // 在实际应用中，这应该从认证系统获取
    return localStorage.getItem('currentUserId') || 'user_' + Date.now();
}

// 导出标签系统
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserTagSystem;
} 