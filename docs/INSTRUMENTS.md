# Інструменти астрономів: джерела

Розділ з 11 карток (план і перелік погоджено з Дмитром 26.11.2026; детектора гравітаційних хвиль немає — рішення того ж дня). Сторінки джерел прочитано 25.11.2026.

- **Тексти карток** (`instruments.items` у словниках) — власні, трьома мовами, написані за реченнями нижче. Кожне речення перевірено програмою як дослівний уривок збереженої сторінки (152 цитати, 0 розбіжностей).
- **Джерела**: для телескопів, «Габбла» й «Вебба» — сторінки NASA (science.nasa.gov) і довідка ESA про «Габбл»; для решти — статті Вікіпедії англійською, українською й угорською. Версію кожної статті записано в `src/data/instruments.json`. Тексти Вікіпедії — CC BY-SA 4.0, тож під карткою, написаною за нею, стоять посилання на статті й на ліцензію. Картки «Габбла» й «Вебба» написано лише за сторінками NASA.
- **Схеми** намальовано для програми (`src/ui/diagrams/`), за реченнями про будову з джерел; пропорції умовні, і під кожною схемою так і сказано.
- **Гравюри** в чотирьох картках — з Вікісховища, суспільне надбання; сторінку кожного файла прочитано (нижче). Файли зменшено до 720 px і збережено як WebP.
- Що таке екліптика («the apparent path of the Sun on the celestial sphere») — стаття en.wikipedia «Ecliptic», версія 1387432437.

## Де джерела розходяться — і що написано в картках

| Що | Джерела | У картці |
|---|---|---|
| Вік гномона й сонячного годинника | en: найдавніші годинники — 1500 до н. е., найдавніший китайський гномон — 2300 до н. е.; uk: близько 3500 до н. е.; hu: V тис. до н. е. | лише дві конкретні знахідки з en; «з давнини» |
| Армілярна сфера | en: Китай (IV ст. до н. е., «possibly») і Греція (III ст. до н. е.); hu: Ератосфен, 255 до н. е. | «можливо, ще в IV столітті», без точного року |
| Астролябія | en: винахідника не називає; uk: 150 до н. е., Гіппарх; hu: I ст. н. е. | «елліністична доба», «часто називають Гіппарха» |
| Точність Тихо Браге | en: «approaching one arcminute», далі 1,5–2′; hu: 2′ | без числа: «значно точніші, ніж у попередників» |
| Телескоп Ньютона | en: 1668; hu: 1672; uk: «близько 1670» і 1667 | «від 1668 до 1672» |
| Перше астрофото | en: Даґер 1839 (невдало), Дрейпер 23.03.1840; uk: 1840 | обидві дати, як в en |
| Янський | en: 1932; uk: 1931 | «на початку 1930-х» |
| Висота орбіти «Габбла» | NASA: 483 км; ESA: 569 км | «кількасот кілометрів» |

