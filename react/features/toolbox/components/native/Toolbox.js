// @flow

import React, {useState} from 'react';
import { SafeAreaView, View, Text, Modal, TouchableWithoutFeedback, Dimensions, Animated } from 'react-native';
import { ColorPalette } from '../../../base/styles';
import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { connect } from '../../../base/redux';
import { StyleType } from '../../../base/styles';
import { ChatButton } from '../../../chat';
import { InviteButton } from '../../../invite';
import { TileViewButton } from '../../../video-layout';
import { isToolboxVisible, getMovableButtons } from '../../functions.native';
import AudioMuteButton from '../AudioMuteButton';
import {SecureIcon} from '../../../base/icons';
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
import { isLocalTrackMuted } from '../../../base/tracks';
import { MEDIA_TYPE } from '../../../base/media';
import ConferenceTimer from '../../../conference/components/ConferenceTimer';

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
     * Whether audio is currently muted or not.
     */
     _audioMuted: boolean,

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
    const [cameraFlipToogle, setCameraFlipToogle] = useState(false);
    return (
        <View>
        <Animated.View
            pointerEvents = 'box-none'
            style = { styles.toolboxContainer }>
            <SafeAreaView
                accessibilityRole = 'toolbar'
                pointerEvents = 'box-none'>
                
                <View style={styles.toolbox}>
                <View style={{marginLeft:14,marginTop:0, flexDirection:'row',  justifyContent:'space-between', alignItems:'center'}}>
                <View style={{alignItems:'center', flexDirection:'row'}}>
                <Avatar
                    participantId = { props?._participant?.id }
                    size = { 50 } />
                   <View>
                   <Text style={{color:'#fff', fontWeight:'bold', fontSize:15, paddingLeft: 10}}>{props?._participant?.name}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 4, paddingLeft: 10}}>
                <SecureIcon/>
                <Text style={{color:'#fff', fontSize:12 }}> Secure {props._videoMuted ? 'Audio' : 'Video'} Call</Text>
                </View>
                </View>
                </View>
                <View>
                    
                <HangupButton
                    styles = { hangupButtonStyles } />
                </View>
                </View>
               
                <View style = { styles.toolBoxSection }>
                <View style={{alignItems: 'center'}}>
                <ToggleCameraButton
                    cameraFlipToogle={()=>setCameraFlipToogle(!cameraFlipToogle)}
                    styles = {{iconStyle:styles.iconStyle, style: [styles.customeButton,{
                        backgroundColor: cameraFlipToogle == true ? ColorPalette.searGreenLight : ColorPalette.magenta}]}}
                     />
                <Text style={styles.iconTitle}>FLIP</Text>
                </View>
                {/* <AudioRouteButton 
                styles = {{iconStyle:{fontSize:24, color:'#000'}, style: {borderRadius: 20,
                    borderWidth: 0,
                    flex: 0,
                    flexDirection: 'row',
                    height: 40,
                    justifyContent: 'center',
                    marginHorizontal: 16,
                    marginTop: 6,
                    alignItems:'center',
                    width: 40,
                    backgroundColor: 'rgba(225, 225, 225, 1)'}}}
                
                /> */}
                 <View style={{alignItems: 'center'}}>
                <AudioMuteButton
                    styles = {{iconStyle:styles.iconStyle, style: [styles.customeButton,{
                        backgroundColor: props._audioMuted ? ColorPalette.red : ColorPalette.magenta}]}}
                    />
                <Text style={styles.iconTitle}>MUTE</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                <VideoMuteButton
                    styles = { {iconStyle:styles.iconStyle, style: [styles.customeButton,{
                        backgroundColor: props._videoMuted ? ColorPalette.red : ColorPalette.magenta}]} }
                     />
                <Text style={styles.iconTitle}>VIDEO</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                <InviteButton styles = { {iconStyle:styles.iconStyle, style: [styles.customeButton,{
                            backgroundColor: ColorPalette.magenta }]} } />
                <Text style={styles.iconTitle}>ADD</Text>
                </View>
                { false
                      && <ChatButton
                          styles = { {iconStyle:{fontSize:24, color: '#fff'}, style: {borderRadius: 20,
                            borderWidth: 0,
                            flex: 0,
                            flexDirection: 'row',
                            height: 40,
                            justifyContent: 'center',
                            marginHorizontal: 16,
                            marginTop: 6,
                            alignItems:'center',
                            width: 40,
                            backgroundColor: 'rgba(115, 115, 115, 0.5)'}} }
                           />}

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
                
                <View style={{alignItems: 'center'}}>
                <OverflowMenuButton
                    styles =  { {iconStyle:styles.iconStyle, style: [styles.customeButton,{
                        backgroundColor: ColorPalette.magenta }]} }
                     />
                <Text style={styles.iconTitle}>MORE</Text>
                </View>
                </View>
                   </View>
                </SafeAreaView>
            </Animated.View>
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
                        alignItems: "center", backgroundColor: '#242424', opacity: 0.98,
                        width: Dimensions.get('screen').width, height: Dimensions.get('screen').height
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

                        <View style={{ borderRadius: 12, width: Dimensions.get('screen').width - 60, backgroundColor: '#343333', alignSelf: 'center', marginTop: 50 }}>
                            <View style={{ margin: 12 }}>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#fff', paddingBottom: 8 }}>
                                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>CircleIt</Text>
                                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{props._participants.length} People Active</Text>
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
                                                        Circleit {props._videoMuted ? 'Audio' : 'Video'} call
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
    const _audioMuted = isLocalTrackMuted(state['features/base/tracks'], MEDIA_TYPE.AUDIO);
    return {
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
        _visible: isToolboxVisible(state),
        _width: state['features/base/responsive-ui'].clientWidth,
        _videoMuted: isLocalCameraTrackMuted(tracks),
        _participant: participant,
        _participants: participants,
        _audioMuted
    };
}

export default connect(_mapStateToProps)(Toolbox);
