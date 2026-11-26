---
name: lazerhall-video
description: Використовуй завжди, коли треба зробити відео для LAZERHALL / Лазерхол
---

# LAZERHALL video

1. Спершу прочитай `brands/lazerhall/style.md` повністю.
2. Використовуй **лише** компоненти й файли з `brands/lazerhall/`:
   - компоненти: `import { … } from "../../brands/lazerhall/components"` (див. `components/index.ts`);
   - лого, шрифти, стікери, іконки, фото, звуки — через `ASSETS` і `fontsLoaded`/`GILROY` з тих самих компонентів.
   Нові файли клієнта клади в `brands/lazerhall/assets/` і додавай у `components/assets.ts`.
3. Формат завжди **9:16, 1080×1920, 30 FPS**, текст у безпечній зоні з `style.md`.
4. **Не змінюй стиль** (кольори, шрифти, розміри, анімації, плашки, тексти-шаблони) без прямого прохання клієнтки. Якщо ТЗ суперечить `style.md` — спитай.
5. Приклад зібраного ролика — `brands/lazerhall/demo/LazerhallStyleDemo.tsx`; нову композицію реєструй у `src/Composition.tsx` і `src/Root.tsx`.
6. Перед рендером перевір кадри: безпечні зони, без накладань, LAZERHALL через Z, адреса «Львів, вул. Мирослава Скорика, 16».
