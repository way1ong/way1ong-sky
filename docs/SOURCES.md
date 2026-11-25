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
| Чотири великі супутники Юпітера: маса, радіус, густина, піввісь орбіти, період (`src/data/jupiter-moons.json`) — для карток супутників і звірки положень із рушія | NASA Jovian Satellite Fact Sheet, https://nssdc.gsfc.nasa.gov/planetary/factsheet/joviansatfact.html (оновлено 6.12.2023) | правила NASA, як для довідника планет | 25.11.2026 |
| Карти поверхні Іо, Європи, Ганімеда й Каллісто (`src/textures/io.jpg` …), зразки 1024 px, чорно-білі | U.S. Geological Survey, Astrogeology Science Center, каталог Astropedia — сторінки карт у `src/data/satellites.json` | суспільне надбання: «Access Constraints: public domain; Use Constraints: None» на сторінках Іо й Європи; для всіх — правило USGS «USGS-authored or produced data and information are considered to be in the U.S. Public Domain», https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits; просять підпис «Credit: U.S. Geological Survey» — він у «Про програму» | 25.11.2026 |
| Описи супутників Юпітера в картках (`moonCard.about.*`) — власні тексти за сторінками NASA Science про кожен супутник; речення — `docs/MOONS.md` | science.nasa.gov/jupiter/jupiter-moons/… | правила NASA, як для описів тіл | 25.11.2026 |
| Положення й обертання тіл | astronomy-engine 2.1.19 (npm) | MIT | у пакеті |
| 3D | three.js 0.187.0 (npm) | MIT | у пакеті |
| Фото тіл у картках (`src/photos/`, десять знімків) | NASA Image and Video Library, https://images.nasa.gov/ — запис і автор кожного знімка: `src/data/photos.json`, `docs/PHOTOS.md` | Правила NASA, https://www.nasa.gov/nasa-brand-center/images-and-media/: «NASA content … generally are not subject to copyright in the United States. You may use this material for educational or informational purposes, including … Internet Web pages»; «NASA should be acknowledged as the source of the material»; комерційне використання «must not explicitly or implicitly convey NASA’s endorsement». Під кожним фото — автор із запису й посилання на запис; у «Про програму» — що програму зроблено незалежно від NASA | 24.11.2026 |
| Місця посадок «Аполлонів» (`src/data/sites.json`): координати місячних модулів | NASA NSSDCA, Apollo Landing Site Coordinates, https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html (оновлено 6.03.2017; координати — за знімками Lunar Reconnaissance Orbiter) | матеріал NASA | 24.11.2026 |
| Місії: дати старту, посадки й повернення (UT), екіпаж | сторінка кожної місії, …/planetary/lunar/apollo11info.html … apollo17info.html (оновлено 15.08.2022); хто сідає, а хто лишається на орбіті, і місяцеходи «Аполлонів» 15–17 — …/lunar/apollo.html | матеріал NASA | 24.11.2026 |
| Місії: час поза кораблем, шлях поверхнею, маса зразків | NASA NSSDCA, Apollo Lunar Landings, …/planetary/lunar/apolloland.html (оновлено 6.03.2017) | матеріал NASA | 24.11.2026 |
| Фото з місць посадок (`src/photos/sites/`, шість знімків) | NASA Image and Video Library — `docs/PHOTOS.md` | правила NASA, як для фото тіл; без людей у кадрі | 24.11.2026 |
| Описи тіл у картках (`card.about.*` у словниках) — власні тексти трьома мовами за фактами зі сторінок NASA Science, science.nasa.gov; адреси сторінок — `src/data/descriptions.json`, речення NASA під кожним описом — `docs/DESCRIPTIONS.md` | NASA Science | матеріал NASA (ті самі правила); тексти — наші, не переклад і не копія; під описом — посилання на сторінку NASA | 24.11.2026 |
| Історія й дослідження тіл у картках (`card.history.*` у словниках) — власні тексти трьома мовами за реченнями зі сторінок NASA Science («facts» і «exploration» кожного тіла) та переліком NASA NSSDCA «Chronology of Mars Exploration»; адреси — `src/data/history.json`, речення — `docs/HISTORY.md` | science.nasa.gov, nssdc.gsfc.nasa.gov | правила NASA, як для описів: факти не захищені, тексти власні | 25.11.2026 |

Що зроблено з мапами: перезбережено як JPEG меншої ваги; з кілець узято одну смугу 1024 × 2 точки. Де на текстурі кілець зовнішній край кільця A — виміряно на самій текстурі (`ringTextureAOuterAt` у `src/config.ts`), щоб кільця стояли на своїх справжніх радіусах.

## Ще не використано — для фото, точок на Місяці й описів

| Що | Джерело | Умови | Стан |
|---|---|---|---|
| Описи тіл — запасний варіант | Вікіпедія українською, угорською, англійською | CC BY-SA 4.0 (рядок ліцензії внизу сторінки, прочитано 24.11.2026): потрібні підпис, посилання й та сама ліцензія для переробленого тексту | не беремо, поки є NASA |

