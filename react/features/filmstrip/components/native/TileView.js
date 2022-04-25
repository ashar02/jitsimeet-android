// @flow

import React, { Component } from 'react';
import {
    ScrollView,
    TouchableWithoutFeedback,
    View,
    Dimensions
} from 'react-native';
import type { Dispatch } from 'redux';

import { connect } from '../../../base/redux';
import { ASPECT_RATIO_NARROW } from '../../../base/responsive-ui/constants';
import { setTileViewDimensions } from '../../actions.native';
import { getAvatarBackgroundColor } from '../../../base/avatar/functions';

import Thumbnail from './Thumbnail';
import styles from './styles';

/**
 * The type of the React {@link Component} props of {@link TileView}.
 */
type Props = {

    /**
     * Application's aspect ratio.
     */
    _aspectRatio: Symbol,

    /**
     * Application's viewport height.
     */
    _height: number,

    /**
     * The participants in the conference.
     */
    _participants: Array<Object>,

    /**
     * Application's viewport height.
     */
    _width: number,

    /**
     * Invoked to update the receiver video quality.
     */
    dispatch: Dispatch<any>,

    /**
     * Callback to invoke when tile view is tapped.
     */
    onClick: Function
};

/**
 * The margin for each side of the tile view. Taken away from the available
 * height and width for the tile container to display in.
 *
 * @private
 * @type {number}
 */
const MARGIN = 10;

/**
 * The aspect ratio the tiles should display in.
 *
 * @private
 * @type {number}
 */
const TILE_ASPECT_RATIO = 1;

/**
 * Implements a React {@link Component} which displays thumbnails in a two
 * dimensional grid.
 *
 * @extends Component
 */
