# Фото в картках — звідки кожне й на що спирається підпис

Знімки взято з бібліотеки NASA Image and Video Library (images.nasa.gov) 24.11.2026; записи читано через її пошук (images-api.nasa.gov). Правила NASA — https://www.nasa.gov/nasa-brand-center/images-and-media/ (прочитано 24.11.2026): матеріали NASA зазвичай не захищені авторським правом у США, їх можна використовувати в освітніх та інформаційних цілях, зокрема на вебсторінках; NASA слід назвати джерелом; не можна натякати на схвалення NASA.

Як вибрано: справжній знімок або складений зі знімків вигляд (не малюнок художника), без людей, без позначки стороннього власника в записі. Автора під фото подано дослівно з поля запису; де поле порожнє (Земля, Місяць) — «NASA». Номери запису й автори — `src/data/photos.json`.

Що зроблено з файлами: обрізано до квадрата довкола тіла, зменшено до 720 × 720 точок, збережено як WebP (разом близько 330 КБ). У Венери взято ліву половину кадру (права — та сама картинка з підсиленим контрастом).

Підписи (`card.photo.*` у словниках) — власні, трьома мовами; нижче — слова запису NASA, на які спирається кожен.

| Тіло | Запис | Автор у записі | З запису NASA |
|---|---|---|---|
| Сонце | PIA26681 «Image of Sun From NASA's Solar Dynamics Observatory» | NASA/GSFC/Solar Dynamics Observatory | «On Sept. 10, 2025, NASA's Solar Dynamics Observatory captured this image of the Sun.» На самому знімку напис «SDO/AIA 171». Про це світло — з інших записів NASA: «This image was taken in extreme ultraviolet wavelengths of 171 angstroms. Though this light is invisible to our eyes, it is typically colorized in gold.» (double-photobomb_21389400576_o); «Our eyes cannot see extreme ultraviolet light, but our instruments can.» (PIA22589) |
| Меркурій | PIA11245 «Mercury as Never Seen Before» | NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington | Ключові слова запису: Mercury, MESSENGER. Опису в записі немає, тому підпис каже лише це |
| Венера | PIA23791 «Venus from Mariner 10» | NASA/JPL-Caltech | «As it sped away from Venus, NASA's Mariner 10 spacecraft captured this seemingly peaceful view…» · «This newly processed image revisits the original data with modern image processing software. A contrast-enhanced version of this view, also provided here…» · «The clouds seen here are located about 40 miles (60 kilometers) above the planet's surface…» |
| Земля | as17-148-22727 «View of the Earth seen by the Apollo 17 crew traveling toward the moon» | — (NASA) | «AS17-148-22727 (7 Dec. 1972) --- This view of Earth was seen by the Apollo 17 crew as they traveled toward the moon… extends from the Mediterranean Sea area to the Antarctica south polar ice cap… Almost the entire coastline of Africa is clearly visible. The Arabian Peninsula can be seen at the northeastern edge of Africa.» |
| Місяць | art002e009276 «Even Closer Now» | — (NASA) | «art002e009276 (April 6, 2026) - In this view of the Moon, the near side (the hemisphere we see from Earth), is visible at the top half of the Moon disk. It is identifiable by the dark splotches. These are ancient lava flows… The large crater that appears below the lava flows, dark in the center, is Orientale basin… Everything below the crater is the far side…» Ключові слова: Artemis, Artemis II, Moon, Orion, Nearside |
| Марс | PIA00407 «Global Color Views of Mars» | NASA/JPL/USGS | Ключові слова запису: Mars, Viking. Опису в записі немає, тому підпис каже лише це |
| Юпітер | PIA02873 «High Resolution Globe of Jupiter» | NASA/JPL/University of Arizona | «This true-color simulated view of Jupiter is composed of 4 images taken by NASA's Cassini spacecraft on December 7, 2000… the cylindrical map was projected onto a globe… Jupiter's moon Europa is casting the shadow on the planet.» |
| Сатурн | PIA05389 «Saturn in Color» | NASA/JPL/Space Science Institute | «Saturn and its rings completely fill the field of view of Cassini's narrow angle camera in this natural color image taken on March 27, 2004. This is the last single 'eyeful' of Saturn and its rings achievable with the narrow angle camera on approach to the planet.» |
| Уран | PIA18182 «Uranus as seen by NASA Voyager 2» | NASA/JPL-Caltech | «This is an image of the planet Uranus taken by the spacecraft Voyager 2 in 1986.» |
| Нептун | PIA01492 | NASA/JPL | «This picture of Neptune was produced from the last whole planet images taken through the green and orange filters on NASA's Voyager 2 narrow angle camera. The images were taken at a range of 4.4 million miles from the planet, 4 days and 20 hours before closest approach. The picture shows the Great Dark Spot…» |

