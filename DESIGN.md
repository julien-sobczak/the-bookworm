

<VisionSpanCatalog>
    <Card>
        <VisionSpanDemo options>

<VisionSpanDemo>
<VisionSpanDrill>



<VisionSpanDrill lines="1|N" columns="3|5|7|9" element="letter|word" fontFamily="Roboto" fontSize="12pt" span="2in" />

=> Horizontal Vision Span Exercices

{/* TYRS Drill A */}
<VisionSpanDrill lines="N" columns="3" element="letter" spans={["1.25in"]} />
{/* L S K */}

{/* TYRS Drill B */}
{/* Call the letters in this order: center, immediate left, immediate right, far left, far right. */}
<VisionSpanDrill lines="N" columns="double" element="letter" spans={["1.25in","0"]} />
{/* L CSB K */}

{/* TYRS Drill C */}
<VisionSpanDrill lines="N" columns="5" element="letter" spans={["0.75in","0.75in"]} /> => 2 in at the edges
{/* T J M G E */}

{/* TYRS Drill D */}
<VisionSpanDrill lines="N" columns="7" element="letter" spans={["0.75in","0.75in","0in"]} /> => 2.25 in at the edges
{/* V U SBN E L */}

{/* TYRS Drill E */}
<VisionSpanDrill lines="N" column="9" element="letter" spans={["0.75in","0.75in","0.75in","0in"]} /> => 3.25 in => typical column width of most paperbacks
{/* H F D BAC E G I */}

=> Vertical Vision Span Exercices

{/* TYRS Drill F */}
{/* Focus on the white space between the Z and A, and read alternatively left and right from the inside out, one line at a time. Make only one fixation to read the two lines */}
<VisionSpanDrill lines="N" rowsPerLine="2" column="3" element="letter" spans={["1in"]} /> => 1 in
{/* R Z M */}
{/* G A T */}

