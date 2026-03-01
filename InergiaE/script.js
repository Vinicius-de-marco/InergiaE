(() => {
    const MOBILE_BREAKPOINT = 768;
    const header = document.querySelector("header");
    const nav = header ? header.querySelector("nav") : null;
    const menuToggle = header ? header.querySelector(".menu-toggle") : null;

    if (!header || !nav || !menuToggle) {
        return;
    }

    document.body.classList.add("menu-enhanced");

    const closeMenu = () => {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
        nav.classList.add("is-open");
        menuToggle.setAttribute("aria-expanded", "true");
    };

    const toggleMenu = () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        if (expanded) {
            closeMenu();
            return;
        }
        openMenu();
    };

    menuToggle.addEventListener("click", toggleMenu);

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
            return;
        }

        if (!header.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
            closeMenu();
        }
    });
})();

(() => {
    const params = new URLSearchParams(window.location.search);
    const produtoParam = params.get("produto");
    const form = document.querySelector(".contact-form");
    const produtoInput = document.querySelector("#produto");
    const mensagemInput = document.querySelector("#mensagem");
    const heading = document.querySelector(".contact-form-card h2");

    if (!form || !produtoInput || !mensagemInput || !produtoParam) {
        return;
    }

    const produto = produtoParam.trim();
    if (!produto) {
        return;
    }

    if (produtoInput instanceof HTMLSelectElement) {
        const hasOption = Array.from(produtoInput.options).some((option) => option.value === produto);

        if (!hasOption) {
            const customOption = document.createElement("option");
            customOption.value = produto;
            customOption.textContent = `Outro: ${produto}`;
            produtoInput.appendChild(customOption);
        }
    }

    produtoInput.value = produto;

    if (!mensagemInput.value.trim()) {
        const linhas = [
            `Olá, gostaria de solicitar um orçamento para o produto ${produto}.`,
            "",
            "Aplicação:",
            "Faixa de tensão/corrente desejada:",
            "Prazo estimado:"
        ].filter(Boolean);
        mensagemInput.value = linhas.join("\n");
    }

    if (heading) {
        heading.textContent = `Solicite um orçamento - ${produto}`;
    }
})();

(() => {
    const params = new URLSearchParams(window.location.search);
    const isSent = params.get("enviado");
    const feedback = document.querySelector(".contact-form .form-feedback");

    if (isSent !== "1" || !feedback) {
        return;
    }

    feedback.textContent = "Solicitação enviada com sucesso. Em breve entraremos em contato.";
    feedback.classList.add("is-success");

    params.delete("enviado");

    const query = params.toString();
    const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", cleanUrl);
})();

(() => {
    const form = document.querySelector(".contact-form[data-async-form]");

    if (!form) {
        return;
    }

    const submitButton = form.querySelector(".btn-submit");
    const feedback = form.querySelector(".form-feedback");
    const honeypotInput = form.querySelector('input[name="_honey"]');
    const produtoInput = form.querySelector("#produto");
    const mensagemInput = form.querySelector("#mensagem");
    const initialProduto = produtoInput ? produtoInput.value : "";
    const initialMensagem = mensagemInput ? mensagemInput.value : "";
    const defaultButtonLabel = submitButton ? submitButton.textContent : "";
    const httpProtocolPattern = /^https?:$/;

    const getFriendlyError = (message) => {
        const normalizedMessage = (message || "").toLowerCase();

        if (!normalizedMessage) {
            return "Não foi possível enviar agora. Tente novamente ou fale via WhatsApp.";
        }

        if (normalizedMessage.includes("open this page through a web server")) {
            return "Abra a página por um servidor web (http/https), não como arquivo local.";
        }

        if (normalizedMessage.includes("needs activation") || normalizedMessage.includes("activate form")) {
            return "Formulário ainda não ativado. Abra o e-mail de contato e clique em 'Activate Form'.";
        }

        return message;
    };

    const setFeedback = (message, status = "") => {
        if (!feedback) {
            return;
        }

        feedback.textContent = message;
        feedback.classList.remove("is-success", "is-error", "is-pending");

        if (status) {
            feedback.classList.add(`is-${status}`);
        }
    };

    const setSubmitting = (isSubmitting) => {
        if (!submitButton) {
            return;
        }

        submitButton.disabled = isSubmitting;
        submitButton.textContent = isSubmitting ? "Enviando..." : defaultButtonLabel;
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!httpProtocolPattern.test(window.location.protocol)) {
            setFeedback("Abra a página por um servidor web (http/https), não como arquivo local.", "error");
            return;
        }

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (honeypotInput && honeypotInput.value.trim()) {
            return;
        }

        setSubmitting(true);
        setFeedback("Enviando sua solicitação...", "pending");

        const formData = new FormData(form);
        const payload = {};
        const endpoint = form.dataset.asyncEndpoint || form.action;

        formData.forEach((value, key) => {
            payload[key] = value;
        });

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));
            const isSuccess = response.ok && (data.success === true || data.success === "true");

            if (!isSuccess) {
                throw new Error(data.message || "Falha no envio.");
            }

            form.reset();

            if (produtoInput && initialProduto) {
                produtoInput.value = initialProduto;
            }

            if (mensagemInput && initialMensagem) {
                mensagemInput.value = initialMensagem;
            }

            setFeedback("Solicitação enviada com sucesso. Em breve entraremos em contato.", "success");
        } catch (error) {
            const rawMessage = error instanceof Error ? error.message : "";
            setFeedback(getFriendlyError(rawMessage), "error");
        } finally {
            setSubmitting(false);
        }
    });
})();

