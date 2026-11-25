# Історія й дослідження: речення NASA під текстами карток

Тексти `card.history.text.*` у словниках (`src/i18n/*.json`) написано власними словами трьома мовами. Кожне твердження в них спирається на речення зі сторінок NASA, зібрані нижче дослівно; сторінки збережено й прочитано 25.11.2026. Адреси сторінок для посилання в картці — `src/data/history.json`.

Як зібрано: сторінки NASA Science про кожне тіло («facts» і «exploration») збережено як є; речення вирізано з тексту сторінок скриптом, а другий скрипт звірив кожне як підрядок сторінки (107 із 107 збіглося). Рядки, що починаються з «Note:», — примітки збирача, не цитати.

Чого на сторінках немає і як це враховано в текстах:
- **Марс.** Сторінки NASA Science про дослідження Марса за очікуваною адресою немає (404). Про апарати взято перелік NASA NSSDCA «Chronology of Mars Exploration» (https://nssdc.gsfc.nasa.gov/planetary/chronology_mars.html, оновлено 11 вересня 2024): у ньому дати запуску й тип місії, без слова «перший». Тому в тексті сказано обережно — «у переліку місій до Марса, який веде NASA, перший проліт, що не зазнав невдачі…». Рядки переліку, на які спирається текст, — у кінці цього файла.
- **Меркурій.** Про те, що його знали римляни, сказано на сторінці Венери (речення про сім яскравих світил).
- **Місяць.** Імен перших людей на Місяці на цих сторінках немає — у тексті їх і не названо (екіпажі є у вікнах місць посадок, з інших сторінок NASA).
- **Сонце.** На сторінці є поле «First solar mission: March 25, 1951 (Explorer 10)» — не речення і з сумнівною датою; у текст не взято.
- **Венера.** Перша посадка є лише в таблиці місій, не реченням; у тексті сказано тільки те, що є реченням: десять зондів «Венера» дісталися поверхні.
- **Земля.** Сторінки про дослідження Землі немає (404); у тексті — одне речення зі сторінки фактів про супутники.

Числа в текстах — ті самі, що в реченнях NASA (роки, дати, 81 500 км, 10 супутників і два кільця Урана, 12 астронавтів, десять зондів «Венера»).

---


Every list item below is a sentence (or two adjacent sentences) copied character for character from the text of a saved NASA Science page; the source address follows in parentheses. Lines that start with "Note:" are not quotes. A bracket "[under the heading: …]" gives the heading that stands directly above the quoted sentence on the page (some sentences on mission cards have no subject without it).

The saved files are dated 2026-11-25. Two of the twenty saved files are "Page not found" (404) pages and were skipped: earth-exploration.html (https://science.nasa.gov/earth/exploration/) and mars-exploration.html (https://science.nasa.gov/mars/exploration/).

## Sun

### Discovery and name

- The Sun has been called by many names. The Latin word for Sun is “sol,” which is the main adjective for all things Sun-related: solar. (https://science.nasa.gov/sun/facts/)
- Helios, the Sun god in ancient Greek mythology, lends his name to many Sun-related terms as well, such as heliosphere and helioseismology. (https://science.nasa.gov/sun/facts/)

Note: Discovery (who / when): nothing found on this page (neither the facts page nor the exploration page).

### Visits

- NASA’s Parker Solar Probe is studying our star from closer than any previous spacecraft. On Dec. 14, 2021, NASA announced that Parker had flown through the Sun’s upper atmosphere – the corona – the first time in history that a spacecraft had touched the Sun. (https://science.nasa.gov/sun/exploration/)
- On a mission to “touch the Sun,” NASA's Parker Solar Probe became the first spacecraft to fly through the corona — the Sun’s upper atmosphere — in 2021. (https://science.nasa.gov/sun/exploration/) [under the heading: Parker Solar Probe]
- Other active spacecraft monitoring the Sun include: Solar Orbiter, SOHO, ACE, Wind, Hinode, the Solar Dynamics Observatory, and STEREO. (https://science.nasa.gov/sun/exploration/)
- Several spacecraft are currently investigating the Sun including Parker Solar Probe, STEREO, Solar Orbiter, SOHO, Solar Dynamics Observatory, Hinode, IRIS, and Wind. (https://science.nasa.gov/sun/facts/)
- The Solar and Heliospheric Observatory was designed to study the Sun inside out. Launched in 1995 and scheduled to run until only 1998, it has continued collecting data, adding to scientists' understanding of our closest star, and making many new discoveries, including more than 5,000 comets. (https://science.nasa.gov/sun/exploration/) [under the heading: SOHO]
- NASA’s Solar TErrestrial RElations Observatory launched in 2006 with two nearly identical observatories to study the Sun and obtain stereoscopic observations revealing the 3D structure of the Sun’s largest coronal mass ejections. (https://science.nasa.gov/sun/exploration/) [under the heading: STEREO]
- An international cooperative mission between the European Space Agency (ESA) and NASA, Solar Orbiter is a Sun-observing satellite with 10 science instruments, all designed to provide unprecedented insight into how our local star "works." (https://science.nasa.gov/sun/exploration/) [under the heading: Solar Orbiter]
- Dec. 2, 2020, marked the 25th anniversary of the Solar and Heliospheric Observatory, or SOHO. Since its launch, the mission has kept watch on the Sun. (https://science.nasa.gov/sun/facts/)

Note: The exploration page also has a fact box (label and value, not a sentence, so not quoted above): "First solar mission" / "March 25, 1951 (Explorer 10)"; "Active missions" / "22"; "Future Missions" / "8".

## Mercury

### Discovery and name

- Mercury is appropriately named for the swiftest of the ancient Roman gods. (https://science.nasa.gov/mercury/facts/)

Note: Discovery (who / when, or known since ancient times): nothing found on this page (neither the facts page nor the exploration page).

Note: See the Venus section: the Venus facts page has a sentence about the ancient Romans naming Mercury, Venus, Mars, Jupiter and Saturn.

### Visits

- The first spacecraft to visit Mercury was NASA's Mariner 10, which launched in 1973. (https://science.nasa.gov/mercury/exploration/)
- NASA's MESSENGER launched in 2004. The European Space Agency and JAXA launched a joint mission to Mercury in 2018. (https://science.nasa.gov/mercury/exploration/)
- The first spacecraft sent to study Mercury. (https://science.nasa.gov/mercury/exploration/) [under the heading: Mariner 10]
- The first spacecraft to orbit Mercury. (https://science.nasa.gov/mercury/exploration/) [under the heading: MESSENGER]
- An international mission comprised of two spacecraft. (https://science.nasa.gov/mercury/exploration/) [under the heading: BepiColombo]

Note: Landing on Mercury: nothing found on this page.

## Venus

### Discovery and name

- The ancient Romans could easily see seven bright objects in the sky: the Sun, the Moon, and the five brightest planets: Mercury, Venus, Mars, Jupiter, and Saturn. They named the objects after their most important gods. (https://science.nasa.gov/venus/venus-facts/)
- Venus is named for the ancient Roman goddess of love and beauty, who was known as Aphrodite to the ancient Greeks. (https://science.nasa.gov/venus/venus-facts/)
- Most features on Venus are named for women. It’s the only planet named after a female god. (https://science.nasa.gov/venus/venus-facts/)
- From Earth, Venus is the brightest object in the night sky after our own Moon. The ancients, therefore, gave it great importance in their cultures, even thinking it was two objects: a morning star and an evening star. (https://science.nasa.gov/venus/venus-facts/)
- The ancient Egyptians and Greeks saw Venus in two guises: first in one orbital position (seen in the morning), then another (your “evening” Venus), just at different times of the year. (https://science.nasa.gov/venus/venus-facts/)
- And it was this perspective, the phases of Venus first observed by Galileo through his telescope, that provided the key scientific proof for the Copernican heliocentric nature of the solar system. (https://science.nasa.gov/venus/venus-facts/)

Note: Discovery (who / when): nothing found on this page beyond the sentences above about the ancients.

### Visits

- NASA's Mariner 2 was the first spacecraft to visit any planet beyond Earth when it flew past Venus on Dec. 14, 1962. (https://science.nasa.gov/venus/exploration/)
- More than 40 missions have been launched to explore Venus. (https://science.nasa.gov/venus/exploration/)
- Mariner 10 was the first spacecraft to study Mercury; and the first to explore two planets (Mercury and Venus) in a single mission. (https://science.nasa.gov/venus/exploration/)
- Pioneer Venus 1 launched on May 20, 1978, and was the first U.S. spacecraft to orbit Venus. (https://science.nasa.gov/venus/exploration/)
- Magellan launched May 4, 1989, from the cargo bay of Space Shuttle Atlantis. It imaged the entire surface of Venus. (https://science.nasa.gov/venus/exploration/)
- Venus Express launched Nov. 9, 2005, and was the first European spacecraft to orbit Venus. (https://science.nasa.gov/venus/exploration/)
- The Soviet Union sent a series of probes to Venus between 1961 and 1984 as part of its Venera program (Venera is Russian for Venus). Ten probes made it to the surface, and a few functioned briefly after landing. (https://science.nasa.gov/venus/venus-facts/)
- NASA’s Magellan spacecraft, which ended a five-year mission to Venus in 1994, mapped the broiling surface using radar. (https://science.nasa.gov/venus/venus-facts/)

Note: The exploration page also has a table "All Missions to Venus" (launch date, spacecraft, nation, type, outcome). Its cells are not sentences, so they are not quoted here.

## Earth

### Discovery and name

- Earth is the only planet in the solar system whose English name does not come from Greek or Roman mythology. The name was taken from Old English and Germanic. (https://science.nasa.gov/earth/facts/)
- It simply means "the ground." There are, of course, many names for our planet in the thousands of languages spoken by the people of the third planet from the Sun. (https://science.nasa.gov/earth/facts/)
- The name Earth is about 1,000 years old. All of the planets, except for Earth, were named after Greek and Roman gods and goddesses. (https://science.nasa.gov/earth/facts/)
- However, the name Earth is a Germanic word, which simply means “the ground.” (https://science.nasa.gov/earth/facts/)

Note: Discovery: nothing found on this page.

### Visits

- Many orbiting spacecraft study the Earth from above as a whole system — observing the atmosphere, ocean, glaciers, and the solid earth. (https://science.nasa.gov/earth/facts/)

Note: In the page text the sentence above follows the label "Orbital Science" on the same line.

Note: The saved file earth-exploration.html (https://science.nasa.gov/earth/exploration/) is a "Page not found" (404) page — skipped, nothing quoted from it.

## Moon

### Discovery and name

- Our Moon shares a name with all moons simply because people didn't know other moons existed until Galileo Galilei discovered four moons orbiting Jupiter in 1610. In Latin, the Moon was called Luna, which is the main adjective for all things Moon-related: lunar. (https://science.nasa.gov/moon/facts/)

Note: Discovery (who / when, or known since ancient times): nothing found on this page (neither the facts page nor the exploration page).

### Visits

- In 1959, the USSR's Luna 1 was the first spacecraft to fly by the Moon. In 1966, Luna 9 achieved the first soft landing and in 1969, the U.S.'s Apollo 11 achieved the first human landing. (https://science.nasa.gov/moon/exploration/)
- While the Moon has always been an object of wonder and scientific interest to humanity, lunar exploration began in earnest in the 1950s, with the United States and the USSR developing and launching robotic spacecraft. (https://science.nasa.gov/moon/exploration/)
- During the Apollo missions of 1969–1972, 12 American astronauts walked on the Moon and used a Lunar Roving Vehicle to travel on the surface and extend their studies of soil mechanics, meteoroids, lunar ranging, magnetic fields, and solar wind. The Apollo astronauts brought back 382 kilograms (842 pounds) of rock and soil to Earth for study. (https://science.nasa.gov/moon/exploration/)
- As of January 2024, four nations have successfully landed on the Moon (USSR, United States, India, China). (https://science.nasa.gov/moon/exploration/)
- Humans didn't see the lunar far side until a Soviet spacecraft flew past in 1959. (https://science.nasa.gov/moon/facts/)
- More than 105 robotic spacecraft have been launched to explore the Moon. It is the only celestial body beyond Earth – so far – visited by human beings. (https://science.nasa.gov/moon/facts/)
- After a long hiatus, NASA's lunar exploration resumed in the 1990s with the U.S. robotic missions Clementine and Lunar Prospector. (https://science.nasa.gov/moon/exploration/)
- In November 2022, Artemis I successfully conducted the first integrated flight test of the Orion spacecraft and the Space Launch System rocket. Artemis II carried four astronauts around the far side of the Moon and safely back to Earth in April 2026. (https://science.nasa.gov/moon/exploration/)

Note: Names of the first humans on the Moon: nothing found on this page (the pages name Apollo 11 and "12 American astronauts", but not the first people).

## Mars

### Discovery and name

- Mars was named by the ancient Romans for their god of war because its reddish color was reminiscent of blood. (https://science.nasa.gov/mars/facts/)
- Other civilizations also named the planet for this attribute — for example, the Egyptians called it "Her Desher," meaning "the red one." (https://science.nasa.gov/mars/facts/)
- Even today, it is frequently called the "Red Planet" because iron minerals in the Martian dirt oxidize, or rust, causing the surface to look red. (https://science.nasa.gov/mars/facts/)
- The moons get their names from the horses that pulled the chariot of the Greek god of war, Ares (whose Roman counterpart is Mars). (https://science.nasa.gov/mars/facts/)

Note: Discovery (who / when, or known since ancient times): nothing found on this page beyond the naming by the ancient Romans.

### Visits

- Mars is one of the most explored bodies in our solar system, and it's the only planet where we've sent rovers to roam the alien landscape. (https://science.nasa.gov/mars/facts/)
- NASA's Escape and Plasma Acceleration and Dynamics Explorers (ESCAPADE) mission, which launched Nov. 13, will study Mars' real-time response to the solar wind, helping us better understand Mars' climate history — from a planet that hosted rivers, lakes, and floods billions of years ago, to the cold, dry desert we see on the surface today. The twin, refrigerator-sized orbiters are scheduled to arrive at Mars in September 2027, and begin their science mission the following spring. (https://science.nasa.gov/mars/facts/)
- NASA’s Mars Perseverance rover seeks signs of ancient life and collects samples of rock and regolith for possible Earth return. (https://science.nasa.gov/mars/facts/) [under the heading: Mars 2020: Perseverance Rover]
- This enhanced-color image of Deimos, the smaller of the two moons of Mars, was taken on Feb. 21, 2009. The image was taken by HiRISE (High Resolution Imaging Science Experiment) on NASA's Mars Reconnaissance Orbiter. (https://science.nasa.gov/mars/facts/)
- Mars is the only planet we know of inhabited entirely by robots. (https://science.nasa.gov/mars/facts/)

Note: First spacecraft to fly by, orbit or land on Mars, and the years: nothing found on this page.

Note: The saved file mars-exploration.html (https://science.nasa.gov/mars/exploration/) is a "Page not found" (404) page — skipped, nothing quoted from it.

## Jupiter

### Discovery and name

- Jupiter shines bright in the night sky, so people have known about it since ancient times. The first detailed observations of this planet were made by Galileo Galilei in 1610 with a small, homemade telescope. (https://science.nasa.gov/jupiter/exploration/)
- The king of planets was named for Jupiter, king of the gods in Roman mythology. (https://science.nasa.gov/jupiter/jupiter-facts/)
- Jupiter, being the biggest planet, gets its name from the king of the ancient Roman gods. (https://science.nasa.gov/jupiter/jupiter-facts/)
- Most of its moons are also named for mythological characters, figures associated with Jupiter or his Greek counterpart, Zeus. (https://science.nasa.gov/jupiter/jupiter-facts/)
- The four largest moons – Io, Europa, Ganymede, and Callisto – were first observed by the astronomer Galileo Galilei in 1610 using an early version of the telescope. (https://science.nasa.gov/jupiter/jupiter-facts/)

### Visits

- NASA's first spacecraft to visit the outer planets — Pioneer 10 — was launched in March 1972 on a 21-month mission to Jupiter. It made its closest approach to Jupiter on Dec. 4, 1973. (https://science.nasa.gov/jupiter/exploration/) [under the heading: Pioneer 10]
- The sibling spacecraft to Pioneer 10, Pioneer 11 flew even closer to Jupiter in 1974, passing by on its way to Saturn. (https://science.nasa.gov/jupiter/exploration/) [under the heading: Pioneer 11]
- As it flew by Jupiter in March 1979, Voyager 1 discovered a thin ring around the planet, two new moons, and active volcanoes on the volatile moon Io, before continuing on to Saturn and interstellar space. (https://science.nasa.gov/jupiter/exploration/) [under the heading: Voyager 1]
- Voyager 2 began transmitting images of Jupiter April 24, 1979, for time-lapse movies of atmospheric circulation. (https://science.nasa.gov/jupiter/exploration/) [under the heading: Voyager 2]
- The Galileo mission consisted of two spacecraft: an orbiter and an atmospheric probe. Launched on Oct. 18, 1989, from the cargo bay of Space Shuttle Atlantis, the spacecraft orbited Jupiter for almost eight years, and made close passes by all the planet's major moons. (https://science.nasa.gov/jupiter/exploration/) [under the heading: Galileo]
- Cassini spent about six months – from October 2000 to March 2001 – exploring the Jupiter system. (https://science.nasa.gov/jupiter/exploration/) [under the heading: Cassini]
- Five years after leaving Earth to make the 1.7 billion-mile journey (2.8 billion kilometers), the Juno spacecraft entered orbit around Jupiter on July 4, 2016. (https://science.nasa.gov/jupiter/exploration/)
- NASA's Europa Clipper launched on Oct. 14, 2024, and will reach Jupiter in 2030. (https://science.nasa.gov/jupiter/exploration/) [under the heading: Europa Clipper]

## Saturn

### Discovery and name

- The farthest planet from Earth discovered by the unaided human eye, Saturn has been known since ancient times. The planet is named for the Roman god of agriculture and wealth, who was also the father of Jupiter. (https://science.nasa.gov/saturn/facts/)
- ~700 BCE: The oldest written records documenting Saturn are attributed to the Assyrians. They described the ringed planet as a sparkle in the night and named it "Star of Ninib." (https://science.nasa.gov/saturn/exploration/)
- ~400 BCE: Ancient Greek astronomers name what they think is a wandering star in honor of Kronos, the god of agriculture. The Romans later change the name to Saturn, their god of agriculture. (https://science.nasa.gov/saturn/exploration/)
- July 1610: Galileo Galilei spots Saturn's rings through a telescope, but mistakes them for a "triple planet." (https://science.nasa.gov/saturn/exploration/)
- 1655: Christiaan Huygens discovers Saturn's rings and its largest moon, Titan. (https://science.nasa.gov/saturn/exploration/)
- 1675: Italian-born astronomer Jean-Dominique Cassini discovers a "division" between what are now called the A and B rings. (https://science.nasa.gov/saturn/exploration/)

### Visits

- Four robotic spacecraft have visited Saturn. NASA's Pioneer 11 provided the first close look in September 1979. (https://science.nasa.gov/saturn/exploration/)
- NASA's twin Voyager 1 and Voyager 2 spacecraft followed up with flybys nine months apart in 1980 and 1981. But it wasn't until Cassini arrived in orbit in 2004 that our understanding of Saturn really started to take shape. (https://science.nasa.gov/saturn/exploration/)
- Sept. 1, 1979: Pioneer 11 is the first spacecraft to reach Saturn. Among Pioneer 11's many discoveries are Saturn's F ring and a new moon. (https://science.nasa.gov/saturn/exploration/)
- 1980 and 1981: In its 1980 flyby of Saturn, Voyager 1 reveals the intricate structure of the ring system, consisting of thousands of ringlets. Flying even closer to Saturn in 1981, Voyager 2 provides more detailed images and documents the thinness of some of the rings. (https://science.nasa.gov/saturn/exploration/)
- July 1, 2004: NASA's Cassini spacecraft becomes the first to orbit Saturn, beginning a decade-long mission that revealed many secrets and surprises about Saturn and its system of rings and moons. (https://science.nasa.gov/saturn/exploration/)
- Jan. 14, 2005: The European Space Agency's Huygens probe is the first spacecraft to make a soft landing on the surface of another planet's moon — Saturn's giant moon Titan. (https://science.nasa.gov/saturn/exploration/)
- Sep. 15, 2017: Cassini ends a 13-year orbital mission with a spectacular, planned plunge into Saturn’s atmosphere – sending science data back to the last second. (https://science.nasa.gov/saturn/exploration/)
- The twin Voyagers launched in 1977 to visit Jupiter and Saturn, and never stopped. (https://science.nasa.gov/saturn/exploration/) [under the heading: Voyager 1]

Note: On the exploration page the sentences that follow the "Jan. 14, 2005" and "Sep. 15, 2017" quotes are cut off in the saved page itself, so they are not quoted.

## Uranus

### Discovery and name

- Uranus was the first planet found with the aid of a telescope. It was discovered in 1781 by astronomer William Herschel, although he originally thought it was either a comet or a star. (https://science.nasa.gov/uranus/facts/)
- It was two years later that the object was universally accepted as a new planet, in part because of observations by astronomer Johann Elert Bode. (https://science.nasa.gov/uranus/facts/)
- William Herschel tried unsuccessfully to name his discovery Georgium Sidus after King George III. Instead, the planet was named for Uranus, the Greek god of the sky, as suggested by Johann Bode. (https://science.nasa.gov/uranus/facts/)
- March 13, 1781: British astronomer William Herschel discovers Uranus – the first new planet discovered since ancient times – while searching for faint stars. (https://science.nasa.gov/uranus/exploration/)

### Visits

- Only one spacecraft has visited distant Uranus. After traveling more than 1.8 billion miles (3 billion kilometers) in nine years, NASA's Voyager 2 gathered much of its critical information about the mysterious planet, including its rings and moons, in just six hours. (https://science.nasa.gov/uranus/exploration/)
- Jan. 24, 1986: NASA's Voyager 2 made the first – and so far the only – visit to Uranus. The spacecraft came within 50,600 miles (81,500 kilometers) of the planet's cloud tops. (https://science.nasa.gov/uranus/exploration/)
- Voyager discovered 10 new moons, two new rings and a magnetic field stronger than that of Saturn. (https://science.nasa.gov/uranus/exploration/)
- The first human-made object to fly past Uranus, Voyager 2 discovered 10 new moons, two new rings, and a magnetic field stronger than Saturn's, while returning images and data that still fuel discoveries today. (https://science.nasa.gov/uranus/exploration/)
- March 18, 2011: NASA's New Horizons spacecraft crossed the orbit of Uranus on its way to Pluto, becoming the first spacecraft to journey beyond Uranus' orbit since Voyager 2. The spacecraft did not take images of Uranus. (https://science.nasa.gov/uranus/exploration/)
- April 19, 2022: A new mission to Uranus was one of the highest priority objectives outlined in the Planetary Science and Astrobiology Decadal Survey 2023-2032. (https://science.nasa.gov/uranus/exploration/)
- An image of the planet Uranus taken by the spacecraft Voyager 2 in 1986. (https://science.nasa.gov/uranus/facts/)
- The rest of what we know about Uranus comes from observations via the Hubble Space Telescope and several powerful ground-based telescopes. (https://science.nasa.gov/uranus/exploration/)

## Neptune

### Discovery and name

- Galileo recorded Neptune as a fixed star during observations with his small telescope in 1612 and 1613. More than 200 years later, the ice giant became the first planet located through mathematical predictions rather than through regular observations of the sky. (https://science.nasa.gov/neptune/neptune-facts/)
- Because Uranus didn't travel exactly as astronomers expected it to, French mathematician Urbain Joseph Le Verrier proposed the position and mass of a then-unknown planet that could cause the observed changes to Uranus' orbit. Le Verrier sent his predictions to Johann Gottfried Galle at the Berlin Observatory, who found Neptune on his first night of searching in 1846. (https://science.nasa.gov/neptune/neptune-facts/)
- Neptune's largest moon Triton was discovered on Oct. 10, 1846, by William Lassell, just 17 days after Johann Gottfried Galle discovered the planet. Since Neptune was named for the Roman god of the sea, its moons are named for various lesser sea gods and nymphs in Greek mythology. (https://science.nasa.gov/neptune/neptune-facts/)
- In 2011 Neptune completed its first 165-year orbit since its discovery in 1846. (https://science.nasa.gov/neptune/neptune-facts/)
- Neptune is the only planet in our solar system not visible to the naked eye (Uranus is just barely visible for those with excellent eyesight under dark-sky conditions, provided you know where to look). (https://science.nasa.gov/neptune/neptune-facts/)
- 1846: Using mathematical calculations, astronomers discover Neptune, increasing the number of known planets to eight. (https://science.nasa.gov/neptune/exploration/)
- 1612: Galileo incorrectly records Neptune as a fixed star during observations with his small telescope. (https://science.nasa.gov/neptune/exploration/)

### Visits

- In 1989, NASA's Voyager 2 became the first-and only-spacecraft to study Neptune up close. (https://science.nasa.gov/neptune/exploration/)
- 1989: Voyager 2 becomes the first and only spacecraft to visit Neptune, passing about 2,983 miles (4,800 kilometers) above the planet's north pole. (https://science.nasa.gov/neptune/exploration/)
- This picture of Neptune was produced from images taken by NASA’s Voyager 2 in the summer of 1989 as it became the first spacecraft to fly by the planet. (https://science.nasa.gov/neptune/neptune-facts/)
- Voyager returned a wealth of information about Neptune and its moons. It confirmed evidence the giant world had faint rings like the other gas planets. (https://science.nasa.gov/neptune/exploration/)
- Voyager 2 acquired this image as it encountered Neptune in August of 1989. (https://science.nasa.gov/neptune/neptune-facts/)
- 1983: Pioneer 10 crosses the orbit of Neptune and becomes the first human-made object to travel beyond the orbits of the planets of our solar system. (https://science.nasa.gov/neptune/exploration/)
- Scientists also use the Hubble and Webb space telescopes, along with powerful ground-based telescopes, to gather more information about this distant planet. (https://science.nasa.gov/neptune/exploration/)
- 2022: NASA’s James Webb Space Telescope took its first image of Neptune, and captured the clearest view of the planet’s rings in more than 30 years. (https://science.nasa.gov/neptune/exploration/)

## Mars — rows of NASA NSSDCA "Chronology of Mars Exploration" the text rests on

Source: https://nssdc.gsfc.nasa.gov/planetary/chronology_mars.html (Last Updated: 11 September 2024). The page is a list: the name of a mission, then its launch date and kind. Rows before Mariner 4 that are flybys: "Mars 1960A - 10 October 1960 - Attempted Mars Flyby (Launch Failure)", "Mars 1960B - 14 October 1960 - Attempted Mars Flyby (Launch Failure)", "Sputnik 22 - 24 October 1962 - Attempted Mars Flyby", "Mars 1 - 1 November 1962 - Mars Flyby (Contact Lost)", "Mariner 3 - 5 November 1964 - Attempted Mars Flyby".

- Mariner 4 - 28 November 1964 - Mars Flyby
- Mars 1969A - 27 March 1969 - Attempted Mars Orbiter (Launch Failure); Mars 1969B - 2 April 1969 - Attempted Mars Orbiter (Launch Failure) — the only orbiters listed before 1971, both failed
- Mars 2 - 19 May 1971 - Mars Orbiter/ Attempted Lander
- Mars 3 - 28 May 1971 - Mars Orbiter/ Lander
- Mariner 9 - 30 May 1971 - Mars Orbiter
- Mars Pathfinder - 04 December 1996 - Mars Lander and Rover — the first row of the list with a rover
