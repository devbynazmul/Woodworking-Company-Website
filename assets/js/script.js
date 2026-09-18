(function ($) {
    "use strict";
    // Whole Page scroll Aniamtion
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ isIntersecting, target }) => {
            target.classList.toggle('show', isIntersecting);
        });
    });
    const hiddenElements = document.querySelectorAll('.fade_up, .fade_down, .zoom_in, .zoom_out, .fade_right, .fade_left, .flip_left, .flip_right, .flip_up, .flip_down');
    document.addEventListener('DOMContentLoaded', () => {
        hiddenElements.forEach((el) => observer.observe(el));
    });
    // fancy Box for pop-up section
    Fancybox.bind("[data-fancybox]", {
        Html5: {
            autoplay: true,
            muted: true,
            loop: true
        }
    });
    // make sticky navbar
    $(function () {
        const $navbar = $(".top-navbar");
        $(window).on("scroll", function () {
            $navbar.toggleClass("sticky", $(this).scrollTop() > 100);
        });
    });
    // header section
    const page = location.pathname.split("/").pop() || "index1.html";
    const norm = h => (h || "").replace("./", "").split("/").pop();
    const $nav = $(".mobile-nav");
    const $overlay = $(".menu-overlay");
    $(".active-link, .active-mid, .active-sub").removeClass("active-link active-mid active-sub");
    $(".dropdown").each(function () {
        const $drop = $(this);
        const $parentA = $drop.children("a");
        if (norm($parentA.attr("href")) === page) {
            $drop.addClass("active-link");
            return;
        }
        $drop.find(".submenu-right a").each(function () {
            if (norm(this.href) === page) {
                $drop.addClass("active-link");
                $(this).closest(".dropdown-sub").addClass("active-mid");
                $(this).parent().addClass("active-sub");
            }
        });
        $drop.find("> .submenu a").each(function () {
            if (norm(this.href) === page) {
                $drop.addClass("active-link");
                $(this).parent().addClass("active-sub");
            }
        });
    });
    $("li:not(.dropdown) > a").each(function () {
        if (norm(this.href) === page) {
            $(this).parent().addClass("active-link");
        }
    });
    const openMenu = () => {
        $nav.addClass("active");
        $overlay.addClass("active");
    };
    const closeMenu = () => {
        $nav.removeClass("active");
        $overlay.removeClass("active");
        $(".submenu.open, .submenu-right.open").removeClass("open");
    };
    $(document).on("click", function (e) {
        const $t = $(e.target);
        if ($t.closest(".menu-toggle").length) {
            $nav.hasClass("active") ? closeMenu() : openMenu();
            return;
        }
        if ($t.closest(".close-icon, .menu-overlay").length) {
            closeMenu();
            return;
        }
        if (innerWidth > 1199) return;
        const $main = $t.closest(".dropdown > a");
        if ($main.length) {
            const $sub = $main.next(".submenu");
            if ($sub.length) {
                e.preventDefault();
                $(".submenu.open").not($sub).removeClass("open");
                $sub.toggleClass("open");
            }
            return;
        }
        const $subLink = $t.closest(".dropdown-sub > a");
        if ($subLink.length) {
            const $sub = $subLink.next(".submenu-right");
            if ($sub.length) {
                e.preventDefault();
                $(".submenu-right.open").not($sub).removeClass("open");
                $sub.toggleClass("open");
            }
        }
    });
    // hero slider section
    $(function () {
        const $heroSlider = $('.hero1-slider-wrapper');
        if (!$heroSlider.hasClass('slick-initialized')) {
            $heroSlider.slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
                fade: true,
                speed: 2000,
                arrows: false,
                dots: false,
                infinite: true,
                pauseOnHover: false,
                pauseOnFocus: false
            });
        }
        $(window).on('resize orientationchange', function () {
            $heroSlider.slick('setPosition');
        });
        $(document).on('shown.bs.tab shown.bs.collapse', function () {
            $heroSlider.slick('setPosition');
        });
    });
    // bottom to top button section
    $(function () {
        const $btn = $("#scrollToTop");
        const circle = document.querySelector(".progress-ring__circle");
        if (!circle) return;
        const circumference = circle.r.baseVal.value * 2 * Math.PI;
        $(window).on("scroll", function () {
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = circumference - (scrollTop / scrollHeight) * circumference;
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = progress;
            $btn.css("display", scrollTop > 200 ? "flex" : "none");
        });
        $btn.on("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
    // preloader section
    $(window).on("load", function () {
        $("#preloader").fadeOut(600, function () {
            $(this).remove();
        });
    });
    // counter section
    $(function () {
        let done = false;
        const run = () =>
            $(".counter-grid h2").each(function () {
                let $t = $(this), n = 0, end = +$t.data("target"),
                    s = $t.data("suffix") || "", step = Math.ceil(end / 200);
                (function c() {
                    n += step;
                    n < end ? ($t.text(n + s), requestAnimationFrame(c)) : $t.text(end + s);
                })();
            });
        const counterSection = document.querySelector(".counter-section");
        if (counterSection) {
            new IntersectionObserver(e => e[0].isIntersecting && !done && (done = true, run()),
                { threshold: 0.7 }).observe(counterSection);
        }
    });
    // infinite scroll section
    $(function () {
        const debounce = (fn, d = 300) => {
            let t;
            return () => (clearTimeout(t), t = setTimeout(fn, d));
        };
        const setup = ($el) => {
            const html = $el.data('html') || $el.html();
            $el.data('html', html).html(html);
            const w = $(window).width();
            const repeat = w > 3840 ? 6 : w > 2560 ? 4 : w > 1920 ? 3 : 2;
            $el.append(html.repeat(repeat));
        };
        const init = () => {
            $('#scrollContent, #scrollContent2').each(function () {
                setup($(this));
            });
        };
        init();
        $(window).on('resize', debounce(init));
    });
    // coming soon countdown section
    $(function () {
        const $days = $("#days"),
            $hours = $("#hours"),
            $minutes = $("#minutes"),
            $seconds = $("#seconds"),
            launch = new Date("2026-04-25T10:00:00").getTime();
        const pad = (num) => String(num).padStart(2, "0");
        const updateCountdown = () => {
            const diff = launch - Date.now();
            if (diff <= 0) {
                $days.add($hours).add($minutes).add($seconds).text("00");
                return;
            }
            $days.text(pad(Math.floor(diff / 86400000)));
            $hours.text(pad(Math.floor((diff % 86400000) / 3600000)));
            $minutes.text(pad(Math.floor((diff % 3600000) / 60000)));
            $seconds.text(pad(Math.floor((diff % 60000) / 1000)));
        };
        setInterval(updateCountdown, 1000);
        updateCountdown();
    });
    // common function for the slick slider
    function initSlickSlider({ slider, settings, prevBtn, nextBtn }) {
        const $slider = $(slider);
        if (!$slider.length) return;
        if (!$slider.hasClass('slick-initialized')) {
            $slider.slick(settings);
        }
        if (prevBtn) {
            $(document).on('click', prevBtn, function () {
                $slider.slick('slickPrev');
            });
        }
        if (nextBtn) {
            $(document).on('click', nextBtn, function () {
                $slider.slick('slickNext');
            });
        }
    }
    // projects slider section
    $(function () {
        initSlickSlider({
            slider: '.projects-autoplay',
            prevBtn: '.projects-prev',
            nextBtn: '.projects-next',
            settings: {
                variableWidth: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                arrows: false,
                dots: false,
                pauseOnHover: false,
                pauseOnFocus: false,
                autoplaySpeed: 3000,
                speed: 1500,
                responsive: [
                    { breakpoint: 992, settings: { slidesToShow: 2 } },
                    { breakpoint: 451, settings: { slidesToShow: 1 } }
                ]
            }
        });
    });
    // our testimonial section
    $(function () {
        const $right = $('.our-testimonial-right-up-slider');
        const $left = $('.our-testimonial-left-slider');
        const settings = {
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            speed: 1500,
            arrows: false,
            infinite: true,
            pauseOnHover: false,
            pauseOnFocus: false
        };
        $right.slick({
            ...settings,
            dots: true,
            appendDots: $('.our-testimonial-dots'),
            asNavFor: '.our-testimonial-left-slider'
        });
        $left.slick({
            ...settings,
            dots: false,
            asNavFor: '.our-testimonial-right-up-slider'
        });
        $('.our-testimonial-prev-arrow').on('click', () => $right.slick('slickPrev'));
        $('.our-testimonial-next-arrow').on('click', () => $right.slick('slickNext'));
    });
    // latest blogs section
    $(function () {
        initSlickSlider({
            slider: '.latest-blogs-slider',
            prevBtn: '.blogs-prev',
            nextBtn: '.blogs-next',
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                arrows: false,
                dots: false,
                pauseOnHover: false,
                pauseOnFocus: false,
                autoplaySpeed: 3000,
                speed: 1500,
                variableWidth: true,
                responsive: [
                    { breakpoint: 1401, settings: { slidesToShow: 3, variableWidth: false } },
                    { breakpoint: 992, settings: { slidesToShow: 2, variableWidth: false } },
                    { breakpoint: 768, settings: { slidesToShow: 1, variableWidth: false } }
                ]
            }
        });
    });
    // custom carpentry our projects slider section
    $(function () {
        initSlickSlider({
            slider: '.latest-blogs-slider2',
            prevBtn: '.blogs-prev',
            nextBtn: '.blogs-next',
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                autoplay: true,
                arrows: false,
                dots: false,
                pauseOnHover: false,
                pauseOnFocus: false,
                autoplaySpeed: 3000,
                speed: 1500,
                responsive: [
                    { breakpoint: 768, settings: { slidesToShow: 1 } }
                ]
            }
        });
    });
    // team progress section
    $(function () {
        const $section = $(".progress-section");
        if (!$section.length) return;
        const animateProgress = () => {
            $(".progress-bar .progress-item").each(function () {
                const $item = $(this).find(".progress");
                const target = parseInt($item.data("progress"), 10) || 0;
                const $val = $(this).find(".item-value");
                let current = 0;
                const animate = () => {
                    if (current <= target) {
                        $item.css("width", current + "%");
                        $val.text(current + "%");
                        current++;
                        requestAnimationFrame(animate);
                    }
                };
                requestAnimationFrame(animate);
            });
        };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgress();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe($section[0]);
    });
    // pricing plan toggle section
    $(".switch input").on("change", function () {
        const yearly = this.checked;
        $(".monthly-yearly-container").toggleClass("yearly-active", yearly);
        $(".price-value").each(function () {
            const price = yearly ? $(this).data("yearly") : $(this).data("monthly");
            $(this).text(`$${price}`);
        });
        $(".price-duration").text(yearly ? "/year" : "/month");
        $(".pricing-plan-img").each(function () {
            $(this).attr("src", yearly ? $(this).data("yearly-img") : $(this).data("monthly-img"));
        });
    });
    // testimonial load more button section
    $(".load-more-btn").on("click", function (e) {
        e.preventDefault();
        $(".testimonial-grid-card.hidden").removeClass("hidden");
        $(this).addClass("hide");
    });
    // projects load more button section
    $(".load-more-projects-btn").on("click", function (e) {
        e.preventDefault();
        $(".projects-card.hidden").removeClass("hidden");
        $(this).addClass("hide");
    });
    // single project-1 load more button section
    $(".load-more-single-project-btn").on("click", function (e) {
        e.preventDefault();
        $(".single-project1-card.hidden").removeClass("hidden");
        $(this).addClass("hide");
    });
    // projects3 load more button section
    $(".load-more-project3-btn").on("click", function (e) {
        e.preventDefault();
        $(".projects3-box.hidden").removeClass("hidden");
        $(this).addClass("hide");
    });
    // custom select dropdown
    $(function () {
        $(document).on("click", ".select-head", function () {
            const $select = $(this).closest(".custom-select");
            $(".custom-select").not($select).removeClass("open").find(".select-list").hide();
            $select.toggleClass("open").find(".select-list").toggle();
        });
        $(document).on("click", ".select-list li", function () {
            const $select = $(this).closest(".custom-select");
            $select.find(".selected-text").text($(this).text());
            $(this).addClass("active").siblings().removeClass("active");
            $select.removeClass("open").find(".select-list").hide();
        });
        $(document).on("click", function (e) {
            if (!$(e.target).closest(".custom-select").length) {
                $(".custom-select").removeClass("open").find(".select-list").hide();
            }
        });
    });
    // single project-2 image slider section
    $('.single-project2-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 2000,
        arrows: false,
        dots: false,
        infinite: true,
        pauseOnHover: false,
        pauseOnFocus: false
    });
    // our timeline slider section
    $(function () {
        const $prev = $('.our-timeline-prev');
        const $next = $('.our-timeline-next');
        let position = 0;
        const max = 2;
        initSlickSlider({
            slider: '.our-timeline-slider',
            prevBtn: '.our-timeline-prev',
            nextBtn: '.our-timeline-next',
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                speed: 1500,
                variableWidth: true,
                infinite: false,
                responsive: [
                    { breakpoint: 1515, settings: { slidesToShow: 2, variableWidth: false } },
                    { breakpoint: 768, settings: { slidesToShow: 1, variableWidth: false } }
                ]
            }
        });
        const update = () => {
            $prev.removeClass('show-arrow');
            $next.removeClass('show-arrow');
            if (position > 0) $prev.addClass('show-arrow');
            if (position < max) $next.addClass('show-arrow');
        };
        update();
        $next.on('click', () => {
            if (position < max) {
                position++;
                update();
            }
        });
        $prev.on('click', () => {
            if (position > 0) {
                position--;
                update();
            }
        });
    });
})(jQuery);