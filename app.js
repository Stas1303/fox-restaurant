/* ═══ NAV ═══ */
window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

/* ═══ SCROLL QUICKBAR (шторка) ═══ */
(() => {
    const bar = document.getElementById('quickbar');
    if (!bar) return;

    // Не показываем на коротких страницах, где скролл почти не нужен
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable < 700) return;

    // Подсветка активного раздела (по текущей странице)
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    bar.querySelectorAll('.quickbar-links a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        // ссылка-оверлей "Меню" не привязана к странице — пропускаем
        if (a.hasAttribute('data-menu-open')) return;
        const target = href.split('#')[0].split('/').pop();
        if (target && target === page) a.classList.add('active');
    });

    const APPEAR_AT = 140; // порог появления, px
    let hideTimer;
    window.addEventListener('scroll', () => {
        if (window.scrollY > APPEAR_AT) {
            bar.classList.add('show');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => bar.classList.remove('show'), 850);
        } else {
            bar.classList.remove('show');
            clearTimeout(hideTimer);
        }
    }, { passive: true });
    // keep visible while hovering so links stay clickable
    bar.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    bar.addEventListener('mouseleave', () => {
        hideTimer = setTimeout(() => bar.classList.remove('show'), 850);
    });
})();

/* ═══ REVEAL ═══ */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ═══ CHEF VIDEOS ═══ */
document.querySelectorAll('.chef-video').forEach(wrap => {
    const vid = wrap.querySelector('video');
    if (!vid) return;
    wrap.addEventListener('click', () => {
        if (vid.paused) {
            document.querySelectorAll('.chef-video video').forEach(v => { if (v !== vid) v.pause(); });
            vid.play();
        } else { vid.pause(); }
    });
    vid.addEventListener('play', () => wrap.classList.add('playing'));
    vid.addEventListener('pause', () => wrap.classList.remove('playing'));
});

/* ═══ FLIP CARDS ═══ */
document.querySelectorAll('.flip-card').forEach(card => {
    const toggle = () => card.classList.toggle('flipped');
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
});

/* Auto-flip first card once when the section appears (hint that cards are interactive) */
const firstFlip = document.querySelector('.flip-card');
if (firstFlip && 'IntersectionObserver' in window) {
    const demoObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                demoObs.unobserve(e.target);
                setTimeout(() => {
                    firstFlip.classList.add('flipped');
                    setTimeout(() => firstFlip.classList.remove('flipped'), 1700);
                }, 550);
            }
        });
    }, { threshold: 0.55 });
    demoObs.observe(firstFlip);
}

/* ═══ TOAST ═══ */
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
}

/* ═══ FORMS ═══ */
function submitForm(e) {
    e.preventDefault();
    const btn = e.target;
    const orig = btn.textContent;
    btn.textContent = '✓ Заявка отправлена';
    btn.style.background = '#1a3a1a';
    btn.style.color = '#7ec87e';
    showToast('Заявка получена — мы свяжемся с вами в течение часа');
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 4000);
}

/* ═══ PHONE MASK ═══ */
function applyPhoneMask(input) {
    input.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '');
        if (v.startsWith('7') || v.startsWith('8')) v = v.slice(1);
        let r = '+7 ';
        if (v.length > 0) r += '(' + v.slice(0, 3);
        if (v.length >= 3) r += ') ' + v.slice(3, 6);
        if (v.length >= 6) r += '-' + v.slice(6, 8);
        if (v.length >= 8) r += '-' + v.slice(8, 10);
        this.value = r;
    });
}

document.querySelectorAll('input[type="tel"]').forEach(applyPhoneMask);

/* ═══ HEARTH VIDEO LOAD ═══ */
(function() {
    const v = document.querySelector('.hearth-video');
    if (!v) return;
    const tryPlay = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    v.addEventListener('loadeddata', () => {
        if (v.readyState >= 2) v.classList.add('loaded');
        tryPlay();
    });
    if (v.readyState >= 2) { v.classList.add('loaded'); tryPlay(); }
    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            entries.forEach(e => e.isIntersecting ? tryPlay() : v.pause());
        }, { threshold: 0.15 }).observe(v);
    }
})();

