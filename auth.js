// 用户认证相关逻辑
class AuthManager {
    constructor() {
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        this.debounceTimer = null;
    }

    // 验证邮箱格式
    validateEmail(email) {
        return this.emailRegex.test(email);
    }

    // 验证用户名格式
    validateUsername(username) {
        return this.usernameRegex.test(username);
    }

    // 检查密码强度
    checkPasswordStrength(password) {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        strength = Object.values(checks).filter(Boolean).length;
        
        return {
            score: strength,
            checks: checks,
            level: strength < 2 ? 'weak' : strength < 4 ? 'medium' : 'strong'
        };
    }

    // 防抖验证用户名可用性（模拟）
    async checkUsernameAvailability(username) {
        return new Promise(resolve => {
            setTimeout(() => {
                // 模拟一些用户名已被占用
                const unavailableUsernames = ['admin', 'test', 'user', 'otherwise', 'demo'];
                resolve(!unavailableUsernames.includes(username.toLowerCase()));
            }, 800);
        });
    }

    // 模拟发送验证邮件
    async sendVerificationEmail(email) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`模拟发送验证邮件到: ${email}`);
                resolve(true);
            }, 1000);
        });
    }

    // 模拟发送密码重置邮件
    async sendPasswordResetEmail(email) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`模拟发送密码重置邮件到: ${email}`);
                resolve(true);
            }, 1000);
        });
    }

    // 显示字段验证错误
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const successElement = document.getElementById(fieldId + 'Success');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        if (successElement) {
            successElement.style.display = 'none';
        }
        
        // 添加字段边框颜色
        const inputElement = document.getElementById(fieldId);
        if (inputElement) {
            inputElement.style.borderColor = '#ef4444';
        }
    }

    // 显示字段验证成功
    showFieldSuccess(fieldId, message = '') {
        const errorElement = document.getElementById(fieldId + 'Error');
        const successElement = document.getElementById(fieldId + 'Success');
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        if (successElement && message) {
            successElement.textContent = message;
            successElement.style.display = 'block';
        }
        
        // 添加字段边框颜色
        const inputElement = document.getElementById(fieldId);
        if (inputElement) {
            inputElement.style.borderColor = '#10b981';
        }
    }

    // 清除字段验证状态
    clearFieldValidation(fieldId) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const successElement = document.getElementById(fieldId + 'Success');
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) errorElement.style.display = 'none';
        if (successElement) successElement.style.display = 'none';
        if (inputElement) {
            inputElement.style.borderColor = '';
        }
    }

    // 设置提交按钮状态
    setSubmitButtonState(loading = false) {
        const submitButton = document.getElementById('submitButton');
        const submitText = document.getElementById('submitText');
        const submitLoading = document.getElementById('submitLoading');
        
        if (loading) {
            submitButton.disabled = true;
            if (submitText) submitText.style.display = 'none';
            if (submitLoading) submitLoading.style.display = 'inline-block';
        } else {
            submitButton.disabled = false;
            if (submitText) submitText.style.display = 'inline-block';
            if (submitLoading) submitLoading.style.display = 'none';
        }
    }
}

// 注册页面认证逻辑
class RegisterAuth extends AuthManager {
    constructor() {
        super();
        this.validationState = {
            username: false,
            email: false,
            password: false,
            confirmPassword: false,
            userType: false,
            terms: false
        };
    }

    init() {
        this.bindEvents();
        this.initPasswordToggle();
    }

