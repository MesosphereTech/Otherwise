class User {
    constructor(data = {}) {
        this.id = data.id || null;
        this.username = data.username || '';
        this.email = data.email || '';
        this.avatar = data.avatar || '';
        this.tags = data.tags || []; // 资源标签
        this.role = data.role || 'user'; // user, expert, god
        this.isAnonymous = data.isAnonymous || false;
        this.followers = data.followers || [];
        this.following = data.following || [];
        this.topics = data.topics || [];
        this.opinions = data.opinions || [];
        this.privileges = data.privileges || [];
        this.reputation = data.reputation || 0;
    }

    // 添加资源标签
    addTag(tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
            return true;
        }
        return false;
    }

    // 移除资源标签
    removeTag(tag) {
        const index = this.tags.indexOf(tag);
        if (index > -1) {
            this.tags.splice(index, 1);
            return true;
        }
        return false;
    }

    // 关注用户
    followUser(userId) {
        if (!this.following.includes(userId)) {
            this.following.push(userId);
            return true;
        }
        return false;
    }

    // 取消关注
    unfollowUser(userId) {
        const index = this.following.indexOf(userId);
        if (index > -1) {
            this.following.splice(index, 1);
            return true;
        }
        return false;
    }

    // 切换匿名状态
    toggleAnonymous() {
        this.isAnonymous = !this.isAnonymous;
        return this.isAnonymous;
    }

    // 检查是否有特定权限
    hasPrivilege(privilege) {
        return this.privileges.includes(privilege);
    }

    // 添加声望值
    addReputation(points) {
        this.reputation += points;
        this._updateRole();
        return this.reputation;
    }

    // 根据声望值更新角色
    _updateRole() {
        if (this.reputation >= 1000) {
            this.role = 'god';
        } else if (this.reputation >= 500) {
            this.role = 'expert';
        }
    }
} 