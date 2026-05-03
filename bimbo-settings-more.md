```python
SLANG_CHANCE = 0.65              # Вероятность замены обычных слов на сленг (типа "lit", "slay", "vibes")
MISSPELLING_CHANCE = 0.25        # Общая вероятность орфографических ошибок и опечаток
FILLER_CHANCE = 0.15             # Добавление слов-паразитов (типа "um", "uh", "well")
PHONETIC_CHANCE = 0.20           # Фонетическое написание слов (типа "gonna", "wanna", "kinda")
VOWEL_DRAG_CHANCE = 0.45         # Растягивание гласных (heyyy, yesss, sooo)
CAPS_CHANCE = 0.00               # Вероятность случайного полного Caps Lock
TRIPLE_SPACE_CHANCE = 0.08       # Добавление лишних пробелов между словами
EMOJI_CHANCE = 0.10              # Общая вероятность добавления эмодзи
SOFTENER_CHANCE = 0.15           # Смягчающие слова (типа "kinda", "sorta", "just")
LOWERCASE_CHANCE = 0.95          # Вероятность приведения всего текста к нижнему регистру
OMG_START_CHANCE = 0.15          # Вероятность начинать сообщение с OMG, Oh my god и т.п.
APOLOGY_CHANCE = 0.05            # Вероятность добавления извинений (sorry, oops, my bad)
FAT_FINGER_CHANCE = 0.08         # Эффект длинных ногтей — замена соседних клавиш
RUN_ON_SHIFT_CHANCE = 0.25       # Случайные заглавные буквы в начале слова (например TWo)
BRANDING_CHANCE = 0.10           # Замена "я/me" на третье лицо (this bimbo, dummy и т.д.)

MULTI_EXCLAMATION_CHANCE = 0.45  # Добавление нескольких восклицательных знаков !!! 
MULTI_QUESTION_CHANCE = 0.30     # Добавление нескольких вопросительных знаков ???
ELLIPSIS_CHANCE = 0.35           # Добавление многоточия ... (для задумчивости или возбуждения)
EXTRA_SPACES_CHANCE = 0.22       # Дополнительные пробелы между словами и предложениями

GIGGLE_CHANCE = 0.22             # Вставка смеха: hehe, hihi, teehee, *giggle*
LAUGHTER_CHANCE = 0.18           # Вставка lol, lmao, omgg и т.п.
BREATHY_ASPIRATION_CHANCE = 0.25 # Добавление придыхания: ahh~, mmm, hhhh
MOAN_INSERT_CHANCE = 0.10        # Вставка стонов и звуков удовольствия (~, ahh, mmmh)

EXTRA_LIKE_CHANCE = 0.40         # Дополнительное частое использование слова "like"
TOTALLY_CHANCE = 0.25            # Частое использование totally, literally
YKNOW_CHANCE = 0.18              # Использование ya know, you know, y'know
REALLY_CHANCE = 0.30             # Частое использование really, so, like really

HEART_EMOJI_CHANCE = 0.28        # Использование сердечек 💖💕💗
SPARKLE_EMOJI_CHANCE = 0.20      # Блестящие и милые эмодзи ✨⭐️🌸
KAWAII_FACE_CHANCE = 0.12        # Кавайные рожицы ^_^ UwU :3 >_<

WORD_REPEAT_CHANCE = 0.15        # Повторение слов для усиления (so so cute, really really)
SYLLABLE_REPEAT_CHANCE = 0.22    # Растягивание слогов (suuuper, amaaazing)
PROLONGED_LETTERS_CHANCE = 0.35  # Сильное растягивание букв (yessssss, nooooooo)

DITZY_CONFUSION_CHANCE = 0.14    # Вставки растерянности: wait..., huh?, what?
BRAIN_MELT_CHANCE = 0.08         # Фразы про "пустую голову" (brain is mush, can't think)
SELF_OBJECTIFY_CHANCE = 0.10     # Самообъективизация (this bimbo, your pretty doll)
POUT_CHANCE = 0.16               # Обиженные вставки: hmpf, >:(, but whyyy

CAPS_LOCK_RAGE_CHANCE = 0.07     # Внезапный Caps Lock на целые куски текста
RANDOM_CAPS_CHANCE = 0.18        # Случайные заглавные буквы в разных местах

BABY_TALK_CHANCE = 0.09          # Детский лепет: wuv, pwease, fwuffy
NUMBER_REPLACE_CHANCE = 0.12     # Замена слов цифрами (u, r, 2, 4, tho)
ABBREVIATION_CHANCE = 0.25       # Сокращения в стиле смс (ur, tho, idk, tbh)

THOUGHT_BUBBLE_CHANCE = 0.08     # Вставка мыслей и действий *thinks*, *giggles*
ACTION_INSERT_CHANCE = 0.20      # Описания действий *twirls hair*, *bites lip*, *squeals*

PINK_BRANDING_CHANCE = 0.13      # Вставка розовых/бимбо слов (pink, sparkly)
BARBIE_BRANDING_CHANCE = 0.10    # Упоминания Barbie, doll, princess
DOLL_BRANDING_CHANCE = 0.12      # Брендинг через "doll", "bimbo doll" и т.д.

VOCAB_DUMBING_CHANCE = 0.35      # Упрощение сложных слов на простые
SIMPLE_WORD_CHANCE = 0.28        # Замена умных слов на бимбо-варианты

ATTENTION_WHORING_CHANCE = 0.09  # Поиск внимания: notice me, am I cute?
COMPLIMENT_FISHING_CHANCE = 0.11 # Выпрашивание комплиментов

HORNINESS_CHANCE = 0.07          # Лёгкие пошлые и флиртующие вставки
TEASE_CHANCE = 0.12              # Дразнящие фразы и намёки

SUDDEN_TOPIC_SHIFT_CHANCE = 0.15 # Резкие смены темы на глупые/милые
REPEATED_SENTENCE_END_CHANCE = 0.10 # Повторение в конце: right? right??

OVERUSE_BABE_CHANCE = 0.18       # Частое использование babe, baby, honey, daddy
QUESTION_TO_STATEMENT_CHANCE = 0.13 # Превращение вопросов в утверждения с ~

SMARTPHONE_TYPING = 0.65         # Общий эффект набора на телефоне (опечатки + стиль)
BIMBO_INTENSITY = 1.0            # Глобальный множитель силы всех эффектов (удобно для пресетов)
```