## Знімки з місць посадок «Аполлонів»

Ті самі правила й той самий добір; додатково — без людей у кадрі (правила NASA застерігають щодо знімків з упізнаваними людьми в комерційному використанні). Файли: середину кадру обрізано до квадрата, 640 × 640 точок, WebP (разом близько 260 КБ), `src/photos/sites/`. Номери записів — `src/data/sites.json`; у записах автора не вказано, тож підписано «NASA».

| Місія | Запис | З запису NASA |
|---|---|---|
| «Аполлон-11» | as11-40-5878 | «AS11-40-5878 (20 July 1969) --- A close-up view of an astronaut's bootprint in the lunar soil, photographed with a 70mm lunar surface camera during the Apollo 11 extravehicular activity (EVA) on the moon.» |
| «Аполлон-12» | as12-48-7099 | «AS12-48-7099 (20 Nov. 1969) --- This unusual view shows two National Aeronautics and Space Administration (NASA) spacecraft on the surface of the moon. In the center foreground is the unmanned Surveyor 3 spacecraft, which soft landed on the lunar surface on April 19, 1967. Just 600 feet away from the Surveyor 3 spacecraft, pictured here in the background, is the Apollo 12 Lunar Module (LM)…» (600 футів переведено в метри нами) |
| «Аполлон-14» | as14-66-9306 | «AS14-66-9306 (5 Feb. 1971) --- A front view of the Apollo 14 Lunar Module (LM), which reflects a circular flare caused by the brilliant sun, as seen by the two moon-exploring crew men… during their first extravehicular activity (EVA)… At the extreme left the lower slope of Cone Crater can be seen.» |
| «Аполлон-15» | as15-85-11425 | «AS15-85-11425 (31 July 1971) --- A view of Hadley Rille, looking northwest, as photographed from near Station No. 2 (St. George Crater) during the first Apollo 15 lunar surface extravehicular activity (EVA). This picture shows layering in the rille wall and blocks on the floor of the rille.» |
| «Аполлон-16» | as16-113-18334 | «AS16-113-18334 (21 April 1972) --- View of the Lunar Module (LM) "Orion" parked on the lunar surface… photographed by astronaut Charles M. Duke Jr., the lunar module pilot, during the mission's first extravehicular activity (EVA).» |
| «Аполлон-17» | as17-146-22367 | «AS17-146-22367 (7-19 Dec. 1972) --- This is an excellent view of the Lunar Roving Vehicle (LRV) which was used extensively by astronauts Eugene A. Cernan and Harrison H. Schmitt at the Taurus-Littrow landing site.» |

Не взято для місць посадок: кадри, де в записі названо астронавта в кадрі (серед них гарний знімок модуля «Оріон» з місяцеходом — as16-107-17436: за місяцеходом видно командира).

Не взято: знімки «Габбла» (у записах серед авторів STScI й окремі дослідники — умови не читано), перероблені аматорами кадри Juno з ліцензіями CC BY-NC, малюнки й комп'ютерні моделі (серед них «Full Moon» Центру Ґоддарда — це модель за даними LRO, а не знімок).
