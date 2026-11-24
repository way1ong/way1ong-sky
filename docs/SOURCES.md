# Джерела й ліцензії

Правило: ліцензію читаємо на сторінці самого джерела; «лише некомерційне» не беремо. Підпис, якого вимагає ліцензія, стоїть у «Про програму» (`src/ui/menu-dialog.ts`).

## Використано

| Що | Джерело | Ліцензія | Прочитано |
|---|---|---|---|
| Мапи Сонця, планет і Місяця, кільця Сатурна, зоряне тло (`src/textures/`) | Solar System Scope, https://www.solarsystemscope.com/textures/ — файли `2k_*.jpg`, `2k_saturn_ring_alpha.png` | CC BY 4.0: «Distributed under Attribution 4.0 International license: You may use, adapt, and share these textures for any purpose, even commercially.» | на сторінці, 24.11.2026 |
| Діаметри планет і Місяця, найближчі й найдальші відстані від Сонця, період Місяця | NASA Planetary Fact Sheet, https://nssdc.gsfc.nasa.gov/planetary/factsheet/ (оновлено 13.11.2026) | матеріали NASA зазвичай не захищені авторським правом у США; NASA названо джерелом — правила NASA, https://www.nasa.gov/nasa-brand-center/images-and-media/ (прочитано 24.11.2026) | дані — на сторінці, 24.11.2026 |
| Числа карток: маса, сила тяжіння, доба, рік, відстань, температура, супутники, кільця (`src/data/facts.json`) | той самий Planetary Fact Sheet; що означає кожен рядок — NASA Planetary Fact Sheet Notes, …/factsheet/planetfact_notes.html (оновлено 20.12.2021) | те саме | 24.11.2026 |
| Сонце в картці: відношення до Землі, оберт, температура поверхні | NASA Sun Fact Sheet | те саме | 24.11.2026 |
| Радіус Сонця | NASA Sun Fact Sheet, …/factsheet/sunfact.html (оновлено 9.05.2024) | те саме | 24.11.2026 |
| Радіуси кілець Сатурна | NASA Saturnian Rings Fact Sheet, …/factsheet/satringfact.html (оновлено 19.04.2022) | те саме | 24.11.2026 |
| Положення й обертання тіл | astronomy-engine 2.1.19 (npm) | MIT | у пакеті |
| 3D | three.js 0.187.0 (npm) | MIT | у пакеті |
| Описи тіл у картках (`card.about.*` у словниках) — власні тексти трьома мовами за фактами зі сторінок NASA Science, science.nasa.gov; адреси сторінок — `src/data/descriptions.json`, речення NASA під кожним описом — `docs/DESCRIPTIONS.md` | NASA Science | матеріал NASA (ті самі правила); тексти — наші, не переклад і не копія; під описом — посилання на сторінку NASA | 24.11.2026 |

Що зроблено з мапами: перезбережено як JPEG меншої ваги; з кілець узято одну смугу 1024 × 2 точки. Де на текстурі кілець зовнішній край кільця A — виміряно на самій текстурі (`ringTextureAOuterAt` у `src/config.ts`), щоб кільця стояли на своїх справжніх радіусах.

## Ще не використано — для фото, точок на Місяці й описів

| Що | Джерело | Умови | Стан |
|---|---|---|---|
| Фото планет і знімки з поверхні Місяця | NASA Image and Video Library, images.nasa.gov (пошук — images-api.nasa.gov) | Правила NASA, https://www.nasa.gov/nasa-brand-center/images-and-media/ (прочитано 24.11.2026): «NASA content … generally are not subject to copyright in the United States. You may use this material for educational or informational purposes, including … computer graphical simulations and Internet Web pages»; «NASA should be acknowledged as the source of the material»; комерційне використання «must not explicitly or implicitly convey NASA’s endorsement»; матеріали третіх сторін позначено окремо — їх не брати; знімки з упізнаваними людьми — не брати | вибрати знімки, перевірити кожен: без позначки стороннього власника й без упізнаваних людей |
| Місця посадок «Аполлонів» (широта й довгота місячних модулів) | NASA NSSDC, https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html (координати за знімками Lunar Reconnaissance Orbiter) | матеріал NASA | прочитано 24.11.2026 |
| Описи тіл — запасний варіант | Вікіпедія українською, угорською, англійською | CC BY-SA 4.0 (рядок ліцензії внизу сторінки, прочитано 24.11.2026): потрібні підпис, посилання й та сама ліцензія для переробленого тексту | не беремо, поки є NASA |

## Ще не використано — для карти неба

| Що | Джерело | Ліцензія | Стан |
|---|---|---|---|
| Зорі (положення, яскравість, назви трьома мовами) | Вікідані | CC0 (за пошуком) | прочитати сторінку ліцензії; перевірити запитом, чи є всі видимі оком зорі й чи точні дані |
| Лінії сузір'їв | d3-celestial 0.7.35 (BSD-3-Clause; у пакеті сказано: зі сторінки сузір'їв IAU з правками автора); схеми IAU і Sky & Telescope — CC BY 4.0 (за пошуком) | BSD-3 + CC BY 4.0 | прочитати сторінку IAU |
| У якому сузір'ї точка неба | astronomy-engine (`Constellation`) | MIT | готове |

## Відхилено

- Каталог Hipparcos (ESA) — CC BY-NC 3.0 IGO, лише некомерційне використання (за пошуком).
- База HYG — сама CC BY-SA 4.0, але побудована на Hipparcos.
- Зорі з d3-celestial — з XHIP, розширеної збірки Hipparcos (сказано в його readme).
- Yale Bright Star Catalogue — чіткої ліцензії не знайдено.