(() => {
    const productsGrid = document.querySelector("[data-filterable-products]");
    const filterControls = Array.from(document.querySelectorAll("[data-product-filter]"));

    if (!productsGrid || filterControls.length === 0) {
        return;
    }

    const productItems = Array.from(productsGrid.querySelectorAll(".product-item[data-product-line]"));

    if (productItems.length === 0) {
        return;
    }

    let activeFilter = "all";

    const normalizeGroup = (value) => {
        const normalized = (value || "").toString().trim().toLowerCase();

        if (!normalized) {
            return "all";
        }

        if (normalized === "cc" || normalized === "ca" || normalized === "plasma") {
            return normalized;
        }

        return "all";
    };

    const applyFilter = (nextFilter) => {
        activeFilter = normalizeGroup(nextFilter);

        productItems.forEach((item) => {
            const group = normalizeGroup(item.dataset.productLine);
            const shouldShow = activeFilter === "all" || group === activeFilter;

            item.classList.toggle("is-hidden", !shouldShow);
            item.hidden = !shouldShow;
        });

        filterControls.forEach((control) => {
            const controlFilter = normalizeGroup(control.dataset.productFilter);
            control.classList.toggle("is-active", controlFilter === activeFilter);
            control.setAttribute("aria-pressed", controlFilter === activeFilter ? "true" : "false");
        });
    };

    const hasAllControl = filterControls.some((control) => normalizeGroup(control.dataset.productFilter) === "all");

    filterControls.forEach((control) => {
        control.addEventListener("click", (event) => {
            event.preventDefault();

            const nextFilter = normalizeGroup(control.dataset.productFilter);
            const shouldResetToAll = !hasAllControl && activeFilter !== "all" && nextFilter === activeFilter;

            applyFilter(shouldResetToAll ? "all" : nextFilter);
        });
    });

    applyFilter("all");
})();

(() => {
    const revealSelectors = [
        ".intro-section",
        ".category-card",
        ".applications-index-cta",
        ".differential-card",
        ".blog-card",
        ".timeline-item",
        ".mission-card",
        ".differential-box",
        ".app-filter-card",
        ".testimonial-card-new",
        ".partner-item",
        ".cta-section",
        ".category-nav-card",
        ".product-item",
        ".application-card",
        ".highlight-card",
        ".contact-form-card",
        ".contact-info-panel",
        ".map-section",
        ".blog-article"
    ];

    const revealItems = Array.from(document.querySelectorAll(revealSelectors.join(",")));

    if (revealItems.length === 0) {
        return;
    }

    revealItems.forEach((item, index) => {
        item.classList.add("reveal-item");
        item.style.setProperty("--reveal-delay", `${Math.min((index % 6) * 70, 350)}ms`);
    });

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, io) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
    });

    revealItems.forEach((item) => observer.observe(item));
})();
