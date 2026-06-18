// Define Models for each Provider
const PROVIDER_MODELS = {
    groq: [
        { id: "openai/gpt-oss-120b", name: "GPT OSS 120B" },
        { id: "openai/gpt-oss-20b", name: "GPT OSS 20B" },
        { id: "meta/llama-4-scout", name: "Llama 4 Scout" },
        { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
        { id: "qwen-3-32b", name: "Qwen 3 32B" }
    ],
    openai: [
        { id: "gpt-4o", name: "GPT-4o" },
        { id: "gpt-4o-mini", name: "GPT-4o Mini" },
        { id: "o1", name: "o1" },
        { id: "o3-mini", name: "o3-mini" },
        { id: "o3-pro", name: "o3-pro" },
        { id: "o4-mini", name: "o4-mini" },
        { id: "gpt-5-mini", name: "GPT-5 Mini" },
        { id: "gpt-5", name: "GPT-5" },
        { id: "gpt-5-pro", name: "GPT-5 Pro" },
        { id: "gpt-5.5", name: "GPT-5.5" }
    ],
    gemini: [
        { id: "models/gemini-2.5-pro", name: "Gemini 2.5 Pro" },
        { id: "models/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
        { id: "models/gemini-3.5-flash", name: "Gemini 3.5 Flash" },
        { id: "models/gemini-3.1-pro-preview", name: "Gemini 3.1 Pro Preview" },
        { id: "models/gemini-3-pro-preview", name: "Gemini 3 Pro Preview" },
        { id: "models/gemini-2.0-flash", name: "Gemini 2.0 Flash" },
        { id: "models/gemini-pro-latest", name: "Gemini Pro Latest" },
        { id: "models/gemma-4-31b-it", name: "Gemma 4 31B IT" }
    ],
    anthropic: [
        { id: "claude-opus-4.8", name: "Claude Opus 4.8" },
        { id: "claude-opus-4.7", name: "Claude Opus 4.7" },
        { id: "claude-sonnet-4.6", name: "Claude Sonnet 4.6" },
        { id: "claude-opus-4.6", name: "Claude Opus 4.6" },
        { id: "claude-sonnet-4.5", name: "Claude Sonnet 4.5" },
        { id: "claude-haiku-4.5", name: "Claude Haiku 4.5" },
        { id: "claude-opus-4.5", name: "Claude Opus 4.5" },
        { id: "claude-opus-4.1", name: "Claude Opus 4.1" }
    ],
    openrouter: [
        { id: "openai/gpt-5", name: "GPT-5" },
        { id: "openai/gpt-5-pro", name: "GPT-5 Pro" },
        { id: "openai/o3-mini", name: "o3-mini" },
        { id: "anthropic/claude-opus-4.8", name: "Claude Opus 4.8" },
        { id: "anthropic/claude-sonnet-4.6", name: "Claude Sonnet 4.6" },
        { id: "deepseek/deepseek-r1", name: "DeepSeek R1 (Reasoning)" },
        { id: "deepseek/deepseek-chat", name: "DeepSeek Chat (V3)" },
        { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro" },
        { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Llama 3.3 70B (Grátis)" },
        { id: "qwen/qwen-2.5-coder-32b-instruct", name: "Qwen 2.5 Coder (32B)" },
        { id: "qwen/qwen3-coder:free", name: "Qwen 3 Coder (Grátis)" },
        { id: "google/gemma-4-31b-it:free", name: "Gemma 4 31B (Grátis)" },
        { id: "openai/gpt-oss-120b:free", name: "GPT OSS 120B (Grátis)" },
        { id: "openai/gpt-oss-20b:free", name: "GPT OSS 20B (Grátis)" },
        { id: "nousresearch/hermes-3-llama-3.1-405b:free", name: "Hermes 3 405B (Grátis)" },
        { id: "x-ai/grok-4.20", name: "Grok 4.20" },
        { id: "microsoft/phi-4", name: "Phi-4" }
    ]
};

// Global App State
let appState = {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    messages: [], // Array of {role: 'user'|'assistant', content: string}
    temperature: 0.7,
    activeChatId: null,
    chats: [] // Array of {id: string, title: string, provider: string, model: string, messages: [], temperature: float}
};

// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const statusText = document.getElementById('statusText');
const statusDot = document.querySelector('.status-dot');

// Sidebar Collapse
const appContainer = document.querySelector('.app-container');
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const toggleSidebarBtnSidebar = document.getElementById('toggleSidebarBtnSidebar');
const mobileToggleBtn = document.getElementById('mobileToggleBtn');
const mobileCloseBtn = document.getElementById('mobileCloseBtn');
const sidebar = document.getElementById('sidebar');

// Sidebar History Elements
const newChatBtn = document.getElementById('newChatBtn');
const historyList = document.getElementById('historyList');

// Input Toolbar Elements
const modelSelectorBtn = document.getElementById('modelSelectorBtn');
const activeModelLabel = document.getElementById('activeModelLabel');
const modelDropdownMenu = document.getElementById('modelDropdownMenu');
const settingsBtn = document.getElementById('settingsBtn');

// Settings Modal Elements
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const modalTemp = document.getElementById('modalTemp');
const modalTempVal = document.getElementById('modalTempVal');
const modalGroqKey = document.getElementById('modalGroqKey');
const modalOpenaiKey = document.getElementById('modalOpenaiKey');
const modalGeminiKey = document.getElementById('modalGeminiKey');
const modalAnthropicKey = document.getElementById('modalAnthropicKey');
const modalOpenrouterKey = document.getElementById('modalOpenrouterKey');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Configure Marked.js options
    if (window.marked) {
        window.marked.setOptions({
            breaks: true
        });
    }

    // Load saved settings & conversations
    loadSettings();
    loadChats();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize UI state
    updateActiveModelBadge();
    renderHistoryList();
    renderMessages();
    
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

// Load settings from localStorage
function loadSettings() {
    const savedProvider = localStorage.getItem('pycoder_provider');
    const savedTemp = localStorage.getItem('pycoder_temperature');
    
    if (savedProvider) {
        appState.provider = savedProvider;
    }
    
    if (savedTemp) {
        appState.temperature = parseFloat(savedTemp);
    }

    // Load appropriate model
    const savedModel = localStorage.getItem(`pycoder_model_${appState.provider}`);
    if (savedModel) {
        appState.model = savedModel;
    } else {
        appState.model = PROVIDER_MODELS[appState.provider][0].id;
    }
}

// Load chats from localStorage
function loadChats() {
    const savedChats = localStorage.getItem('pycoder_chats');
    if (savedChats) {
        try {
            appState.chats = JSON.parse(savedChats);
        } catch (e) {
            console.error("Error parsing saved chats:", e);
            appState.chats = [];
        }
    } else {
        appState.chats = [];
    }
}

// Save chats list to localStorage
function saveChats() {
    localStorage.setItem('pycoder_chats', JSON.stringify(appState.chats));
}



// Update the badges in header & toolbar label
function updateActiveModelBadge() {
    const activeModels = PROVIDER_MODELS[appState.provider] || [];
    const modelObj = activeModels.find(m => m.id === appState.model);
    const modelLabel = modelObj ? modelObj.name : appState.model;
    const providerName = appState.provider.toUpperCase();


    // Input Toolbar Label
    if (activeModelLabel) {
        activeModelLabel.textContent = `${providerName}: ${modelLabel}`;
    }
}

// Render the sidebar history list
function renderHistoryList() {
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    if (appState.chats.length === 0) {
        historyList.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-muted); padding: 8px 12px; text-align: center;">Nenhuma conversa recente.</p>`;
        return;
    }
    
    // Sort chats by ID (timestamp) descending to show newest first
    const sortedChats = [...appState.chats].sort((a, b) => b.id.localeCompare(a.id));
    
    sortedChats.forEach(chat => {
        const item = document.createElement('div');
        item.className = `history-item ${chat.id === appState.activeChatId ? 'active' : ''}`;
        item.setAttribute('data-id', chat.id);
        
        item.innerHTML = `
            <i data-lucide="message-square" class="chat-icon"></i>
            <span class="history-item-title">${chat.title}</span>
            <button class="history-item-delete" title="Excluir Conversa">
                <i data-lucide="trash"></i>
            </button>
        `;
        
        // Load chat on click
        item.addEventListener('click', (e) => {
            // Prevent trigger if clicking delete button
            if (e.target.closest('.history-item-delete')) return;
            loadConversation(chat.id);
        });
        
        // Delete chat on click
        const deleteBtn = item.querySelector('.history-item-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteConversation(chat.id);
        });
        
        historyList.appendChild(item);
    });
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Load a conversation from history
function loadConversation(chatId) {
    const chat = appState.chats.find(c => c.id === chatId);
    if (!chat) return;
    
    appState.activeChatId = chat.id;
    appState.provider = chat.provider;
    appState.model = chat.model;
    appState.temperature = chat.temperature;
    appState.messages = [...chat.messages];
    
    // Sync models & keys
    localStorage.setItem('pycoder_provider', appState.provider);
    localStorage.setItem(`pycoder_model_${appState.provider}`, appState.model);
    localStorage.setItem('pycoder_temperature', appState.temperature);
    
    // Update UI elements
    updateActiveModelBadge();
    renderHistoryList();
    renderMessages();
    
    // On mobile view, collapse the drawer after click
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
}

// Delete a conversation
function deleteConversation(chatId) {
    if (confirm('Deseja realmente excluir esta conversa?')) {
        appState.chats = appState.chats.filter(c => c.id !== chatId);
        saveChats();
        
        if (appState.activeChatId === chatId) {
            // Switch to a new conversation
            startNewConversation();
        } else {
            renderHistoryList();
        }
    }
}

// Start a new clean conversation
function startNewConversation() {
    appState.activeChatId = null;
    appState.messages = [];
    
    // Restore default settings of current active provider/model
    const savedModel = localStorage.getItem(`pycoder_model_${appState.provider}`);
    if (savedModel) {
        appState.model = savedModel;
    } else {
        appState.model = PROVIDER_MODELS[appState.provider][0].id;
    }
    
    updateActiveModelBadge();
    renderHistoryList();
    renderMessages();
}

// Populates the model custom selector dropdown
function populateModelDropdown() {
    if (!modelDropdownMenu) return;
    
    modelDropdownMenu.innerHTML = '';
    
    // Group models by provider
    const providers = [
        { id: 'groq', name: 'Groq Cloud' },
        { id: 'openai', name: 'OpenAI' },
        { id: 'gemini', name: 'Google Gemini' },
        { id: 'anthropic', name: 'Anthropic Claude' },
        { id: 'openrouter', name: 'OpenRouter' }
    ];
    
    providers.forEach(prov => {
        // Create title item
        const titleItem = document.createElement('div');
        titleItem.className = 'dropdown-group-title';
        titleItem.textContent = prov.name;
        modelDropdownMenu.appendChild(titleItem);
        
        // Create model options
        const models = PROVIDER_MODELS[prov.id] || [];
        models.forEach(model => {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = `dropdown-option ${prov.id === appState.provider && model.id === appState.model ? 'active' : ''}`;
            option.textContent = model.name;
            
            option.addEventListener('click', () => {
                selectModel(prov.id, model.id);
            });
            
            modelDropdownMenu.appendChild(option);
        });
    });
}

// Select provider and model from dropdown
function selectModel(providerId, modelId) {
    appState.provider = providerId;
    appState.model = modelId;
    
    localStorage.setItem('pycoder_provider', providerId);
    localStorage.setItem(`pycoder_model_${providerId}`, modelId);
    
    // If active conversation exists, update its configuration
    if (appState.activeChatId) {
        const activeChat = appState.chats.find(c => c.id === appState.activeChatId);
        if (activeChat) {
            activeChat.provider = providerId;
            activeChat.model = modelId;
            saveChats();
        }
    }
    
    updateActiveModelBadge();
    modelDropdownMenu.classList.add('hidden');
    
    // Re-populate dropdown to refresh active state
    populateModelDropdown();
}

// Event Listeners Setup
function setupEventListeners() {
    // Mobile Navigation Drawer Toggle
    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Sidebar toggle button click (desktop collapse/restore)
    const toggleSidebar = () => {
        appContainer.classList.toggle('sidebar-collapsed');
    };

    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', toggleSidebar);
    }
    if (toggleSidebarBtnSidebar) {
        toggleSidebarBtnSidebar.addEventListener('click', toggleSidebar);
    }

    // Sidebar New Conversation Button Click
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            startNewConversation();
        });
    }

    // Input toolbar Model Selector Toggle Dropdown
    if (modelSelectorBtn) {
        modelSelectorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            populateModelDropdown();
            modelDropdownMenu.classList.toggle('hidden');
        });
    }

    // Close model dropdown menu when clicking outside
    document.addEventListener('click', (e) => {
        if (modelDropdownMenu && !modelDropdownMenu.classList.contains('hidden')) {
            if (!e.target.closest('.model-dropdown-container')) {
                modelDropdownMenu.classList.add('hidden');
            }
        }
    });

    // Settings Modal Open
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            openSettingsModal();
        });
    }

    // Settings Modal Close Buttons
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            closeSettingsModal();
        });
    }

    // Click outside modal card to close
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                closeSettingsModal();
            }
        });
    }

    // Save Settings button click
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            saveModalSettings();
        });
    }

    // Temperature slider input response
    if (modalTemp) {
        modalTemp.addEventListener('input', (e) => {
            if (modalTempVal) {
                modalTempVal.textContent = parseFloat(e.target.value).toFixed(1);
            }
        });
    }

    // Auto-growing chat input textarea
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        // Press Enter to submit (without Shift)
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    // Submit Chat Message form
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;
            
            // Reset input height
            chatInput.value = '';
            chatInput.style.height = 'auto';
            
            sendMessage(text);
        });
    }
}

