import { StyleSheet } from 'react-native';

import { ColorSchemeRegistry, schemeColor } from '../../base/color-scheme';
import { ColorPalette } from '../../base/styles';

/**
 * Size for the Avatar.
 */
export const AVATAR_SIZE = 150;

/**
 * Color schemed styles for the @{LargeVideo} component.
 */
ColorSchemeRegistry.register('LargeVideo', {

    /**
     * Large video container style.
     */
    largeVideo: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'stretch',
        backgroundColor: ColorPalette.appBackground,
        flex: 1,
        justifyContent: 'center'
    }
});