## Для карти неба (режим «Небо звідси»)

| Що | Джерело | Ліцензія | Стан |
|---|---|---|---|
| Зорі: положення, яскравість, назви трьома мовами, сузір'я | Вікідані, запити до query.wikidata.org | CC0 — прочитано на сторінці https://www.wikidata.org/wiki/Wikidata:Copyright 24.11.2026: «All structured data from the main, Property, Lexeme, and EntitySchema namespaces is available under the Creative Commons CC0 License» | вивантажено, перевірено й зібрано в `src/data/stars.json` скриптом `scripts/stars/build.mjs`; див. `docs/research/STARS.md`; сирі відповіді — `docs/research/wikidata-stars-2026-11-24.tgz` |
| Лінії сузір'їв: які зорі з'єднано | d3-celestial 0.7.35 (npm), файл `data/constellations.lines.json` | BSD-3-Clause — прочитано у файлі `LICENSE` пакета 24.11.2026 (© 2015 Olaf Frohn; потрібно зберегти напис про авторство й текст ліцензії). У `readme.md` пакета джерелом названо сторінку сузір'їв IAU «з деякими змінами ліній» автора | беремо лише те, які зорі з'єднано (`src/data/constellations.json`); самі зорі й координати — з Вікіданих. Файл ліній і текст ліцензії лежать у `scripts/stars/` |
| Схеми сузір'їв IAU і Sky & Telescope (першоджерело ліній) | сторінка сузір'їв IAU, https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx | CC BY 4.0 — прочитано на самій сторінці 25.11.2026: «The charts below were produced in collaboration with Sky & Telescope magazine (Roger Sinnott and Rick Fienberg).», «The images are released under the Creative Commons Attribution 4.0 International license.»; загальні умови сайту — https://www.iau.org/IAU/IAU/Copyright.aspx?hkey=1faca2e1-14e3-4b49-833f-81ea3097ef9c (підпис «IAU») | 25.11.2026; у «Про програму» названо обох: d3-celestial і IAU / Sky & Telescope |
| Історії сузір'їв (`sky.story.about.*`, `sky.story.listed.*`) — власні тексти за статтями Вікіпедії англійською, українською й угорською; статті й версії кожної історії — `src/data/constellation-stories.json`, речення — `docs/CONSTELLATIONS.md`; хто вніс сузір'я до переліку — таблиця https://en.wikipedia.org/wiki/IAU_designated_constellations | Вікіпедія | CC BY-SA 4.0 — прочитано 25.11.2026 на https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use і https://en.wikipedia.org/wiki/Wikipedia:Reusing_Wikipedia_content (комерційне використання дозволене; посилання на статтю, назва ліцензії, ті самі умови для змінених текстів). За рішенням Дмитра 25.11 тексти історій — під тією самою ліцензією: посилання на статті й ліцензію під кожною історією та в «Про програму» | 25.11.2026 |
| Власні назви зір, затверджені Міжнародним астрономічним союзом, з позначеннями (`scripts/stars/proper-names.json`) | Вікіпедія, «List of proper names of stars», https://en.wikipedia.org/wiki/List_of_proper_names_of_stars | CC BY-SA 4.0 (рядок ліцензії внизу сторінки, прочитано 24.11.2026): потрібні підпис, посилання й та сама ліцензія для переробленого — файл у репозиторії лишається під CC BY-SA 4.0, підпис і посилання є в «Про програму» | 668 затверджених назв; першоджерело — список робочої групи союзу, його сайт 24.11.2026 не відповідав |
| Назви статей про яскраві зорі в англійській, українській та угорській Вікіпедіях | Вікідані (посилання записів на статті) | CC0 | для зір до 3,6 величини |
| Назви сузір'їв трьома мовами (`sky.constellations.*` у словниках) | Вікідані | CC0 | отримано 24.11.2026 для всіх 88; з угорських назв прибрано слово «csillagkép» |
| Міста: назви міст і країн трьома мовами, координати (`src/data/cities.json`, збирає `scripts/stars/cities.mjs`) | Вікідані | CC0 | 24.11.2026: столиці держав Європи й усі їхні міста від 100 тисяч мешканців — 607 міст. Без держав минулого й, за рішенням Дмитра, без міст Росії й Білорусі |
| У якому сузір'ї точка неба; де світило над обрієм; схід і захід | astronomy-engine (`Constellation`, `Horizon`, `DefineStar`, `SearchRiseSet`) | MIT | є в пакеті |
| Каталог XHIP у пакеті d3-celestial (`stars.6.json`) | — | Hipparcos, некомерційне | **лише для звірки** в розвідці; у програму не йде |

## Відхилено

- Каталог Hipparcos (ESA) — CC BY-NC 3.0 IGO, лише некомерційне використання (за пошуком).
- База HYG — сама CC BY-SA 4.0, але побудована на Hipparcos.
- Зорі з d3-celestial — з XHIP, розширеної збірки Hipparcos (сказано в його readme).
- Yale Bright Star Catalogue — чіткої ліцензії не знайдено.
