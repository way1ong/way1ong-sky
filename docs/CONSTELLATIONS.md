# Історії сузір'їв: речення Вікіпедії під текстами карток

Історії `sky.story.about.*` і рядок `sky.story.listed.*` у словниках (`src/i18n/*.json`) написано власними словами трьома мовами за статтями Вікіпедії. Кожне твердження спирається на речення нижче: їх списано зі сторінок дослівно й звірено програмою як уривки збереженого тексту сторінки (25.11.2026). Адреси й версії статей — `src/data/constellation-stories.json`. Як обрано джерело й що кажуть його умови — `docs/research/CONSTELLATIONS.md`.

Друга половина (Лебідь, Ліра, Орел, Великий і Малий Пес, Лев, Волопас, Діва, Скорпіон, Змієносець) зібрана так само того ж дня. Позначки, які стоять на самих сторінках Вікіпедії: розділи «Mythology» англійських статей про Орла й Велику Ведмедицю та вся англійська стаття про Скорпіона мають позначку «потрібні додаткові посилання»; угорські статті про Діву й Скорпіона — позначку про брак незалежних джерел.

Тексти історій — під ліцензією статей, CC BY-SA 4.0 (рішення Дмитра 25.11.2026): посилання на статті й ліцензію стоять під кожною історією в картці й у «Про програму».

Де мовні версії розповідають міф по-різному, історія каже «за однією з версій» або називає обидві. Найяскравішу зорю, місяць найкращих вечорів і висоту рахує програма — із Вікіпедії їх не взято.

## Що таке сузір'я (`sky.story.area`, рядок «в межах сузір'я» в картці зорі)

- In contrast to the historical and Indigenous concepts of constellations as patterns of light points in the night sky, such as the Chinese star chains or the lists of stars under a common headline in historical star catalogues, the IAU defines a constellation as an area in the sky surrounded by its boundary. (https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx)
- Nowadays, when astronomers say something is “in” a given constellation, they mean it is simply within those defined boundaries, not that it is part of any star pattern. (https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx)
- For IAU constellations, no stick figures or figurative painting styles are formally defined. (https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx)

## Хто вніс до переліку (`sky.story.listed.*`, `sky.story.iau`) — для кожного з 88 сузір'їв

Хто й коли — зі стовпців таблиці https://en.wikipedia.org/wiki/IAU_designated_constellations (версія 1387250710), розкладено в `src/data/constellation-origins.json`: 47 рядків «ancient / Ptolemy», 14 — «1756 / Lacaille», 12 — «1598 / Plancius, Keyser, de Houtman», 7 — «1690 / Hevelius», 4 — «Plancius» (1589, 1592, 1613 двічі), 3 — «ancient; 1756 / Ptolemy, Lacaille» (Carina, Puppis, Vela), 1 — «ancient; 1536 / Ptolemy; Caspar Vopel» (Coma Berenices).

### Давні сузір'я (Птолемей)

