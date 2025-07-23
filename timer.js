/**
 * 20-20-20护眼定时器 JavaScript 逻辑
 * 实现定时器核心功能、用户界面交互和数据管理
 */

class EyeCareTimer {
    constructor() {
        // 定时器状态
        this.isRunning = false;
        this.isPaused = false;
        this.currentPhase = 'work'; // 'work' 或 'rest'
        this.currentRound = 1;
        this.timeRemaining = 0;
        this.timerInterval = null;

        // 用户设置
        this.settings = {
            workTime: 20, // 分钟
            restTime: 20, // 秒
            autoNextRound: true, // 自动开始下一阶段
            soundEnabled: true,
            systemNotificationEnabled: true,
            restTickSoundEnabled: true // 休息时嘀嗒声
        };

        // 嘀嗒声相关
        this.tickInterval = null;
        this.audioContext = null;

        // 统计数据
        this.stats = {
            completedRounds: 0,
            totalWorkTime: 0, // 分钟
            totalRestTime: 0 // 秒
        };

        // DOM 元素引用
        this.initElements();

        // 初始化
        this.init();
    }

    /**
     * 初始化 DOM 元素引用
     */
    initElements() {
        // 基础元素
        this.statusDot = document.querySelector('.status-dot');
        this.statusText = document.querySelector('.status-text');
        this.roundNumber = document.querySelector('.round-number');

        // 时间显示
        this.minutesDisplay = document.querySelector('.minutes');
        this.secondsDisplay = document.querySelector('.seconds');
        this.phaseLabel = document.querySelector('.phase-label');
        this.progressRing = document.querySelector('.progress-ring-progress');

        // 控制按钮
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.skipBtn = document.getElementById('skipBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // 备注输入
        this.noteInput = document.getElementById('noteInput');

        // 统计显示
        this.completedRoundsDisplay = document.getElementById('completedRounds');
        this.totalWorkTimeDisplay = document.getElementById('totalWorkTime');
        this.totalRestTimeDisplay = document.getElementById('totalRestTime');
        this.currentStatusDisplay = document.getElementById('currentStatus');

        // 设置面板
        this.settingsPanel = document.getElementById('settingsPanel');
        this.workTimeSlider = document.getElementById('workTimeSlider');
        this.restTimeSlider = document.getElementById('restTimeSlider');
        this.workTimeValue = document.getElementById('workTimeValue');
        this.restTimeValue = document.getElementById('restTimeValue');
        this.autoNextRoundCheckbox = document.getElementById('autoNextRound');
        this.soundEnabledCheckbox = document.getElementById('soundEnabled');
        this.restTickSoundCheckbox = document.getElementById('restTickSoundEnabled');
        this.systemNotificationCheckbox = document.getElementById('systemNotificationEnabled');
        this.notificationStatus = document.getElementById('notificationStatus');
        this.testNotificationBtn = document.getElementById('testNotificationBtn');
        this.testTickSoundBtn = document.getElementById('testTickSoundBtn');
        this.audioDebugBtn = document.getElementById('audioDebugBtn');
        this.audioDebugInfo = document.getElementById('audioDebugInfo');
        this.sendNotificationBtn = document.getElementById('sendNotificationBtn');

        // 工具按钮
        this.settingsBtn = document.getElementById('settingsBtn');
        this.themeBtn = document.getElementById('themeBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.resetStatsBtn = document.getElementById('resetStatsBtn');

        // 通知
        this.notification = document.getElementById('notification');
    }

    /**
     * 初始化定时器
     */
    init() {
        // 加载保存的数据
        this.loadSettings();
        this.loadStats();

        // 请求通知权限
        this.requestNotificationPermission();

        // 设置初始状态
        this.resetTimer();

        // 绑定事件监听器
        this.bindEvents();

        // 初始化进度环
        this.initProgressRing();

        // 更新显示
        this.updateDisplay();
        this.updateStats();
        this.updateCurrentStatus();

        console.log('20-20-20护眼定时器初始化完成');
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 控制按钮事件
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.skipBtn.addEventListener('click', () => this.skipCurrentPhase());
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        // 设置相关事件 - 增强移动端兼容性
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('设置按钮被点击');
                this.showSettings();
            });
            // 添加触摸事件支持
            this.settingsBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                console.log('设置按钮被触摸');
                this.showSettings();
            });
        } else {
            console.error('❌ 设置按钮未找到');
        }

        this.closeSettingsBtn.addEventListener('click', () => this.hideSettings());
        this.resetStatsBtn.addEventListener('click', () => this.resetStats());
        this.testNotificationBtn.addEventListener('click', () => this.testSystemNotification());
        this.testTickSoundBtn.addEventListener('click', () => this.testTickSound());
        this.audioDebugBtn.addEventListener('click', () => this.runAudioDiagnostics());
        this.sendNotificationBtn.addEventListener('click', () => this.sendManualNotification());

        // 滑块事件
        this.workTimeSlider.addEventListener('input', (e) => {
            this.settings.workTime = parseInt(e.target.value);
            this.workTimeValue.textContent = this.settings.workTime;
            this.saveSettings();
            if (!this.isRunning) this.resetTimer();
        });

        this.restTimeSlider.addEventListener('input', (e) => {
            this.settings.restTime = parseInt(e.target.value);
            this.restTimeValue.textContent = this.settings.restTime;
            this.saveSettings();
            if (!this.isRunning) this.resetTimer();
        });

        // 复选框事件
        this.autoNextRoundCheckbox.addEventListener('change', (e) => {
            this.settings.autoNextRound = e.target.checked;
            this.saveSettings();
        });

        this.soundEnabledCheckbox.addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
            this.saveSettings();
        });

        this.restTickSoundCheckbox.addEventListener('change', (e) => {
            this.settings.restTickSoundEnabled = e.target.checked;
            this.saveSettings();
            // 如果当前在休息且正在运行，立即应用设置
            if (this.isRunning && this.currentPhase === 'rest') {
                if (e.target.checked) {
                    this.startTickSound();
                } else {
                    this.stopTickSound();
                }
            }
        });

        this.systemNotificationCheckbox.addEventListener('change', (e) => {
            this.settings.systemNotificationEnabled = e.target.checked;
            this.saveSettings();
            if (e.target.checked) {
                this.requestNotificationPermission();
            }
        });

        // 通知状态点击事件
        this.notificationStatus.addEventListener('click', () => {
            this.requestNotificationPermission();
        });

        // 主题切换 - 增强移动端支持
        if (this.themeBtn) {
            this.themeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
            this.themeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }

        // 全屏切换 - 增强移动端支持
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFullscreen();
            });
            this.fullscreenBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.toggleFullscreen();
            });
        }

        // 备注输入事件
        this.noteInput.addEventListener('blur', () => this.saveNote());
        this.noteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.noteInput.blur();
            }
        });

        // 点击设置面板外部关闭
        this.settingsPanel.addEventListener('click', (e) => {
            if (e.target === this.settingsPanel) {
                this.hideSettings();
            }
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input')) {
                e.preventDefault();
                if (!this.isRunning) {
                    this.startTimer();
                } else {
                    this.pauseTimer();
                }
            } else if (e.code === 'KeyR' && e.ctrlKey) {
                e.preventDefault();
                this.resetTimer();
            }
        });
    }

    /**
     * 初始化进度环
     */
    initProgressRing() {
        const radius = this.progressRing.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        this.progressRing.style.strokeDasharray = circumference;
        this.progressRing.style.strokeDashoffset = circumference;

        this.circumference = circumference;
    }

    /**
     * 更新进度环
     */
    updateProgressRing() {
        const totalTime = this.currentPhase === 'work'
            ? this.settings.workTime * 60
            : this.settings.restTime;

        const progress = (totalTime - this.timeRemaining) / totalTime;
        const offset = this.circumference * (1 - progress);

        this.progressRing.style.strokeDashoffset = offset;

        // 更新进度环颜色
        if (this.currentPhase === 'rest') {
            this.progressRing.classList.add('resting');
        } else {
            this.progressRing.classList.remove('resting');
        }
    }

    /**
     * 开始定时器
     */
    startTimer() {
        // 在用户首次交互时初始化音频上下文
        if (!this.audioContext) {
            this.initAudioContext();
        }

        if (this.isPaused) {
            // 恢复暂停的定时器
            this.isPaused = false;
            this.isRunning = true;
        } else {
            // 开始新的计时
            this.isRunning = true;
            this.isPaused = false;

            // 设置时间
            if (this.currentPhase === 'work') {
                this.timeRemaining = this.settings.workTime * 60;
            } else {
                this.timeRemaining = this.settings.restTime;
            }
        }

        // 开始计时循环
        this.timerInterval = setInterval(() => {
            this.tick();
        }, 1000);

        // 如果是休息阶段，开始嘀嗒声
        if (this.currentPhase === 'rest' && this.settings.restTickSoundEnabled) {
            this.startTickSound();
        }

        // 更新UI
        this.updateControlButtons();
        this.updateStatusIndicator();
        this.updateBodyClass();

        this.showNotification('定时器已开始', 'info');
    }

    /**
     * 暂停定时器
     */
    pauseTimer() {
        this.isPaused = true;
        this.isRunning = false;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // 停止嘀嗒声
        this.stopTickSound();

        // 更新UI
        this.updateControlButtons();
        this.updateStatusIndicator();
        this.updateBodyClass();

        this.showNotification('定时器已暂停', 'warning');
    }

    /**
     * 重置定时器
     */
    resetTimer() {
        // 清除计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // 停止嘀嗒声
        this.stopTickSound();

        // 重置状态
        this.isRunning = false;
        this.isPaused = false;
        this.currentPhase = 'work';
        this.timeRemaining = this.settings.workTime * 60;

        // 清空备注
        this.noteInput.value = '';

        // 更新UI
        this.updateDisplay();
        this.updateControlButtons();
        this.updateStatusIndicator();
        this.updateProgressRing();
        this.updateBodyClass();
        this.updateCurrentStatus();

        this.showNotification('定时器已重置', 'info');
    }

    /**
     * 定时器节拍
     */
    tick() {
        this.timeRemaining--;

        // 更新显示
        this.updateDisplay();
        this.updateProgressRing();

        // 检查是否完成当前阶段
        if (this.timeRemaining <= 0) {
            this.completePhase();
        }
    }

    /**
     * 完成当前阶段
     */
    completePhase() {
        // 清除当前计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // 播放提示音
        this.playNotificationSound();

        // 添加完成动画
        document.querySelector('.time-circle').classList.add('completion-animation');
        setTimeout(() => {
            document.querySelector('.time-circle').classList.remove('completion-animation');
        }, 600);

        if (this.currentPhase === 'work') {
            // 工作阶段完成，提醒休息
            this.currentPhase = 'rest';
            this.timeRemaining = this.settings.restTime;

            // 更新统计
            this.stats.totalWorkTime += this.settings.workTime;
            this.updateStats();
            this.saveStats();

            const restMessage = '工作时间结束！要休息了，保护一下眼睛👀';
            this.showNotification(restMessage, 'success');
            this.sendSystemNotification('该休息了！', `工作${this.settings.workTime}分钟已完成，现在休息${this.settings.restTime}秒`, '😌');

            // 自动开始休息倒计时
            if (this.settings.autoNextRound) {
                setTimeout(() => {
                    this.startTimer(); // 这里会自动处理嘀嗒声
                }, 1000);
            } else {
                this.isRunning = false;
            }

        } else {
            // 休息阶段完成，停止嘀嗒声，提醒继续工作
            this.stopTickSound();

            this.currentPhase = 'work';
            this.timeRemaining = this.settings.workTime * 60;

            // 更新统计
            this.stats.completedRounds++;
            this.stats.totalRestTime += this.settings.restTime;
            this.updateStats();
            this.saveStats();

            // 保存备注（如果有的话）
            this.saveNote();

            const workMessage = '休息时间结束！继续工作吧，专注投入💪';
            this.showNotification(workMessage, 'info');
            this.sendSystemNotification('继续工作吧！', `休息${this.settings.restTime}秒已完成，开始工作${this.settings.workTime}分钟`, '💼');

            // 准备下一轮工作
            this.currentRound++;
            this.noteInput.value = '';

            // 自动开始工作倒计时
            if (this.settings.autoNextRound) {
                setTimeout(() => {
                    this.startTimer();
                }, 1000);
            } else {
                this.isRunning = false;
            }
        }

        // 更新UI
        this.updateDisplay();
        this.updateControlButtons();
        this.updateStatusIndicator();
        this.updateProgressRing();
        this.updateBodyClass();
    }

    /**
     * 完成一轮
     */
    completeRound() {
        // 更新统计
        this.stats.completedRounds++;
        this.stats.totalRestTime += this.settings.restTime;
        this.updateStats();
        this.saveStats();

        // 保存备注
        this.saveNote();

        const message = `第 ${this.currentRound} 轮完成！`;
        this.showNotification(message, 'success');

        let notificationMessage = message;

        // 根据工作模式显示不同的完成信息
        if (this.settings.workMode === 'rounds') {
            // 轮数模式：检查是否达成目标
            if (this.stats.completedRounds >= this.settings.targetRounds) {
                const goalMessage = `🎉 恭喜！今日目标 ${this.settings.targetRounds} 轮已完成！`;
                this.showNotification(goalMessage, 'success');
                this.sendSystemNotification('目标达成！', goalMessage, '🎯✅');
            } else {
                const remainingRounds = this.settings.targetRounds - this.stats.completedRounds;
                const progressMessage = `还需完成 ${remainingRounds} 轮达成今日目标`;
                notificationMessage = `${message} ${progressMessage}`;
                this.sendSystemNotification('轮次完成', notificationMessage, '✅📊');
            }
        } else {
            // 时间循环模式：显示循环进度
            const cycleMessage = `时间循环模式 | 今日已完成 ${this.stats.completedRounds} 轮`;
            notificationMessage = `${message} ${cycleMessage}`;
            this.sendSystemNotification('轮次完成', notificationMessage, '🔄✅');
        }

        // 准备下一轮
        this.currentRound++;
        this.currentPhase = 'work';
        this.timeRemaining = this.settings.workTime * 60;
        this.noteInput.value = '';

        // 是否自动开始下一轮
        if (this.shouldAutoStart()) {
            setTimeout(() => {
                this.startTimer();
            }, 2000);
        } else {
            this.isRunning = false;
        }
    }

    /**
     * 更新显示
     */
    updateDisplay() {
        let minutes, seconds;

        if (this.currentPhase === 'work') {
            minutes = Math.floor(this.timeRemaining / 60);
            seconds = this.timeRemaining % 60;
        } else {
            minutes = 0;
            seconds = this.timeRemaining;
        }

        // 更新时间显示
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');

        // 更新阶段标签
        if (this.currentPhase === 'work') {
            this.phaseLabel.textContent = '工作时间';
        } else {
            const tickIndicator = (this.settings.restTickSoundEnabled && this.isRunning) ? ' 🕰️' : '';
            this.phaseLabel.textContent = '休息时间' + tickIndicator;
        }

        // 更新轮数显示
        this.roundNumber.textContent = this.currentRound;
    }

    /**
     * 更新控制按钮状态
     */
    updateControlButtons() {
        if (this.isRunning) {
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.skipBtn.disabled = false;
            this.startBtn.style.display = 'none';
            this.pauseBtn.style.display = 'flex';
        } else if (this.isPaused) {
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.skipBtn.disabled = false;
            this.startBtn.style.display = 'flex';
            this.pauseBtn.style.display = 'none';
            this.startBtn.querySelector('.btn-text').textContent = '继续';
        } else {
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.skipBtn.disabled = true;
            this.startBtn.style.display = 'flex';
            this.pauseBtn.style.display = 'none';
            this.startBtn.querySelector('.btn-text').textContent = '开始';
        }
    }

    /**
     * 更新状态指示器
     */
    updateStatusIndicator() {
        // 更新状态点
        this.statusDot.className = 'status-dot';
        if (this.isRunning) {
            this.statusDot.classList.add(this.currentPhase === 'work' ? 'working' : 'resting');
        } else if (this.isPaused) {
            this.statusDot.classList.add('paused');
        }

        // 更新状态文本
        if (this.isRunning) {
            this.statusText.textContent = this.currentPhase === 'work' ? '工作中...' : '休息中...';
        } else if (this.isPaused) {
            this.statusText.textContent = '已暂停';
        } else {
            this.statusText.textContent = '准备开始';
        }
    }

    /**
     * 更新页面主题类
     */
    updateBodyClass() {
        document.body.className = '';

        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.add('dark-theme');
        }

        if (this.isRunning) {
            document.body.classList.add(this.currentPhase);
        } else if (this.isPaused) {
            document.body.classList.add('paused');
        }
    }

    /**
     * 更新统计显示
     */
    updateStats() {
        this.completedRoundsDisplay.textContent = this.stats.completedRounds;
        this.totalWorkTimeDisplay.textContent = this.stats.totalWorkTime;
        this.totalRestTimeDisplay.textContent = this.stats.totalRestTime;

        // 更新当前状态显示
        this.updateCurrentStatus();
    }

    /**
     * 更新当前状态显示
     */
    updateCurrentStatus() {
        const statusDisplay = this.currentStatusDisplay;
        statusDisplay.className = 'stat-number';

        if (this.isRunning) {
            if (this.currentPhase === 'work') {
                statusDisplay.textContent = '💼';
                statusDisplay.title = '正在工作中';
            } else {
                statusDisplay.textContent = '😌';
                statusDisplay.title = '正在休息中';
            }
        } else if (this.isPaused) {
            statusDisplay.textContent = '⏸️';
            statusDisplay.title = '已暂停';
        } else {
            statusDisplay.textContent = '⏰';
            statusDisplay.title = '待启动';
        }
    }

    /**
     * 播放提示音
     */
    playNotificationSound() {
        if (!this.settings.soundEnabled) return;

        // 确保音频上下文已激活
        this.ensureAudioContextActive().then(audioReady => {
            if (!audioReady) return;

            try {
                // 使用 Web Audio API 生成简单的提示音
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                // 设置音频参数
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.5);

                console.log('🔔 提示音已播放');
            } catch (error) {
                console.log('❌ 无法播放提示音:', error);
            }
        });
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        const notificationText = this.notification.querySelector('.notification-text');

        notificationText.textContent = message;
        this.notification.className = `notification ${type} show`;

        // 自动隐藏
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }

    /**
     * 显示设置面板
     */
    showSettings() {
        // 更新设置面板的值
        this.workTimeSlider.value = this.settings.workTime;
        this.restTimeSlider.value = this.settings.restTime;
        this.workTimeValue.textContent = this.settings.workTime;
        this.restTimeValue.textContent = this.settings.restTime;
        this.autoNextRoundCheckbox.checked = this.settings.autoNextRound;
        this.soundEnabledCheckbox.checked = this.settings.soundEnabled;
        this.restTickSoundCheckbox.checked = this.settings.restTickSoundEnabled;
        this.systemNotificationCheckbox.checked = this.settings.systemNotificationEnabled;

        // 更新通知状态显示
        this.updateNotificationStatus();

        this.settingsPanel.classList.add('show');
    }

    /**
     * 隐藏设置面板
     */
    hideSettings() {
        this.settingsPanel.classList.remove('show');
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        document.body.classList.toggle('dark-theme');

        // 更新主题按钮图标
        const isDark = document.body.classList.contains('dark-theme');
        this.themeBtn.querySelector('.tool-icon').textContent = isDark ? '☀️' : '🌙';

        // 保存主题设置
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    /**
     * 切换全屏
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('无法进入全屏模式:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * 保存备注
     */
    saveNote() {
        const note = this.noteInput.value.trim();
        if (note) {
            const notes = this.loadNotes();
            const timestamp = new Date().toLocaleString();
            notes.push({
                round: this.currentRound,
                phase: this.currentPhase,
                note: note,
                timestamp: timestamp
            });
            localStorage.setItem('eyeCareNotes', JSON.stringify(notes));
        }
    }

    /**
     * 加载备注
     */
    loadNotes() {
        try {
            const notes = localStorage.getItem('eyeCareNotes');
            return notes ? JSON.parse(notes) : [];
        } catch (error) {
            console.log('加载备注失败:', error);
            return [];
        }
    }

    /**
     * 初始化音频上下文（需要用户手势）
     */
    initAudioContext() {
        if (this.audioContext) {
            return true;
        }

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎵 音频上下文已创建');

            // 某些浏览器需要用户手势才能激活音频上下文
            if (this.audioContext.state === 'suspended') {
                console.log('🔄 音频上下文被挂起，尝试恢复...');
                this.audioContext.resume().then(() => {
                    console.log('✅ 音频上下文已激活');
                }).catch(error => {
                    console.log('❌ 音频上下文激活失败:', error);
                });
            }

            return true;
        } catch (error) {
            console.log('❌ 无法创建音频上下文:', error);
            this.audioContext = null;
            return false;
        }
    }

    /**
     * 确保音频上下文处于激活状态
     */
    async ensureAudioContextActive() {
        if (!this.audioContext) {
            if (!this.initAudioContext()) {
                return false;
            }
        }

        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('✅ 音频上下文已恢复');
                return true;
            } catch (error) {
                console.log('❌ 音频上下文恢复失败:', error);
                return false;
            }
        }

        return this.audioContext.state === 'running';
    }

    /**
     * 生成嘀嗒声
     */
    async playTickSound() {
        if (!this.settings.soundEnabled || !this.settings.restTickSoundEnabled) {
            return;
        }

        // 确保音频上下文激活
        const audioReady = await this.ensureAudioContextActive();
        if (!audioReady) {
            console.log('⚠️ 音频上下文未就绪，跳过嘀嗒声');
            return;
        }

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // 设置更清晰的嘀嗒声参数
            oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.05);

            // 增加音量并优化包络
            gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);

            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.25);

            // 添加控制台日志来确认播放
            console.log('🔔 嘀嗒声已播放 - 音频上下文状态:', this.audioContext.state);
        } catch (error) {
            console.log('❌ 无法播放嘀嗒声:', error);
        }
    }

    /**
     * 运行音频诊断
     */
    async runAudioDiagnostics() {
        console.log('🔍 开始音频诊断...');

        const debugInfo = [];
        let hasIssues = false;

        // 1. 检查Web Audio API支持
        if (!window.AudioContext && !window.webkitAudioContext) {
            debugInfo.push('❌ 浏览器不支持Web Audio API');
            hasIssues = true;
        } else {
            debugInfo.push('✅ 浏览器支持Web Audio API');
        }

        // 2. 检查音频上下文状态
        try {
            if (!this.audioContext) {
                this.initAudioContext();
            }

            if (this.audioContext) {
                debugInfo.push(`🎵 音频上下文状态: ${this.audioContext.state}`);

                if (this.audioContext.state === 'suspended') {
                    debugInfo.push('⚠️ 音频上下文被挂起，尝试激活...');
                    await this.audioContext.resume();
                    debugInfo.push(`🔄 激活后状态: ${this.audioContext.state}`);
                }
            } else {
                debugInfo.push('❌ 无法创建音频上下文');
                hasIssues = true;
            }
        } catch (error) {
            debugInfo.push(`❌ 音频上下文错误: ${error.message}`);
            hasIssues = true;
        }

        // 3. 检查浏览器信息
        const userAgent = navigator.userAgent;
        const isChrome = /Chrome/.test(userAgent);
        const isEdge = /Edg/.test(userAgent);
        const isSafari = /Safari/.test(userAgent) && !isChrome && !isEdge;
        const isFirefox = /Firefox/.test(userAgent);

        debugInfo.push(`🌐 浏览器: ${isChrome ? 'Chrome' : isEdge ? 'Edge' : isSafari ? 'Safari' : isFirefox ? 'Firefox' : '其他'}`);

        // 4. 检查HTTPS
        const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
        if (!isSecure) {
            debugInfo.push('⚠️ 非HTTPS环境，可能影响音频功能');
            hasIssues = true;
        } else {
            debugInfo.push('✅ 安全连接 (HTTPS)');
        }

        // 5. 尝试播放测试音频
        try {
            debugInfo.push('🔊 尝试播放测试音频...');
            await this.playTestBeep();
            debugInfo.push('✅ 测试音频播放成功');
        } catch (error) {
            debugInfo.push(`❌ 测试音频播放失败: ${error.message}`);
            hasIssues = true;
        }

        // 显示诊断结果
        this.audioDebugInfo.innerHTML = debugInfo.join('<br>');

        // 如果有问题，显示解决方案
        if (hasIssues) {
            this.showAudioTroubleshooting();
        } else {
            alert('🎉 音频诊断完成！没有发现问题。如果仍然听不到声音，请检查系统音量设置。');
        }
    }

    /**
     * 播放测试哔声
     */
    async playTestBeep() {
        return new Promise((resolve, reject) => {
            try {
                if (!this.audioContext || this.audioContext.state !== 'running') {
                    reject(new Error('音频上下文未激活'));
                    return;
                }

                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                // 播放一个更明显的测试音
                oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5音符
                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);

                oscillator.onended = () => resolve();

                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 1);

                console.log('🔔 测试哔声已播放');
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 显示音频故障排除指导
     */
    showAudioTroubleshooting() {
        const troubleShootingMessage = `
🔧 音频故障排除指导：

📊 系统设置检查：
1. 检查系统音量是否开启且足够大
2. 检查音频输出设备是否正确
3. 确认没有其他应用占用音频

🌐 Chrome浏览器设置：
1. 地址栏输入：chrome://settings/content/sound
2. 确保"网站可以播放声音"已开启
3. 检查此网站是否在"禁止播放声音"列表中

🔒 网站权限检查：
1. 点击地址栏左侧的🔒图标
2. 确保"声音"权限设为"允许"
3. 刷新页面后重新测试

🖥️ Windows系统检查：
1. 右键点击系统托盘音量图标
2. 选择"打开音量混合器"
3. 确保Chrome音量没有被静音

🍎 Mac系统检查：
1. 系统偏好设置 → 声音 → 输出
2. 确保选择了正确的输出设备
3. 检查输出音量设置

💡 其他建议：
- 尝试重启浏览器
- 尝试在其他网站播放音频测试
- 检查耳机/音响连接是否正常
- 尝试使用无痕模式测试

当前网址：${window.location.href}
        `;

        alert(troubleShootingMessage);
    }
    async testTickSound() {
        console.log('🧪 测试嘀嗒声功能');

        // 先初始化音频上下文
        if (!this.initAudioContext()) {
            alert('您的浏览器不支持音频播放功能');
            return;
        }

        // 激活音频上下文（需要用户手势）
        await this.ensureAudioContextActive();

        // 播放测试嘀嗒声
        const originalSoundSetting = this.settings.soundEnabled;
        const originalTickSetting = this.settings.restTickSoundEnabled;

        // 临时启用声音
        this.settings.soundEnabled = true;
        this.settings.restTickSoundEnabled = true;

        await this.playTickSound();

        // 恢复原设置
        this.settings.soundEnabled = originalSoundSetting;
        this.settings.restTickSoundEnabled = originalTickSetting;

        this.showNotification('🔔 嘀嗒声测试完成', 'info');
    }

    /**
     * 开始嘀嗒声循环
     */
    async startTickSound() {
        if (!this.settings.restTickSoundEnabled || this.tickInterval) {
            return;
        }

        console.log('🕰️ 开始播放休息嘀嗒声');

        // 确保音频上下文已准备
        await this.ensureAudioContextActive();

        // 立即播放一次嘀嗒声
        await this.playTickSound();

        // 每秒播放一次嘀嗒声
        this.tickInterval = setInterval(async () => {
            await this.playTickSound();
        }, 1000);
    }

    /**
     * 停止嘀嗒声循环
     */
    stopTickSound() {
        if (this.tickInterval) {
            console.log('🔇 停止休息嘀嗒声');
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }
    }
    skipCurrentPhase() {
        console.log('skipCurrentPhase 被调用'); // 调试用
        console.log('当前状态:', { isRunning: this.isRunning, isPaused: this.isPaused, phase: this.currentPhase });

        if (!this.isRunning && !this.isPaused) {
            this.showNotification('请先启动定时器再使用跳过功能', 'warning');
            return;
        }

        const currentPhaseText = this.currentPhase === 'work' ? '工作时间' : '休息时间';
        const nextPhaseText = this.currentPhase === 'work' ? '休息时间' : '工作时间';
        const confirmMessage = `确定要跳过当前${currentPhaseText}，直接进入${nextPhaseText}吗？`;

        console.log('显示确认对话框:', confirmMessage); // 调试用

        if (confirm(confirmMessage)) {
            console.log('用户确认跳过，执行 completePhase'); // 调试用
            // 直接完成当前阶段，进入下一阶段
            this.completePhase();
            this.showNotification(`已跳过${currentPhaseText}`, 'info');
        } else {
            console.log('用户取消跳过'); // 调试用
        }
    }

    /**
     * 重置统计数据
     */
    resetStats() {
        if (confirm('确定要重置今日所有数据吗？此操作不可撤销。')) {
            this.stats = {
                completedRounds: 0,
                totalWorkTime: 0,
                totalRestTime: 0
            };

            // 清除本地存储
            localStorage.removeItem('eyeCareStats');
            localStorage.removeItem('eyeCareNotes');

            // 更新显示
            this.updateStats();

            this.showNotification('今日数据已重置', 'info');
            this.hideSettings();
        }
    }

    /**
     * 保存设置
     */
    saveSettings() {
        localStorage.setItem('eyeCareSettings', JSON.stringify(this.settings));
    }

    /**
     * 加载设置
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('eyeCareSettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.log('加载设置失败:', error);
        }

        // 加载主题设置
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            this.themeBtn.querySelector('.tool-icon').textContent = '☀️';
        }
    }

    /**
     * 保存统计数据
     */
    saveStats() {
        localStorage.setItem('eyeCareStats', JSON.stringify(this.stats));
    }

    /**
     * 加载统计数据
     */
    loadStats() {
        try {
            const saved = localStorage.getItem('eyeCareStats');
            if (saved) {
                this.stats = { ...this.stats, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.log('加载统计数据失败:', error);
        }
    }
}

// DOM 加载完成后初始化定时器
document.addEventListener('DOMContentLoaded', () => {
    window.eyeCareTimer = new EyeCareTimer();
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
    if (window.eyeCareTimer) {
        if (document.hidden) {
            // 页面隐藏时保存状态
            console.log('页面隐藏，保存定时器状态');
        } else {
            // 页面可见时检查状态
            console.log('页面可见，检查定时器状态');
        }
    }
});

// 页面卸载前保存数据
window.addEventListener('beforeunload', () => {
    if (window.eyeCareTimer) {
        // 清理嘀嗒声
        window.eyeCareTimer.stopTickSound();
        // 保存数据
        window.eyeCareTimer.saveSettings();
        window.eyeCareTimer.saveStats();
    }
});

// 扩展 EyeCareTimer 类的新方法
EyeCareTimer.prototype.requestNotificationPermission = async function() {
    console.log('=== 开始请求通知权限 ===');

    // 检查基础支持
    if (!('Notification' in window)) {
        console.log('❌ 此浏览器不支持系统通知');
        this.updateNotificationStatus('不支持');
        alert('您的浏览器不支持系统通知功能');
        return false;
    }

    // 检查HTTPS (Edge通知需要安全上下文)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        console.log('⚠️ 通知功能需要HTTPS环境');
        this.updateNotificationStatus('错误', 'HTTPS环境下才能使用通知');
        alert('通知功能需要HTTPS环境，请使用https://访问或在localhost测试');
        return false;
    }

    try {
        // 浏览器检测
        const isEdge = /Edg/.test(navigator.userAgent);
        const isChrome = /Chrome/.test(navigator.userAgent) && !isEdge;
        const isSafari = /Safari/.test(navigator.userAgent) && !isChrome && !isEdge;

        console.log('🌐 浏览器检测:', { isEdge, isChrome, isSafari });
        console.log('📋 User Agent:', navigator.userAgent);

        // 检查当前权限状态
        console.log('🔐 当前通知权限:', Notification.permission);

        if (Notification.permission === 'granted') {
            console.log('✅ 权限已授权');
            this.updateNotificationStatus('granted');
            return true;
        }

        if (Notification.permission === 'denied') {
            console.log('❌ 权限被拒绝');
            if (isEdge) {
                this.showEdgeManualSetupGuide();
            } else {
                this.updateNotificationStatus('denied');
                alert('通知权限被拒绝，请在浏览器设置中手动允许');
            }
            return false;
        }

        // Edge浏览器特殊处理
        if (isEdge) {
            console.log('🔵 Edge浏览器特殊处理');
            return await this.handleEdgePermission();
        }

        // 其他浏览器的标准处理
        console.log('🔄 请求通知权限...');
        const permission = await Notification.requestPermission();

        console.log('📝 权限请求结果:', permission);
        this.updateNotificationStatus(permission);

        return permission === 'granted';

    } catch (error) {
        console.error('💥 请求通知权限失败:', error);
        this.updateNotificationStatus('错误');

        // Edge的特殊错误处理
        if (/Edg/.test(navigator.userAgent)) {
            this.showEdgeManualSetupGuide();
        } else {
            alert('请求通知权限时出错，请手动在浏览器设置中启用');
        }

        return false;
    }
};

// Edge浏览器专用权限处理
EyeCareTimer.prototype.handleEdgePermission = async function() {
    console.log('🔵 处理Edge浏览器权限请求');

    try {
        // 方法1：使用回调方式的权限请求（Edge的旧API）
        const permission = await new Promise((resolve, reject) => {
            console.log('🔄 尝试Edge回调方式...');

            // 设置超时
            const timeout = setTimeout(() => {
                console.log('⏰ Edge权限请求超时');
                reject(new Error('权限请求超时'));
            }, 5000);

            try {
                const result = Notification.requestPermission((perm) => {
                    clearTimeout(timeout);
                    console.log('📋 Edge回调结果:', perm);
                    resolve(perm);
                });

                // 如果返回了Promise（新版Edge）
                if (result && typeof result.then === 'function') {
                    result.then((perm) => {
                        clearTimeout(timeout);
                        console.log('📋 Edge Promise结果:', perm);
                        resolve(perm);
                    }).catch(reject);
                }
            } catch (err) {
                clearTimeout(timeout);
                reject(err);
            }
        });

        console.log('✅ Edge权限请求完成:', permission);
        this.updateNotificationStatus(permission);

        if (permission !== 'granted') {
            this.showEdgeManualSetupGuide();
        }

        return permission === 'granted';

    } catch (error) {
        console.error('💥 Edge权限处理失败:', error);
        this.showEdgeManualSetupGuide();
        return false;
    }
};

// Edge手动设置指导
EyeCareTimer.prototype.showEdgeManualSetupGuide = function() {
    console.log('📖 显示Edge设置指导');

    const currentUrl = window.location.origin;
    const message = `Edge浏览器通知设置步骤：

🔒 方法一（推荐）：
1. 点击地址栏左边的🔒图标
2. 点击"权限"或"网站权限"
3. 找到"通知"设置
4. 选择"允许"
5. 刷新页面

⚙️ 方法二：
1. Edge菜单 → 设置 → Cookie和站点权限 → 通知
2. 点击"添加"按钮
3. 输入：${currentUrl}
4. 点击"添加"

当前网址：${currentUrl}

设置完成后，请点击"测试通知"验证功能。`;

    alert(message);

    this.updateNotificationStatus('denied', '❌ 需要手动设置 - 点击查看Edge设置指导');
    this.showNotification('Edge浏览器需要手动设置通知权限', 'warning');
};

EyeCareTimer.prototype.updateNotificationStatus = function(status = Notification.permission, customMessage = null) {
    const statusElement = this.notificationStatus;
    const statusText = statusElement.querySelector('small');

    if (!statusElement || !statusText) {
        console.log('⚠️ 通知状态元素未找到');
        return;
    }

    statusElement.className = 'notification-status';

    console.log('🔄 更新通知状态:', { status, customMessage });

    switch (status) {
        case 'granted':
            statusElement.classList.add('granted');
            statusText.textContent = '✅ 通知权限已授权';
            break;
        case 'denied':
            statusElement.classList.add('denied');
            statusText.textContent = customMessage || '❌ 通知权限被拒绝 - 点击查看设置指导';
            break;
        case 'default':
            statusText.textContent = '🔔 点击获取通知权限';
            break;
        case '不支持':
            statusElement.classList.add('denied');
            statusText.textContent = '❌ 浏览器不支持通知';
            break;
        case '错误':
            statusElement.classList.add('denied');
            statusText.textContent = customMessage || '❌ 获取权限时出错 - 点击查看设置指导';
            break;
    }
};

EyeCareTimer.prototype.sendSystemNotification = function(title, body, icon = '👀') {
    console.log('📤 尝试发送系统通知:', { title, body });

    if (!this.settings.systemNotificationEnabled) {
        console.log('🔇 系统通知已禁用');
        return null;
    }

    if (Notification.permission !== 'granted') {
        console.log('🚫 无通知权限，权限状态:', Notification.permission);
        // 显示页面内通知作为fallback
        this.showNotification(`[系统通知] ${title}: ${body}`, 'info');
        return null;
    }

    try {
        // Edge浏览器的简化配置
        const isEdge = /Edg/.test(navigator.userAgent);

        const notificationOptions = {
            body: body,
            tag: 'eyecare-timer-' + Date.now(), // 每次使用不同的tag
            silent: !this.settings.soundEnabled
        };

        // 只在非Edge浏览器中添加可能有问题的参数
        if (!isEdge) {
            notificationOptions.requireInteraction = false;
            notificationOptions.icon = `/favicon.ico`;
        }

        console.log('🔔 发送通知配置:', { title, options: notificationOptions });

        const notification = new Notification(title, notificationOptions);

        // 事件监听
        notification.onshow = () => {
            console.log('✅ 通知显示成功');
        };

        notification.onerror = (error) => {
            console.error('❌ 通知显示失败:', error);
        };

        // 自动关闭通知
        setTimeout(() => {
            try {
                notification.close();
                console.log('🔒 通知已自动关闭');
            } catch (e) {
                console.log('⚠️ 通知关闭失败:', e);
            }
        }, 6000);

        // 点击通知时聚焦到页面
        notification.onclick = () => {
            try {
                console.log('👆 通知被点击');
                window.focus();
                notification.close();
            } catch (e) {
                console.log('⚠️ 通知点击处理失败:', e);
            }
        };

        return notification;

    } catch (error) {
        console.error('💥 发送系统通知失败:', error);

        // Fallback到页面内通知
        this.showNotification(`[通知] ${title}: ${body}`, 'info');

        return null;
    }
};

EyeCareTimer.prototype.testSystemNotification = function() {
    console.log('🧪 开始测试通知功能');
    console.log('🔐 当前通知权限:', Notification.permission);

    // 强制显示权限状态
    this.updateNotificationStatus();

    if (Notification.permission === 'granted') {
        console.log('✅ 权限已授权，发送测试通知');
        this.sendSystemNotification(
            '🧪 通知测试',
            '如果您看到这条系统通知，说明功能正常工作！'
        );
        this.showNotification('✅ 测试通知已发送', 'success');

    } else if (Notification.permission === 'denied') {
        console.log('❌ 权限被拒绝');
        const isEdge = /Edg/.test(navigator.userAgent);
        if (isEdge) {
            this.showEdgeManualSetupGuide();
        } else {
            alert('通知权限被拒绝，请在浏览器设置中手动启用后重新测试');
        }

    } else {
        console.log('🔄 权限未设置，尝试请求');
        this.requestNotificationPermission().then(granted => {
            if (granted) {
                console.log('✅ 权限获取成功，发送测试通知');
                setTimeout(() => {
                    this.sendSystemNotification(
                        '🧪 通知测试',
                        '权限设置成功！通知功能正常工作。'
                    );
                    this.showNotification('✅ 权限设置成功，测试通知已发送', 'success');
                }, 500);
            } else {
                console.log('❌ 权限获取失败');
                this.showNotification('❌ 通知权限设置失败', 'warning');
            }
        });
    }
};