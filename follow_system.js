/**
 * 点兵点将关注系统
 * 实现用户关注功能和等级特权系统
 */

class FollowSystem {
    constructor() {
        this.followers = this.loadFollowers();
        this.following = this.loadFollowing();
        this.userLevels = this.loadUserLevels();
        
        // 等级配置
        this.levelConfig = {
            bronze: { min: 0, max: 49, name: '青铜学者', icon: '🥉', privileges: ['基础互动'] },
            silver: { min: 50, max: 199, name: '白银专家', icon: '🥈', privileges: ['基础互动', '发起投票'] },
            gold: { min: 200, max: 499, name: '黄金导师', icon: '🥇', privileges: ['基础互动', '发起投票', '创建闭门讨论'] },
            platinum: { min: 500, max: 999, name: '铂金权威', icon: '💎', privileges: ['基础互动', '发起投票', '创建闭门讨论', '闭门会议室'] },
            diamond: { min: 1000, max: 4999, name: '钻石领袖', icon: '💠', privileges: ['基础互动', '发起投票', '创建闭门讨论', '闭门会议室', '闭门路演室'] },
            master: { min: 5000, max: 9999, name: '大师级专家', icon: '👑', privileges: ['全部权限', '上帝肯定权限'] },
            grandmaster: { min: 10000, max: Infinity, name: '宗师级权威', icon: '⭐', privileges: ['全部权限', '上帝肯定权限', '平台治理'] }
        };
        
        this.init();
    }
    
    init() {
        this.updateAllUserLevels();
        this.setupEventListeners();
    }
    
    // 加载关注者数据
    loadFollowers() {
        return JSON.parse(localStorage.getItem('followers') || '{}');
    }
    
    // 保存关注者数据
    saveFollowers() {
        localStorage.setItem('followers', JSON.stringify(this.followers));
    }
    
    // 加载关注中数据
    loadFollowing() {
        return JSON.parse(localStorage.getItem('following') || '{}');
    }
    
    // 保存关注中数据
    saveFollowing() {
        localStorage.setItem('following', JSON.stringify(this.following));
    }
    
    // 加载用户等级数据
    loadUserLevels() {
        return JSON.parse(localStorage.getItem('userLevels') || '{}');
    }
    
    // 保存用户等级数据
    saveUserLevels() {
        localStorage.setItem('userLevels', JSON.stringify(this.userLevels));
    }
    
    // 关注用户
    followUser(followerId, targetUserId) {
        if (followerId === targetUserId) {
            return { success: false, message: '不能关注自己' };
        }
        
        // 添加到关注中列表
        if (!this.following[followerId]) {
            this.following[followerId] = [];
        }
        
        if (this.following[followerId].includes(targetUserId)) {
            return { success: false, message: '已经关注过该用户' };
        }
        
        this.following[followerId].push(targetUserId);
        
        // 添加到被关注者的粉丝列表
        if (!this.followers[targetUserId]) {
            this.followers[targetUserId] = [];
        }
        
        this.followers[targetUserId].push(followerId);
        
        // 保存数据
        this.saveFollowing();
        this.saveFollowers();
        
        // 更新等级
        this.updateUserLevel(targetUserId);
        
        // 触发关注事件
        this.onUserFollowed(followerId, targetUserId);
        
        return { success: true, message: '关注成功' };
    }
    
    // 取消关注
    unfollowUser(followerId, targetUserId) {
        // 从关注中列表移除
        if (this.following[followerId]) {
            this.following[followerId] = this.following[followerId].filter(id => id !== targetUserId);
        }
        
        // 从被关注者的粉丝列表移除
        if (this.followers[targetUserId]) {
            this.followers[targetUserId] = this.followers[targetUserId].filter(id => id !== followerId);
        }
        
        // 保存数据
        this.saveFollowing();
        this.saveFollowers();
        
        // 更新等级
        this.updateUserLevel(targetUserId);
        
        // 触发取消关注事件
        this.onUserUnfollowed(followerId, targetUserId);
        
        return { success: true, message: '取消关注成功' };
    }
    
    // 获取用户粉丝数
    getFollowersCount(userId) {
        return (this.followers[userId] || []).length;
    }
    
    // 获取用户关注数
    getFollowingCount(userId) {
        return (this.following[userId] || []).length;
    }
    
    // 获取用户粉丝列表
    getFollowers(userId) {
        return this.followers[userId] || [];
    }
    
    // 获取用户关注列表
    getFollowing(userId) {
        return this.following[userId] || [];
    }
    
