(async () => {
  const l = {
    COOLDOWN_DEFAULT: 31e3,
    TRANSPARENCY_THRESHOLD: 100,
    WHITE_THRESHOLD: 250,
    LOG_INTERVAL: 10,
    PAINTING_SPEED: {
      MIN: 1,
      // Minimum 1 pixel per second
      MAX: 1e3,
      // Maximum 1000 pixels per second
      DEFAULT: 5
      // Default 5 pixels per second
    },
    PAINTING_SPEED_ENABLED: !1,
    AUTO_CAPTCHA_ENABLED: !0,
    // Turnstile generator enabled by default
    COOLDOWN_CHARGE_THRESHOLD: 1,
    // Default wait threshold
    OVERLAY: {
      OPACITY_DEFAULT: 0.6,
      BLUE_MARBLE_DEFAULT: !1,
      ditheringEnabled: !0
    },
    // --- START: Color data from colour-converter.js ---
    // New color structure with proper ID mapping
    COLOR_MAP: {
      0: { id: 1, name: "Black", rgb: { r: 0, g: 0, b: 0 } },
      1: { id: 2, name: "Dark Gray", rgb: { r: 60, g: 60, b: 60 } },
      2: { id: 3, name: "Gray", rgb: { r: 120, g: 120, b: 120 } },
      3: { id: 4, name: "Light Gray", rgb: { r: 210, g: 210, b: 210 } },
      4: { id: 5, name: "White", rgb: { r: 255, g: 255, b: 255 } },
      5: { id: 6, name: "Deep Red", rgb: { r: 96, g: 0, b: 24 } },
      6: { id: 7, name: "Red", rgb: { r: 237, g: 28, b: 36 } },
      7: { id: 8, name: "Orange", rgb: { r: 255, g: 127, b: 39 } },
      8: { id: 9, name: "Gold", rgb: { r: 246, g: 170, b: 9 } },
      9: { id: 10, name: "Yellow", rgb: { r: 249, g: 221, b: 59 } },
      10: { id: 11, name: "Light Yellow", rgb: { r: 255, g: 250, b: 188 } },
      11: { id: 12, name: "Dark Green", rgb: { r: 14, g: 185, b: 104 } },
      12: { id: 13, name: "Green", rgb: { r: 19, g: 230, b: 123 } },
      13: { id: 14, name: "Light Green", rgb: { r: 135, g: 255, b: 94 } },
      14: { id: 15, name: "Dark Teal", rgb: { r: 12, g: 129, b: 110 } },
      15: { id: 16, name: "Teal", rgb: { r: 16, g: 174, b: 166 } },
      16: { id: 17, name: "Light Teal", rgb: { r: 19, g: 225, b: 190 } },
      17: { id: 20, name: "Cyan", rgb: { r: 96, g: 247, b: 242 } },
      18: { id: 44, name: "Light Cyan", rgb: { r: 187, g: 250, b: 242 } },
      19: { id: 18, name: "Dark Blue", rgb: { r: 40, g: 80, b: 158 } },
      20: { id: 19, name: "Blue", rgb: { r: 64, g: 147, b: 228 } },
      21: { id: 21, name: "Indigo", rgb: { r: 107, g: 80, b: 246 } },
      22: { id: 22, name: "Light Indigo", rgb: { r: 153, g: 177, b: 251 } },
      23: { id: 23, name: "Dark Purple", rgb: { r: 120, g: 12, b: 153 } },
      24: { id: 24, name: "Purple", rgb: { r: 170, g: 56, b: 185 } },
      25: { id: 25, name: "Light Purple", rgb: { r: 224, g: 159, b: 249 } },
      26: { id: 26, name: "Dark Pink", rgb: { r: 203, g: 0, b: 122 } },
      27: { id: 27, name: "Pink", rgb: { r: 236, g: 31, b: 128 } },
      28: { id: 28, name: "Light Pink", rgb: { r: 243, g: 141, b: 169 } },
      29: { id: 29, name: "Dark Brown", rgb: { r: 104, g: 70, b: 52 } },
      30: { id: 30, name: "Brown", rgb: { r: 149, g: 104, b: 42 } },
      31: { id: 31, name: "Beige", rgb: { r: 248, g: 178, b: 119 } },
      32: { id: 52, name: "Light Beige", rgb: { r: 255, g: 197, b: 165 } },
      33: { id: 32, name: "Medium Gray", rgb: { r: 170, g: 170, b: 170 } },
      34: { id: 33, name: "Dark Red", rgb: { r: 165, g: 14, b: 30 } },
      35: { id: 34, name: "Light Red", rgb: { r: 250, g: 128, b: 114 } },
      36: { id: 35, name: "Dark Orange", rgb: { r: 228, g: 92, b: 26 } },
      37: { id: 37, name: "Dark Goldenrod", rgb: { r: 156, g: 132, b: 49 } },
      38: { id: 38, name: "Goldenrod", rgb: { r: 197, g: 173, b: 49 } },
      39: { id: 39, name: "Light Goldenrod", rgb: { r: 232, g: 212, b: 95 } },
      40: { id: 40, name: "Dark Olive", rgb: { r: 74, g: 107, b: 58 } },
      41: { id: 41, name: "Olive", rgb: { r: 90, g: 148, b: 74 } },
      42: { id: 42, name: "Light Olive", rgb: { r: 132, g: 197, b: 115 } },
      43: { id: 43, name: "Dark Cyan", rgb: { r: 15, g: 121, b: 159 } },
      44: { id: 45, name: "Light Blue", rgb: { r: 125, g: 199, b: 255 } },
      45: { id: 46, name: "Dark Indigo", rgb: { r: 77, g: 49, b: 184 } },
      46: { id: 47, name: "Dark Slate Blue", rgb: { r: 74, g: 66, b: 132 } },
      47: { id: 48, name: "Slate Blue", rgb: { r: 122, g: 113, b: 196 } },
      48: { id: 49, name: "Light Slate Blue", rgb: { r: 181, g: 174, b: 241 } },
      49: { id: 53, name: "Dark Peach", rgb: { r: 155, g: 82, b: 73 } },
      50: { id: 54, name: "Peach", rgb: { r: 209, g: 128, b: 120 } },
      51: { id: 55, name: "Light Peach", rgb: { r: 250, g: 182, b: 164 } },
      52: { id: 50, name: "Light Brown", rgb: { r: 219, g: 164, b: 99 } },
      53: { id: 56, name: "Dark Tan", rgb: { r: 123, g: 99, b: 82 } },
      54: { id: 57, name: "Tan", rgb: { r: 156, g: 132, b: 107 } },
      55: { id: 36, name: "Light Tan", rgb: { r: 214, g: 181, b: 148 } },
      56: { id: 51, name: "Dark Beige", rgb: { r: 209, g: 128, b: 81 } },
      57: { id: 61, name: "Dark Stone", rgb: { r: 109, g: 100, b: 63 } },
      58: { id: 62, name: "Stone", rgb: { r: 148, g: 140, b: 107 } },
      59: { id: 63, name: "Light Stone", rgb: { r: 205, g: 197, b: 158 } },
      60: { id: 58, name: "Dark Slate", rgb: { r: 51, g: 57, b: 65 } },
      61: { id: 59, name: "Slate", rgb: { r: 109, g: 117, b: 141 } },
      62: { id: 60, name: "Light Slate", rgb: { r: 179, g: 185, b: 209 } },
      63: { id: 0, name: "Transparent", rgb: null }
    },
    // --- END: Color data ---
    // Optimized CSS Classes for reuse
    CSS_CLASSES: {
      BUTTON_PRIMARY: `
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white; border: none; border-radius: 8px; padding: 10px 16px;
        cursor: pointer; font-weight: 500; transition: all 0.3s ease;
        display: flex; align-items: center; gap: 8px;
      `,
      BUTTON_SECONDARY: `
        background: rgba(255,255,255,0.1); color: white;
        border: 1px solid rgba(255,255,255,0.2); border-radius: 8px;
        padding: 8px 12px; cursor: pointer; transition: all 0.3s ease;
      `,
      MODERN_CARD: `
        background: rgba(255,255,255,0.1); border-radius: 12px;
        padding: 18px; border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(5px);
      `,
      GRADIENT_TEXT: `
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text; font-weight: bold;
      `
    },
    THEMES: {
      "Classic Autobot": {
        primary: "#000000",
        secondary: "#111111",
        accent: "#222222",
        text: "#ffffff",
        highlight: "#775ce3",
        success: "#00ff00",
        error: "#ff0000",
        warning: "#ffaa00",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        borderRadius: "12px",
        borderStyle: "solid",
        borderWidth: "1px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        animations: {
          glow: !1,
          scanline: !1,
          pixelBlink: !1
        }
      },
      "Neon Retro": {
        primary: "#1a1a2e",
        secondary: "#16213e",
        accent: "#0f3460",
        text: "#00ff41",
        highlight: "#ff6b35",
        success: "#39ff14",
        error: "#ff073a",
        warning: "#ffff00",
        neon: "#00ffff",
        purple: "#bf00ff",
        pink: "#ff1493",
        fontFamily: "'Press Start 2P', monospace",
        borderRadius: "0",
        borderStyle: "solid",
        borderWidth: "3px",
        boxShadow: "0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1)",
        backdropFilter: "none",
        animations: {
          glow: !0,
          scanline: !0,
          pixelBlink: !0
        }
      }
    },
    currentTheme: "Classic Autobot"
  }, ht = {
    en: {
      title: "WPlace Auto-Image",
      toggleOverlay: "Toggle Overlay",
      scanColors: "Scan Colors",
      uploadImage: "Upload Image",
      resizeImage: "Resize Image",
      selectPosition: "Select Position",
      startPainting: "Start Painting",
      stopPainting: "Stop Painting",
      checkingColors: "🔍 Checking available colors...",
      noColorsFound: "❌ Open the color palette on the site and try again!",
      colorsFound: "✅ {count} available colors found. Ready to upload.",
      loadingImage: "🖼️ Loading image...",
      imageLoaded: "✅ Image loaded with {count} valid pixels",
      imageError: "❌ Error loading image",
      selectPositionAlert: "Paint the first pixel at the location where you want the art to start!",
      waitingPosition: "👆 Waiting for you to paint the reference pixel...",
      positionSet: "✅ Position set successfully!",
      positionTimeout: "❌ Timeout for position selection",
      startPaintingMsg: "🎨 Starting painting...",
      paintingProgress: "🧱 Progress: {painted}/{total} pixels...",
      noCharges: "⌛ No charges. Waiting {time}...",
      paintingStopped: "⏹️ Painting stopped by user",
      paintingComplete: "✅ Painting complete! {count} pixels painted.",
      paintingError: "❌ Error during painting",
      missingRequirements: "❌ Load an image and select a position first",
      progress: "Progress",
      pixels: "Pixels",
      charges: "Charges",
      estimatedTime: "Estimated time",
      initMessage: "Click 'Upload Image' to begin",
      waitingInit: "Waiting for initialization...",
      initializingToken: "🔧 Initializing Turnstile token generator...",
      tokenReady: "✅ Token generator ready - you can now start painting!",
      tokenRetryLater: "⚠️ Token generator will retry when needed",
      resizeSuccess: "✅ Image resized to {width}x{height}",
      paintingPaused: "⏸️ Painting paused at position X: {x}, Y: {y}",
      captchaNeeded: "❗ Token generation failed. Please try again in a moment.",
      saveData: "Save Progress",
      loadData: "Load Progress",
      saveToFile: "Save to File",
      loadFromFile: "Load from File",
      dataManager: "Data Manager",
      autoSaved: "✅ Progress saved automatically",
      dataLoaded: "✅ Progress loaded successfully",
      fileSaved: "✅ Progress saved to file successfully",
      fileLoaded: "✅ Progress loaded from file successfully",
      noSavedData: "❌ No saved progress found",
      savedDataFound: "✅ Saved progress found! Load to continue?",
      savedDate: "Saved on: {date}",
      clickLoadToContinue: "Click 'Load Progress' to continue.",
      fileError: "❌ Error processing file",
      invalidFileFormat: "❌ Invalid file format",
      paintingSpeed: "Painting Speed",
      pixelsPerSecond: "pixels/second",
      speedSetting: "Speed: {speed} pixels/sec",
      settings: "Settings",
      botSettings: "Bot Settings",
      close: "Close",
      language: "Language",
      themeSettings: "Theme Settings",
      themeSettingsDesc: "Choose your preferred color theme for the interface.",
      languageSelectDesc: "Select your preferred language. Changes will take effect immediately.",
      autoCaptcha: "Auto-CAPTCHA Solver (Turnstile)",
      autoCaptchaDesc: "Automatically generates Turnstile tokens using integrated generator. Falls back to browser automation if needed.",
      applySettings: "Apply Settings",
      settingsSaved: "✅ Settings saved successfully!",
      cooldownSettings: "Cooldown Settings",
      waitCharges: "Wait until charges reach",
      captchaSolving: "🔑 Generating Turnstile token...",
      captchaFailed: "❌ Turnstile token generation failed. Trying fallback method...",
      automation: "Automation",
      noChargesThreshold: "⌛ Waiting for charges to reach {threshold}. Currently {current}. Next in {time}..."
    },
    ru: {
      title: "WPlace Авто-Изображение",
      scanColors: "Сканировать цвета",
      uploadImage: "Загрузить изображение",
      resizeImage: "Изменить размер изображения",
      selectPosition: "Выбрать позицию",
      startPainting: "Начать рисование",
      stopPainting: "Остановить рисование",
      checkingColors: "🔍 Проверка доступных цветов...",
      noColorsFound: "❌ Откройте палитру цветов на сайте и попробуйте снова!",
      colorsFound: "✅ Найдено доступных цветов: {count}. Готово к загрузке.",
      loadingImage: "🖼️ Загрузка изображения...",
      imageLoaded: "✅ Изображение загружено, валидных пикселей: {count}",
      imageError: "❌ Ошибка при загрузке изображения",
      selectPositionAlert: "Нарисуйте первый пиксель в месте, откуда начнётся рисунок!",
      waitingPosition: "👆 Ожидание, пока вы нарисуете опорный пиксель...",
      positionSet: "✅ Позиция успешно установлена!",
      positionTimeout: "❌ Время ожидания выбора позиции истекло",
      startPaintingMsg: "🎨 Начинаем рисование...",
      paintingProgress: "🧱 Прогресс: {painted}/{total} пикселей...",
      noCharges: "⌛ Нет зарядов. Ожидание {time}...",
      paintingStopped: "⏹️ Рисование остановлено пользователем",
      paintingComplete: "✅ Рисование завершено! Нарисовано пикселей: {count}.",
      paintingError: "❌ Ошибка во время рисования",
      missingRequirements: "❌ Сначала загрузите изображение и выберите позицию",
      progress: "Прогресс",
      pixels: "Пиксели",
      charges: "Заряды",
      estimatedTime: "Примерное время",
      initMessage: "Нажмите 'Загрузить изображение', чтобы начать",
      waitingInit: "Ожидание инициализации...",
      initializingToken: "🔧 Инициализация генератора Turnstile токенов...",
      tokenReady: "✅ Генератор токенов готов - можете начинать рисование!",
      tokenRetryLater: "⚠️ Генератор токенов повторит попытку при необходимости",
      resizeSuccess: "✅ Изображение изменено до {width}x{height}",
      paintingPaused: "⏸️ Рисование приостановлено на позиции X: {x}, Y: {y}",
      captchaNeeded: "❗ Генерация токена не удалась. Пожалуйста, попробуйте через некоторое время.",
      saveData: "Сохранить прогресс",
      loadData: "Загрузить прогресс",
      saveToFile: "Сохранить в файл",
      loadFromFile: "Загрузить из файла",
      dataManager: "Менеджер данных",
      autoSaved: "✅ Прогресс сохранён автоматически",
      dataLoaded: "✅ Прогресс успешно загружен",
      fileSaved: "✅ Прогресс успешно сохранён в файл",
      fileLoaded: "✅ Прогресс успешно загружен из файла",
      noSavedData: "❌ Сохранённый прогресс не найден",
      savedDataFound: "✅ Найден сохранённый прогресс! Загрузить, чтобы продолжить?",
      savedDate: "Сохранено: {date}",
      clickLoadToContinue: "Нажмите 'Загрузить прогресс', чтобы продолжить.",
      fileError: "❌ Ошибка при обработке файла",
      invalidFileFormat: "❌ Неверный формат файла",
      paintingSpeed: "Скорость рисования",
      pixelsPerSecond: "пикселей/сек",
      speedSetting: "Скорость: {speed} пикс./сек",
      settings: "Настройки",
      botSettings: "Настройки бота",
      close: "Закрыть",
      language: "Язык",
      themeSettings: "Настройки темы",
      themeSettingsDesc: "Выберите предпочтительную цветовую тему интерфейса.",
      languageSelectDesc: "Выберите предпочтительный язык. Изменения вступят в силу немедленно.",
      autoCaptcha: "Авто-решение CAPTCHA (Turnstile)",
      autoCaptchaDesc: "Автоматически генерирует Turnstile токены используя встроенный генератор. Возвращается к автоматизации браузера при необходимости.",
      applySettings: "Применить настройки",
      settingsSaved: "✅ Настройки успешно сохранены!",
      cooldownSettings: "Настройки перезарядки",
      waitCharges: "Ждать до накопления зарядов",
      captchaSolving: "🔑 Генерирую Turnstile токен...",
      captchaFailed: "❌ Не удалось сгенерировать Turnstile токен. Пробую резервный метод...",
      automation: "Автоматизация",
      noChargesThreshold: "⌛ Ожидание зарядов до {threshold}. Сейчас {current}. Следующий через {time}..."
    },
    pt: {
      title: "WPlace Auto-Image",
      scanColors: "Escanear Cores",
      uploadImage: "Upload da Imagem",
      resizeImage: "Redimensionar Imagem",
      selectPosition: "Selecionar Posição",
      startPainting: "Iniciar Pintura",
      stopPainting: "Parar Pintura",
      checkingColors: "🔍 Verificando cores disponíveis...",
      noColorsFound: "❌ Abra a paleta de cores no site e tente novamente!",
      colorsFound: "✅ {count} cores encontradas. Pronto para upload.",
      loadingImage: "🖼️ Carregando imagem...",
      imageLoaded: "✅ Imagem carregada com {count} pixels válidos",
      imageError: "❌ Erro ao carregar imagem",
      selectPositionAlert: "Pinte o primeiro pixel на localização onde deseja que a arte comece!",
      waitingPosition: "👆 Aguardando você pintar o pixel de referência...",
      positionSet: "✅ Posição definida com sucesso!",
      positionTimeout: "❌ Tempo esgotado para selecionar posição",
      startPaintingMsg: "🎨 Iniciando pintura...",
      paintingProgress: "🧱 Progresso: {painted}/{total} pixels...",
      noCharges: "⌛ Sem cargas. Aguardando {time}...",
      paintingStopped: "⏹️ Pintura interromпида pelo usuário",
      paintingComplete: "✅ Pintura concluída! {count} pixels pintados.",
      paintingError: "❌ Erro durante a pintura",
      missingRequirements: "❌ Carregue uma imagem e selecione uma posição primeiro",
      progress: "Progresso",
      pixels: "Pixels",
      charges: "Cargas",
      estimatedTime: "Tempo estimado",
      initMessage: "Clique em 'Upload da Imagem' para começar",
      waitingInit: "Aguardando inicialização...",
      initializingToken: "🔧 Inicializando gerador de tokens Turnstile...",
      tokenReady: "✅ Gerador de tokens pronto - você pode começar a pintar!",
      tokenRetryLater: "⚠️ Gerador de tokens tentará novamente quando necessário",
      resizeSuccess: "✅ Imagem redimensionada для {width}x{height}",
      paintingPaused: "⏸️ Pintura pausada na posição X: {x}, Y: {y}",
      captchaNeeded: "❗ Falha na geração de token. Tente novamente em alguns instantes.",
      saveData: "Salvar Progresso",
      loadData: "Carregar Progresso",
      saveToFile: "Salvar em Arquivo",
      loadFromFile: "Carregar de Arquivo",
      dataManager: "Dados",
      autoSaved: "✅ Progresso salvo automaticamente",
      dataLoaded: "✅ Progresso carregado com sucesso",
      fileSaved: "✅ Salvo em arquivo com sucesso",
      fileLoaded: "✅ Carregado de arquivo com sucesso",
      noSavedData: "❌ Nenhum progresso salvo encontrado",
      savedDataFound: "✅ Progresso salvo encontrado! Carregar para continuar?",
      savedDate: "Salvo em: {date}",
      clickLoadToContinue: "Clique em 'Carregar Progresso' para continuar.",
      fileError: "❌ Erro ao processar arquivo",
      invalidFileFormat: "❌ Formato de arquivo inválido",
      paintingSpeed: "Velocidade de Pintura",
      pixelsPerSecond: "pixels/segundo",
      speedSetting: "Velocidade: {speed} pixels/seg",
      settings: "Configurações",
      botSettings: "Configurações do Bot",
      close: "Fechar",
      language: "Idioma",
      themeSettings: "Configurações de Tema",
      themeSettingsDesc: "Escolha seu tema de cores preferido para a interface.",
      languageSelectDesc: "Selecione seu idioma preferido. As alterações terão efeito imediatamente.",
      autoCaptcha: "Resolvedor de CAPTCHA Automático",
      autoCaptchaDesc: "Tenta resolver o CAPTCHA automaticamente simulando a colocação manual de um pixel quando o token expira.",
      applySettings: "Aplicar Configurações",
      settingsSaved: "✅ Configurações salvas com sucesso!",
      cooldownSettings: "Configurações de Cooldown",
      waitCharges: "Aguardar até as cargas atingirem",
      captchaSolving: "🤖 Tentando resolver o CAPTCHA...",
      captchaFailed: "❌ Falha ao resolver CAPTCHA. Pinte um pixel manualmente.",
      automation: "Automação",
      noChargesThreshold: "⌛ Aguardando cargas atingirem {threshold}. Atual: {current}. Próxima em {time}..."
    },
    vi: {
      title: "WPlace Auto-Image",
      scanColors: "Quét màu",
      uploadImage: "Tải lên hình ảnh",
      resizeImage: "Thay đổi kích thước",
      selectPosition: "Chọn vị trí",
      startPainting: "Bắt đầu vẽ",
      stopPainting: "Dừng vẽ",
      checkingColors: "🔍 Đang kiểm tra màu sắc có sẵn...",
      noColorsFound: "❌ Hãy mở bảng màu trên trang web và thử lại!",
      colorsFound: "✅ Tìm thấy {count} màu. Sẵn sàng để tải lên.",
      loadingImage: "🖼️ Đang tải hình ảnh...",
      imageLoaded: "✅ Đã tải hình ảnh với {count} pixel hợp lệ",
      imageError: "❌ Lỗi khi tải hình ảnh",
      selectPositionAlert: "Vẽ pixel đầu tiên tại vị trí bạn muốn tác phẩm nghệ thuật bắt đầu!",
      waitingPosition: "👆 Đang chờ bạn vẽ pixel tham chiếu...",
      positionSet: "✅ Đã đặt vị trí thành công!",
      positionTimeout: "❌ Hết thời gian chọn vị trí",
      startPaintingMsg: "🎨 Bắt đầu vẽ...",
      paintingProgress: "🧱 Tiến trình: {painted}/{total} pixel...",
      noCharges: "⌛ Không có điện tích. Đang chờ {time}...",
      paintingStopped: "⏹️ Người dùng đã dừng vẽ",
      paintingComplete: "✅ Hoàn thành vẽ! Đã vẽ {count} pixel.",
      paintingError: "❌ Lỗi trong quá trình vẽ",
      missingRequirements: "❌ Hãy tải lên hình ảnh và chọn vị trí trước",
      progress: "Tiến trình",
      pixels: "Pixel",
      charges: "Điện tích",
      estimatedTime: "Thời gian ước tính",
      initMessage: "Nhấp 'Tải lên hình ảnh' để bắt đầu",
      waitingInit: "Đang chờ khởi tạo...",
      initializingToken: "🔧 Đang khởi tạo bộ tạo token Turnstile...",
      tokenReady: "✅ Bộ tạo token đã sẵn sàng - bạn có thể bắt đầu vẽ!",
      tokenRetryLater: "⚠️ Bộ tạo token sẽ thử lại khi cần thiết",
      resizeSuccess: "✅ Đã thay đổi kích thước hình ảnh thành {width}x{height}",
      paintingPaused: "⏸️ Tạm dừng vẽ tại vị trí X: {x}, Y: {y}",
      captchaNeeded: "❗ Tạo token thất bại. Vui lòng thử lại sau.",
      saveData: "Lưu tiến trình",
      loadData: "Tải tiến trình",
      saveToFile: "Lưu vào tệp",
      loadFromFile: "Tải từ tệp",
      dataManager: "Dữ liệu",
      autoSaved: "✅ Đã tự động lưu tiến trình",
      dataLoaded: "✅ Đã tải tiến trình thành công",
      fileSaved: "✅ Đã lưu vào tệp thành công",
      fileLoaded: "✅ Đã tải từ tệp thành công",
      noSavedData: "❌ Không tìm thấy tiến trình đã lưu",
      savedDataFound: "✅ Tìm thấy tiến trình đã lưu! Tải để tiếp tục?",
      savedDate: "Đã lưu vào: {date}",
      clickLoadToContinue: "Nhấp 'Tải tiến trình' để tiếp tục.",
      fileError: "❌ Lỗi khi xử lý tệp",
      invalidFileFormat: "❌ Định dạng tệp không hợp lệ",
      paintingSpeed: "Tốc độ vẽ",
      pixelsPerSecond: "pixel/giây",
      speedSetting: "Tốc độ: {speed} pixel/giây",
      settings: "Cài đặt",
      botSettings: "Cài đặt Bot",
      close: "Đóng",
      language: "Ngôn ngữ",
      themeSettings: "Cài đặt Giao diện",
      themeSettingsDesc: "Chọn chủ đề màu sắc yêu thích cho giao diện.",
      languageSelectDesc: "Chọn ngôn ngữ ưa thích. Thay đổi sẽ có hiệu lực ngay lập tức.",
      autoCaptcha: "Tự động giải CAPTCHA",
      autoCaptchaDesc: "Tự động cố gắng giải CAPTCHA bằng cách mô phỏng việc đặt pixel thủ công khi token hết hạn.",
      applySettings: "Áp dụng cài đặt",
      settingsSaved: "✅ Đã lưu cài đặt thành công!",
      cooldownSettings: "Cài đặt thời gian chờ",
      waitCharges: "Chờ cho đến khi số lần sạc đạt",
      captchaSolving: "🤖 Đang cố gắng giải CAPTCHA...",
      captchaFailed: "❌ Giải CAPTCHA tự động thất bại. Vui lòng vẽ một pixel thủ công.",
      automation: "Tự động hóa",
      noChargesThreshold: "⌛ Đang chờ số lần sạc đạt {threshold}. Hiện tại {current}. Lần tiếp theo trong {time}..."
    },
    fr: {
      title: "WPlace Auto-Image",
      scanColors: "Scanner les couleurs",
      uploadImage: "Télécharger l'image",
      resizeImage: "Redimensionner l'image",
      selectPosition: "Sélectionner la position",
      startPainting: "Commencer à peindre",
      stopPainting: "Arrêter de peindre",
      checkingColors: "🔍 Vérification des couleurs disponibles...",
      noColorsFound: "❌ Ouvrez la palette de couleurs sur le site et réessayez!",
      colorsFound: "✅ {count} couleurs trouvées. Prêt à télécharger.",
      loadingImage: "🖼️ Chargement de l'image...",
      imageLoaded: "✅ Image chargée avec {count} pixels valides",
      imageError: "❌ Erreur lors du chargement de l'image",
      selectPositionAlert: "Peignez le premier pixel à l'endroit où vous voulez que l'art commence!",
      waitingPosition: "👆 En attente que vous peigniez le pixel de référence...",
      positionSet: "✅ Position définie avec succès!",
      positionTimeout: "❌ Délai d'attente pour la sélection de position",
      startPaintingMsg: "🎨 Début de la peinture...",
      paintingProgress: "🧱 Progrès: {painted}/{total} pixels...",
      noCharges: "⌛ Aucune charge. En attente {time}...",
      paintingStopped: "⏹️ Peinture arrêtée par l'utilisateur",
      paintingComplete: "✅ Peinture terminée! {count} pixels peints.",
      paintingError: "❌ Erreur pendant la peinture",
      missingRequirements: "❌ Veuillez charger une image et sélectionner une position d'abord",
      progress: "Progrès",
      pixels: "Pixels",
      charges: "Charges",
      estimatedTime: "Temps estimé",
      initMessage: "Cliquez sur 'Télécharger l'image' pour commencer",
      waitingInit: "En attente d'initialisation...",
      initializingToken: "🔧 Initialisation du générateur de tokens Turnstile...",
      tokenReady: "✅ Générateur de tokens prêt - vous pouvez commencer à peindre!",
      tokenRetryLater: "⚠️ Le générateur de tokens réessaiera si nécessaire",
      resizeSuccess: "✅ Image redimensionnée en {width}x{height}",
      paintingPaused: "⏸️ Peinture en pause à la position X: {x}, Y: {y}",
      captchaNeeded: "❗ Échec de la génération de token. Veuillez réessayer dans un moment.",
      saveData: "Sauvegarder le progrès",
      loadData: "Charger le progrès",
      saveToFile: "Sauvegarder dans un fichier",
      loadFromFile: "Charger depuis un fichier",
      dataManager: "Données",
      autoSaved: "✅ Progrès sauvegardé automatiquement",
      dataLoaded: "✅ Progrès chargé avec succès",
      fileSaved: "✅ Sauvegardé dans un fichier avec succès",
      fileLoaded: "✅ Chargé depuis un fichier avec succès",
      noSavedData: "❌ Aucun progrès sauvegardé trouvé",
      savedDataFound: "✅ Progrès sauvegardé trouvé! Charger pour continuer?",
      savedDate: "Sauvegardé le: {date}",
      clickLoadToContinue: "Cliquez sur 'Charger le progrès' pour continuer.",
      fileError: "❌ Erreur lors du traitement du fichier",
      invalidFileFormat: "❌ Format de fichier invalide",
      paintingSpeed: "Vitesse de peinture",
      pixelsPerSecond: "pixels/seconde",
      speedSetting: "Vitesse: {speed} pixels/sec",
      settings: "Paramètres",
      botSettings: "Paramètres du Bot",
      close: "Fermer",
      language: "Langue",
      themeSettings: "Paramètres de Thème",
      themeSettingsDesc: "Choisissez votre thème de couleurs préféré pour l'interface.",
      languageSelectDesc: "Sélectionnez votre langue préférée. Les changements prendront effet immédiatement.",
      autoCaptcha: "Résolveur de CAPTCHA automatique",
      autoCaptchaDesc: "Tente automatiquement de résoudre le CAPTCHA en simulant un placement manuel de pixel lorsque le jeton expire.",
      applySettings: "Appliquer les paramètres",
      settingsSaved: "✅ Paramètres enregistrés avec succès !",
      cooldownSettings: "Paramètres de recharge",
      waitCharges: "Attendre que les charges atteignent",
      captchaSolving: "🤖 Tentative de résolution du CAPTCHA...",
      captchaFailed: "❌ Échec de l'Auto-CAPTCHA. Peignez un pixel manuellement.",
      automation: "Automatisation",
      noChargesThreshold: "⌛ En attente que les charges atteignent {threshold}. Actuel: {current}. Prochaine dans {time}..."
    },
    id: {
      title: "WPlace Auto-Image",
      scanColors: "Pindai Warna",
      uploadImage: "Unggah Gambar",
      resizeImage: "Ubah Ukuran Gambar",
      selectPosition: "Pilih Posisi",
      startPainting: "Mulai Melukis",
      stopPainting: "Berhenti Melukis",
      checkingColors: "🔍 Memeriksa warna yang tersedia...",
      noColorsFound: "❌ Buka palet warna di situs dan coba lagi!",
      colorsFound: "✅ {count} warna ditemukan. Siap untuk diunggah.",
      loadingImage: "🖼️ Memuat gambar...",
      imageLoaded: "✅ Gambar dimuat dengan {count} piksel valid",
      imageError: "❌ Kesalahan saat memuat gambar",
      selectPositionAlert: "Lukis piksel pertama di lokasi tempat karya seni akan dimulai!",
      waitingPosition: "👆 Menunggu Anda melukis piksel referensi...",
      positionSet: "✅ Posisi berhasil diatur!",
      positionTimeout: "❌ Waktu habis untuk memilih posisi",
      startPaintingMsg: "🎨 Mulai melukis...",
      paintingProgress: "🧱 Progres: {painted}/{total} piksel...",
      noCharges: "⌛ Tidak ada muatan. Menunggu {time}...",
      paintingStopped: "⏹️ Melukis dihentikan oleh pengguna",
      paintingComplete: "✅ Melukis selesai! {count} piksel telah dilukis.",
      paintingError: "❌ Kesalahan selama melukis",
      missingRequirements: "❌ Unggah gambar dan pilih posisi terlebih dahulu",
      progress: "Progres",
      pixels: "Piksel",
      charges: "Muatan",
      estimatedTime: "Perkiraan waktu",
      initMessage: "Klik 'Unggah Gambar' untuk memulai",
      waitingInit: "Menunggu inisialisasi...",
      initializingToken: "🔧 Menginisialisasi generator token Turnstile...",
      tokenReady: "✅ Generator token siap - Anda bisa mulai melukis!",
      tokenRetryLater: "⚠️ Generator token akan mencoba lagi saat diperlukan",
      resizeSuccess: "✅ Gambar berhasil diubah ukurannya menjadi {width}x{height}",
      paintingPaused: "⏸️ Melukis dijeda di posisi X: {x}, Y: {y}",
      captchaNeeded: "❗ Pembuatan token gagal. Silakan coba lagi sebentar lagi.",
      saveData: "Simpan Progres",
      loadData: "Muat Progres",
      saveToFile: "Simpan ke File",
      loadFromFile: "Muat dari File",
      dataManager: "Data",
      autoSaved: "✅ Progres disimpan secara otomatis",
      dataLoaded: "✅ Progres berhasil dimuat",
      fileSaved: "✅ Berhasil disimpan ke file",
      fileLoaded: "✅ Berhasil dimuat dari file",
      noSavedData: "❌ Tidak ditemukan progres yang disimpan",
      savedDataFound: "✅ Progres yang disimpan ditemukan! Muat untuk melanjutkan?",
      savedDate: "Disimpan pada: {date}",
      clickLoadToContinue: "Klik 'Muat Progres' untuk melanjutkan.",
      fileError: "❌ Kesalahan saat memproses file",
      invalidFileFormat: "❌ Format file tidak valid",
      paintingSpeed: "Kecepatan Melukis",
      pixelsPerSecond: "piksel/detik",
      speedSetting: "Kecepatan: {speed} piksel/detik",
      settings: "Pengaturan",
      botSettings: "Pengaturan Bot",
      close: "Tutup",
      language: "Bahasa",
      themeSettings: "Pengaturan Tema",
      themeSettingsDesc: "Pilih tema warna favorit Anda untuk antarmuka.",
      languageSelectDesc: "Pilih bahasa yang Anda inginkan. Perubahan akan berlaku segera.",
      autoCaptcha: "Penyelesai CAPTCHA Otomatis",
      autoCaptchaDesc: "Mencoba menyelesaikan CAPTCHA secara otomatis dengan mensimulasikan penempatan piksel manual saat token kedaluwarsa.",
      applySettings: "Terapkan Pengaturan",
      settingsSaved: "✅ Pengaturan berhasil disimpan!",
      cooldownSettings: "Pengaturan Cooldown",
      waitCharges: "Tunggu hingga muatan mencapai",
      captchaSolving: "🤖 Mencoba menyelesaikan CAPTCHA...",
      captchaFailed: "❌ Gagal menyelesaikan CAPTCHA. Lukis satu piksel secara manual.",
      automation: "Automasi",
      noChargesThreshold: "⌛ Menunggu muatan mencapai {threshold}. Saat ini: {current}. Berikutnya dalam {time}..."
    },
    tr: {
      title: "WPlace Otomatik-Resim",
      toggleOverlay: "Katmanı Aç/Kapat",
      scanColors: "Renkleri Tara",
      uploadImage: "Resim Yükle",
      resizeImage: "Resmi Yeniden Boyutlandır",
      selectPosition: "Konum Seç",
      startPainting: "Boyamayı Başlat",
      stopPainting: "Boyamayı Durdur",
      checkingColors: "🔍 Uygun renkler kontrol ediliyor...",
      noColorsFound: "❌ Sitede renk paletini açın ve tekrar deneyin!",
      colorsFound: "✅ {count} uygun renk bulundu. Yüklemeye hazır.",
      loadingImage: "🖼️ Resim yükleniyor...",
      imageLoaded: "✅ Resim {count} geçerli piksel ile yüklendi",
      imageError: "❌ Resim yüklenirken hata oluştu",
      selectPositionAlert: "Sanatı başlatmak istediğiniz ilk pikseli boyayın!",
      waitingPosition: "👆 Referans pikseli boyamanız bekleniyor...",
      positionSet: "✅ Konum başarıyla ayarlandı!",
      positionTimeout: "❌ Konum seçme süresi doldu",
      startPaintingMsg: "🎨 Boyama başlatılıyor...",
      paintingProgress: "🧱 İlerleme: {painted}/{total} piksel...",
      noCharges: "⌛ Yeterli hak yok. Bekleniyor {time}...",
      paintingStopped: "⏹️ Boyama kullanıcı tarafından durduruldu",
      paintingComplete: "✅ Boyama tamamlandı! {count} piksel boyandı.",
      paintingError: "❌ Boyama sırasında hata oluştu",
      missingRequirements: "❌ Önce resim yükleyip konum seçmelisiniz",
      progress: "İlerleme",
      pixels: "Pikseller",
      charges: "Haklar",
      estimatedTime: "Tahmini süre",
      initMessage: "Başlamak için 'Resim Yükle'ye tıklayın",
      waitingInit: "Başlatma bekleniyor...",
      resizeSuccess: "✅ Resim {width}x{height} boyutuna yeniden boyutlandırıldı",
      paintingPaused: "⏸️ Boyama duraklatıldı, Konum X: {x}, Y: {y}",
      captchaNeeded: "❗ CAPTCHA gerekli. Devam etmek için bir pikseli manuel olarak boyayın.",
      saveData: "İlerlemeyi Kaydet",
      loadData: "İlerlemeyi Yükle",
      saveToFile: "Dosyaya Kaydet",
      loadFromFile: "Dosyadan Yükle",
      dataManager: "Veri Yöneticisi",
      autoSaved: "✅ İlerleme otomatik olarak kaydedildi",
      dataLoaded: "✅ İlerleme başarıyla yüklendi",
      fileSaved: "✅ İlerleme dosyaya başarıyla kaydedildi",
      fileLoaded: "✅ İlerleme dosyadan başarıyla yüklendi",
      noSavedData: "❌ Kayıtlı ilerleme bulunamadı",
      savedDataFound: "✅ Kayıtlı ilerleme bulundu! Devam etmek için yükleyin.",
      savedDate: "Kaydedilme tarihi: {date}",
      clickLoadToContinue: "Devam etmek için 'İlerlemeyi Yükle'ye tıklayın.",
      fileError: "❌ Dosya işlenirken hata oluştu",
      invalidFileFormat: "❌ Geçersiz dosya formatı",
      paintingSpeed: "Boyama Hızı",
      pixelsPerSecond: "piksel/saniye",
      speedSetting: "Hız: {speed} piksel/sn",
      settings: "Ayarlar",
      botSettings: "Bot Ayarları",
      close: "Kapat",
      language: "Dil",
      themeSettings: "Tema Ayarları",
      themeSettingsDesc: "Arayüz için tercih ettiğiniz renk temasını seçin.",
      languageSelectDesc: "Tercih ettiğiniz dili seçin. Değişiklikler hemen uygulanacaktır.",
      autoCaptcha: "Oto-CAPTCHA Çözücü",
      autoCaptchaDesc: "CAPTCHA süresi dolduğunda manuel piksel yerleştirmeyi taklit ederek otomatik çözmeyi dener.",
      applySettings: "Ayarları Uygula",
      settingsSaved: "✅ Ayarlar başarıyla kaydedildi!",
      cooldownSettings: "Bekleme Süresi Ayarları",
      waitCharges: "Haklar şu seviyeye ulaşana kadar bekle",
      captchaSolving: "🤖 CAPTCHA çözülmeye çalışılıyor...",
      captchaFailed: "❌ Oto-CAPTCHA başarısız oldu. Bir pikseli manuel boyayın.",
      automation: "Otomasyon",
      noChargesThreshold: "⌛ Hakların {threshold} seviyesine ulaşması bekleniyor. Şu anda {current}. Sonraki {time} içinde..."
    },
    zh: {
      title: "WPlace 自动图像",
      toggleOverlay: "切换覆盖层",
      scanColors: "扫描颜色",
      uploadImage: "上传图像",
      resizeImage: "调整大小",
      selectPosition: "选择位置",
      startPainting: "开始绘制",
      stopPainting: "停止绘制",
      checkingColors: "🔍 正在检查可用颜色...",
      noColorsFound: "❌ 请在网站上打开调色板后再试！",
      colorsFound: "✅ 找到 {count} 个可用颜色，准备上传。",
      loadingImage: "🖼️ 正在加载图像...",
      imageLoaded: "✅ 图像已加载，包含 {count} 个有效像素",
      imageError: "❌ 加载图像时出错",
      selectPositionAlert: "请在你想让作品开始的位置绘制第一个像素！",
      waitingPosition: "👆 正在等待你绘制参考像素...",
      positionSet: "✅ 位置设置成功！",
      positionTimeout: "❌ 选择位置超时",
      startPaintingMsg: "🎨 开始绘制...",
      paintingProgress: "🧱 进度: {painted}/{total} 像素...",
      noCharges: "⌛ 无可用次数，等待 {time}...",
      paintingStopped: "⏹️ 已被用户停止",
      paintingComplete: "✅ 绘制完成！共绘制 {count} 个像素。",
      paintingError: "❌ 绘制过程中出错",
      missingRequirements: "❌ 请先加载图像并选择位置",
      progress: "进度",
      pixels: "像素",
      charges: "次数",
      estimatedTime: "预计时间",
      initMessage: "点击“上传图像”开始",
      waitingInit: "正在等待初始化...",
      initializingToken: "🔧 正在初始化 Turnstile 令牌生成器...",
      tokenReady: "✅ 令牌生成器已就绪 - 可以开始绘制！",
      tokenRetryLater: "⚠️ 令牌生成器稍后将重试",
      resizeSuccess: "✅ 图像已调整为 {width}x{height}",
      paintingPaused: "⏸️ 在位置 X: {x}, Y: {y} 暂停",
      captchaNeeded: "❗ 令牌生成失败，请稍后再试。",
      saveData: "保存进度",
      loadData: "加载进度",
      saveToFile: "保存到文件",
      loadFromFile: "从文件加载",
      dataManager: "数据管理",
      autoSaved: "✅ 进度已自动保存",
      dataLoaded: "✅ 进度加载成功",
      fileSaved: "✅ 已成功保存到文件",
      fileLoaded: "✅ 已成功从文件加载",
      noSavedData: "❌ 未找到已保存进度",
      savedDataFound: "✅ 找到已保存进度！是否加载继续？",
      savedDate: "保存时间: {date}",
      clickLoadToContinue: "点击“加载进度”继续。",
      fileError: "❌ 处理文件时出错",
      invalidFileFormat: "❌ 文件格式无效",
      paintingSpeed: "绘制速度",
      pixelsPerSecond: "像素/秒",
      speedSetting: "速度: {speed} 像素/秒",
      settings: "设置",
      botSettings: "机器人设置",
      close: "关闭",
      language: "语言",
      themeSettings: "主题设置",
      themeSettingsDesc: "为界面选择你喜欢的配色主题。",
      languageSelectDesc: "选择你偏好的语言，变更立即生效。",
      autoCaptcha: "自动 CAPTCHA 解决",
      autoCaptchaDesc: "使用集成的生成器自动生成 Turnstile 令牌，必要时回退到浏览器自动化。",
      applySettings: "应用设置",
      settingsSaved: "✅ 设置保存成功！",
      speedOn: "开启",
      speedOff: "关闭",
      cooldownSettings: "冷却设置",
      waitCharges: "等待次数达到",
      captchaSolving: "🔑 正在生成 Turnstile 令牌...",
      captchaFailed: "❌ 令牌生成失败。尝试回退方法...",
      automation: "自动化",
      noChargesThreshold: "⌛ 等待次数达到 {threshold}。当前 {current}。下次在 {time}..."
    },
    ja: {
      title: "WPlace 自動画像",
      toggleOverlay: "オーバーレイ切替",
      scanColors: "色をスキャン",
      uploadImage: "画像をアップロード",
      resizeImage: "画像サイズ変更",
      selectPosition: "位置を選択",
      startPainting: "描画開始",
      stopPainting: "描画停止",
      checkingColors: "🔍 利用可能な色を確認中...",
      noColorsFound: "❌ サイトでカラーパレットを開いて再試行してください！",
      colorsFound: "✅ 利用可能な色 {count} 件を検出。アップロード可能。",
      loadingImage: "🖼️ 画像を読み込み中...",
      imageLoaded: "✅ 画像を読み込みました。有効なピクセル {count}",
      imageError: "❌ 画像の読み込みエラー",
      selectPositionAlert: "作品を開始したい位置に最初のピクセルを置いてください！",
      waitingPosition: "👆 参照ピクセルの描画を待っています...",
      positionSet: "✅ 位置を設定しました！",
      positionTimeout: "❌ 位置選択のタイムアウト",
      startPaintingMsg: "🎨 描画を開始...",
      paintingProgress: "🧱 進捗: {painted}/{total} ピクセル...",
      noCharges: "⌛ チャージなし。{time} 待機...",
      paintingStopped: "⏹️ ユーザーにより停止されました",
      paintingComplete: "✅ 描画完了！ {count} ピクセル描画。",
      paintingError: "❌ 描画中にエラー",
      missingRequirements: "❌ 先に画像を読み込み位置を選択してください",
      progress: "進捗",
      pixels: "ピクセル",
      charges: "チャージ",
      estimatedTime: "推定時間",
      initMessage: "「画像をアップロード」をクリックして開始",
      waitingInit: "初期化待機中...",
      initializingToken: "🔧 Turnstile トークン生成器を初期化中...",
      tokenReady: "✅ トークン生成器準備完了 - 描画できます！",
      tokenRetryLater: "⚠️ 必要に応じて再試行します",
      resizeSuccess: "✅ 画像を {width}x{height} にリサイズ",
      paintingPaused: "⏸️ X: {x}, Y: {y} で一時停止",
      captchaNeeded: "❗ トークン生成に失敗。少ししてから再試行してください。",
      saveData: "進捗を保存",
      loadData: "進捗を読み込み",
      saveToFile: "ファイルへ保存",
      loadFromFile: "ファイルから読み込み",
      dataManager: "データ管理",
      autoSaved: "✅ 自動保存しました",
      dataLoaded: "✅ 進捗を読み込みました",
      fileSaved: "✅ ファイルに保存しました",
      fileLoaded: "✅ ファイルから読み込みました",
      noSavedData: "❌ 保存された進捗がありません",
      savedDataFound: "✅ 保存された進捗が見つかりました。続行しますか？",
      savedDate: "保存日時: {date}",
      clickLoadToContinue: "「進捗を読み込み」をクリックして続行。",
      fileError: "❌ ファイル処理エラー",
      invalidFileFormat: "❌ 無効なファイル形式",
      paintingSpeed: "描画速度",
      pixelsPerSecond: "ピクセル/秒",
      speedSetting: "速度: {speed} ピクセル/秒",
      settings: "設定",
      botSettings: "ボット設定",
      close: "閉じる",
      language: "言語",
      themeSettings: "テーマ設定",
      themeSettingsDesc: "インターフェースの好きなカラーテーマを選択。",
      languageSelectDesc: "希望言語を選択。変更は即時反映されます。",
      autoCaptcha: "自動 CAPTCHA ソルバー",
      autoCaptchaDesc: "統合ジェネレーターで Turnstile トークンを自動生成し必要に応じてブラウザ自動化にフォールバック。",
      applySettings: "設定を適用",
      settingsSaved: "✅ 設定を保存しました！",
      speedOn: "オン",
      speedOff: "オフ",
      cooldownSettings: "クールダウン設定",
      waitCharges: "チャージ数が次に達するまで待機",
      captchaSolving: "🔑 Turnstile トークン生成中...",
      captchaFailed: "❌ トークン生成失敗。フォールバックを試行...",
      automation: "自動化",
      noChargesThreshold: "⌛ チャージ {threshold} を待機中。現在 {current}。次は {time} 後..."
    },
    ko: {
      title: "WPlace 자동 이미지",
      toggleOverlay: "오버레이 전환",
      scanColors: "색상 스캔",
      uploadImage: "이미지 업로드",
      resizeImage: "크기 조정",
      selectPosition: "위치 선택",
      startPainting: "그리기 시작",
      stopPainting: "그리기 중지",
      checkingColors: "🔍 사용 가능한 색상 확인 중...",
      noColorsFound: "❌ 사이트에서 색상 팔레트를 연 후 다시 시도하세요!",
      colorsFound: "✅ 사용 가능한 색상 {count}개 발견. 업로드 준비 완료.",
      loadingImage: "🖼️ 이미지 불러오는 중...",
      imageLoaded: "✅ 이미지 로드 완료. 유효 픽셀 {count}개",
      imageError: "❌ 이미지 로드 오류",
      selectPositionAlert: "작품을 시작할 위치에 첫 픽셀을 칠하세요!",
      waitingPosition: "👆 기준 픽셀을 칠할 때까지 대기 중...",
      positionSet: "✅ 위치 설정 완료!",
      positionTimeout: "❌ 위치 선택 시간 초과",
      startPaintingMsg: "🎨 그리기 시작...",
      paintingProgress: "🧱 진행: {painted}/{total} 픽셀...",
      noCharges: "⌛ 사용 가능 횟수 없음. {time} 대기...",
      paintingStopped: "⏹️ 사용자에 의해 중지됨",
      paintingComplete: "✅ 그리기 완료! {count} 픽셀 그렸습니다.",
      paintingError: "❌ 그리는 중 오류",
      missingRequirements: "❌ 먼저 이미지를 불러오고 위치를 선택하세요",
      progress: "진행",
      pixels: "픽셀",
      charges: "횟수",
      estimatedTime: "예상 시간",
      initMessage: "'이미지 업로드'를 클릭하여 시작",
      waitingInit: "초기화 대기 중...",
      initializingToken: "🔧 Turnstile 토큰 생성기 초기화 중...",
      tokenReady: "✅ 토큰 생성 준비 완료 - 그리기를 시작할 수 있습니다!",
      tokenRetryLater: "⚠️ 필요 시 다시 시도합니다",
      resizeSuccess: "✅ 이미지가 {width}x{height} 크기로 조정됨",
      paintingPaused: "⏸️ 위치 X: {x}, Y: {y} 에서 일시 중지",
      captchaNeeded: "❗ 토큰 생성 실패. 잠시 후 다시 시도하세요.",
      saveData: "진행 저장",
      loadData: "진행 불러오기",
      saveToFile: "파일로 저장",
      loadFromFile: "파일에서 불러오기",
      dataManager: "데이터",
      autoSaved: "✅ 진행 자동 저장됨",
      dataLoaded: "✅ 진행 불러오기 성공",
      fileSaved: "✅ 파일 저장 성공",
      fileLoaded: "✅ 파일 불러오기 성공",
      noSavedData: "❌ 저장된 진행 없음",
      savedDataFound: "✅ 저장된 진행 발견! 계속하려면 불러오시겠습니까?",
      savedDate: "저장 시각: {date}",
      clickLoadToContinue: "'진행 불러오기'를 클릭하여 계속.",
      fileError: "❌ 파일 처리 오류",
      invalidFileFormat: "❌ 잘못된 파일 형식",
      paintingSpeed: "그리기 속도",
      pixelsPerSecond: "픽셀/초",
      speedSetting: "속도: {speed} 픽셀/초",
      settings: "설정",
      botSettings: "봇 설정",
      close: "닫기",
      language: "언어",
      themeSettings: "테마 설정",
      themeSettingsDesc: "인터페이스용 선호 색상 테마를 선택하세요.",
      languageSelectDesc: "선호 언어를 선택하세요. 변경 사항은 즉시 적용됩니다.",
      autoCaptcha: "자동 CAPTCHA 해결",
      autoCaptchaDesc: "통합 생성기를 사용해 Turnstile 토큰을 자동 생성하고 필요 시 브라우저 자동화로 폴백.",
      applySettings: "설정 적용",
      settingsSaved: "✅ 설정 저장 완료!",
      speedOn: "켜짐",
      speedOff: "꺼짐",
      cooldownSettings: "쿨다운 설정",
      waitCharges: "횟수가 다음 값에 도달할 때까지 대기",
      captchaSolving: "🔑 Turnstile 토큰 생성 중...",
      captchaFailed: "❌ 토큰 생성 실패. 폴백 시도...",
      automation: "자동화",
      noChargesThreshold: "⌛ 횟수가 {threshold} 에 도달할 때까지 대기 중. 현재 {current}. 다음 {time} 후..."
    }
  }, t = {
    running: !1,
    imageLoaded: !1,
    processing: !1,
    totalPixels: 0,
    paintedPixels: 0,
    availableColors: [],
    activeColorPalette: [],
    // User-selected colors for conversion
    paintWhitePixels: !0,
    // Default to ON
    currentCharges: 0,
    maxCharges: 1,
    // Default max charges
    cooldown: l.COOLDOWN_DEFAULT,
    imageData: null,
    stopFlag: !1,
    colorsChecked: !1,
    startPosition: null,
    selectingPosition: !1,
    region: null,
    minimized: !1,
    lastPosition: { x: 0, y: 0 },
    estimatedTime: 0,
    language: "en",
    paintingSpeed: l.PAINTING_SPEED.DEFAULT,
    // pixels per second
    cooldownChargeThreshold: l.COOLDOWN_CHARGE_THRESHOLD,
    overlayOpacity: l.OVERLAY.OPACITY_DEFAULT,
    blueMarbleEnabled: l.OVERLAY.BLUE_MARBLE_DEFAULT,
    ditheringEnabled: !1,
    // Advanced color matching settings
    colorMatchingAlgorithm: "lab",
    // 'lab' | 'legacy'
    enableChromaPenalty: !0,
    chromaPenaltyWeight: 0.15,
    customTransparencyThreshold: l.TRANSPARENCY_THRESHOLD,
    customWhiteThreshold: l.WHITE_THRESHOLD,
    resizeSettings: null,
    originalImage: null,
    resizeIgnoreMask: null
  };
  class mt {
    constructor(i) {
      this.imageSrc = i, this.img = null, this.canvas = null, this.ctx = null;
    }
    async load() {
      return new Promise((i, n) => {
        this.img = new Image(), this.img.crossOrigin = "anonymous", this.img.onload = () => {
          this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), this.canvas.width = this.img.width, this.canvas.height = this.img.height, this.ctx.drawImage(this.img, 0, 0), i();
        }, this.img.onerror = n, this.img.src = this.imageSrc;
      });
    }
    getDimensions() {
      return {
        width: this.canvas.width,
        height: this.canvas.height
      };
    }
    getPixelData() {
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    }
    resize(i, n) {
      const o = document.createElement("canvas"), r = o.getContext("2d");
      return o.width = i, o.height = n, r.imageSmoothingEnabled = !1, r.drawImage(this.canvas, 0, 0, i, n), this.canvas.width = i, this.canvas.height = n, this.ctx.imageSmoothingEnabled = !1, this.ctx.drawImage(o, 0, 0), this.ctx.getImageData(0, 0, i, n).data;
    }
    generatePreview(i, n) {
      const o = document.createElement("canvas"), r = o.getContext("2d");
      return o.width = i, o.height = n, r.imageSmoothingEnabled = !1, r.drawImage(this.img, 0, 0, i, n), o.toDataURL();
    }
  }
  class ra {
    constructor() {
      this.isEnabled = !1, this.startCoords = null, this.imageBitmap = null, this.chunkedTiles = /* @__PURE__ */ new Map(), this.tileSize = 1e3, this.processPromise = null, this.lastProcessedHash = null, this.workerPool = null;
    }
    toggle() {
      return this.isEnabled = !this.isEnabled, console.log(`Overlay ${this.isEnabled ? "enabled" : "disabled"}.`), this.isEnabled;
    }
    enable() {
      this.isEnabled = !0;
    }
    disable() {
      this.isEnabled = !1;
    }
    clear() {
      this.disable(), this.imageBitmap = null, this.chunkedTiles.clear(), this.lastProcessedHash = null, this.processPromise && (this.processPromise = null);
    }
    async setImage(i) {
      this.imageBitmap = i, this.lastProcessedHash = null, this.imageBitmap && this.startCoords && await this.processImageIntoChunks();
    }
    async setPosition(i, n) {
      if (!i || !n) {
        this.startCoords = null, this.chunkedTiles.clear(), this.lastProcessedHash = null;
        return;
      }
      this.startCoords = { region: n, pixel: i }, this.lastProcessedHash = null, this.imageBitmap && await this.processImageIntoChunks();
    }
    // Generate hash for cache invalidation
    _generateProcessHash() {
      if (!this.imageBitmap || !this.startCoords) return null;
      const { width: i, height: n } = this.imageBitmap, { x: o, y: r } = this.startCoords.pixel, { x: e, y: d } = this.startCoords.region;
      return `${i}x${n}_${o},${r}_${e},${d}_${t.blueMarbleEnabled}_${t.overlayOpacity}`;
    }
    // --- OVERLAY UPDATE: Optimized chunking with caching and batch processing ---
    async processImageIntoChunks() {
      if (!this.imageBitmap || !this.startCoords) return;
      if (this.processPromise)
        return this.processPromise;
      const i = this._generateProcessHash();
      if (this.lastProcessedHash === i && this.chunkedTiles.size > 0) {
        console.log(`📦 Using cached overlay chunks (${this.chunkedTiles.size} tiles)`);
        return;
      }
      this.processPromise = this._doProcessImageIntoChunks();
      try {
        await this.processPromise, this.lastProcessedHash = i;
      } finally {
        this.processPromise = null;
      }
    }
    async _doProcessImageIntoChunks() {
      const i = performance.now();
      this.chunkedTiles.clear();
      const { width: n, height: o } = this.imageBitmap, { x: r, y: e } = this.startCoords.pixel, { x: d, y: w } = this.startCoords.region, p = r + n, u = e + o, g = d + Math.floor(r / this.tileSize), y = w + Math.floor(e / this.tileSize), L = d + Math.floor(p / this.tileSize), A = w + Math.floor(u / this.tileSize), k = (L - g + 1) * (A - y + 1);
      console.log(`🔄 Processing ${k} overlay tiles...`);
      const S = 4, T = [];
      for (let D = y; D <= A; D++)
        for (let G = g; G <= L; G++)
          T.push({ tx: G, ty: D });
      for (let D = 0; D < T.length; D += S) {
        const G = T.slice(D, D + S);
        await Promise.all(G.map(async ({ tx: U, ty: Q }) => {
          const O = `${U},${Q}`, ce = await this._processTile(U, Q, n, o, r, e, d, w);
          ce && this.chunkedTiles.set(O, ce);
        })), D + S < T.length && await new Promise((U) => setTimeout(U, 0));
      }
      const $ = performance.now() - i;
      console.log(`✅ Overlay processed ${this.chunkedTiles.size} tiles in ${Math.round($)}ms`);
    }
    async _processTile(i, n, o, r, e, d, w, p) {
      const u = (i - w) * this.tileSize - e, g = (n - p) * this.tileSize - d, y = Math.max(0, u), L = Math.max(0, g), A = Math.min(o - y, this.tileSize - (y - u)), k = Math.min(r - L, this.tileSize - (L - g));
      if (A <= 0 || k <= 0) return null;
      const S = Math.max(0, -u), T = Math.max(0, -g), $ = new OffscreenCanvas(this.tileSize, this.tileSize), D = $.getContext("2d");
      if (D.imageSmoothingEnabled = !1, D.drawImage(this.imageBitmap, y, L, A, k, S, T, A, k), t.blueMarbleEnabled) {
        const G = D.getImageData(S, T, A, k), U = G.data;
        for (let Q = 0; Q < U.length; Q += 4) {
          const O = Q / 4, ce = Math.floor(O / A);
          (O % A + ce) % 2 === 0 && U[Q + 3] > 0 && (U[Q + 3] = 0);
        }
        D.putImageData(G, S, T);
      }
      return await $.transferToImageBitmap();
    }
    // --- OVERLAY UPDATE: Optimized compositing with caching ---
    async processAndRespondToTileRequest(i) {
      const { endpoint: n, blobID: o, blobData: r } = i;
      let e = r;
      if (this.isEnabled && this.chunkedTiles.size > 0) {
        const d = n.match(/(\d+)\/(\d+)\.png/);
        if (d) {
          const w = parseInt(d[1], 10), p = parseInt(d[2], 10), u = `${w},${p}`, g = this.chunkedTiles.get(u);
          if (g)
            try {
              e = await this._compositeTileOptimized(r, g);
            } catch (y) {
              console.error("Error compositing overlay:", y), e = r;
            }
        }
      }
      window.postMessage({
        source: "auto-image-overlay",
        blobID: o,
        blobData: e
      }, "*");
    }
    async _compositeTileOptimized(i, n) {
      const o = await createImageBitmap(i), r = new OffscreenCanvas(o.width, o.height), e = r.getContext("2d");
      return e.imageSmoothingEnabled = !1, e.drawImage(o, 0, 0), e.globalAlpha = t.overlayOpacity, e.globalCompositeOperation = "source-over", e.drawImage(n, 0, 0), await r.convertToBlob({
        type: "image/png",
        quality: 0.95
        // Slight compression for faster processing
      });
    }
  }
  const be = new ra(), s = {
    sleep: (a) => new Promise((i) => setTimeout(i, a)),
    waitForSelector: async (a, i = 200, n = 5e3) => {
      const o = Date.now();
      for (; Date.now() - o < n; ) {
        const r = document.querySelector(a);
        if (r) return r;
        await s.sleep(i);
      }
      return null;
    },
    detectSitekey: (a = "0x4AAAAAABpqJe8FO0N84q0F") => {
      if ((void 0)._cachedSitekey)
        return (void 0)._cachedSitekey;
      try {
        const i = document.querySelector("[data-sitekey]");
        if (i) {
          const r = i.getAttribute("data-sitekey");
          if (r && r.length > 10)
            return (void 0)._cachedSitekey = r, console.log("🔍 Sitekey detected from data attribute:", r), r;
        }
        const n = document.querySelector(".cf-turnstile");
        if (n?.dataset?.sitekey && n.dataset.sitekey.length > 10)
          return (void 0)._cachedSitekey = n.dataset.sitekey, console.log("🔍 Sitekey detected from turnstile element:", (void 0)._cachedSitekey), (void 0)._cachedSitekey;
        if (typeof window < "u" && window.__TURNSTILE_SITEKEY && window.__TURNSTILE_SITEKEY.length > 10)
          return (void 0)._cachedSitekey = window.__TURNSTILE_SITEKEY, console.log("🔍 Sitekey detected from global variable:", (void 0)._cachedSitekey), (void 0)._cachedSitekey;
        const o = document.querySelectorAll("script");
        for (const r of o) {
          const d = (r.textContent || r.innerHTML).match(/sitekey['":\s]+(['"0-9a-zA-Z_-]{20,})/i);
          if (d && d[1] && d[1].length > 10)
            return (void 0)._cachedSitekey = d[1].replace(/['"]/g, ""), console.log("🔍 Sitekey detected from script content:", (void 0)._cachedSitekey), (void 0)._cachedSitekey;
        }
      } catch (i) {
        console.warn("Error detecting sitekey:", i);
      }
      return console.log("🔍 Using fallback sitekey:", a), (void 0)._cachedSitekey = a, a;
    },
    createElement: (a, i = {}, n = []) => {
      const o = document.createElement(a);
      return Object.entries(i).forEach(([r, e]) => {
        r === "style" && typeof e == "object" ? Object.assign(o.style, e) : r === "className" ? o.className = e : r === "innerHTML" ? o.innerHTML = e : o.setAttribute(r, e);
      }), typeof n == "string" ? o.textContent = n : Array.isArray(n) && n.forEach((r) => {
        typeof r == "string" ? o.appendChild(document.createTextNode(r)) : o.appendChild(r);
      }), o;
    },
    createButton: (a, i, n, o, r = l.CSS_CLASSES.BUTTON_PRIMARY) => {
      const e = s.createElement("button", {
        id: a,
        style: r,
        innerHTML: `${n ? `<i class="${n}"></i>` : ""}<span>${i}</span>`
      });
      return o && e.addEventListener("click", o), e;
    },
    t: (a, i = {}) => {
      let n = ht[t.language]?.[a] || ht.en[a] || a;
      return Object.keys(i).forEach((o) => {
        n = n.replace(`{${o}}`, i[o]);
      }), n;
    },
    showAlert: (a, i = "info") => {
      const n = document.createElement("div");
      n.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10001;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease-out;
        font-family: 'Segoe UI', sans-serif;
      `;
      const o = {
        info: "background: linear-gradient(135deg, #3498db, #2980b9);",
        success: "background: linear-gradient(135deg, #27ae60, #229954);",
        warning: "background: linear-gradient(135deg, #f39c12, #e67e22);",
        error: "background: linear-gradient(135deg, #e74c3c, #c0392b);"
      };
      n.style.cssText += o[i] || o.info;
      const r = document.createElement("style");
      r.textContent = `
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `, document.head.appendChild(r), n.textContent = a, document.body.appendChild(n), setTimeout(() => {
        n.style.animation = "slideDown 0.3s ease-out reverse", setTimeout(() => {
          document.body.removeChild(n), document.head.removeChild(r);
        }, 300);
      }, 4e3);
    },
    colorDistance: (a, i) => Math.sqrt(Math.pow(a[0] - i[0], 2) + Math.pow(a[1] - i[1], 2) + Math.pow(a[2] - i[2], 2)),
    _labCache: /* @__PURE__ */ new Map(),
    // key: (r<<16)|(g<<8)|b  value: [L,a,b]
    _rgbToLab: (a, i, n) => {
      const o = ($) => ($ /= 255, $ <= 0.04045 ? $ / 12.92 : Math.pow(($ + 0.055) / 1.055, 2.4)), r = o(a), e = o(i), d = o(n);
      let w = r * 0.4124 + e * 0.3576 + d * 0.1805, p = r * 0.2126 + e * 0.7152 + d * 0.0722, u = r * 0.0193 + e * 0.1192 + d * 0.9505;
      w /= 0.95047, p /= 1, u /= 1.08883;
      const g = ($) => $ > 8856e-6 ? Math.cbrt($) : 7.787 * $ + 16 / 116, y = g(w), L = g(p), A = g(u), k = 116 * L - 16, S = 500 * (y - L), T = 200 * (L - A);
      return [k, S, T];
    },
    _lab: (a, i, n) => {
      const o = a << 16 | i << 8 | n;
      let r = s._labCache.get(o);
      return r || (r = s._rgbToLab(a, i, n), s._labCache.set(o, r)), r;
    },
    findClosestPaletteColor: (a, i, n, o) => {
      if ((!o || o.length === 0) && (o = Object.values(l.COLOR_MAP).filter((g) => g.rgb).map((g) => [g.rgb.r, g.rgb.g, g.rgb.b])), t.colorMatchingAlgorithm === "legacy") {
        let g = 1 / 0, y = [0, 0, 0];
        for (let L = 0; L < o.length; L++) {
          const [A, k, S] = o[L], T = (A + a) / 2, $ = A - a, D = k - i, G = S - n, U = Math.sqrt(((512 + T) * $ * $ >> 8) + 4 * D * D + ((767 - T) * G * G >> 8));
          U < g && (g = U, y = [A, k, S]);
        }
        return y;
      }
      const [r, e, d] = s._lab(a, i, n), w = Math.sqrt(e * e + d * d);
      let p = null, u = 1 / 0;
      for (let g = 0; g < o.length; g++) {
        const [y, L, A] = o[g], [k, S, T] = s._lab(y, L, A), $ = r - k, D = e - S, G = d - T;
        let U = $ * $ + D * D + G * G;
        if (t.enableChromaPenalty && w > 20) {
          const Q = Math.sqrt(S * S + T * T);
          if (Q < w) {
            const O = w - Q;
            U += O * O * t.chromaPenaltyWeight;
          }
        }
        if (U < u && (u = U, p = o[g], u === 0))
          break;
      }
      return p || [0, 0, 0];
    },
    isWhitePixel: (a, i, n) => {
      const o = t.customWhiteThreshold || l.WHITE_THRESHOLD;
      return a >= o && i >= o && n >= o;
    },
    createImageUploader: () => new Promise((a) => {
      const i = document.createElement("input");
      i.type = "file", i.accept = "image/png,image/jpeg", i.onchange = () => {
        const n = new FileReader();
        n.onload = () => a(n.result), n.readAsDataURL(i.files[0]);
      }, i.click();
    }),
    createFileDownloader: (a, i) => {
      const n = new Blob([a], { type: "application/json" }), o = URL.createObjectURL(n), r = document.createElement("a");
      r.href = o, r.download = i, document.body.appendChild(r), r.click(), document.body.removeChild(r), URL.revokeObjectURL(o);
    },
    createFileUploader: () => new Promise((a, i) => {
      const n = document.createElement("input");
      n.type = "file", n.accept = ".json", n.onchange = (o) => {
        const r = o.target.files[0];
        if (r) {
          const e = new FileReader();
          e.onload = () => {
            try {
              const d = JSON.parse(e.result);
              a(d);
            } catch {
              i(new Error("Invalid JSON file"));
            }
          }, e.onerror = () => i(new Error("File reading error")), e.readAsText(r);
        } else
          i(new Error("No file selected"));
      }, n.click();
    }),
    extractAvailableColors: () => {
      const a = document.querySelectorAll('[id^="color-"]'), i = [], n = [];
      return Array.from(a).forEach((o) => {
        const r = Number.parseInt(o.id.replace("color-", ""));
        if (r === 0) return;
        const e = o.style.backgroundColor.match(/\d+/g), d = e ? e.map(Number) : [0, 0, 0], w = Object.values(l.COLOR_MAP).find((g) => g.id === r), p = w ? w.name : `Unknown Color ${r}`, u = { id: r, name: p, rgb: d };
        o.querySelector("svg") ? n.push(u) : i.push(u);
      }), console.log("=== CAPTURED COLORS STATUS ==="), console.log(`Total available colors: ${i.length}`), console.log(`Total unavailable colors: ${n.length}`), console.log(`Total colors scanned: ${i.length + n.length}`), i.length > 0 && (console.log(`
--- AVAILABLE COLORS ---`), i.forEach((o, r) => {
        console.log(`${r + 1}. ID: ${o.id}, Name: "${o.name}", RGB: (${o.rgb[0]}, ${o.rgb[1]}, ${o.rgb[2]})`);
      })), n.length > 0 && (console.log(`
--- UNAVAILABLE COLORS ---`), n.forEach((o, r) => {
        console.log(`${r + 1}. ID: ${o.id}, Name: "${o.name}", RGB: (${o.rgb[0]}, ${o.rgb[1]}, ${o.rgb[2]}) [LOCKED]`);
      })), console.log("=== END COLOR STATUS ==="), i;
    },
    formatTime: (a) => {
      const i = Math.floor(a / 1e3 % 60), n = Math.floor(a / (1e3 * 60) % 60), o = Math.floor(a / (1e3 * 60 * 60) % 24), r = Math.floor(a / (1e3 * 60 * 60 * 24));
      let e = "";
      return r > 0 && (e += `${r}d `), (o > 0 || r > 0) && (e += `${o}h `), (n > 0 || o > 0 || r > 0) && (e += `${n}m `), e += `${i}s`, e;
    },
    calculateEstimatedTime: (a, i, n) => {
      if (a <= 0) return 0;
      const o = t.paintingSpeed > 0 ? 1e3 / t.paintingSpeed : 1e3, r = a * o, d = Math.ceil(a / Math.max(i, 1)) * n;
      return Math.max(r, d);
    },
    // --- Painted map packing helpers (compact, efficient storage) ---
    packPaintedMapToBase64: (a, i, n) => {
      if (!a || !i || !n) return null;
      const o = i * n, r = Math.ceil(o / 8), e = new Uint8Array(r);
      let d = 0;
      for (let u = 0; u < n; u++) {
        const g = a[u];
        for (let y = 0; y < i; y++) {
          const L = g && g[y] ? 1 : 0, A = d >> 3, k = d & 7;
          L && (e[A] |= 1 << k), d++;
        }
      }
      let w = "";
      const p = 32768;
      for (let u = 0; u < e.length; u += p)
        w += String.fromCharCode.apply(null, e.subarray(u, Math.min(u + p, e.length)));
      return btoa(w);
    },
    unpackPaintedMapFromBase64: (a, i, n) => {
      if (!a || !i || !n) return null;
      const o = atob(a), r = new Uint8Array(o.length);
      for (let w = 0; w < o.length; w++) r[w] = o.charCodeAt(w);
      const e = Array(n).fill().map(() => Array(i).fill(!1));
      let d = 0;
      for (let w = 0; w < n; w++)
        for (let p = 0; p < i; p++) {
          const u = d >> 3, g = d & 7;
          e[w][p] = (r[u] >> g & 1) === 1, d++;
        }
      return e;
    },
    migrateProgressToV2: (a) => {
      if (!a || !(!a.version || a.version === "1" || a.version === "1.0" || a.version === "1.1")) return a;
      try {
        const n = { ...a }, o = n.imageData?.width, r = n.imageData?.height;
        if (n.paintedMap && o && r) {
          const e = s.packPaintedMapToBase64(n.paintedMap, o, r);
          n.paintedMapPacked = { width: o, height: r, data: e };
        }
        return delete n.paintedMap, n.version = "2", n;
      } catch (n) {
        return console.warn("Migration to v2 failed, using original data:", n), a;
      }
    },
    migrateProgressToV21: (a) => {
      if (!a || a.version === "2.1") return a;
      const i = a.version === "2" || a.version === "2.0", n = !a.version || a.version === "1" || a.version === "1.0" || a.version === "1.1";
      if (!i && !n) return a;
      try {
        const o = { ...a };
        return delete o.paintedMapPacked, delete o.paintedMap, o.version = "2.1", o;
      } catch (o) {
        return console.warn("Migration to v2.1 failed, using original data:", o), a;
      }
    },
    saveProgress: () => {
      try {
        const a = {
          timestamp: Date.now(),
          version: "2.1",
          state: {
            totalPixels: t.totalPixels,
            paintedPixels: t.paintedPixels,
            lastPosition: t.lastPosition,
            startPosition: t.startPosition,
            region: t.region,
            imageLoaded: t.imageLoaded,
            colorsChecked: t.colorsChecked,
            availableColors: t.availableColors
          },
          imageData: t.imageData ? {
            width: t.imageData.width,
            height: t.imageData.height,
            pixels: Array.from(t.imageData.pixels),
            totalPixels: t.imageData.totalPixels
          } : null,
          paintedMapPacked: null
        };
        return localStorage.setItem("wplace-bot-progress", JSON.stringify(a)), !0;
      } catch (a) {
        return console.error("Error saving progress:", a), !1;
      }
    },
    loadProgress: () => {
      try {
        const a = localStorage.getItem("wplace-bot-progress");
        if (!a) return null;
        let i = JSON.parse(a);
        const n = i.version;
        let o = i;
        if (n === "2.1" || (o = s.migrateProgressToV21(i)), o && o !== i) {
          try {
            localStorage.setItem("wplace-bot-progress", JSON.stringify(o));
          } catch {
          }
          i = o;
        }
        return i;
      } catch (a) {
        return console.error("Error loading progress:", a), null;
      }
    },
    clearProgress: () => {
      try {
        return localStorage.removeItem("wplace-bot-progress"), !0;
      } catch (a) {
        return console.error("Error clearing progress:", a), !1;
      }
    },
    restoreProgress: (a) => {
      try {
        if (Object.assign(t, a.state), a.imageData) {
          t.imageData = {
            ...a.imageData,
            pixels: new Uint8ClampedArray(a.imageData.pixels)
          };
          try {
            const i = document.createElement("canvas");
            i.width = t.imageData.width, i.height = t.imageData.height;
            const n = i.getContext("2d"), o = new ImageData(t.imageData.pixels, t.imageData.width, t.imageData.height);
            n.putImageData(o, 0, 0);
            const r = new mt("");
            r.img = i, r.canvas = i, r.ctx = n, t.imageData.processor = r;
          } catch (i) {
            console.warn("Could not rebuild processor from saved image data:", i);
          }
        }
        if (a.paintedMapPacked && a.paintedMapPacked.data) {
          const { width: i, height: n, data: o } = a.paintedMapPacked;
          t.paintedMap = s.unpackPaintedMapFromBase64(o, i, n);
        } else a.paintedMap && (t.paintedMap = a.paintedMap.map((i) => Array.from(i)));
        return !0;
      } catch (i) {
        return console.error("Error restoring progress:", i), !1;
      }
    },
    saveProgressToFile: () => {
      try {
        const a = {
          timestamp: Date.now(),
          version: "2.1",
          state: {
            totalPixels: t.totalPixels,
            paintedPixels: t.paintedPixels,
            lastPosition: t.lastPosition,
            startPosition: t.startPosition,
            region: t.region,
            imageLoaded: t.imageLoaded,
            colorsChecked: t.colorsChecked,
            availableColors: t.availableColors
          },
          imageData: t.imageData ? {
            width: t.imageData.width,
            height: t.imageData.height,
            pixels: Array.from(t.imageData.pixels),
            totalPixels: t.imageData.totalPixels
          } : null,
          paintedMapPacked: null
        }, i = `wplace-bot-progress-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
        return s.createFileDownloader(JSON.stringify(a, null, 2), i), !0;
      } catch (a) {
        return console.error("Error saving to file:", a), !1;
      }
    },
    loadProgressFromFile: async () => {
      try {
        const a = await s.createFileUploader();
        if (!a || !a.state)
          throw new Error("Invalid file format");
        const i = a.version;
        let n = a;
        return i === "2.1" || (n = s.migrateProgressToV21(a) || a), s.restoreProgress(n);
      } catch (a) {
        throw console.error("Error loading from file:", a), a;
      }
    },
    // Helper function to restore overlay from loaded data
    restoreOverlayFromData: async () => {
      if (!t.imageLoaded || !t.imageData || !t.startPosition || !t.region)
        return !1;
      try {
        const a = new ImageData(
          t.imageData.pixels,
          t.imageData.width,
          t.imageData.height
        ), i = new OffscreenCanvas(t.imageData.width, t.imageData.height);
        i.getContext("2d").putImageData(a, 0, 0);
        const o = await i.transferToImageBitmap();
        await be.setImage(o), await be.setPosition(t.startPosition, t.region), be.enable();
        const r = document.getElementById("toggleOverlayBtn");
        return r && (r.disabled = !1, r.classList.add("active")), console.log("Overlay restored from data"), !0;
      } catch (a) {
        return console.error("Failed to restore overlay from data:", a), !1;
      }
    }
  };
  let qe = null, Bt = 0, bt = !1, He = null, Rt = new Promise((a) => {
    He = a;
  });
  const ft = 10, sa = 24e4;
  let ke = null, Ee = null, xt = null, Te = null;
  async function Ft() {
    return window.turnstile ? Promise.resolve() : new Promise((a, i) => {
      if (document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
        const o = () => {
          window.turnstile ? a() : setTimeout(o, 100);
        };
        return o();
      }
      const n = document.createElement("script");
      n.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", n.async = !0, n.defer = !0, n.onload = () => {
        console.log("✅ Turnstile script loaded successfully"), a();
      }, n.onerror = () => {
        console.error("❌ Failed to load Turnstile script"), i(new Error("Failed to load Turnstile"));
      }, document.head.appendChild(n);
    });
  }
  function la() {
    return (!ke || !document.body.contains(ke)) && (ke && ke.remove(), ke = document.createElement("div"), ke.style.cssText = `
      position: fixed !important; left: -9999px !important; top: -9999px !important;
      width: 300px !important; height: 65px !important; pointer-events: none !important;
      opacity: 0 !important; z-index: -1 !important;`, ke.setAttribute("aria-hidden", "true"), ke.id = "turnstile-widget-container", document.body.appendChild(ke)), ke;
  }
  function ca() {
    return Te && document.body.contains(Te) || (Te = s.createElement("div", { id: "turnstile-overlay-container" }, [
      s.createElement("div", {}, "Cloudflare Turnstile — please complete the check if shown"),
      s.createElement("div", { id: "turnstile-overlay-host" }),
      s.createElement("button", { id: "close-ts-overlay" }, "Hide")
    ]), Te.style.cssText = `
        position: fixed; right: 16px; bottom: 16px; width: 320px; min-height: 80px;
        background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2);
        border-radius: 10px; padding: 12px; z-index: 100000; backdrop-filter: blur(6px);
        color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.4);`, Te.querySelector("#close-ts-overlay").addEventListener("click", () => Te.remove()), document.body.appendChild(Te)), Te;
  }
  async function da(a, i = "paint") {
    if (await Ft(), Ee && xt === a && window.turnstile?.execute)
      try {
        console.log("🔄 Reusing existing Turnstile widget...");
        const o = await Promise.race([
          window.turnstile.execute(Ee, { action: i }),
          new Promise((r, e) => setTimeout(() => e(new Error("Execute timeout")), 15e3))
        ]);
        if (o && o.length > 20) return o;
      } catch (o) {
        console.warn("🔄 Widget reuse failed, will create a fresh widget:", o.message);
      }
    const n = await ga(a, i);
    return n && n.length > 20 ? n : (console.log("👀 Falling back to interactive Turnstile (visible)."), await pa(a, i));
  }
  function ga(a, i) {
    return new Promise((n) => {
      try {
        if (Ee && window.turnstile?.remove)
          try {
            window.turnstile.remove(Ee);
          } catch {
          }
        const o = la();
        o.innerHTML = "";
        const r = window.turnstile.render(o, {
          sitekey: a,
          action: i,
          size: "invisible",
          retry: "auto",
          "retry-interval": 8e3,
          callback: (e) => n(e),
          "error-callback": () => n(null),
          "timeout-callback": () => n(null)
        });
        if (Ee = r, xt = a, !r) return n(null);
        Promise.race([
          window.turnstile.execute(r, { action: i }),
          new Promise((e, d) => setTimeout(() => d(new Error("Invisible execute timeout")), 12e3))
        ]).then(n).catch(() => n(null));
      } catch (o) {
        console.warn("Invisible Turnstile failed:", o), n(null);
      }
    });
  }
  function pa(a, i) {
    return new Promise((n, o) => {
      try {
        if (Ee && window.turnstile?.remove)
          try {
            window.turnstile.remove(Ee);
          } catch {
          }
        const r = ca(), e = r.querySelector("#turnstile-overlay-host");
        e.innerHTML = "";
        const d = setTimeout(() => {
          console.warn("⏰ Interactive Turnstile timed out"), n(null);
        }, 12e4), w = window.turnstile.render(e, {
          sitekey: a,
          action: i,
          size: "normal",
          retry: "auto",
          "retry-interval": 8e3,
          callback: (p) => {
            clearTimeout(d);
            try {
              r.remove();
            } catch {
            }
            n(p);
          },
          "error-callback": (p) => console.warn("🚨 Interactive Turnstile error:", p),
          "timeout-callback": () => console.warn("⏰ Turnstile timeout callback (interactive)"),
          "expired-callback": () => console.warn("⚠️ Interactive Turnstile token expired")
        });
        Ee = w, xt = a, w || (clearTimeout(d), n(null));
      } catch (r) {
        console.error("❌ Error creating interactive Turnstile widget:", r), o(r);
      }
    });
  }
  function ua(a) {
    return da(a, "paint");
  }
  function Ke(a) {
    He && (He(a), He = null), qe = a, Bt = Date.now() + sa;
  }
  function wt() {
    return qe && Date.now() < Bt;
  }
  async function Nt() {
    if (wt()) return qe;
    if (bt)
      return await s.sleep(2e3), wt() ? qe : null;
    bt = !0;
    try {
      const a = await Ot();
      if (a)
        return Ke(a), a;
    } catch (a) {
      console.error("❌ Token generation failed after retries:", a), B("captchaNeeded", "error"), s.showAlert(s.t("captchaNeeded"), "error");
    } finally {
      bt = !1;
    }
    return null;
  }
  async function Ot() {
    for (let a = 1; a <= ft; a++)
      try {
        const i = await Ht();
        if (i && i.length > 20) return i;
        throw new Error("Invalid token received");
      } catch (i) {
        if (console.warn(`❌ Token generation attempt ${a}/${ft} failed:`, i), a < ft) {
          const n = Math.min(1e3 * Math.pow(2, a - 1), 8e3);
          await s.sleep(n);
        } else
          throw i;
      }
  }
  async function Ht() {
    const a = performance.now();
    try {
      const i = s.detectSitekey(), n = await ua(i);
      if (n && n.length > 20) {
        const o = Math.round(performance.now() - a);
        return console.log(`✅ Turnstile token generated successfully in ${o}ms`), n;
      } else
        throw new Error("Invalid or empty token received");
    } catch (i) {
      return console.error("❌ Turnstile token generation failed:", i), await ha();
    }
  }
  async function ha() {
    return new Promise(async (a, i) => {
      try {
        He || (Rt = new Promise((r) => {
          He = r;
        }));
        const n = s.sleep(2e4).then(() => i(new Error("Auto-CAPTCHA timed out."))), o = (async () => {
          const r = await s.waitForSelector("button.btn.btn-primary.btn-lg, button.btn-primary.sm\\:btn-xl", 200, 1e4);
          if (!r) throw new Error("Could not find the main paint button.");
          r.click(), await s.sleep(500);
          const e = await s.waitForSelector("button#color-0", 200, 5e3);
          if (!e) throw new Error("Could not find the transparent color button.");
          e.click(), await s.sleep(500);
          const d = await s.waitForSelector("canvas", 200, 5e3);
          if (!d) throw new Error("Could not find the canvas element.");
          d.setAttribute("tabindex", "0"), d.focus();
          const w = d.getBoundingClientRect(), p = Math.round(w.left + w.width / 2), u = Math.round(w.top + w.height / 2);
          d.dispatchEvent(new MouseEvent("mousemove", { clientX: p, clientY: u, bubbles: !0 })), d.dispatchEvent(new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: !0 })), await s.sleep(50), d.dispatchEvent(new KeyboardEvent("keyup", { key: " ", code: "Space", bubbles: !0 })), await s.sleep(800), (async () => {
            for (; !qe; ) {
              let L = await s.waitForSelector("button.btn.btn-primary.btn-lg, button.btn.primary.sm\\:btn-xl");
              L && L.click(), await s.sleep(500);
            }
          })();
          const y = await Rt;
          await s.sleep(300), a(y);
        })();
        await Promise.race([o, n]);
      } catch (n) {
        console.error("Auto-CAPTCHA process failed:", n), i(n);
      }
    });
  }
  async function ma() {
    if (wt()) {
      B("tokenReady", "success");
      return;
    }
    try {
      B("initializingToken", "default"), await Ft();
      const a = await Ot();
      a ? (Ke(a), B("tokenReady", "success"), s.showAlert("🔑 Token generator ready!", "success")) : B("tokenRetryLater", "warning");
    } catch (a) {
      console.warn("⚠️ Startup token generation failed:", a), B("tokenRetryLater", "warning");
    }
  }
  const yt = {
    async paintPixelInRegion(a, i, n, o, r) {
      try {
        const e = await Nt();
        if (!e)
          return "token_error";
        const d = { coords: [n, o], colors: [r], t: e }, w = await fetch(`https://backend.wplace.live/s0/pixel/${a}/${i}`, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          credentials: "include",
          body: JSON.stringify(d)
        });
        return w.status === 403 ? (console.error("❌ 403 Forbidden. Turnstile token might be invalid or expired."), Ke(null), "token_error") : (await w.json())?.painted === 1;
      } catch (e) {
        return console.error("Paint request failed:", e), !1;
      }
    },
    async getCharges() {
      try {
        const i = await (await fetch("https://backend.wplace.live/me", {
          credentials: "include"
        })).json();
        return {
          charges: i.charges?.count || 0,
          max: i.charges?.max || 1,
          cooldown: i.charges?.next || l.COOLDOWN_DEFAULT
        };
      } catch (a) {
        return console.error("Failed to get charges:", a), {
          charges: 0,
          max: 1,
          cooldown: l.COOLDOWN_DEFAULT
        };
      }
    }
  }, De = /* @__PURE__ */ new Map();
  function ba(a, i) {
    if (!i || i.length === 0) return 1;
    const n = `${a[0]},${a[1]},${a[2]}|${t.colorMatchingAlgorithm}|${t.enableChromaPenalty ? "c" : "nc"}|${t.chromaPenaltyWeight}`;
    if (De.has(n)) return De.get(n);
    const o = t.customWhiteThreshold || l.WHITE_THRESHOLD;
    if (a[0] >= o && a[1] >= o && a[2] >= o) {
      const d = i.find((w) => w.rgb[0] >= o && w.rgb[1] >= o && w.rgb[2] >= o);
      if (d)
        return De.set(n, d.id), d.id;
    }
    let r = i[0].id, e = 1 / 0;
    if (t.colorMatchingAlgorithm === "legacy")
      for (let d = 0; d < i.length; d++) {
        const w = i[d], [p, u, g] = w.rgb, y = (p + a[0]) / 2, L = p - a[0], A = u - a[1], k = g - a[2], S = Math.sqrt(((512 + y) * L * L >> 8) + 4 * A * A + ((767 - y) * k * k >> 8));
        if (S < e && (e = S, r = w.id, S === 0))
          break;
      }
    else {
      const [d, w, p] = s._lab(a[0], a[1], a[2]), u = Math.sqrt(w * w + p * p), g = t.enableChromaPenalty ? t.chromaPenaltyWeight || 0.15 : 0;
      for (let y = 0; y < i.length; y++) {
        const L = i[y], [A, k, S] = L.rgb, [T, $, D] = s._lab(A, k, S), G = d - T, U = w - $, Q = p - D;
        let O = G * G + U * U + Q * Q;
        if (g > 0 && u > 20) {
          const ce = Math.sqrt($ * $ + D * D);
          if (ce < u) {
            const oe = u - ce;
            O += oe * oe * g;
          }
        }
        if (O < e && (e = O, r = L.id, O === 0))
          break;
      }
    }
    if (De.set(n, r), De.size > 15e3) {
      const d = De.keys().next().value;
      De.delete(d);
    }
    return r;
  }
  async function fa(a, i, n) {
    const o = new Array(a.length * 2), r = new Array(a.length);
    for (let d = 0; d < a.length; d++) {
      const w = a[d];
      o[d * 2] = w.x, o[d * 2 + 1] = w.y, r[d] = w.color;
    }
    return await yt.paintPixelInRegion(i, n, o, r);
  }
  async function vt(a, i, n, o = 10) {
    let r = 0;
    for (; r < o && !t.stopFlag; ) {
      r++;
      const e = await fa(a, i, n);
      if (e === !0)
        return !0;
      if (e === "token_error")
        B("captchaSolving", "warning"), await Ht(), r--;
      else {
        const d = Math.min(1e3 * Math.pow(2, r - 1), 3e4) + Math.random() * 1e3;
        await s.sleep(d);
      }
    }
    return !1;
  }
  async function xa() {
    const { width: a, height: i, pixels: n } = t.imageData, { x: o, y: r } = t.startPosition, { x: e, y: d } = t.region, w = t.customTransparencyThreshold || l.TRANSPARENCY_THRESHOLD, p = (S, T) => {
      const $ = (T * a + S) * 4;
      return !(n[$ + 3] < w || !t.paintWhitePixels && s.isWhitePixel(n[$], n[$ + 1], n[$ + 2]));
    };
    let u = 0, g = 0, y = !1, L = 0;
    const A = Math.max(0, Math.min(t.paintedPixels || 0, a * i));
    for (let S = 0; S < i && !y; S++)
      for (let T = 0; T < a; T++)
        if (p(T, S)) {
          if (L === A) {
            u = S, g = T, y = !0;
            break;
          }
          L++;
        }
    y || (u = i, g = 0);
    let k = null;
    try {
      e: for (let S = u; S < i; S++)
        for (let T = S === u ? g : 0; T < a; T++) {
          if (t.stopFlag) {
            k && k.pixels.length > 0 && await vt(k.pixels, k.regionX, k.regionY), t.lastPosition = { x: T, y: S }, B("paintingPaused", "warning", { x: T, y: S });
            break e;
          }
          if (!p(T, S)) continue;
          const $ = (S * a + T) * 4, D = ba([n[$], n[$ + 1], n[$ + 2]], t.availableColors);
          let G = o + T, U = r + S, Q = e + Math.floor(G / 1e3), O = d + Math.floor(U / 1e3), ce = G % 1e3, oe = U % 1e3;
          if ((!k || k.regionX !== Q || k.regionY !== O) && (k && k.pixels.length > 0 && await vt(k.pixels, k.regionX, k.regionY) && (t.paintedPixels += k.pixels.length, t.currentCharges -= k.pixels.length), k = { regionX: Q, regionY: O, pixels: [] }), k.pixels.push({ x: ce, y: oe, color: D }), k.pixels.length >= Math.floor(t.currentCharges))
            if (await vt(k.pixels, k.regionX, k.regionY))
              t.paintedPixels += k.pixels.length, t.currentCharges -= k.pixels.length, k.pixels = [];
            else {
              t.stopFlag = !0;
              break e;
            }
          for (B("paintingProgress", "default", { painted: t.paintedPixels, total: t.totalPixels }), t.paintedPixels % 50 === 0 && s.saveProgress(), Pe(); t.currentCharges < t.cooldownChargeThreshold && !t.stopFlag; ) {
            const { charges: ge, cooldown: Be } = await yt.getCharges();
            if (t.currentCharges = Math.floor(ge), t.cooldown = Be, t.currentCharges >= t.cooldownChargeThreshold) break;
            B("noChargesThreshold", "warning", { time: s.formatTime(t.cooldown), threshold: t.cooldownChargeThreshold, current: t.currentCharges }), await s.sleep(t.cooldown);
          }
        }
    } finally {
      t.stopFlag ? (B("paintingStopped", "warning"), s.saveProgress()) : (B("paintingComplete", "success", { count: t.paintedPixels }), s.clearProgress(), be.clear()), Pe();
    }
  }
  let Ce = () => {
  }, B = () => {
  }, Pe = () => {
  }, We = () => {
  };
  const wa = () => l.THEMES[l.currentTheme];
  function ya() {
    try {
      localStorage.setItem("wplace-theme", l.currentTheme);
    } catch (a) {
      console.warn("Could not save theme preference:", a);
    }
  }
  function va() {
    try {
      const a = localStorage.getItem("wplace-theme");
      a && l.THEMES[a] && (l.currentTheme = a);
    } catch (a) {
      console.warn("Could not load theme preference:", a);
    }
  }
  function ka() {
    try {
      const a = localStorage.getItem("wplace_language");
      a && ht[a] && (t.language = a);
    } catch (a) {
      console.warn("Could not load language preference:", a);
    }
  }
  const Sa = (a) => {
    if (l.THEMES[a]) {
      l.currentTheme = a, ya();
      const i = document.querySelector('style[data-wplace-theme="true"]');
      i && i.remove(), kt();
    }
  };
  async function kt() {
    await s.detectLanguage();
    const a = document.getElementById("wplace-image-bot-container"), i = document.getElementById("wplace-stats-container"), n = document.getElementById("wplace-settings-container"), o = document.querySelector(".resize-container"), r = document.querySelector(".resize-overlay");
    a && a.remove(), i && i.remove(), n && n.remove(), o && o.remove(), r && r.remove(), va(), ka();
    const e = wa(), d = document.createElement("link");
    if (d.rel = "stylesheet", d.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css", document.head.appendChild(d), e.fontFamily.includes("Press Start 2P")) {
      const h = document.createElement("link");
      h.rel = "stylesheet", h.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap", document.head.appendChild(h);
    }
    const w = document.createElement("style");
    w.setAttribute("data-wplace-theme", "true"), w.textContent = `
      ${e.animations.glow ? `
      @keyframes neonGlow {
        0%, 100% {
          text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
        }
        50% {
          text-shadow: 0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor;
        }
      }` : ""}

      ${e.animations.pixelBlink ? `
      @keyframes pixelBlink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.7; }
      }` : ""}

      ${e.animations.scanline ? `
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(400px); }
      }` : ""}

      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
      }
      @keyframes slideIn {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      #wplace-image-bot-container {
        position: fixed;
        top: 20px;
        left: 20px;
        width: ${l.currentTheme === "Neon Retro", "280px"};
        max-height: calc(100vh - 40px);
        background: ${l.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${e.primary} 0%, #1a1a1a 100%)` : e.primary};
        border: ${e.borderWidth} ${e.borderStyle} ${l.currentTheme === "Classic Autobot" ? e.accent : e.text};
        border-radius: ${e.borderRadius};
        padding: 0;
        box-shadow: ${e.boxShadow};
        z-index: 9998;
        font-family: ${e.fontFamily};
        color: ${e.text};
        animation: slideIn 0.4s ease-out;
        overflow-y: auto; /* Allow scrolling for main panel */
        overflow-x: hidden;
        ${e.backdropFilter ? `backdrop-filter: ${e.backdropFilter};` : ""}
        transition: all 0.3s ease;
        user-select: none;
        ${l.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }

      ${e.animations.scanline ? `
      #wplace-image-bot-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, ${e.neon}, transparent);
        animation: scanline 3s linear infinite;
        z-index: 1;
        pointer-events: none;
      }` : ""}

      ${l.currentTheme === "Neon Retro" ? `
      #wplace-image-bot-container::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 65, 0.03) 2px,
            rgba(0, 255, 65, 0.03) 4px
          );
        pointer-events: none;
        z-index: 1;
      }` : ""}

      #wplace-image-bot-container.wplace-dragging {
        transition: none;
        box-shadow: 0 12px 40px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.2);
        transform: scale(1.02);
        z-index: 9999;
      }
      #wplace-image-bot-container.wplace-minimized {
        width: 200px;
        height: auto;
        overflow: hidden;
      }
      #wplace-image-bot-container.wplace-compact {
        width: 240px;
      }

      /* Stats Container */
      #wplace-stats-container {
        position: fixed;
        top: 20px;
        left: 330px;
        width: ${l.currentTheme === "Neon Retro", "280px"};
        max-height: calc(100vh - 40px);
        background: ${l.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${e.primary} 0%, #1a1a1a 100%)` : e.primary};
        border: ${e.borderWidth} ${e.borderStyle} ${l.currentTheme === "Classic Autobot" ? e.accent : e.text};
        border-radius: ${e.borderRadius};
        padding: 0;
        box-shadow: ${e.boxShadow};
        z-index: 9997;
        font-family: ${e.fontFamily};
        color: ${e.text};
        animation: slideIn 0.4s ease-out;
        overflow-y: auto; /* Make stats panel scrollable */
        ${e.backdropFilter ? `backdrop-filter: ${e.backdropFilter};` : ""}
        transition: all 0.3s ease;
        user-select: none;
        ${l.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }

      /* FIX: Disable transition during drag to prevent lag */
      #wplace-stats-container.wplace-dragging {
        transition: none;
      }

      .wplace-header {
        padding: ${l.currentTheme === "Neon Retro", "8px 12px"};
        background: ${l.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${e.secondary} 0%, #2a2a2a 100%)` : e.secondary};
        color: ${e.highlight};
        font-size: ${l.currentTheme === "Neon Retro" ? "11px" : "13px"};
        font-weight: ${l.currentTheme === "Neon Retro" ? "normal" : "700"};
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        user-select: none;
        border-bottom: ${l.currentTheme === "Neon Retro" ? "2px" : "1px"} solid ${l.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.1)" : e.text};
        ${l.currentTheme === "Classic Autobot" ? "text-shadow: 0 1px 2px rgba(0,0,0,0.5);" : "text-transform: uppercase; letter-spacing: 1px;"}
        transition: background 0.2s ease;
        position: relative;
        z-index: 2;
        ${e.animations.glow ? "animation: neonGlow 2s ease-in-out infinite alternate;" : ""}
      }

      .wplace-header-title {
        display: flex;
        align-items: center;
        gap: ${l.currentTheme === "Neon Retro", "6px"};
      }

      .wplace-header-controls {
        display: flex;
        gap: ${l.currentTheme === "Neon Retro", "6px"};
      }

      .wplace-header-btn {
        background: ${l.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.1)" : e.accent};
        border: ${l.currentTheme === "Neon Retro" ? `2px solid ${e.text}` : "none"};
        color: ${e.text};
        cursor: pointer;
        border-radius: ${l.currentTheme === "Classic Autobot" ? "4px" : "0"};
        width: ${l.currentTheme === "Classic Autobot" ? "18px" : "auto"};
        height: ${l.currentTheme === "Classic Autobot" ? "18px" : "auto"};
        padding: ${l.currentTheme === "Neon Retro" ? "4px 6px" : "0"};
        font-size: ${l.currentTheme === "Neon Retro" ? "8px" : "10px"};
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        font-family: ${e.fontFamily};
        ${l.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }
      .wplace-header-btn:hover {
        background: ${l.currentTheme === "Classic Autobot" ? e.accent : e.text};
        color: ${l.currentTheme === "Classic Autobot" ? e.text : e.primary};
        transform: ${l.currentTheme === "Classic Autobot" ? "scale(1.1)" : "none"};
        ${l.currentTheme === "Neon Retro" ? `box-shadow: 0 0 10px ${e.text};` : ""}
      }

      .wplace-content {
        padding: ${l.currentTheme === "Neon Retro", "12px"};
        display: block;
        position: relative;
        z-index: 2;
      }
      .wplace-content.wplace-hidden {
        display: none;
      }

      .wplace-status-section {
        margin-bottom: 12px;
        padding: 8px;
        background: rgba(255,255,255,0.03);
        border-radius: ${e.borderRadius};
        border: 1px solid rgba(255,255,255,0.1);
      }

      .wplace-section {
        margin-bottom: ${l.currentTheme === "Neon Retro", "12px"};
        padding: 12px;
        background: rgba(255,255,255,0.03);
        border-radius: ${e.borderRadius};
        border: 1px solid rgba(255,255,255,0.1);
      }

      .wplace-section-title {
        font-size: 11px;
        font-weight: 600;
        margin-bottom: 8px;
        color: ${e.highlight};
        display: flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .wplace-controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .wplace-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .wplace-row.single {
        grid-template-columns: 1fr;
      }

      .wplace-btn {
        padding: ${l.currentTheme === "Neon Retro" ? "12px 8px" : "8px 12px"};
        border: ${l.currentTheme === "Neon Retro" ? "2px solid" : "none"};
        border-radius: ${e.borderRadius};
        font-weight: ${l.currentTheme === "Neon Retro" ? "normal" : "500"};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: ${l.currentTheme === "Neon Retro" ? "8px" : "6px"};
        font-size: ${l.currentTheme === "Neon Retro" ? "8px" : "11px"};
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        font-family: ${e.fontFamily};
        ${l.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px; image-rendering: pixelated;" : ""}
        background: ${l.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${e.accent} 0%, #4a4a4a 100%)` : e.accent};
        ${l.currentTheme === "Classic Autobot" ? "border: 1px solid rgba(255,255,255,0.1);" : ""}
      }

      ${l.currentTheme === "Classic Autobot" ? `
      .wplace-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        transition: left 0.5s ease;
      }
      .wplace-btn:hover:not(:disabled)::before {
        left: 100%;
      }` : `
      .wplace-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }
      .wplace-btn:hover::before {
        left: 100%;
      }`}

      .wplace-btn:hover:not(:disabled) {
        transform: ${l.currentTheme === "Classic Autobot" ? "translateY(-1px)" : "none"};
        box-shadow: ${l.currentTheme === "Classic Autobot" ? "0 4px 12px rgba(0,0,0,0.4)" : "0 0 15px currentColor"};
        ${e.animations.pixelBlink ? "animation: pixelBlink 0.5s infinite;" : ""}
      }
      .wplace-btn:active:not(:disabled) {
        transform: translateY(0);
      }

      .wplace-btn-primary {
        background: ${l.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${e.accent} 0%, #6a5acd 100%)` : e.accent};
        color: ${e.text};
        ${l.currentTheme === "Neon Retro" ? `border-color: ${e.text};` : ""}
      }
      .wplace-btn-upload {
        background: ${l.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${e.secondary} 0%, #4a4a4a 100%)` : e.purple};
        color: ${e.text};
        ${l.currentTheme === "Classic Autobot" ? `border: 1px dashed ${e.highlight};` : `border-color: ${e.text}; border-style: dashed;`}
      }
      .wplace-btn-start {
        background: ${l.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${e.success} 0%, #228b22 100%)` : e.success};
        color: ${l.currentTheme === "Classic Autobot" ? "white" : e.primary};
        ${l.currentTheme === "Neon Retro" ? `border-color: ${e.success};` : ""}
      }
      .wplace-btn-stop {
        background: ${l.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${e.error} 0%, #dc143c 100%)` : e.error};
        color: ${l.currentTheme === "Classic Autobot" ? "white" : e.text};
        ${l.currentTheme === "Neon Retro" ? `border-color: ${e.error};` : ""}
      }
      .wplace-btn-select {
        background: ${l.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${e.highlight} 0%, #9370db 100%)` : e.highlight};
        color: ${l.currentTheme === "Classic Autobot" ? "white" : e.primary};
        ${l.currentTheme === "Neon Retro" ? `border-color: ${e.highlight};` : ""}
      }
      .wplace-btn-file {
        background: ${l.currentTheme === "Classic Autobot" ? "linear-gradient(135deg, #ff8c00 0%, #ff7f50 100%)" : e.warning};
        color: ${l.currentTheme === "Classic Autobot" ? "white" : e.primary};
        ${l.currentTheme === "Neon Retro" ? `border-color: ${e.warning};` : ""}
      }
      .wplace-btn:disabled {
        opacity: ${l.currentTheme === "Classic Autobot" ? "0.5" : "0.3"};
        cursor: not-allowed;
        transform: none !important;
        ${e.animations.pixelBlink ? "animation: none !important;" : ""}
        box-shadow: none !important;
      }
      .wplace-btn:disabled::before {
        display: none;
      }

      .wplace-btn-overlay.active {
        background: linear-gradient(135deg, #29b6f6 0%, #8e2de2 100%);
        box-shadow: 0 0 15px #8e2de2;
      }

      .wplace-stats {
        background: ${l.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.03)" : e.secondary};
        padding: ${l.currentTheme === "Neon Retro" ? "12px" : "8px"};
        border: ${l.currentTheme === "Neon Retro" ? `2px solid ${e.text}` : "1px solid rgba(255,255,255,0.1)"};
        border-radius: ${e.borderRadius};
        margin-bottom: ${l.currentTheme === "Neon Retro" ? "15px" : "8px"};
        ${l.currentTheme === "Neon Retro" ? "box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.1);" : ""}
      }

      .wplace-stat-item {
        display: flex;
        justify-content: space-between;
        padding: ${l.currentTheme === "Neon Retro" ? "6px 0" : "4px 0"};
        font-size: ${l.currentTheme === "Neon Retro" ? "8px" : "11px"};
        border-bottom: 1px solid rgba(255,255,255,0.05);
        ${l.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px;" : ""}
      }
      .wplace-stat-item:last-child {
        border-bottom: none;
      }
      .wplace-stat-label {
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0.9;
        font-size: ${l.currentTheme === "Neon Retro" ? "8px" : "10px"};
      }
      .wplace-stat-value {
        font-weight: 600;
        color: ${e.highlight};
      }

      .wplace-colors-section {
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px solid rgba(255,255,255,0.05);
      }

      .wplace-stat-colors-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(16px, 1fr));
        gap: 4px;
        margin-top: 8px;
        padding: 4px;
        background: rgba(0,0,0,0.2);
        border-radius: 4px;
        max-height: 80px; /* Limit height and allow scrolling */
        overflow-y: auto;
      }

      .wplace-stat-color-swatch {
        width: 16px;
        height: 16px;
        border-radius: 3px;
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
      }

      .wplace-progress {
        width: 100%;
        background: ${l.currentTheme === "Classic Autobot" ? "rgba(0,0,0,0.3)" : e.secondary};
        border: ${l.currentTheme === "Neon Retro" ? `2px solid ${e.text}` : "1px solid rgba(255,255,255,0.1)"};
        border-radius: ${e.borderRadius};
        margin: ${l.currentTheme === "Neon Retro" ? "10px 0" : "8px 0"};
        overflow: hidden;
        height: ${l.currentTheme === "Neon Retro" ? "16px" : "6px"};
        position: relative;
      }

      ${l.currentTheme === "Neon Retro" ? `
      .wplace-progress::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 65, 0.1) 2px,
            rgba(0, 255, 65, 0.1) 4px
          );
        pointer-events: none;
      }` : ""}

      .wplace-progress-bar {
        height: ${l.currentTheme === "Neon Retro" ? "100%" : "6px"};
        background: ${l.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${e.highlight} 0%, #9370db 100%)` : `linear-gradient(90deg, ${e.success}, ${e.neon})`};
        transition: width ${l.currentTheme === "Neon Retro" ? "0.3s" : "0.5s"} ease;
        position: relative;
        ${l.currentTheme === "Neon Retro" ? `box-shadow: 0 0 10px ${e.success};` : ""}
      }

      ${l.currentTheme === "Classic Autobot" ? `
      .wplace-progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: shimmer 2s infinite;
      }` : `
      .wplace-progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 4px;
        height: 100%;
        background: ${e.text};
        animation: pixelBlink 1s infinite;
      }`}

      .wplace-status {
        padding: ${l.currentTheme === "Neon Retro" ? "10px" : "6px"};
        border: ${l.currentTheme === "Neon Retro" ? "2px solid" : "1px solid"};
        border-radius: ${e.borderRadius};
        text-align: center;
        font-size: ${l.currentTheme === "Neon Retro" ? "8px" : "11px"};
        ${l.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px;" : ""}
        position: relative;
        overflow: hidden;
      }

      .status-default {
        background: ${l.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.1)" : e.accent};
        border-color: ${e.text};
        color: ${e.text};
      }
      .status-success {
        background: ${l.currentTheme === "Classic Autobot" ? "rgba(0, 255, 0, 0.1)" : e.success};
        border-color: ${e.success};
        color: ${l.currentTheme === "Classic Autobot" ? e.success : e.primary};
        box-shadow: 0 0 15px ${e.success};
      }
      .status-error {
        background: ${l.currentTheme === "Classic Autobot" ? "rgba(255, 0, 0, 0.1)" : e.error};
        border-color: ${e.error};
        color: ${l.currentTheme === "Classic Autobot" ? e.error : e.text};
        box-shadow: 0 0 15px ${e.error};
        ${e.animations.pixelBlink ? "animation: pixelBlink 0.5s infinite;" : ""}
      }
      .status-warning {
        background: ${l.currentTheme === "Classic Autobot" ? "rgba(255, 165, 0, 0.1)" : e.warning};
        border-color: ${e.warning};
        color: ${l.currentTheme === "Classic Autobot" ? "orange" : e.primary};
        box-shadow: 0 0 15px ${e.warning};
      }

      .resize-container {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${e.primary};
        padding: 20px;
        border: ${e.borderWidth} ${e.borderStyle} ${e.text};
        border-radius: ${e.borderRadius};
        z-index: 10000;
        box-shadow: ${l.currentTheme === "Classic Autobot" ? "0 0 20px rgba(0,0,0,0.5)" : "0 0 30px rgba(0, 255, 65, 0.5)"};
        width: 90%;
        max-width: 700px;
        max-height: 90%;
        overflow: auto;
        font-family: ${e.fontFamily};
      }

      .resize-preview-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid ${e.accent};
        background: rgba(0,0,0,0.2);
        margin: 15px 0;
        height: 300px;
        overflow: hidden;
      }

  .resize-canvas-stack { position: relative; transform-origin: center center; display: inline-block; }
      .resize-base-canvas, .resize-mask-canvas {
        position: absolute; left: 0; top: 0;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
      }
      .resize-mask-canvas { pointer-events: auto; }
      .resize-tools { display:flex; gap:8px; align-items:center; margin-top:8px; font-size:12px; }
      .resize-tools button { padding:6px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color:#fff; cursor:pointer; }
      .wplace-btn.active,
      .wplace-btn[aria-pressed="true"] {
        background: ${e.highlight} !important;
        color: ${e.primary} !important;
        border-color: ${e.text} !important;
        box-shadow: 0 0 8px rgba(0,0,0,0.25) inset, 0 0 6px rgba(0,0,0,0.2) !important;
      }
      .wplace-btn.active i,
      .wplace-btn[aria-pressed="true"] i { filter: drop-shadow(0 0 3px ${e.primary}); }
      .mask-mode-group .wplace-btn.active,
      .mask-mode-group .wplace-btn[aria-pressed="true"] {
        background: ${e.highlight};
        color: ${e.primary};
        border-color: ${e.text};
        box-shadow: 0 0 8px rgba(0,0,0,0.25) inset, 0 0 6px rgba(0,0,0,0.2);
      }

      .resize-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        align-items: center;
      }

      .resize-controls label {
        font-size: ${l.currentTheme === "Neon Retro" ? "8px" : "12px"};
        ${l.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px;" : ""}
        color: ${e.text};
      }

      .resize-slider {
        width: 100%;
        height: ${l.currentTheme === "Neon Retro" ? "8px" : "4px"};
        background: ${l.currentTheme === "Classic Autobot" ? "#ccc" : e.secondary};
        border: ${l.currentTheme === "Neon Retro" ? `2px solid ${e.text}` : "none"};
        border-radius: ${e.borderRadius};
        outline: none;
        -webkit-appearance: none;
      }

      ${l.currentTheme === "Neon Retro" ? `
      .resize-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        background: ${e.highlight};
        border: 2px solid ${e.text};
        border-radius: 0;
        cursor: pointer;
        box-shadow: 0 0 5px ${e.highlight};
      }

      .resize-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: ${e.highlight};
        border: 2px solid ${e.text};
        border-radius: 0;
        cursor: pointer;
        box-shadow: 0 0 5px ${e.highlight};
      }` : ""}

      .resize-zoom-controls {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 15px;
      }

      .resize-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
      }

      .resize-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: none;
      }
      .wplace-color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 10px;
        padding-top: 8px;
        max-height: 300px;
        overflow-y: auto;
      }
      .wplace-color-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .wplace-color-item-name {
        font-size: 9px;
        color: #ccc;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
      .wplace-color-swatch {
        width: 22px;
        height: 22px;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.1s ease, box-shadow 0.2s ease;
        position: relative;
        margin: 0 auto;
      }
      .wplace-color-swatch.unavailable {
        border-color: #666;
        border-style: dashed;
        cursor: not-allowed;
      }
      .wplace-color-swatch:hover {
        transform: scale(1.1);
        z-index: 1;
      }
      .wplace-color-swatch:not(.active) {
        opacity: 0.3;
        filter: grayscale(80%);
      }
      .wplace-color-swatch.unavailable:not(.active) {
        opacity: 0.2;
        filter: grayscale(90%);
      }
      .wplace-color-swatch.active::after {
        content: '✔';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
        text-shadow: 0 0 3px black;
      }
      .wplace-color-divider {
        border: none;
        height: 1px;
        background: rgba(255,255,255,0.1);
        margin: 8px 0;
      }

        .wplace-cooldown-control {
            margin-top: 8px;
        }
        .wplace-cooldown-control label {
            font-size: 11px;
            margin-bottom: 4px;
            display: block;
        }
        .wplace-slider-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .wplace-slider {
            flex: 1;
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            background: #444;
            border-radius: 2px;
            outline: none;
        }
        .wplace-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 14px;
            height: 14px;
            background: ${e.highlight};
            border-radius: 50%;
            cursor: pointer;
        }


      ${l.currentTheme === "Neon Retro" ? `
      input[type="checkbox"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border: 2px solid ${e.text};
        background: ${e.secondary};
        margin-right: 8px;
        position: relative;
        cursor: pointer;
      }

      input[type="checkbox"]:checked {
        background: ${e.success};
      }

      input[type="checkbox"]:checked::after {
        content: '✓';
        position: absolute;
        top: -2px;
        left: 1px;
        color: ${e.primary};
        font-size: 12px;
        font-weight: bold;
      }

      .fas, .fa {
        filter: drop-shadow(0 0 3px currentColor);
      }

      .wplace-speed-control {
        margin-top: 12px;
        padding: 12px;
        background: ${e.secondary};
        border: ${e.borderWidth} ${e.borderStyle} ${e.accent};
        border-radius: ${e.borderRadius};
        backdrop-filter: ${e.backdropFilter};
      }

      .wplace-speed-label {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        color: ${e.text};
        font-size: 13px;
        font-weight: 600;
      }

      .wplace-speed-label i {
        margin-right: 6px;
        color: ${e.highlight};
      }

      .wplace-speed-slider-container {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .wplace-speed-slider {
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: ${e.primary};
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }

      .wplace-speed-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${e.highlight};
        cursor: pointer;
        border: 2px solid ${e.text};
        box-shadow: ${e.boxShadow};
      }

      .wplace-speed-slider::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${e.highlight};
        cursor: pointer;
        border: 2px solid ${e.text};
        box-shadow: ${e.boxShadow};
      }

      .wplace-speed-display {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 90px;
        justify-content: flex-end;
      }

      #speedValue {
        color: ${e.highlight};
        font-weight: 600;
        font-size: 14px;
      }

      .wplace-speed-unit {
        color: ${e.text};
        font-size: 11px;
        opacity: 0.8;
      }

      #wplace-settings-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10001;
        min-width: 400px;
        max-width: 500px;
        background: ${e.primary};
        border: ${e.borderWidth} ${e.borderStyle} ${e.accent};
        border-radius: ${e.borderRadius};
        box-shadow: ${e.boxShadow};
        backdrop-filter: ${e.backdropFilter};
      }

      .wplace-settings {
        padding: 16px;
        max-height: 400px;
        overflow-y: auto;
      }

      .wplace-setting-section {
        margin-bottom: 20px;
        padding: 12px;
        background: ${e.secondary};
        border: ${e.borderWidth} ${e.borderStyle} ${e.accent};
        border-radius: ${e.borderRadius};
      }

      .wplace-setting-title {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        color: ${e.text};
        font-size: 14px;
        font-weight: 600;
      }

      .wplace-setting-title i {
        margin-right: 8px;
        color: ${e.highlight};
      }

      .wplace-setting-content {
        color: ${e.text};
      }

      .wplace-section {
        margin-bottom: 20px;
        padding: 15px;
        background: ${e.secondary};
        border: ${e.borderWidth} ${e.borderStyle} ${e.accent};
        border-radius: ${e.borderRadius};
      }

      .wplace-section-title {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        color: ${e.text};
        font-size: 14px;
        font-weight: 600;
      }

      .wplace-section-title i {
        margin-right: 8px;
        color: ${e.highlight};
      }

      .wplace-speed-container {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
      }

      .wplace-slider {
        flex: 1;
        height: 6px;
        background: ${e.accent};
        border-radius: 3px;
        outline: none;
        -webkit-appearance: none;
      }

      .wplace-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        background: ${e.highlight};
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid ${e.primary};
      }

      .wplace-speed-display {
        background: ${e.accent};
        padding: 5px 10px;
        border-radius: 4px;
        color: ${e.text};
        font-weight: 600;
        min-width: 80px;
        text-align: center;
        border: ${e.borderWidth} ${e.borderStyle} ${e.highlight};
      }

      .wplace-select {
        width: 100%;
        padding: 8px 12px;
        background: ${e.secondary};
        border: ${e.borderWidth} ${e.borderStyle} ${e.accent};
        border-radius: ${e.borderRadius};
        color: ${e.text};
        font-size: 14px;
        margin-bottom: 10px;
      }

      .wplace-select:focus {
        outline: none;
        border-color: ${e.highlight};
      }

      .wplace-description {
        color: ${e.text};
        font-size: 12px;
        opacity: 0.8;
        line-height: 1.4;
      }

      .wplace-theme-custom {
        margin-top: 15px;
        padding: 15px;
        background: ${e.accent};
        border-radius: ${e.borderRadius};
        border: ${e.borderWidth} ${e.borderStyle} ${e.highlight};
      }

      .wplace-custom-group {
        margin-bottom: 15px;
      }

      .wplace-custom-label {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        color: ${e.text};
        font-size: 13px;
        font-weight: 600;
      }

      .wplace-custom-label i {
        margin-right: 8px;
        color: ${e.highlight};
        width: 16px;
      }

      .wplace-color-input-group {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .wplace-color-input {
        width: 50px;
        height: 30px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: transparent;
      }

      .wplace-color-text {
        flex: 1;
        padding: 6px 10px;
        background: ${e.secondary};
        border: ${e.borderWidth} ${e.borderStyle} ${e.accent};
        border-radius: 4px;
        color: ${e.text};
        font-size: 12px;
        font-family: monospace;
      }

      .wplace-animation-controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .wplace-checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: ${e.text};
        font-size: 12px;
        cursor: pointer;
      }

      .wplace-checkbox-label input[type="checkbox"] {
        accent-color: ${e.highlight};
      }

      .wplace-slider-container {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .wplace-slider-container .wplace-slider {
        flex: 1;
      }

      .wplace-slider-container span {
        color: ${e.text};
        font-size: 12px;
        font-weight: 600;
        min-width: 40px;
      }

      .wplace-custom-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        border-top: 1px solid ${e.accent};
        padding-top: 15px;
      }

      .wplace-btn-secondary {
        background: ${e.accent};
        color: ${e.text};
        border: ${e.borderWidth} ${e.borderStyle} ${e.highlight};
      }

      .wplace-btn-secondary:hover {
        background: ${e.secondary};
      }` : ""}
    `, document.head.appendChild(w);
    const p = document.createElement("div");
    p.id = "wplace-image-bot-container", p.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-image"></i>
          <span>${s.t("title")}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="settingsBtn" class="wplace-header-btn" title="${s.t("settings")}">
            <i class="fas fa-cog"></i>
          </button>
          <button id="statsBtn" class="wplace-header-btn" title="Show Stats">
            <i class="fas fa-chart-bar"></i>
          </button>
          <button id="compactBtn" class="wplace-header-btn" title="Compact Mode">
            <i class="fas fa-compress"></i>
          </button>
          <button id="minimizeBtn" class="wplace-header-btn" title="${s.t("minimize")}">
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <!-- Status Section - Always visible -->
        <div class="wplace-status-section">
          <div id="statusText" class="wplace-status status-default">
            ${s.t("initMessage")}
          </div>
          <div class="wplace-progress">
            <div id="progressBar" class="wplace-progress-bar" style="width: 0%"></div>
          </div>
        </div>

        <!-- Image Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">🖼️ Image Management</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="uploadBtn" class="wplace-btn wplace-btn-upload">
                <i class="fas fa-upload"></i>
                <span>${s.t("uploadImage")}</span>
              </button>
              <button id="resizeBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-expand"></i>
                <span>${s.t("resizeImage")}</span>
              </button>
            </div>
            <div class="wplace-row single">
              <button id="selectPosBtn" class="wplace-btn wplace-btn-select" disabled>
                <i class="fas fa-crosshairs"></i>
                <span>${s.t("selectPosition")}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Control Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">🎮 Painting Control</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="startBtn" class="wplace-btn wplace-btn-start" disabled>
                <i class="fas fa-play"></i>
                <span>${s.t("startPainting")}</span>
              </button>
              <button id="stopBtn" class="wplace-btn wplace-btn-stop" disabled>
                <i class="fas fa-stop"></i>
                <span>${s.t("stopPainting")}</span>
              </button>
            </div>
            <div class="wplace-row single">
                <button id="toggleOverlayBtn" class="wplace-btn wplace-btn-overlay" disabled>
                    <i class="fas fa-eye"></i>
                    <span>${s.t("toggleOverlay")}</span>
                </button>
            </div>
          </div>
        </div>

        <!-- Cooldown Section -->
        <div class="wplace-section">
            <div class="wplace-section-title">⏱️ ${s.t("cooldownSettings")}</div>
            <div class="wplace-cooldown-control">
                <label id="cooldownLabel">${s.t("waitCharges")}:</label>
                <div class="wplace-slider-container">
                    <input type="range" id="cooldownSlider" class="wplace-slider" min="1" max="1" value="${t.cooldownChargeThreshold}">
                    <span id="cooldownValue" style="font-weight:bold; min-width: 20px; text-align: center;">${t.cooldownChargeThreshold}</span>
                </div>
            </div>
        </div>

        <!-- Data Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">💾 Data Management</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="saveBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-save"></i>
                <span>${s.t("saveData")}</span>
              </button>
              <button id="loadBtn" class="wplace-btn wplace-btn-primary">
                <i class="fas fa-folder-open"></i>
                <span>${s.t("loadData")}</span>
              </button>
            </div>
            <div class="wplace-row">
              <button id="saveToFileBtn" class="wplace-btn wplace-btn-file" disabled>
                <i class="fas fa-download"></i>
                <span>${s.t("saveToFile")}</span>
              </button>
              <button id="loadFromFileBtn" class="wplace-btn wplace-btn-file">
                <i class="fas fa-upload"></i>
                <span>${s.t("loadFromFile")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    const u = document.createElement("div");
    u.id = "wplace-stats-container", u.style.display = "none", u.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-chart-bar"></i>
          <span>Painting Stats</span>
        </div>
        <div class="wplace-header-controls">
          <button id="refreshChargesBtn" class="wplace-header-btn" title="Refresh Charges">
            <i class="fas fa-sync"></i>
          </button>
          <button id="closeStatsBtn" class="wplace-header-btn" title="Close Stats">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <div class="wplace-stats">
          <div id="statsArea">
            <div class="wplace-stat-item">
              <div class="wplace-stat-label"><i class="fas fa-info-circle"></i> ${s.t("initMessage")}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    const g = document.createElement("div");
    g.id = "wplace-settings-container", g.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 16px;
      padding: 0;
      z-index: 10002;
      display: none;
      min-width: 420px;
      max-width: 480px;
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      overflow: hidden;
      animation: settingsSlideIn 0.4s ease-out;
    `, g.innerHTML = `
      <div class="wplace-settings-header" style="background: rgba(255,255,255,0.1); padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: move;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: white; font-size: 20px; font-weight: 300; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-cog" style="font-size: 18px; animation: spin 2s linear infinite;"></i>
            ${s.t("settings")}
          </h3>
          <button id="closeSettingsBtn" style="
            background: rgba(255,255,255,0.1);
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 14px;
            font-weight: 300;
          " onmouseover="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='scale(1)'">✕</button>
        </div>
      </div>

      <div style="padding: 25px; max-height: 70vh; overflow-y: auto;">

        <!-- Automation Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-robot" style="color: #4facfe; font-size: 16px;"></i>
            ${s.t("automation")}
          </label>
          <!-- Turnstile generator is always enabled - no toggle needed -->

        </div>

        <!-- Overlay Settings Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-eye" style="color: #48dbfb; font-size: 16px;"></i>
            Overlay Settings
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
              <!-- Opacity Slider -->
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                   <span style="font-weight: 500; font-size: 13px;">Overlay Opacity</span>
                   <div id="overlayOpacityValue" style="min-width: 40px; text-align: center; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 6px; font-size: 12px;">${Math.round(t.overlayOpacity * 100)}%</div>
                </div>
                <input type="range" id="overlayOpacitySlider" min="0.1" max="1" step="0.05" value="${t.overlayOpacity}" style="width: 100%; -webkit-appearance: none; height: 8px; background: linear-gradient(to right, #48dbfb 0%, #d3a4ff 100%); border-radius: 4px; outline: none; cursor: pointer;">
              </div>
              <!-- Blue Marble Toggle -->
              <label for="enableBlueMarbleToggle" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                  <div>
                      <span style="font-weight: 500;">Blue Marble Effect</span>
                      <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 4px 0 0 0;">Renders a dithered "shredded" overlay.</p>
                  </div>
                  <input type="checkbox" id="enableBlueMarbleToggle" ${t.blueMarbleEnabled ? "checked" : ""} style="cursor: pointer; width: 20px; height: 20px;"/>
              </label>
          </div>
        </div>

        <!-- Speed Control Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-tachometer-alt" style="color: #4facfe; font-size: 16px;"></i>
            ${s.t("paintingSpeed")}
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
              <input type="range" id="speedSlider" min="${l.PAINTING_SPEED.MIN}" max="${l.PAINTING_SPEED.MAX}" value="${l.PAINTING_SPEED.DEFAULT}"
                style="
                  flex: 1;
                  height: 8px;
                  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                  border-radius: 4px;
                  outline: none;
                  -webkit-appearance: none;
                  cursor: pointer;
                ">
              <div id="speedValue" style="
                min-width: 70px;
                text-align: center;
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                padding: 8px 12px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                font-size: 13px;
                box-shadow: 0 3px 10px rgba(79, 172, 254, 0.3);
                border: 1px solid rgba(255,255,255,0.2);
              ">${l.PAINTING_SPEED.DEFAULT} px/s</div>
            </div>
            <div style="display: flex; justify-content: space-between; color: rgba(255,255,255,0.7); font-size: 11px; margin-top: 8px;">
              <span><i class="fas fa-turtle"></i> ${l.PAINTING_SPEED.MIN}</span>
              <span><i class="fas fa-rabbit"></i> ${l.PAINTING_SPEED.MAX}</span>
            </div>
          </div>
           <label style="display: flex; align-items: center; gap: 8px; color: white; margin-top: 10px;">
            <input type="checkbox" id="enableSpeedToggle"  style="cursor: pointer;"/>
            <span>Enable painting speed limit</span>
          </label>
        </div>


        <!-- Theme Selection Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-palette" style="color: #f093fb; font-size: 16px;"></i>
            ${s.t("themeSettings")}
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
            <select id="themeSelect" style="
              width: 100%;
              padding: 12px 16px;
              background: rgba(255,255,255,0.15);
              color: white;
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 8px;
              font-size: 14px;
              outline: none;
              cursor: pointer;
              transition: all 0.3s ease;
              font-family: inherit;
              box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            ">
              ${Object.keys(l.THEMES).map(
      (h) => `<option value="${h}" ${l.currentTheme === h ? "selected" : ""} style="background: #2d3748; color: white; padding: 10px;">${h}</option>`
    ).join("")}
            </select>
          </div>
        </div>

        <!-- Language Selection Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-globe" style="color: #ffeaa7; font-size: 16px;"></i>
            ${s.t("language")}
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
            <select id="languageSelect" style="
              width: 100%;
              padding: 12px 16px;
              background: rgba(255,255,255,0.15);
              color: white;
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 8px;
              font-size: 14px;
              outline: none;
              cursor: pointer;
              transition: all 0.3s ease;
              font-family: inherit;
              box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            ">
              <option value="vi" ${t.language === "vi" ? "selected" : ""} style="background: #2d3748; color: white;">🇻🇳 Tiếng Việt</option>
              <option value="id" ${t.language === "id" ? "selected" : ""} style="background: #2d3748; color: white;">🇮🇩 Bahasa Indonesia</option>
              <option value="ru" ${t.language === "ru" ? "selected" : ""} style="background: #2d3748; color: white;">🇷🇺 Русский</option>
              <option value="en" ${t.language === "en" ? "selected" : ""} style="background: #2d3748; color: white;">🇺🇸 English</option>
              <option value="pt" ${t.language === "pt" ? "selected" : ""} style="background: #2d3748; color: white;">🇧🇷 Português</option>
              <option value="fr" ${t.language === "fr" ? "selected" : ""} style="background: #2d3748; color: white;">🇫🇷 Français</option>
              <option value="tr" ${t.language === "tr" ? "selected" : ""} style="background: #2d3748; color: white;">🇹🇷 Türkçe</option>
              <option value="zh" ${t.language === "zh" ? "selected" : ""} style="background: #2d3748; color: white;">🇨🇳 简体中文</option>
              <option value="ja" ${t.language === "ja" ? "selected" : ""} style="background: #2d3748; color: white;">🇯🇵 日本語</option>
              <option value="ko" ${t.language === "ko" ? "selected" : ""} style="background: #2d3748; color: white;">🇰🇷 한국어</option>
              </select>
          </div>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 10px;">
             <button id="applySettingsBtn" style="
                width: 100%;
                ${l.CSS_CLASSES.BUTTON_PRIMARY}
             ">
                 <i class="fas fa-check"></i> ${s.t("applySettings")}
             </button>
        </div>

      </div>

      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes settingsSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes settingsFadeOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
        }

        #speedSlider::-webkit-slider-thumb, #overlayOpacitySlider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        #speedSlider::-webkit-slider-thumb:hover, #overlayOpacitySlider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 0 3px #4facfe;
        }

        #speedSlider::-moz-range-thumb, #overlayOpacitySlider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        #themeSelect:hover, #languageSelect:hover {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.2);
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }

        #themeSelect:focus, #languageSelect:focus {
          border-color: #4facfe;
          box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.3);
        }

        #themeSelect option, #languageSelect option {
          background: #2d3748;
          color: white;
          padding: 10px;
          border-radius: 6px;
        }

        #themeSelect option:hover, #languageSelect option:hover {
          background: #4a5568;
        }

        .wplace-dragging {
          opacity: 0.9;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2);
          transition: none;
        }

        .wplace-settings-header:hover {
          background: rgba(255,255,255,0.15) !important;
        }

        .wplace-settings-header:active {
          background: rgba(255,255,255,0.2) !important;
        }
      </style>
    `;
    const y = document.createElement("div");
    y.className = "resize-container", y.innerHTML = `
      <h3 style="margin-top: 0; color: ${e.text}">${s.t("resizeImage")}</h3>
      <div class="resize-controls">
        <label>
          Width: <span id="widthValue">0</span>px
          <input type="range" id="widthSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label>
          Height: <span id="heightValue">0</span>px
          <input type="range" id="heightSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label style="display: flex; align-items: center;">
          <input type="checkbox" id="keepAspect" checked>
          Keep Aspect Ratio
        </label>
        <label style="display: flex; align-items: center;">
            <input type="checkbox" id="paintWhiteToggle" checked>
            Paint White Pixels
        </label>
        <div class="resize-zoom-controls">
          <button id="zoomOutBtn" class="wplace-btn" title="Zoom Out" style="padding:4px 8px;"><i class="fas fa-search-minus"></i></button>
          <input type="range" id="zoomSlider" class="resize-slider" min="0.1" max="20" value="1" step="0.05" style="max-width: 220px;">
          <button id="zoomInBtn" class="wplace-btn" title="Zoom In" style="padding:4px 8px;"><i class="fas fa-search-plus"></i></button>
          <button id="zoomFitBtn" class="wplace-btn" title="Fit to view" style="padding:4px 8px;">Fit</button>
          <button id="zoomActualBtn" class="wplace-btn" title="Actual size (100%)" style="padding:4px 8px;">100%</button>
          <button id="panModeBtn" class="wplace-btn" title="Pan (drag to move view)" style="padding:4px 8px;">
            <i class="fas fa-hand-paper"></i>
          </button>
          <span id="zoomValue" style="margin-left:6px; min-width:48px; text-align:right; opacity:.85; font-size:12px;">100%</span>
          <div id="cameraHelp" style="font-size:11px; opacity:.75; margin-left:auto;">
            Drag to pan • Pinch to zoom • Double‑tap to zoom
          </div>
        </div>
      </div>

      <div class="resize-preview-wrapper">
          <div id="resizePanStage" style="position:relative; width:100%; height:100%; overflow:hidden;">
            <div id="resizeCanvasStack" class="resize-canvas-stack" style="position:absolute; left:0; top:0; transform-origin: top left;">
              <canvas id="resizeCanvas" class="resize-base-canvas"></canvas>
              <canvas id="maskCanvas" class="resize-mask-canvas"></canvas>
            </div>
          </div>
      </div>
      <div class="resize-tools">
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <div style="display:flex; align-items:center; gap:6px;">
            <label style="font-size:12px; opacity:.85;">Brush</label>
            <input id="maskBrushSize" type="range" min="1" max="7" step="1" value="1" style="width:120px;">
            <span id="maskBrushSizeValue" style="font-size:12px; opacity:.85; min-width:18px; text-align:center;">1</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <label style="font-size:12px; opacity:.85;">Mode</label>
            <div class="mask-mode-group" style="display:flex; gap:6px;">
              <button id="maskModeIgnore" class="wplace-btn" style="padding:4px 8px; font-size:12px;">Ignore</button>
              <button id="maskModeUnignore" class="wplace-btn" style="padding:4px 8px; font-size:12px;">Unignore</button>
              <button id="maskModeToggle" class="wplace-btn wplace-btn-primary" style="padding:4px 8px; font-size:12px;">Toggle</button>
            </div>
          </div>
          <button id="clearIgnoredBtn" class="wplace-btn" title="Clear all ignored pixels" style="padding:4px 8px; font-size:12px;">Clear</button>
          <button id="invertMaskBtn" class="wplace-btn" title="Invert mask" style="padding:4px 8px; font-size:12px;">Invert</button>
          <span style="opacity:.8; font-size:12px;">Shift = Row • Alt = Column</span>
        </div>
      </div>

      <div class="wplace-section" id="color-palette-section" style="margin-top: 15px;">
          <div class="wplace-section-title">
              <i class="fas fa-palette"></i>&nbsp;Color Palette
          </div>
          <div class="wplace-controls">
              <div class="wplace-row single">
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                      <input type="checkbox" id="showAllColorsToggle" style="cursor: pointer;">
                      <span>Show All Colors (including unavailable)</span>
                  </label>
              </div>
              <div class="wplace-row">
                  <button id="selectAllBtn" class="wplace-btn">Select All</button>
                  <button id="unselectAllBtn" class="wplace-btn">Unselect All</button>
              </div>
              <div id="colors-container" class="wplace-color-grid"></div>
          </div>
      </div>

      <div class="wplace-section" id="advanced-color-section" style="margin-top: 15px;">
        <div class="wplace-section-title">
          <i class="fas fa-flask"></i>&nbsp;Advanced Color Matching
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <label style="display:flex; flex-direction:column; gap:4px; font-size:12px;">
            <span style="font-weight:600;">Algorithm</span>
            <select id="colorAlgorithmSelect" style="padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color:#fff;">
              <option value="lab" ${t.colorMatchingAlgorithm === "lab" ? "selected" : ""}>Perceptual (Lab)</option>
            <option value="legacy" ${t.colorMatchingAlgorithm === "legacy" ? "selected" : ""}>Legacy (RGB)</option>
            </select>
          </label>
          <label style="display:flex; align-items:center; justify-content:space-between; font-size:12px;">
            <div style="flex:1;">
              <span style="font-weight:600;">Chroma Penalty</span>
              <div style="margin-top:2px; opacity:0.65;">Preserve vivid colors (Lab only)</div>
            </div>
            <input type="checkbox" id="enableChromaPenaltyToggle" ${t.enableChromaPenalty ? "checked" : ""} style="width:18px; height:18px; cursor:pointer;" />
          </label>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
              <span>Chroma Weight</span>
              <span id="chromaWeightValue" style="background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px;">${t.chromaPenaltyWeight}</span>
            </div>
            <input type="range" id="chromaPenaltyWeightSlider" min="0" max="0.5" step="0.01" value="${t.chromaPenaltyWeight}" style="width:100%;" />
          </div>
          <label style="display:flex; align-items:center; justify-content:space-between; font-size:12px;">
            <div style="flex:1;">
              <span style="font-weight:600;">Enable Dithering</span>
              <div style="margin-top:2px; opacity:0.65;">Floyd–Steinberg error diffusion in preview and applied output</div>
            </div>
            <input type="checkbox" id="enableDitheringToggle" ${t.ditheringEnabled ? "checked" : ""} style="width:18px; height:18px; cursor:pointer;" />
          </label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <label style="display:flex; flex-direction:column; gap:4px; font-size:12px;">
              <span style="font-weight:600;">Transparency</span>
              <input type="number" id="transparencyThresholdInput" min="0" max="255" value="${t.customTransparencyThreshold}" style="padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color:#fff;" />
            </label>
            <label style="display:flex; flex-direction:column; gap:4px; font-size:12px;">
              <span style="font-weight:600;">White Thresh</span>
              <input type="number" id="whiteThresholdInput" min="200" max="255" value="${t.customWhiteThreshold}" style="padding:6px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color:#fff;" />
            </label>
          </div>
          <button id="resetAdvancedColorBtn" class="wplace-btn" style="background:linear-gradient(135deg,#ff6a6a,#ff4757); font-size:11px;">Reset Advanced</button>
        </div>
      </div>

      <div class="resize-buttons">
        <button id="downloadPreviewBtn" class="wplace-btn wplace-btn-primary">
          <i class="fas fa-download"></i>
          <span>Download Preview</span>
        </button>
        <button id="confirmResize" class="wplace-btn wplace-btn-start">
          <i class="fas fa-check"></i>
          <span>Apply</span>
        </button>
        <button id="cancelResize" class="wplace-btn wplace-btn-stop">
          <i class="fas fa-times"></i>
          <span>Cancel</span>
        </button>
      </div>
    `;
    const L = document.createElement("div");
    L.className = "resize-overlay", document.body.appendChild(p), document.body.appendChild(L), document.body.appendChild(y), document.body.appendChild(u), document.body.appendChild(g);
    const A = p.querySelector("#uploadBtn"), k = p.querySelector("#resizeBtn"), S = p.querySelector("#selectPosBtn"), T = p.querySelector("#startBtn"), $ = p.querySelector("#stopBtn"), D = p.querySelector("#saveBtn"), G = p.querySelector("#loadBtn"), U = p.querySelector("#saveToFileBtn"), Q = p.querySelector("#loadFromFileBtn"), O = p.querySelector("#minimizeBtn"), ce = p.querySelector("#compactBtn"), oe = p.querySelector("#statsBtn"), ge = p.querySelector("#toggleOverlayBtn"), Be = p.querySelector("#statusText"), Pa = p.querySelector("#progressBar"), St = u.querySelector("#statsArea"), Je = p.querySelector(".wplace-content"), Ze = u.querySelector("#closeStatsBtn"), _e = u.querySelector("#refreshChargesBtn"), Qe = p.querySelector("#cooldownSlider"), _t = p.querySelector("#cooldownValue");
    (!A || !S || !T || !$) && console.error("Some UI elements not found:", {
      uploadBtn: !!A,
      selectPosBtn: !!S,
      startBtn: !!T,
      stopBtn: !!$
    }), (!u || !St || !Ze) && console.error("Stats UI elements not found:", {
      statsContainer: !!u,
      statsArea: !!St,
      closeStatsBtn: !!Ze
    }), p.querySelector(".wplace-header"), et(p);
    function et(h) {
      let P = 0, z = 0, F = 0, ee = 0, I = !1;
      const H = h.querySelector(".wplace-header") || h.querySelector(".wplace-settings-header");
      if (!H) {
        console.warn("No draggable header found for element:", h);
        return;
      }
      H.onmousedown = re;
      function re(q) {
        if (q.target.closest(".wplace-header-btn") || q.target.closest("button")) return;
        q.preventDefault(), I = !0;
        const te = h.getBoundingClientRect();
        h.style.transform = "none", h.style.top = te.top + "px", h.style.left = te.left + "px", F = q.clientX, ee = q.clientY, h.classList.add("wplace-dragging"), document.onmouseup = $e, document.onmousemove = J, document.body.style.userSelect = "none";
      }
      function J(q) {
        if (!I) return;
        q.preventDefault(), P = F - q.clientX, z = ee - q.clientY, F = q.clientX, ee = q.clientY;
        let te = h.offsetTop - z, Xe = h.offsetLeft - P;
        const at = h.getBoundingClientRect(), Ct = window.innerHeight - at.height, se = window.innerWidth - at.width;
        te = Math.max(0, Math.min(te, Ct)), Xe = Math.max(0, Math.min(Xe, se)), h.style.top = te + "px", h.style.left = Xe + "px";
      }
      function $e() {
        I = !1, h.classList.remove("wplace-dragging"), document.onmouseup = null, document.onmousemove = null, document.body.style.userSelect = "";
      }
    }
    et(u), et(p), oe && Ze && (oe.addEventListener("click", () => {
      u.style.display !== "none" ? (u.style.display = "none", oe.innerHTML = '<i class="fas fa-chart-bar"></i>', oe.title = "Show Stats") : (u.style.display = "block", oe.innerHTML = '<i class="fas fa-chart-line"></i>', oe.title = "Hide Stats");
    }), Ze.addEventListener("click", () => {
      u.style.display = "none", oe.innerHTML = '<i class="fas fa-chart-bar"></i>', oe.title = "Show Stats";
    }), _e && _e.addEventListener("click", async () => {
      _e.innerHTML = '<i class="fas fa-spinner fa-spin"></i>', _e.disabled = !0;
      try {
        await Pe();
      } catch (h) {
        console.error("Error refreshing charges:", h);
      } finally {
        _e.innerHTML = '<i class="fas fa-sync"></i>', _e.disabled = !1;
      }
    })), u && oe && (u.style.display = "block", oe.innerHTML = '<i class="fas fa-chart-line"></i>', oe.title = "Hide Stats");
    const qt = p.querySelector("#settingsBtn"), Tt = g.querySelector("#closeSettingsBtn"), Wt = g.querySelector("#applySettingsBtn");
    if (qt && Tt && Wt) {
      qt.addEventListener("click", () => {
        g.style.display !== "none" ? (g.style.animation = "settingsFadeOut 0.3s ease-out forwards", setTimeout(() => {
          g.style.display = "none", g.style.animation = "";
        }, 300)) : (g.style.top = "50%", g.style.left = "50%", g.style.transform = "translate(-50%, -50%)", g.style.display = "block", g.style.animation = "settingsSlideIn 0.4s ease-out");
      }), Tt.addEventListener("click", () => {
        g.style.animation = "settingsFadeOut 0.3s ease-out forwards", setTimeout(() => {
          g.style.display = "none", g.style.animation = "", g.style.top = "50%", g.style.left = "50%", g.style.transform = "translate(-50%, -50%)";
        }, 300);
      }), Wt.addEventListener("click", () => {
        const I = document.getElementById("colorAlgorithmSelect");
        I && (t.colorMatchingAlgorithm = I.value);
        const H = document.getElementById("enableChromaPenaltyToggle");
        H && (t.enableChromaPenalty = H.checked);
        const re = document.getElementById("chromaPenaltyWeightSlider");
        re && (t.chromaPenaltyWeight = parseFloat(re.value) || 0.15);
        const J = document.getElementById("transparencyThresholdInput");
        if (J) {
          const q = parseInt(J.value, 10);
          !isNaN(q) && q >= 0 && q <= 255 && (t.customTransparencyThreshold = q);
        }
        const $e = document.getElementById("whiteThresholdInput");
        if ($e) {
          const q = parseInt($e.value, 10);
          !isNaN(q) && q >= 200 && q <= 255 && (t.customWhiteThreshold = q);
        }
        l.TRANSPARENCY_THRESHOLD = t.customTransparencyThreshold, l.WHITE_THRESHOLD = t.customWhiteThreshold, saveBotSettings(), s.showAlert(s.t("settingsSaved"), "success"), Tt.click();
      }), et(g);
      const h = g.querySelector("#languageSelect");
      h && h.addEventListener("change", (I) => {
        const H = I.target.value;
        t.language = H, localStorage.setItem("wplace_language", H), setTimeout(() => {
          g.style.display = "none", kt();
        }, 100);
      });
      const P = g.querySelector("#themeSelect");
      P && P.addEventListener("change", (I) => {
        const H = I.target.value;
        Sa(H);
      });
      const z = g.querySelector("#overlayOpacitySlider"), F = g.querySelector("#overlayOpacityValue"), ee = g.querySelector("#enableBlueMarbleToggle");
      z && F && z.addEventListener("input", (I) => {
        const H = parseFloat(I.target.value);
        t.overlayOpacity = H, F.textContent = `${Math.round(H * 100)}%`;
      }), ee && ee.addEventListener("click", async () => {
        t.blueMarbleEnabled = ee.checked, t.imageLoaded && be.imageBitmap && (s.showAlert("Re-processing overlay...", "info"), await be.processImageIntoChunks(), s.showAlert("Overlay updated!", "success"));
      });
    }
    const fe = y.querySelector("#widthSlider"), xe = y.querySelector("#heightSlider"), Yt = y.querySelector("#widthValue"), Ut = y.querySelector("#heightValue"), Xt = y.querySelector("#keepAspect"), Vt = y.querySelector("#paintWhiteToggle"), Re = y.querySelector("#zoomSlider"), tt = y.querySelector("#zoomValue"), Gt = y.querySelector("#zoomInBtn"), jt = y.querySelector("#zoomOutBtn"), Kt = y.querySelector("#zoomFitBtn"), Jt = y.querySelector("#zoomActualBtn"), Ye = y.querySelector("#panModeBtn"), pe = y.querySelector("#resizePanStage"), Ue = y.querySelector("#resizeCanvasStack"), N = y.querySelector("#resizeCanvas"), ie = y.querySelector("#maskCanvas"), Fe = N.getContext("2d"), Se = ie.getContext("2d"), $a = y.querySelector("#confirmResize"), Ea = y.querySelector("#cancelResize"), Aa = y.querySelector("#downloadPreviewBtn");
    y.querySelector("#clearIgnoredBtn"), ce && ce.addEventListener("click", () => {
      p.classList.toggle("wplace-compact"), p.classList.contains("wplace-compact") ? (ce.innerHTML = '<i class="fas fa-expand"></i>', ce.title = "Expand Mode") : (ce.innerHTML = '<i class="fas fa-compress"></i>', ce.title = "Compact Mode");
    }), O && O.addEventListener("click", () => {
      t.minimized = !t.minimized, t.minimized ? (p.classList.add("wplace-minimized"), Je.classList.add("wplace-hidden"), O.innerHTML = '<i class="fas fa-expand"></i>', O.title = "Restore") : (p.classList.remove("wplace-minimized"), Je.classList.remove("wplace-hidden"), O.innerHTML = '<i class="fas fa-minus"></i>', O.title = "Minimize"), saveBotSettings();
    }), ge && ge.addEventListener("click", () => {
      const h = be.toggle();
      ge.classList.toggle("active", h), ge.setAttribute("aria-pressed", h ? "true" : "false"), s.showAlert(`Overlay ${h ? "enabled" : "disabled"}.`, "info");
    }), t.minimized ? (p.classList.add("wplace-minimized"), Je.classList.add("wplace-hidden"), O && (O.innerHTML = '<i class="fas fa-expand"></i>', O.title = "Restore")) : (p.classList.remove("wplace-minimized"), Je.classList.remove("wplace-hidden"), O && (O.innerHTML = '<i class="fas fa-minus"></i>', O.title = "Minimize")), D && D.addEventListener("click", () => {
      if (!t.imageLoaded) {
        s.showAlert(s.t("missingRequirements"), "error");
        return;
      }
      s.saveProgress() ? (B("autoSaved", "success"), s.showAlert(s.t("autoSaved"), "success")) : s.showAlert("❌ Erro ao salvar progresso", "error");
    }), G && G.addEventListener("click", () => {
      const h = s.loadProgress();
      if (!h) {
        B("noSavedData", "warning"), s.showAlert(s.t("noSavedData"), "warning");
        return;
      }
      confirm(
        `${s.t("savedDataFound")}

Saved: ${new Date(h.timestamp).toLocaleString()}
Progress: ${h.state.paintedPixels}/${h.state.totalPixels} pixels`
      ) && (s.restoreProgress(h) ? (B("dataLoaded", "success"), s.showAlert(s.t("dataLoaded"), "success"), We(), Pe(), s.restoreOverlayFromData().catch((F) => {
        console.error("Failed to restore overlay from localStorage:", F);
      }), t.colorsChecked ? (A.disabled = !1, S.disabled = !1) : A.disabled = !1, t.imageLoaded && t.startPosition && t.region && t.colorsChecked && (T.disabled = !1)) : s.showAlert("❌ Erro ao carregar progresso", "error"));
    }), U && U.addEventListener("click", () => {
      s.saveProgressToFile() ? (B("fileSaved", "success"), s.showAlert(s.t("fileSaved"), "success")) : s.showAlert(s.t("fileError"), "error");
    }), Q && Q.addEventListener("click", async () => {
      try {
        await s.loadProgressFromFile() && (B("fileLoaded", "success"), s.showAlert(s.t("fileLoaded"), "success"), We(), await Pe(), await s.restoreOverlayFromData().catch((P) => {
          console.error("Failed to restore overlay from file:", P);
        }), t.colorsChecked ? (A.disabled = !1, S.disabled = !1, k.disabled = !1) : A.disabled = !1, t.imageLoaded && t.startPosition && t.region && t.colorsChecked && (T.disabled = !1));
      } catch (h) {
        h.message === "Invalid JSON file" ? s.showAlert(s.t("invalidFileFormat"), "error") : s.showAlert(s.t("fileError"), "error");
      }
    }), B = (h, P = "default", z = {}) => {
      const F = s.t(h, z);
      Be.textContent = F, Be.className = `wplace-status status-${P}`, Be.style.animation = "none", Be.offsetWidth, Be.style.animation = "slideIn 0.3s ease-out";
    }, Pe = async () => {
      const { charges: h, cooldown: P, max: z } = await yt.getCharges();
      t.currentCharges = Math.floor(h), t.cooldown = P, t.maxCharges = Math.floor(z) > 1 ? Math.floor(z) : t.maxCharges, Qe.max != t.maxCharges && (Qe.max = t.maxCharges);
      let F = "";
      if (t.imageLoaded) {
        const I = t.totalPixels > 0 ? Math.round(t.paintedPixels / t.totalPixels * 100) : 0, H = t.totalPixels - t.paintedPixels;
        t.estimatedTime = s.calculateEstimatedTime(H, t.currentCharges, t.cooldown), Pa.style.width = `${I}%`, F = `
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-image"></i> ${s.t("progress")}</div>
                <div class="wplace-stat-value">${I}%</div>
                </div>
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${s.t("pixels")}</div>
                <div class="wplace-stat-value">${t.paintedPixels}/${t.totalPixels}</div>
                </div>
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-clock"></i> ${s.t("estimatedTime")}</div>
                <div class="wplace-stat-value">${s.formatTime(t.estimatedTime)}</div>
                </div>
            `;
      }
      let ee = "";
      t.colorsChecked && (ee = t.availableColors.map((I) => `<div class="wplace-stat-color-swatch" style="background-color: ${`rgb(${I.rgb.join(",")})`};" title="ID: ${I.id}
RGB: ${I.rgb.join(", ")}"></div>`).join("")), St.innerHTML = `
            ${F}
            <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-bolt"></i> ${s.t("charges")}</div>
            <div class="wplace-stat-value">${Math.floor(t.currentCharges)} / ${t.maxCharges}</div>
            </div>
            ${t.colorsChecked ? `
            <div class="wplace-colors-section">
                <div class="wplace-stat-label"><i class="fas fa-palette"></i> Available Colors (${t.availableColors.length})</div>
                <div class="wplace-stat-colors-grid">
                    ${ee}
                </div>
            </div>
            ` : ""}
        `;
    }, We = () => {
      const h = t.imageLoaded && t.imageData;
      D.disabled = !h, U.disabled = !h;
    }, We();
    function Ia(h) {
      let P = h, z, F;
      if (t.originalImage?.dataUrl)
        P = new mt(t.originalImage.dataUrl), z = t.originalImage.width, F = t.originalImage.height;
      else {
        const c = h.getDimensions();
        z = c.width, F = c.height;
      }
      const ee = z / F, I = t.resizeSettings;
      fe.max = z * 2, xe.max = F * 2;
      let H = z, re = F;
      I && Number.isFinite(I.width) && Number.isFinite(I.height) && I.width > 0 && I.height > 0 && (H = I.width, re = I.height), H = Math.max(parseInt(fe.min, 10) || 10, Math.min(H, parseInt(fe.max, 10))), re = Math.max(parseInt(xe.min, 10) || 10, Math.min(re, parseInt(xe.max, 10))), fe.value = H, xe.value = re, Yt.textContent = H, Ut.textContent = re, Re.value = 1, tt && (tt.textContent = "100%"), Vt.checked = t.paintWhitePixels;
      let J = null, $e = 0, q = !1, te = 1;
      const Xe = (c, b) => {
        (!t.resizeIgnoreMask || t.resizeIgnoreMask.length !== c * b) && (t.resizeIgnoreMask = new Uint8Array(c * b)), N.width = c, N.height = b, ie.width = c, ie.height = b, Se.clearRect(0, 0, ie.width, ie.height);
      };
      Ce = async () => {
        const c = ++$e, b = parseInt(fe.value, 10), m = parseInt(xe.value, 10);
        if (te = parseFloat(Re.value), Yt.textContent = b, Ut.textContent = m, Xe(b, m), Ue.style.width = b + "px", Ue.style.height = m + "px", Fe.imageSmoothingEnabled = !1, !t.availableColors || t.availableColors.length === 0) {
          if (P !== h && (!P.img || !P.canvas) && await P.load(), Fe.clearRect(0, 0, b, m), Fe.drawImage(P.img, 0, 0, b, m), Se.clearRect(0, 0, ie.width, ie.height), t.resizeIgnoreMask) {
            const C = Se.createImageData(b, m), M = C.data, Z = t.resizeIgnoreMask;
            for (let E = 0; E < Z.length; E++) if (Z[E]) {
              const j = E * 4;
              M[j] = 255, M[j + 1] = 0, M[j + 2] = 0, M[j + 3] = 150;
            }
            Se.putImageData(C, 0, 0);
          }
          Pt();
          return;
        }
        P !== h && (!P.img || !P.canvas) && await P.load(), Fe.clearRect(0, 0, b, m), Fe.drawImage(P.img, 0, 0, b, m);
        const f = Fe.getImageData(0, 0, b, m), x = f.data, v = t.customTransparencyThreshold || l.TRANSPARENCY_THRESHOLD, ne = () => {
          const C = b, M = m, Z = C * M, E = new Float32Array(Z * 3), j = new Uint8Array(Z);
          for (let X = 0; X < M; X++)
            for (let K = 0; K < C; K++) {
              const W = X * C + K, le = W * 4, he = x[le], _ = x[le + 1], Y = x[le + 2], ae = x[le + 3] >= v && (t.paintWhitePixels || !s.isWhitePixel(he, _, Y));
              j[W] = ae ? 1 : 0, E[W * 3] = he, E[W * 3 + 1] = _, E[W * 3 + 2] = Y, ae || (x[le + 3] = 0);
            }
          const R = (X, K, W, le, he, _) => {
            if (X < 0 || X >= C || K < 0 || K >= M) return;
            const Y = K * C + X;
            if (!j[Y]) return;
            const V = Y * 3;
            E[V] = Math.min(255, Math.max(0, E[V] + W * _)), E[V + 1] = Math.min(255, Math.max(0, E[V + 1] + le * _)), E[V + 2] = Math.min(255, Math.max(0, E[V + 2] + he * _));
          };
          for (let X = 0; X < M; X++)
            for (let K = 0; K < C; K++) {
              const W = X * C + K;
              if (!j[W]) continue;
              const le = W * 3, he = E[le], _ = E[le + 1], Y = E[le + 2], [V, ae, ye] = s.findClosestPaletteColor(he, _, Y, t.activeColorPalette), me = W * 4;
              x[me] = V, x[me + 1] = ae, x[me + 2] = ye, x[me + 3] = 255;
              const we = he - V, de = _ - ae, ze = Y - ye;
              R(K + 1, X, we, de, ze, 7 / 16), R(K - 1, X + 1, we, de, ze, 3 / 16), R(K, X + 1, we, de, ze, 5 / 16), R(K + 1, X + 1, we, de, ze, 1 / 16);
            }
        };
        if (t.ditheringEnabled && !q)
          ne();
        else
          for (let C = 0; C < x.length; C += 4) {
            const M = x[C], Z = x[C + 1], E = x[C + 2];
            if (x[C + 3] < v || !t.paintWhitePixels && s.isWhitePixel(M, Z, E)) {
              x[C + 3] = 0;
              continue;
            }
            const [R, X, K] = s.findClosestPaletteColor(M, Z, E, t.activeColorPalette);
            x[C] = R, x[C + 1] = X, x[C + 2] = K, x[C + 3] = 255;
          }
        if (c === $e) {
          if (Fe.putImageData(f, 0, 0), Se.clearRect(0, 0, ie.width, ie.height), t.resizeIgnoreMask) {
            const C = Se.createImageData(b, m), M = C.data, Z = t.resizeIgnoreMask;
            for (let E = 0; E < Z.length; E++) if (Z[E]) {
              const j = E * 4;
              M[j] = 255, M[j + 1] = 0, M[j + 2] = 0, M[j + 3] = 150;
            }
            Se.putImageData(C, 0, 0);
          }
          Pt();
        }
      };
      const at = () => {
        Xt.checked && (xe.value = Math.round(parseInt(fe.value, 10) / ee)), Ce();
        const c = parseInt(fe.value, 10), b = parseInt(xe.value, 10);
        t.resizeSettings = { baseWidth: z, baseHeight: F, width: c, height: b }, saveBotSettings();
        const m = typeof Ae == "function" ? Ae() : 1;
        !isNaN(m) && isFinite(m) && ve(m);
      }, Ct = () => {
        Xt.checked && (fe.value = Math.round(parseInt(xe.value, 10) * ee)), Ce();
        const c = parseInt(fe.value, 10), b = parseInt(xe.value, 10);
        t.resizeSettings = { baseWidth: z, baseHeight: F, width: c, height: b }, saveBotSettings();
        const m = typeof Ae == "function" ? Ae() : 1;
        !isNaN(m) && isFinite(m) && ve(m);
      };
      Vt.onchange = (c) => {
        t.paintWhitePixels = c.target.checked, Ce();
      };
      let se = 0, ue = 0;
      const La = () => {
        const c = pe?.getBoundingClientRect() || { width: 0, height: 0 }, b = (N.width || 1) * te, m = (N.height || 1) * te;
        if (b <= c.width)
          se = Math.floor((c.width - b) / 2);
        else {
          const f = c.width - b;
          se = Math.min(0, Math.max(f, se));
        }
        if (m <= c.height)
          ue = Math.floor((c.height - m) / 2);
        else {
          const f = c.height - m;
          ue = Math.min(0, Math.max(f, ue));
        }
      }, it = () => {
        La(), Ue.style.transform = `translate(${se}px, ${ue}px) scale(${te})`;
      }, Pt = () => {
        const c = N.width || 1, b = N.height || 1;
        N.style.width = c + "px", N.style.height = b + "px", ie.style.width = c + "px", ie.style.height = b + "px", Ue.style.width = c + "px", Ue.style.height = b + "px", it();
      }, ve = (c) => {
        te = Math.max(0.05, Math.min(20, c || 1)), Re.value = te, Pt(), tt && (tt.textContent = `${Math.round(te * 100)}%`);
      };
      Re.addEventListener("input", () => {
        ve(parseFloat(Re.value));
      }), Gt && Gt.addEventListener("click", () => ve(parseFloat(Re.value) + 0.1)), jt && jt.addEventListener("click", () => ve(parseFloat(Re.value) - 0.1));
      const Ae = () => {
        const c = pe?.getBoundingClientRect();
        if (!c) return 1;
        const b = N.width || 1, m = N.height || 1, f = 10, x = (c.width - f) / b, v = (c.height - f) / m;
        return Math.max(0.05, Math.min(20, Math.min(x, v)));
      };
      Kt && Kt.addEventListener("click", () => {
        ve(Ae()), Ve();
      }), Jt && Jt.addEventListener("click", () => {
        ve(1), Ve();
      });
      const Ve = () => {
        if (!pe) return;
        const c = pe.getBoundingClientRect(), b = (N.width || 1) * te, m = (N.height || 1) * te;
        se = Math.floor((c.width - b) / 2), ue = Math.floor((c.height - m) / 2), it();
      };
      let Ie = !1, nt = 0, ot = 0, rt = 0, st = 0, Me = !1, Ne = !1;
      const za = (c) => c.button === 1 || c.button === 2, Oe = (c) => {
        pe && (pe.style.cursor = c);
      }, Da = (c) => Ne || Me || za(c), Qt = () => {
        Ye && (Ye.classList.toggle("active", Ne), Ye.setAttribute("aria-pressed", Ne ? "true" : "false"));
      };
      if (Ye && (Qt(), Ye.addEventListener("click", () => {
        Ne = !Ne, Qt(), Oe(Ne ? "grab" : "");
      })), pe) {
        pe.addEventListener("contextmenu", (f) => {
          Me && f.preventDefault();
        }), window.addEventListener("keydown", (f) => {
          f.code === "Space" && (Me = !0, Oe("grab"));
        }), window.addEventListener("keyup", (f) => {
          f.code === "Space" && (Me = !1, Ie || Oe(""));
        }), pe.addEventListener("mousedown", (f) => {
          Da(f) && (f.preventDefault(), Ie = !0, nt = f.clientX, ot = f.clientY, rt = se, st = ue, Oe("grabbing"));
        }), window.addEventListener("mousemove", (f) => {
          if (!Ie) return;
          const x = f.clientX - nt, v = f.clientY - ot;
          se = rt + x, ue = st + v, it();
        }), window.addEventListener("mouseup", () => {
          Ie && (Ie = !1, Oe(Me ? "grab" : ""));
        }), pe.addEventListener("wheel", (f) => {
          if (!f.ctrlKey && !f.metaKey) return;
          f.preventDefault();
          const x = pe.getBoundingClientRect(), v = f.clientX - x.left - se, ne = f.clientY - x.top - ue, C = te, M = Math.max(0.05, Math.min(0.5, Math.abs(f.deltaY) > 20 ? 0.2 : 0.1)), Z = Math.max(0.05, Math.min(20, C + (f.deltaY > 0 ? -M : M)));
          if (Z === C) return;
          const E = Z / C;
          se = se - v * (E - 1), ue = ue - ne * (E - 1), ve(Z);
        }, { passive: !1 });
        let c = null, b = 0, m = null;
        pe.addEventListener("touchstart", (f) => {
          if (f.touches.length === 1) {
            const x = f.touches[0];
            Ie = !0, nt = x.clientX, ot = x.clientY, rt = se, st = ue, Oe("grabbing");
            const v = Date.now();
            if (v - b < 300) {
              const ne = Math.abs(te - 1) < 0.01 ? Ae() : 1;
              ve(ne), Ve(), m && clearTimeout(m);
            } else
              b = v, m = setTimeout(() => {
                m = null;
              }, 320);
          } else if (f.touches.length === 2) {
            const [x, v] = f.touches;
            c = Math.hypot(v.clientX - x.clientX, v.clientY - x.clientY);
          }
        }, { passive: !0 }), pe.addEventListener("touchmove", (f) => {
          if (f.touches.length === 1 && Ie) {
            const x = f.touches[0], v = x.clientX - nt, ne = x.clientY - ot;
            se = rt + v, ue = st + ne, it();
          } else if (f.touches.length === 2 && c != null) {
            f.preventDefault();
            const [x, v] = f.touches, ne = Math.hypot(v.clientX - x.clientX, v.clientY - x.clientY), C = pe.getBoundingClientRect(), M = (x.clientX + v.clientX) / 2 - C.left - se, Z = (x.clientY + v.clientY) / 2 - C.top - ue, E = te, j = ne / (c || ne), R = Math.max(0.05, Math.min(20, E * j));
            R !== E && (se = se - M * (R / E - 1), ue = ue - Z * (R / E - 1), ve(R)), c = ne;
          }
        }, { passive: !1 }), pe.addEventListener("touchend", () => {
          Ie = !1, c = null, Oe(Ne || Me ? "grab" : "");
        });
      }
      const $t = () => {
        J && clearTimeout(J);
        const c = () => {
          J = null, Ce();
        };
        window.requestIdleCallback ? J = setTimeout(() => requestIdleCallback(c, { timeout: 150 }), 50) : J = setTimeout(() => requestAnimationFrame(c), 50);
      }, ea = () => {
        q = !0;
      }, ta = () => {
        q = !1, $t();
      };
      fe.addEventListener("pointerdown", ea), xe.addEventListener("pointerdown", ea), fe.addEventListener("pointerup", ta), xe.addEventListener("pointerup", ta), fe.addEventListener("input", () => {
        at(), $t();
      }), xe.addEventListener("input", () => {
        Ct(), $t();
      });
      let lt = !1, ct = 1, Le = "ignore";
      const Ge = y.querySelector("#maskBrushSize"), Et = y.querySelector("#maskBrushSizeValue"), At = y.querySelector("#maskModeIgnore"), It = y.querySelector("#maskModeUnignore"), Mt = y.querySelector("#maskModeToggle"), aa = y.querySelector("#clearIgnoredBtn"), ia = y.querySelector("#invertMaskBtn"), na = () => {
        const c = [
          [At, "ignore"],
          [It, "unignore"],
          [Mt, "toggle"]
        ];
        for (const [b, m] of c) {
          if (!b) continue;
          const f = Le === m;
          b.classList.toggle("active", f), b.setAttribute("aria-pressed", f ? "true" : "false");
        }
      }, Lt = (c) => {
        Le = c, na();
      };
      Ge && Et && (Ge.addEventListener("input", () => {
        ct = parseInt(Ge.value, 10) || 1, Et.textContent = ct;
      }), Et.textContent = Ge.value, ct = parseInt(Ge.value, 10) || 1), At && At.addEventListener("click", () => Lt("ignore")), It && It.addEventListener("click", () => Lt("unignore")), Mt && Mt.addEventListener("click", () => Lt("toggle")), na();
      const Ba = (c, b) => {
        const m = N.getBoundingClientRect(), f = m.width / N.width, x = m.height / N.height, v = (c - m.left) / f, ne = (b - m.top) / x, C = Math.floor(v), M = Math.floor(ne);
        return { x: C, y: M };
      }, zt = (c, b) => {
        (!t.resizeIgnoreMask || t.resizeIgnoreMask.length !== c * b) && (t.resizeIgnoreMask = new Uint8Array(c * b));
      }, Ra = (c, b, m, f) => {
        const x = N.width, v = N.height;
        zt(x, v);
        const ne = m * m;
        for (let C = b - m; C <= b + m; C++)
          if (!(C < 0 || C >= v))
            for (let M = c - m; M <= c + m; M++) {
              if (M < 0 || M >= x) continue;
              const Z = M - c, E = C - b;
              if (Z * Z + E * E <= ne) {
                const j = C * x + M;
                Le === "toggle" ? t.resizeIgnoreMask[j] = t.resizeIgnoreMask[j] ? 0 : 1 : Le === "ignore" ? t.resizeIgnoreMask[j] = 1 : t.resizeIgnoreMask[j] = 0;
              }
            }
      }, Fa = (c, b) => {
        const m = N.width, f = N.height;
        if (zt(m, f), !(c < 0 || c >= f))
          for (let x = 0; x < m; x++) {
            const v = c * m + x;
            Le === "toggle" ? t.resizeIgnoreMask[v] = t.resizeIgnoreMask[v] ? 0 : 1 : Le === "ignore" ? t.resizeIgnoreMask[v] = 1 : t.resizeIgnoreMask[v] = 0;
          }
      }, Na = (c, b) => {
        const m = N.width, f = N.height;
        if (zt(m, f), !(c < 0 || c >= m))
          for (let x = 0; x < f; x++) {
            const v = x * m + c;
            Le === "toggle" ? t.resizeIgnoreMask[v] = t.resizeIgnoreMask[v] ? 0 : 1 : Le === "ignore" ? t.resizeIgnoreMask[v] = 1 : t.resizeIgnoreMask[v] = 0;
          }
      }, Dt = () => {
        const c = N.width, b = N.height;
        if (ie.width = c, ie.height = b, Se.clearRect(0, 0, c, b), !t.resizeIgnoreMask) return;
        const m = Se.createImageData(c, b), f = m.data;
        for (let x = 0; x < t.resizeIgnoreMask.length; x++)
          if (t.resizeIgnoreMask[x]) {
            const v = x * 4;
            f[v] = 255, f[v + 1] = 0, f[v + 2] = 0, f[v + 3] = 150;
          }
        Se.putImageData(m, 0, 0);
      }, oa = (c) => {
        if ((c.buttons & 4) === 4 || (c.buttons & 2) === 2 || Me) return;
        const { x: b, y: m } = Ba(c.clientX, c.clientY), f = N.width, x = N.height;
        if (b < 0 || m < 0 || b >= f || m >= x) return;
        const v = Math.max(1, Math.floor(ct / 2));
        c.shiftKey ? Fa(m) : c.altKey ? Na(b) : Ra(b, m, v), Dt();
      };
      ie.addEventListener("mousedown", (c) => {
        c.button === 1 || c.button === 2 || Me || (lt = !0, oa(c));
      }), ie.addEventListener("touchstart", (c) => {
      }, { passive: !0 }), ie.addEventListener("touchmove", (c) => {
      }, { passive: !0 }), ie.addEventListener("touchend", (c) => {
      }, { passive: !0 }), window.addEventListener("mousemove", (c) => {
        lt && oa(c);
      }), window.addEventListener("mouseup", () => {
        lt && (lt = !1, saveBotSettings());
      }), aa && aa.addEventListener("click", () => {
        t.resizeIgnoreMask && t.resizeIgnoreMask.fill(0), Dt(), Ce(), saveBotSettings();
      }), ia && ia.addEventListener("click", () => {
        if (t.resizeIgnoreMask) {
          for (let c = 0; c < t.resizeIgnoreMask.length; c++) t.resizeIgnoreMask[c] = t.resizeIgnoreMask[c] ? 0 : 1;
          Dt(), Ce(), saveBotSettings();
        }
      }), $a.onclick = async () => {
        const c = parseInt(fe.value, 10), b = parseInt(xe.value, 10), m = document.createElement("canvas"), f = m.getContext("2d");
        m.width = c, m.height = b, f.imageSmoothingEnabled = !1, P !== h && (!P.img || !P.canvas) && await P.load(), f.drawImage(P.img, 0, 0, c, b);
        const x = f.getImageData(0, 0, c, b), v = x.data, ne = t.customTransparencyThreshold || l.TRANSPARENCY_THRESHOLD;
        let C = 0;
        const M = t.resizeIgnoreMask && t.resizeIgnoreMask.length === c * b ? t.resizeIgnoreMask : null, Z = async () => {
          const R = c, X = b, K = R * X, W = new Float32Array(K * 3), le = new Uint8Array(K);
          for (let _ = 0; _ < X; _++) {
            for (let Y = 0; Y < R; Y++) {
              const V = _ * R + Y, ae = V * 4, ye = v[ae], me = v[ae + 1], we = v[ae + 2], de = v[ae + 3], je = !(M && M[V]) && de >= ne && (t.paintWhitePixels || !s.isWhitePixel(ye, me, we));
              le[V] = je ? 1 : 0, W[V * 3] = ye, W[V * 3 + 1] = me, W[V * 3 + 2] = we, je || (v[ae + 3] = 0);
            }
            (_ & 15) === 0 && await Promise.resolve();
          }
          const he = (_, Y, V, ae, ye, me) => {
            if (_ < 0 || _ >= R || Y < 0 || Y >= X) return;
            const we = Y * R + _;
            if (!le[we]) return;
            const de = we * 3;
            W[de] = Math.min(255, Math.max(0, W[de] + V * me)), W[de + 1] = Math.min(255, Math.max(0, W[de + 1] + ae * me)), W[de + 2] = Math.min(255, Math.max(0, W[de + 2] + ye * me));
          };
          for (let _ = 0; _ < X; _++) {
            for (let Y = 0; Y < R; Y++) {
              const V = _ * R + Y;
              if (!le[V]) continue;
              const ae = V * 3, ye = W[ae], me = W[ae + 1], we = W[ae + 2], [de, ze, je] = s.findClosestPaletteColor(ye, me, we, t.activeColorPalette), dt = V * 4;
              v[dt] = de, v[dt + 1] = ze, v[dt + 2] = je, v[dt + 3] = 255, C++;
              const gt = ye - de, pt = me - ze, ut = we - je;
              he(Y + 1, _, gt, pt, ut, 7 / 16), he(Y - 1, _ + 1, gt, pt, ut, 3 / 16), he(Y, _ + 1, gt, pt, ut, 5 / 16), he(Y + 1, _ + 1, gt, pt, ut, 1 / 16);
            }
            await Promise.resolve();
          }
        };
        if (t.ditheringEnabled)
          await Z();
        else
          for (let R = 0; R < v.length; R += 4) {
            const X = v[R], K = v[R + 1], W = v[R + 2], le = v[R + 3], he = M && M[R >> 2], _ = le < ne || he, Y = !t.paintWhitePixels && s.isWhitePixel(X, K, W);
            if (_ || Y) {
              v[R + 3] = 0;
              continue;
            }
            C++;
            const [V, ae, ye] = s.findClosestPaletteColor(X, K, W, t.activeColorPalette);
            v[R] = V, v[R + 1] = ae, v[R + 2] = ye, v[R + 3] = 255;
          }
        f.putImageData(x, 0, 0);
        const E = new Uint8ClampedArray(x.data);
        t.imageData.pixels = E, t.imageData.width = c, t.imageData.height = b, t.imageData.totalPixels = C, t.totalPixels = C, t.paintedPixels = 0, t.resizeSettings = { baseWidth: z, baseHeight: F, width: c, height: b }, saveBotSettings();
        const j = await createImageBitmap(m);
        await be.setImage(j), be.enable(), ge.classList.add("active"), ge.setAttribute("aria-pressed", "true"), Pe(), B("resizeSuccess", "success", { width: c, height: b }), Zt();
      }, Aa.onclick = () => {
        try {
          const c = N.width, b = N.height, m = document.createElement("canvas");
          m.width = c, m.height = b;
          const f = m.getContext("2d");
          f.imageSmoothingEnabled = !1, f.drawImage(N, 0, 0), f.drawImage(ie, 0, 0);
          const x = document.createElement("a");
          x.download = "wplace-preview.png", x.href = m.toDataURL(), x.click();
        } catch (c) {
          console.warn("Failed to download preview:", c);
        }
      }, Ea.onclick = Zt, L.style.display = "block", y.style.display = "block", initializeColorPalette(y), Ce(), setTimeout(() => {
        if (typeof Ae == "function") {
          const c = Ae();
          !isNaN(c) && isFinite(c) && (ve(c), Ve());
        } else
          Ve();
      }, 0);
    }
    function Zt() {
      L.style.display = "none", y.style.display = "none", Ce = () => {
      };
    }
    A && A.addEventListener("click", async () => {
      const h = s.extractAvailableColors();
      if (h.length < 10) {
        B("noColorsFound", "error"), s.showAlert(s.t("noColorsFound"), "error");
        return;
      }
      t.colorsChecked || (t.availableColors = h, t.colorsChecked = !0, B("colorsFound", "success", { count: h.length }), Pe(), S.disabled = !1, t.imageLoaded && (k.disabled = !1));
      try {
        B("loadingImage", "default");
        const P = await s.createImageUploader();
        if (!P) {
          B("colorsFound", "success", { count: t.availableColors.length });
          return;
        }
        const z = new mt(P);
        await z.load();
        const { width: F, height: ee } = z.getDimensions(), I = z.getPixelData();
        let H = 0;
        for (let J = 0; J < I.length; J += 4) {
          const $e = I[J + 3] < (t.customTransparencyThreshold || l.TRANSPARENCY_THRESHOLD), q = !t.paintWhitePixels && s.isWhitePixel(I[J], I[J + 1], I[J + 2]);
          !$e && !q && H++;
        }
        t.imageData = {
          width: F,
          height: ee,
          pixels: I,
          totalPixels: H,
          processor: z
        }, t.totalPixels = H, t.paintedPixels = 0, t.imageLoaded = !0, t.lastPosition = { x: 0, y: 0 }, t.resizeSettings = null, t.resizeIgnoreMask = null, t.originalImage = { dataUrl: P, width: F, height: ee }, saveBotSettings(), saveBotSettings();
        const re = await createImageBitmap(z.img);
        await be.setImage(re), be.enable(), ge.disabled = !1, ge.classList.add("active"), ge.setAttribute("aria-pressed", "true"), t.colorsChecked && (k.disabled = !1), D.disabled = !1, t.startPosition && (T.disabled = !1), Pe(), We(), B("imageLoaded", "success", { count: H });
      } catch {
        B("imageError", "error");
      }
    }), k && k.addEventListener("click", () => {
      t.imageLoaded && t.imageData.processor && t.colorsChecked ? Ia(t.imageData.processor) : t.colorsChecked || s.showAlert("Please upload an image first to capture available colors", "warning");
    }), S && S.addEventListener("click", async () => {
      if (t.selectingPosition) return;
      t.selectingPosition = !0, t.startPosition = null, t.region = null, T.disabled = !0, s.showAlert(s.t("selectPositionAlert"), "info"), B("waitingPosition", "default");
      const h = async (z, F) => {
        if (typeof z == "string" && z.includes("https://backend.wplace.live/s0/pixel/") && F?.method?.toUpperCase() === "POST")
          try {
            const ee = await P(z, F);
            if ((await ee.clone().json())?.painted === 1) {
              const re = z.match(/\/pixel\/(\d+)\/(\d+)/);
              re && re.length >= 3 && (t.region = {
                x: Number.parseInt(re[1]),
                y: Number.parseInt(re[2])
              });
              const J = JSON.parse(F.body);
              J?.coords && Array.isArray(J.coords) && (t.startPosition = {
                x: J.coords[0],
                y: J.coords[1]
              }, t.lastPosition = { x: 0, y: 0 }, await be.setPosition(t.startPosition, t.region), t.imageLoaded && (T.disabled = !1), window.fetch = P, t.selectingPosition = !1, B("positionSet", "success"));
            }
            return ee;
          } catch {
            return P(z, F);
          }
        return P(z, F);
      }, P = window.fetch;
      window.fetch = h, setTimeout(() => {
        t.selectingPosition && (window.fetch = P, t.selectingPosition = !1, B("positionTimeout", "error"), s.showAlert(s.t("positionTimeout"), "error"));
      }, 12e4);
    });
    async function Ma() {
      if (!t.imageLoaded || !t.startPosition || !t.region)
        return B("missingRequirements", "error"), !1;
      if (await Nt(), !turnstileToken) return !1;
      t.running = !0, t.stopFlag = !1, T.disabled = !0, $.disabled = !1, A.disabled = !0, S.disabled = !0, k.disabled = !0, D.disabled = !0, ge.disabled = !0, B("startPaintingMsg", "success");
      try {
        return await xa(), !0;
      } catch {
        return B("paintingError", "error"), !1;
      } finally {
        t.running = !1, $.disabled = !0, D.disabled = !1, t.stopFlag ? T.disabled = !1 : (T.disabled = !0, A.disabled = !1, S.disabled = !1, k.disabled = !1), ge.disabled = !1;
      }
    }
    T && T.addEventListener("click", Ma), $ && $.addEventListener("click", () => {
      t.stopFlag = !0, t.running = !1, $.disabled = !0, B("paintingStopped", "warning"), t.imageLoaded && t.paintedPixels > 0 && (s.saveProgress(), s.showAlert(s.t("autoSaved"), "success"));
    }), setTimeout(() => {
      const h = s.loadProgress();
      if (h && h.state.paintedPixels > 0) {
        const P = new Date(h.timestamp).toLocaleString(), z = Math.round(h.state.paintedPixels / h.state.totalPixels * 100);
        s.showAlert(
          `${s.t("savedDataFound")}

Saved: ${P}
Progress: ${h.state.paintedPixels}/${h.state.totalPixels} pixels (${z}%)
${s.t("clickLoadToContinue")}`,
          "info"
        );
      }
    }, 1e3), Qe && _t && Qe.addEventListener("input", (h) => {
      const P = parseInt(h.target.value);
      t.cooldownChargeThreshold = P, _t.textContent = P, saveBotSettings();
    }), loadBotSettings();
  }
  function Ta(a) {
    const i = document.createElement("script");
    i.textContent = `(${a})();`, document.documentElement?.appendChild(i), i.remove();
  }
  Ta(() => {
    const a = /* @__PURE__ */ new Map();
    window.addEventListener("message", (n) => {
      const { source: o, blobID: r, blobData: e } = n.data;
      if (o === "auto-image-overlay" && r && e) {
        const d = a.get(r);
        typeof d == "function" && d(e), a.delete(r);
      }
    });
    const i = window.fetch;
    window.fetch = async function(...n) {
      const o = await i.apply(this, n), r = n[0] instanceof Request ? n[0].url : n[0];
      if (typeof r == "string") {
        if (r.includes("https://backend.wplace.live/s0/pixel/"))
          try {
            const d = JSON.parse(n[1].body);
            d.t && (console.log("✅ Turnstile Token Captured:", d.t), window.postMessage({ source: "turnstile-capture", token: d.t }, "*"));
          } catch {
          }
        if ((o.headers.get("content-type") || "").includes("image/png") && r.includes(".png")) {
          const d = o.clone();
          return new Promise(async (w) => {
            const p = crypto.randomUUID(), u = await d.blob();
            a.set(p, (g) => {
              w(new Response(g, {
                headers: d.headers,
                status: d.status,
                statusText: d.statusText
              }));
            }), window.postMessage({
              source: "auto-image-tile",
              endpoint: r,
              blobID: p,
              blobData: u
            }, "*");
          });
        }
      }
      return o;
    };
  }), window.addEventListener("message", (a) => {
    const { source: i, endpoint: n, blobID: o, blobData: r, token: e } = a.data;
    i === "auto-image-tile" && n && o && r && be.processAndRespondToTileRequest(a.data), i === "turnstile-capture" && e && (Ke(e), document.querySelector("#statusText")?.textContent.includes("CAPTCHA") && (s.showAlert("Token captured successfully! You can start the bot now.", "success"), updateUI("colorsFound", "success", { count: t.availableColors.length })));
  });
  async function Ca() {
    console.log("🚀 WPlace Auto-Image with Turnstile Generator loaded"), console.log("🔑 Turnstile generator: ALWAYS ENABLED"), console.log("🎯 Manual pixel captcha solving: DISABLED - fully automated!"), kt().then(() => {
      setTimeout(ma, 1e3), setTimeout(() => {
        const i = document.getElementById("chromaPenaltyWeightSlider"), n = document.getElementById("chromaWeightValue"), o = document.getElementById("resetAdvancedColorBtn"), r = document.getElementById("colorAlgorithmSelect"), e = document.getElementById("enableChromaPenaltyToggle"), d = document.getElementById("transparencyThresholdInput"), w = document.getElementById("whiteThresholdInput"), p = document.getElementById("enableDitheringToggle");
        r && r.addEventListener("change", (u) => {
          t.colorMatchingAlgorithm = u.target.value, saveBotSettings(), _updateResizePreview();
        }), e && e.addEventListener("change", (u) => {
          t.enableChromaPenalty = u.target.checked, saveBotSettings(), _updateResizePreview();
        }), i && n && i.addEventListener("input", (u) => {
          t.chromaPenaltyWeight = parseFloat(u.target.value) || 0.15, n.textContent = t.chromaPenaltyWeight.toFixed(2), saveBotSettings(), _updateResizePreview();
        }), d && d.addEventListener("change", (u) => {
          const g = parseInt(u.target.value, 10);
          !isNaN(g) && g >= 0 && g <= 255 && (t.customTransparencyThreshold = g, CONFIG.TRANSPARENCY_THRESHOLD = g, saveBotSettings(), _updateResizePreview());
        }), w && w.addEventListener("change", (u) => {
          const g = parseInt(u.target.value, 10);
          !isNaN(g) && g >= 200 && g <= 255 && (t.customWhiteThreshold = g, CONFIG.WHITE_THRESHOLD = g, saveBotSettings(), _updateResizePreview());
        }), p && p.addEventListener("change", (u) => {
          t.ditheringEnabled = u.target.checked, saveBotSettings(), _updateResizePreview();
        }), o && o.addEventListener("click", () => {
          t.colorMatchingAlgorithm = "lab", t.enableChromaPenalty = !0, t.chromaPenaltyWeight = 0.15, t.customTransparencyThreshold = CONFIG.TRANSPARENCY_THRESHOLD = 100, t.customWhiteThreshold = CONFIG.WHITE_THRESHOLD = 250, saveBotSettings();
          const u = document.getElementById("colorAlgorithmSelect");
          u && (u.value = "lab");
          const g = document.getElementById("enableChromaPenaltyToggle");
          g && (g.checked = !0), i && (i.value = 0.15), n && (n.textContent = "0.15"), d && (d.value = 100), w && (w.value = 250), _updateResizePreview(), s.showAlert("Advanced color settings reset.", "success");
        });
      }, 500), window.addEventListener("beforeunload", () => {
        s.cleanupTurnstile();
      });
    });
  }
  Ca();
})();