- It is one of the 88 modern constellations; it was among the 48 constellations listed by the 2nd-century AD astronomer Ptolemy. (https://en.wikipedia.org/wiki/Orion_(constellation), версія 1387071981)
- Це було одне з 48 сузір'їв, перелічених астрономом Птолемеєм у II столітті нашої ери у його «Альмагесті» , який назвав його Великим Сузір'ям (Arktos Megale). (https://uk.wikipedia.org/wiki/Велика_Ведмедиця, версія 48449664)
- Включене до каталогу зоряного неба Клавдія Птолемея «Альмагест» , складеного в середині II століття . (https://uk.wikipedia.org/wiki/Велика_Ведмедиця, версія 48449664)
- З часів Птолемея Андромеда залишається сузір'ям і офіційно визнана Міжнародним астрономічним союзом (МАС) . (https://uk.wikipedia.org/wiki/Андромеда_(сузір'я), версія 49173364)
- században élt Klaudiosz Ptolemaiosz görög csillagász felsorolt, és egyike annak a 88 csillagképnek, amelyet a Nemzetközi Csillagászati Unió is elismer. (https://hu.wikipedia.org/wiki/Lant_csillagkép, версія 27074368 — кінець речення; початок обірвано крапкою після числа століття)
- At its first General Assembly held in Rome in 1922, the IAU's Commission on Notations and Units agreed on a list of 88 constellations (https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx)
- Таблиця https://en.wikipedia.org/wiki/IAU_designated_constellations (версія 1387250710): для кожного сузір'я з історією в стовпцях походження стоїть «ancient» і «Ptolemy».

### Сузір'я нового часу

Речення зі сторінки https://en.wikipedia.org/wiki/IAU_designated_constellations (версія 1387250710):

- The most notable of these is Argo Navis , which was one of Ptolemy's original 48 constellations.
- In the 1750s, the French astronomer Nicolas Louis de Lacaille divided this into three separate constellations: Carina , Puppis , and Vela .
- The constellations were based on observations by Dutch navigators Pieter Dirkszoon Keyser and Frederick de Houtman , who were commissioned by Plancius to chart the southern sky on a voyage to what is now Indonesia. (примітка до рядків «1598»)
- It is no longer clear who formed the observations into the constellations shown on the globe, and modern authors generally give credit to some combination of Kaiser, de Houtmann, and Plancius. (та сама примітка — тому в картці не сказано, хто саме «ввів» ці сузір'я)
- The constellations Camelopardalis , Columba , and Monoceros , formed by Petrus Plancius in 1592 and in 1613, are often erroneously attributed to Jacob Bartsch and Augustin Royer . (примітка до рядків «Plancius»)

Про Гевелія сторінка має лише рядки таблиці («1690 / Hevelius»); про Південний Хрест — рядок «1589 / Plancius».

Волосся Вероніки — зі статті https://en.wikipedia.org/wiki/Coma_Berenices (версія 1387147135):

- Similarly, Ptolemy did not include it among his 48 constellations in the Almagest ; considering it part of Leo and calling it Plokamos . (у реченні на сторінці стоять номери виносок)
- In 1536 it appeared on a celestial globe by Caspar Vopel , who is credited with the asterism's designation as a constellation.

Імена трьома мовами — назви записів Вікіданих (CC0), прочитані 25.11.2026: Q202703 — Nicolas Louis de Lacaille / Нікола Луї де Лакай / Nicolas-Louis de Lacaille; Q57963 — Johannes Hevelius / Ян Гевелій / Johannes Hevelius; Q333534 — Petrus Plancius / Петер Планціус / (угорської назви немає); Q961926 — Pieter Dirkszoon Keyser / Пітер Дірксзун Кейзер / (немає); Q257948 — Frederick de Houtman / Фредерік де Хаутман / (немає); Q1048065 — Caspar Vopel / (української й угорської назв немає). Де назви мовою немає, ім'я лишено латинкою. «Французький астроном» і «нідерландські мореплавці» — з речень вище.

## Оріон (Ori)

Статті: англійська — версія 1387071981, українська — 49179190, угорська — 28644915; угорська стаття про Скорпіона (https://hu.wikipedia.org/wiki/Skorpió_csillagkép) — для другої версії міфу.

- It is named after a hunter in Greek mythology. (en)
- In Greek mythology, Orion was a gigantic, supernaturally strong hunter, born to Euryale, a Gorgon, and Poseidon (Neptune), god of the sea. (en)
- Orion's seven brightest stars form a distinctive hourglass-shaped asterism, or pattern, in the night sky. (en)
- Four stars—Rigel, Betelgeuse, Bellatrix, and Saiph—form a large roughly rectangular shape, at the center of which lie the three stars of Orion's Belt—Alnitak, Alnilam, and Mintaka. (en)
- One myth recounts Gaia's rage at Orion, who dared to say that he would kill every animal on Earth. (en)
- The angry goddess tried to dispatch Orion with a scorpion. (en)
- This is given as the reason that the constellations of Scorpius and Orion are never in the sky at the same time. (en)
- Назване на честь міфічного грецького мисливця Оріона; в українській народній традиції сузір'я також відоме під назвою «Косарі». (uk)
- Згідно з працею Ератосфена «Катастеризми», Оріон був сином бога моря Посейдона і Евріали, дочки Міноса, царя Криту. (uk)
- Гея (у деяких версіях — Аполлон, який не схвалював стосунків своєї сестри з чоловіком) заперечила й послала гігантського скорпіона, щоб убити Оріона. (uk)
- Найлегше впізнати сузір'я за трьома яскравими блакитними надгігантами , що формують астеризм Пояс Оріона : Мінтака (з арабської — «пояс»), Альнілам («перловий пояс») і Альнітак («пасок») (uk)
- A görög mitológiában Órión Poszeidón fia, óriás termetű vadász, aki Atlasz hét leányát addig üldözte szerelmével, amíg azok csillagokká nem változtak: ők lettek a Plejádok hét csillaga. (hu)
- A történet egy másik változata szerint Artemisz egy skorpiót küldött, amely halálra marta Oriont, ezért az istenek úgy helyezték el őket az égen, hogy amikor az egyik felkel, a másik éppen lenyugodjék. (hu)
- Régi csillagtérképeken Íjász, Kaszás, Nimród vagy Ozirisz néven is említik. (hu)
- Az Orion övének neve pedig Bírópálca . (hu)
- Egy másik változat szerint a Földanya ölette meg a skorpióval a fennhéjázó Oriont, aki kijelentette, hogy minden vadállatot meg tud ölni. (hu, стаття про Скорпіона)

Розбіжності версій: мати Оріона — «a Gorgon» (en) чи дочка Міноса (uk) — в історії матір не названо; скорпіона насилає Гея (en, uk), Аполлон (uk, «у деяких версіях») чи Артеміда (hu) — в історії названо версії.

## Телець (Tau)

Статті: en — https://en.wikipedia.org/wiki/Taurus_(constellation), версія 1387406087; uk — https://uk.wikipedia.org/wiki/Телець_(сузір'я), версія 49132167; hu — https://hu.wikipedia.org/wiki/Bika_csillagkép, версія 28729197.


### Фігура й назва

- Taurus (Latin, 'Bull') is one of the constellations of the zodiac and is located in the northern celestial hemisphere. (en)
- The identification of the constellation of Taurus with a bull is very old, certainly dating to the Chalcolithic, and perhaps even to the Upper Paleolithic. (en)
- In illustrations of Greek mythology, only the front portion of this constellation is depicted; this was sometimes explained as Taurus being partly submerged as he carried Europa out to sea. (en)
- Телець (лат. Taurus) — зодіакальне сузір'я. (uk)
- Ототожнення сузір'я Тельця з биком має дуже давнє походження: щонайпізніше воно сягає енеоліту, а можливо — навіть пізнього палеоліту. (uk)
- csillagkép egyike a 12 állatövi csillagképnek. (hu) [the sentence starts 'A Bika (latin: Taurus, )' with a pronunciation mark inside the brackets]
- A Taurus csillagkép nagyon régi, valószínűleg a rézkorban, vagy talán már a kőkorszakban is ismerték. (hu)

### Міф

- In Greek mythology, Taurus was identified with Zeus, who assumed the form of a magnificent white bull to abduct Europa, a legendary Phoenician princess. (en)
- A second Greek myth portrays Taurus as Io, a mistress of Zeus. (en)
- To hide his lover from his wife Hera, Zeus changed Io into the form of a heifer. (en)
- Greek mythographer Acusilaus marks the bull Taurus as the same that formed the myth of the Cretan Bull, one of The Twelve Labors of Heracles. (en)
- In Babylonian astronomy, the constellation was listed in the MUL.APIN as GU4.AN.NA, "The Bull of Heaven". (en)
- In the Old Babylonian Epic of Gilgamesh, the goddess Ishtar sends Taurus, the Bull of Heaven, to kill Gilgamesh for spurning her advances. (en)

### Та сама історія й імена українською та угорською

- У грецькій міфології Тельця ототожнювали з Зевсом, який обернувся на величного білого бика, щоб викрасти Європу — легендарну фінікійську царівну. (uk)
- Інший грецький міф пов'язує Тельця з Іо — коханкою Зевса. (uk)
- Щоб приховати її від своєї дружини Гери, Зевс перетворив Іо на корову. (uk)
- Грецький міфограф Акусілай ототожнював бика Тельця з Критським биком — одним із дванадцяти подвигів Геракла. (uk)
- У вавилонській астрономії сузір'я згадане в тексті MUL.APIN під назвою GU4.AN.NA — «Небесний Бик». (uk)
- A görög mitológiában Zeusz egy fehér bika alakjában rabolta el Európét, a föníciai hercegnőt, és Kréta szigetére úszott vele. (hu)
- A csillagképnek köze lehet Héraklész (latin nevén Hercules) hetedik feladatához is: Kréta szigetén megszelídítette a Poszeidón által megőrjített bikát, és az állat átúszott vele Argoszra. (hu)
- Bikakultusz volt Mezopotámiában és Krétán is. (hu)
- Ió (görög Ἰώ) a görög mitológiában Inakhosz argoszi király leánya. (hu; https://hu.wikipedia.org/wiki/Ió_(Inakhosz_leánya), версія 29130270) [first sentence of the Hungarian article about Io (the Hungarian Taurus article does not tell the Io version)]
- Zeusz megsajnálta kedvesét, és hogy elrejtse felesége dühe elől, fehér üszővé változtatta őt. (hu; https://hu.wikipedia.org/wiki/Ió_(Inakhosz_leánya), версія 29130270) [from the Hungarian article about Io]
- Azon az éjszakán sötét felhőket borított az égre, hogy elrejtse szerelmes éjszakáját a féltékeny Héra elől. (hu; https://hu.wikipedia.org/wiki/Ió_(Inakhosz_leánya), версія 29130270) [Hera in Hungarian; from the Hungarian article about Io]

### Народні назви

- Українські народні назви сузір'я — Бик, Тур, Віл. (uk)

### Хто вніс до переліку

- Taurus /ˈtɔːrəs/ Tau Taur Tauri ancient Ptolemy bull Aldebaran 0.86 797 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row: name, pronunciation, IAU and NASA abbreviations, genitive, origin year, creator, meaning, brightest star, magnitude, area]
- It is one of the oldest constellations, dating back to the Early Bronze Age at least, when it marked the location of the Sun during the spring equinox. (en) [the English article never mentions Ptolemy]

Розбіжності версій і як їх обійдено: Розбіжностей у наведених частинах не знайдено. Угорська стаття версії про Іо не розповідає — імена Ió і Héra взято з угорської статті про Іо.

## Візничий (Aur)

Статті: en — https://en.wikipedia.org/wiki/Auriga, версія 1380735863; uk — https://uk.wikipedia.org/wiki/Візничий_(сузір'я), версія 46689389; hu — https://hu.wikipedia.org/wiki/Szekeres_csillagkép, версія 26050394.


### Фігура й назва

- Its name is Latin for '(the) charioteer', associating it with various mythological beings, including Erichthonius and Myrtilus. (en)
- Traditionally, illustrations of Auriga represent it as a chariot and its driver. (en)
- The charioteer holds a goat over his left shoulder and has two kids under his left arm; he holds the reins to the chariot in his right hand. (en)
- Capella is associated with the mythological she-goat Amalthea, who breast-fed the infant Zeus. (en)
- Латинська назва «Auriga» означає «візничий» і пов'язана з міфологічними персонажами, такими як Еріхтоній і Міртіл. (uk)
- Зображення сузір'я Візничий зазвичай показують у вигляді візка з водієм, який тримає козу на лівому плечі, а під лівою рукою — двоє козенят. (uk)
- A Szekeres (latin: Auriga) egy csillagkép. (hu)
- Mezopotámiában a csillagképet kocsihajtónak képzelték. (hu)
- A legkorábbi időktől úgy ábrázolták, hogy kecskét vagy kecskegidákat dajkál az ölében. (hu)

### Міф

- In Greek mythology, Auriga is often identified as the hero Erichthonius of Athens, the chthonic son of Hephaestus who was raised by the goddess Athena. (en)
- Erichthonius was generally credited to be the inventor of the quadriga, the four-horse chariot, which he used in the battle against the usurper Amphictyon, the event that made Erichthonius the king of Athens. (en)
- His chariot was created in the image of the Sun's chariot, the reason Zeus placed him in the heavens. (en)
- Auriga, however, is sometimes described as Myrtilus, who was Hermes's son and the charioteer of Oenomaus. (en) [another version]
- Myrtilus earned his position in the sky when Hippodamia's successful suitor, Pelops, killed him, despite his complicity in helping Pelops win her hand. (en) [another version]
- After his death, Myrtilus's father Hermes placed him in the sky. (en) [another version]
- Regardless of Auriga's specific representation, it is possible that the constellation was created by the ancient Greeks to commemorate the importance of the chariot in their society. (en)

### Та сама історія й імена українською та угорською

- Візничий зазвичай асоціюється з кількома міфологічними персонажами, зокрема Еріхтонієм — легендарним царем Афін, якого, за переказами, виховала богиня Афіна. (uk)
- Він першим запряг коней у колісницю, за що Зевс помістив його на небо як сузір'я. (uk)
- Еріхтоній був сином Гефеста та Геї, і його народження було сповнене неймовірних обставин. (uk)
- Еріхтоній виріс, ставши видатним винахідником і героєм, який започаткував нову епоху в техніці, створивши квадригу — колісницю, яка мала чотири коні. (uk)
- Після того як Пелоп переміг, він вбив Міртіла, і той був увічнений на небі, ставши частиною сузір'я Візничий. (uk) [names Міртіл, Пелоп; the sentence before it also has Еномай and Гіпподамія but is garbled, see contradictions]
- Később azt tartották, hogy ez az Amalthea nevű kecske, amely a görög mítoszban Zeuszt (a római mitológiában Jupitert) szoptatta. (hu)
- Mások Erikthoniosz alakját vélték felfedezni a csillagképben, a Földanya és Héphaisztosz gyermekét. (hu)
- Erikthoniosz vezette be a négylovas kocsikat Athénban. (hu)
- Egy másik értelmezés szerint a Fuvaros a balsorsú kocsihajtó, Mürtilosz égre vetített alakja. (hu) [the article calls the constellation both Szekeres and Fuvaros]
- Apja, Hermész, aki sohasem vetette meg a ravasz csínytevéseket, a csillagok közé helyezte a kocsihajtót. (hu)
- один з найдавніших богів грецької міфології. (uk; https://uk.wikipedia.org/wiki/Гермес, версія 48824313) [first sentence of the Ukrainian article 'Гермес'; it starts 'Герме́с (д.-грец. Ἑρμᾶς, лат. Mercurius; у римському пантеоні — Меркурій) —']
- німфа, дочка критського царя Мелісса (варіант: коза); Амальтея вигодувала на Криті Зевса, якого Рея ховала від Кроноса. (uk; https://uk.wikipedia.org/wiki/Амальтея, версія 47041611) [first sentence of the Ukrainian article; it starts 'Амальте́я, або Амалте́я, Амалфе́я (грец. Αμάλθεια) —']
- Вдячний Зевс узяв Амальтею на небо і вмістив її в сузір'я Візничого (назва найяскравішої зорі цього сузір'я — Капелли — в перекладі з грецької означає «коза»). (uk; https://uk.wikipedia.org/wiki/Амальтея, версія 47041611) [from the Ukrainian article about Amalthea]
- Амфіктіон (uk; https://www.wikidata.org/wiki/Q474854) [Amphictyon]
- Amaltheia (görögül Αμαλθεια, „gondos”) egy Krétán élő isteni kecske volt a görög mitológiában. (hu; https://hu.wikipedia.org/wiki/Amaltheia, версія 28652516) [first sentence of the Hungarian article; the Hungarian Auriga article spells the name Amalthea]
- Egyesek szerint saruját, Pallasz Athéné (a bölcsesség istennőjének és a hősök védelmezőjének) ajándékát viselte. (hu; https://hu.wikipedia.org/wiki/Andromeda_csillagkép, версія 28644906) [Athena in Hungarian; from the Hungarian Andromeda article]
- Amphiktüón (hu; https://www.wikidata.org/wiki/Q474854) [Amphictyon; no Hungarian article]

### Хто вніс до переліку

- Auriga /ɔːˈraɪɡə/ Aur Auri Aurigae /ɔːˈraɪdʒiː/ ancient Ptolemy charioteer Capella 0.08 657 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- It is one of the 88 modern constellations; it was among the 48 constellations listed by the 2nd-century astronomer Ptolemy. (en)
- The asterism containing the goat and kids had been a separate constellation; however, Ptolemy merged the Charioteer and the Goats in the 2nd-century Almagest. (en)
- Воно також входило до списку 48 сузір'їв, складеного давньогрецьким астрономом Клавдієм Птолемеєм у II столітті. (uk)

Розбіжності версій і як їх обійдено: Головну версію (Еріхтоній) усі три статті розповідають однаково. В українській статті речення про Еномая зіпсоване — в історії його немає. Імена, яких бракує в статтях про сузір'я, взято зі статей про самих героїв.

## Близнята (Gem)

Статті: en — https://en.wikipedia.org/wiki/Gemini_(constellation), версія 1386838871; uk — https://uk.wikipedia.org/wiki/Близнята_(сузір'я), версія 48496956; hu — https://hu.wikipedia.org/wiki/Ikrek_csillagkép, версія 29273898.


### Фігура й назва

- Its name is Latin for twins, and it is associated with the twins Castor and Pollux in Greek mythology. (en)
- Свою назву Близнята отримали від латинського слова Gemini, що означає «близнюки». (uk)
- Це пов'язано з давньогрецьким міфом про братів Кастора та Полідевка (Поллукса). (uk)
- Az Ikrek (latin: Gemini) egy csillagkép, egyike a 12 állatövi csillagképnek. (hu)

### Міф

- In Greek mythology, Gemini was associated with the myth of Castor and Pollux, the children of Leda and Argonauts both. (en)
- Pollux was the son of Zeus, who seduced Leda, while Castor was the son of Tyndareus, king of Sparta and Leda's husband. (en)
- Castor and Pollux were also mythologically associated with St. Elmo's fire in their role as the protectors of sailors. (en)
- When Castor died, because he was mortal, Pollux begged his father Zeus to give Castor immortality, and he did, by uniting them together in the heavens. (en)
- In Babylonian astronomy, the stars Castor and Pollux were known as the Great Twins. (en) [another tradition]

### Та сама історія й імена українською та угорською

- У грецькій міфології сузір'я Близнята пов'язане з легендою про Кастора і Полідевка — братів-героїв, які входили до складу аргонавтів. (uk)
- Вони були синами Леди, але мали різних батьків: Кастор був смертним сином спартанського царя Тіндарея, а Полідевк — безсмертним сином Зевса, який спокусив Леду. (uk)
- Попри свою різну природу, брати були нерозлучними та вважалися покровителями воїнів і моряків. (uk)
- Зевс вирішив об'єднати їх у небесах, зробивши сузір'ям, яке тепер відоме як Близнята. (uk)
- Це сузір'я містить дві яскраві зорі — Поллукс і Кастор. (uk) [the star is Поллукс, the hero Полідевк (Поллукс) in this article]
- A görög mitológia szerint az ikerpárnak, Kasztórnak és Polluxnak igen eltérő tulajdonságai voltak. (hu)
- A nagy testvéri szeretet megjutalmazására az istenek a csillagos égre helyezték a két ikert. (hu)
- Kasztór és Pollux Zeusz és Léda, Tündareósz spártai király feleségének a fiai voltak, ők születtek a hattyúvá vált királynő egyik tojásából (a másikból Heléna, aki előbb Menelaosz spártai király, majd Parisz, trójai királyfi felesége lett). (hu)

### Народні назви

- A magyar mondakincs is megemlékezik a csillagképről Két Árva néven. (hu)
- A monda szerint két árva élt egy faluban, ám senki sem segített nekik, még egy falat kenyeret sem kaptak. (hu)
- Egy nap eltévedtek az erdőben, örökre nyomuk veszett, de az Isten felrakta őket a mennyboltra, hogy mindig figyelmeztessék az embereket. (hu)

### Хто вніс до переліку

- Gemini /ˈdʒɛmɪnaɪ/ Gem Gemi Geminorum ancient Ptolemy twins (Lugal-irra and Meslamta-ea, later Castor and Pollux) Pollux 1.14 514 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- It was one of the 48 constellations described by the 2nd-century AD astronomer Ptolemy, and is one of the 88 modern constellations. (en)
- Це сузір'я було описане ще в II столітті нашої ери давньогрецьким астрономом Клавдієм Птолемеєм і відтоді залишається частиною офіційного списку 88 сучасних сузір'їв. (uk)

Розбіжності версій і як їх обійдено: Батьки близнят: різні (en, uk) чи обидва — сини Зевса (hu) — в історії названо поширену версію (uk, en) і обидві (hu). Про що Поллукс просив Зевса, статті кажуть по-різному — в українській та угорській історії лишено тільки спільне: їх з'єднано на небі.

## Персей (Per)

Статті: en — https://en.wikipedia.org/wiki/Perseus_(constellation), версія 1384626682; uk — https://uk.wikipedia.org/wiki/Персей_(сузір'я), версія 48813803; hu — https://hu.wikipedia.org/wiki/Perseus_csillagkép, версія 28323190.


### Фігура й назва

- Perseus is a constellation in the northern sky, named after the Greek mythological hero Perseus. (en)
- Some star atlases during the early 19th century also depicted Perseus holding the disembodied head of Medusa, whose asterism was named together as Perseus et Caput Medusae; however, this never came into popular usage. (en)
- Персей — сузір'я, що можна спостерігати у північній півкулі, назване на честь грецького міфологічного героя Персея. (uk)
- A Perseus csillagkép nevét a görög mitológia Perszeusz királyáról kapta. (hu)

### Міф

- In Greek mythology, Perseus was the son of Danaë, who was sent by King Polydectes to bring the head of Medusa the Gorgon—whose visage caused all who gazed upon her to turn to stone. (en)
- Perseus slew Medusa in her sleep, and Pegasus and Chrysaor appeared from her body. (en)
- Perseus continued to the realm of Cepheus whose daughter Andromeda was to be sacrificed to Cetus the sea monster. (en)
- Perseus rescued Andromeda from the monster by killing it with his sword. (en)
- He turned Polydectes and his followers to stone with Medusa's head and appointed Dictys the fisherman king. (en)
- Perseus and Andromeda married and had six children. (en)
- In the sky, Perseus lies near the constellations Andromeda, Cepheus, Cassiopeia (Andromeda's mother), Cetus, and Pegasus. (en)
- She was chained to a rock by the sea but was saved by the hero Perseus, who in one version of the story used the head of Medusa to turn the monster into stone; in another version, by the Roman poet Ovid in his Metamorphoses, Perseus slew the monster with his diamond sword. (en; https://en.wikipedia.org/wiki/Andromeda_(constellation), версія 1384141124) [another version; from the English Andromeda article]

### Та сама історія й імена українською та угорською

- У грецькій міфології Персей був сином Данаї, яку цар Полідект послав за головою Медузи Горгони — істоти, чий погляд обертав усе живе на камінь. (uk) [grammar says Danaë was sent ('яку'), see contradictions]
- Персей убив Медузу, коли вона спала, після чого з її тіла з'явилися крилатий кінь Пегас і страховисько Хрісаор. (uk)
- Згодом Персей вирушив до володінь царя Цефея, дочка якого, Андромеда, мала бути принесена в жертву морському чудовиську Киту. (uk)
- Персей урятував Андромеду, вбивши чудовисько мечем. (uk)
- Згодом він показав голову Медузи Полідекту та його прибічникам, перетворивши їх на камінь, після чого зробив рибалку Діктіса царем. (uk)
- Тому на небі Персей розташований поруч із сузір'ями Андромеди, Цефея, Кассіопеї (матері Андромеди), Кита і Пегаса. (uk)
- Perszeusz királyfinak sikerült levágnia a három Gorgó közül az egyik fejét, majd egy láthatatlanná tévő sisak segítségével menekült el. (hu)
- A Gorgók olyan szörnyűek voltak, ha valaki rájuk nézett, az kővé dermedt. (hu)
- Perszeusz királyfi a Gorgó fejének használatával mentette meg Andromédát a tengeri szörnytől. (hu)
- A Cet rögtön kővé változott a Gorgó fejének láttán. (hu)
- Éppen hazafelé tartott sikeres vállalkozásából, melynek során megölte Meduszát, az egyik félelmetes gorgót. (hu; https://hu.wikipedia.org/wiki/Andromeda_csillagkép, версія 28644906) [Medusa's name in Hungarian; from the Hungarian Andromeda article]
- Androméda Képheusz aithiopiai király és Kassziopeia királyné leánya volt. (hu; https://hu.wikipedia.org/wiki/Andromeda_csillagkép, версія 28644906) [Cepheus and Cassiopeia in Hungarian; from the Hungarian Andromeda article]
- Nevét Pégaszoszról kapta (görögül: forrásló), a görög mitológia mesés állatáról. (hu; https://hu.wikipedia.org/wiki/Pegasus_csillagkép, версія 24276367) [Pegasus in Hungarian; from the Hungarian Pegasus article]
- Danaé a görög mitológiában az argoszi Akrisziosz király és Eurüdiké leánya, Perszeusz anyja. (hu; https://hu.wikipedia.org/wiki/Danaé, версія 27694915) [first sentence of the Hungarian article about Danaë]
- Polüdektész (hu; https://www.wikidata.org/wiki/Q771241) [Polydectes; no Hungarian article]
- Khrüszaór (hu; https://www.wikidata.org/wiki/Q320660) [Chrysaor]

### Народні назви

- В українських віруваннях Персей був сином Перуна. (uk) [not a folk name of the constellation; the sentence has no footnote on the page — treat as unreliable]

### Хто вніс до переліку

- Perseus /ˈpɜːrsiəs/ Per Pers Persei /ˈpɜːrsiaɪ/ ancient Ptolemy Perseus (mythological character) Mirfak 1.82 615 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- It is one of the 48 ancient constellations listed by the 2nd-century astronomer Ptolemy, and among the 88 modern constellations defined by the International Astronomical Union (IAU). (en)
- Це одне з 48 стародавніх сузір'їв, перелічених астрономом II століття Птолемеєм та одне з 88 сучасних сузір'їв, визначених Міжнародним астрономічним союзом (МАС). (uk)

Розбіжності версій і як їх обійдено: Чудовисько вбито мечем (en, uk) чи обернено на камінь головою Горгони (hu) — названо обидві версії. Англійське речення про те, кого послав Полідект, двозначне, український переклад робить посланою Данаю; за наступними реченнями обох статей по голову йде Персей — так і в історії. Кількості дітей (шість чи дев'ять) в історії немає.

## Кассіопея (Cas)

Статті: en — https://en.wikipedia.org/wiki/Cassiopeia_(constellation), версія 1386813078; uk — https://uk.wikipedia.org/wiki/Кассіопея_(сузір'я), версія 49131033; hu — https://hu.wikipedia.org/wiki/Cassiopeia_csillagkép, версія 28832723.


### Фігура й назва

- is a constellation and asterism in the northern sky named after the vain queen Cassiopeia, mother of Andromeda, in Greek mythology, who boasted about her unrivaled beauty. (en) [the sentence starts 'Cassiopeia (listen)']
- It is easily recognizable due to its distinctive 'W' shape, formed by five bright stars. (en)
- She was forced to wheel around the north celestial pole on her throne, spending half of her time clinging to it so she does not fall off, and Poseidon decreed that Andromeda should be bound to a rock as prey for the monster Cetus. (en)
- Сузір'я названо ім'ям Кассіопеї (грец. Кɑσσιόπειɑ) — героїні давньогрецьких міфів, дружини ефіопського царя Кефея, матері Андромеди. (uk)
- Він складається з найяскравіших зір сузір'я: ε (Сегін), δ (Рукба), γ (Наві), α (Шедар) і β (Каф), які утворюють фігуру, що нагадує латинську букву W. (uk)
- A csillagkép a görög mitológiában szereplő Kassziopeiáról kapta nevét. (hu)
- Helyzetétől függően M vagy W formájú. (hu)

### Міф

- The constellation is named after Cassiopeia, the queen of Aethiopia. (en)
- Cassiopeia was the wife of King Cepheus of Aethiopia and mother of Princess Andromeda. (en)
- She was placed in the sky as a punishment after enraging Poseidon with the boast that her daughter Andromeda was more beautiful than the Nereids or, alternatively, that she herself was more beautiful than the sea nymphs. (en) [both versions of the boast in one sentence]
- Andromeda was then rescued by the hero Perseus, whom she later married. (en)
- Cepheus and Cassiopeia were placed next to each other among the stars, along with Andromeda. (en)

### Та сама історія й імена українською та угорською

- Її також називали Персея («дружина Персея») або Цефея («дочка Цефея») — всі ці імена посилаються на роль Андромеди в греко-римському міфі про Персея, у якому Кассіопея, цариця Ефіопії, вихвалялася, що її дочка вродливіша за нереїд, морських німф, обдарованих неймовірною красою. (uk; https://uk.wikipedia.org/wiki/Андромеда_(сузір'я), версія 49173364) [the Ukrainian Cassiopeia article does not tell the story; this is from the Ukrainian Andromeda article]
- Ображені її зауваженням, німфи попросили Посейдона покарати Кассіопею за зухвалість, що той і зробив, наказавши морському чудовиську Киту напасти на Ефіопію. (uk; https://uk.wikipedia.org/wiki/Андромеда_(сузір'я), версія 49173364) [from the Ukrainian Andromeda article]
- Кефей (д.-грец. Κηφεύς), Цефей — у давньогрецькій міфології — син Бела та Авхіної, брат Фінея, чоловік Кассіопеї, батько Андромеди, цар Ефіопії. (uk; https://uk.wikipedia.org/wiki/Кефей, версія 38275858) [first sentence of the Ukrainian article about Cepheus: both spellings]
- Kassziopeia Képheusz aithiopiai király felesége és Androméda anyja volt. (hu)
- A királyné azzal dicsekedett, hogy ő a nimfáknál is szebb. (hu)
- Ezért az istenek megharagudtak rá, és Poszeidón, a tengerek istene egy tengeri szörnyet küldött, amely rengeteg embert elpusztított. (hu)
- A hős Perszeusz Androméda segítségére sietett, legyőzte a szörnyet, kiszabadította a leányt, majd feleségül vette. (hu)
- A történet később azzal bővült, hogy Kassziopeiát a trónjához kötözték és fél napig fejjel lefelé lógatták. (hu)
- a görög mitológia szerint kék hajú, tengeri nimfák. (hu; https://hu.wikipedia.org/wiki/Néreiszek, версія 28500079) [first sentence of the Hungarian article 'Néreiszek', which starts 'A néreiszek (Νηρηίς, vagy Νηρεΐδες néreidák, Νηρηίδες néréidák)']

### Народні назви

- В українській культурі сузір'я називали «Бороною» або «Пасікою». (uk)
- A magyar néphagyományban „Korcsma” néven emlegetik. (hu)
- Innen jön ki a „Részegember”. (hu) [tagged [forrás?] (source needed) on the page]

### Хто вніс до переліку

- Cassiopeia /ˌkæsioʊˈpiːə/ Cas Cass Cassiopeiae /ˌkæsioʊˈpiːiː/ ancient Ptolemy Cassiopeia (mythological character) Schedar 2.24 598 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- Cassiopeia was one of the 48 constellations listed by the 2nd-century Greek astronomer Ptolemy, and it remains one of the 88 modern constellations today. (en)
- Відоме зі стародавніх часів і включене до каталогу зоряного неба Клавдія Птолемея «Альмагест». (uk)

Розбіжності версій і як їх обійдено: Хвалилася вродою дочки (en, uk) чи власною (hu; en називає обидві версії) — названо обидві. В українській статті про Кассіопею є лише походження назви: історію взято з української статті про Андромеду. Написання: Кефей / Цефей — узято «Цефей», як називається сузір'я в програмі.

## Андромеда (And)

Статті: en — https://en.wikipedia.org/wiki/Andromeda_(constellation), версія 1384141124; uk — https://uk.wikipedia.org/wiki/Андромеда_(сузір'я), версія 49173364; hu — https://hu.wikipedia.org/wiki/Andromeda_csillagkép, версія 28644906.


### Фігура й назва

- Located in the northern celestial hemisphere, it is named for Andromeda, daughter of Cassiopeia, in the Greek myth, who was chained to a rock to be eaten by the sea monster Cetus. (en)
- Andromeda is known as "the Chained Lady" or "the Chained Woman" in English. (en)
- She is typically depicted with α Andromedae as her head, ο and λ Andromedae as her chains, and δ, π, μ, β, and γ her body and legs. (en)
- сузір'я в північній півкулі зоряного неба, назване на честь героїні грецького міфу Андромеди, вродливої доньки Кассіопеї. (uk) [the sentence starts 'Андроме́да (лат. Andromeda, скорочення — And) —']
- Андромеда відома як «Прикута леді» або «Прикута жінка» англійською мовою. (uk)
- A csillagkép a görög mitológiában szereplő Androméda királylányról kapta nevét. (hu)

### Міф

- It has also been called Persea ("Perseus's wife") or Cepheis ("Cepheus's daughter"), all names that refer to Andromeda's role in the Greco-Roman myth of Perseus, in which Cassiopeia, the queen of Aethiopia, bragged that her daughter was more beautiful than the Nereids, sea nymphs blessed with incredible beauty. (en)
- Offended at her remark, the nymphs petitioned Poseidon to punish Cassiopeia for her insolence, which he did by commanding the sea monster Cetus to attack Aethiopia. (en)
- Andromeda's panicked father, Cepheus, was told by the Oracle of Ammon that the only way to save his kingdom was to sacrifice his daughter to Cetus. (en)
- She was chained to a rock by the sea but was saved by the hero Perseus, who in one version of the story used the head of Medusa to turn the monster into stone; in another version, by the Roman poet Ovid in his Metamorphoses, Perseus slew the monster with his diamond sword. (en) [two versions in one sentence]
- Perseus and Andromeda then married; the myth recounts that the couple had nine children together – seven sons and two daughters – and founded Mycenae and its Persideae dynasty. (en)
- After Andromeda's death Athena placed her in the sky as a constellation, to honor her. (en)
- Three of the neighboring constellations (Perseus, Cassiopeia and Cepheus) represent characters in the Perseus myth, while Cetus retreats to beyond Pisces. (en)

### Та сама історія й імена українською та угорською

- Її також називали Персея («дружина Персея») або Цефея («дочка Цефея») — всі ці імена посилаються на роль Андромеди в греко-римському міфі про Персея, у якому Кассіопея, цариця Ефіопії, вихвалялася, що її дочка вродливіша за нереїд, морських німф, обдарованих неймовірною красою. (uk)
- Ображені її зауваженням, німфи попросили Посейдона покарати Кассіопею за зухвалість, що той і зробив, наказавши морському чудовиську Киту напасти на Ефіопію. (uk)
- Батько Андромеди, Цефей, у паніці почув від оракула Аммона, що єдиний спосіб врятувати своє царство — це принести дочку в жертву Цету. (uk) [the monster is Кит in the previous sentence and Цет here]
- Вона була прикута до скелі на березі моря, але була врятована героєм Персеєм, який, за однією версією, використав голову Медузи, щоб перетворити чудовисько на камінь; за іншою версією, викладеною римським поетом Овідієм у його «Метаморфозах», Персей убив чудовисько своїм діамантовим мечем. (uk)
- Після смерті Андромеди Афіна помістила її на небо як сузір'я, щоб вшанувати її пам'ять. (uk)
- Три сусідні сузір'я (Персей, Кассіопея і Цефей) представляють персонажів міфу про Персея, тоді як Кит відступає за межі Риб. (uk)
- Androméda Képheusz aithiopiai király és Kassziopeia királyné leánya volt. (hu)
- Ezért az istenek megharagudtak rá, és Poszeidón, a tengerek istene egy tengeri szörnyet küldött, amely rengeteg embert elpusztított. (hu)
- Vállalták ezt az áldozatot, és Andromédát meztelenül a tengerparti sziklához láncolták Joppa közelében (kikötőváros az ókori Palesztinában), hogy ott Kétónak (latin Cetus), a tengeri szörnynek a zsákmányául essék. (hu)
- Miközben a lány a kegyetlen véget várta, arra száguldott Perszeusz, Zeusz halandó fia. (hu)
- Éppen hazafelé tartott sikeres vállalkozásából, melynek során megölte Meduszát, az egyik félelmetes gorgót. (hu)
- A mítosz egy másik változatában, amely jobban illik a szóban forgó csillagképekhez, a szárnyas ló, Pégaszosz hátán érkezett. (hu)
- A Cet megijedt Perszeusz tengeren tükröződő árnyékától, így a hős halálos csapást mért rá, majd kiszabadította Andromédát. (hu)
- A történet minden szereplője (Andromeda, Cepheus, Cassiopeia, Perseus és a Cet, azaz Kétó) csillagképként látható az égbolton. (hu)
- a görög mitológia szerint kék hajú, tengeri nimfák. (hu; https://hu.wikipedia.org/wiki/Néreiszek, версія 28500079) [first sentence of the Hungarian article 'Néreiszek' (Nereids)]

### Хто вніс до переліку

- Andromeda /ænˈdrɒmɪdə/ And Andr Andromedae ancient Ptolemy Andromeda (mythological character) Alpheratz 2.06 722 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- Andromeda is one of the 48 constellations listed by the 2nd-century Greco-Roman astronomer Ptolemy, and one of the 88 modern constellations. (en)
- Andromeda was one of the original 48 constellations formulated by Ptolemy in his 2nd-century Almagest, in which it was defined as a specific pattern of stars. (en)
- Включене в каталог зоряного неба Клавдія Птолемея «Альмагест». (uk)
- A történet minden szereplője (Andromeda, Cepheus, Cassiopeia, Perseus és a Cet, azaz Kétó) csillagképként látható az égbolton. (hu) [the Hungarian article does not mention Ptolemy in its history section]

Розбіжності версій і як їх обійдено: Як загинуло чудовисько — дві версії в одному реченні (en, uk); угорська стаття розповідає по-своєму (чудовисько злякалося тіні Персея) — в угорській історії сказано лише «переміг». Місце (Ефіопія чи околиці Йоппи) в угорській історії не названо.

## Пегас (Peg)

Статті: en — https://en.wikipedia.org/wiki/Pegasus_(constellation), версія 1384869583; uk — https://uk.wikipedia.org/wiki/Пегас_(сузір'я), версія 49220741; hu — https://hu.wikipedia.org/wiki/Pegasus_csillagkép, версія 24276367.


### Фігура й назва

- Pegasus is a constellation in the northern sky, named after the winged horse Pegasus in Greek mythology. (en)
- This was unlike most other uranographers, who had depicted Pegasus as half of a horse, rising out of the ocean. (en)
- Alpha (Markab), Beta (Scheat), and Gamma (Algenib), together with Alpha Andromedae (Alpheratz) form the large asterism known as the Square of Pegasus. (en)
- Пега́с (лат. Pegasus) — сузір'я північної півкулі неба. (uk) [the Ukrainian constellation article says nothing about the figure or the myth]
- у давньогрецькій міфології — чарівний крилатий кінь, брат воїна Хрісаора, що народився з крові горгони Медузи, коли Персей відтяв їй голову. (uk; https://uk.wikipedia.org/wiki/Пегас, версія 46618591) [first sentence of the Ukrainian article about the mythical horse; it starts 'Пега́с (грец. Πήγασος, Pegasos) —']
- Nevét Pégaszoszról kapta (görögül: forrásló), a görög mitológia mesés állatáról. (hu)

### Міф

- Pegasus, in Greek mythology, was a winged horse with magical powers. (en)
- One myth regarding his powers says that his hooves dug out a spring, Hippocrene, which blessed those who drank its water with the ability to write poetry. (en)
- Pegasus was born when Perseus cut off the head of Medusa, who was impregnated by the god Poseidon. (en)
- He was born with Chrysaor from Medusa's blood. (en)
- Eventually, it became the horse for Bellerophon, who was asked to kill the Chimera and succeeded with the help of Athena and Pegasus. (en)
- Despite this success, after the death of his children, Bellerophon asked Pegasus to take him to Mount Olympus. (en)
- Though Pegasus agreed, he plummeted back to Earth after Zeus either threw a thunderbolt at him or sent a gadfly to make Pegasus buck him off. (en) [two versions in one sentence]

### Та сама історія й імена українською та угорською

- Пегасом володів герой Беллерофонт, а надалі бог Зевс, якому крилатий кінь возив блискавки. (uk; https://uk.wikipedia.org/wiki/Пегас, версія 46618591) [from the Ukrainian article about the mythical horse]
- Персей убив Медузу, коли вона спала, після чого з її тіла з'явилися крилатий кінь Пегас і страховисько Хрісаор. (uk; https://uk.wikipedia.org/wiki/Персей_(сузір'я), версія 48813803) [from the Ukrainian Perseus constellation article]
- Іноді сузір'я Візничий зображується не як візник, а як Беллерофонт — герой грецької міфології, який став вершником міфічного Пегаса. (uk; https://uk.wikipedia.org/wiki/Візничий_(сузір'я), версія 46689389) [from the Ukrainian Auriga constellation article]
- Беллерофонт наважився наблизитись до гори Олімп, і, співчуваючи його необачності, Юпітер вирішив увічнити його на небі, перетворивши його на сузір'я. (uk; https://uk.wikipedia.org/wiki/Візничий_(сузір'я), версія 46689389) [from the Ukrainian Auriga constellation article]
- в античній міфології вогнедишна потвора з головою та шиєю лева, тулубом кози і хвостом змії. (uk; https://uk.wikipedia.org/wiki/Химера, версія 49000961) [first sentence of the Ukrainian article 'Химера'; it starts 'Химе́ра (грец. Χίμαιρα) —']
- Вбив Химеру Беллерофонт, син Главка. (uk; https://uk.wikipedia.org/wiki/Химера, версія 49000961)
- Джерело, присвячене Аполлонові й музам джерело на горі Гелікон у Беотії, яке, за переказом, утворилося від удару копита Пегаса. (uk; https://uk.wikipedia.org/wiki/Гіппокрена, версія 45313434) [from the Ukrainian article 'Гіппокрена'; the word 'джерело' is repeated on the page]
- Гіппокрена (uk; https://www.wikidata.org/wiki/Q195848) [Hippocrene; the article gives three spellings: Гіппокрена, Іппокрена, Гіпокрена]
- Посейдон (uk; https://www.wikidata.org/wiki/Q41127) [Poseidon, nominative]
- Egy szárnyas ló, melyet Poszeidón a gorgók egyikével, Meduszával az Ókeanosz forrásainál nemzett. (hu)
- Hésziodosz szerint nyomban születése után az Olümposzra röppent, ahol Zeusz számára a villámokat és mennyköveket szállítja. (hu)
- Bellerophontész Poszeidóntól ajándékba kapta és segítségével legyőzte Khimairát, nemkülönben az amazonokat is. (hu)
- Az Androméda-mondakör egyik változata szerint Perszeusz a Pégaszoszon lovagolt akkor is, amikor a Joppe mellett a sziklához láncolt Andromédát megmentette Kétosztól, azaz a Cettől. (hu)
- A mondák szerint a Pégaszosz a múzsák lova is egyben, mivel a Helikont, mely a múzsák éneke felett érzett gyönyörűségtől az égbe akart emelkedni, patkója ütésével a földhöz szegezte, egyúttal pedig a Hippokrene forrást a földből kicsalta (ezt némelyek Troizénben keresték). (hu)
- Bellerophón (más néven Bellerophontész, Βελλεροφῶν) görög mitológiai alak, Glaukosz és Eürümedé fia, Sziszüphosz unokája, lükiai király volt. (hu; https://hu.wikipedia.org/wiki/Bellerophón, версія 20417058) [first sentence of the Hungarian article about Bellerophon: both spellings]
- Nagy szerencséje miatt elbízta magát: egyszer Pégaszosz hátán fel akart szállni az istenek lakhelyére, az Olümposzra, ám Zeusz megvadította a szárnyas lovat, amely levetette lovasát. (hu; https://hu.wikipedia.org/wiki/Bellerophón, версія 20417058)

### Народні назви

- Az arabok El Feres a'dam-nak, „nagy ló”-nak nevezték a csillagképet. (hu) [an Arabic name reported in the Hungarian article, not a Hungarian folk name]

### Хто вніс до переліку

- Pegasus /ˈpɛɡəsəs/ Peg Pegs Pegasi ancient Ptolemy Pegasus (mythological winged horse) Enif 2.40 1121 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- It was one of the 48 constellations listed by the 2nd-century astronomer Ptolemy, and is one of the 88 constellations recognized today. (en)

Розбіжності версій і як їх обійдено: Беллерофонтові допомагає Афіна (en) чи коня дарує Посейдон (hu) — в історіях цього немає. В українській статті про сузір'я міфу немає зовсім: усі українські імена — зі статей про Пегаса, Химеру, Гіппокрену та зі статей про сузір'я Персея й Візничого. Хто помістив Пегаса на небо, не каже жодна стаття — історія теж.

## Велика Ведмедиця (UMa)

Статті: en — https://en.wikipedia.org/wiki/Ursa_Major, версія 1385032598; uk — https://uk.wikipedia.org/wiki/Велика_Ведмедиця, версія 48449664; hu — https://hu.wikipedia.org/wiki/Nagy_Medve_csillagkép, версія 28832653.


### Фігура й назва

- Its Latin name means "greater (or larger) bear", referring to and contrasting it with nearby Ursa Minor, the lesser bear. (en)
- Ursa Major is primarily known from the asterism of its main seven stars, which has been called the "Big Dipper", "the Wagon", "Charles's Wain", or "the Plough", among other names. (en)
- In the context of Ursa Major, they are commonly drawn to represent the hindquarters and tail of the Great Bear. (en)
- The constellation of Ursa Major has been seen as a bear, usually female, by multiple connected civilizations. (en)
- Вели́ка Ведме́диця (лат. Ursa Major, українська історична назва — Вели́кий Ві́з) — сузір'я північної небесної півкулі. (uk)
- Багато різних цивілізацій бачили сузір'я Великої Ведмедиці як ведмедя, зазвичай самку. (uk)
- Сім зір сузір'я утворюють астеризм, відомий як Великий Віз або Великий Ківш. (uk)
- A Nagy Medve (latinul: Ursa Major) egy csillagkép, melynek hét legfényesebb csillaga alkotja a Göncölszekeret. (hu)
- Neve a görög mitológiából ered. (hu)

### Міф

- In Greek mythology, Zeus (the king of the gods, known as Jupiter in Roman mythology) lusts after a young woman named Callisto, a nymph of Artemis (known to the Romans as Diana). (en)
- Zeus's jealous wife Hera (Juno to the Romans) discovers that Callisto has a son named Arcas as the result of her rape by Zeus and transforms Callisto into a bear as a punishment. (en)
- Callisto, while in bear form, later encounters her son Arcas. (en)
- Arcas almost spears the bear, but to avert the tragedy Zeus whisks them both into the sky, Callisto as Ursa Major and Arcas as the constellation Boötes. (en)
- The Odyssey notes that it is the sole constellation that never sinks below the horizon and "bathes in the Ocean's waves", so it is used as a celestial reference point for navigation. (en)
- An alternative myth tells of two bears that saved Zeus from his murderous father Cronus by hiding him on Mount Ida. (en; https://en.wikipedia.org/wiki/Ursa_Minor, версія 1370790757) [another version; from the English Ursa Minor article]

### Та сама історія й імена українською та угорською

- У грецькій міфології Зевс (головний із богів, відомий як Юпітер у римській міфології) зажадав молодої жінки на ім'я Каллісто, німфи Артеміди (відомої римлянам як Діана). (uk)
- Ревнива дружина Зевса Гера (для римлян Юнона) дізнається, що Каллісто має сина на ім'я Аркас внаслідок її зґвалтування Зевсом, і перетворює Каллісто на ведмедицю як покарання. (uk)
- Аркас мало не пронизує ведмедя списом, але, щоб запобігти трагедії, Зевс піднімає їх обох у небо: так Каллісто стала сузір'ям Великої Ведмедиці, а Аркас — сузір'ям Волопаса. (uk)
- Kallisztó nimfa hiába tett szüzességi fogadalmat, nem tudott ellenállni Zeusznak. (hu)
- A kapcsolatból fiú született, a neve Arkasz. (hu)
- Zeusz felesége, Héra istennő meg akarta ölni a nimfát, de Zeusz az égre helyezte Kallisztót a fiával együtt, ők a Nagy- és a Kis Medve. (hu)
- Héra istennő még a halott vetélytársnőjére is haragudott, és kijárta, hogy az anya és fia soha ne fürödhessenek meg a hűsítő óceánban (a két csillagkép a valóságban is cirkumpoláris). (hu)
- Később Artemisz, a vadászat szűz istennője iránt lobbant szerelemre, aki azonban íjával lelőtte. (hu; https://hu.wikipedia.org/wiki/Orion_csillagkép, версія 28644915) [Artemis in Hungarian; from the Hungarian Orion article (the Hungarian Ursa Major article does not name her)]
- Egy másik változatuk szerint az Ökörhajcsár csillagkép volt Arcas, a Kis Medve pedig egy kutya. (hu; https://hu.wikipedia.org/wiki/Kis_Medve_csillagkép, версія 28597969) [Boötes in Hungarian (Ökörhajcsár); from the Hungarian Ursa Minor article]

### Народні назви

- Так для Великої Ведмедиці поширеною була назва «Віз», а також кілька подібних: «Великий Віз», «Небесний Віз», «Чумацький Віз» і т. д.. (uk)
- В Україні зустрічалася також назва «Дівка воду несе». (uk)
- У Причорномор'ї це сузір'я називали «Пастух з Ґирлиґою». (uk)
- Зоря Алькор уявлялася українцям як миша, що гризе збрую коней, запряжених у Віз. (uk)
- A magyar kultúrkörben Nagy Medve hét csillagából a középső, legfényesebb rész a Göncölszekér. (hu)
- A magyar mondavilágban Göncöl egy csodatevő táltos volt, értett az állatok nyelvén, ismerte a gyógyfüveket, betegeket gyógyított. (hu)
- Amikor eltörött a szekerének a kereke, hiába várt segítséget az emberektől, ezért a szekérrel együtt az égbe repült. (hu)

### Хто вніс до переліку

- Ursa Major /ˌɜːrsə ˈmeɪdʒər/ UMa UMaj Ursae Majoris ancient Ptolemy great bear Alioth 1.77 1280 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- In antiquity, it was one of the original 48 constellations listed by Ptolemy in the 2nd century AD, drawing on earlier works by Greek, Egyptian, Babylonian, and Assyrian astronomers. (en)
- It was one of the 48 constellations listed by the 2nd century AD astronomer Ptolemy in his Almagest, who called it Arktos Megale. (en)
- Включене до каталогу зоряного неба Клавдія Птолемея «Альмагест», складеного в середині II століття. (uk)

Розбіжності версій і як їх обійдено: Аркас стає Волопасом (en, uk) чи Малою Ведмедицею (hu) — названо обидві версії. В угорській статті немає перетворення на ведмедицю й зустрічі — угорська історія їх не розповідає. Рік затвердження меж (1930 чи «1922») в історії не згадано.

## Мала Ведмедиця (UMi)

Статті: en — https://en.wikipedia.org/wiki/Ursa_Minor, версія 1370790757; uk — https://uk.wikipedia.org/wiki/Мала_Ведмедиця, версія 49131152; hu — https://hu.wikipedia.org/wiki/Kis_Medve_csillagkép, версія 28597969.


### Фігура й назва

- Ursa Minor (Latin for 'Lesser Bear', contrasting with Ursa Major), also known as the Little Bear, is a constellation located in the far northern sky. (en)
- As with the Great Bear, the tail of the Little Bear may also be seen as the handle of a ladle, hence the North American name, Little Dipper: seven stars with four in its bowl like its partner the Big Dipper. (en)
- Ursa Minor has traditionally been important for navigation, particularly by mariners, because of Polaris being the north pole star. (en)
- сузір'я в навколополярній ділянці північного неба. (uk) [the sentence starts 'Мала́ Ведме́диця (лат. Ursa Minor; народні назви — Мали́й Ві́з і Па́сіка) —']
- «Хвіст» Малої Ведмедиці (який також уявляють як голоблі воза або держак ковша) складається з трьох зір, а ще чотири зорі утворюють приблизно прямокутні «крижі» ведмедиці (або сам віз чи чашу ковша). (uk)
- A Kis Medve (latin: Ursa Minor), avagy a magyar hitvilág szerinti elnevezése: Kis Göncöl, egy csillagkép. (hu)
- Számos nép körében szekérként ismerték: négy csillaga a kocsit, három csillaga a rudat alkotják. (hu)

### Міф

- The tradition of naming the northern constellations "bears" appears to be genuinely Greek, although Homer refers to just a single "bear". (en)
- According to Diogenes Laërtius, citing Callimachus, Thales of Miletus "measured the stars of the Wagon by which the Phoenicians sail". (en)
- Another ancient name of the constellation is Cynosura (Greek Κυνοσούρα "dog's tail"). (en)
- Instead, the mythographic tradition of Catasterismi makes Cynosura the name of an Oread nymph described as a nurse of Zeus, honoured by the god with a place in the sky. (en)
- One suggestion connects it to the myth of Callisto, with her son Arcas replaced by her dog being placed in the sky by Zeus. (en) [another version]
- An alternative myth tells of two bears that saved Zeus from his murderous father Cronus by hiding him on Mount Ida. (en) [another version]
- Later Zeus set them in the sky, but their tails grew long from their being swung up into the sky by the god. (en) [another version]

### Та сама історія й імена українською та угорською

- За свідченням Діогена Лаертського, який посилається на Каллімаха, Фалес Мілетський «вимірював зорі Воза, за якими плавають фінікійці». (uk)
- Традиція називати північні сузір'я «ведмедями», імовірно, має суто грецьке походження, хоча Гомер згадує лише одного «ведмедя». (uk)
- Інша давня назва сузір'я — Кіносура (Cynosura, грецьк. Κυνοσούρα — «собачий хвіст»). (uk)
- Натомість Ератосфенова міфографічна праця «Катастеризми» подає Кіносуру[en] як ім'я ореади — німфи, яку описують як годувальницю Зевса, який на знак пошани помістив її на небі. (uk) ['[en]' is a link marker on the page (the Ukrainian Wikipedia has no article about this nymph)]
- За однією з них, вона пов'язана з міфом про Каллісто, де її сина Аркаса замінює пес, якого Зевс помістив на небі. (uk)
- Альтернативний міф розповідає про двох ведмедів, які врятували Зевса від його батька-вбивці Кроноса, сховавши немовля на горі Іда. (uk)
- Згодом Зевс помістив їх на небо, а їхні хвости видовжилися, бо бог піднімав їх угору, розмахуючи ними в повітрі. (uk)
- Az ókori görögök a Nagy Medve csillagképben és a Kis Medve csillagképekben Kallisztót és Arkaszt vélték látni. (hu)
- Egy másik változatuk szerint az Ökörhajcsár csillagkép volt Arcas, a Kis Medve pedig egy kutya. (hu) [the same person is spelled Arkasz in the previous sentence and Arcas here]
- Ez magyarázza a Polaris egykori nevét: ’’Kutyafarok’’. (hu)
- A Kis Medvét mint csillagképet, minden bizonnyal Thalész vette át az egyiptomi csillagászatból a görög csillagképek közé. (hu)
- Rhea Zeuszt Kréta szigetén, az Ida-hegyen rejtette el. (hu; https://hu.wikipedia.org/wiki/Szekeres_csillagkép, версія 26050394) [Mount Ida and Zeus in Hungarian; from the Hungarian Auriga article]
- Ezért Kronosz valamennyi gyermekét hamarosan a születésük után elnyelte. (hu; https://hu.wikipedia.org/wiki/Szekeres_csillagkép, версія 26050394) [Cronus in Hungarian; from the Hungarian Auriga article]

### Народні назви

- Відомі дві українські народні назви сузір'я — Малий Віз і Пасіка. (uk)
- Так, на зоряній карті 1699 року, виданій в Амстердамі вихованцем Києво-Могилянської академії І. Копієвським, Мала Ведмедиця підписана як «Меншыи Воз». (uk)
- Сама Полярна зоря має українські народні назви Прикіл, Кіл, Північний Кілок, пов'язані з тим, що вона залишається майже нерухомою під час обертання неба. (uk)
- A Kis Medve (latin: Ursa Minor), avagy a magyar hitvilág szerinti elnevezése: Kis Göncöl, egy csillagkép. (hu)

### Хто вніс до переліку

- Ursa Minor /ˌɜːrsə ˈmaɪnər/ UMi UMin Ursae Minoris ancient Ptolemy lesser bear Polaris 1.98 256 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- Ursa Minor was one of the 48 constellations listed by the 2nd-century astronomer Ptolemy, and remains one of the 88 modern constellations. (en)
- The original "bear" is thus Ursa Major, and Ursa Minor was admitted as the second, or "Phoenician Bear" (Ursa Phoenicia, hence Φοινίκη, Phoenice) (en) [the sentence continues on the next line of the page: 'only later, according to Strabo (I.1.6, C3) due to a suggestion by Thales']
- Мала Ведмедиця входила ще до переліку 48 сузір'їв, укладеного астрономом II ст. Птолемеєм, і залишається одним із 88 сучасних сузір'їв. (uk)

Розбіжності версій і як їх обійдено: Єдиної «головної» версії немає: годувальниця Зевса чи пес Каллісто (en, uk), Аркас (hu), двоє ведмедів з гори Іда (en, uk) — історії кожною мовою кажуть те, що є в статтях цією мовою. Звідки сузір'я взяв Фалес (від фінікійців чи з Єгипту), в історії не згадано.

## Лебідь (Cyg)

Статті: en — https://en.wikipedia.org/wiki/Cygnus_(constellation), версія 1381803762; uk — https://uk.wikipedia.org/wiki/Лебідь_(сузір'я), версія 44361572; hu — https://hu.wikipedia.org/wiki/Hattyú_csillagkép, версія 28571752.


### Фігура й назва

- Cygnus is a northern constellation on the plane of the Milky Way, deriving its name from the Latinized Greek word for "swan". (en)
- Cygnus is one of the most recognizable constellations of the northern summer and autumn, and it features a prominent asterism known as the Northern Cross. (en)
- Cygnus contains Deneb, one of the brightest stars in the night sky, as its "tail star" and one corner of the Summer Triangle. (en)
- Ле́бідь (лат. Cygnus) — сузір'я північної півкулі неба. (uk)
- Лебідь — це Зевс (Ζεύς), що перетворився на птаха задля здобуття прекрасної Леди (Λήδα) дружини короля Спарти (Σπάρτη). (uk) [ordinary word: лебідь (a bird, 'птах')]
- A Hattyú (latin: Cygnus) egy csillagkép. (hu)
- A gyászoló barátját, Küknoszt Apollón változtatta hattyúvá – Zeusz egyik szent állata – és emelte az égboltra. (hu) [ordinary word: hattyú]

### Міф

- In Greek mythology, Cygnus has been identified with several different legendary swans. (en)
- Zeus disguised himself as a swan to seduce Leda, Spartan king Tyndareus's wife, who gave birth to the Gemini, Helen of Troy, and Clytemnestra, and Orpheus was transformed into a swan after his murder and said to have been placed in the sky next to his lyre (Lyra). (en)
- Later Romans also associated this constellation with the tragic story of Phaethon, the son of Helios the sun god, who demanded to ride his father's sun chariot for a day. (en)
- Phaethon, however, was unable to control the reins, forcing Zeus to destroy the chariot (and Phaethon) with a thunderbolt, causing it to plummet to the earth into the river Eridanus. (en)
- According to the myth, Phaethon's close friend or lover, Cygnus of Liguria, grieved bitterly and spent many days diving into the river to collect Phaethon's bones to give him a proper burial. (en)
- The gods were so touched by Cygnus's devotion that they turned him into a swan and placed him among the stars. (en)
- In Ovid's Metamorphoses, there are three people named Cygnus, all of whom are transformed into swans. (en) [other versions exist]

### Та сама історія й імена українською та угорською

- Лебідь — це Зевс (Ζεύς), що перетворився на птаха задля здобуття прекрасної Леди (Λήδα) дружини короля Спарти (Σπάρτη). (uk)
- Лебідь — це Орфей (Ὀρφεύς), після смерті взятий на небо разом з Лірою. (uk)
- Фаетон і його трагедія: У міфі Фаетон переконує свого батька, Геліоса, дозволити йому керувати колісницею. (uk; https://uk.wikipedia.org/wiki/Візничий_(сузір'я), версія 46689389) [Phaethon and Helios in Ukrainian; from the Ukrainian Auriga article (the Ukrainian Cygnus article does not tell the Phaethon story)]
- Зрештою, Зевс убив Фаетона блискавкою, поклавши кінець його життя. (uk; https://uk.wikipedia.org/wiki/Візничий_(сузір'я), версія 46689389) [from the Ukrainian Auriga article]
- Вони були синами Леди, але мали різних батьків: Кастор був смертним сином спартанського царя Тіндарея, а Полідевк — безсмертним сином Зевса, який спокусив Леду. (uk; https://uk.wikipedia.org/wiki/Близнята_(сузір'я), версія 48496956) [Tyndareus and Leda in Ukrainian; from the Ukrainian Gemini article]
- Кікн (син Сфенела) (uk; https://uk.wikipedia.org/wiki/Кікн, версія 12541212) [Cycnus — a line of the Ukrainian disambiguation page 'Кікн', not a sentence; the article it points to does not exist (404 on 2026-11-25)]
- Ерідан (uk; https://www.wikidata.org/wiki/Q10433) [Eridanus — label of the constellation item; the river as such is not sourced]
- A görög mítosz szerint Phaethón, Héliosz fia vagy unokaöccse olyan szerencsétlenül kormányozta a szekerét, hogy balesetet szenvedett és meghalt. (hu)
- A gyászoló barátját, Küknoszt Apollón változtatta hattyúvá – Zeusz egyik szent állata – és emelte az égboltra. (hu)
- Más változat szerint Phaethón maga emelkedett az égbe hattyú képében. (hu)
- Egy másik monda: Zeusz azért változott hattyúvá, hogy részt vehessen egy tiltott szerelmi találkán. (hu)
- Kasztór és Pollux Zeusz és Léda, Tündareósz spártai király feleségének a fiai voltak, ők születtek a hattyúvá vált királynő egyik tojásából (a másikból Heléna, aki előbb Menelaosz spártai király, majd Parisz, trójai királyfi felesége lett). (hu; https://hu.wikipedia.org/wiki/Ikrek_csillagkép, версія 29273898) [Leda and Tyndareus in Hungarian; from the Hungarian Gemini article — note that here the queen, not Zeus, turns into a swan]
- A másik monda Orpheuszhoz fűződik, aki az alvilágból akarta visszahozni kedvesét. (hu; https://hu.wikipedia.org/wiki/Lant_csillagkép, версія 27074368) [Orpheus in Hungarian; from the Hungarian Lyra article]

### Народні назви

- Українська народна назва: Хрест. (uk)
- Інші назви: грец. Κύκνος, араб. الدجاجة — Курка, також іноді називають Північний Хрест, за аналогією з Південний Хрест. (uk)
- A kereszt alakú csillagképet Északi Kereszt-nek is nevezik. (hu) ['Northern Cross'; not said to be a folk name]

### Хто вніс до переліку

- Cygnus /ˈsɪɡnəs/ Cyg Cygn Cygni ancient Ptolemy swan Deneb 1.25 804 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- Cygnus was among the 48 constellations listed by the 2nd-century astronomer Ptolemy, and it remains one of the 88 modern constellations. (en)
- Відоме з античних часів, Клавдій Птолемей включив його в свій Альмагест — каталог зоряного неба. (uk)

Розбіжності версій і як їх обійдено: Англійська стаття не має однієї головної версії: Зевс і Леда, Орфей і — найдокладніше — Кікн, друг Фаетона. Кікна обертають на лебедя «боги» (en) чи Аполлон (hu); Фаетон гине від блискавки Зевса (en) чи через нещастя (hu) — кожна історія каже так, як стаття її мовою. Українською Кікна й річку Ерідан реченням не підтверджено, тому в українській історії версії про Кікна немає. Українські два речення про міф — без виносок.

## Ліра (Lyr)

Статті: en — https://en.wikipedia.org/wiki/Lyra, версія 1384499800; uk — https://uk.wikipedia.org/wiki/Ліра_(сузір'я), версія 49131354; hu — https://hu.wikipedia.org/wiki/Lant_csillagkép, версія 27074368.


### Фігура й назва

- is a small constellation in the Northern Sky. (en) [the sentence starts 'Lyra (Latin for 'lyre', from Ancient Greek: λύρα; pronounced: …)']
- Lyra was often represented on star maps as a vulture or an eagle carrying a lyre, and hence is sometimes referred to as Vultur Cadens or Aquila Cadens ("Falling Vulture" or "Falling Eagle", respectively). (en)
- In Greek mythology, Lyra represents the lyre of Orpheus. (en)
- Лі́ра (лат. Lyra) — невелике сузір'я північної півкулі неба, розташоване між Геркулесом і Лебедем. (uk)
- Ліра — улюблений музичний інструмент у Стародавній Греції, і, очевидно, тому міфи називають цілий ряд власників його прототипу: Аріон, Орфей і Аполлон, що одержав її від Гермеса. (uk) [ordinary word: ліра (a musical instrument)]
- A régi görögök hangszere volt a líra, innen ered a műnem („líra”) és a csillagkép neve is. (hu) [ordinary word: líra]
- A lírát a hangszertanban járomlantnak is nevezik, az ógörög szövegek magyar fordításában gyakran lant néven szerepel, ehhez igazodik a csillagkép magyar neve is. (hu) [why the Hungarian name is Lant]

### Міф

- In Greek mythology, Lyra represents the lyre of Orpheus. (en)
- Orpheus's music was said to be so great that even inanimate objects such as rocks could be charmed. (en)
- At one point, Orpheus married Eurydice, a nymph. (en)
- To reclaim her, Orpheus entered the Underworld, where the music from his lyre charmed Hades, the god of the Underworld. (en)
- Hades relented and let Orpheus bring Eurydice back, on the condition that he never once look back until outside. (en)
- Unfortunately, near the very end, Orpheus faltered and looked back, causing Eurydice to be left in the Underworld forever. (en)
- Both myths then state that his lyre was placed in the sky by Zeus and Orpheus's bones were buried by the muses. (en)
- The Roman book De astronomia, attributed to Hyginus, also records another myth about Lyra, which said that it belonged to Theseus "for he was skilful in all the arts and seems to have learned the lyre as well". (en) [another version]

### Та сама історія й імена українською та угорською

- Ліра — улюблений музичний інструмент у Стародавній Греції, і, очевидно, тому міфи називають цілий ряд власників його прототипу: Аріон, Орфей і Аполлон, що одержав її від Гермеса. (uk)
- Еврідіка (д.-грец. Εὐρυδίκη) — персонаж давньогрецької міфології, німфа та дружина Орфея, яку він намагався повернути з мертвих своєю музикою. (uk; https://uk.wikipedia.org/wiki/Еврідіка, версія 45860772) [first sentence of the Ukrainian article about Eurydice (the Ukrainian Lyra article does not tell the story)]
- Лебідь — це Орфей (Ὀρφεύς), після смерті взятий на небо разом з Лірою. (uk; https://uk.wikipedia.org/wiki/Лебідь_(сузір'я), версія 44361572) [Orpheus and the lyre in the sky; from the Ukrainian Cygnus article]
- Коли Аїд викрав Персефону, Деметра в пошуках дочки прокляла поля Сицилії, і врожаї загинули. (uk; https://uk.wikipedia.org/wiki/Діва_(сузір'я), версія 49230943) [Hades in Ukrainian (Аїд); from the Ukrainian Virgo article]
- Зевс (uk; https://www.wikidata.org/wiki/Q34201) [Zeus]
- Музи (uk; https://www.wikidata.org/wiki/Q66016) [the Muses]
- A lírát a mitológia szerint Hermész találta fel, de csínytevései miatt Apollónnak kellett adnia. (hu)
- Az egyik monda szerint ez a lant Arióné volt, aki ennek segítségével menekült meg a biztos halálból. (hu)
- A másik monda Orpheuszhoz fűződik, aki az alvilágból akarta visszahozni kedvesét. (hu)
- Énekével megszelídítette a Kerberoszt, Perszephoné pedig visszaengedte Eurüdikét azzal a feltétellel, hogy Orpheusz nem néz hátra. (hu)
- A dalnok azonban nem bírta ki, hogy vissza ne nézzen, s örökre elveszítette kedvesét. (hu)
- az alvilág istene, a holtak ura a görög mitológiában, egyben az alvilág szinonimája is lett. (hu; https://hu.wikipedia.org/wiki/Hadész, версія 29067922) [first sentence of the Hungarian article 'Hadész'; it starts 'Hadész vagy kiejtve Hádész (…)']
- Hadész (hu; https://www.wikidata.org/wiki/Q41410) [Hades, as the article title spells it]

### Хто вніс до переліку

- Lyra /ˈlaɪrə/ Lyr Lyra Lyrae ancient Ptolemy lyre / harp Vega 0.03 286 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- It is one of the 48 listed by the 2nd century astronomer Ptolemy, and is one of the 88 modern constellations recognized by the International Astronomical Union. (en)
- Включене в каталог зоряного неба Клавдія Птолемея «Альмагест». (uk)
- Egyike annak a 48 csillagképnek, amelyet az i. sz. 2. században élt Klaudiosz Ptolemaiosz görög csillagász felsorolt, és egyike annak a 88 csillagképnek, amelyet a Nemzetközi Csillagászati Unió is elismer. (hu)

Розбіжності версій і як їх обійдено: Еврідіку відпускає Аїд (en) чи Персефона, коли пісня приборкала Кербера (hu); ліра — Орфеєва (en) чи спершу Аріонова (hu) — кожна історія каже так, як стаття її мовою. В українській статті про Ліру історії немає: імена — зі статті про Еврідіку та зі статей про Лебедя й Діву; «Зевс» українською — лише назва у Вікіданих.

## Орел (Aql)

Статті: en — https://en.wikipedia.org/wiki/Aquila_(constellation), версія 1385473408; uk — https://uk.wikipedia.org/wiki/Орел_(сузір'я), версія 44382916; hu — https://hu.wikipedia.org/wiki/Sas_csillagkép, версія 26148156.


### Фігура й назва

- Its name is Latin for 'eagle'. (en)
- Some sources claim it represents the bird that carried Zeus/Jupiter's thunderbolts in Greco-Roman mythology, while others say it was the bird that Zeus ordered to attack Prometheus. (en)
- The constellation was also known as Vultur volans (the flying vulture) to the Romans, not to be confused with Vultur cadens which was their name for Lyra. (en)
- Оре́л (лат. Aquila) — екваторіальне сузір'я. (uk)
- Греки бачили в ньому орла, посланого Зевсом для викрадення Ганімеда. (uk) [ordinary word: орел]
- A Sas (latin: Aquila) egy csillagkép. (hu)
- Már egy Kr.e. 1200-ból származó domborművön is sasként ábrázolták. (hu) [ordinary word: sas]
- A görögök szemében a sas - a levegő többi teremtményéhez hasonlóan - Zeusz madara volt (a római mitológiában Iuppiteré). (hu)

### Міф

- It is often held to represent the eagle which held Zeus's/Jupiter's thunderbolts in Greco-Roman mythology. (en)
- Aquila is also associated with the eagle that kidnapped Ganymede, a son of one of the kings of Troy (associated with Aquarius), to Mount Olympus to serve as cup-bearer to the gods. (en)
- In classical Greek mythology, Aquila was identified as Αετός Δίας (Aetos Dios), the eagle that carried the thunderbolts of Zeus and was sent by him to carry the shepherd boy Ganymede, whom he desired, to Mount Olympus; the constellation of Aquarius is sometimes identified with Ganymede. (en) [stands in the section 'Mythology', which carries the banner 'This section needs more citations' (November 2009)]
- The Greek Aquila is probably based on the Babylonian constellation of the Eagle, but is sometimes mistakenly thought as a seagull which is located in the same area as the Greek constellation. (en)
- Some sources claim it represents the bird that carried Zeus/Jupiter's thunderbolts in Greco-Roman mythology, while others say it was the bird that Zeus ordered to attack Prometheus. (en) [another version (Prometheus)]

### Та сама історія й імена українською та угорською

- Ще 5 тисячоліть тому шумери назвали це сузір'я Орлом. (uk)
- Греки бачили в ньому орла, посланого Зевсом для викрадення Ганімеда. (uk)
- Ганімед (uk; https://www.wikidata.org/wiki/Q131588) [Ganymede, nominative]
- Олімп (uk; https://www.wikidata.org/wiki/Q80344) [Mount Olympus]
- Троя (uk; https://www.wikidata.org/wiki/Q22647) [Troy]
- Викрав з Олімпу вогонь і передав його людям, за що був ув'язнений богами. (uk; https://uk.wikipedia.org/wiki/Прометей, версія 48881991) [from the lead of the Ukrainian article 'Прометей' (for the other version; the eagle itself is not in this sentence)]
- Прометей (uk; https://www.wikidata.org/wiki/Q83160) [Prometheus]
- A madarak királyát kitüntetett királyi szolgaként és a nagy égisten harci állataként tartották számon, akinek többek között az volt a feladata, hogy visszaszerezze a villámokat, amelyeket Zeusz elhajigált. (hu)
- A Sas csillagképhez fűződik Ganümédész, a szépséges ifjú halandó elrablásának és elcsábításának mítosza, amelyben a szerelemre gerjedt Zeusz jelenik meg a madár képében. (hu)
- Mezítelenül egy oszlophoz láncolták a Kaukázus hegységben, s hajnaltól alkonyatig Zeusz sasmadara tépte a máját. (hu) [the Prometheus version]
- Mikor Zeusz ráállt a cserére, Héraklész szíven lőtte a sasmadarat. (hu)
- Egyes források arról tudósítanak, hogy Prométheusz - akinek neve "előrelátót" jelent - a titánok utolsó nemzedékéhez tartozott, s az első istenpár, Uranosz és Gaia gyermeke volt. (hu)
- Hésziodosz szerint nyomban születése után az Olümposzra röppent, ahol Zeusz számára a villámokat és mennyköveket szállítja. (hu; https://hu.wikipedia.org/wiki/Pegasus_csillagkép, версія 24276367) [Mount Olympus in Hungarian (Olümposz); from the Hungarian Pegasus article]
- Trója (hu; https://www.wikidata.org/wiki/Q22647) [Troy]

### Народні назви

- Стародавня українська назва цього сузір'я — «Дівчина з відрами». (uk)

### Хто вніс до переліку

- Aquila /ˈækwɪlə/ Aql Aqil Aquilae ancient Ptolemy eagle Altair 0.76 652 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- Aquila was one of the 48 constellations described by the second-century astronomer Ptolemy. (en)
- It had been earlier mentioned by Eudoxus in the fourth century BC and Aratus in the third century BC. (en)
- Орел включений в каталог зоряного неба Клавдія Птолемея «Альмагест». (uk)

Розбіжності версій і як їх обійдено: Ганімеда забирає орел, посланий Зевсом (en, uk), чи сам Зевс у подобі птаха (hu) — англійська історія називає обидві версії. Англійська стаття називає Ганімеда то сином царя, то пастушком — в історіях цього немає. Розділ «Mythology» англійської статті має позначку «потрібні додаткові посилання»; українське речення про «Дівчину з відрами» й угорські речення про міфи — без виносок. Українською «Ганімед», «Олімп», «Прометей» — зі статей і назв у Вікіданих.

## Великий Пес (CMa)

Статті: en — https://en.wikipedia.org/wiki/Canis_Major, версія 1375700656; uk — https://uk.wikipedia.org/wiki/Великий_Пес, версія 48886377; hu — https://hu.wikipedia.org/wiki/Nagy_Kutya_csillagkép, версія 19108779.


### Фігура й назва

- Its name is Latin for "greater dog" in contrast to Canis Minor, the "lesser dog"; both figures are commonly represented as following the constellation of Orion, the hunter, through the sky. (en)
- Canis Major contains Sirius, the brightest star in the night sky, known as the "dog star". (en)
- The Ancient Greeks replaced the bow and arrow depiction with that of a dog. (en)
- Назва латинською означає «більший пес» — на противагу сузір'ю Малий Пес («менший пес»). (uk)
- Латинське canis означає «пес, собака», а major — «більший», «старший» (порівняльний ступінь прикметника magnus — «великий»). (uk) [ordinary word: пес, собака]
- Обидва сузір'я традиційно зображують як собак, що супроводжують мисливця Оріона на небі. (uk)
- A Nagy Kutya (latin: Canis Major) egy csillagkép. (hu)
- Úgy tartják, hogy a Nagy Kutya és a Kis Kutya Orionnak, az égi vadásznak vadászati kísérői, és ennek megfelelően követik őt a napi, keletről nyugat felé tartó mozgásban. (hu) [ordinary word: kutya]

### Міф

- In Greek Mythology, Canis Major represented the dog Laelaps, a gift from Zeus to Europa; or sometimes the hound of Procris, Diana's nymph; or the one given by Aurora to Cephalus, so famed for its speed that Zeus elevated it to the sky. (en) [three versions in one sentence]
- It was also considered to represent one of Orion's hunting dogs, pursuing Lepus the Hare or helping Orion fight Taurus the Bull; and is referred to in this way by Aratos, Homer and Hesiod. (en)
- The ancient Greeks refer only to one dog, but by Roman times, Canis Minor appears as Orion's second dog. (en)
- The Roman myth refers to Canis Major as Custos Europae, the dog guarding Europa but failing to prevent her abduction by Jupiter in the form of a bull, and as Janitor Lethaeus, "the watchdog". (en)
- In Greek mythology, Canis Minor was sometimes connected with the Teumessian Fox, a beast turned into stone with its hunter, Laelaps, by Zeus, who placed them in heaven as Canis Major (Laelaps) and Canis Minor (Teumessian Fox). (en; https://en.wikipedia.org/wiki/Canis_Minor, версія 1386399390) [the fuller Laelaps story; from the English Canis Minor article]

### Та сама історія й імена українською та угорською

- У давньогрецькій традиції замість образу лука та стріли це сузір'я стали зображувати як собаку. (uk)
- У давньогрецькій міфології Великий Пес уособлював Лелапа — собаку, подарованого Зевсом Європі. (uk)
- За іншою версією, це був мисливський пес Прокріди, супутниці Артеміди, або собака, подарований Еос Кефалу, відомий своєю надзвичайною швидкістю, через що Зевс підніс його на небо. (uk)
- Також вважалося, що сузір'я зображує одного з мисливських собак Оріона, який переслідує Зайця або допомагає Оріону в боротьбі з Тельцем; саме в такому значенні його згадують Арат, Гомер і Гесіод. (uk)
- У римській міфології Великий Пес згадується як Custos Europae («охоронець Європи») — пес, який охороняв Європу, але не зміг запобігти її викраденню Юпітером, що набув образу бика, а також як Janitor Lethaeus («сторож Лети», буквально — «сторожовий пес»). (uk)
- У сузір'ї Великого Пса розташований Сіріус — найяскравіша зоря нічного неба, відома також як «Собача зоря». (uk)
- Лелап (uk; https://www.wikidata.org/wiki/Q907245) [Laelaps, nominative]
- Egy másik görög monda szerint a Kis Kutya a teumésszoszi róka volt, akit soha nem sikerült elfogni vadászat közben, a Nagy Kutya pedig Lailapsz, Kephalosz kutyája, aki hiába üldözte a rókát, míg végül mindketten kővé váltak. (hu; https://hu.wikipedia.org/wiki/Kis_Kutya_csillagkép, версія 26050396) [Laelaps and Cephalus in Hungarian; from the Hungarian Canis Minor article (the Hungarian Canis Major article has no Greek story)]
- A két állatot Zeusz helyezte el az égen. (hu; https://hu.wikipedia.org/wiki/Kis_Kutya_csillagkép, версія 26050396) [from the Hungarian Canis Minor article]
- A görög mitológiában Zeusz egy fehér bika alakjában rabolta el Európét, a föníciai hercegnőt, és Kréta szigetére úszott vele. (hu; https://hu.wikipedia.org/wiki/Bika_csillagkép, версія 28729197) [Europa in Hungarian; from the Hungarian Taurus article]
- Későbbieknél Éósz lova, és mint ilyen, a csillagképek egyike. (hu; https://hu.wikipedia.org/wiki/Pegasus_csillagkép, версія 24276367) [Eos (the English 'Aurora') in Hungarian; from the Hungarian Pegasus article]
- Prokrisz (hu; https://www.wikidata.org/wiki/Q1139470) [Procris; no Hungarian article]
- Az ókori Egyiptom számára a fél évig nem látható Szíriusz heliákus felkelése – azaz a Nappal együtt kelése – egyet jelentett a Nílus évenként ismétlődő, életet adó áradásával, a méz eredetével, a kutyák nyári izgatottságával (amiből a „kánikula” szavunk származik), és a mesés főnix madárral. (hu) [Sirius in Hungarian (Szíriusz)]

### Народні назви

- A Nagy Kutya csillagképbeli Szíriusz neve Sánta Kata. (hu; https://hu.wikipedia.org/wiki/Orion_csillagkép, версія 28644915) [Hungarian folk name of Sirius; from the Hungarian Orion article]

### Хто вніс до переліку

- Canis Major /ˈkeɪnɪs ˈmeɪdʒər/ CMa CMaj Canis Majoris ancient Ptolemy greater dog Sirius −1.46 380 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- In the second century, it was included in Ptolemy's 48 constellations, and is counted among the 88 modern constellations. (en)
- У II столітті його було включено до каталогу 48 сузір'їв Птолемея, а нині належить до 88 сузір'їв сучасної астрономії. (uk)

Розбіжності версій і як їх обійдено: Лелапа піднесено на небо за швидкість (en про Великого Пса, uk) чи обернено на камінь разом із лисицею (en про Малого Пса, hu) — українська й англійська історії кажуть перше, угорська — друге. Угорська стаття про Великого Пса грецького міфу не розповідає: історію взято з угорської статті про Малого Пса.

## Малий Пес (CMi)

Статті: en — https://en.wikipedia.org/wiki/Canis_Minor, версія 1386399390; uk — https://uk.wikipedia.org/wiki/Малий_Пес, версія 49211338; hu — https://hu.wikipedia.org/wiki/Kis_Kutya_csillagkép, версія 26050396.


### Фігура й назва

- Its name is Latin for "lesser dog", in contrast to Canis Major, the "greater dog"; both figures are commonly represented as following the constellation of Orion the hunter. (en)
- The Ancient Greeks called the constellation προκυων/Procyon, "coming before the dog", transliterated into Latin as Antecanis, Praecanis, or variations thereof, by Cicero and others. (en)
- Мали́й Пес (лат. Canis Minor) — екваторіальне сузір'я. (uk)
- На зоряних картах Великий і Малий Пси супроводжують мисливця Оріона. (uk) [ordinary word: пес (plural 'Пси')]
- Латинське canis означає «пес, собака», а major — «більший», «старший» (порівняльний ступінь прикметника magnus — «великий»). (uk; https://uk.wikipedia.org/wiki/Великий_Пес, версія 48886377) [the word for dog explained; from the Ukrainian Canis Major article]
- A Kis Kutya (latin: Canis Minor) egy csillagkép a téli égbolton, Orionnak, a Vadásznak a kisebbik kutyája. (hu) [ordinary word: kutya]

### Міф

- In Greek mythology, Canis Minor was sometimes connected with the Teumessian Fox, a beast turned into stone with its hunter, Laelaps, by Zeus, who placed them in heaven as Canis Major (Laelaps) and Canis Minor (Teumessian Fox). (en)
- Eratosthenes accompanied the Little Dog with Orion, while Hyginus linked the constellation with Maera, a dog owned by Icarius of Athens. (en)
- On discovering the latter's death, the dog and Icarius' daughter Erigone took their lives and all three were placed in the sky—Erigone as Virgo and Icarius as Boötes. (en)
- As a reward for his faithfulness, the dog was placed along the "banks" of the Milky Way, which the ancients believed to be a heavenly river, where he would never suffer from thirst. (en)
- Canis Minor was one of the original 48 constellations formulated by Ptolemy in his second-century Almagest, in which it was defined as a specific pattern (asterism) of stars; Ptolemy identified only two stars and hence no depiction was possible. (en)

### Та сама історія й імена українською та угорською

- Тевмесська лисиця (д.-грец. ἀλώπηξ Τευμησσοῦ) — персонаж давньогрецької міфології. (uk; https://uk.wikipedia.org/wiki/Тевмесська_лисиця, версія 46618603) [first sentence of the Ukrainian article about the Teumessian fox (the Ukrainian Canis Minor article has no myth)]
- Було визначено долею, що ніхто не зможе її наздогнати. (uk; https://uk.wikipedia.org/wiki/Тевмесська_лисиця, версія 46618603)
- У давньогрецькій міфології Великий Пес уособлював Лелапа — собаку, подарованого Зевсом Європі. (uk; https://uk.wikipedia.org/wiki/Великий_Пес, версія 48886377) [Laelaps and Zeus in Ukrainian; from the Ukrainian Canis Major article]
- У ньому йдеться про Ікарія, якого бог виноробства Діоніс навчив вирощувати виноград і робити з нього вино. (uk; https://uk.wikipedia.org/wiki/Волопас_(сузір'я), версія 48992220) [Icarius in Ukrainian; from the Ukrainian Boötes article]
- Його вірний пес Мера знайшов тіло господаря та привів до нього його дочку Ерігону. (uk; https://uk.wikipedia.org/wiki/Волопас_(сузір'я), версія 48992220) [Maera and Erigone in Ukrainian; from the Ukrainian Boötes article]
- Зевс, зглянувшись над їхньою трагічною долею, вирішив ушанувати їх, перетворивши на зоряні сузір'я: Ікарій став сузір'ям Волопаса, Ерігона — сузір'ям Діви й Мера — сузір'ям Великого Пса, або Малого Пса. (uk; https://uk.wikipedia.org/wiki/Волопас_(сузір'я), версія 48992220) [from the Ukrainian Boötes article]
- Гігін ототожнював Діву з Ерігоною, дочкою Ікарія, яка повісилася після загибелі батька; сам Ікарій став сузір'ям Волопаса, що межує з Дівою на півночі, а його собака Мера — зорею Проціон. (uk; https://uk.wikipedia.org/wiki/Діва_(сузір'я), версія 49230943) [from the Ukrainian Virgo article]
- Давньогрецький астроном Клавдій Птолемей включив це сузір'я до свого каталогу Альмагест під іменем головної зірки — Проціон. (uk)
- A Kis Kutya a Révai nagy lexikona szerint 'Maira, Ikariosz hű kutyája, akinek a segítségével Ikariosz lánya, Érigoné megtalálta apja elásott holttestét. (hu) [the stray apostrophe before Maira is on the page]
- Egy másik görög monda szerint a Kis Kutya a teumésszoszi róka volt, akit soha nem sikerült elfogni vadászat közben, a Nagy Kutya pedig Lailapsz, Kephalosz kutyája, aki hiába üldözte a rókát, míg végül mindketten kővé váltak. (hu)
- A két állatot Zeusz helyezte el az égen. (hu)

### Хто вніс до переліку

- Canis Minor /ˈkeɪnɪs ˈmaɪnər/ CMi CMin Canis Minoris ancient Ptolemy lesser dog Procyon 0.34 183 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- In the second century, it was included as an asterism, or pattern, of two stars in Ptolemy's 48 constellations, and it is counted among the 88 modern constellations. (en)
- Давньогрецький астроном Клавдій Птолемей включив це сузір'я до свого каталогу Альмагест під іменем головної зірки — Проціон. (uk)

Розбіжності версій і як їх обійдено: Мера стає Малим Псом, «Великим або Малим Псом», зорею Проціон чи псом Гончих Псів — залежно від статті; в історіях сказано лише, що це його міф. В українській статті про Малого Пса міфу немає: речення — зі статей про Тевмесську лисицю, Великого Пса, Волопаса й Діву. Українська стаття пише пса і «Мера», і «Маера» — узято «Мера».

## Лев (Leo)

Статті: en — https://en.wikipedia.org/wiki/Leo_(constellation), версія 1386414356; uk — https://uk.wikipedia.org/wiki/Лев_(сузір'я), версія 49224960; hu — https://hu.wikipedia.org/wiki/Oroszlán_csillagkép, версія 28106063.


### Фігура й назва

- Its name is Latin for lion, and to the ancient Greeks represented the Nemean Lion killed by the mythical Greek hero Heracles as one of his twelve labors. (en)
- One of the 48 constellations described by the 2nd-century astronomer Ptolemy, Leo remains one of the 88 modern constellations today, and one of the most easily recognizable due to its many bright stars and a distinctive shape that is reminiscent of the crouching lion it depicts. (en)
- Лев (лат. Leo) — зодіакальне сузір'я розташоване між сузір'ями Рака та Діви. (uk)
- Стародавні греки асоціювали сузір'я з персонажем міфів немейським левом. (uk) [ordinary word: лев]
- Az Oroszlán (latin: Leo) egy csillagkép, egyike a 12 állatövi csillagképnek. (hu)
- Az Oroszlán csillagkép a nemeai oroszlánról kapta a nevét, akit Héraklész pusztított el a tizenkét munkájának egyike során. (hu) [ordinary word: oroszlán]

### Міф

- In Greek mythology, Leo was identified as the Nemean Lion which was killed by Heracles (Hercules to the Romans) during the first of his twelve labours. (en)
- The Lion was impervious to any weaponry; thus, the warriors' clubs, swords, and spears were rendered useless against it. (en)
- Realizing that he must defeat the Lion with his bare hands, Hercules slipped into the Lion's cave and engaged it at close quarters. (en)
- When the Lion pounced, Hercules caught it in midair, one hand grasping the Lion's forelegs and the other its hind legs, and bent it backwards, breaking its back and freeing the trapped maidens. (en)
- Zeus commemorated this labor by placing the Lion in the sky. (en)
- Some mythologists believe that in Sumeria, Leo represented the monster Humbaba, who was killed by Gilgamesh. (en) [another tradition]

### Та сама історія й імена українською та угорською

- Стародавні греки асоціювали сузір'я з персонажем міфів немейським левом. (uk)
- в давньогрецькій міфології страхітливий звір, який пустошив арголідську долину Немею. (uk; https://uk.wikipedia.org/wiki/Немейський_лев, версія 46618586) [first sentence of the Ukrainian article 'Немейський лев'; it starts 'Неме́йський лев (грец. Λέων της Νεμέας) —']
- Шкура його була невразливою до будь-якої зброї. (uk; https://uk.wikipedia.org/wiki/Немейський_лев, версія 46618586)
- Геракл задушив лева, загнавши його в печеру, що стало першим подвигом героя з 12-и на службі в царя Еврістея. (uk; https://uk.wikipedia.org/wiki/Немейський_лев, версія 46618586)
- Для вшанування подвигу Геракла Зевс перетворив Немейського лева на сузір'я. (uk; https://uk.wikipedia.org/wiki/Немейський_лев, версія 46618586)
- Найбільш відомий з них — герой, син бога Зевса та людської жінки Алкмени, знаний своїми подвигами на службі в царя Еврістея, боротьбою з гігантами та звільненням Прометея. (uk; https://uk.wikipedia.org/wiki/Геракл, версія 47813875) [from the lead of the Ukrainian article 'Геракл']
- Az Oroszlán csillagkép a nemeai oroszlánról kapta a nevét, akit Héraklész pusztított el a tizenkét munkájának egyike során. (hu)
- A szörnyet Zeusz helyezte az égre Héraklész hőstette emlékére. (hu)
- A nemeai oroszlán egyébként az Orthosz nevű kutya és ennek édesanyja, Ekhidna gyermeke, a thébai Szphinx testvére volt, akit Héra, mások szerint Szeléné nevelt fel. (hu)

### Хто вніс до переліку

- Leo /ˈliːoʊ/ Leo Leon Leonis ancient Ptolemy lion Regulus 1.35 947 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- Leo was one of the earliest recognized constellations, with archaeological evidence that the Mesopotamians had a similar constellation as early as 4000 BCE. (en)
- Включене до каталогу зоряного неба Альмагест давньогрецьким астрономом Птолемеєм у II столітті. (uk)

Розбіжності версій і як їх обійдено: Геракл ламає левові хребет (en) чи душить його (uk) — в історіях сказано «голими руками». Англійська подробиця про полонених дівчат є лише в англійській статті — її в історіях немає.

## Волопас (Boo)

Статті: en — https://en.wikipedia.org/wiki/Boötes, версія 1384468562; uk — https://uk.wikipedia.org/wiki/Волопас_(сузір'я), версія 48992220; hu — https://hu.wikipedia.org/wiki/Ökörhajcsár_csillagkép, версія 29371135.


### Фігура й назва

- The name comes from Latin: Boōtēs, which comes from Ancient Greek: Βοώτης, romanized: Boṓtēs 'herdsman' or 'plowman' (literally, 'ox-driver'; from βοῦς boûs 'cow'). (en)
- The ancient Greeks saw the asterism now called the "Big Dipper" or "Plough" as a cart with oxen. (en)
- Sometimes Arcturus is depicted as leading the hunting dogs of nearby Canes Venatici and driving the bears of Ursa Major and Ursa Minor. (en)
- це одне з найпомітніших сузір'їв у північній півкулі, яке найкраще видно навесні та влітку. (uk) [the sentence starts 'Волопа́с (лат. Boötes від грец. Βοώτης, «орач на волах») —'; ordinary word: орач на волах]
- Він був орачем, який поганяв биків, що, згідно з давніми уявленнями, складали сузір'я Великої Ведмедиці. (uk) [ordinary word: орач]
- Az Ökörhajcsár (latin: Bootes) egy csillagkép. (hu) [ordinary word: ökörhajcsár (ox-driver) — the constellation's own name]
- Az egyik szerint az Ökörhajcsár találta fel a szántást. (hu)

### Міф

- Exactly whom Boötes is supposed to represent in Greek mythology is not clear. (en)
- According to one version, he was a son of Demeter, Philomenus, twin brother of Plutus, a plowman who drove the oxen in the constellation Ursa Major. (en)
- Some myths say that Boötes invented the plow and was memorialized for his ingenuity as a constellation. (en)
- Another myth associated with Boötes by Hyginus is that of Icarius, who was schooled as a grape farmer and winemaker by Dionysus. (en) [another version, the most fully told]
- Icarius made wine so strong that those who drank it appeared poisoned, which caused shepherds to avenge their supposedly poisoned friends by killing Icarius. (en)
- Maera, Icarius' dog, brought his daughter Erigone to her father's body, whereupon both she and the dog died by suicide. (en)
- Zeus then chose to honor all three by placing them in the sky as constellations: Icarius as Boötes, Erigone as Virgo, and Maera as Canis Major or Canis Minor. (en)
- Following another reading, the constellation is identified with Arcas and also referred to as Arcas and Arcturus, son of Zeus and Callisto. (en) [a third version]
- Arcturus, the name of the constellation's brightest star, comes from the Greek word meaning "guardian of the bear". (en)

### Та сама історія й імена українською та угорською

- Однак, кого саме символізує це сузір'я в грецькій міфології, достеменно невідомо. (uk)
- За одним із переказів, Волопас був сином богині родючості Деметри, його звали Філомен, і він був братом-близнюком Плутоса. (uk)
- Деякі міфи стверджують, що саме Волопас винайшов плуг, і за цей винахід його увічнили серед зір у вигляді сузір'я. (uk)
- Один із міфів про походження сузір'я Волопаса розповів давньоримський письменник Гай Юлій Гігін. (uk)
- У ньому йдеться про Ікарія, якого бог виноробства Діоніс навчив вирощувати виноград і робити з нього вино. (uk)
- Вівчарі, які побачили це, вирішили, що їхніх друзів отруєно, і, охоплені гнівом, убили Ікарія. (uk)
- Його вірний пес Мера знайшов тіло господаря та привів до нього його дочку Ерігону. (uk)
- Зевс, зглянувшись над їхньою трагічною долею, вирішив ушанувати їх, перетворивши на зоряні сузір'я: Ікарій став сузір'ям Волопаса, Ерігона — сузір'ям Діви й Мера — сузір'ям Великого Пса, або Малого Пса. (uk)
- Аркас мало не пронизує ведмедя списом, але, щоб запобігти трагедії, Зевс піднімає їх обох у небо: так Каллісто стала сузір'ям Великої Ведмедиці, а Аркас — сузір'ям Волопаса. (uk; https://uk.wikipedia.org/wiki/Велика_Ведмедиця, версія 48449664) [the Arcas version in Ukrainian; from the Ukrainian Ursa Major article]
- аркадський цар, син Пелазга й океаніди Кіллени; мав дочку Геліку та 50 синів, відомих своєю зарозумілістю й пихою. (uk; https://uk.wikipedia.org/wiki/Лікаон, версія 36714919) [first sentence of the Ukrainian article 'Лікаон'; it starts 'Лікао́н (д.-грец. Λυκάων) —']
- A negyedik legenda szerint az athéni Ikariosszal, Érigoné atyjával azonosítja a csillagképet. (hu)
- Dionüszosz (a római mitológiában Bacchus) megtanította Ikariosznak a borkészítés titkát. (hu)
- Mivel azt hitték, mérgezés áldozatai, lemészárolták, majd eltemették Ikarioszt. (hu)
- Érigonét atyja kutyája, Maira vezette el Ikariosz sírjához. (hu)
- Zeusz (némelyek szerint maga Dionüszosz) Szűzként az égre helyezte a leányt. (hu)
- Ikariosz lett az Ökörhajcsár csillagkép, Maira pedig vagy a Procyon a Kis Kutyában vagy a szomszédos Vadászebek egyik ebe. (hu)
- A csillagkép régebbi neve Arcturus volt, azaz a Medve Őre. (hu)
- a görög mitológiában a gazdagság istene, Démétér és Iaszón Krétán született fia. (hu; https://hu.wikipedia.org/wiki/Plutosz, версія 28500067) [first sentence of the Hungarian article 'Plutosz'; gives Plutus and Demeter in Hungarian]
- Pelaszgosz fia, Kallisztó édesapja. (hu; https://hu.wikipedia.org/wiki/Lükaón_árkádiai_király, версія 23971956) [from the lead of the Hungarian article about Lycaon]
- Lükaón (hu; https://www.wikidata.org/wiki/Q501667) [Lycaon]

### Народні назви

- A másik szerint medvetáncoltató volt, aki a Nagy Medvét táncoltatja. (hu) [a legend reported in the Hungarian article (bear-leader); not said to be Hungarian folk tradition]

### Хто вніс до переліку

- Boötes /boʊˈoʊtiːz/ Boo Boot Boötis ancient Ptolemy herdsman Arcturus −0.05 907 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- One of the 48 constellations described by the 2nd-century astronomer Ptolemy, Boötes is now one of the 88 modern constellations. (en)
- Boötes is mentioned in the Odyssey as a celestial reference for maritime navigation, describing it as "late-setting" or "slow to set". (en)
- Його ще у II столітті описав давньогрецький астроном Клавдій Птолемей, включивши його до списку 48 відомих на той час сузір'їв. (uk)

Розбіжності версій і як їх обійдено: Сама англійська стаття каже, що «не ясно», кого він уособлює. На небо поміщає Зевс (en, uk), «Зевс чи Діоніс» (hu), Діоніс (en про Діву) — кожна історія каже так, як стаття її мовою. Ім'я «Філомен» (en; у Вікіданих «Філомел») сумнівне — його в історіях немає.

## Діва (Vir)

Статті: en — https://en.wikipedia.org/wiki/Virgo_(constellation), версія 1380737838; uk — https://uk.wikipedia.org/wiki/Діва_(сузір'я), версія 49230943; hu — https://hu.wikipedia.org/wiki/Szűz_csillagkép, версія 28295457.


### Фігура й назва

- The name means "maiden" in Latin and its traditional astrological symbol is . (en)
- One star in this constellation, Spica, retains this tradition as it is Latin for "ear of grain", one of the major products of the Mesopotamian furrow. (en)
- The Frond of Erua was depicted as a goddess holding a palm-frond – a motif that still occasionally appears in much later depictions of Virgo. (en)
- зодіакальне сузір'я, що лежить між Левом і Терезами. (uk) [the sentence starts 'Ді́ва (лат. Virgo, досл. «Незайманий/незаймана») —']
- Греки називали його д.-грец. Παρθένος (Парфенос — «Діва»); під цією назвою воно ввійшло до каталогу зоряного неба Клавдія Птолемея «Альмагест». (uk) [ordinary word: діва]
- Діву зазвичай зображали з крилами, з колосом пшениці в лівій руці (його позначає Спіка) і пальмовою гілкою в правій — зокрема так її намальовано в атласі Джона Флемстида «Atlas Coelestis» (1729). (uk)
- A Szűz (latin: Virgo) egy csillagkép, egyike a 12 állatövi csillagképnek. (hu)
- A görög mitológia szerint szűz volt több kiemelkedő istennő, köztük Ízisz, Kübelé, a Magna Mater (az Istenek Anyja), Pallasz Athéné. (hu) [ordinary word: szűz]
- A babiloni időkben a termékenységet szimbolizálta, kalászként értelmezték, legfényesebb csillagának, a Spicának a neve annyit tesz: búzaszem. (hu)

### Міф

- The Greeks and Romans identified the constellation with the goddesses Demeter and Persephone, as well as Astraea, a goddess of justice, who left earth during the end of the Silver Age and fled to the sky, becoming the constellation. (en)
- In the Babylonian MUL.APIN (c. 10th century BC), part of this constellation was known as "The Furrow", representing the goddess Shala and her ear of grain. (en)
- For this reason the constellation became associated with fertility. (en)
- Erigone, the daughter of Icarius of Athens, was also associated with the constellation. (en) [another version]
- Dionysus is said to have placed the father and daughter in the stars as Boötes and Virgo, respectively. (en) [another version]
- During the Middle Ages, Virgo was associated with the Virgin Mary. (en)

### Та сама історія й імена українською та угорською

- Греки найчастіше бачили в ньому богиню справедливості Діке або богиню землеробства Деметру з колосом у руці. (uk)
- Найчастіше Діву ототожнювали з Діке, богинею справедливості, дочкою Зевса і Феміди, або з Астреєю, дочкою титана Астрея й богині світанку Еос. (uk)
- За переказом, вона жила серед людей у золоту добу, коли правив Кронос, а люди не знали праці, горя, злочинів і війн. (uk)
- У срібну добу люди стали сварливими, і Діке, дорікнувши їм, пішла в гори; коли ж настали мідна й залізна доби з насильством і війнами, вона назавжди покинула Землю й піднялася на небо, де й досі перебуває поруч із Терезами — терезами правосуддя. (uk) [the fullest telling of the 'goddess of justice' version]
- Однак, найрозповсюдженіша версія, що це Деметра, дочка Кроноса і Реї, богиня плодючості і землеробства, мати Персефони. (uk)
- Коли Аїд викрав Персефону, Деметра в пошуках дочки прокляла поля Сицилії, і врожаї загинули. (uk)
- Зрештою боги дійшли компромісу: Персефона проводить частину року з чоловіком у підземному царстві, а решту — з матір'ю. (uk)
- Гігін ототожнював Діву з Ерігоною, дочкою Ікарія, яка повісилася після загибелі батька; сам Ікарій став сузір'ям Волопаса, що межує з Дівою на півночі, а його собака Мера — зорею Проціон. (uk)
- Колос у борозні належав богині Шалі — богині дощу й дружині бога бурі; саме він залишився сталим елементом сузір'я в усіх пізніших традиціях. (uk)
- A görögök Démétért látták benne, a rómaiak Cerest, később azonban Aestrae-vel, az igazság istennőjével azonosították, amint a mérleggel áll ítélkezésre készen. (hu) ['Aestrae' is the spelling on the page — unreliable; see the next items for Diké / Asztraia]
- Istárral is kapcsolatba hozható, hiszen ő volt a termékenység istennője a mezopotámiai mitológiában. (hu)
- A kereszténység terjedésével a görög-római mondák elhalványultak, a középkorban mint Szűz Máriát tartották számon. (hu)
- Diké az igazságosság istennője a görög mitológiában, Zeusz és Themisz lánya, a második generációs hórák egyike. (hu; https://hu.wikipedia.org/wiki/Diké_(istennő), версія 24145701) [first sentence of the Hungarian article about Dike]
- Mellékneve: Asztraia vagyis csillagszűz. (hu; https://hu.wikipedia.org/wiki/Diké_(istennő), версія 24145701) [Astraea in Hungarian, as a byname of Dike]
- A bronzkor kezdetén elhagyta a Földet és csillagképpé (Szűz) lett. (hu; https://hu.wikipedia.org/wiki/Diké_(istennő), версія 24145701) [the story in Hungarian; from the article about Dike]
- Énekével megszelídítette a Kerberoszt, Perszephoné pedig visszaengedte Eurüdikét azzal a feltétellel, hogy Orpheusz nem néz hátra. (hu; https://hu.wikipedia.org/wiki/Lant_csillagkép, версія 27074368) [Persephone in Hungarian; from the Hungarian Lyra article]
- Zeusz (némelyek szerint maga Dionüszosz) Szűzként az égre helyezte a leányt. (hu; https://hu.wikipedia.org/wiki/Ökörhajcsár_csillagkép, версія 29371135) [the Erigone version in Hungarian; from the Hungarian Boötes article]

### Хто вніс до переліку

- Virgo /ˈvɜːrɡoʊ/ Vir Virg Virginis ancient Ptolemy virgin, maiden Spica 0.97 1294 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- The constellation of Virgo in Hipparchus corresponds to two Babylonian constellations: the "Furrow" in the eastern sector of Virgo and the "Frond of Erua" in the western sector. (en) [the English article never mentions Ptolemy]
- Діва — одне з 48 давніх сузір'їв, описаних Клавдієм Птолемеєм в «Альмагесті»; його попередником було вавилонське сузір'я «Борозна» з колосом. (uk)

Розбіжності версій і як їх обійдено: Українська стаття називає «найчастішою» Діке, а потім «найпоширенішою» Деметру — в історії названо обидві. Коли богиня покинула Землю (кінець срібної доби, мідна й залізна, початок бронзової), статті кажуть по-різному — доби в історіях не названо, крім української «золотої доби», коли вона жила серед людей. Астрея й Діке — дві богині (uk) чи одна (hu). Спіка — «колос» (en) чи «зерно пшениці» (hu) — в угорській історії значення назви немає. Угорська сторінка має позначку про брак незалежних джерел і пише «Aestrae» — узято «Asztraia» зі статті про Діке.

## Скорпіон (Sco)

Статті: en — https://en.wikipedia.org/wiki/Scorpius, версія 1386772525; uk — https://uk.wikipedia.org/wiki/Скорпіон_(сузір'я), версія 49132320; hu — https://hu.wikipedia.org/wiki/Skorpió_csillagkép, версія 26244314.


### Фігура й назва

- Scorpius is a zodiac constellation located in the Southern celestial hemisphere, where it sits near the center of the Milky Way, between Libra to the west and Sagittarius to the east. (en)
- The Babylonians called this constellation MUL.GIR.TAB - the 'Scorpion'; the signs can be literally read as 'the (creature with) a burning sting'. (en)
- In some old descriptions the constellation of Libra is treated as the Scorpion's claws. (en)
- Скорпіо́н (лат. Scorpius) — зодіакальне сузір'я південної півкулі неба. (uk)
- Ланцюжок зір у сузір'ї Скорпіона часто виділяють як астеризм Хвіст (Жало) скорпіона. (uk) [ordinary word: скорпіон (tail, sting)]
- A Skorpió (latin: Scorpius) egy csillagkép, egyike a 12 állatövi csillagképnek. (hu)
- A történet szerint ez a skorpió ölte meg Oriont, a vadászt. (hu) [ordinary word: skorpió]

### Міф

- In Greek mythology, several myths associated with Scorpius attribute it to Orion. (en)
- According to one version, Orion boasted to the goddess Artemis and her mother, Leto, that he would kill every animal on Earth. (en)
- Artemis and Leto sent a giant scorpion to kill Orion. (en)
- Their battle caught the attention of Zeus, who raised both combatants to the sky to serve as a reminder for mortals to curb their excessive pride. (en)
- In another version of the myth, Artemis' twin brother, Apollo, was the one who sent the scorpion to kill Orion after the hunter earned the goddess' favor by admitting she was better than him. (en) [another version]
- After Zeus raised Orion and the scorpion to the sky, the former hunts every winter but flees every summer when the scorpion comes. (en)

### Та сама історія й імена українською та угорською

- На острові Крит Оріон полював з богинею Артемідою та її матір'ю Лето і під час полювання погрожував убити всіх звірів на Землі. (uk; https://uk.wikipedia.org/wiki/Оріон_(сузір'я), версія 49179190) [the Ukrainian Scorpius article has no myth; this and the next three are from the Ukrainian Orion article]
- Гея (у деяких версіях — Аполлон, який не схвалював стосунків своєї сестри з чоловіком) заперечила й послала гігантського скорпіона, щоб убити Оріона. (uk; https://uk.wikipedia.org/wiki/Оріон_(сузір'я), версія 49179190)
- Після його смерті богині попросили Зевса розмістити Оріона серед сузір'їв. (uk; https://uk.wikipedia.org/wiki/Оріон_(сузір'я), версія 49179190)
- Зевс погодився і, як пам'ять про смерть Оріона, також помістив на небо Скорпіона. (uk; https://uk.wikipedia.org/wiki/Оріон_(сузір'я), версія 49179190)
- Mitológiai története összekapcsolódik az Orionnal. (hu)
- Az égen is üldözi őt, de itt már sosem érheti el: csak akkor kerül a látóhatár fölé keleten, miután Orion már lenyugodott nyugaton. (hu)
- Egy monda szerint Artemisz, a vadászat istennője küldte a skorpiót Orion után azért, hogy ölje meg őt. (hu)
- Egy másik változat szerint a Földanya ölette meg a skorpióval a fennhéjázó Oriont, aki kijelentette, hogy minden vadállatot meg tud ölni. (hu)
- Létó görög mitológiai alak, Koiosz és Phoibé leánya, Aszteria nővére, Zeusz kedvese, Apollón és Artemisz anyja. (hu; https://hu.wikipedia.org/wiki/Létó, версія 26826301) [first sentence of the Hungarian article about Leto; gives Leto, Apollo, Artemis, Zeus in Hungarian]
- Az őselemek egyikeként Gaia testesítette meg a földet, ő volt a Földanya. (hu; https://hu.wikipedia.org/wiki/Gaia, версія 29231730) [identifies the 'Földanya' of the constellation article with Gaia]

### Народні назви

- Альтернативна сучасна назва — Рибальський гачок. (uk) [a modern name of the tail asterism, not a folk name of the constellation]
- A halászó tengeri népek egy olyan horgot láttak a Skorpióban, amivel egy egész szigetet ki lehet fogni. (hu) [about seafaring peoples, not a Hungarian folk name]
- A csillagkép ősi neve, a Scorpio, már csak az asztrológiában használatos. (hu)

### Хто вніс до переліку

- Scorpius /ˈskɔːrpiəs/ Sco Scor Scorpii ancient Ptolemy scorpion Antares 0.91 497 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- Scorpius is a constellation whose recognition predates Greek culture; it is one of the 48 constellations identified by the Greek astronomer Ptolemy in the second century. (en)
- Включене до каталогу зоряного неба Альмагест, укладеного Клавдієм Птолемеєм. (uk)

Розбіжності версій і як їх обійдено: Скорпіона насилають Артеміда й Лето або Аполлон (en про Скорпіона), Гея (en про Оріона), Гея або Аполлон (uk), Артеміда або Мати-Земля (hu) — історії називають версії. Англійська стаття про Скорпіона суперечить сама собі й має позначку «потрібні додаткові посилання»; угорська — позначку про брак незалежних джерел. В українській статті про Скорпіона міфу немає: речення — з української статті про Оріона.

## Змієносець (Oph)

Статті: en — https://en.wikipedia.org/wiki/Ophiuchus, версія 1385347691; uk — https://uk.wikipedia.org/wiki/Змієносець_(сузір'я), версія 49131660; hu — https://hu.wikipedia.org/wiki/Kígyótartó_csillagkép, версія 27239379.


### Фігура й назва

- Its name comes from the Ancient Greek ὀφιοῦχος (ophioûkhos), meaning "serpent-bearer", and it is commonly represented as a man grasping a snake. (en)
- The serpent is represented by the constellation Serpens. (en)
- An old alternative name for the constellation was Serpentarius. (en)
- Змієно́сець (лат. Ophiuchus) — екваторіальне сузір'я. (uk)
- Змієносець зображується як чоловік, що тримає змію, розділену його тілом на дві частини, Голову Змії та Хвіст Змії, які, проте, вважають одним сузір'ям. (uk) [ordinary words: чоловік, що тримає змію]
- A Kígyótartó (latin: Ophiuchus) egy csillagkép. (hu)
- A csillagkép egy kígyóval körbefont férfit formáz. (hu) [ordinary words: kígyóval körbefont férfi]

### Міф

- To the ancient Greeks, the constellation represented the god Apollo struggling with a huge snake that guarded the Oracle of Delphi. (en)
- Later myths identified Ophiuchus with Laocoön, the Trojan priest of Poseidon, who warned his fellow Trojans about the Trojan Horse and was later slain by a pair of sea serpents sent by the gods to punish him. (en) [another version]
- According to Roman era mythography, the figure represents the healer Asclepius, who learned the secrets of keeping death at bay after observing one serpent bringing another healing herbs. (en) [the most fully told version]
- To prevent the entire human race from becoming immortal under Asclepius' care, Jupiter killed him with a bolt of lightning, but later placed his image in the heavens to honor his good works. (en)
- Aratus describes Ophiuchus as trampling on Scorpius with his feet. (en)
- However, Ophiuchus, the Serpent Bearer, revived Orion with an antidote. (en; https://en.wikipedia.org/wiki/Orion_(constellation), версія 1387071981) [from the English Orion article]

### Та сама історія й імена українською та угорською

- давньогрецький бог лікування, син Аполлона й Короніди, доньки владаря лапітів Флегія. (uk; https://uk.wikipedia.org/wiki/Асклепій, версія 47776886) [first sentence of the Ukrainian article 'Асклепій'; it starts 'Аскле́пій (від грец. Ασκληπιός, також Ескула́п від лат. Aesculapius) —'. The Ukrainian Ophiuchus article has no myth.]
- Мистецтва лікування навчився від кентавра Хірона, міг навіть воскрешати мертвих. (uk; https://uk.wikipedia.org/wiki/Асклепій, версія 47776886)
- Зевс убив Асклепія блискавкою за те, що він повернув до життя мертвого, тим самим порушивши встановлений богами порядок. (uk; https://uk.wikipedia.org/wiki/Асклепій, версія 47776886)
- троянський жрець Аполлона; застерігав земляків, щоб не вводили до Трої дерев'яного коня, спорудженого греками. (uk; https://uk.wikipedia.org/wiki/Лаокоон, версія 43085822) [first sentence of the Ukrainian article 'Лаокоон'; it starts 'Лаокоо́н (грец. Λαοκόων) —']
- Боги вирішили знищити Трою, тому послали двох величезних зміїв, які задушили Лаокоона та його двох синів, коли вони складали жертву на березі моря. (uk; https://uk.wikipedia.org/wiki/Лаокоон, версія 43085822)
- давньогрецьке місто в південно-східній Фокіді (Греція), загальногрецький релігійний центр із храмом та оракулом Аполлона. (uk; https://uk.wikipedia.org/wiki/Дельфи, версія 49176818) [first sentence of the Ukrainian article 'Дельфи'; it starts 'Де́льфи (д.-грец. Δελφοί) —']
- Піфон (uk; https://www.wikidata.org/wiki/Q15721) [Python, the snake of Delphi — the English article does not name it]
- Змія (uk; https://www.wikidata.org/wiki/Q8910) [Serpens, the constellation]
- A görögök Aszklépiosszal azonosítják. (hu)
- Aszklépiosz (görög betűkkel Ἀσκληπιός, latinosan: Aesculapius, régiesen: Eszkuláp) a gyógyítás istene a görög-római mitológiában. (hu; https://hu.wikipedia.org/wiki/Aszklépiosz, версія 28779300) [first sentence of the Hungarian article about Asclepius]
- Így egy villámsújtással megölte Aszklépioszt és Hippolütoszt is, ám megsajnálta a jóságos és gyógyító Aszklépioszt, és felemelte az Olümposzra, az istenek közé. (hu; https://hu.wikipedia.org/wiki/Aszklépiosz, версія 28779300) [the subject is Zeus ('A főisten' in the sentence before)]
- A népszerű istenség jellemző attribútuma volt az orvosi pálca, amelyre egy kígyó tekeredett fel. (hu; https://hu.wikipedia.org/wiki/Aszklépiosz, версія 28779300)
- Laokoón (görög betűkkel Λᾱοκόων) a városvédő Apollón egyik papja, aki a trójai háború idején élt Trójában. (hu; https://hu.wikipedia.org/wiki/Laokoón, версія 28640072) [first sentence of the Hungarian article about Laocoön]
- Laokoón bikaáldozatot mutatott be Poszeidónnak, a tenger istenének. (hu; https://hu.wikipedia.org/wiki/Laokoón, версія 28640072)
- Delphoi (görögül Δελφοί) régészeti terület és modern város Görögországban. (hu; https://hu.wikipedia.org/wiki/Delphoi, версія 29441219) [first sentence of the Hungarian article 'Delphoi']
- Az archaikus időkben a települést a világ közepének tartották és az Apollón tiszteletére emelt szentély-együttes az ókor legnépszerűbb jóshelye volt. (hu; https://hu.wikipedia.org/wiki/Delphoi, версія 29441219)
- Püthón (hu; https://www.wikidata.org/wiki/Q15721) [Python, the snake of Delphi]

### Хто вніс до переліку

- Ophiuchus /ˌɒfiˈjuːkəs/ Oph Ophi Ophiuchi ancient Ptolemy serpent-bearer Rasalhague 2.07 948 (en; https://en.wikipedia.org/wiki/IAU_designated_constellations, версія 1387250710) [table row]
- Ophiuchus was one of the 48 constellations listed by the 2nd-century astronomer Ptolemy, and it remains one of the 88 modern constellations. (en)
- The earliest mention of the constellation is in Aratus, informed by the lost catalogue of Eudoxus of Cnidus (4th century BC): (en)
- Одне з 48 сузір'їв, внесених до зоряного каталогу «Альмагест» Клавдія Птолемея. (uk)

Розбіжності версій і як їх обійдено: Греки бачили Аполлона зі змієм Дельф, а Асклепія — лише «в римську добу» (en); «греки ототожнюють з Асклепієм» (hu). Лаокоон — жрець Посейдона (en) чи Аполлона (uk, hu) — в історіях сказано лише «троянський жрець». Асклепія поміщено на небо (en) чи піднесено на Олімп (hu) — кожна історія каже так, як стаття її мовою. Українська й угорська статті про сузір'я історії не розповідають: імена — зі статей про Асклепія, Лаокоона й Дельфи.