class TileView extends Component<Props> {
    constructor(props){
        super(props);
        this.state={
            localParticipant: null
        }
    }
    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._updateReceiverQuality();
    }

    /**
     * Implements React's {@link Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate() {
        this._updateReceiverQuality();
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _height, _width, onClick } = this.props;
        const rowElements = this._groupIntoRows(this._renderThumbnails(), this._getColumnCount());
        const boxHeight = Dimensions.get('screen').height / 3 - 50;
        const boxWidth = Dimensions.get('screen').width / 2 + 30 
        return (
            <View>
             {
                    this.props._participants.length !== 4 ? (
            <ScrollView
                style = {{
                    ...styles.tileView,
                    height: _height,
                    width: _width
                }}>
                <TouchableWithoutFeedback onPress = { onClick }>
                    <View
                        style = {{
                            ...styles.tileViewRows,
                            minHeight: _height,
                            minWidth: _width
                        }}>
                        { rowElements }
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
             ):(
                this._getSortedParticipants().map(function (participant, index) {
                    return(
                        <View style={{position:'absolute', left: index%2 !== 0 ? Dimensions.get('screen').width - 250:10, top: index== 0 ? 58 : index == 1 ? index*boxHeight+40 : index*boxHeight+20 }}>
                            <Thumbnail
                                disableTint={true}
                                key={participant?.id}
                                participant={participant}
                                renderDisplayName={true}
                                styleOverrides={{
                                    aspectRatio: null,
                                    flex: 1,
                                    height: boxHeight,
                                    maxHeight: boxHeight,
                                    maxWidth: boxWidth,
                                    width: boxWidth,
                                    borderRadius: 16,
                                    backgroundColor: getAvatarBackgroundColor(this.state?.localParticipant.name)
                                }}
                                tileView={true}
                                onClick={ onClick }
                                isLocalUser={false}
                                />
                        </View>
                    )
                })
            )
        }
    
            {/* <View style={{position:'absolute', right:12,bottom:12}}>
                {
                    this.state.localParticipant && <Thumbnail
                    disableTint = { true }
                    key = { this.state.localParticipant?.id }
                    participant = { this.state?.localParticipant }
                    renderDisplayName = {this.props._participants.length == 3 ? false : this.props._participants.length > 5 ? false : true }
                    styleOverrides = {{
                        aspectRatio: null,
                        flex: 1,
                        height: 140,
                        maxHeight: this.props._participants.length == 3 ? 100 : this.props._participants.length > 5 ? 100 :  140 ,
                        maxWidth: this.props._participants.length == 3 ? 100 : this.props._participants.length > 5 ? 100 :  140,
                        width: 140,
                        borderRadius:16,
                        backgroundColor:getAvatarBackgroundColor(this.state?.localParticipant.name),
                        
                    }}
                    tileView = { false } />
                }
           
            </View> */}
            
            </View>
        );
    }

    /**
     * Returns how many columns should be displayed for tile view.
     *
     * @returns {number}
     * @private
     */
    _getColumnCount() {
        const participantCount = this.props._participants.length - 1;

        // For narrow view, tiles should stack on top of each other for a lonely
        // call and a 1:1 call. Otherwise tiles should be grouped into rows of
        // two.
        if (this.props._aspectRatio === ASPECT_RATIO_NARROW) {
            return participantCount >= 3 ? 2 : 1;
        }

        if (participantCount === 4) {
            // In wide view, a four person call should display as a 2x2 grid.
            return 2;
        }

        return Math.min(3, participantCount);
    }

    /**
     * Returns all participants with the local participant at the end.
     *
     * @private
     * @returns {Participant[]}
     */
    _getSortedParticipants() {
        const participants = [];
        let localParticipant;

        for (const participant of this.props._participants) {
            if (participant.local) {
                localParticipant = participant;
            } else {
                participants.push(participant);
            }
        }
        if(!this.state.localParticipant){
        localParticipant && this.setState({localParticipant: localParticipant});
        }

        return participants;
    }

    /**
     * Calculate the height and width for the tiles.
     *
     * @private
     * @returns {Object}
     */
    _getTileDimensions() {
        const { _height, _participants, _width } = this.props;
        const columns = this._getColumnCount();
        const participantCount = _participants.length;
        const heightToUse = _height - (MARGIN * 2);
        const widthToUse = _width - (MARGIN * 2);
        let tileWidth;

        // If there is going to be at least two rows, ensure that at least two
        // rows display fully on screen.
        if (participantCount / columns > 1) {
            tileWidth = Math.min(widthToUse / columns, heightToUse / 2.5);
        } else {
            tileWidth = Math.min(widthToUse / columns, heightToUse);
        }

        return {
            height: tileWidth / TILE_ASPECT_RATIO,
            width: tileWidth
        };
    }

    /**
     * Splits a list of thumbnails into React Elements with a maximum of
     * {@link rowLength} thumbnails in each.
     *
     * @param {Array} thumbnails - The list of thumbnails that should be split
     * into separate row groupings.
     * @param {number} rowLength - How many thumbnails should be in each row.
     * @private
     * @returns {ReactElement[]}
     */
    _groupIntoRows(thumbnails, rowLength) {
        const rowElements = [];

        for (let i = 0; i < thumbnails.length; i++) {
            if (i % rowLength === 0) {
                const thumbnailsInRow = thumbnails.slice(i, i + rowLength);

                rowElements.push(
                    <View
                        key = { rowElements.length }
                        style = { styles.tileViewRow }>
                        { thumbnailsInRow }
                    </View>
                );
            }
        }

        return rowElements;
    }

    /**
     * Creates React Elements to display each participant in a thumbnail. Each
     * tile will be.
     *
     * @private
     * @returns {ReactElement[]}
     */
    _renderThumbnails() {
        
        return this._getSortedParticipants()
            .map(participant => (
                <Thumbnail
                    disableTint = { true }
                    key = { participant.id }
                    participant = { participant }
                    renderDisplayName = { true }
                    styleOverrides = {{
                        aspectRatio: TILE_ASPECT_RATIO,
                        flex: 0,
                        height: this._getTileDimensions().height,
                        maxHeight: null,
                        maxWidth: null,
                        width: null,
                        borderRadius:16,
                        backgroundColor:getAvatarBackgroundColor(participant.name)
                    }}
                    tileView = { true }
                    isLocalUser={false}
                    onClick = { this.props.onClick }
                    />));
    }

    /**
     * Sets the receiver video quality based on the dimensions of the thumbnails
     * that are displayed.
     *
     * @private
     * @returns {void}
     */
    _updateReceiverQuality() {
        const { height, width } = this._getTileDimensions();

        this.props.dispatch(setTileViewDimensions({
            thumbnailSize: {
                height,
                width
            }
        }));
    }
}

/**
 * Maps (parts of) the redux state to the associated {@code TileView}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const responsiveUi = state['features/base/responsive-ui'];

    return {
        _aspectRatio: responsiveUi.aspectRatio,
        _height: responsiveUi.clientHeight,
        _participants: state['features/base/participants'],
        _width: responsiveUi.clientWidth
    };
}

export default connect(_mapStateToProps)(TileView);