# Політ між галактиками — розвідка 26.11.2026

Питання: чи є з чого чесно зробити «драбину» від Сонячної системи до далеких галактик — малюнок Чумацького Шляху ззовні з придатною ліцензією, місце Сонця в ньому, відстані до об'єктів.

## Малюнок Чумацького Шляху
- Запис **PIA10748** у NASA Image and Video Library, https://images.nasa.gov/details/PIA10748 — «Our Milky Way Gets a Makeover Artist Concept», центр JPL, 3 червня 2008 року, автор за записом: NASA/JPL-Caltech. Файл найбільшого розміру — 5600 × 5600 px, без написів.
- Опис запису: «This artist concept illustrates the new view of the Milky Way. The galaxy two major arms can be seen attached to the ends of a thick central bar, while the two now-demoted minor arms are less distinct and located between the major arms.»
- Той самий малюнок із сіткою — на сторінці NASA Science https://science.nasa.gov/resource/the-milky-way-galaxy/ (автор там: NASA/JPL-Caltech/R. Hurt (SSC/Caltech)); два файли: з написами й без.
- Це **малюнок художника** («artist's concept») — так і підписуємо. Ззовні нашу Галактику ніхто не знімав.

### Ліцензія
- Правила NASA, https://www.nasa.gov/nasa-brand-center/images-and-media/ (прочитано знову 26.11.2026): «NASA content … generally are not subject to copyright in the United States. You may use this material for educational or informational purposes, including … computer graphical simulations and Internet Web pages»; «NASA should be acknowledged as the source of the material»; для комерційного використання — «it must not explicitly or implicitly convey NASA’s endorsement of commercial goods or services». Позначки про авторське право третьої сторони в записі немає.
- Це ті самі правила, за якими в програмі вже стоять фото планет (серед них — з автором NASA/JPL-Caltech, `src/data/photos.json`).
- **Не прочитано:** власну сторінку правил JPL, https://www.jpl.nasa.gov/jpl-image-use-policy/ — сайт JPL відповідає автоматичним запитам відмовою 403. Обходити відмову не стали. Малюнок беремо із запису бібліотеки NASA й за її правилами.

### Що читаємо із самого малюнка
Версія з написами має сітку: кола довкола Сонця й промені галактичної довготи. Виміряно програмою на файлі 1600 × 1600 px (різниця між версіями з написами й без):
- обидві версії мають той самий кадр (найкращий збіг — без зсуву й без зміни масштабу);
- Сонце — на 0,5 ширини й 0,692 висоти кадру (перетин осей 0°–180° і 90°–270°);
- кола йдуть через рівні 58,8 px; підписи «15,000 ly», «30,000 ly» … «75,000 ly» стоять біля кожного третього — отже, коло від кола на 5000 світлових років, а весь кадр — близько 136 тисяч світлових років завширшки;
- довгота 0° — від Сонця вгору, до середини Галактики; 90° — ліворуч: довгота росте проти годинникової стрілки, тобто малюнок — вигляд з боку північного полюса Галактики;
- найяскравіше місце малюнка (середина Галактики) — на 311 px вище Сонця: за сіткою малюнка це близько 26 тисяч світлових років.

Числа сітки — властивість малюнка, а не вимір природи: ними лише кладемо малюнок на місце. У текстах — слова NASA (нижче).

## Що каже NASA словами
Сторінка https://science.nasa.gov/universe/galaxies/ (прочитано 26.11.2026):
- «Our home galaxy is called the Milky Way. It’s a spiral galaxy with a disk of stars spanning more than 100,000 light-years. Earth is located along one of the galaxy’s spiral arms, about halfway from the center. Our solar system takes about 240 million years to orbit the Milky Way just once.»
- «The Milky Way sits in a neighborhood with over 50 other galaxies called the Local Group. Its members range in size from dwarf galaxies (smaller galaxies with up to a few billion stars) to Andromeda, our nearest large galactic neighbor.»
- «From our perspective on Earth, the Milky Way looks like a faint, milky band of light arcing across the entire sky, which is how it got its name. This feature marks the central disk of our home galaxy seen edge on.»

Сторінка https://science.nasa.gov/resource/the-milky-way-galaxy/: «Our Sun lies near a small, partial arm called the Orion Arm, or Orion Spur, located between the Sagittarius and Perseus arms.»

## Місця об'єктів у просторі
- Усі 33 об'єкти в `src/data/deep-sky.json` мають відстань у світлових роках зі сторінки NASA й положення на небі з Вікіданих — цього досить, щоб поставити кожен у просторі відносно Сонця.
- Площину Галактики й напрямок на її середину дає бібліотека astronomy-engine, яка вже є в програмі (перехід між екваторіальними й галактичними координатами).
- П'ять галактик переліку: M31 (Андромеда), M33 (Трикутника), M81, M51, M104 («Сомбреро»); решта 28 об'єктів — у нашій Галактиці.

## Чого немає
- Відстаней до зір у `src/data/stars.json` — найближчі зорі в 3D були б окремим кроком з новим джерелом.
- Магелланових Хмар та інших галактик поза переліком Мессьє — для них потрібні свої сторінки джерел.
- Того, як галактики повернуті в просторі: показуємо знімок «Габбла», повернутий до глядача (рішення 26.11).