Не взято: відкриття Урана Гершелем як приклад для рефлектора (зв'язок із дзеркальним телескопом — висновок, а не речення джерела); дефект дзеркала «Габбла» й ремонт 1993 року (є лише у Вікіпедії, а картку «Габбла» написано за NASA).


## Гномон і сонячний годинник

- Вікіпедія (en): Gnomon — https://en.wikipedia.org/wiki/Gnomon (версія 1371694159)
- Вікіпедія (en): Sundial — https://en.wikipedia.org/wiki/Sundial (версія 1386994960)
- Вікіпедія (uk): Гномон — https://uk.wikipedia.org/wiki/%D0%93%D0%BD%D0%BE%D0%BC%D0%BE%D0%BD (версія 45485879)
- Вікіпедія (uk): Сонячний годинник — https://uk.wikipedia.org/wiki/%D0%A1%D0%BE%D0%BD%D1%8F%D1%87%D0%BD%D0%B8%D0%B9_%D0%B3%D0%BE%D0%B4%D0%B8%D0%BD%D0%BD%D0%B8%D0%BA (версія 48228033)
- Вікіпедія (hu): Gnómon — https://hu.wikipedia.org/wiki/Gn%C3%B3mon (версія 25729841)
- Вікіпедія (hu): Napóra — https://hu.wikipedia.org/wiki/Nap%C3%B3ra (версія 28669567)

Речення джерел:
- [what] «In the narrowest sense of the word, it consists of a flat plate (the dial) and a gnomon, which casts a shadow onto the dial.» — https://en.wikipedia.org/wiki/Sundial
- [what] «A gnómon (gnomon, gnómón), avagy árnyékvető pálca az egyik legősibb és legegyszerűbb csillagászati mérőműszer: egy vízszintes alapon álló függőleges pálca.» — https://hu.wikipedia.org/wiki/Gn%C3%B3mon
- [how] «Спостерігаючи нахил і довжину тіні від гномона на горизонтальній площині, можна встановити висоту Сонця над горизонтом, його нахил орбіти, а, отже, й визначити час.» — https://uk.wikipedia.org/wiki/%D0%93%D0%BD%D0%BE%D0%BC%D0%BE%D0%BD
- [how] «As the Sun appears to move through the sky, the shadow aligns with different hour-lines, which are marked on the dial to indicate the time of day.» — https://en.wikipedia.org/wiki/Sundial
- [who_when] «A painted stick dating from 2300 BC that was excavated at the archeological site of Taosi is the oldest gnomon known in China.» — https://en.wikipedia.org/wiki/Gnomon
- [who_when] «The ancient Greek philosopher Anaximander (610–546 BC) is credited with introducing this Babylonian instrument to the Ancient Greeks.» — https://en.wikipedia.org/wiki/Gnomon
- [who_when] «The earliest sundials known from the archaeological record are shadow clocks (1500 BC or BCE) from ancient Egyptian astronomy and Babylonian astronomy.» — https://en.wikipedia.org/wiki/Sundial
- [found] «Проводячи такі вимірювання в моменти зимового й літнього сонцестояння, астрономи визначають також і нахил площини екліптики до екватора.» — https://uk.wikipedia.org/wiki/%D0%93%D0%BD%D0%BE%D0%BC%D0%BE%D0%BD

Картка: Гномон — це прямовисна палиця на рівній землі, один із найдавніших і найпростіших астрономічних інструментів. За довжиною й напрямком її тіні можна дізнатись, як високо стоїть Сонце, а отже — котра година. Сонячний годинник — той самий гномон із розміченою дошкою: за день тінь проходить від однієї годинної лінії до іншої. Найдавніший гномон, знайдений у Китаї, — пофарбована палиця приблизно 2300 року до н. е. Найдавніші відомі сонячні годинники — єгипетські й вавилонські, близько 1500 року до н. е. Грекам цей вавилонський інструмент, як вважають, приніс філософ Анаксимандр. — Що це дало: Час доби, а вимірювання тіні в дні сонцестояння — ще й нахил екліптики до небесного екватора.

## Армілярна сфера

- Вікіпедія (en): Armillary sphere — https://en.wikipedia.org/wiki/Armillary_sphere (версія 1380728957)
- Вікіпедія (en): Ecliptic — https://en.wikipedia.org/wiki/Ecliptic (версія 1387432437)
- Вікіпедія (uk): Армілярна сфера — https://uk.wikipedia.org/wiki/%D0%90%D1%80%D0%BC%D1%96%D0%BB%D1%8F%D1%80%D0%BD%D0%B0_%D1%81%D1%84%D0%B5%D1%80%D0%B0 (версія 42805197)
- Вікіпедія (hu): Armilláris gömb — https://hu.wikipedia.org/wiki/Armill%C3%A1ris_g%C3%B6mb (версія 27821998)

Речення джерел:
- [what] «An armillary sphere (variations are known as spherical astrolabe, armilla, or armil) is a model of objects in the sky (on the celestial sphere), consisting of a spherical framework of rings, centered on Earth or the Sun, that represent lines of celestial coordinate system and other astronomically important features, such as the ecliptic.» — https://en.wikipedia.org/wiki/Armillary_sphere
- [what] «Армілярна сфера (ще відома як сферична астролябія, армілла) — астрономічний інструмент, який використовували для визначення координат небесних світил.» — https://uk.wikipedia.org/wiki/%D0%90%D1%80%D0%BC%D1%96%D0%BB%D1%8F%D1%80%D0%BD%D0%B0_%D1%81%D1%84%D0%B5%D1%80%D0%B0
- [how] «The English name of this device comes ultimately from the Latin armilla (circle, bracelet), since it has a skeleton made of graduated metal circles linking the poles and representing the equator, the ecliptic, meridians and parallels.» — https://en.wikipedia.org/wiki/Armillary_sphere
- [how] «Usually a ball representing the Earth or, later, the Sun is placed in its center.» — https://en.wikipedia.org/wiki/Armillary_sphere
- [who_when] «It was invented separately, in ancient China possibly as early as the 4th century BC and ancient Greece during the 3rd century BC, with later uses in the Islamic world and Medieval Europe.» — https://en.wikipedia.org/wiki/Armillary_sphere
- [who_when] «The Greek astronomer Hipparchus (c. 190 – c. 120 BC) credited Eratosthenes (276 – 194 BC) as the inventor of the armillary sphere.» — https://en.wikipedia.org/wiki/Armillary_sphere
- [who_when] «Kr. e. 255-ben alkotta meg az első armilláris gömböt Eratoszthenész, görög matematikus.» — https://hu.wikipedia.org/wiki/Armill%C3%A1ris_g%C3%B6mb
- [found] «Before the advent of the European telescope in the 17th century, the armillary sphere was the prime instrument of all astronomers in determining celestial positions.» — https://en.wikipedia.org/wiki/Armillary_sphere

Гравюра: https://commons.wikimedia.org/wiki/File:EB1711_Armillary_Sphere.png
- Зі сторінки файла: «Armillary sphere, from Plate LXXXVII … Date 1771 Source Encyclopedia Britannica, Vol. II, pg. 681»
- Ліцензія зі сторінки файла: «This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 100 years or fewer.»
- Підпис у картці: Армілярна сфера: гравюра з «Британської енциклопедії», 1771 рік.

Картка: Модель неба з кілець. Градуйовані металеві кола зображають небесний екватор, екліптику — видимий шлях Сонця небесною сферою, — меридіани й паралелі. У середині зазвичай кулька: Земля, а в пізніших — Сонце. Сферою визначали координати небесних світил. Її винайшли окремо в Китаї — можливо, ще в IV столітті до н. е. — і в Греції у III столітті до н. е. Грецький астроном Гіппарх називав її винахідником Ератосфена. Пізніше нею користувались в ісламському світі й середньовічній Європі. — Що це дало: До появи телескопа в XVII столітті це був головний інструмент астрономів для визначення положень світил.

## Астролябія

- Вікіпедія (en): Astrolabe — https://en.wikipedia.org/wiki/Astrolabe (версія 1385561674)
- Вікіпедія (en): Ecliptic — https://en.wikipedia.org/wiki/Ecliptic (версія 1387432437)
- Вікіпедія (uk): Астролябія — https://uk.wikipedia.org/wiki/%D0%90%D1%81%D1%82%D1%80%D0%BE%D0%BB%D1%8F%D0%B1%D1%96%D1%8F (версія 48802646)
- Вікіпедія (hu): Asztrolábium — https://hu.wikipedia.org/wiki/Asztrol%C3%A1bium (версія 28570349)

Речення джерел:
- [what] «In its simplest form it is a metal disc with a pattern of wires, cutouts, and perforations that allows a user to calculate astronomical positions precisely.» — https://en.wikipedia.org/wiki/Astrolabe
- [how] «An astrolabe consists of a disk with a wide, raised rim, called the mater (mother), which is deep enough to hold one or more flat plates called tympans, or climates.» — https://en.wikipedia.org/wiki/Astrolabe
- [how] «Above the mater and tympan, the rete, a framework bearing a projection of the ecliptic plane and several pointers indicating the positions of the brightest stars, is free to rotate.» — https://en.wikipedia.org/wiki/Astrolabe
- [how] «When the astrolabe is held vertically, the alidade can be rotated and the sun or a star sighted along its length, so that its altitude in degrees can be read ("taken") from the graduated edge of the astrolabe; hence the word's Greek roots: "astron" (ἄστρον) = star + "lab-" (λαβ-) = to take.» — https://en.wikipedia.org/wiki/Astrolabe
- [who_when] «An astrolabe is essentially a plane (two-dimensional) version of an armillary sphere, which had already been invented in the Hellenistic period and had probably been used by Hipparchus to produce his star catalogue.» — https://en.wikipedia.org/wiki/Astrolabe
- [who_when] «Астролябія вперше з'явилася у стародавній Греції в елліністичний період в 150 році до н. е.. Її винайдення часто приписують Гіппарху.» — https://uk.wikipedia.org/wiki/%D0%90%D1%81%D1%82%D1%80%D0%BE%D0%BB%D1%8F%D0%B1%D1%96%D1%8F
- [who_when] «Az első asztrolábiumok megjelenése az i. sz. 1. századra tehető, de a megalkotásához szükséges matematikai háttér már az i. e. 3. században rendelkezésre állt Hipparkhosz és Apollóniosz jóvoltából.» — https://hu.wikipedia.org/wiki/Asztrol%C3%A1bium
- [found] «It is able to measure the altitude above the horizon of a celestial body, day or night; it can be used to identify stars or planets, to determine local latitude given local time (and vice versa), to survey, or to triangulate.» — https://en.wikipedia.org/wiki/Astrolabe

Гравюра: https://commons.wikimedia.org/wiki/File:Lot-stoffler-johannes-1452-1531-elucidatio-fabricae-usuque-astrolabii-6069643.jpg
- Зі сторінки файла: «Stöffler, Johannes (1452-1531). Elucidatio fabricae usuque astrolabii ... Ex secunda autoris recognitione. Oppenheim: Jakob Köbel, 1524. (Що саме намальовано — людина цілиться інструментом у верхівку вежі, підписи «Altitudo turris», «Radius visualis» — видно на самій сторінці книжки.)»
- Ліцензія зі сторінки файла: «This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 70 years or fewer.»
- Підпис у картці: Сторінка з книжки Йоганна Штеффлера про астролябію, 1524 рік: інструментом ціляться у верхівку вежі, щоб виміряти її висоту.

Картка: Металевий диск, яким можна і міряти, і рахувати. У заглибленні основи з градуйованим краєм лежать пласкі пластини, а над ними обертається ажурна рамка — rete — з колом екліптики й покажчиками найяскравіших зір. Ще одна деталь — лінійка з візирами: тримаючи астролябію прямовисно, нею ціляться в зорю чи Сонце і читають на краю висоту в градусах. По суті, це пласка версія армілярної сфери. З’явилась вона в елліністичну добу; хто саме її винайшов, джерела кажуть по-різному — часто називають Гіппарха. Назва складена з грецьких слів «зоря» і «брати»: нею «беруть» висоту зорі. — Що це дало: Висоту світила над обрієм удень і вночі; нею впізнавали зорі й планети, а за часом визначали широту місця — і навпаки.

## Квадрант і стінний квадрант

- Вікіпедія (en): Quadrant (instrument) — https://en.wikipedia.org/wiki/Quadrant_(instrument) (версія 1385664537)
- Вікіпедія (en): Mural instrument — https://en.wikipedia.org/wiki/Mural_instrument (версія 1372871303)
- Вікіпедія (en): Tycho Brahe — https://en.wikipedia.org/wiki/Tycho_Brahe (версія 1385564332)
- Вікіпедія (uk): Квадрант (інструмент) — https://uk.wikipedia.org/wiki/%D0%9A%D0%B2%D0%B0%D0%B4%D1%80%D0%B0%D0%BD%D1%82_(%D1%96%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82) (версія 49236315)
- Вікіпедія (uk): Тихо Браге — https://uk.wikipedia.org/wiki/%D0%A2%D0%B8%D1%85%D0%BE_%D0%91%D1%80%D0%B0%D0%B3%D0%B5 (версія 48900560)
- Вікіпедія (hu): Kvadráns — https://hu.wikipedia.org/wiki/Kvadr%C3%A1ns (версія 21195329)
- Вікіпедія (hu): Tycho Brahe — https://hu.wikipedia.org/wiki/Tycho_Brahe (версія 28973836)

Речення джерел:
- [what] «A quadrant is an instrument used to measure angles up to 90°.» — https://en.wikipedia.org/wiki/Quadrant_(instrument)
- [what] «A mural instrument is an angle measuring instrument mounted on or built into a wall. For astronomical purposes, these walls were oriented so they lie precisely on the meridian.» — https://en.wikipedia.org/wiki/Mural_instrument
- [how] «An observer can move a device with a second indicator along the arc until the line of sight from the movable device's indicator through the indicator at the centre of the arc aligns with the astronomical object. The angle is then read, yielding the elevation or altitude of the object.» — https://en.wikipedia.org/wiki/Mural_instrument
- [who_when] «It was first proposed by Ptolemy as a better kind of astrolabe.» — https://en.wikipedia.org/wiki/Quadrant_(instrument)
- [who_when] «Tycho Brahe created one of the largest mural quadrants.» — https://en.wikipedia.org/wiki/Quadrant_(instrument)
- [who_when] «Tycho was the last major astronomer to work without the aid of a telescope, soon to be turned skyward by Galileo Galilei and others.» — https://en.wikipedia.org/wiki/Tycho_Brahe
- [found] «With an accuracy approaching one arcminute, his celestial positions were much more accurate than those of any predecessor or contemporary – about five times as accurate as the observations of Wilhelm of Hesse.» — https://en.wikipedia.org/wiki/Tycho_Brahe
- [found] «Before his death in 1601, he was assisted for a year by Johannes Kepler, who went on to use Tycho's data to develop his own three laws of planetary motion.» — https://en.wikipedia.org/wiki/Tycho_Brahe

Гравюра: https://commons.wikimedia.org/wiki/File:Tycho-Brahe-Mural-Quadrant.jpg
- Зі сторінки файла: «Tycho Brahe's mural quadrant in Uranienborg (Uraniborg). … The observer (right) views a star through the opposite opening (upper left) to determine the star's altitude as it passes through the meridian. An assistant (lower right) reads the time off a clock and another one (lower left) records the measurements. … Source Engraving from the book: Tycho Brahe (1598), Astronomiae instauratae mechanica»
- Ліцензія зі сторінки файла: «This is a faithful photographic reproduction of a two-dimensional, public domain work of art. The work of art itself is in the public domain for the following reason: Public domainPublic domainfalsefalse This work is in the public domain in its country of origin and other countries and areas where the copyright term is the author's life plus 100 years or fewer.»
- Підпис у картці: Стінний квадрант Тихо Браге в Ураніборзі: гравюра з його книжки 1598 року. Спостерігач праворуч дивиться на зорю крізь отвір угорі ліворуч; один помічник читає час із годинника, другий записує виміри.

Картка: Квадрант — інструмент, що міряє кути до 90°. Стінний квадрант закріплено на стіні, яка стоїть точно вздовж меридіана. Спостерігач пересуває візир уздовж дуги, доки лінія від нього через візир у центрі дуги не вкаже на світило, — і читає на дузі його висоту. Квадрант запропонував ще Птолемей — як кращу заміну астролябії. Один із найбільших стінних квадрантів зробив данський астроном Тихо Браге — останній великий астроном, який працював без телескопа. — Що це дало: Положення світил, значно точніші, ніж у всіх попередників Тихо Браге. Його помічник Йоганн Кеплер вивів із цих вимірів три закони руху планет.

## Телескоп-рефрактор

- Вікіпедія (en): Refracting telescope — https://en.wikipedia.org/wiki/Refracting_telescope (версія 1377068574)
- Вікіпедія (en): Telescope — https://en.wikipedia.org/wiki/Telescope (версія 1387365661)
- Вікіпедія (uk): Рефрактор — https://uk.wikipedia.org/wiki/%D0%A0%D0%B5%D1%84%D1%80%D0%B0%D0%BA%D1%82%D0%BE%D1%80 (версія 47587464)
- Вікіпедія (uk): Телескоп — https://uk.wikipedia.org/wiki/%D0%A2%D0%B5%D0%BB%D0%B5%D1%81%D0%BA%D0%BE%D0%BF (версія 48269399)
- Вікіпедія (hu): Távcső — https://hu.wikipedia.org/wiki/T%C3%A1vcs%C5%91 (версія 28949643)
- https://science.nasa.gov/universe/telescopes-101/

Речення джерел:
- [what] «A telescope using a lens for its main optical element is called a refracting telescope.» — https://science.nasa.gov/universe/telescopes-101/
- [how] «Like eyeglasses, the lenses bend, or refract, light passing through them.» — https://science.nasa.gov/universe/telescopes-101/
- [how] «Refracting telescopes typically have a lens at the front, then a long tube, then an eyepiece or instrumentation at the rear, where the telescope view comes to focus.» — https://en.wikipedia.org/wiki/Refracting_telescope
- [how] «It used a convergent (plano-convex) objective lens and a divergent (plano-concave) eyepiece lens (Galileo, 1610).» — https://en.wikipedia.org/wiki/Refracting_telescope
- [who_when] «The first record of a refracting telescope appeared in the Netherlands about 1608, when a spectacle maker from Middelburg named Hans Lippershey unsuccessfully tried to patent one.» — https://en.wikipedia.org/wiki/Refracting_telescope
- [who_when] «News of the patent spread fast and Galileo Galilei, happening to be in Venice in the month of May 1609, heard of the invention, constructed a version of his own, and applied it to making astronomical discoveries.» — https://en.wikipedia.org/wiki/Refracting_telescope
- [who_when] «Elsőként Galilei használta a távcsövet csillagászati megfigyelésekhez: vele fedezte fel a Jupiter négy holdját, a Vénusz fázisváltozásait és a Hold hegyeit.» — https://hu.wikipedia.org/wiki/T%C3%A1vcs%C5%91
- [found] «He used it to view craters on the Moon, the four largest moons of Jupiter, and the phases of Venus.» — https://en.wikipedia.org/wiki/Refracting_telescope

Гравюра: https://commons.wikimedia.org/wiki/File:Houghton_Typ_620.73.451_-_Johannes_Hevelius%2C_Machinae_coelestis%2C_1673.jpg
- Зі сторінки файла: «A 45 m (148 ft) focal length Keplerian astronomical refracting telescope built by Johannes Hevelius … Fig. AA from Machinae coelestis, 1673, by Johannes Hevelius (1611-1687). Typ 620.73.451, Houghton Library, Harvard University»
- Ліцензія зі сторінки файла: «This is a media file that Houghton Library believes to be in the public domain of the United States. This applies to a work published before January 1, 1923, or the unpublished work of an author who died more than 70 years ago. Houghton Library and Harvard University claim no rights in this photographic reproduction of the work, and the image is free to download and reproduce for any use, commerci»
- Підпис у картці: Телескоп Яна Гевелія з фокусною відстанню 45 метрів: гравюра з його книжки «Machinae coelestis», 1673 рік. Скан бібліотеки Гоутона Гарвардського університету.

Картка: Телескоп, у якого головна частина — лінза. Спереду стоїть велика опукла лінза, далі довга труба, а позаду — окуляр. Лінзи заломлюють світло, як скельця окулярів: передня збирає промені зорі докупи, а окуляр подає їх в око. Першу згадку про таку трубу залишив близько 1608 року майстер окулярів Ганс Ліпперсгей з нідерландського Мідделбурга: він пробував її запатентувати, та не вийшло. 1609 року про винахід почув Галілео Галілей, зробив власну трубу — з опуклою лінзою спереду й увігнутою біля ока — і першим узявся спостерігати нею небо. — Що це дало: Кратери на Місяці, чотири найбільші супутники Юпітера і фази Венери.

## Телескоп-рефлектор

- Вікіпедія (en): Reflecting telescope — https://en.wikipedia.org/wiki/Reflecting_telescope (версія 1387707989)
- Вікіпедія (uk): Рефлектор (телескоп) — https://uk.wikipedia.org/wiki/%D0%A0%D0%B5%D1%84%D0%BB%D0%B5%D0%BA%D1%82%D0%BE%D1%80_(%D1%82%D0%B5%D0%BB%D0%B5%D1%81%D0%BA%D0%BE%D0%BF) (версія 44338296)
- Вікіпедія (hu): Távcső — https://hu.wikipedia.org/wiki/T%C3%A1vcs%C5%91 (версія 28949643)
- https://science.nasa.gov/universe/telescopes-101/

Речення джерел:
- [what] «A telescope that uses a mirror as its primary optical element is called a reflecting telescope.» — https://science.nasa.gov/universe/telescopes-101/
- [how] «Newton's telescope used a spherically ground metal primary mirror and a small diagonal mirror in an optical configuration that has come to be known as the Newtonian telescope.» — https://en.wikipedia.org/wiki/Reflecting_telescope
- [how] «A flat secondary mirror reflects the light to a focal plane at the side of the top of the telescope tube.» — https://en.wikipedia.org/wiki/Reflecting_telescope
- [how] «Плоске діагональне дзеркало, розташоване поблизу фокусу, відхиляє пучок світла за межі труби, де зображення розглядається через окуляр або фотографується.» — https://uk.wikipedia.org/wiki/%D0%A0%D0%B5%D1%84%D0%BB%D0%B5%D0%BA%D1%82%D0%BE%D1%80_(%D1%82%D0%B5%D0%BB%D0%B5%D1%81%D0%BA%D0%BE%D0%BF)
- [who_when] «Five years after Gregory designed his telescope and five years before Hooke built the first such Gregorian telescope, Isaac Newton in 1668 built his own reflecting telescope, which is considered the first reflecting telescope, as previous designs were never put into practice or ended in failure when attempted.» — https://en.wikipedia.org/wiki/Reflecting_telescope
- [who_when] «Az első tükrös távcsövet (reflektort) 1672-ben építette Isaac Newton, miután a fénytörés jelenségét vizsgálva ráébredt arra, hogy nemcsak a prizmák de a lencsék is színeire bontják a fehér fényt, azaz a csillagok fehér pontok helyett színes foltok lesznek.» — https://hu.wikipedia.org/wiki/T%C3%A1vcs%C5%91
- [found] «Almost all of the major telescopes used in astronomy research are reflectors.» — https://en.wikipedia.org/wiki/Reflecting_telescope
- [found] «On 13 March 1781 while making observations he made note of a new object in the constellation of Gemini. This would, after several weeks of verification and consultation with other astronomers, be confirmed to be a new planet, eventually given the name of Uranus.» — https://en.wikipedia.org/wiki/William_Herschel

Картка: Телескоп, у якого головна частина — дзеркало. У телескопі Ньютона світло падає на вгнуте металеве дзеркало на дні труби й відбивається назад, до фокуса. Маленьке пласке дзеркало, поставлене навскоси біля фокуса, відводить пучок убік, за межі труби, — там на нього дивляться крізь окуляр. Перший справний дзеркальний телескоп збудував Ісаак Ньютон; джерела називають різні роки — від 1668 до 1672. Він помітив, що лінзи, як і призми, розкладають біле світло на кольори, і зорі в лінзовому телескопі стають кольоровими плямками. — Що це дало: Майже всі великі телескопи, якими сьогодні працює наука, — дзеркальні. «Габбл» і «Вебб» теж.

## Спектроскоп

- Вікіпедія (en): Astronomical spectroscopy — https://en.wikipedia.org/wiki/Astronomical_spectroscopy (версія 1386664342)
- Вікіпедія (en): Optical spectrometer — https://en.wikipedia.org/wiki/Optical_spectrometer (версія 1382038304)
- Вікіпедія (uk): Астроспектроскопія — https://uk.wikipedia.org/wiki/%D0%90%D1%81%D1%82%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D1%81%D0%BA%D0%BE%D0%BF%D1%96%D1%8F (версія 49018492)
- Вікіпедія (uk): Спектроскоп — https://uk.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D1%81%D0%BA%D0%BE%D0%BF (версія 30797023)
- Вікіпедія (hu): Csillagászati színképelemzés — https://hu.wikipedia.org/wiki/Csillag%C3%A1szati_sz%C3%ADnk%C3%A9pelemz%C3%A9s (версія 29189796)
- https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-spectroscopy/

Речення джерел:
- [what] «The spectrometer uses a prism or a grating to spread the light into a spectrum.» — https://en.wikipedia.org/wiki/Optical_spectrometer
- [who_when] «Spectroscopy, the study of light and its component parts, had its beginnings in the 17th century when Isaac Newton passed a beam of sunlight shining through a pinhole in a covered window through a prism.» — https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-spectroscopy/
- [how] «When light from a cosmic object enters one of Hubble’s spectrographs, it passes through a tiny slit in a metal plate that isolates it from the light of other objects. The light then bounces off a special metal grating, called a diffraction grating, that splits the light into its component wavelengths, focusing them onto a detector that records them as a spectrum.» — https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-spectroscopy/
- [how] «Hot solid objects produce light with a continuous spectrum, hot gases emit light at specific wavelengths, and hot solid objects surrounded by cooler gases show a near-continuous spectrum with dark lines corresponding to the emission lines of the gases.» — https://en.wikipedia.org/wiki/Astronomical_spectroscopy
- [who_when] «Joseph von Fraunhofer developed the first modern spectroscope by combining a prism, diffraction slit and telescope in a manner that increased the spectral resolution and was reproducible in other laboratories.» — https://en.wikipedia.org/wiki/Optical_spectrometer
- [who_when] «In the 1850s, Gustav Kirchhoff and Robert Bunsen described the phenomena behind these dark lines.» — https://en.wikipedia.org/wiki/Astronomical_spectroscopy
- [found] «By comparing the absorption lines of the Sun with emission spectra of known gases, the chemical composition of stars can be determined.» — https://en.wikipedia.org/wiki/Astronomical_spectroscopy
- [found] «У 1863 році британський астроном Вільям Гаґґінс довів за допомогою спектроскопа, що зорі складаються з тих самих елементів, які наявні й на Землі.» — https://uk.wikipedia.org/wiki/%D0%A1%D0%BF%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D1%81%D0%BA%D0%BE%D0%BF

Картка: Прилад, що розгортає світло у спектр — смугу кольорів. Світло зорі проходить крізь вузьку щілину, а далі призма або дифракційна ґратка розкладає його за довжинами хвиль. Розпечене тверде тіло дає суцільний спектр, розпечений газ світить лише на окремих довжинах хвиль, а коли гаряче тіло оточене холоднішим газом, у спектрі з’являються темні лінії — там, де світив би цей газ. Початок поклав у XVII столітті Ісаак Ньютон, пропустивши промінь сонця крізь призму. Перший сучасний спектроскоп — призму, щілину й зорову трубу разом — зробив Йозеф фон Фраунгофер. У 1850-х Густав Кірхгоф і Роберт Бунзен пояснили, звідки беруться темні лінії. — Що це дало: З чого складаються зорі: порівнюючи темні лінії з лініями відомих газів, визначають їхній хімічний склад. 1863 року Вільям Гаґґінс довів спектроскопом, що зорі складаються з тих самих елементів, які є й на Землі.

## Фотопластинка

- Вікіпедія (en): Astrophotography — https://en.wikipedia.org/wiki/Astrophotography (версія 1387379009)
- Вікіпедія (uk): Астрофотографія — https://uk.wikipedia.org/wiki/%D0%90%D1%81%D1%82%D1%80%D0%BE%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D1%96%D1%8F (версія 48898143)

Речення джерел:
- [what] «Astrophotography, also known as astronomical imaging, is the photography or imaging of astronomical objects, celestial events, or areas of the night sky.» — https://en.wikipedia.org/wiki/Astrophotography
- [how] «With a few exceptions, astronomical photography employs long exposures since both film and digital imaging devices can accumulate light photons over long periods of time.» — https://en.wikipedia.org/wiki/Astrophotography
- [how] «Specialized and ever-larger optical telescopes were constructed as essentially big cameras to record images on photographic plates.» — https://en.wikipedia.org/wiki/Astrophotography
- [who_when] «John William Draper, New York University professor of chemistry, physician and scientific experimenter managed to make the first successful photograph of the Moon a year later on 23 March 1840, taking a 20-minute-long daguerreotype image using a 5-inch (13 cm) reflecting telescope.» — https://en.wikipedia.org/wiki/Astrophotography
- [who_when] «The first photograph of a star other than the Sun was a daguerreotype of the star Vega by astronomer William Cranch Bond and daguerreotype photographer and experimenter John Adams Whipple, on 16 and 17 July 1850 with Harvard College Observatory's 15 inch great refractor.» — https://en.wikipedia.org/wiki/Astrophotography
- [who_when] «Перша спроба зробити астрознімок належить Луї Даґеру (Louis Jacques Mandé Daguerre) — винахідникові процесу дагеротипії (який названо його іменем), який спробував зробити фотографію Місяця 1839 року.» — https://uk.wikipedia.org/wiki/%D0%90%D1%81%D1%82%D1%80%D0%BE%D1%84%D0%BE%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D1%96%D1%8F
- [found] «These images for the first time showed stars too faint to be seen by the human eye.» — https://en.wikipedia.org/wiki/Astrophotography
- [found] «Photography using extended exposure-times revolutionized the field of professional astronomical research, recording hundreds of thousands of new stars, and nebulae invisible to the human eye.» — https://en.wikipedia.org/wiki/Astrophotography

Картка: Фотопластинку ставлять у телескоп замість ока. На відміну від ока, вона збирає світло довго, тож на знімку з довгою витримкою проступає те, чого оком не побачити. Великі телескопи почали будувати як величезні фотоапарати. Першим сфотографувати Місяць спробував 1839 року Луї Даґер, винахідник дагеротипії. Перший вдалий знімок Місяця зробив 23 березня 1840 року Джон Вільям Дрейпер: витримка 20 хвилин, дзеркальний телескоп 13 см. Першу зорю, окрім Сонця, — Вегу — зняли в липні 1850 року в обсерваторії Гарвардського коледжу. — Що це дало: Сотні тисяч нових зір і туманностей, невидимих для ока.

## Радіотелескоп

- Вікіпедія (en): Radio telescope — https://en.wikipedia.org/wiki/Radio_telescope (версія 1387330469)
- Вікіпедія (uk): Радіотелескоп — https://uk.wikipedia.org/wiki/%D0%A0%D0%B0%D0%B4%D1%96%D0%BE%D1%82%D0%B5%D0%BB%D0%B5%D1%81%D0%BA%D0%BE%D0%BF (версія 47379296)
- Вікіпедія (hu): Rádiótávcső — https://hu.wikipedia.org/wiki/R%C3%A1di%C3%B3t%C3%A1vcs%C5%91 (версія 29521725)
- https://science.nasa.gov/universe/telescopes-101/

Речення джерел:
- [what] «A radio telescope is a specialized antenna and radio receiver used to detect radio waves from astronomical radio sources in the sky.» — https://en.wikipedia.org/wiki/Radio_telescope
- [how] «Radio telescopes are typically large parabolic ("dish") antennas similar to those employed in tracking and communicating with satellites and space probes.» — https://en.wikipedia.org/wiki/Radio_telescope
- [how] «Radio dishes may not look like traditional mirrors, but they’re reflective to radio waves.» — https://science.nasa.gov/universe/telescopes-101/
- [how] «Вони збирають радіохвилі у фокусі металевого увігнутого дзеркала, яке можна зробити ґратчастим і величезних розмірів — діаметром у десятки метрів.» — https://uk.wikipedia.org/wiki/%D0%A0%D0%B0%D0%B4%D1%96%D0%BE%D1%82%D0%B5%D0%BB%D0%B5%D1%81%D0%BA%D0%BE%D0%BF
- [who_when] «Radio waves from space were first detected by engineer Karl Guthe Jansky in 1932 at Bell Telephone Laboratories in Holmdel, New Jersey using an antenna built to study radio receiver noise.» — https://en.wikipedia.org/wiki/Radio_telescope
- [who_when] «The first purpose-built radio telescope was a 9-meter parabolic dish constructed by radio amateur Grote Reber in his back yard in Wheaton, Illinois in 1937.» — https://en.wikipedia.org/wiki/Radio_telescope
- [found] «Thus Jansky suspected that the hiss originated outside of the Solar System, and by comparing his observations with optical astronomical maps, Jansky concluded that the radiation was coming from the Milky Way Galaxy and was strongest in the direction of the center of the galaxy, in the constellation of Sagittarius.» — https://en.wikipedia.org/wiki/Radio_telescope
- [found] «Besides observing energetic objects such as pulsars and quasars, radio telescopes are able to "image" most astronomical objects such as galaxies, nebulae, and even radio emissions from planets.» — https://en.wikipedia.org/wiki/Radio_telescope

Картка: Антена з радіоприймачем, що ловить радіохвилі з неба. Зазвичай це велика «тарілка» — увігнуте металеве дзеркало, яке можна зробити ґратчастим і завбільшки в десятки метрів: воно збирає радіохвилі у фокусі, де стоїть приймач. Радіохвилі з космосу першим помітив на початку 1930-х інженер Карл Янський — антеною, збудованою, щоб вивчати шуми радіоприймачів. Він дійшов висновку, що шипіння йде з Чумацького Шляху і найсильніше воно з боку центру Галактики, у сузір’ї Стрільця. Перший справжній радіотелескоп — дев’ятиметрову тарілку — 1937 року поставив у себе на подвір’ї радіоаматор Ґроут Ребер. — Що це дало: Пульсари й квазари, а ще «радіопортрети» галактик, туманностей і навіть радіовипромінювання планет.

## Космічний телескоп «Габбл»

- https://esahubble.org/about/general/fact_sheet/
- https://science.nasa.gov/mission/hubble/observatory/
- https://science.nasa.gov/mission/hubble/observatory/design/
- https://science.nasa.gov/mission/hubble/overview/why-have-a-telescope-in-space/
- https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-spectroscopy/

Речення джерел:
- [what] «The Hubble Space Telescope is the first astronomical observatory placed into orbit around Earth with the ability to record images in wavelengths of light spanning ultraviolet to near infrared.» — https://science.nasa.gov/mission/hubble/observatory/
- [how] «Light hitting the telescope’s main, or primary, mirror is reflected to a smaller, secondary mirror suspended above the primary. The secondary, in turn, reflects the light back through a hole in the primary, where it enters Hubble’s instruments (cameras and spectrographs) for final focus before it hits their detectors.» — https://science.nasa.gov/mission/hubble/observatory/design/
- [how] «In addition to blocking certain wavelengths of light altogether, Earth’s atmosphere is made up of shifting pockets of air that cause the twinkling appearance of stars in the night sky. This motion blurs images captured by telescopes on the ground. Hubble was placed into orbit above the atmosphere to avoid these effects.» — https://science.nasa.gov/mission/hubble/overview/why-have-a-telescope-in-space/
- [who_when] «Launched on April 24, 1990 aboard the space shuttle Discovery, Hubble orbits roughly 300 miles (483 km) above Earth’s surface.» — https://science.nasa.gov/mission/hubble/observatory/
- [who_when] «The Hubble Space Telescope is a joint ESA/NASA project and was launched in 1990 by the Space Shuttle mission STS-31 into a low-Earth orbit 569 km above the ground.» — https://esahubble.org/about/general/fact_sheet/
- [who_when] «Hubble was launched on STS-31 in 1990, but its main mirror had been ground incorrectly, resulting in spherical aberration that compromised the telescope's capabilities. The optics were corrected to their intended quality by a servicing mission, STS-61, in 1993.» — https://en.wikipedia.org/wiki/Hubble_Space_Telescope
- [found] «Before the launch of HST, estimates of the Hubble constant typically had errors of up to 50%, but Hubble measurements of Cepheid variables in the Virgo Cluster and other distant galaxy clusters provided a measured value with an accuracy of ±10%, which is consistent with other more accurate measurements made since Hubble's launch using other techniques.» — https://en.wikipedia.org/wiki/Hubble_Space_Telescope
- [found] «Hubble was the first telescope to detect and analyze an atmosphere around a planet outside of our solar system.» — https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/hubble-spectroscopy/

Картка: Перша астрономічна обсерваторія на орбіті Землі, що знімає у світлі від ультрафіолетового до ближнього інфрачервоного. Світло падає на головне дзеркало, відбивається на менше, вторинне, а те посилає його назад крізь отвір у головному — до камер і спектрографів. Навіщо в космос: повітря Землі частину світла не пропускає зовсім, а його рухливі шари розмивають зображення — через них зорі й мерехтять. Запущений 24 квітня 1990 року на шатлі «Діскавері». Літає довкола Землі на висоті кількохсот кілометрів — над атмосферою. — Що це дало: Першим знайшов і дослідив атмосферу планети за межами Сонячної системи.

## Космічний телескоп «Джеймс Вебб»

- https://science.nasa.gov/mission/webb/about-overview/
- https://science.nasa.gov/mission/webb/science-overview/
- https://science.nasa.gov/mission/webb/webbs-mirrors/
- https://science.nasa.gov/mission/webb/webbs-sunshield/

Речення джерел:
- [what] «The James Webb Space Telescope (JWST) is a space telescope designed to conduct infrared astronomy.» — https://en.wikipedia.org/wiki/James_Webb_Space_Telescope
- [how] «The 18 hexagonal primary miror segements are precisely aligned to act as one large concave primary mirror which first gathers light and focuses it onto the round convex secondary mirror that lies at the end of Webb's long folding booms. The secondary mirror reflects the light back to the concave rectangular tertiery mirror which reflects it to the flat fine steering mirror from which light travels into Webb's instruments.» — https://science.nasa.gov/mission/webb/webbs-mirrors/
- [how] «Each mirror segment has a very thin coating of gold applied. Gold improves the mirror's reflection of infrared light.» — https://science.nasa.gov/mission/webb/webbs-mirrors/
- [how] «Webb is an infrared telescope, its mirrors and sensors need to be kept at extremely cold temperatures to detect faint heat signals from distant objects in the universe.» — https://science.nasa.gov/mission/webb/webbs-sunshield/
- [who_when] «Webb was launched on Dec 25, 2021 on from French Guiana on an Arianne 5 rocket. Webb orbits the Sun 1.5 million kilometers from the Earth.» — https://science.nasa.gov/mission/webb/about-overview/
- [who_when] «Webb was formerly known as the “Next Generation Space Telescope” (NGST); it was renamed in Sept. 2002 after a former NASA administrator.» — https://science.nasa.gov/mission/webb/about-overview/
- [found] «Webb is allowing astronomers to see, for the first time, the era in the early universe when the first stars and galaxies formed.» — https://science.nasa.gov/mission/webb/science-overview/
- [found] «Webb’s infrared-detecting technology reveals the hidden universe to our eyes: stars shrouded in clouds of dust, water in the atmospheres of other worlds, and the first light from some of the earliest galaxies ever formed.» — https://science.nasa.gov/mission/webb/science-overview/

Картка: Інфрачервоний телескоп. Його головне дзеркало складене з 18 шестикутних сегментів, що працюють як одне велике вгнуте дзеркало; кожен укрито дуже тонким шаром золота — воно краще відбиває інфрачервоне світло. Щоб уловити слабке тепло далеких об’єктів, дзеркала й датчики мають бути вкрай холодними, тому від світла й тепла телескоп захищає сонцезахисний екран. Запущений 25 грудня 2021 року з Французької Гвіани ракетою «Аріан-5». Обертається довкола Сонця за 1,5 мільйона кілометрів від Землі. Раніше звався «Космічний телескоп наступного покоління»; 2002 року його перейменували на честь колишнього керівника NASA. — Що це дало: Час, коли утворились перші зорі й галактики; зорі, сховані в хмарах пилу; воду в атмосферах інших світів.
