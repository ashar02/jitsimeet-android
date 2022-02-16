// @flow

import React, {useState} from 'react';
import { SafeAreaView, View, Text, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';

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
     * The participants in the conference.
     */
      _participants: Array<Object>,

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
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View
            pointerEvents = 'box-none'
            style = { styles.toolboxContainer }>
            <SafeAreaView
                accessibilityRole = 'toolbar'
                pointerEvents = 'box-none'>
                    <TouchableWithoutFeedback onPress={()=> setModalVisible(true)}>
                <View style={{marginLeft:14, marginTop:10, flexDirection:'row',  justifyContent:'space-between', alignItems:'center'}}>
                <View style={{alignItems:'center', flexDirection:'row'}}>
                <Avatar
                    participantId = { props?._participant?.id }
                    size = { 50 } />
                   <View>
                <Text style={{color:'#fff', fontWeight:'bold', fontSize:17, paddingLeft:6}}>{props?._participant?.name}</Text>
                <Text style={{color:'#fff', fontSize:14, paddingLeft:6}}>Circleit {props._videoMuted ? 'audio' : 'video'} call</Text>
                </View>
                </View>
                <View>
                <HangupButton
                    styles = { hangupButtonStyles } />
                </View>
                </View>
                </TouchableWithoutFeedback>
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
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center", backgroundColor: '#564732', opacity: 0.98
                    }}>

                        <View style={{ position: 'absolute', right: 20, top: 50 }}>
                            <Text style={{ fontSize: 14, color: '#fff', fontWeight: 'bold' }} onPress={() => setModalVisible(false)}>Done</Text>
                        </View>

                        <View style={{ alignSelf: 'center' }}>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                {
                                    props._participants.map(function (participant, index) {
                                        return (
                                            <View style={{ marginLeft: -10, marginTop: 4 }}>
                                                <Avatar
                                                    participantId={participant?.id}
                                                    size={50} />
                                            </View>
                                        )
                                    })
                                }
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 12 }}>
                                {props._participants?.length <= 3 ? (
                                    props._participants?.map(function (user, index) {
                                        return (
                                            <Text
                                                ellipsizeMode="tail"
                                                numberOfLines={1}
                                                style={{
                                                    color: '#ffffff',
                                                    fontSize: 18, fontWeight: 'bold'
                                                }}>
                                                {user.name}
                                                {props._participants.length == 2 && props._participants.length - 1 !== index ? ' & ' : props._participants.length - 1 == index ? '' : ', '}
                                            </Text>
                                        );
                                    })
                                ) : (
                                    <Text style={{
                                        color: '#ffffff',
                                        fontSize: 14,
                                    }}>
                                        {`${props._participants[0]?.name} and ${props._participants?.length - 1
                                            } others`}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={{ borderRadius: 12, width: Dimensions.get('screen').width - 60, backgroundColor: '#343333', opacity: 0.7, alignSelf: 'center', marginTop: 50 }}>
                            <View style={{ margin: 12 }}>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#fff', paddingBottom: 8 }}>
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>CircleIt</Text>
                                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{props._participants.length} People Active</Text>
                                </View>

                                {
                                    props._participants.map(function (participant, index) {
                                        return (
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                                <View>
                                                    <Avatar
                                                        participantId={participant?.id}
                                                        size={40} />
                                                </View>
                                                <View style={{ marginLeft: 12 }}>
                                                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                                                        {participant.name}
                                                    </Text>
                                                    <Text style={{ color: '#fff', fontSize: 12 }}>
                                                        circleit {props._videoMuted ? 'audio' : 'video'} call
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </View>
                </Modal>
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
    const participants =  state['features/base/participants'];
    return {
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
        _visible: isToolboxVisible(state),
        _width: state['features/base/responsive-ui'].clientWidth,
        _videoMuted: isLocalCameraTrackMuted(tracks),
        _participant: participant,
        _participants: participants
    };
}

export default connect(_mapStateToProps)(Toolbox);
