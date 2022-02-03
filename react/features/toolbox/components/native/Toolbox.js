// @flow

import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';

import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { connect } from '../../../base/redux';
import { StyleType } from '../../../base/styles';
import { ChatButton } from '../../../chat';
import { InviteButton } from '../../../invite';
import { TileViewButton } from '../../../video-layout';
import { isToolboxVisible, getMovableButtons } from '../../functions.native';
import AudioMuteButton from '../AudioMuteButton';
import HangupButton from '../HangupButton';
import VideoMuteButton from '../VideoMuteButton';
import { isLocalCameraTrackMuted } from '../../../base/tracks';
import { Avatar } from '../../../base/avatar';
import { AudioRouteButton } from '../../../mobile/audio-mode';
import OverflowMenuButton from './OverflowMenuButton';
import RaiseHandButton from './RaiseHandButton';
import ToggleCameraButton from './ToggleCameraButton';
import styles from './styles';
import { getParticipantById } from '../../../base/participants/functions';

/**
 * The type of {@link Toolbox}'s React {@code Component} props.
 */
type Props = {

    /**
     * The color-schemed stylesheet of the feature.
     */
    _styles: StyleType,

    /**
     * Whether video is currently muted or not.
     */
    _videoMuted: boolean,

    _participant: Object,

    /**
     * The indicator which determines whether the toolbox is visible.
     */
    _visible: boolean,

    /**
     * The width of the screen.
     */
    _width: number,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Implements the conference Toolbox on React Native.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element}.
 */
function Toolbox(props: Props) {
    if (!props._visible) {
        return null;
    }

    const { _styles, _width } = props;
    const { buttonStylesBorderless, hangupButtonStyles, toggledButtonStyles } = _styles;
    const additionalButtons = getMovableButtons(_width);
    const backgroundToggledStyle = {
        ...toggledButtonStyles,
        style: [
            toggledButtonStyles.style,
            _styles.backgroundToggle
        ]
    };
    return (
        <View
            pointerEvents = 'box-none'
            style = { styles.toolboxContainer }>
            <SafeAreaView
                accessibilityRole = 'toolbar'
                pointerEvents = 'box-none'>
                <View style={{marginLeft:14, marginTop:10, flexDirection:'row',  justifyContent:'space-between', alignItems:'center'}}>
                <View style={{alignItems:'center', flexDirection:'row'}}>
                <Avatar
                    participantId = { props?._participant?.id }
                    size = { 50 } />
                   <View>
                <Text style={{color:'#fff', fontWeight:'bold', fontSize:17, paddingLeft:6}}>{props?._participant?.name}</Text>
                <Text style={{color:'#fff', fontSize:14, paddingLeft:6}}>Circleit call</Text>
                </View>
                </View>
                <View>
                <HangupButton
                    styles = { hangupButtonStyles } />
                </View>
                </View>
                <View style = { styles.toolbox }>
                <AudioRouteButton 
                styles = { buttonStylesBorderless }
                toggledStyles = { toggledButtonStyles }
                />
                <VideoMuteButton
                    styles = { buttonStylesBorderless }
                    toggledStyles = { toggledButtonStyles } />
                <ToggleCameraButton
                          styles = { buttonStylesBorderless }
                          toggledStyles = { backgroundToggledStyle } />
                <AudioMuteButton
                    styles = { buttonStylesBorderless }
                    toggledStyles = { toggledButtonStyles } />
                { false
                      && <ChatButton
                          styles = { buttonStylesBorderless }
                          toggledStyles = { backgroundToggledStyle } />}

                { additionalButtons.has('raisehand')
                      && <RaiseHandButton
                          styles = { buttonStylesBorderless }
                          toggledStyles = { backgroundToggledStyle } />}
                {additionalButtons.has('tileview') && <TileViewButton styles = { buttonStylesBorderless } />}
                {additionalButtons.has('invite') && <InviteButton styles = { buttonStylesBorderless } />}
                {/* {additionalButtons.has('togglecamera')
                      && !props._videoMuted && <ToggleCameraButton
                          styles = { buttonStylesBorderless }
                          toggledStyles = { backgroundToggledStyle } />} */}
                
                {/* <OverflowMenuButton
                    styles = { buttonStylesBorderless }
                    toggledStyles = { toggledButtonStyles } /> */}

               
                </View>
               
            </SafeAreaView>
        </View>
    );
}

/**
 * Maps parts of the redux state to {@link Toolbox} (React {@code Component})
 * props.
 *
 * @param {Object} state - The redux state of which parts are to be mapped to
 * {@code Toolbox} props.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state: Object): Object {
    const tracks = state['features/base/tracks'];
    const participant = getParticipantById(state, state['features/large-video'].participantId);
    return {
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
        _visible: isToolboxVisible(state),
        _width: state['features/base/responsive-ui'].clientWidth,
        _videoMuted: isLocalCameraTrackMuted(tracks),
        _participant: participant
    };
}

export default connect(_mapStateToProps)(Toolbox);
