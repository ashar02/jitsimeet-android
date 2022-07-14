// @flow

import React, { Component } from 'react';
import {
    ScrollView,
    TouchableWithoutFeedback,
    View,
    Dimensions,
    FlatList,
    SafeAreaView
} from 'react-native';
import type { Dispatch } from 'redux';

import { connect } from '../../../base/redux';
import { ASPECT_RATIO_NARROW } from '../../../base/responsive-ui/constants';
import { setTileViewDimensions } from '../../actions.native';
import { getAvatarBackgroundColor } from '../../../base/avatar/functions';
import {
    pinParticipant,
    getPinnedParticipant
} from '../../../base/participants';
import Thumbnail from './Thumbnail';
import styles from './styles';
import { ColorPalette } from '../../../base/styles';

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
    onClick: Function,

    _pinnedParticipant: Object
};

/**
 * The margin for each side of the tile view. Taken away from the available
 * height and width for the tile container to display in.
 *
 * @private
 * @type {number}
 */
const MARGIN = 20;

/**
 * The aspect ratio the tiles should display in.
 *
 * @private
 * @type {number}
 */
const TILE_ASPECT_RATIO = 1.12;

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
            localParticipant: null,
            pinnedParticipant: null
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
        const { _height, _width, onClick, _pinnedParticipant } = this.props;
        const rowElements = this._groupIntoRows(this._renderThumbnails(), this._getColumnCount());
        const rowallElements = this._groupIntoRows(this._renderAllThumbnails(), this._getColumnCount());
        const pinnedElement = this._pinnedElement();
        const boxHeight = Dimensions.get('screen').height / 3 - 50;
        const boxWidth = Dimensions.get('screen').width / 2 + 30 
        return (
            <TouchableWithoutFeedback onPress = { onClick }>
            <View>
            {
                    this.props._participants.length > 4 && (   
                        <SafeAreaView
                        style = {{
                            alignSelf: 'flex-start',
                            height: _height,
                            width: _width
                        }}>
                        {
                            _pinnedParticipant && (
                                <View>
                                    <Thumbnail
                                        
                                        disableTint={true}
                                        key={_pinnedParticipant?.id}
                                        participant={_pinnedParticipant}
                                        renderDisplayName={true}
                                        styleOverrides={{
                                            aspectRatio: 2,
                                            flex: 0,
                                            height: 200,
                                            maxHeight: 200,
                                            maxWidth: Dimensions.get('screen').width - 30,
                                            width: Dimensions.get('screen').width - 30,
                                            borderRadius: 8,
                                            backgroundColor: ColorPalette.appBackground,
                                            margin: 15,
                                            justifyContent: 'center',
                                            alignSelf: 'center',
                                            borderWidth: 1,
                                            borderColor: ColorPalette.gray
                                        }}
                                        tileView={true}
                                        isLocalUser={false}
                                        onClick={onClick}
                                    />
                                </View>
                            )

                        }
                            <View
                                style = {{
                                    alignSelf: 'flex-start',
                                    minHeight: _height,
                                    minWidth: _width
                                }}>
                                { rowallElements }
                            </View>
                        
                    </SafeAreaView>
                        )}
                {
                    this.props._participants.length < 4 && (   
                        <SafeAreaView
                        style = {{
                            alignSelf: 'center',
                            height: _height,
                            width: _width
                        }}>
                        
                            <View
                                style = {{
                                    alignSelf: 'center',
                                    minHeight: _height,
                                    minWidth: _width
                                }}>
                                { rowElements }
                            </View>
                        
                    </SafeAreaView>
                        )}
                        { this.props._participants.length == 4 && (
                            <SafeAreaView>
                            <FlatList
                                data={this.props._participants}
                                numColumns={2}
                                renderItem={({ item, index }) => (
                                    <Thumbnail
                                        disableTint={true}
                                        key={item?.id}
                                        participant={item}
                                        renderDisplayName={true}
                                        styleOverrides={{
                                            aspectRatio: 0,
                                            flex: 1,
                                            height: Dimensions.get('screen').height / 3,
                                            maxHeight: Dimensions.get('screen').height / 3,
                                            maxWidth: boxWidth,
                                            width: boxWidth,
                                            borderRadius: 8,
                                            backgroundColor: ColorPalette.appBackground,
                                            margin: 15,
                                            justifyContent: 'center',
                                            alignSelf: 'center',
                                            borderWidth: 1,
                                            borderColor: ColorPalette.gray
                                        }}
                                        tileView={true}
                                        isLocalUser={false}
                                        onClick={onClick}
                                    />
                                )}
                            />
                            </SafeAreaView>
                    )
                }
          
            </View>
            </TouchableWithoutFeedback>
        );
    }

    /**
     * Returns how many columns should be displayed for tile view.
     *
     * @returns {number}
     * @private
     */
    _getColumnCount() {
        const participantCount = this.props._participants.length;

        // For narrow view, tiles should stack on top of each other for a lonely
        // call and a 1:1 call. Otherwise tiles should be grouped into rows of
        // two.
        if (participantCount == 3) {
            return 1;
        }

        if (participantCount === 7 || participantCount > 8) {
            // In wide view, a four person call should display as a 2x2 grid.
            return 3;
        }
        if(participantCount < 9){
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
        let pinnedParticipant;

        for (const [index,participant] of this.props._participants.entries()) {
            if(this.props._participants.length == 7 || this.props._participants.length == 10 || this.props._participants.length == 5){
                if(index == this.props._participants.length - 1 && !this.props._pinnedParticipant){
                    this.props.dispatch(pinParticipant(participant.id));
                }
                else{
                    if(!participant.pinned){
                        participants.push(participant);
                    }
                }
                
            }else {
                if(participant.local && this.props._participants.length == 3 && this.props._isAudioCall){
                    this.props.dispatch(pinParticipant(null));
                }else{
                    if(participant.pinned){
                        this.props.dispatch(pinParticipant(null));
                    }else{
                        participants.push(participant);
                    }
                    
                }
                   
                
            }
           
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
        if (participantCount  <= 6) {
            tileWidth = Math.min(widthToUse / columns );
        }else{
            tileWidth = heightToUse
        }

        return {
            height: participantCount == 3 ? tileWidth / 1.12 : tileWidth,
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
                        style = {[ styles.tileViewRow, {alignSelf: this.props._participants.length == 5 ? 'flex-start' : 'center'} ]}>
                        { thumbnailsInRow }
                    </View>
                );
            }
        }

        return rowElements;
    }

    _pinnedElement(){

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
                        aspectRatio: 1.15,
                        flex: 0,
                        height: this._getTileDimensions().height,
                        maxHeight: null,
                        maxWidth: null,
                        width: null,
                        borderRadius:16,
                        backgroundColor: ColorPalette.appBackground,
                        borderColor: ColorPalette.gray,
                        marginTop: 18,
                    }}
                    tileView = { true }
                    isLocalUser={false}
                    onClick = { this.props.onClick }
                    />));
    }
    _renderAllThumbnails() {

        return this._getSortedParticipants()
            .map(participant => (
                <Thumbnail
                    disableTint = { true }
                    key = { participant.id }
                    participant = { participant }
                    renderDisplayName = { true }
                    styleOverrides = {{
                        aspectRatio: this.props._participants.length == 9 ? 0.58 :  this.props._participants.length > 8 ? 0.94 : this.props._participants.length > 7 ? 1.1  : 0.6,
                        flex: 1,
                        height: null,
                        maxHeight: this._getTileDimensions().height,
                        maxWidth: this._getTileDimensions().height,
                        width: null,
                        borderRadius:8,
                        backgroundColor: ColorPalette.appBackground,
                        borderColor: ColorPalette.gray,
                        borderWidth: 1,
                        margin: 12

                    }}
                    tileView = { true }
                    isLocalUser ={ false }
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
    const participants = state['features/base/participants'];
    const pinnedParticipant = getPinnedParticipant(participants);

    return {
        _aspectRatio: responsiveUi.aspectRatio,
        _height: responsiveUi.clientHeight,
        _participants: state['features/base/participants'],
        _width: responsiveUi.clientWidth,
        _pinnedParticipant: pinnedParticipant
    };
}

export default connect(_mapStateToProps)(TileView);