```python
# --- Общая структура текста ---

SENTENCE_FRAGMENT_CHANCE = 0.22      # Разбивает нормальные предложения на обрывки
RUN_ON_SENTENCE_CHANCE = 0.18        # Склеивает несколько предложений в одно длинное
PUNCTUATION_DROP_CHANCE = 0.20       # Удаляет точки/запятые
COMMA_OVERUSE_CHANCE = 0.16          # Ставит слишком много запятых
TILDE_CHANCE = 0.30                  # Добавляет ~ в конце слов/фраз
MESSAGE_SPLIT_CHANCE = 0.25          # Делит текст на несколько коротких сообщений
LINE_BREAK_CHANCE = 0.14             # Случайные переносы строк

# --- Интонация и эмоциональность ---

DRAMATIC_REACTION_CHANCE = 0.18      # Вставки типа "no wayyy", "stoppp", "i can'ttt"
OVEREXPLAIN_FEELINGS_CHANCE = 0.14   # Добавляет эмоциональные пояснения: "i'm literally screaming"
FAKE_PANIC_CHANCE = 0.10             # "omg wait no no no"
EXCITED_RAMBLE_CHANCE = 0.20         # Быстрая болтовня без строгой логики
CUTE_OUTBURST_CHANCE = 0.16          # "eeeek", "aaaa", "omggg"
SASSY_CHANCE = 0.12                  # Чуть дерзкие вставки: "duh", "obvi", "as if"

# --- Словарь и стиль ---

VALLEY_GIRL_CHANCE = 0.28            # Стиль valley girl: "like, totally, whatever"
INFLUENCER_SPEAK_CHANCE = 0.20       # "bestie", "obsessed", "iconic", "giving"
GEN_Z_SLANG_CHANCE = 0.22            # "slay", "period", "no cap", "ate"
CUTE_NICKNAME_CHANCE = 0.15          # Обращения: bestie, babe, hun, sweetie
SHOPPING_WORDS_CHANCE = 0.10         # Вставки про shopping, outfit, nails, lip gloss
BEAUTY_WORDS_CHANCE = 0.14           # makeup, lashes, gloss, hair, nails
AESTHETIC_WORDS_CHANCE = 0.18        # cute, pink, sparkly, soft, pretty, iconic

# --- Ошибки и "телефонный" ввод ---

AUTOCORRECT_FAIL_CHANCE = 0.14       # Ошибки автозамены
MISSING_APOSTROPHE_CHANCE = 0.35     # dont, cant, im вместо don't, can't, I'm
TEXTING_SHORTCUT_CHANCE = 0.25       # rn, fr, omg, idk, tbh, btw
KEYBOARD_SMASH_CHANCE = 0.06         # "asdfghjk", "ksksks"
DUPLICATE_LETTER typo_CHANCE = 0.12  # Случайные двойные буквы
MISSING_LETTER_CHANCE = 0.10         # Пропуск букв
SWAP_LETTERS_CHANCE = 0.08           # Перестановка соседних букв
BAD_GRAMMAR_CHANCE = 0.18            # Нарочито неправильная грамматика

# --- Повторы и усилители ---

INTENSIFIER_STACK_CHANCE = 0.30      # "so like really totally"
END_TAG_CHANCE = 0.18                # "right?", "okay?", "you get me?"
ECHO_WORD_CHANCE = 0.12              # Повтор последнего важного слова
DOUBLE_MESSAGE_ENDING_CHANCE = 0.16  # "lol hehe", "omg omg"
CUTE_STUTTER_CHANCE = 0.10           # "i-i mean", "w-wait"

# --- Эмодзи и украшения ---

EMOJI_CLUSTER_CHANCE = 0.16          # Несколько эмодзи подряд
RANDOM_EMOJI_END_CHANCE = 0.22       # Эмодзи в конце предложения
EMOJI_AS_PUNCTUATION_CHANCE = 0.15   # Эмодзи вместо точки
MAKEUP_EMOJI_CHANCE = 0.12           # 💅💋👛
FLIRTY_EMOJI_CHANCE = 0.10           # 😉😘😇
CHAOS_EMOJI_CHANCE = 0.08            # 😭💀🫠
PASTEL_EMOJI_CHANCE = 0.16           # 💖🌸✨🧸

# --- Вставки действий ---

HAIR_TWIRL_CHANCE = 0.12             # *twirls hair*
NAIL_CHECK_CHANCE = 0.08             # *checks nails*
POSE_INSERT_CHANCE = 0.10            # *poses*
GASP_INSERT_CHANCE = 0.14            # *gasp*
SQUEAL_INSERT_CHANCE = 0.10          # *squeals*
BLINK_INSERT_CHANCE = 0.06           # *blinks*

# --- "Глуповатость" без полной потери смысла ---

MISUNDERSTAND_CHANCE = 0.12          # Делает вид, что не поняла часть фразы
ASKS_SIMPLE_QUESTION_CHANCE = 0.15   # Вставляет простые вопросы: "wait what does that mean?"
CONFIDENCE_WRONG_CHANCE = 0.08       # Уверенно говорит что-то странное
FORGETFUL_CHANCE = 0.10              # "i forgot what i was saying"
DISTRACTED_CHANCE = 0.14             # Отвлекается на милую/случайную тему
LOGIC_SKIP_CHANCE = 0.10             # Пропускает логическую связку между мыслями

# --- Флирт / милота, лучше отделить от NSFW ---

FLIRTY_TONE_CHANCE = 0.12            # Лёгкий флирт без explicit-контента
PET_NAME_CHANCE = 0.18               # babe, baby, cutie, honey
COY_RESPONSE_CHANCE = 0.10           # "maybeee", "wouldn't you like to know"
BLUSH_CHANCE = 0.12                  # "blushes", "omg stoppp"
PLAYFUL_TEASE_CHANCE = 0.12          # Лёгкое дразнение
INNOCENT_MODE_CHANCE = 0.08          # "i'm just a cute little thing"

# --- Тематические пресеты ---

VALLEY_PRESET_WEIGHT = 1.0           # Больше like/totally/whatever
BARBIE_PRESET_WEIGHT = 1.0           # Больше pink/doll/princess/sparkle
INFLUENCER_PRESET_WEIGHT = 1.0       # Больше bestie/slay/iconic/obsessed
DITZY_PRESET_WEIGHT = 1.0            # Больше confusion/forgetful/brain melt
PHONE_TYPING_PRESET_WEIGHT = 1.0     # Больше опечаток, сокращений, автозамены
FLIRTY_PRESET_WEIGHT = 1.0           # Больше pet names, teasing, blush

# --- Контроль читаемости ---

MAX_EFFECTS_PER_SENTENCE = 4         # Ограничение, чтобы текст не превращался в кашу
MAX_EMOJIS_PER_SENTENCE = 3
MAX_INSERTS_PER_PARAGRAPH = 5
MIN_WORD_LENGTH_FOR_MUTATION = 4     # Не ломать слишком короткие слова
PRESERVE_NUMBERS = True              # Не портить числа
PRESERVE_URLS = True                 # Не портить ссылки
PRESERVE_EMAILS = True               # Не портить email
PRESERVE_CODE_BLOCKS = True          # Не изменять код
PRESERVE_QUOTES = False              # Менять или не менять цитаты

# --- Языковая адаптация ---

LANGUAGE_MODE = "en"                 # en, ru, mixed
MIXED_LANGUAGE_CHANCE = 0.10         # Вставки английского в русский или наоборот
TRANSLIT_CHANCE = 0.08               # Типа "privetik", "spasibo bestie"
RU_CUTE_SUFFIX_CHANCE = 0.12         # Русские милые окончания: -ик, -очка, -енький
RU_FILLER_CHANCE = 0.18              # "ну", "типа", "короче", "в общем"
RU_BIMBO_SLANG_CHANCE = 0.16         # "лапочка", "зай", "принцесса", "куколка"

# --- Постобработка ---

FINAL_GIGGLE_CHANCE = 0.18           # Добавляет hehe/teehee в конце всего текста
FINAL_EMOJI_BURST_CHANCE = 0.14      # Финальная пачка эмодзи
FINAL_QUESTION_CHANCE = 0.10         # "does that make sense??"
FINAL_SELF_COMMENT_CHANCE = 0.08     # "omg i sound so silly"
FINAL_CUTE_SIGNOFF_CHANCE = 0.12     # "xoxo", "mwah", "byeee"
```