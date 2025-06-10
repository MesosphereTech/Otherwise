class ProjectService {
    constructor() {
        this.projects = [];
    }

    // 创建新项目
    async createProject(projectData) {
        try {
            const project = new Project(projectData);
            // TODO: 调用API保存项目
            this.projects.push(project);
            return project;
        } catch (error) {
            console.error('创建项目失败:', error);
            throw error;
        }
    }

    // 更新项目模块
    async updateProjectModule(projectId, moduleName, content) {
        try {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) throw new Error('项目不存在');

            const success = project.updateModule(moduleName, content);
            if (!success) throw new Error('更新项目模块失败');

            // TODO: 调用API更新项目模块
            return project;
        } catch (error) {
            console.error('更新项目模块失败:', error);
            throw error;
        }
    }

    // 添加团队成员
    async addTeamMember(projectId, member) {
        try {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) throw new Error('项目不存在');

            const success = project.addTeamMember(member);
            if (!success) throw new Error('添加团队成员失败');

            // TODO: 调用API更新项目团队
            return project;
        } catch (error) {
            console.error('添加团队成员失败:', error);
            throw error;
        }
    }

    // 移除团队成员
    async removeTeamMember(projectId, memberId) {
        try {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) throw new Error('项目不存在');

            const success = project.removeTeamMember(memberId);
            if (!success) throw new Error('移除团队成员失败');

            // TODO: 调用API更新项目团队
            return project;
        } catch (error) {
            console.error('移除团队成员失败:', error);
            throw error;
        }
    }

    // 添加项目悬赏
    async addProjectReward(projectId, reward) {
        try {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) throw new Error('项目不存在');

            const success = project.addReward(reward);
            if (!success) throw new Error('添加项目悬赏失败');

            // TODO: 调用API保存项目悬赏
            return project;
        } catch (error) {
            console.error('添加项目悬赏失败:', error);
            throw error;
        }
    }

    // 设置项目股权分成
    async setProjectEquity(projectId, percentage) {
        try {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) throw new Error('项目不存在');

            const success = project.setEquity(percentage);
            if (!success) throw new Error('设置项目股权分成失败');

            // TODO: 调用API更新项目股权信息
            return project;
        } catch (error) {
            console.error('设置项目股权分成失败:', error);
            throw error;
        }
    }

    // 关闭项目
    async closeProject(projectId) {
        try {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) throw new Error('项目不存在');

            const success = project.closeProject();
            if (!success) throw new Error('关闭项目失败');

            // TODO: 调用API更新项目状态
            return project;
        } catch (error) {
            console.error('关闭项目失败:', error);
            throw error;
        }
    }

    // 归档项目
    async archiveProject(projectId) {
        try {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) throw new Error('项目不存在');

            const success = project.archiveProject();
            if (!success) throw new Error('归档项目失败');

            // TODO: 调用API更新项目状态
            return project;
        } catch (error) {
            console.error('归档项目失败:', error);
            throw error;
        }
    }

    // 关注项目
    async followProject(projectId, userId) {
        try {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) throw new Error('项目不存在');

            const success = project.addFollower(userId);
            if (!success) throw new Error('关注项目失败');

            // TODO: 调用API更新项目关注者
            return project;
        } catch (error) {
            console.error('关注项目失败:', error);
            throw error;
        }
    }

    // 取消关注项目
    async unfollowProject(projectId, userId) {
        try {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) throw new Error('项目不存在');

            const success = project.removeFollower(userId);
            if (!success) throw new Error('取消关注项目失败');

            // TODO: 调用API更新项目关注者
            return project;
        } catch (error) {
            console.error('取消关注项目失败:', error);
            throw error;
        }
    }

    // 获取项目列表
    async getProjects(filters = {}) {
        try {
            // TODO: 调用API获取项目列表
            return this.projects.filter(project => {
                if (filters.status && project.status !== filters.status) return false;
                if (filters.creator && project.creator !== filters.creator) return false;
                return true;
            });
        } catch (error) {
            console.error('获取项目列表失败:', error);
            throw error;
        }
    }

    // 获取单个项目详情
    async getProject(projectId) {
        try {
            const project = this.projects.find(p => p.id === projectId);
            if (!project) throw new Error('项目不存在');
            return project;
        } catch (error) {
            console.error('获取项目详情失败:', error);
            throw error;
        }
    }
} 