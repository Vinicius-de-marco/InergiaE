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
