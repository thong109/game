"use strict";

(() => {
  const tabletBreak = 1280;
  const mobileBreak = 768;
  const mobileXSBreak = 414;

  const detectBrowser = () => {
    const html = document.documentElement;

    const init = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      html.classList.toggle(
        "is-browser-chrome",
        userAgent.includes("chrome") && !userAgent.includes("edg/"),
      );
      html.classList.toggle(
        "is-browser-safari",
        userAgent.includes("safari") && !userAgent.includes("chrome"),
      );
      html.classList.toggle(
        "is-browser-firefox",
        userAgent.includes("firefox"),
      );
      html.classList.toggle(
        "is-browser-ie",
        userAgent.includes("msie ") || userAgent.includes("trident/"),
      );
      html.classList.toggle("is-browser-edge", userAgent.includes("edg/"));
    };

    const viewport = document.querySelector('meta[name="viewport"]');
    viewport?.setAttribute(
      "content",
      "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0",
    );

    window.addEventListener("load", init);
    window.addEventListener("resize", init);
    init();
  };

  const detectDevice = () => {
    const html = document.documentElement;

    const init = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      const userAgent = navigator.userAgent.toLowerCase();
      const orientation = window.matchMedia("(orientation: portrait)").matches;

      html.classList.toggle("is-device-mac", userAgent.includes("mac"));
      html.classList.toggle("is-device-macos", userAgent.includes("mac"));
      html.classList.toggle("is-device-iphone", /iphone/.test(userAgent));
      html.classList.toggle("is-device-ipod", /ipod/.test(userAgent));
      html.classList.toggle("is-device-ipad", /ipad/.test(userAgent));
      html.classList.toggle(
        "is-device-ios",
        /(iphone|ipod|ipad)/.test(userAgent),
      );
      html.classList.toggle("is-device-android", userAgent.includes("android"));

      // Emulation check
      if (navigator.maxTouchPoints === 1 && !userAgent.includes("mobile")) {
        html.classList.add("is-device-emulation");
      } else {
        html.classList.remove("is-device-emulation");
      }

      // Touchable check
      if (
        (html.classList.contains("is-device-mac") ||
          html.classList.contains("is-device-ios") ||
          html.classList.contains("is-device-android")) &&
        navigator.maxTouchPoints >= 1
      ) {
        html.classList.add("is-device-touchable");
      } else {
        html.classList.remove("is-device-touchable");
      }

      // Mobile / Desktop / Tablet checks
      if (window.innerWidth < mobileBreak) {
        if (window.screen.width < mobileXSBreak) {
          viewport?.setAttribute(
            "content",
            `width=${mobileXSBreak}, user-scalable=0`,
          );
        } else {
          viewport?.setAttribute(
            "content",
            "width=device-width, initial-scale=1",
          );
        }
        html.classList.add("is-device-mobile");
        html.classList.remove("is-device-desktop", "is-device-tablet");
      } else {
        html.classList.add("is-device-desktop");
        html.classList.remove("is-device-mobile");

        if (
          (window.screen.width >= mobileBreak &&
            window.screen.width <= tabletBreak) ||
          (window.screen.width < mobileBreak &&
            window.screen.height >= mobileBreak &&
            !orientation)
        ) {
          html.classList.add("is-device-tablet");
        } else {
          html.classList.remove("is-device-tablet");
        }

        viewport?.setAttribute(
          "content",
          "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0",
        );
      }
    };

    window.addEventListener("load", init);
    window.addEventListener("resize", init);
    init();
  };

  const detectState = () => {
    let timerResize;
    const classStateResize = "is-state-resize";
    const html = document.documentElement;

    window.addEventListener("resize", () => {
      html.classList.add(classStateResize);

      clearTimeout(timerResize);
      timerResize = setTimeout(() => {
        html.classList.remove(classStateResize);
      }, 200);
    });
  };

  const triggerClick = () => {
    const classClickActive = "is-click-active";

    document.querySelectorAll(".js-click").forEach((element) => {
      element.addEventListener("click", () => {
        element.classList.toggle(classClickActive);
      });
    });
  };

  const buttonTop = () => {
    const buttons = document.querySelectorAll(".js-button-top");
    if (!buttons.length) return;

    buttons.forEach((button) => {
      const classReady = "is-ready";
      const classVisible = "is-visible";
      const classStatic = "is-static";
      const buttonWrapper = button.querySelector(".button-wrapper");

      const scrolling = () => {
        const buttonPosition = button.offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;
        const startPosition = window.innerHeight * 1.5;

        button.classList.toggle(classVisible, scrollPosition >= startPosition);
        button.classList.toggle(classStatic, scrollPosition > buttonPosition);
        button.classList.add(classReady);
      };

      buttonWrapper?.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      const safeScroll = () => {
        if (!window.isWindowFrozen) scrolling();
      };

      window.addEventListener("load", safeScroll);
      window.addEventListener("resize", safeScroll);
      window.addEventListener("scroll", safeScroll);

      scrolling();
    });
  };

  window.WebFontConfig = {
    custom: {
      families: ["Inter:n6", "Sansation:n7", "Oxanium:n6", "Bangers:n4"],
      urls: [
        "https://fonts.googleapis.com/css2" +
        "?family=Inter:wght@400;600;700" +
        "&family=Sansation:wght@400;700" +
        "&family=Oxanium:wght@400;600" +
        "&family=Bangers:wght@400" +
        "&display=swap"
      ],
    },
  };

  (() => {
    const wf = document.createElement("script");
    wf.src = "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js";
    wf.type = "text/javascript";
    wf.async = "true";
    const s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(wf, s);
  })();

  detectBrowser();
  detectDevice();
  detectState();
  triggerClick();
})();
