// @flow

import React, { useState, useEffect } from 'react';
import { View, NativeModules, LayoutAnimation, Dimensions, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { getLocalParticipant } from '../../../base/participants';
import { connect } from '../../../base/redux';

import Thumbnail from './Thumbnail';
import styles from './styles';
import { isToolboxVisible } from '../../../toolbox/functions.native';

type Props = {

    /**
     * The local participant.
     */
    _localParticipant: Object,

    /**
     * The indicator which determines whether the Toolbox is visible.
     */
     _toolboxVisible: boolean,
};

/**
 * Component to render a local thumbnail that can be separated from the
 * remote thumbnails later.
 */
function LocalThumbnail (props: Props) {

    const { UIManager } = NativeModules;
    UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

    const { _localParticipant, participantsCount } = props;
    const [boxWidth, setBoxWidth] = useState(0);
    const [boxHeight, setBoxHeight] = useState(0);

    // const animateCurrentUserBoxSize  = () => {
    //     if(props.participantsCount == 2){
    //         //LayoutAnimation.spring();
    //         setBoxWidth(boxWidth == 100 ? 140 : 100);
    //         setBoxHeight(boxHeight == 300 ? 390 : 300)
    //     } else if (props.participantsCount > 2){
    //         setBoxWidth(boxWidth == 100 ? 140 : 100);
    //         setBoxHeight(boxHeight == 100 ? 140 : 100)
    //     }
    // }
    const animateCurrentUserBoxSizeOnSlidingPanel  = (isToolbarHide) => {
        if(props.participantsCount == 2 && isToolbarHide){
            //LayoutAnimation.spring();
            setBoxWidth(160);
            setBoxHeight(270)
        } else if(props.participantsCount == 2 && !isToolbarHide){
            //LayoutAnimation.spring();
            setBoxWidth(100);
            setBoxHeight(190)
        } else if(props.participantsCount > 2 && isToolbarHide){
            //LayoutAnimation.spring();
            setBoxWidth(135);
            setBoxHeight(140)
        }
        else if(props.participantsCount > 2 && !isToolbarHide){
            //LayoutAnimation.spring();
            setBoxWidth(100);
            setBoxHeight(100)
        }
    }
    useEffect(()=>{           
        let heightOfBox = props.participantsCount == 2 ? 270 : props.participantsCount == 3 ? 100 : props.participantsCount > 5 ? 100 : 135;
        let widthOfBox = props.participantsCount == 2 ? 140 : props.participantsCount == 3 ? 100 : props.participantsCount > 5 ? 100 : 140; 
        if(props.participantsCount >= 2){
        LayoutAnimation.spring();
        setBoxHeight(heightOfBox);
        setBoxWidth(widthOfBox);
        }
     }, [props.participantsCount])

     useEffect(() => {
         animateCurrentUserBoxSizeOnSlidingPanel(props._toolboxVisible)
      }, [props._toolboxVisible])
   
     const styleOverrides = {
        aspectRatio: 1,
        flex: 1,
        height: boxHeight,
        maxHeight:  boxHeight,
        maxWidth: boxWidth,
        width: boxWidth,
        borderRadius:participantsCount == 2 ? 6 : 16,
        marginRight:10,
        marginBottom:15,
        alignSelf: 'center'
    }
        return (
            <View style = {{aspectRatio: participantsCount <= 2 ? 0.6 : 1}}>
                <Thumbnail participant = { _localParticipant } 
                styleOverrides={styleOverrides}
                renderDisplayName = {participantsCount == 3 ? false : participantsCount > 5 ? false : true }
                tileView={false}
                isLocalUser={true}
                />
            </View>
        );
}

/**
 * Maps (parts of) the redux state to the associated {@code LocalThumbnail}'s
 * props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {{
 *     _localParticipant: Participant
 * }}
 */
function _mapStateToProps(state) {
    return {
        /**
         * The local participant.
         *
         * @private
         * @type {Participant}
         */
        _localParticipant: getLocalParticipant(state),
        _toolboxVisible: isToolboxVisible(state)
    };
}

export default connect(_mapStateToProps)(LocalThumbnail);
