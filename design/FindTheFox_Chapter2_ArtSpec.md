# 🎨 Ассеты для Главы 2: «Город» — Толпа

---

## 🦊 База: Арт Лисы (переиспользуется)

**Путь:** используется существующий арт из главного меню  
**CSS-класс:** `.fox`  
**Размер:** 300×300px  

### Структура (уже реализована в `shared/style.css`):
```css
.fox {
  position: relative;
  width: 300px; height: 300px;
}
.fox .body {
  position: absolute; left: 50%; top: 60%;
  transform: translate(-50%, -50%);
  width: 200px; height: 220px;
  background: var(--fox-body); /* #C06628 */
  border-radius: 50% 50% 45% 45% / 55% 55% 45% 45%;
}
.fox .ear.left  { left: 22%; transform: rotate(-12deg); }
.fox .ear.right { right: 22%; transform: rotate(12deg); }
.fox .face {
  position: absolute; left: 50%; top: 55%;
  transform: translate(-50%, -50%);
  width: 130px; height: 110px;
  background: var(--fox-face); /* #E8B98A */
}
.fox .eye {
  position: absolute; top: 45%;
  width: 14px; height: 14px;
  background: var(--fox-eye); /* #1A1A1A */
}
.fox .nose {
  position: absolute; bottom: 26%; left: 50%;
  transform: translateX(-50%);
  width: 16px; height: 12px;
  background: var(--fox-eye);
}
.fox .cheek {
  position: absolute; bottom: 22%;
  width: 20px; height: 10px;
  background: rgba(255, 120, 120, 0.45);
}
```

---

## 🐾 Палитра животных

| Цветовая переменная | Значение | Назначение |
|---------------------|----------|------------|
| `--animal-body`     | меняется | тело животного |
| `--animal-face`     | меняется | лицо |
| `--animal-eye`      | меняется | глаза/нос |
| `--animal-ear-inner`| меняется | внутренность ушей |

---

## 📋 Список животных (30–40 видов)

### 1. Ежиха Зина
```css
:root {
  --animal-body:     #9C7A58;  /* коричневый */
  --animal-face:     #D4B896;
  --animal-eye:      #2C2418;
  --animal-ear-inner:#7A5E40;
}
```

### 2. Бобриха Оля
```css
:root {
  --animal-body:     #6B8C7A;  /* зелёный (мохнатая шубка) */
  --animal-face:     #9FB3A0;
  --animal-eye:      #1F2A22;
  --animal-ear-inner:#5A7260;
}
```

### 3. Кабаниха Людмила
```css
:root {
  --animal-body:     #8B6F4F;  /* коричневый с рыжиной */
  --animal-face:     #B89E82;
  --animal-eye:      #2A1F14;
  --animal-ear-inner:#6B523D;
}
```

### 4. Совунья Маргарита
```css
:root {
  --animal-body:     #2C2825;  /* тёмно-коричневый */
  --animal-face:     #4A443F;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#3A3530;
}
```

### 5. Медведица Катя
```css
:root {
  --animal-body:     #5D4E42;  /* тёмно-коричневый */
  --animal-face:     #7A6B5F;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#4A3E36;
}
```

### 6. Лиса Алиса (цель поиска)
```css
:root {
  --animal-body:     var(--fox-body);      /* #C06628 */
  --animal-face:     var(--fox-face);      /* #E8B98A */
  --animal-eye:      var(--fox-eye);       /* #1A1A1A */
  --animal-ear-inner:var(--fox-ear-inner); /* #7A3A12 */
}
```

### 7. Барсучиха Свидетель
```css
:root {
  --animal-body:     #3A3C35;  /* тёмно-серый полосатый */
  --animal-face:     #4A4C45;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#2A2C26;
}
```

### 8. Ласка-шпион
```css
:root {
  --animal-body:     #2F3D35;  /* тёмно-серый с полосками */
  --animal-face:     #4A5C50;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#2A3830;
}
```

