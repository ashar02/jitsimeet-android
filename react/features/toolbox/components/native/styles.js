// @flow

import { ColorSchemeRegistry, schemeColor } from '../../../base/color-scheme';
import { BoxModel, ColorPalette } from '../../../base/styles';
import {Dimensions} from 'react-native';

const BUTTON_SIZE = 30;

// Toolbox, toolbar:

/**
 * The style of toolbar buttons.
 */
const toolbarButton = {
    borderRadius: 24,
    borderWidth: 0,
    flex: 0,
    flexDirection: 'row',
    height: BUTTON_SIZE,
    justifyContent: 'center',
    marginHorizontal: 18,
    marginTop: 6,
    width: BUTTON_SIZE,
    backgroundColor: 'rgba(115, 115, 115, 0.5)'
};

/**
 * The icon style of the toolbar buttons.
 */
const toolbarButtonIcon = {
    alignSelf: 'center',
    color: ColorPalette.darkGrey,
    fontSize: 24
};


/**
 * The icon style of toolbar buttons which display white icons.
 */
const whiteToolbarButtonIcon = {
    ...toolbarButtonIcon,
    color: ColorPalette.white
};

/**
 * The Toolbox and toolbar related styles.
 */
const styles = {

    expandMenuContainer: {
        alignItems: 'center',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        flexDirection: 'column'
    },

    sheetGestureRecognizer: {
        alignItems: 'stretch',
        flexDirection: 'column'
    },

    /**
     * The style of the toolbar.
     */
    toolbox: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        flexDirection: 'row',
        flexGrow: 0,
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        paddingVertical: 5,
        
        
    },

    /**
     * The style of the root/top-level container of {@link Toolbox}.
     */
    toolboxContainer: {
        flexDirection: 'column',
        flexGrow: 0,
        width: '100%',
        maxWidth: Dimensions.get('screen').width - 14,
        height:110,
        maxheight:130,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor:'#242424',
        borderRadius:35,
        alignSelf:'center'
    }
};

export default styles;

/**
 * Color schemed styles for the @{Toolbox} component.
 */
ColorSchemeRegistry.register('Toolbox', {
    /**
     * Styles for buttons in the toolbar.
     */
    buttonStyles: {
        iconStyle: toolbarButtonIcon,
        style: toolbarButton
    },

    buttonStylesBorderless: {
        iconStyle: whiteToolbarButtonIcon,
        style: {
            ...toolbarButton,
        }
    },

    backgroundToggle: {
        backgroundColor: ColorPalette.toggled
    },

    hangupButtonStyles: {
        iconStyle: {
            color: ColorPalette.darkGrey,
            fontSize: 30,
            alignSelf:'center',
            marginTop:3
           
        },
        style: {
            flex:0,
            backgroundColor: schemeColor('hangup'),
            width:72,
            height:34,
            borderRadius:16,
            marginRight:15,
        },
        underlayColor: ColorPalette.buttonUnderlay
    },

    /**
     * Styles for toggled buttons in the toolbar.
     */
    toggledButtonStyles: {
        iconStyle: whiteToolbarButtonIcon,
        style: {
            ...toolbarButton
        }
    }
});
