class Topic {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || '';
        this.content = data.content || '';
        this.author = data.author || null;
        this.createdAt = data.createdAt || new Date();
        this.categories = data.categories || [];
        this.tags = data.tags || [];
        this.negativeOpinions = data.negativeOpinions || [];
        this.positiveOpinions = data.positiveOpinions || [];
        this.isAnonymous = data.isAnonymous || false;
        this.status = data.status || 'active'; // active, closed, archived
        this.subDiscussions = data.subDiscussions || [];
        this.projectTeam = data.projectTeam || [];
    }

    addNegativeOpinion(opinion) {
        if (opinion.content && opinion.content.length <= 50) {
            this.negativeOpinions.push({
                ...opinion,
                createdAt: new Date()
            });
            return true;
        }
        return false;
    }

    addPositiveOpinion(opinion) {
        // 只有在有否定意见的情况下才能添加肯定意见
        if (this.negativeOpinions.length > 0) {
            this.positiveOpinions.push({
                ...opinion,
                createdAt: new Date()
            });
            return true;
        }
        return false;
    }

    toggleAnonymous() {
        this.isAnonymous = !this.isAnonymous;
        return this.isAnonymous;
    }

    closeTopic() {
        this.status = 'closed';
        return true;
    }

    archiveTopic() {
        this.status = 'archived';
        return true;
    }
} 