    // 检查是否已关注
    isFollowing(followerId, targetUserId) {
        return (this.following[followerId] || []).includes(targetUserId);
    }
    
    // 更新用户等级
    updateUserLevel(userId) {
        const followersCount = this.getFollowersCount(userId);
        const newLevel = this.calculateUserLevel(followersCount);
        const oldLevel = this.userLevels[userId];
        
        this.userLevels[userId] = newLevel;
        this.saveUserLevels();
        
        // 如果等级提升，触发升级事件
        if (oldLevel !== newLevel) {
            this.onUserLevelChanged(userId, oldLevel, newLevel, followersCount);
        }
    }
    
    // 计算用户等级
    calculateUserLevel(followersCount) {
        for (const [levelId, config] of Object.entries(this.levelConfig)) {
            if (followersCount >= config.min && followersCount <= config.max) {
                return levelId;
            }
        }
        return 'bronze';
    }
    
    // 获取用户等级信息
    getUserLevel(userId) {
        const levelId = this.userLevels[userId] || 'bronze';
        const followersCount = this.getFollowersCount(userId);
        
        return {
            levelId,
            ...this.levelConfig[levelId],
            followersCount,
            nextLevel: this.getNextLevel(levelId),
            progressToNext: this.calculateProgress(followersCount, levelId)
        };
    }
    
    // 获取下一等级
    getNextLevel(currentLevelId) {
        const levels = Object.keys(this.levelConfig);
        const currentIndex = levels.indexOf(currentLevelId);
        
        if (currentIndex < levels.length - 1) {
            const nextLevelId = levels[currentIndex + 1];
            return {
                levelId: nextLevelId,
                ...this.levelConfig[nextLevelId]
            };
        }
        
        return null;
    }
    
    // 计算升级进度
    calculateProgress(followersCount, levelId) {
        const config = this.levelConfig[levelId];
        const nextLevel = this.getNextLevel(levelId);
        
        if (!nextLevel) {
            return 100; // 已达到最高等级
        }
        
        const currentLevelRange = config.max - config.min + 1;
        const progressInCurrentLevel = followersCount - config.min;
        
        return Math.round((progressInCurrentLevel / currentLevelRange) * 100);
    }
    
    // 检查用户权限
    hasPrivilege(userId, privilege) {
        const userLevel = this.getUserLevel(userId);
        return userLevel.privileges.includes(privilege) || userLevel.privileges.includes('全部权限');
    }
    
    // 获取用户活动动态
    getUserActivity(userId, limit = 10) {
        // 这里可以集成其他系统的活动数据
        const activities = JSON.parse(localStorage.getItem(`userActivity_${userId}`) || '[]');
        return activities.slice(0, limit);
    }
    
