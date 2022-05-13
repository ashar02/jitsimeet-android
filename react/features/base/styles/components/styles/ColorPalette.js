/**
 * The application's definition of the default color black.
 */
const BLACK = '#111111';

const NewBlack = '#181818';
/**
 * The application's color palette.
 */
export const ColorPalette = {
    /**
     * The application's background color.
     */
    appBackground: NewBlack,

    /**
     * The application's definition of the default color black. Generally,
     * expected to be kept in sync with the application's background color for
     * the sake of consistency.
     */
    black: BLACK,
    blackBlue: 'rgb(0, 3, 6)',
    blue: '#17A0DB',
    blueHighlight: '#1081b2',
    buttonUnderlay: '#495258',
    darkGrey: '#555555',
    darkBackground: 'rgb(19,21,25)',
    green: '#40b183',
    lightGrey: '#AAAAAA',
    overflowMenuItemUnderlay: '#EEEEEE',
    red: '#EB5757',
    transparent: 'rgba(0, 0, 0, 0)',
    toggled: 'rgba(115,115,115,0.5)',
    warning: 'rgb(215, 121, 118)',
    white: '#FFFFFF',
    yellow: '#FFD05A',
    magenta: '#7B355C',
    boxBackground: '#757575',
    seaGreen: '#1A6D82',
    gray: '#C4C4C4',
    searGreenLight: '#27A3BF',

    /**
     * These are colors from the atlaskit to be used on mobile, when needed.
     *
     * FIXME: Maybe a better solution would be good, or a native packaging of
     * the respective atlaskit components.
     */
    G400: '#00875A', // Slime
    N500: '#42526E', // McFanning
    R400: '#DE350B', // Red dirt
    Y200: '#FFC400' // Pub mix
};
