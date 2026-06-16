export default class Glossary {
    static mineFieldName = 'mine';
    static bombFieldName = 'bomb';
    static flagFieldName = 'flag';
    static questionFieldName = 'question';
    static pressedButtonClassName = 'pressed';
    
    static difficultySettingsNames = {
        easy: 'easy',
        normal: 'normal',
        hard: 'hard',
        custom: 'custom'
    };

    static widthInputId = 'widthInput';
    static heightInputId = 'heightInput';
    static minesInputId = 'minesInput';

    static minFieldDimension = 2;
    static maxFieldDimension = 99;
    static maxFieldDimensionDigits = 2;
    static minMinesCount = 1;
    static maxMinesCount = 999;
    static maxMinesCountDigits = 3;

    static gameWrapperId = 'gameWrapper';
    static minerFieldId = 'minerField';
    static minesLeftId = 'minesLeft';
    static updateGameId = 'updateGame';
    
    static infoButtonId = 'infoButton';
    static infoBlockId = 'infoBlock';
    static infoTextId = 'infoText';

    static closedCellClassName = 'closed';
    static emptyCellClassName = 'empty';
    static fieldClassName = 'field';
    static newGameClassName = 'newGame';
    static failGameClassName = 'failGame';
    static winGameClassName = 'winGame';

    static cellWidthPx = 21;
    static wrapperWidthThresholdPx = 240;
    static minWrapperWidthPx = 250;
    static wrapperPaddingPx = 20;
}

export const DIFFICULTY_SETTINGS = {
    [Glossary.difficultySettingsNames.easy]: {
        width: 9,
        height: 9,
        mines: 10
    },
    [Glossary.difficultySettingsNames.normal]: {
        width: 16,
        height: 16,
        mines: 40
    },
    [Glossary.difficultySettingsNames.hard]: {
        width: 30,
        height: 16,
        mines: 99
    }
};