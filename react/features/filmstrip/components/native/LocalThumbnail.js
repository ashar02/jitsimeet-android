// @flow

import React, { Component } from 'react';
import { View } from 'react-native';

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
class LocalThumbnail extends Component<Props> {
    /**
     * Implements React Component's render.
     *
     * @inheritdoc
     */
    render() {
        const { _localParticipant, participantsCount } = this.props;
        const styleOverrides = {
            aspectRatio: null,
            flex: 1,
            height: 440,
            maxHeight:  participantsCount == 2 ? 400 : participantsCount == 3 ? 100 : participantsCount > 5 ? 100 : 140,
            maxWidth: participantsCount == 2 ? 200 : participantsCount == 3 ? 100 : participantsCount > 5 ? 100 : 140,
            width: 240,
            borderRadius:16,
            marginRight:10
        };
        return (
            <View style = {{aspectRatio: participantsCount == 2 ? 0.6 : 1}}>
                <Thumbnail participant = { _localParticipant } 
                styleOverrides={styleOverrides}
                renderDisplayName = {participantsCount == 3 ? false : participantsCount > 5 ? false : true }
                tileView={true}
                />
            </View>
        );
    }
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