{/* TYRS Drill G */}
<VisionSpanDrill lines="N" rowsPerLine="3" column="7" element="letter" spans={["0.5in","0.5in","0in]} /> => 1.75 in
{/* A R NQT B D */}
{/* C K AKP N R */}
{/* M D YRL X A */}

{/* TYRS Drill H */}
<VisionSpanDrill lines="N" rowsPerLine="3" column="5" element="letter" spans={["0.75in","0.75in"]} /> => 2 in
{/* R M Z P N */}
{/* S K T B N */}
{/* A J M W N */}

{/* TYRS Drill I */}
<VisionSpanDrill lines="N" rowsPerLine="5" column="7" element="letter" spans={["0.75in","0.75in","0in"]} /> => 2.25 in
{/* T E ESN N O */}
{/* D L SCB N E */}
{/* W P FHB S O */}
{/* A L FCB G E */}
{/* X B WYO P F */}

{/* TYRS Drill J */}
<VisionSpanDrill lines="N" rowsPerLine="3" column="7" element="letter" spans={["0.75in","0.75in","0.75in"]} /> => 3.25 in (seems to be 4.25 in paper...)
{/* C S P URL N B N */}
{/* M D R TYH B M S */}
{/* L S K DTB X J W */}


=> Pacing and block reading

{/* TYRS Drill I */}
{/* Variant 1: Move your eyes down one line at a time, one fixation per line */}
{/* Variant 2: Now take two lines at a time */}
{/* Variant 3: Now take three lines at a time */}
<VisionSpanDrill lines="N" column="5" element="letter" spans={["0.75in","0.75in"]} /> => 2 in
{/* D B A C E */}
{/* K T L Y C */}
{/* C V I J F */}

{/* TYRS Drill L */}
{/* Focus in the center column, move the eyes down one line at a time as you cover the entire passage. */}
{/* Varant 1: Practice at two lines per focus. */}
{/* Varant 2: Practice at three lines per focus. */}
??? => Text is justified, 1.75 em
{/*
   The Basic Idea

  The basic idea of social secur-
ity is a simple one: During
working years, employees, their
employers, and self-employed
people pay social security contri-
butions, which go into special
funds; and when earnings stop or
are reduced because the worker
retires, dies, or becomes disabled,
monthly cash benefits are paid
from the funds to replace part of
the earnings the family has lost.
  Part of the contributions made
during the working years go into
a separate hospital insurance
...
*/}

{/* TYRS Drill M */}
??? => Text is not justified, 2.25 in
{/*
  The doctor was puzzled.
He again looked at the moan-

ing patient, and once again
shook his knowledgeable old

head. "Look bad," he said.
"Temperature 103; the pulse:

10; dark rings under the red
eyes; irregular breathings..."

...
*/}
NOTES:
* Add a switch to enable to display of a "marker line" (the line the eyes should follow)
* Add an option to configure the width and the number of marker lines



{/* TYRS Drill M: Two-Stop Method (~1.25 inches with each fixation) */}
{/* Read one line at a time, fixed the center on the left, then the center on the right. Resist any temptation to stop more than twice on each line, or to scan or sweep visually. */}
????
{/*
               The                          alert
             student                      observed
                as                           he
               read                          in
              Triple                        Your
              Reading                       Speed
              that the                    columns of
          words increased                 somewhat in
              width as                      he went
            along. They                  increased, in
            fact, so much                that by Drill K
            they were the                 same width as
          the line of print               on a novel page.
          It is a true fact             that some readers can
   read straight down the middle       of an entire novel page
    and their peripheral vision      will take in the entire line
without their eyes scanning either   left of right. This is indeed
quite an achievement for anyone to make in his reading improvement.
                Of                          course,
            this would                     be ideal.
            But most of                   us find it
         necessary to have             some eye movement,
         and that's surely          all right provided it's
 the proper left, right pattern      consciously controlled
 until it becomes an automatic     habit. As you read this exercise,
...
*/}


{/* TCIGTSR Discipline Your Eyes Exercise */}
{/* Train your eyes to stop only three times per line. You may try to read for speed to impose faster rythms to your eyes. */}
{/*
The purpose              of this drill        is to discipline
the little muscles   that moves the eyes     from left to right.
...
*/}
NOTES:
- Add option to specify the number of columns
- Add option to draw a line marker

{/* The Eye Span Pyramid */}
{/*
             4 1 6
           26  2  57
           44  3  60
          38   4   16
          92   5   11
              ...
       80      9      28
*/}

{/* Peripheral Vision */}
{/*
             4 1 6
            24   62
          44   X   60
            24   62
             4 1 6
*/}
Note: see also https://en.wikipedia.org/wiki/Schulte_table

=================================

<ChunkingCatalog>

* Game 1: Select chunk size (width in inches) and a target WPM. The app shows a series of chunks successively
* Game 2: Select a book (store the latest selected book and the bookmark in the localStorage). Options: page size, font, ... highlight style (underline, background),



=================================

<PracticePage>
    <PracticeConfiguration>
        <BookLibrary>
        <PracticeDemo>
    <PracticeGame>

* Select a book (store the bookmark in the localStorage). Then read (support key left and right to change pages, and swipe if possible). Add a stop button. Print stats (WPM, WPM over pages)
Maybe add an option with a pacer.

NOTES:
* Create the One-Minute Timing: stop the reading after one minute. Easy test to measure progress

To generate english word => https://github.com/kylestetz/Sentencer




Minimize Visual Regressions => Option switch "Auto Visual Regression Blocker"
Minimize Visual Progressions => Option switch "Auto Visual Progression Blocker"
Minimize Visual Distractions => Option swtich "Enable Visual Distractions"


=========================

# Tips

Faster reading speed leads to more concentration, which leads to more comprehension, which leads to stronger retention.
Having a broad vocabulary is so important for learning to read faster.
12pt is the ideal font size to speed read (The Complete Idiots Guide to Speed Reading)
You have to consciously make time for the important things. If reading is one of your “important things,” you’ll find time for it.

# The Top Ten Reading Distracters (tired from 10 Days to Faster Reading)

* Other people
* Telephone
* E-mail
* Music
* Television
* Location is too comfortable
* Not interested in the material
* Being preoccupied
* Reading at the wrong time of the day


# Misconceptions (tired from The Complete Idiots Guide to Speed Reading)

* Just because you learn how to speed read, doesn’t mean you’ll automatically speed read everything. You probably know how to run, but you don’t run everywhere, do you? Most likely you walk much more often than you run. The same is true for speed reading.
* Don't speed read poetry, or Shakespeare



=========================

Unassisted Exercices


# The Left-Right Exercise (The Complete Idiots Guide to Speed Reading)

You can do this exercise almost anywhere, at any time. It works especially well using a wall because you can follow the straight-line seam created where the wall meets the ceiling.

1. Wherever you’re seated, and after reading these directions, pick your head up from the book and look straight ahead.
2. Continue looking straight ahead and don’t move your head.
3. Look left—but don’t move your head!—and locate a spot as far as your eyes can see without straining.
4. Then move your eyes to the right—not your head!—to locate a spot the same height as the left point and as far as your eyes can see without straining.
5. Start with the left point and then, without moving your head, move your eyes to the right point. Move back to the left and then to the right, gradually going a little faster each time. Challenge yourself to go as fast as you can and as smoothly as you can for 10 round trips back and forth. Avoid blinking, but if necessary, limit it to once or twice during the 10 round-trips.

The more you do this exercise, the smoother your eye movements become and the more stretched out your eye muscles get, creating the framework for a wider eye span.


# Eye Rub (The Complete Idiots Guide to Speed Reading)
When: your eyes might be feeling tired or strained. You may have a similar feeling if you stare too long at a computer screen.

When something on your body is sore, often a massage makes it feel better. Your eyes are no exception.

1. With your eyes closed, gently and rapidly stroke your top and bottom eyelids back and forth with your fingertips.
2. Continue for 5 to 10 seconds.

Your vision may be blurred immediately after the exercise, but that’s okay. Just blink rapidly. The blurriness will disappear and your eyes will feel
significantly refreshed.

# Palming (The Complete Idiots Guide to Speed Reading)
TODO check picture in book

This is my favorite because my mind, head, and neck get to take a break, too!

1. Rub your palms together quickly to warm them.
2. Close your eyes and cover them with your palms. (If you wear glasses, remove them first.)
3. Place your elbows on the desk or table in front of you and rest your face in your palms, which are still covering your eyes. Relax your neck and shoulders.
4. Experience total darkness for 20 to 30 seconds, or longer if time allows. Take long, slow, deep breaths. Relax your face, brow, and jaw. Don’t squeeze your eyelids shut.
5. When you’re ready, slowly let in light by spreading your fingers and then remove your hands. Now you can get back to reading!

Variant: Palming with Visualization
A variation on the Palming exercise includes an element of visualization. While on step 4, picture in great detail a relaxing and pleasant scene. Include a situation that requires your eyes to follow or track moving objects. For example, you might picture yourself on the deck of a ski chalet watching skiers slaloming down the slopes. Or envision watching a tennis match where the ball is going back and forth from one player to another. Another idea might to imagine yourself lying on the beach watching your hands as you pour a handful of sand from one hand to the other. Move on to step 5 after 30 to 60 seconds.


# Applications

Desktop:
* http://www.readfaster.com
* https://www.acereader.com
* https://www.spreeder.com (read from copied text, URL, library, epub, Docx), Options (font, size, color, dark/light mode, chunk size, alignment)
* http://www.zapreader.com