/* ═══ MIN DATE ═══ */
const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(i => i.setAttribute('min', today));

/* ═══ FULL-SCREEN MENU ═══ */
const MENU = [{"c":"Салаты","items":[{"n":"Зеленый салат В12","p":"1 538","d":"С телятиной и устричными грибами","im":"menu/dish001"},{"n":"Зеленый салат А110%","p":"1 458","d":"Микс горных трав в фирменном ореховом соусе, дополняется мини-шашлыком из овощей на углях.","im":"menu/dish002"},{"n":"Грузинский салат","p":"1 128","d":"Овощной салат из медовых томатов, свежих огурцов, сладкого перца Рамиро, красного лука и острого красного перца. Заправляется яблочным уксусом и оливковым маслом. Дополняется кинзой.","im":"menu/dish003"},{"n":"Хорьятики","p":"1 478","d":"Греческий деревенский салат","im":"menu/dish004"},{"n":"Хрустящие баклажаны с медовыми томатами","p":"1 288","d":"Фирменный салат из хрустящих баклажанов в панировке с сочными медовыми томатами в персиковом кисло-сладком соусе. Блюдо дополняется кинзой и кунжутом, а также украшается ажурными чипсами собственного приготовления.","im":"menu/dish005"},{"n":"Вяленая утка с цитрусами","p":"1 658","d":"Тонкие ломтики вяленой утки, сочные фрукты и свежая зелень","im":"menu/dish006"},{"n":"Артишоки и печеный картофель","p":"1 558","d":"Свежие овощи, авокадо и насыщенная авторская заправка","im":"menu/dish007"}]},{"c":"Закуски","items":[{"n":"Крафтовые сыры ручной работы","p":"2 608","d":"Авторская сырная тарелка ручной работы: ассорти выдержанных крафтовых сыров с цветочным мёдом, грецким орехом и сезонными фруктами.","im":"menu/dish008"},{"n":"Цахтон","p":"618","d":"Национальный осетинский соус. Листья острого маринованного перца со сметаной! Осетины подают это блюдо как закуску к мясу,рыбе и многому другому!","im":"menu/dish009"},{"n":"Хоровац","p":"1 108","d":"Горячая закуска из измельченных овощей, запеченных на углях с дымком. Блюдо дополняет красный лук, кинза, перец чили и специи, а также украшается хрустящими чипсами из армянского лаваша.","im":"menu/dish010"},{"n":"Оливки и маслины","p":"918","d":"Оливки и маслины с пряными травами, маринованные в дубовой бочке","im":"menu/dish011"},{"n":"Мясные деликатесы из Адыгеи","p":"2 308","d":"Фермерские мясные деликатесы собственного производства.","im":"menu/dish012"},{"n":"Овощная корзина (3кг)","p":"3 308","d":"Фермерские овощи с грядки","im":"menu/dish013"}]},{"c":"Горячие закуски","items":[{"n":"Бишлакъ-биширген КЧР","p":"798","d":"Бышлакъ биширген или бышлак биширген – традиционное блюдо карачаевской кухни. Бышлак биширген представляет собой сытное блюдо из картофельного пюре, приготовленного вместе с большим количеством сыра. Это блюдо очень популярно в таких регионах как Карачаево-Черкессия и Кабардино-Балкария.","im":"menu/dish014"},{"n":"Наггетсы","p":"588","d":"Нежное куриное филе в хрустящей панировке","im":"menu/dish015"},{"n":"Кесадилья","p":"858","d":"Мексиканская тортилья с начинкой из куриного филе, овощей и нежного сыра.","im":"menu/dish016"},{"n":"Домашний сыр в лаваше с зеленью","p":"838","d":"Легендарная закуска, ради которой ездят на Кавказ. Тающий домашний сыр с зеленью в хрустящем ароматном лаваше со сметанно-чесночным соусом Тузлук.","im":"menu/dish017"},{"n":"Жареный сыр","p":"868","d":"Нежный сыр сулугуни в хрустящей панировке с брусничным и чесночным соусом. Идеальное сопровождение к пивному застолью.","im":"menu/dish018"}]},{"c":"SORBITIO","items":[{"n":"Куриное консоме с домашней лапшой","p":"718","d":"Наваристый куриный бульон с домашней лапшой ручной работы, куриным филе, морковью и свежей зеленью.","im":"menu/dish019"},{"n":"Шорпа по-карачаевски","p":"1 018","d":"Аутентичная горная шорпа из ягненка на ярком наваристом бульоне из телятины с овощами и чесночным соусом тузлук.","im":"menu/dish020"},{"n":"Фирменный борщ из телятины от Шефа","p":"1 278","d":"Тот самый борщ \"Всея Руси\" по рецепту Шефа-Константина Ивлева. Подача осуществляется с зеленым луком, палочками хлеба (из бездрожжевого теста), красным луком и чесноком. А также молотым перцем, курдюком барана и сметаной!","im":"menu/dish021"},{"n":"Зелёный крем суп с брокколи","p":"998","d":"Нежный сливочный суп с овощной свежестью, подаётся с фокаччей","im":"menu/dish022"}]},{"c":"Детское меню","items":[{"n":"Орзо с пармезаном","p":"588","d":"Всеми любимая итальянская паста орзо, приготовленная с добавлением сливок и ароматного свеженатертого сыра пармезан.","im":"menu/dish023"},{"n":"\" А если не доем, то что?\"","p":"978","d":"Нежные котлеты из куриного филе, приготовленные на пару в сочетании с бланшированными овощами!","im":"menu/dish024"},{"n":"\"Будиш маму-папу слушать - будиш конфеты кушать!\"","p":"958","d":"Цветные пельмешки по фирменному рецепту Бабушки Бисо с нежной телятиной из теста ручной работы в форме конфеток! Подаются с бульоном .","im":"menu/dish025"}]},{"c":"Горячие блюда","items":[{"n":"Чабанский хинкал","p":"2 118","d":"гастрономическое путешествие в сердце Кавказа","im":"menu/dish026"},{"n":"\"Бисстроганов\" из лесного мяса","p":"1 928","d":"Мраморная телятина, томленная в сливках с белыми грибами, на воздушной подушке из картофельного пюре. Блюдо украшает благородный сыр пармезан и маринованные томаты. А также чуточка любви от Бренд-шефа.","im":"menu/dish027"},{"n":"Толма","p":"1 118","d":"Легенда Армянской кулинарии. Рулеты из рубленой телятины в виноградных листьях, приготовленные по законам Армении.","im":"menu/dish028"},{"n":"Жаркое из вырезки мраморной телятины","p":"2 218","d":"Нежнейшая телятина, обжаренная с зольским картофелем, заправленная домашней сметаной.","im":"menu/dish029"},{"n":"Жаркое из баранины по-балкарски","p":"1 388","d":"Блюдо горных народов Кавказа. Обжаренный картофель с рубленными рёбрышками баранины и добавлением горных трав!","im":"menu/dish030"},{"n":"Пельмени от бабушки Бисо в бульоне","p":"1 198","d":"Фирменные пельмени из нежной телятины и теста ручной лепки , а остальное мы не разглашаем - секрет Бабушки Бисо.","im":"menu/dish031"},{"n":"Телячьи щечки","p":"1 918","d":"Телячьи щёчки, томлённые в классике французской кухни - демиглас. Блюдо дополняется пастой орзо, приготовленной с сулугуни и трюфельным маслом!","im":"menu/dish032"},{"n":"Дорадо в виноградном листе","p":"2 558","d":"Сочная рыба с мягкими травяными оттенками","im":"menu/dish033"}]},{"c":"Выпечка","items":[{"n":"Хычын Карачаевский","p":"1 108","d":"Открытый сочный мясной пирог с рубленной бараниной, зеленью и сливочным маслом, приготовленный в дровяной печи.","im":"menu/dish034"},{"n":"Лепешка FO'X","p":"498","d":"Горячая лепешка из теста ручной работы в дровяной печи, дополненная оливковым маслом, фисташками и пудрой из маслин.","im":"menu/dish035"},{"n":"Хычын балкарский","p":"808","d":"Ходят слухи, что Хычыны в FOX - лучшие в городе! Национальное блюдо Кабардино-Балкарии. Закрытая лепешка из бездрожжевого теста с начинкой из картофеля и балкарского сыра либо балкарского сыра и зелени, со сливочным маслом.","im":"menu/dish036"},{"n":"Хачапури на шампуре","p":"1 108","d":"Натуральный сыр сулугуни и тесто ручной работы, приготовленные на углях. Подаётся с фирменным соусом тузлук.","im":"menu/dish037"},{"n":"Ламаджо","p":"838","d":"Армянское ламаджо — это кулинарное произведение искусства, представляющее собой удивительное сочетание тонкого, хрустящего теста и сочной, ароматной мясной начинки. Это блюдо, которое можно смело назвать армянской версией пиццы, но с уникальным национальным характером.","im":"menu/dish038"}]},{"c":"Мангал","items":[{"n":"Мини картофель","p":"308","d":"Сочный картофель бейби на костре.","im":"menu/dish039"},{"n":"Картофель молодой с курдюком","p":"318","d":"Сочный картофель бейби с прослойкой курдюка на костре.","im":"menu/dish040"},{"n":"Шампиньоны гриль","p":"378","d":"Сочные грибы на углях - это очень вкусно.","im":"menu/dish041"},{"n":"Овощи гриль","p":"678","d":"Овощи на костре, подаются с маринованным луком и зернами граната.","im":"menu/dish042"},{"n":"Лосось на углях","p":"2 308","d":"Филе лосося из Баренцева моря, приготовленное на углях в сочетании с миксом салата и долькой лимона.","im":"menu/dish043"},{"n":"Язычки ягненка","p":"1 818","d":"Пикантные язычки ягненка, маринованные в аджике - подаются с чесночным соусом.","im":"menu/dish044"},{"n":"Жау Бауур","p":"898","d":"Сочная баранья печень в жировой сеточке, подается в мини-мангале с чесночным соусом. Блюдо прожарки medium","im":"menu/dish045"},{"n":"Адана-кебаб","p":"918","d":"Пикантные Люля из телятины с острым перцем и зеленью. Подаются на лаваше с маринованным луком и зернами граната.","im":"menu/dish046"},{"n":"Наполеон на мангале","p":"3 618","d":"Слоеный шашлык из вырезки баранины и говяжьего жира.","im":"menu/dish047"},{"n":"Вырезка мраморной телятины","p":"1 998","d":"Вырезка мраморной телятины, приготовленная на углях.","im":"menu/dish048"},{"n":"Люля-кебаб из баранины","p":"978","d":"Сочные люля из рубленой баранины и специями. Подается на лаваше с маринованным луком и фирменным томатным соусом.","im":"menu/dish049"},{"n":"Корейка барашка","p":"1 998","d":"Легенда Кавказа! Сочные Ребрышки Карачаевского барашка, подаются в мини-мангале с лавашом, маринованным луком и фирменным томатным соусом.","im":"menu/dish050"},{"n":"Мякоть ягненка","p":"1 368","d":"Сочная мякоть карачаевского ягненка, подается на лаваше с маринованным луком, зернами граната и зеленью.","im":"menu/dish051"},{"n":"Куриное филе на углях","p":"828","d":"Нежное куриное филе на углях, подается с маринованным луком и зернами граната на лаваше c фирменным томатным соусом.","im":"menu/dish052"},{"n":"Куриные крылья","p":"688","d":"Сочные ароматные крылья, подаются в мини-мангале на лаваше с маринованным луком, зернами граната и фирменным томатным соусом.","im":"menu/dish053"},{"n":"Утка магре","p":"1 018","d":"Нежное утиное филе, приготовленное на мангале с авторским брусничным соусом.","im":"menu/dish054"}]},{"c":"AUTHENTIC EXCLUSIVE","items":[{"n":"Кебаб из телятины от Шефа","p":"10 078","d":"Длина 1000 мм с золотом 24 карат","im":"menu/dish055"},{"n":"Брускетта \"Акула\"","p":"8 708","d":"Уникальная авторская брускетта длиною в 1метр от Бренд-Шефа FO'X. Свежеиспеченная деревенская чиабатта с разнообразием 4-х видов начинки.","im":"menu/dish056"},{"n":"Форель в коконе","p":"9 928","d":"Приготовленная в солевом панцире","im":"menu/dish057"},{"n":"Ассорти шашлыков на углях","p":"15 308","d":"Фирменное ассорти шашлыков, подается в мангале с раскаленными углями!","im":"menu/dish058"},{"n":"Хачапури \"Титаник\"","p":"10 878","d":"Эксклюзивный Хачапури по-аджарски, длинною 1000мм!","im":"menu/dish059"}]},{"c":"Десерты","items":[{"n":"Чизкейк Сан-Себастьян","p":"1 108","d":"Баскский десерт, по рецепту Сантьяго Риверы","im":"menu/dish060"},{"n":"Сметанник","p":"1 078","d":"Сочетание бисквита и солодового сметанного крема с сезонными отборными фруктами!","im":"menu/dish061"},{"n":"Шоколадный фондан","p":"1 018","d":"Дуэт бельгийского шоколада двух видов молочного и темного. Тающая лава из молочного шоколада по рецепту \"отца основателя\" Мишеля Браса!","im":"menu/dish062"},{"n":"Смузи-боул с облепихой и ягодами","p":"1 258","d":"Фруктовая основа, свежие ягоды и хрустящая гранола","im":"menu/dish063"}]},{"c":"Завтрак","items":[{"n":"Сырники от Константина Ивлева","p":"768","d":"Натуральные безглютеновые сырники по легендарному рецепту Константина Ивлева!","im":"menu/dish064"},{"n":"Скрэмбл на хлебе","p":"438","d":"Воздушный скрэмбл из нежных яиц с домашним соусом песто и томатами черри, подаётся на хрустящем деревенском хлебе.","im":"menu/dish065"},{"n":"Скрэмбл","p":"438","d":"Воздушный сливочный скрэмбл из нежных яиц с молоком и пармезаном","im":"menu/dish066"},{"n":"Шакшука","p":"958","d":"Арабская яичница с помидорами и сыром","im":"menu/dish067"},{"n":"Яичница КБР","p":"758","d":"Завтрак горца — яичница на сметане с кавказским сыром сулугуни.","im":"menu/dish068"},{"n":"Брускетта с томлёными щёчками","p":"798","d":"Уникальный вкус и рецептура","im":"menu/dish069"},{"n":"Яичница \"тузлу эт\"","p":"978","d":"С солёным диким мясом","im":"menu/dish070"},{"n":"Жамуко с айраном","p":"818","d":"Старинное блюдо адыгейской кухни","im":"menu/dish071"},{"n":"Завтрак Монте Кристо","p":"758","d":"Пышные гренки с мортаделлой","im":"menu/dish072"}]},{"c":"Гарниры","items":[{"n":"Рис","p":"518","d":"Рассыпчатый отварной рис на пару — идеальный гарнир к мангалу и горячим блюдам.","im":"menu/dish073"},{"n":"Картофель фри с пармезаном и трюфельным маслом","p":"608","d":"Хрустящий золотистый картофель фри, заправленный свеженатёртым пармезаном и ароматным трюфельным маслом.","im":"menu/dish074"},{"n":"Картофельное пюре","p":"438","d":"Нежное воздушное пюре из молодого картофеля на сливочном масле.","im":"menu/dish075"},{"n":"Картофель фри","p":"538","d":"Золотистый картофель фри, обжаренный до хрустящей корочки.","im":"menu/dish076"},{"n":"Батат фри","p":"708","d":"Сладковатый батат фри с хрустящей корочкой — яркая альтернатива классическому картофелю.","im":"menu/dish077"}]}];

