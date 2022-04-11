// @flow

import React, { useState, useEffect } from 'react';
import { View, NativeModules, LayoutAnimation, Dimensions, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { getLocalParticipant } from '../../../base/participants';
import { connect } from '../../../base/redux';

import Thumbnail from './Thumbnail';
import styles from './styles';

type Props = {

    /**
     * The local participant.
     */
    _localParticipant: Object
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

    const animateCurrentUserBoxSize  = () => {
        if(props.participantsCount == 2){
            LayoutAnimation.spring();
            setBoxWidth(boxWidth == 100 ? 140 : 100);
            setBoxHeight(boxHeight == 300 ? 390 : 300)
        }
    }
    useEffect(()=>{
        let heightOfBox = props.participantsCount == 2 ? 390 : props.participantsCount == 3 ? 100 : props.participantsCount > 5 ? 100 : 390;
        let widthOfBox = props.participantsCount == 2 ? 140 : props.participantsCount == 3 ? 100 : props.participantsCount > 5 ? 100 : 140; 
        if(props.participantsCount >= 2){
        LayoutAnimation.spring();
        setBoxHeight(heightOfBox);
        setBoxWidth(widthOfBox);
        }
     }, [props._renderVideo, props.participantsCount])
   
     const styleOverrides = {
        aspectRatio: 1,
        flex: 1,
        height: boxHeight,
        maxHeight:  boxHeight,
        maxWidth: boxWidth,
        width: boxWidth,
        borderRadius:participantsCount == 2 ? 12 : 16,
        marginRight:10,
        marginBottom:15,
        alignSelf: 'center'
    };
        return (
            <View style = {{aspectRatio: participantsCount <= 2 ? 0.6 : 1}}>
                <TouchableWithoutFeedback onPress={animateCurrentUserBoxSize}>
                <Thumbnail participant = { _localParticipant } 
                styleOverrides={styleOverrides}
                renderDisplayName = {participantsCount == 3 ? false : participantsCount > 5 ? false : true }
                tileView={false}
                />
                </TouchableWithoutFeedback>
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
        _localParticipant: getLocalParticipant(state)
    };
}

export default connect(_mapStateToProps)(LocalThumbnail);
