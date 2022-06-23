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
        backgroundColor: ColorPalette.appBackground,
        paddingHorizontal: 10,
        paddingTop: 14,
        paddingBottom: 8,
        borderWidth: 1,
        borderColor: ColorPalette.gray,
        borderRadius: 20
        
    },
    customeButton: {
        borderRadius: 16,
        borderWidth: 0,
        flex: 0,
        flexDirection: 'row',
        height: 32,
        justifyContent: 'center',
        //marginHorizontal: 17,
        marginTop: 6,
        alignItems: 'center',
        width: 32,
    },

    /**
     * The style of the root/top-level container of {@link Toolbox}.
     */
    toolboxContainer: {
        flexDirection: 'column',
        flexGrow: 0,
        width: '100%',
        maxWidth: Dimensions.get('screen').width - 30,
        height:110,
        maxheight:138,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor:'#242424',
        borderRadius:20,
        alignSelf:'center'
    },
    overflowMenuContainer:{
        width: 165,
        height: 100,
        backgroundColor: '#171717',
        position: 'absolute',
        bottom: 120,
        right: 26,
        borderWidth: 1.25,
        borderColor: ColorPalette.gray,
        borderRadius: 8
    },
    toolBoxSection:{
        flexDirection: 'row',

        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 6,
        backgroundColor: ColorPalette.appBackground
    },
    actionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding:8
    },
    actionTitle:{
        color: '#C4C4C4',
        fontSize: 10,
        fontWeight: '500'
    },
    iconStyle: {
        fontSize:20,
        //color:'#fff'
    },
    iconTitle: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '400',
        paddingTop: 6,
        lineHeight: 9
    },
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
            fontSize: 38,
            fontWeight:'bold'
            
           
        },
        style: {
            flex:0,
            backgroundColor: schemeColor('hangup'),
            width:65,
            height:24,
            borderRadius:8,
            marginRight:15,
            alignItems:'center',
            justifyContent: 'center'
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
