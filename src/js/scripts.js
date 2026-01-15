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
        userAgent.includes("chrome") && !userAgent.includes("edg/")
      );
      html.classList.toggle(
        "is-browser-safari",
        userAgent.includes("safari") && !userAgent.includes("chrome")
      );
      html.classList.toggle(
        "is-browser-firefox",
        userAgent.includes("firefox")
      );
      html.classList.toggle(
        "is-browser-ie",
        userAgent.includes("msie ") || userAgent.includes("trident/")
      );
      html.classList.toggle("is-browser-edge", userAgent.includes("edg/"));
    };

    const viewport = document.querySelector('meta[name="viewport"]');
    viewport?.setAttribute(
      "content",
      "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0"
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
        /(iphone|ipod|ipad)/.test(userAgent)
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

      // Mobile / Desktop / tablet checks
      if (window.innerWidth < mobileBreak) {
        if (window.screen.width < mobileXSBreak) {
          viewport?.setAttribute(
            "content",
            `width=${mobileXSBreak}, user-scalable=0`
          );
        } else {
          viewport?.setAttribute(
            "content",
            "width=device-width, initial-scale=1"
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
          "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0"
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

  const triggerTab = () => {
    const toggles = document.querySelectorAll(".js-tab__toggle");
    const targets = document.querySelectorAll(".js-tab__target");
    const classTabActive = "is-tab-active";

    if (!toggles.length) return;

    const parseIds = (el) =>
      (el.getAttribute("data-tab-id") || "").split(" ").filter(Boolean);
    toggles.forEach((toggle) => {
      const toggleIds = parseIds(toggle);
      const groupId = toggleIds[0];
      const tabId = toggleIds[1];

      toggle.addEventListener("click", () => {
        toggles.forEach((t) => {
          const ids = parseIds(t);
          if (ids.includes(groupId)) {
            t.classList.remove(classTabActive);
          }
        });
        targets.forEach((target) => {
          const ids = parseIds(target);
          if (ids.includes(groupId)) {
            target.classList.remove(classTabActive);
          }
        });
        toggle.classList.add(classTabActive);
        targets.forEach((target) => {
          const ids = parseIds(target);
          if (ids.includes(groupId) && ids.includes(tabId)) {
            target.classList.add(classTabActive);
          }
        });
      });
    });
  };

  const effectEyesFollow = () => {
    const targets = document.querySelectorAll(".js-effect-eyesfollow");
    if (!targets.length) return;

    const radiusMax = 30;

    document.addEventListener("mousemove", (event) => {
      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = event.clientX - cx;
        const dy = event.clientY - cy;

        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const ratio = Math.min(radiusMax / distance, 1);

        const x = dx * ratio;
        const y = dy * ratio;

        target.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  };

  const borderPolygon = () => {
    const targets = document.querySelectorAll(".js-border-polygon");
    if (!targets.length) return;

    const resolveToPx = (value, target, axis = "x") => {
      if (!value) return 0;
      if (value.endsWith("px")) return parseFloat(value);

      if (value.endsWith("%")) {
        const percent = parseFloat(value) / 100;
        const { width, height } = target.getBoundingClientRect();
        return axis === "y" ? percent * height : percent * width;
      }

      const probe = document.createElement("div");
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      probe.style.width = value;

      target.appendChild(probe);
      const px = probe.getBoundingClientRect().width;
      probe.remove();

      return px;
    };

    const parseCutSizes = (value, target) => {
      if (!value) return [0, 0, 0, 0];

      const parts = value.split(/\s+/).map((v) => resolveToPx(v, target));

      switch (parts.length) {
        case 1:
          return [parts[0], parts[0], parts[0], parts[0]];
        case 2:
          return [parts[0], parts[1], parts[0], parts[1]];
        case 3:
          return [parts[0], parts[1], parts[2], parts[1]];
        case 4:
          return parts;
        default:
          return [0, 0, 0, 0];
      }
    };

    const draw = (target) => {
      const styles = getComputedStyle(target);

      const borderWidth = resolveToPx(
        styles.getPropertyValue("--border-width"),
        target
      );

      const borderColor =
        styles.getPropertyValue("--border-color").trim() || "#000";

      const borderType =
        styles.getPropertyValue("--border-type").trim() || "center";

      const [cutTLSize, cutTRSize, cutBRSize, cutBLSize] = parseCutSizes(
        styles.getPropertyValue("--cut-size"),
        target
      );

      const inset = borderType === "inner" ? borderWidth / 2 : 0;

      let canvas = target.querySelector("canvas");
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.classList.add("c-canvas");
        target.prepend(canvas);
      }

      const ctx = canvas.getContext("2d");
      const { width, height } = target.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.lineJoin = "miter";
      ctx.lineCap = "butt";

      ctx.beginPath();
      ctx.moveTo(cutTLSize + inset, inset);
      ctx.lineTo(width - cutTRSize - inset, inset);

      if (cutTRSize > 0) {
        ctx.lineTo(width - inset, cutTRSize + inset);
      }

      ctx.lineTo(width - inset, height - cutBRSize - inset);

      if (cutBRSize > 0) {
        ctx.lineTo(width - cutBRSize - inset, height - inset);
      }

      ctx.lineTo(cutBLSize + inset, height - inset);

      if (cutBLSize > 0) {
        ctx.lineTo(inset, height - cutBLSize - inset);
      }

      ctx.lineTo(inset, cutTLSize + inset);
      ctx.closePath();
      ctx.stroke();
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        draw(entry.target);
      }
    });

    targets.forEach((target) => {
      draw(target);
      observer.observe(target);
    });
  };

  const sliderSimple = () => {
    const sliders = document.querySelectorAll(".js-slider-simple");
    if (!sliders.length) return;

    sliders.forEach((container) => {
      const slider = container.querySelectorAll(".swiper")[0];

      new Swiper(slider, {
        loop: true,
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 0,
        effect: "fade",
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: container.querySelector(".js-slider-simple__arrow.swiper-button-next"),
          prevEl: container.querySelector(".js-slider-simple__arrow.swiper-button-prev"),
        },
        pagination: {
          el: container.querySelector(".js-slider-simple__pagination"),
          clickable: true,
        },
      });
    });
  };

  const sliderNumbered = () => {
    const sliders = document.querySelectorAll(".js-slider-numbered");
    if (!sliders.length) return;

    sliders.forEach((container) => {
      const slider = container.querySelectorAll(".swiper")[0];

      new Swiper(slider, {
        loop: true,
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
          nextEl: container.querySelector(".js-slider-numbered__arrow.swiper-button-next"),
          prevEl: container.querySelector(".js-slider-numbered__arrow.swiper-button-prev"),
        },
        pagination: {
          el: container.querySelector(".js-slider-numbered__pagination"),
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className}">${index + 1}</span>`;
          },
        },
      });
    });
  };

  const sliderGameplay = () => {
    const sliders = document.querySelectorAll(".js-slider-gameplay");
    if (!sliders.length) return;

    sliders.forEach((container) => {
      const slider = container.querySelectorAll(".swiper")[0];
      const wrapper = slider.querySelector(".swiper-wrapper");
      const slides = wrapper.children;

      if (slides.length > 0 && slides.length <= 3) {
        const cloneCount = slides.length;
        for (let i = 0; i < cloneCount; i++) {
          wrapper.appendChild(slides[i].cloneNode(true));
        }
      }

      new Swiper(slider, {
        loop: true,
        speed: 500,
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 0,
        watchOverflow: true,
        navigation: {
          nextEl: container.querySelector(".js-slider-gameplay__arrow.swiper-button-next"),
          prevEl: container.querySelector(".js-slider-gameplay__arrow.swiper-button-prev"),
        },
        pagination: {
          el: container.querySelector(".js-slider-gameplay__pagination"),
          clickable: true,
        },
      });
    });
  };

  window.WebFontConfig = {
    custom: {
      families: [
        "Rubik:n4,n5",
        "Poppins:n4,n5",
        "Inter:n4,n6,n7",
        "Sansation:n4,n7",
        "Oxanium:n4,n5,n6",
        "Bangers:n4",
      ],
      urls: [
        "https://fonts.googleapis.com/css2" +
        "?family=Rubik:wght@400;500" +
        "&family=Poppins:wght@400;500" +
        "&family=Inter:wght@400;600;700" +
        "&family=Sansation:wght@400;700" +
        "&family=Oxanium:wght@400;500;600" +
        "&family=Bangers:wght@400" +
        "&display=swap",
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
  triggerTab();
  effectEyesFollow();
  borderPolygon();
  sliderSimple();
  sliderNumbered();
  sliderGameplay();
})();
