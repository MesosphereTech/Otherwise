class TopicService {
    constructor() {
        this.topics = [];
        this.opinions = [];
    }

    // 创建新话题
    async createTopic(topicData) {
        try {
            const topic = new Topic(topicData);
            // TODO: 调用API保存话题
            this.topics.push(topic);
            return topic;
        } catch (error) {
            console.error('创建话题失败:', error);
            throw error;
        }
    }

    // 添加否定意见
    async addNegativeOpinion(topicId, opinionData) {
        try {
            const topic = this.topics.find(t => t.id === topicId);
            if (!topic) throw new Error('话题不存在');

            if (opinionData.content.length > 50) {
                throw new Error('否定意见不能超过50字');
            }

            const success = topic.addNegativeOpinion(opinionData);
            if (!success) throw new Error('添加否定意见失败');

            // TODO: 调用API保存否定意见
            return topic;
        } catch (error) {
            console.error('添加否定意见失败:', error);
            throw error;
        }
    }

    // 添加肯定意见
    async addPositiveOpinion(topicId, opinionData) {
        try {
            const topic = this.topics.find(t => t.id === topicId);
            if (!topic) throw new Error('话题不存在');

            const success = topic.addPositiveOpinion(opinionData);
            if (!success) throw new Error('需要先有否定意见才能添加肯定意见');

            // TODO: 调用API保存肯定意见
            return topic;
        } catch (error) {
            console.error('添加肯定意见失败:', error);
            throw error;
        }
    }

    // 切换话题匿名状态
    async toggleTopicAnonymous(topicId) {
        try {
            const topic = this.topics.find(t => t.id === topicId);
            if (!topic) throw new Error('话题不存在');

            const isAnonymous = topic.toggleAnonymous();
            // TODO: 调用API更新话题匿名状态
            return isAnonymous;
        } catch (error) {
            console.error('切换话题匿名状态失败:', error);
            throw error;
        }
    }

    // 关闭话题
    async closeTopic(topicId) {
        try {
            const topic = this.topics.find(t => t.id === topicId);
            if (!topic) throw new Error('话题不存在');

            const success = topic.closeTopic();
            if (!success) throw new Error('关闭话题失败');

            // TODO: 调用API更新话题状态
            return topic;
        } catch (error) {
            console.error('关闭话题失败:', error);
            throw error;
        }
    }

    // 归档话题
    async archiveTopic(topicId) {
        try {
            const topic = this.topics.find(t => t.id === topicId);
            if (!topic) throw new Error('话题不存在');

            const success = topic.archiveTopic();
            if (!success) throw new Error('归档话题失败');

            // TODO: 调用API更新话题状态
            return topic;
        } catch (error) {
            console.error('归档话题失败:', error);
            throw error;
        }
    }

    // 获取话题列表
    async getTopics(filters = {}) {
        try {
            // TODO: 调用API获取话题列表
            return this.topics.filter(topic => {
                if (filters.status && topic.status !== filters.status) return false;
                if (filters.author && topic.author !== filters.author) return false;
                return true;
            });
        } catch (error) {
            console.error('获取话题列表失败:', error);
            throw error;
        }
    }

    // 获取单个话题详情
    async getTopic(topicId) {
        try {
            const topic = this.topics.find(t => t.id === topicId);
            if (!topic) throw new Error('话题不存在');
            return topic;
        } catch (error) {
            console.error('获取话题详情失败:', error);
            throw error;
        }
    }
} 