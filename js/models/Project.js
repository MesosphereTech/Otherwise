class Project {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || '';
        this.description = data.description || '';
        this.creator = data.creator || null;
        this.createdAt = data.createdAt || new Date();
        this.status = data.status || 'draft'; // draft, active, closed, archived
        this.modules = data.modules || this._initDefaultModules();
        this.team = data.team || [];
        this.tags = data.tags || [];
        this.discussions = data.discussions || [];
        this.rewards = data.rewards || [];
        this.equity = data.equity || null;
        this.views = data.views || 0;
        this.followers = data.followers || [];
    }

    _initDefaultModules() {
        return {
            resources: { title: '项目资源需求', content: '' },
            theory: { title: '技术原理', content: '' },
            implementation: { title: '技术实施', content: '' },
            software: { title: '软件', content: '' },
            hardware: { title: '硬件', content: '' },
            market: { title: '市场', content: '' },
            finance: { title: '财务', content: '' },
            funding: { title: '融资', content: '' }
        };
    }

    // 更新模块内容
    updateModule(moduleName, content) {
        if (this.modules[moduleName]) {
            this.modules[moduleName].content = content;
            return true;
        }
        return false;
    }

    // 添加团队成员
    addTeamMember(member) {
        if (!this.team.find(m => m.id === member.id)) {
            this.team.push(member);
            return true;
        }
        return false;
    }

    // 移除团队成员
    removeTeamMember(memberId) {
        const index = this.team.findIndex(m => m.id === memberId);
        if (index > -1) {
            this.team.splice(index, 1);
            return true;
        }
        return false;
    }

    // 添加悬赏
    addReward(reward) {
        this.rewards.push({
            ...reward,
            createdAt: new Date(),
            status: 'active'
        });
        return true;
    }

    // 设置股权分成
    setEquity(percentage) {
        if (percentage > 0 && percentage <= 100) {
            this.equity = percentage;
            return true;
        }
        return false;
    }

    // 关闭项目
    closeProject() {
        this.status = 'closed';
        return true;
    }

    // 归档项目
    archiveProject() {
        this.status = 'archived';
        return true;
    }

    // 添加关注者
    addFollower(userId) {
        if (!this.followers.includes(userId)) {
            this.followers.push(userId);
            return true;
        }
        return false;
    }

    // 移除关注者
    removeFollower(userId) {
        const index = this.followers.indexOf(userId);
        if (index > -1) {
            this.followers.splice(index, 1);
            return true;
        }
        return false;
    }
} 