### 9. Зайчиха Прыгунья
```css
:root {
  --animal-body:     #E8D4A0;  /* бежевый */
  --animal-face:     #F4E6C8;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#C8B890;
}
```

### 10. Рыжая кошка (ложная лиса, раунд 3)
```css
:root {
  --animal-body:     #D46A28;  /* рыжий, но чуть темнее */
  --animal-face:     #E8B47A;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#9A4A18;
}
```

### 11. Белка в рыжей шубке (ложная лиса, раунд 3)
```css
:root {
  --animal-body:     #C06020;  /* рыжий */
  --animal-face:     #E0A060;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#804010;
}
```

### 12. Волчица Серая
```css
:root {
  --animal-body:     #5A6A7A;  /* серый */
  --animal-face:     #7A8A9A;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#4A5A6A;
}
```

### 13. Олениха Лесная
```css
:root {
  --animal-body:     #8A7A6A;  /* коричневый */
  --animal-face:     #B8A898;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#6A5A4A;
}
```

### 14. Тигрица Полосатая
```css
:root {
  --animal-body:     #8B5E3C;  /* оранжево-коричневый */
  --animal-face:     #B88A6C;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#6B4A2C;
}
```

### 15. Пантера Чёрная
```css
:root {
  --animal-body:     #2A2A2A;  /* чёрный */
  --animal-face:     #3A3A3A;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#1A1A1A;
}
```

### 16. Ёжик в платке с розами (из Тиндера)
```css
:root {
  --animal-body:     #8B7A5C;  /* коричневый */
  --animal-face:     #B8A890;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#6A5A4C;
}
```

### 17. Сова в очках (из Тиндера)
```css
:root {
  --animal-body:     #3A352C;  /* тёмно-коричневый */
  --animal-face:     #4A443A;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#3A352C;
}
```

### 18. Лягушка-квакуша (из Тиндера)
```css
:root {
  --animal-body:     #4A7A3C;  /* зелёный */
  --animal-face:     #6A9A4C;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#3A6A2C;
}
```

### 19. Паук-паучиха (из Тиндера)
```css
:root {
  --animal-body:     #4A3A2C;  /* тёмно-коричневый */
  --animal-face:     #6A5A4C;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#3A2A1C;
}
```

### 20. Пчела-жужжалка (из Тиндера)
```css
:root {
  --animal-body:     #4A5A2C;  /* жёлто-коричневый */
  --animal-face:     #6A7A3C;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#3A4A2C;
}
```

### 21. Муравьиная королева (из Тиндера)
```css
:root {
  --animal-body:     #5A4A2C;  /* тёмно-коричневый */
  --animal-face:     #7A6A4C;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#4A3A2C;
}
```

### 22. Бабочка-паряшка (из Тиндера)
```css
:root {
  --animal-body:     #4A3A5C;  /* фиолетовый */
  --animal-face:     #6A5A7C;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#3A2A4C;
}
```

### 23. Грибной эльф (из Тиндера)
```css
:root {
  --animal-body:     #5A7A4C;  /* зелёный */
  --animal-face:     #7A9A6C;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#4A6A4C;
}
```

### 24. Птичка-скрипач (из Тиндера)
```css
:root {
  --animal-body:     #5A4A3C;  /* коричневый */
  --animal-face:     #7A6A5C;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#4A3A2C;
}
```

### 25. Енот-маскировка (из Тиндера)
```css
:root {
  --animal-body:     #5A5A5A;  /* серый */
  --animal-face:     #7A7A7A;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#4A4A4A;
}
```

### 26. Хомяк-счётчик (из Тиндера)
```css
:root {
  --animal-body:     #9A8A6C;  /* бежевый */
  --animal-face:     #B8A890;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#7A6A5C;
}
```

### 27. Ёжик-иглокоп (из Тиндера)
```css
:root {
  --animal-body:     #8B7A5C;  /* коричневый */
  --animal-face:     #B8A890;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#6A5A4C;
}
```