    bindEvents() {
        const form = document.getElementById('registerForm');
        const fields = ['username', 'email', 'password', 'confirmPassword', 'userType'];
        
        // 表单提交事件
        form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // 实时验证事件
        fields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('blur', () => this.validateField(fieldId));
                element.addEventListener('input', () => this.debounceValidation(fieldId));
            }
        });

        // Terms checkbox
        document.getElementById('agreeTerms').addEventListener('change', this.validateTerms.bind(this));

        // 密码强度实时检测
        document.getElementById('password').addEventListener('input', this.updatePasswordStrength.bind(this));
    }

    initPasswordToggle() {
        const toggleButton = document.getElementById('togglePassword');
        const passwordField = document.getElementById('password');
        
        toggleButton.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            toggleButton.querySelector('span').textContent = type === 'password' ? '👁️' : '🙈';
        });
    }

    debounceValidation(fieldId) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            if (fieldId === 'username') {
                this.validateUsernameWithAvailability();
            } else {
                this.validateField(fieldId);
            }
        }, 500);
    }

    async validateField(fieldId) {
        const element = document.getElementById(fieldId);
        const value = element.value.trim();

        switch (fieldId) {
            case 'username':
                return this.validateUsername(value);
            case 'email':
                return this.validateEmailField(value);
            case 'password':
                return this.validatePassword(value);
            case 'confirmPassword':
                return this.validateConfirmPassword(value);
            case 'userType':
                return this.validateUserType(value);
        }
    }

    validateUsername(username) {
        if (!username) {
            this.showFieldError('username', '请输入用户名');
            this.validationState.username = false;
            return false;
        }
        
        if (!super.validateUsername(username)) {
            this.showFieldError('username', '用户名只能包含字母、数字和下划线，长度3-20');
            this.validationState.username = false;
            return false;
        }
        
        this.clearFieldValidation('username');
        this.validationState.username = true;
        return true;
    }

    async validateUsernameWithAvailability() {
        const username = document.getElementById('username').value.trim();
        
        if (!this.validateUsername(username)) {
            return;
        }

        // 检查用户名可用性
        const isAvailable = await this.checkUsernameAvailability(username);
        if (isAvailable) {
            this.showFieldSuccess('username', '用户名可用');
        } else {
            this.showFieldError('username', '用户名已被占用');
            this.validationState.username = false;
        }
    }

    validateEmailField(email) {
        if (!email) {
            this.showFieldError('email', '请输入邮箱地址');
            this.validationState.email = false;
            return false;
        }
        
        if (!this.validateEmail(email)) {
            this.showFieldError('email', '请输入有效的邮箱地址');
            this.validationState.email = false;
            return false;
        }
        
        this.showFieldSuccess('email', '邮箱格式正确');
        this.validationState.email = true;
        return true;
    }

    validatePassword(password) {
        if (!password) {
            this.showFieldError('password', '请输入密码');
            this.validationState.password = false;
            return false;
        }
        
        const strength = this.checkPasswordStrength(password);
        if (strength.score < 3) {
            this.showFieldError('password', '密码强度不够，请包含大小写字母、数字');
            this.validationState.password = false;
            return false;
        }
        
        this.clearFieldValidation('password');
        this.validationState.password = true;
        return true;
    }

    validateConfirmPassword(confirmPassword) {
        const password = document.getElementById('password').value;
        
        if (!confirmPassword) {
            this.showFieldError('confirmPassword', '请再次输入密码');
            this.validationState.confirmPassword = false;
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showFieldError('confirmPassword', '两次输入的密码不一致');
            this.validationState.confirmPassword = false;
            return false;
        }
        
        this.showFieldSuccess('confirmPassword', '密码确认一致');
        this.validationState.confirmPassword = true;
        return true;
    }

    validateUserType(userType) {
        if (!userType) {
            this.showFieldError('userType', '请选择身份类型');
            this.validationState.userType = false;
            return false;
        }
        
        this.clearFieldValidation('userType');
        this.validationState.userType = true;
        return true;
    }

    validateTerms() {
        const checked = document.getElementById('agreeTerms').checked;
        if (!checked) {
            this.showFieldError('agreeTerms', '请同意服务条款和隐私政策');
            this.validationState.terms = false;
            return false;
        }
        
        this.clearFieldValidation('agreeTerms');
        this.validationState.terms = true;
        return true;
    }

    updatePasswordStrength() {
        const password = document.getElementById('password').value;
        const strength = this.checkPasswordStrength(password);
        
        // 更新强度指示器
        const indicators = [1, 2, 3, 4].map(i => document.getElementById(`strength${i}`));
        const strengthText = document.getElementById('strengthText');
        
        indicators.forEach((indicator, index) => {
            indicator.className = `h-1 w-6 rounded ${
                index < strength.score ? 
                (strength.level === 'weak' ? 'bg-red-500' : 
                 strength.level === 'medium' ? 'bg-yellow-500' : 'bg-green-500') 
                : 'bg-gray-200'
            }`;
        });
        
        const strengthTexts = {
            0: '请输入密码',
            1: '密码强度：弱',
            2: '密码强度：弱',
            3: '密码强度：中等',
            4: '密码强度：强',
            5: '密码强度：很强'
        };
        
        strengthText.textContent = strengthTexts[strength.score] || '请输入密码';
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // 验证所有字段
        const validations = await Promise.all([
            this.validateField('username'),
            this.validateField('email'),
            this.validateField('password'),
            this.validateField('confirmPassword'),
            this.validateField('userType'),
            this.validateTerms()
        ]);
        
        if (!validations.every(Boolean)) {
            window.otherwiseApp.showMessage('请检查表单中的错误信息', 'error');
            return;
        }
        
        this.setSubmitButtonState(true);
        
        try {
            // 模拟注册请求
            await this.performRegistration();
            
            window.otherwiseApp.showMessage('注册成功！正在跳转到登录页面...', 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            window.otherwiseApp.showMessage('注册失败，请重试', 'error');
        } finally {
            this.setSubmitButtonState(false);
        }
    }

    async performRegistration() {
        const formData = {
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            userType: document.getElementById('userType').value,
            organization: document.getElementById('organization').value.trim(),
            researchField: document.getElementById('researchField').value.trim(),
            password: document.getElementById('password').value
        };

        // 模拟 API 请求延迟
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 保存用户信息到 localStorage (仅用于演示)
        const userData = {
            ...formData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            verified: false
        };
        
        localStorage.setItem(`user_${formData.email}`, JSON.stringify(userData));
        
        // 发送验证邮件(模拟)
        await this.sendVerificationEmail(formData.email);
        
        return userData;
    }
}