// Open Settings Modal & Populate Values from LocalStorage
function openSettingsModal() {
    // Load keys
    modalGroqKey.value = localStorage.getItem('pycoder_key_groq') || '';
    modalOpenaiKey.value = localStorage.getItem('pycoder_key_openai') || '';
    modalGeminiKey.value = localStorage.getItem('pycoder_key_gemini') || '';
    modalAnthropicKey.value = localStorage.getItem('pycoder_key_anthropic') || '';
    modalOpenrouterKey.value = localStorage.getItem('pycoder_key_openrouter') || '';
    
    // Load temperature
    modalTemp.value = appState.temperature;
    modalTempVal.textContent = appState.temperature.toFixed(1);
    
    // Show Modal
    settingsModal.classList.remove('hidden');
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Close Settings Modal
function closeSettingsModal() {
    settingsModal.classList.add('hidden');
}

// Save Modal values to LocalStorage and State
function saveModalSettings() {
    localStorage.setItem('pycoder_key_groq', modalGroqKey.value.trim());
    localStorage.setItem('pycoder_key_openai', modalOpenaiKey.value.trim());
    localStorage.setItem('pycoder_key_gemini', modalGeminiKey.value.trim());
    localStorage.setItem('pycoder_key_anthropic', modalAnthropicKey.value.trim());
    localStorage.setItem('pycoder_key_openrouter', modalOpenrouterKey.value.trim());
    
    appState.temperature = parseFloat(modalTemp.value);
    localStorage.setItem('pycoder_temperature', appState.temperature);
    
    // If active conversation exists, update its temperature configuration
    if (appState.activeChatId) {
        const activeChat = appState.chats.find(c => c.id === appState.activeChatId);
        if (activeChat) {
            activeChat.temperature = appState.temperature;
            saveChats();
        }
    }
    
    // Sync status indicators
    closeSettingsModal();
}

// Set UI Status
function setStatus(text, type) {
    if (!statusText || !statusDot) return;
    
    statusText.textContent = text;
    statusDot.className = 'status-dot';
    
    if (type === 'loading') {
        statusDot.classList.add('loading');
    } else if (type === 'error') {
        statusDot.style.backgroundColor = '#ef4444';
    } else {
        statusDot.style.backgroundColor = '#a855f7';
    }
}

// Dynamic Messages Rendering
function renderMessages() {
    // Remove all message-row elements
    const rows = messagesContainer.querySelectorAll('.message-row, .typing-row');
    rows.forEach(r => r.remove());

    if (appState.messages.length === 0) {
        welcomeScreen.style.display = 'flex';
        return;
    }

    welcomeScreen.style.display = 'none';

    appState.messages.forEach(msg => {
        appendMessageRow(msg.role, msg.content);
    });

    scrollToBottom();
}

function appendMessageRow(role, content) {
    const row = document.createElement('div');
    row.className = `message-row ${role}`;

    const isUser = role === 'user';
    const avatarIcon = isUser ? 'user' : 'bot';
    const senderLabel = isUser ? 'Você' : 'PyCoder';

    // Render markdown to HTML
    let renderedHtml = content;
    if (window.marked) {
        try {
            renderedHtml = window.marked.parse(content);
        } catch (e) {
            console.error("Markdown rendering error:", e);
        }
    }

    row.innerHTML = `
        <div class="avatar">
            <i data-lucide="${avatarIcon}"></i>
        </div>
        <div class="message-content-wrapper">
            <span class="sender-name">${senderLabel}</span>
            <div class="message-body">${renderedHtml}</div>
        </div>
    `;

    messagesContainer.appendChild(row);
    
    // Highlight syntax in code blocks under this message row
    if (!isUser && window.Prism) {
        try {
            window.Prism.highlightAllUnder(row);
        } catch (e) {
            console.error("Syntax highlight error:", e);
        }
    }

    // Format code blocks (add copy buttons, language tags)
    formatCodeBlocks(row);

    // Initialize newly created lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Post-processing of code blocks for a premium UI
function formatCodeBlocks(container) {
    const pres = container.querySelectorAll('pre');
    pres.forEach(pre => {
        // Check if header is already prepended
        if (pre.querySelector('.code-header')) return;
        
        const code = pre.querySelector('code');
        if (!code) return;
        
        // Find language
        let lang = 'code';
        const classes = Array.from(code.classList);
        const langClass = classes.find(c => c.startsWith('language-'));
        if (langClass) {
            lang = langClass.replace('language-', '');
        }
        
        // Create header element
        const header = document.createElement('div');
        header.className = 'code-header';
        header.innerHTML = `
            <span>${lang.toUpperCase()}</span>
            <button class="copy-code-btn" type="button">
                <i data-lucide="copy"></i>
                <span>Copiar</span>
            </button>
        `;
        
        pre.insertBefore(header, pre.firstChild);
        
        // Add copy event
        const copyBtn = header.querySelector('.copy-code-btn');
        copyBtn.addEventListener('click', () => {
            const textToCopy = code.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const span = copyBtn.querySelector('span');
                span.textContent = 'Copiado!';
                copyBtn.style.color = '#a855f7';
                
                setTimeout(() => {
                    span.textContent = 'Copiar';
                    copyBtn.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error("Falha ao copiar texto: ", err);
            });
        });
    });
}

function showTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'message-row assistant typing-row';
    row.innerHTML = `
        <div class="avatar">
            <i data-lucide="bot"></i>
        </div>
        <div class="message-content-wrapper">
            <span class="sender-name">PyCoder</span>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(row);
    if (window.lucide) {
        window.lucide.createIcons();
    }
    scrollToBottom();
}

function removeTypingIndicator() {
    const indicator = messagesContainer.querySelector('.typing-row');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send user message to the API
async function sendMessage(text) {
    const apiKey = localStorage.getItem(`pycoder_key_${appState.provider}`);
    if (!apiKey || apiKey.trim() === '') {
        alert(`Por favor, insira a sua API Key para o provedor ${appState.provider.toUpperCase()} nas Configurações.`);
        openSettingsModal();
        return;
    }

    // Hide welcome screen if it's there
    welcomeScreen.style.display = 'none';

    // Add user message to history and render it
    appState.messages.push({ role: 'user', content: text });
    appendMessageRow('user', text);
    scrollToBottom();

    // Show typing indicator
    showTypingIndicator();
    setStatus('Pensando...', 'loading');

    // Make API request to our FastAPI backend
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                provider: appState.provider,
                model: appState.model,
                api_key: apiKey,
                messages: appState.messages,
                temperature: appState.temperature
            })
        });

        const data = await response.json();
        
        removeTypingIndicator();

        if (!response.ok) {
            throw new Error(data.detail || 'Erro ao comunicar com o servidor.');
        }

        const aiResponse = data.response;
        
        // Add response to messages
        appState.messages.push({ role: 'assistant', content: aiResponse });
        appendMessageRow('assistant', aiResponse);
        setStatus('Pronto', 'success');

        // Manage history lists saving
        if (!appState.activeChatId) {
            // New chat: generate title and id
            const newChatId = 'chat_' + Date.now();
            const firstLine = text.substring(0, 24);
            const chatTitle = firstLine.trim() + (text.length > 24 ? '...' : '');
            
            const newChat = {
                id: newChatId,
                title: chatTitle,
                provider: appState.provider,
                model: appState.model,
                messages: [...appState.messages],
                temperature: appState.temperature
            };
            
            appState.activeChatId = newChatId;
            appState.chats.push(newChat);
            saveChats();
            renderHistoryList();
        } else {
            // Existing chat: append new messages
            const activeChat = appState.chats.find(c => c.id === appState.activeChatId);
            if (activeChat) {
                activeChat.messages = [...appState.messages];
                saveChats();
            }
        }

    } catch (error) {
        console.error("Error sending message:", error);
        removeTypingIndicator();
        setStatus('Erro', 'error');
        
        // Show error message as an assistant block for better UX
        const errorMessage = `❌ **Erro:** ${error.message}\n\nPor favor, verifique se a chave de API inserida nas Configurações é válida e se você tem acesso ao modelo selecionado.`;
        appendMessageRow('assistant', errorMessage);
    }
    
    scrollToBottom();
}
