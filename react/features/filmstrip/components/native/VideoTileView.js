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

import Thumbnail from './Thumbnail';
import styles from './styles';
import { ColorPalette } from '../../../base/styles';

/**
 * The type of the React {@link Component} props of {@link VideoTileView}.
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

    _isAudioCall: boolean
};

/**
 * The margin for each side of the tile view. Taken away from the available
 * height and width for the tile container to display in.
 *
 * @private
 * @type {number}
 */
const MARGIN = 0;

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
class VideoTileView extends Component<Props> {
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
        const { _height, _width, onClick, _isAudioCall } = this.props;
        const rowElements = this._groupIntoRows(this._renderThumbnails(), this._getColumnCount());
        const rowallElements = this._groupIntoRows(this._renderAllThumbnails(), this._getColumnCount());
        const pinnedElement = this._pinnedElement();
        const boxHeight = Dimensions.get('screen').height / 3 - 50;
        const boxWidth = Dimensions.get('screen').width / 2 + 27; 
        
        return (
            <TouchableWithoutFeedback onPress = { onClick }>
            <View>
            {
                    this.props._participants.length > 4 && (   
                        <SafeAreaView
                        style = {{
                            height: _height,
                            width: _width
                        }}>
                        {
                            this.state.pinnedParticipant && (
                                <View>
                                    <Thumbnail
                                        
                                        disableTint={true}
                                        key={this.state.pinnedParticipant?.id}
                                        participant={this.state.pinnedParticipant}
                                        userIndex={-1}
                                        renderDisplayName={true}
                                        styleOverrides={{
                                            aspectRatio: 2,
                                            flex: 0,
                                            height: 200,
                                            maxHeight: 200,
                                            maxWidth: Dimensions.get('screen').width,
                                            width: Dimensions.get('screen').width,
                                           
                                            backgroundColor: ColorPalette.appBackground,
                                            
                                           borderColor: ColorPalette.appBackground,
                                            alignSelf: 'center'
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
                            
                            height: _height,
                            width: _width,
                            
                        }}>
                        
                            <View
                                style = {{
                                    
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
                                        key={index}
                                        disableTint={true}
                                        userIndex={index}
                                        participant={item}
                                        renderDisplayName={true}
                                        styleOverrides={{
                                            aspectRatio: null,
                                            flex: 0.7,
                                            height: Dimensions.get('screen').height / 2,
                                            maxHeight: Dimensions.get('screen').height / 2,
                                            maxWidth: boxWidth,
                                            width: boxWidth,
                                            
                                            backgroundColor: ColorPalette.appBackground,
                                            
                                            
                                            
                                            borderColor: ColorPalette.appBackground
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
          
            {/* <View style={{position:'absolute', right:12,bottom:12}}>
                {
                    this.state.localParticipant &&  <Thumbnail
                    disableTint = { true }
                    key = { this.state.localParticipant?.id }
                    participant = { this.state?.localParticipant }
                    renderDisplayName = { this.props._participants.length == 3 ? false : this.props._participants.length > 5 ? false : true }
                    styleOverrides = {{
                        aspectRatio: null,
                        flex: 1,
                        height: 140,
                        maxHeight: this.props._participants.length == 3 ? 100 : this.props._participants.length > 5 ? 100 :  140 ,
                        maxWidth: this.props._participants.length == 3 ? 100 : this.props._participants.length > 5 ? 100 :  140 ,
                        width: 140,
                        borderRadius:16,
                        backgroundColor:getAvatarBackgroundColor(this.state?.localParticipant.name)
                    }}
                    tileView = { false } />
                }
           
            </View> */}
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
        if (participantCount == 3 && this.props._isAudioCall) {
            return 1;
        }else if(!this.props._isAudioCall && participantCount == 3){
            return 2;
        }
        if(participantCount == 7 || participantCount > 8){
            return 3;
        }
        if (participantCount < 9 ) {
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
        let pinnedParticipant;

        for (const [index,participant] of this.props._participants.entries()) {
            if(this.props._participants.length == 7 || this.props._participants.length == 10 || this.props._participants.length == 5){
                if(index == this.props._participants.length - 1){
                    pinnedParticipant = participant
                }else{
                    participants.push(participant);
                }
                
            }else {
                if(participant.local && this.props._participants.length == 3 && this.props._isAudioCall){

                }else{
                    participants.push(participant);
                }
                   
                
            }
            // if (participant.local) {
            //     localParticipant = participant;
            //     if(this.props._participants.length > 3){
            //         if(participant.pinned || this.props._participants.length == 7 || this.props._participants.length == 10 && index == this.props._participants.length -1){
            //             pinnedParticipant = participant
            //         }else {
            //             participants.push(participant);
            //         }
            //     }
            // } else {
            //     if(participant.pinned || this.props._participants.length == 7  && index == this.props._participants.length -1){
            //         pinnedParticipant = participant
            //     }else {
            //         participants.push(participant);
            //     }
                
            // }
        }
        if(this.state.pinnedParticipant && this.props._participants.length != 10){
            if(this.props._participants.length != 7 && this.props._participants.length != 5  )
            this.setState({pinnedParticipant: null})
        }
        if(!this.state.pinnedParticipant ){
            pinnedParticipant && this.setState({ pinnedParticipant: pinnedParticipant});
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
            height: participantCount == 3 ? tileWidth / 0.47 : tileWidth,
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
            .map((participant, index) => (
                <Thumbnail
                    disableTint = { true }
                    key = { participant.id }
                    userIndex={index}
                    participant = { participant }
                    renderDisplayName = { true }
                    styleOverrides = {{
                        aspectRatio: 0.47,
                        flex: 1,
                        height: this._getTileDimensions().height,
                        maxHeight: this._getTileDimensions().height,
                        maxWidth: null,
                        width: null,
                        backgroundColor: ColorPalette.appBackground,
                        borderColor: ColorPalette.appBackground
                    }}
                    tileView = { true }
                    isLocalUser ={ false }
                    onClick = { this.props.onClick }
                    />));
    }
    _renderAllThumbnails() {

        return this._getSortedParticipants()
            .map((participant, index) => (
                <Thumbnail
                    disableTint = { true }
                    key = { participant.id }
                    userIndex={index}
                    participant = { participant }
                    renderDisplayName = { true }
                    styleOverrides = {{
                        aspectRatio: this.props._participants.length == 9 ? 0.5 :  this.props._participants.length > 8 ? 0.7 : this.props._participants.length == 6 ? 0.7 : this.props._participants.length == 7 ? 0.41 : this.props._participants.length > 7 ? 0.8  : 0.6,
                        flex: 1,
                        height: null,
                        maxHeight: null,
                        maxWidth: null,
                        width: null,
                        backgroundColor: ColorPalette.appBackground,
                        borderColor: ColorPalette.appBackground
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
 * Maps (parts of) the redux state to the associated {@code VideoTileView}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const responsiveUi = state['features/base/responsive-ui'];
    const { startAudioOnly } = state['features/base/settings'];

    return {
        _aspectRatio: responsiveUi.aspectRatio,
        _height: responsiveUi.clientHeight,
        _participants: state['features/base/participants'],
        _width: responsiveUi.clientWidth,
        _isAudioCall: startAudioOnly
    };
}

export default connect(_mapStateToProps)(VideoTileView);