### 28. Змея-обманка (из Тиндера)
```css
:root {
  --animal-body:     #5A6A3C;  /* зелёный */
  --animal-face:     #7A8A5C;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#4A5A2C;
}
```

### 29. Лягушка-квакуша (из Тиндера)
```css
:root {
  --animal-body:     #4A7A3C;  /* зелёный */
  --animal-face:     #6A9A4C;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#3A6A2C;
}
```

### 30. Паук-паучиха (из Тиндера)
```css
:root {
  --animal-body:     #4A3A2C;  /* тёмно-коричневый */
  --animal-face:     #6A5A4C;
  --animal-eye:      #1A1A1A;
  --animal-ear-inner:#3A2A1C;
}
```

---

## 🎭 Особенности для каждого вида

### Лиса (цель)
- **Глаза:** хитрый, немного прищуренный взгляд
- **Уши:** чуть повернуты в сторону (как будто прислушивается)
- **Поведение:** появляется и исчезает, как в игре

### Рыжая кошка (ложная лиса)
- **Отличие от Лисы:** более округлые уши, более тёмные глаза
- **Визуальный маркер:** хвост пушистый, но не такой длинный

### Белка (ложная лиса)
- **Отличие от Лисы:** более круглое тело, короткие лапы
- **Визуальный маркер:** хвост пушистый, но короче

---

## 📝 Рекомендации по реализации

### 1. Переопределение CSS для каждого животного

```css
/* Пример для Ежихи Зины */
.animal-ezhicha-zina .fox {
  --animal-body:     #9C7A58;
  --animal-face:     #D4B896;
  --animal-eye:      #2C2418;
  --animal-ear-inner:#7A5E40;
}

/* Или через data-атрибут */
.fox[data-type="ezhicha-zina"] {
  --animal-body:     #9C7A58;
  --animal-face:     #D4B896;
  --animal-eye:      #2C2418;
  --animal-ear-inner:#7A5E40;
}
```

### 2. Анимация появления/исчезновения Лисы

```css
.fox.visible {
  animation: fadeIn 0.3s ease-out;
}

.fox.invisible {
  opacity: 0;
  pointer-events: none;
}
```

### 3. Анимация движения животных в толпе

```css
@keyframes wander {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(10px, -8px); }
  50%  { transform: translate(-5px, 5px); }
  75%  { transform: translate(8px, 3px); }
  100% { transform: translate(0, 0); }
}

.animal-wander {
  animation: wander 4s ease-in-out infinite;
}
```

---

## ✅ Чек-лист ассетов

- [ ] Лиса (используется из главного меню)
- [ ] Ежиха Зина
- [ ] Бобриха Оля
- [ ] Кабаниха Людмила
- [ ] Совунья Маргарита
- [ ] Медведица Катя
- [ ] Барсучиха Свидетель
- [ ] Ласка-шпион
- [ ] Зайчиха Прыгунья
- [ ] Рыжая кошка (ложная лиса)
- [ ] Белка (ложная лиса)
- [ ] Волчица Серая
- [ ] Олениха Лесная
- [ ] Тигрица Полосатая
- [ ] Пантера Чёрная
- [ ] + ещё 15–20 случайных животных из пула

---

## 📦 Формат хранения

Рекомендуется:
- **CSS:** все классы в одном файле `shared/animals.css`
- **JS:** данные в `shared/animals-data.js` (массив объектов с названиями и цветами)
- **Спрайты:** SVG или PNG с прозрачным фоном, 300×300px

Пример структуры:

```
shared/
├── animals.css          # стили всех животных
├── animals-data.js      # данные (названия, цвета)
└── sprites/             # изображения
    ├── fox.svg          # Лиса (из главного меню)
    ├── ezhicha-zina.svg
    ├── bobriha-olya.svg
    └── ...
```
