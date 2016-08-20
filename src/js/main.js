// Custom scripts:
// Если браузер не знает о плейсхолдерах в формах
jQuery(document).ready(function ($) {
    //
    // Меняем класс хидера и показываем кнопку скролла страницы
    //---------------------------------------------------------------------------------------
    (function () {
        var $scroller = $('<button type="button" class="page__scroll"><i class="icon-up"></i></button>'),
            $header = $('.b-header'),
            isHeaderVisible = false,//флаг состояния
            isScrollerVisible = false,
            scrolledClass = 'scrolled', //клас для непрозрачного хидера
            method = {};

        $('body').append($scroller);

        method.showHeader = function () {
            $header.addClass(scrolledClass);
            isHeaderVisible = true;
        };

        method.hideHeader = function () {
            $header.removeClass(scrolledClass);
            isHeaderVisible = false;
        };

        method.showScroller = function () {
            $scroller.show();
            isScrollerVisible = true;
        };

        method.hideScroller = function () {
            $scroller.hide();
            isScrollerVisible = false;
        };

        method.checkState = function () {
            var fromTop = $.scrollY();//см. плагин verge.js
            if (fromTop >= 100 && !isHeaderVisible) {
                method.showHeader();
            } else if (fromTop < 100 && isHeaderVisible) {
                method.hideHeader();
            };

            if (fromTop >= 500 && !isScrollerVisible) {
                method.showScroller();
            } else if (fromTop < 500 && isScrollerVisible) {
                method.hideScroller();
            };
        };

        method.checkState();

        $(window).bind('scroll', method.checkState);

        $scroller.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
        });
    })();

    //
    // Покажем - спрячем моб.меню
    //---------------------------------------------------------------------------------------
    (function () {
        var $btn = $('.js-mmenu-toggle'), //кнопка toggle
            $menu = $('.js-mmenu'), //панель меню
            $body = $('body'),
            activeClass = 'active',
            method = {};

        method.hideMenu = function () {
            $btn.removeClass(activeClass);
            $menu.removeClass(activeClass);
            $body.css('overflow', 'auto');
            method.removeOverlay();
        };

        method.showMenu = function () {
            $btn.addClass(activeClass);
            $menu.addClass(activeClass);
            $body.css('overflow', 'hidden');
            method.addOverlay();
        };

        method.addOverlay = function () {
            $body.append('<div id="overlay" class="page__overlay"></div>');
            $('#overlay').bind('click', method.hideMenu);
        };

        method.removeOverlay = function () {
            $('#overlay').unbind('click', method.hideMenu).remove();
        };

        $('.b-header').on('click', '.js-mmenu-toggle', function () {//покажем - спрячем панель моб.меню
            if ($(this).hasClass(activeClass)) {
                method.hideMenu();
            } else {
                method.showMenu();
            };
        });

        $menu.on('click', '.m-menu__label', method.hideMenu); //закроем панель по клику по заголовку
    })();

    //
    // Навигация по секциям
    //---------------------------------------------------------------------------------------
    (function () {
        var $menu = $('.h-menu, .m-menu'),
            $menu_link = $menu.find('.h-menu__link, .m-menu__link'),
            $sections = $('.js-section'),
            currentClass = 'current',
            BREAKPOINT = 992, //при этом разрешении экрана при скролле хидер меняет высоту
            firstSectionID = '#about', //id первой секции
            method = {};

        method.changeLinkState = function (el) {//находим и подсвечиваем линк в хидере и пейджере
            $menu_link.removeClass(currentClass);
            var $current = $menu.find('a[href^="#' + el + '"]');
            $current.addClass(currentClass);
        };

        method.checkHeaderOffset = function (el) {//рассчитаем высоту хидера
            var fromTop = 46, //высота хидера на мобильных
                winW = $.viewportW();

            if (winW >= BREAKPOINT) {
                fromTop = 73; //высота хидера при скролле на десктопе

                if (el.attr('href') === firstSectionID) {//если идем в начало
                    fromTop = 0;
                }
            };
            return fromTop;
        };

        method.scrollToContent = function (el) {//плавный скролл к секции по клику на линк с учетом высоты хидера
            $('html,body').animate({ scrollTop: $($(el).attr('href')).offset().top - method.checkHeaderOffset(el) }, 800);
        };

        $menu.on('click', '.h-menu__link, .m-menu__link', function (e) {//перехватываем клик по линку в хидере
            e.preventDefault();
            var $el = $(this);
            if ($el.hasClass(currentClass)) {
                return false;
            } else {
                method.scrollToContent($el);
            };
        });

        var waypoints = $sections.waypoint({//подключили плагин
            handler: function (direction) {
                var prev = this.previous();//предыдущая секция

                if (direction === 'down') {//скроллим вниз
                    method.changeLinkState(this.element.id);
                };
                if (direction === 'up') { //если скроллим вверх - подсвечиваем предыдущую секцию
                    method.changeLinkState(prev.element.id);
                };
            },
            group: 'section',
            offset: '35%'
        });
    })();
    
    //
    // Если браузер не знает о плейсхолдерах в формах
    //---------------------------------------------------------------------------------------
    if ($('html').hasClass('no-placeholder')) {
        /* Placeholders.js v4.0.1 */
        !function (a) { "use strict"; function b() { } function c() { try { return document.activeElement } catch (a) { } } function d(a, b) { for (var c = 0, d = a.length; d > c; c++) if (a[c] === b) return !0; return !1 } function e(a, b, c) { return a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent ? a.attachEvent("on" + b, c) : void 0 } function f(a, b) { var c; a.createTextRange ? (c = a.createTextRange(), c.move("character", b), c.select()) : a.selectionStart && (a.focus(), a.setSelectionRange(b, b)) } function g(a, b) { try { return a.type = b, !0 } catch (c) { return !1 } } function h(a, b) { if (a && a.getAttribute(B)) b(a); else for (var c, d = a ? a.getElementsByTagName("input") : N, e = a ? a.getElementsByTagName("textarea") : O, f = d ? d.length : 0, g = e ? e.length : 0, h = f + g, i = 0; h > i; i++) c = f > i ? d[i] : e[i - f], b(c) } function i(a) { h(a, k) } function j(a) { h(a, l) } function k(a, b) { var c = !!b && a.value !== b, d = a.value === a.getAttribute(B); if ((c || d) && "true" === a.getAttribute(C)) { a.removeAttribute(C), a.value = a.value.replace(a.getAttribute(B), ""), a.className = a.className.replace(A, ""); var e = a.getAttribute(I); parseInt(e, 10) >= 0 && (a.setAttribute("maxLength", e), a.removeAttribute(I)); var f = a.getAttribute(D); return f && (a.type = f), !0 } return !1 } function l(a) { var b = a.getAttribute(B); if ("" === a.value && b) { a.setAttribute(C, "true"), a.value = b, a.className += " " + z; var c = a.getAttribute(I); c || (a.setAttribute(I, a.maxLength), a.removeAttribute("maxLength")); var d = a.getAttribute(D); return d ? a.type = "text" : "password" === a.type && g(a, "text") && a.setAttribute(D, "password"), !0 } return !1 } function m(a) { return function () { P && a.value === a.getAttribute(B) && "true" === a.getAttribute(C) ? f(a, 0) : k(a) } } function n(a) { return function () { l(a) } } function o(a) { return function () { i(a) } } function p(a) { return function (b) { return v = a.value, "true" === a.getAttribute(C) && v === a.getAttribute(B) && d(x, b.keyCode) ? (b.preventDefault && b.preventDefault(), !1) : void 0 } } function q(a) { return function () { k(a, v), "" === a.value && (a.blur(), f(a, 0)) } } function r(a) { return function () { a === c() && a.value === a.getAttribute(B) && "true" === a.getAttribute(C) && f(a, 0) } } function s(a) { var b = a.form; b && "string" == typeof b && (b = document.getElementById(b), b.getAttribute(E) || (e(b, "submit", o(b)), b.setAttribute(E, "true"))), e(a, "focus", m(a)), e(a, "blur", n(a)), P && (e(a, "keydown", p(a)), e(a, "keyup", q(a)), e(a, "click", r(a))), a.setAttribute(F, "true"), a.setAttribute(B, T), (P || a !== c()) && l(a) } var t = document.createElement("input"), u = void 0 !== t.placeholder; if (a.Placeholders = { nativeSupport: u, disable: u ? b : i, enable: u ? b : j }, !u) { var v, w = ["text", "search", "url", "tel", "email", "password", "number", "textarea"], x = [27, 33, 34, 35, 36, 37, 38, 39, 40, 8, 46], y = "#ccc", z = "placeholdersjs", A = new RegExp("(?:^|\\s)" + z + "(?!\\S)"), B = "data-placeholder-value", C = "data-placeholder-active", D = "data-placeholder-type", E = "data-placeholder-submit", F = "data-placeholder-bound", G = "data-placeholder-focus", H = "data-placeholder-live", I = "data-placeholder-maxlength", J = 100, K = document.getElementsByTagName("head")[0], L = document.documentElement, M = a.Placeholders, N = document.getElementsByTagName("input"), O = document.getElementsByTagName("textarea"), P = "false" === L.getAttribute(G), Q = "false" !== L.getAttribute(H), R = document.createElement("style"); R.type = "text/css"; var S = document.createTextNode("." + z + " {color:" + y + ";}"); R.styleSheet ? R.styleSheet.cssText = S.nodeValue : R.appendChild(S), K.insertBefore(R, K.firstChild); for (var T, U, V = 0, W = N.length + O.length; W > V; V++) U = V < N.length ? N[V] : O[V - N.length], T = U.attributes.placeholder, T && (T = T.nodeValue, T && d(w, U.type) && s(U)); var X = setInterval(function () { for (var a = 0, b = N.length + O.length; b > a; a++) U = a < N.length ? N[a] : O[a - N.length], T = U.attributes.placeholder, T ? (T = T.nodeValue, T && d(w, U.type) && (U.getAttribute(F) || s(U), (T !== U.getAttribute(B) || "password" === U.type && !U.getAttribute(D)) && ("password" === U.type && !U.getAttribute(D) && g(U, "text") && U.setAttribute(D, "password"), U.value === U.getAttribute(B) && (U.value = T), U.setAttribute(B, T)))) : U.getAttribute(C) && (k(U), U.removeAttribute(B)); Q || clearInterval(X) }, J); e(a, "beforeunload", function () { M.disable() }) } }(this);
    };
});
