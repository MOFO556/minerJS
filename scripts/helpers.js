
import Glossary from './glossary';

export function formatBoundedNumericInput(value, { max, maxDigits }) {
  if (value === '' || value === null || value === undefined) {
    return '';
  }
  const digits = String(value).replace(/\D/g, '');
  if (digits === '') {
    return '';
  }
  let num = parseInt(digits, 10);
  if (!Number.isFinite(num)) {
    return '';
  }
  if (num > max) {
    num = max;
  }
  let result = String(num);
  if (maxDigits !== undefined && result.length > maxDigits) {
    result = String(max);
  }
  return result;
}

export function bindBoundedNumericInput(input, { min, max, maxDigits }) {
  input.addEventListener('keydown', (event) => {
    if (['e', 'E', '+', '-', '.'].includes(event.key)) {
      event.preventDefault();
    }
  });
  input.addEventListener('input', () => {
    const formatted = formatBoundedNumericInput(input.value, { max, maxDigits });
    if (input.value !== formatted) {
      input.value = formatted;
    }
  });
  input.addEventListener('blur', () => {
    if (input.value === '') {
      return;
    }
    const num = parseInt(input.value, 10);
    if (num < min) {
      input.value = String(min);
    }
  });
}

export function bindCustomInputValidation() {
  bindBoundedNumericInput(document.getElementById(Glossary.widthInputId), {
    min: Glossary.minFieldDimension,
    max: Glossary.maxFieldDimension,
    maxDigits: Glossary.maxFieldDimensionDigits,
  });
  bindBoundedNumericInput(document.getElementById(Glossary.heightInputId), {
    min: Glossary.minFieldDimension,
    max: Glossary.maxFieldDimension,
    maxDigits: Glossary.maxFieldDimensionDigits,
  });
  bindBoundedNumericInput(document.getElementById(Glossary.minesInputId), {
    min: Glossary.minMinesCount,
    max: Glossary.maxMinesCount,
    maxDigits: Glossary.maxMinesCountDigits,
  });
}

export function parsePositiveInt(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const parsed = parseInt(String(value), 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }
  return parsed;
}

export function normalizeMinesCount(width, height, requestedMines) {
  const area = width * height;
  if (area > requestedMines) {
    return requestedMines;
  }
  return area - 1;
}

export function countMines(width, height, mines) {
  return normalizeMinesCount(width, height, mines);
}

export function resolveDifficultyParameters(width, height, mines) {
  const resolvedWidth = parsePositiveInt(width);
  const resolvedHeight = parsePositiveInt(height);
  const resolvedMines = parsePositiveInt(mines);

  if (resolvedWidth === null || resolvedHeight === null || resolvedMines === null) {
    return {
      ok: false,
      message: 'Custom difficulty requires width, height, and mines to be filled in.',
    };
  }

  if (resolvedWidth < Glossary.minFieldDimension || resolvedHeight < Glossary.minFieldDimension) {
    return {
      ok: false,
      message: 'Field size must be at least 2x2.',
    };
  }

  if (resolvedWidth > Glossary.maxFieldDimension || resolvedHeight > Glossary.maxFieldDimension) {
    return {
      ok: false,
      message: `Field width and height cannot exceed ${Glossary.maxFieldDimension}.`,
    };
  }

  if (resolvedMines > Glossary.maxMinesCount) {
    return {
      ok: false,
      message: `Mines count cannot exceed ${Glossary.maxMinesCount}.`,
    };
  }

  const warnings = [];
  const actualMines = normalizeMinesCount(resolvedWidth, resolvedHeight, resolvedMines);

  if (actualMines !== resolvedMines) {
    warnings.push(
      `Cannot place ${resolvedMines} mines on a ${resolvedWidth}x${resolvedHeight} field. Using ${actualMines} mines instead.`
    );
  }

  if (actualMines < 1) {
    return {
      ok: false,
      message: `At least 1 mine is required for a ${resolvedWidth}x${resolvedHeight} field.`,
    };
  }

  return {
    ok: true,
    width: resolvedWidth,
    height: resolvedHeight,
    mines: actualMines,
    requested: {
      width: resolvedWidth,
      height: resolvedHeight,
      mines: resolvedMines,
    },
    warnings,
  };
}

export function settingsToTuple({ width, height, mines }) {
  return [width, height, mines];
}

export function validateFieldParams(width, height, mines) {
  if (width < 2 || height < 2) {
    throw new Error('Field size must be at least 2x2');
  }
  if (mines < 1) {
    throw new Error('At least 1 mine is required');
  }
  if (mines > width * height) {
    throw new Error('Number of mines cannot be greater than field area');
  }
}

export function hideInfo()  {
  let infoWindow = document.getElementById("infoBlock");
  if (infoWindow.style.display === "block") {infoWindow.style.display = "none";}
}

export function disableCustom()  {
  let parametres = document.getElementsByTagName("input");
  for (let parametre of parametres) {
    if (document.getElementById("custom").classList.contains("pressed"))  {
      parametre.disabled = false;
    }
    else {
      parametre.disabled = true;
    }
  }
}