(function initMenu() {
    const overlay = document.getElementById('menuOverlay');
    const tabsEl = document.getElementById('menuTabs');
    const bodyEl = document.getElementById('menuBody');
    if (!overlay || !tabsEl || !bodyEl) return;

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

    // Build category groups markup (rendered once)
    bodyEl.innerHTML = MENU.map((g, gi) => {
        const rows = g.items.map(it => `
            <div class="menu-dish">
                <div class="menu-dish__img">
                    <picture>
                        <source srcset="images/${esc(it.im)}.webp" type="image/webp">
                        <img src="images/${esc(it.im)}.jpg" alt="${esc(it.n)}" loading="lazy">
                    </picture>
                </div>
                <div class="menu-dish__body">
                    <div class="menu-dish__head">
                        <h4 class="menu-dish__name">${esc(it.n)}</h4>
                        <span class="menu-dish__price">${esc(it.p)}</span>
                    </div>
                    ${it.d ? `<p class="menu-dish__desc">${esc(it.d)}</p>` : ''}
                </div>
            </div>`).join('');
        return `<div class="menu-group" data-group="${gi}">
            <h3 class="menu-group__title">${esc(g.c)}</h3>
            <div class="menu-group__rule"></div>
            <div class="menu-cards">${rows}</div>
        </div>`;
    }).join('');

    // Build tabs
    const tabs = [{ label: 'Все', idx: -1 }].concat(MENU.map((g, gi) => ({ label: g.c, idx: gi })));
    tabsEl.innerHTML = tabs.map((t, i) => `<button class="menu-tab${i === 0 ? ' active' : ''}" data-idx="${t.idx}">${esc(t.label)}</button>`).join('');

    const groups = Array.from(bodyEl.querySelectorAll('.menu-group'));
    const tabBtns = Array.from(tabsEl.querySelectorAll('.menu-tab'));
    const tabByIdx = {};
    tabBtns.forEach(b => { tabByIdx[b.dataset.idx] = b; });

    // Center the active tab inside the horizontal strip
    function ensureTabVisible(btn) {
        if (!btn) return;
        const tr = btn.getBoundingClientRect();
        const sr = tabsEl.getBoundingClientRect();
        const delta = (tr.left + tr.width / 2) - (sr.left + sr.width / 2);
        if (Math.abs(delta) > 4) tabsEl.scrollBy({ left: delta, behavior: 'smooth' });
    }

    function setActiveTab(btn) {
        if (!btn || btn.classList.contains('active')) return;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ensureTabVisible(btn);
    }

    // Click a tab -> smooth-scroll the body to that section
    let suppressSpy = false;
    let suppressTimer = null;
    tabBtns.forEach(btn => btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        setActiveTab(btn);
        suppressSpy = true;
        clearTimeout(suppressTimer);
        suppressTimer = setTimeout(() => { suppressSpy = false; }, 650);
        if (idx === -1) {
            bodyEl.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const g = groups.find(x => parseInt(x.dataset.group, 10) === idx);
        if (g) {
            const top = g.getBoundingClientRect().top - bodyEl.getBoundingClientRect().top + bodyEl.scrollTop;
            bodyEl.scrollTo({ top: top - 8, behavior: 'smooth' });
        }
    }));

    // Scrollspy: as the body scrolls, highlight + reveal the current section's tab
    let spyTick = false;
    bodyEl.addEventListener('scroll', () => {
        if (spyTick) return;
        spyTick = true;
        requestAnimationFrame(() => {
            spyTick = false;
            tabsEl.classList.toggle('scrolled', bodyEl.scrollTop > 8);
            if (suppressSpy) return;
            if (bodyEl.scrollTop < 40) { setActiveTab(tabByIdx['-1']); return; }
            const bodyTop = bodyEl.getBoundingClientRect().top;
            let current = groups[0];
            for (const g of groups) {
                if (g.getBoundingClientRect().top - bodyTop <= 96) current = g; else break;
            }
            setActiveTab(tabByIdx[current.dataset.group]);
        });
    }, { passive: true });

    function openMenu(e) {
        if (e) e.preventDefault();
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        bodyEl.scrollTop = 0;
        tabsEl.scrollLeft = 0;
        tabsEl.classList.remove('scrolled');
        setActiveTab(tabByIdx['-1']);
    }
    function closeMenu() {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
    }

    document.querySelectorAll('[data-menu-open]').forEach(el => el.addEventListener('click', openMenu));
    document.querySelectorAll('[data-menu-close]').forEach(el => el.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu(); });
})();