// 登录页面认证逻辑
class LoginAuth extends AuthManager {
    constructor() {
        super();
        this.maxAttempts = 5;
        this.attemptCount = 0;
    }

    init() {
        this.bindEvents();
        this.initPasswordToggle();
        this.checkRememberMe();
    }

    bindEvents() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // 实时验证
        document.getElementById('loginIdentifier').addEventListener('blur', this.validateIdentifier.bind(this));
        document.getElementById('password').addEventListener('blur', this.validatePassword.bind(this));
        
        // 忘记密码表单
        const forgotForm = document.getElementById('forgotPasswordForm');
        if (forgotForm) {
            forgotForm.addEventListener('submit', this.handleForgotPassword.bind(this));
        }
    }

    initPasswordToggle() {
        const toggleButton = document.getElementById('togglePassword');
        const passwordField = document.getElementById('password');
        
        toggleButton.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            toggleButton.querySelector('span').textContent = type === 'password' ? '👁️' : '🙈';
        });
    }

    checkRememberMe() {
        const remembered = localStorage.getItem('rememberedUser');
        if (remembered) {
            const userData = JSON.parse(remembered);
            document.getElementById('loginIdentifier').value = userData.identifier;
            document.getElementById('rememberMe').checked = true;
        }
    }

    validateIdentifier() {
        const identifier = document.getElementById('loginIdentifier').value.trim();
        if (!identifier) {
            this.showFieldError('loginIdentifier', '请输入用户名或邮箱');
            return false;
        }
        
        this.clearFieldValidation('loginIdentifier');
        return true;
    }

    validatePassword() {
        const password = document.getElementById('password').value.trim();
        if (!password) {
            this.showFieldError('password', '请输入密码');
            return false;
        }
        
        this.clearFieldValidation('password');
        return true;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateIdentifier() || !this.validatePassword()) {
            return;
        }

        if (this.attemptCount >= this.maxAttempts) {
            this.showLoginError('登录尝试次数过多，请稍后再试');
            return;
        }

        this.setSubmitButtonState(true);
        this.hideLoginError();

        try {
            const loginData = {
                identifier: document.getElementById('loginIdentifier').value.trim(),
                password: document.getElementById('password').value.trim(),
                rememberMe: document.getElementById('rememberMe').checked
            };

            const result = await this.performLogin(loginData);
            
            if (result.success) {
                // 保存登录状态
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', result.user.username);
                localStorage.setItem('currentUser', JSON.stringify(result.user));
                
                if (loginData.rememberMe) {
                    localStorage.setItem('rememberedUser', JSON.stringify({
                        identifier: loginData.identifier
                    }));
                } else {
                    localStorage.removeItem('rememberedUser');
                }
                
                window.otherwiseApp.currentUser = {
                    ...result.user,
                    isLoggedIn: true
                };
                
                window.otherwiseApp.showMessage('登录成功！', 'success');
                
                // 更新导航状态
                if (window.navigation) {
                    window.navigation.updateUserStatus();
                }
                
                setTimeout(() => {
                    // 根据 URL 参数决定跳转位置
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect') || 'profile.html';
                    window.location.href = redirect;
                }, 1500);
                
            } else {
                this.attemptCount++;
                this.showLoginError(result.message || '登录失败，请检查用户名和密码');
            }
            
        } catch (error) {
            this.showLoginError('登录过程中出现错误，请重试');
        } finally {
            this.setSubmitButtonState(false);
        }
    }

    async performLogin(loginData) {
        // 模拟 API 请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 在 localStorage 中查找用户
        const users = this.getAllUsers();
        const user = users.find(u => 
            (u.username === loginData.identifier || u.email === loginData.identifier)
            && u.password === loginData.password
        );

        if (user) {
            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    userType: user.userType,
                    organization: user.organization,
                    researchField: user.researchField
                }
            };
        } else {
            return {
                success: false,
                message: '用户名或密码错误'
            };
        }
    }

    getAllUsers() {
        const users = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('user_')) {
                try {
                    const userData = JSON.parse(localStorage.getItem(key));
                    users.push(userData);
                } catch (e) {
                    // 忽略无效数据
                }
            }
        }
        return users;
    }

    showLoginError(message) {
        const errorAlert = document.getElementById('loginErrorAlert');
        const errorMessage = document.getElementById('loginErrorMessage');
        
        if (errorMessage) errorMessage.textContent = message;
        if (errorAlert) errorAlert.style.display = 'block';
    }

    hideLoginError() {
        const errorAlert = document.getElementById('loginErrorAlert');
        if (errorAlert) errorAlert.style.display = 'none';
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        
        const email = document.getElementById('resetEmail').value.trim();
        if (!email) {
            this.showFieldError('resetEmail', '请输入邮箱地址');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showFieldError('resetEmail', '请输入有效的邮箱地址');
            return;
        }
        
        try {
            await this.sendPasswordResetEmail(email);
            window.otherwiseApp.showMessage('密码重置邮件已发送，请查收', 'success');
            closeForgotPasswordModal();
        } catch (error) {
            this.showFieldError('resetEmail', '发送失败，请重试');
        }
    }
}


