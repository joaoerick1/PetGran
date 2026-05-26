/**
 * PetGran UI — JavaScript compartilhado
 * Funcionalidades client-side para todas as páginas
 * Preparado para integração futura com banco de dados
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. TOGGLE DE SENHA (login.html)
    // ============================================================
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            const icon = togglePasswordBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = isPassword ? 'visibility' : 'visibility_off';
            }
        });
    }

    // ============================================================
    // 2. SELEÇÃO DE PERFIL — LOGIN (login.html)
    // ============================================================
    const profileBtns = document.querySelectorAll('[data-profile-type]');

    if (profileBtns.length > 0) {
        const activeClasses = ['bg-primary-fixed', 'text-on-primary-fixed-variant', 'border-primary', 'soft-shadow'];
        const inactiveClasses = ['bg-surface-container-high', 'text-on-surface-variant', 'border-transparent'];

        profileBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Desativar todos
                profileBtns.forEach(b => {
                    activeClasses.forEach(c => b.classList.remove(c));
                    inactiveClasses.forEach(c => b.classList.add(c));
                    b.removeAttribute('data-selected');
                });
                // Ativar o clicado
                inactiveClasses.forEach(c => btn.classList.remove(c));
                activeClasses.forEach(c => btn.classList.add(c));
                btn.setAttribute('data-selected', 'true');
            });
        });
    }

    // ============================================================
    // 3. VALIDAÇÃO DE FORMULÁRIO — LOGIN (login.html)
    // ============================================================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            const email = loginForm.querySelector('#email');
            const password = loginForm.querySelector('#password');
            let valid = true;

            // Limpar erros anteriores
            loginForm.querySelectorAll('.error-msg').forEach(el => el.remove());

            if (!email.value || !email.value.includes('@')) {
                e.preventDefault();
                showFieldError(email, 'Informe um e-mail válido');
                valid = false;
            }

            if (!password.value || password.value.length < 6) {
                e.preventDefault();
                showFieldError(password, 'A senha deve ter pelo menos 6 caracteres');
                valid = false;
            }

            // Se válido, redireciona (futuramente será via API)
            if (valid) {
                e.preventDefault();
                // TODO: DB — enviar POST para /api/auth/login
                window.location.href = 'feed.html';
            }
        });
    }

    function showFieldError(input, message) {
        const errorEl = document.createElement('p');
        errorEl.className = 'error-msg text-sm mt-1';
        errorEl.style.color = '#ba1a1a';
        errorEl.style.fontWeight = '500';
        errorEl.textContent = message;
        input.closest('div.relative')?.parentElement?.appendChild(errorEl);
        input.style.borderColor = '#ba1a1a';
        input.addEventListener('input', () => {
            errorEl.remove();
            input.style.borderColor = '';
        }, { once: true });
    }

    // ============================================================
    // 4. LIKE TOGGLE (feed.html, Ongs.html)
    // ============================================================
    document.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('[data-action="like"]');
        if (!likeBtn) return;

        const icon = likeBtn.querySelector('.material-symbols-outlined');
        const countEl = likeBtn.querySelector('[data-like-count]');
        const isLiked = likeBtn.classList.contains('text-tertiary');

        if (isLiked) {
            likeBtn.classList.remove('text-tertiary');
            icon.style.fontVariationSettings = "'FILL' 0";
            if (countEl) {
                countEl.textContent = parseInt(countEl.textContent) - 1;
            }
        } else {
            likeBtn.classList.add('text-tertiary');
            icon.style.fontVariationSettings = "'FILL' 1";
            // Animação de pop
            icon.style.transform = 'scale(1.3)';
            icon.style.transition = 'transform 0.2s ease';
            setTimeout(() => { icon.style.transform = 'scale(1)'; }, 200);
            if (countEl) {
                countEl.textContent = parseInt(countEl.textContent) + 1;
            }
        }

        // TODO: DB — POST /api/posts/{postId}/like
    });

    // ============================================================
    // 5. FAVORITO TOGGLE (marketplace.html)
    // ============================================================
    document.addEventListener('click', (e) => {
        const favBtn = e.target.closest('[data-action="favorite"]');
        if (!favBtn) return;

        const icon = favBtn.querySelector('.material-symbols-outlined');
        const isFav = favBtn.classList.contains('text-error');

        if (isFav) {
            favBtn.classList.remove('text-error');
            icon.style.fontVariationSettings = "'FILL' 0";
        } else {
            favBtn.classList.add('text-error');
            icon.style.fontVariationSettings = "'FILL' 1";
            icon.style.transform = 'scale(1.3)';
            icon.style.transition = 'transform 0.2s ease';
            setTimeout(() => { icon.style.transform = 'scale(1)'; }, 200);
        }

        // TODO: DB — POST /api/products/{productId}/favorite
    });

    // ============================================================
    // 6. FILTROS DE CATEGORIA (marketplace.html)
    // ============================================================
    const filterBtns = document.querySelectorAll('[data-filter]');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Desativar todos
                filterBtns.forEach(b => {
                    b.classList.remove('bg-primary', 'text-on-primary', 'border-primary');
                    b.classList.add('bg-surface-container', 'text-on-surface-variant', 'border-outline-variant');
                    b.removeAttribute('data-active');
                });
                // Ativar o clicado
                btn.classList.remove('bg-surface-container', 'text-on-surface-variant', 'border-outline-variant');
                btn.classList.add('bg-primary', 'text-on-primary', 'border-primary');
                btn.setAttribute('data-active', 'true');

                // TODO: DB — GET /api/marketplace?category={category}
                const category = btn.getAttribute('data-filter');
                console.log(`[PetGran] Filtro ativo: ${category}`);
            });
        });
    }

    // ============================================================
    // 7. CARRINHO — FEEDBACK VISUAL (marketplace.html)
    // ============================================================
    document.addEventListener('click', (e) => {
        const cartBtn = e.target.closest('[data-action="cart-add"]');
        if (!cartBtn) return;

        const icon = cartBtn.querySelector('.material-symbols-outlined');
        const originalText = icon.textContent;

        // Feedback visual
        cartBtn.classList.add('bg-secondary', 'text-on-secondary');
        cartBtn.classList.remove('bg-primary-container', 'text-on-primary-container');
        icon.textContent = 'check';

        setTimeout(() => {
            cartBtn.classList.remove('bg-secondary', 'text-on-secondary');
            cartBtn.classList.add('bg-primary-container', 'text-on-primary-container');
            icon.textContent = originalText;
        }, 1500);

        // TODO: DB — POST /api/cart/add { productId }
        const productId = cartBtn.getAttribute('data-product-id');
        console.log(`[PetGran] Adicionado ao carrinho: produto ${productId}`);
    });

    // ============================================================
    // 8. ENVIAR MENSAGEM (mensagens.html)
    // ============================================================
    const msgForm = document.getElementById('messageForm');
    const msgInput = document.getElementById('messageInput');
    const chatHistory = document.getElementById('chatHistory');

    if (msgForm && msgInput && chatHistory) {
        const sendMessage = () => {
            const text = msgInput.value.trim();
            if (!text) return;

            const now = new Date();
            const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            const msgBubble = document.createElement('div');
            msgBubble.className = 'flex items-end gap-sm max-w-[80%] self-end';
            msgBubble.setAttribute('data-message-id', `local-${Date.now()}`);
            msgBubble.innerHTML = `
                <div class="bg-primary text-on-primary rounded-2xl rounded-br-sm p-4 shadow-[0_4px_12px_rgba(52,101,116,0.15)]">
                    <p class="text-[15px]">${escapeHtml(text)}</p>
                    <div class="flex items-center justify-end gap-1 mt-2">
                        <span class="text-[11px] text-primary-container">${timeStr}</span>
                        <span class="material-symbols-outlined text-[14px] text-primary-container" data-weight="fill">done</span>
                    </div>
                </div>
            `;

            chatHistory.appendChild(msgBubble);
            msgInput.value = '';
            msgInput.style.height = '48px';
            chatHistory.scrollTop = chatHistory.scrollHeight;

            // Simular confirmação de envio após 1s
            setTimeout(() => {
                const checkIcon = msgBubble.querySelector('.material-symbols-outlined');
                if (checkIcon) checkIcon.textContent = 'done_all';
            }, 1000);

            // TODO: DB — POST /api/messages/send { chatId, text }
        };

        msgForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendMessage();
        });

        // Enviar com Enter (Shift+Enter para nova linha)
        msgInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // ============================================================
    // 9. TROCA DE CONVERSA (mensagens.html)
    // ============================================================
    const chatItems = document.querySelectorAll('[data-chat-id]');

    chatItems.forEach(item => {
        if (!item.closest('#chatHistory')) { // Não aplicar em mensagens
            item.addEventListener('click', () => {
                // Remover ativo de todos
                chatItems.forEach(ci => {
                    if (ci.closest('#chatHistory')) return;
                    ci.classList.remove('bg-primary-container/20', 'border-primary');
                    ci.classList.add('border-transparent');
                    const dot = ci.querySelector('.bg-primary.rounded-full.w-2');
                    if (dot) dot.style.display = 'none';
                });
                // Ativar clicado
                item.classList.add('bg-primary-container/20', 'border-primary');
                item.classList.remove('border-transparent');

                // TODO: DB — GET /api/messages/{chatId}
                const chatId = item.getAttribute('data-chat-id');
                console.log(`[PetGran] Chat ativo: ${chatId}`);
            });
        }
    });

    // ============================================================
    // 10. MODAL DE DOAÇÃO PIX (Ongs.html)
    // ============================================================
    document.addEventListener('click', (e) => {
        const donateBtn = e.target.closest('[data-action="donate-pix"]');
        if (!donateBtn) return;

        const ongName = donateBtn.getAttribute('data-ong-name') || 'ONG';
        showModal(
            `Doar para ${ongName}`,
            `
            <div style="text-align:center; padding: 16px 0;">
                <p style="margin-bottom:16px; color:#40484b;">Escaneie o QR Code ou copie a chave PIX:</p>
                <div style="width:160px; height:160px; background:#e7e8e9; border-radius:16px; margin:0 auto 16px; display:flex; align-items:center; justify-content:center;">
                    <span class="material-symbols-outlined" style="font-size:64px; color:#71787c;">qr_code_2</span>
                </div>
                <div style="background:#f3f4f5; border-radius:12px; padding:12px 16px; margin:0 auto; max-width:320px; display:flex; align-items:center; justify-content:space-between; gap:8px;">
                    <code style="font-size:13px; color:#191c1d; word-break:break-all;" id="pixKey">petgran@ong.org.br</code>
                    <button onclick="navigator.clipboard.writeText('petgran@ong.org.br').then(()=>this.textContent='Copiado!')" 
                        style="background:#346574; color:white; border:none; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:600; cursor:pointer; white-space:nowrap;">
                        Copiar
                    </button>
                </div>
                <p style="margin-top:16px; font-size:13px; color:#71787c;">Chave PIX fictícia — será substituída pelo dado real do banco</p>
            </div>
            `
        );
        // TODO: DB — GET /api/ongs/{ongId}/pix
    });

    // ============================================================
    // 11. MODAL DE ADOÇÃO (Ongs.html)
    // ============================================================
    document.addEventListener('click', (e) => {
        const adoptBtn = e.target.closest('[data-action="adopt"]');
        if (!adoptBtn) return;

        const petName = adoptBtn.getAttribute('data-pet-name') || 'este pet';
        const petId = adoptBtn.getAttribute('data-pet-id') || '0';
        showModal(
            `Adotar ${petName}`,
            `
            <div style="padding: 8px 0;">
                <p style="margin-bottom:16px; color:#40484b;">Para iniciar o processo de adoção, entre em contato com a ONG responsável:</p>
                <div style="background:#bfedd1; border-radius:12px; padding:16px; margin-bottom:16px;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                        <span class="material-symbols-outlined" style="color:#3d6751;">call</span>
                        <span style="color:#002113; font-weight:600;">(11) 99999-0000</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="material-symbols-outlined" style="color:#3d6751;">mail</span>
                        <span style="color:#002113; font-weight:600;">adocao@amigosDepatas.org.br</span>
                    </div>
                </div>
                <a href="mensagens.html" 
                   style="display:block; text-align:center; background:#346574; color:white; padding:12px; border-radius:20px; text-decoration:none; font-weight:600;">
                    Enviar Mensagem
                </a>
                <p style="margin-top:12px; font-size:13px; color:#71787c; text-align:center;">
                    Dados fictícios — serão substituídos pelo banco de dados
                </p>
            </div>
            `
        );
        // TODO: DB — POST /api/adoption/apply { petId }
    });

    // ============================================================
    // 12. MODAL DE CUPOM (marketplace.html)
    // ============================================================
    document.addEventListener('click', (e) => {
        const couponBtn = e.target.closest('[data-action="redeem-coupon"]');
        if (!couponBtn) return;

        showModal(
            'Cupom Resgatado! 🎉',
            `
            <div style="text-align:center; padding: 16px 0;">
                <div style="background:#fac69f; border-radius:16px; padding:20px; margin-bottom:16px;">
                    <p style="font-size:40px; font-weight:700; color:#765132; letter-spacing:4px;">BEMVINDO</p>
                    <p style="font-size:14px; color:#623f22; margin-top:8px;">20% de desconto na primeira compra</p>
                </div>
                <p style="color:#40484b; font-size:14px;">O cupom foi adicionado automaticamente ao seu carrinho.</p>
                <p style="margin-top:12px; font-size:13px; color:#71787c;">Funcionalidade fictícia — será integrada ao banco de dados</p>
            </div>
            `
        );
        // TODO: DB — POST /api/coupons/redeem { code: 'BEMVINDO' }
    });

    // ============================================================
    // 13. BOTÃO "ABRIR CHAT" (marketplace.html)
    // ============================================================
    document.addEventListener('click', (e) => {
        const chatBtn = e.target.closest('[data-action="open-chat"]');
        if (!chatBtn) return;

        const storeName = chatBtn.getAttribute('data-store-name') || 'Estabelecimento';
        // Redirecionar para mensagens
        // TODO: DB — POST /api/chats/create { storeId }
        window.location.href = 'mensagens.html';
    });

    // ============================================================
    // UTILITÁRIOS
    // ============================================================

    /**
     * Mostra um modal genérico
     */
    function showModal(title, bodyHTML) {
        // Remover modal existente
        const existingModal = document.getElementById('petgranModal');
        if (existingModal) existingModal.remove();

        const overlay = document.createElement('div');
        overlay.id = 'petgranModal';
        overlay.style.cssText = `
            position:fixed; inset:0; z-index:9999;
            display:flex; align-items:center; justify-content:center;
            background:rgba(0,0,0,0.4); backdrop-filter:blur(4px);
            animation: pgFadeIn 0.2s ease;
        `;

        overlay.innerHTML = `
            <style>
                @keyframes pgFadeIn { from { opacity:0; } to { opacity:1; } }
                @keyframes pgSlideUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
            </style>
            <div style="background:white; border-radius:24px; max-width:420px; width:90%; max-height:85vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.15); animation: pgSlideUp 0.3s ease;">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:20px 24px; border-bottom:1px solid #e1e3e4;">
                    <h3 style="font-size:18px; font-weight:700; color:#191c1d; margin:0;">${title}</h3>
                    <button id="closeModal" style="background:none; border:none; cursor:pointer; padding:4px; border-radius:50%; display:flex; align-items:center;">
                        <span class="material-symbols-outlined" style="color:#71787c;">close</span>
                    </button>
                </div>
                <div style="padding:16px 24px 24px;">
                    ${bodyHTML}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Fechar ao clicar fora ou no X
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.closest('#closeModal')) {
                overlay.style.animation = 'pgFadeIn 0.15s ease reverse';
                setTimeout(() => overlay.remove(), 150);
            }
        });

        // Fechar com Escape
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    /**
     * Escapar HTML para prevenir XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

});
