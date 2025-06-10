// 初始化服务
const topicService = new TopicService();
const projectService = new ProjectService();

// 表单提交处理
document.getElementById('createTopicForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        // 收集表单数据
        const formData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            modules: {
                resources: document.getElementById('resources').value,
                theory: document.getElementById('theory').value,
                implementation: document.getElementById('implementation').value,
                software: document.getElementById('software').value,
                hardware: document.getElementById('hardware').value,
                market: document.getElementById('market').value,
                finance: document.getElementById('finance').value,
                funding: document.getElementById('funding').value
            },
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
            isAnonymous: document.getElementById('anonymous').checked
        };

        // 创建话题
        const topic = await topicService.createTopic(formData);

        // 创建相关项目
        const project = await projectService.createProject({
            title: formData.title,
            description: formData.description,
            modules: formData.modules,
            tags: formData.tags,
            creator: window.currentUser?.id // 假设有全局用户对象
        });

        // 显示成功消息
        showNotification('话题创建成功！', 'success');

        // 跳转到话题详情页
        setTimeout(() => {
            window.location.href = `/topic/${topic.id}`;
        }, 1500);

    } catch (error) {
        console.error('创建话题失败:', error);
        showNotification(error.message || '创建话题失败，请稍后重试', 'error');
    }
});

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
    } text-white`;
    notification.textContent = message;

    // 添加到页面
    document.body.appendChild(notification);

    // 3秒后移除
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 字数限制检查
document.getElementById('description').addEventListener('input', (event) => {
    const maxLength = 2000;
    if (event.target.value.length > maxLength) {
        event.target.value = event.target.value.slice(0, maxLength);
        showNotification(`描述不能超过${maxLength}字`, 'error');
    }
});

// 标签输入处理
document.getElementById('tags').addEventListener('input', (event) => {
    const tags = event.target.value.split(',');
    if (tags.length > 8) {
        event.target.value = tags.slice(0, 8).join(',');
        showNotification('最多添加8个标签', 'error');
    }
}); 