/* ════════════════════════════════════════════════════════
   PREMIUM UX ANIMATIONS (site-wide)
   ════════════════════════════════════════════════════════ */
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── 1. Page loader (only on first visit this session) ── */
    const loader = document.getElementById('pageLoader');
    if (loader) {
        let seen = false;
        try { seen = sessionStorage.getItem('foxLoaderSeen') === '1'; } catch (e) {}
        if (seen) {
            // Returning visitor — skip animation entirely
            loader.remove();
        } else {
            try { sessionStorage.setItem('foxLoaderSeen', '1'); } catch (e) {}
            const dismiss = () => setTimeout(() => {
                loader.classList.add('done');
                setTimeout(() => loader.remove(), 800);
            }, reduce ? 0 : 750);
            if (document.readyState === 'complete') dismiss();
            else window.addEventListener('load', dismiss);
            // safety: never trap the page
            setTimeout(dismiss, 3500);
        }
    }

    if (reduce) return;

    /* ── 2. Ambient embers ── */
    const embers = document.createElement('div');
    embers.className = 'embers';
    const N = window.innerWidth < 640 ? 14 : 26;
    for (let i = 0; i < N; i++) {
        const e = document.createElement('span');
        e.className = 'ember';
        const size = 3 + Math.random() * 4;
        e.style.left = (Math.random() * 100) + 'vw';
        e.style.width = e.style.height = size + 'px';
        e.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
        e.style.animationDuration = (9 + Math.random() * 11) + 's';
        e.style.animationDelay = (-Math.random() * 18) + 's';
        embers.appendChild(e);
    }
    document.body.appendChild(embers);

    /* ── 3. Cursor glow (desktop only) ── */
    if (window.matchMedia('(hover: hover)').matches) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);
        let gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy;
        window.addEventListener('mousemove', (ev) => {
            tx = ev.clientX; ty = ev.clientY;
            glow.classList.add('active');
        }, { passive: true });
        const animateGlow = () => {
            gx += (tx - gx) * 0.12;
            gy += (ty - gy) * 0.12;
            glow.style.transform = `translate(${gx}px, ${gy}px)`;
            requestAnimationFrame(animateGlow);
        };
        requestAnimationFrame(animateGlow);
    }

    /* ── 4. Parallax background (celebration banner) ── */
    const pxSection = document.getElementById('celebration');
    const pxImg = pxSection && pxSection.querySelector('.celebration__bg img');
    if (pxImg) {
        let ticking = false;
        const applyParallax = () => {
            const rect = pxSection.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const center = rect.top + rect.height / 2 - window.innerHeight / 2;
                pxImg.style.transform = `translateY(${center * -0.12}px)`;
            }
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) { requestAnimationFrame(applyParallax); ticking = true; }
        }, { passive: true });
        applyParallax();
    }

    /* ── 5. Magnetic buttons ── */
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (ev) => {
            const r = btn.getBoundingClientRect();
            const mx = ev.clientX - r.left - r.width / 2;
            const my = ev.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${mx * 0.18}px, ${my * 0.28}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
})();