    // 记录用户活动
    recordActivity(userId, activity) {
        const activities = JSON.parse(localStorage.getItem(`userActivity_${userId}`) || '[]');
        activities.unshift({
            ...activity,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        
        // 只保留最近100条活动
        localStorage.setItem(`userActivity_${userId}`, JSON.stringify(activities.slice(0, 100)));
        
        // 通知关注者
        this.notifyFollowers(userId, activity);
    }
    
    // 通知关注者
    notifyFollowers(userId, activity) {
        const followers = this.getFollowers(userId);
        const userLevel = this.getUserLevel(userId);
        
        followers.forEach(followerId => {
            this.addNotification(followerId, {
                type: 'follower_activity',
                userId: userId,
                userLevel: userLevel,
                activity: activity,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    // 添加通知
    addNotification(userId, notification) {
        const notifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
        notifications.unshift(notification);
        
        // 只保留最近50条通知
        localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications.slice(0, 50)));
    }
    
    // 获取推荐关注用户
    getRecommendedUsers(userId, limit = 5) {
        const following = this.getFollowing(userId);
        const allUsers = Object.keys(this.followers);
        
        // 基于共同关注推荐
        const recommendations = allUsers
            .filter(targetUser => targetUser !== userId && !following.includes(targetUser))
            .map(targetUser => {
                const targetFollowing = this.getFollowing(targetUser);
                const commonFollowing = following.filter(id => targetFollowing.includes(id));
                const followersCount = this.getFollowersCount(targetUser);
                const userLevel = this.getUserLevel(targetUser);
                
                return {
                    userId: targetUser,
                    commonFollowing: commonFollowing.length,
                    followersCount,
                    userLevel,
                    score: commonFollowing.length * 2 + Math.log(followersCount + 1)
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
        
        return recommendations;
    }
    
    // 更新所有用户等级
    updateAllUserLevels() {
        Object.keys(this.followers).forEach(userId => {
            this.updateUserLevel(userId);
        });
    }
    
    // 事件监听器设置
    setupEventListeners() {
        // 可以在这里设置全局事件监听
    }
    
    // 事件回调
    onUserFollowed(followerId, targetUserId) {
        console.log(`用户 ${followerId} 关注了 ${targetUserId}`);
        
        // 记录活动
        this.recordActivity(followerId, {
            type: 'follow',
            target: targetUserId,
            description: '关注了新用户'
        });
    }
    
    onUserUnfollowed(followerId, targetUserId) {
        console.log(`用户 ${followerId} 取消关注了 ${targetUserId}`);
    }
    
    onUserLevelChanged(userId, oldLevel, newLevel, followersCount) {
        console.log(`用户 ${userId} 等级从 ${oldLevel} 提升到 ${newLevel}，粉丝数：${followersCount}`);
        
        // 记录升级活动
        this.recordActivity(userId, {
            type: 'level_up',
            oldLevel,
            newLevel,
            followersCount,
            description: `等级提升到 ${this.levelConfig[newLevel].name}`
        });
        
        // 发送升级通知
        this.addNotification(userId, {
            type: 'level_up',
            newLevel,
            levelName: this.levelConfig[newLevel].name,
            privileges: this.levelConfig[newLevel].privileges,
            message: `恭喜！您的等级提升到 ${this.levelConfig[newLevel].name}`,
            timestamp: new Date().toISOString()
        });
    }
    
    // 生成关注统计报告
    generateFollowStats() {
        const stats = {
            totalUsers: Object.keys(this.followers).length,
            totalFollowRelations: Object.values(this.following).reduce((sum, arr) => sum + arr.length, 0),
            levelDistribution: {},
            topUsers: []
        };
        
        // 统计等级分布
        Object.keys(this.levelConfig).forEach(level => {
            stats.levelDistribution[level] = 0;
        });
        
        // 计算用户排行
        const userStats = Object.keys(this.followers).map(userId => {
            const followersCount = this.getFollowersCount(userId);
            const followingCount = this.getFollowingCount(userId);
            const userLevel = this.getUserLevel(userId);
            
            stats.levelDistribution[userLevel.levelId]++;
            
            return {
                userId,
                followersCount,
                followingCount,
                level: userLevel.levelId,
                levelName: userLevel.name
            };
        });
        
        stats.topUsers = userStats
            .sort((a, b) => b.followersCount - a.followersCount)
            .slice(0, 10);
        
        return stats;
    }
}

// 全局关注系统实例
window.followSystem = new FollowSystem();

// 全局函数
function followUser(targetUserId) {
    const currentUserId = getCurrentUserId();
    const result = window.followSystem.followUser(currentUserId, targetUserId);
    
    if (result.success) {
        updateFollowButton(targetUserId, true);
        showMessage(result.message, 'success');
    } else {
        showMessage(result.message, 'error');
    }
    
    return result;
}

function unfollowUser(targetUserId) {
    const currentUserId = getCurrentUserId();
    const result = window.followSystem.unfollowUser(currentUserId, targetUserId);
    
    if (result.success) {
        updateFollowButton(targetUserId, false);
        showMessage(result.message, 'success');
    } else {
        showMessage(result.message, 'error');
    }
    
    return result;
}

function updateFollowButton(targetUserId, isFollowing) {
    const buttons = document.querySelectorAll(`[data-follow-target="${targetUserId}"]`);
    buttons.forEach(btn => {
        if (isFollowing) {
            btn.textContent = '已关注';
            btn.classList.add('following');
            btn.onclick = () => unfollowUser(targetUserId);
        } else {
            btn.textContent = '关注';
            btn.classList.remove('following');
            btn.onclick = () => followUser(targetUserId);
        }
    });
}

function getUserLevelBadge(userId) {
    const userLevel = window.followSystem.getUserLevel(userId);
    return `
        <span class="user-level-badge" title="${userLevel.name} - ${userLevel.followersCount} 粉丝">
            ${userLevel.icon}
        </span>
    `;
}

function showMessage(message, type = 'info') {
    // 简单的消息提示实现
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 4px;
        color: white;
        background-color: ${type === 'success' ? '#00aa44' : type === 'error' ? '#ff4444' : '#666666'};
        z-index: 1000;
        transition: opacity 0.3s;
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
}

function getCurrentUserId() {
    return localStorage.getItem('currentUserId') || 'user_' + Date.now();
}

// 导出关注系统
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FollowSystem;
} 