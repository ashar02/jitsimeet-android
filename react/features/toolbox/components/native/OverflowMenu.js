// @flow

import React, { PureComponent } from 'react';
import { TouchableOpacity, View, Text, NativeModules } from 'react-native';
import Collapsible from 'react-native-collapsible';
import _ from 'lodash';
import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { BottomSheet, hideDialog, isDialogOpen } from '../../../base/dialog';
import { IconDragHandle, IconChatSend, IconRecording, IconLeaveCall } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { ColorPalette, StyleType } from '../../../base/styles';
import { SharedDocumentButton } from '../../../etherpad';
import { InviteButton } from '../../../invite';
import { LobbyModeButton } from '../../../lobby/components/native';
import { AudioRouteButton } from '../../../mobile/audio-mode';
import { LiveStreamButton, RecordButton } from '../../../recording';
import { RoomLockButton } from '../../../room-lock';
import { SharedVideoButton } from '../../../shared-video/components';
import { ClosedCaptionButton } from '../../../subtitles';
import { TileViewButton } from '../../../video-layout';
import { getMovableButtons } from '../../functions.native';
import HelpButton from '../HelpButton';
import MuteEveryoneButton from '../MuteEveryoneButton';
import MuteEveryonesVideoButton from '../MuteEveryonesVideoButton';
import { createToolbarEvent, sendAnalytics } from '../../../analytics';
import { appNavigate } from '../../../app/actions';
import { disconnect } from '../../../base/connection';
import AudioOnlyButton from './AudioOnlyButton';
import MoreOptionsButton from './MoreOptionsButton';
import RaiseHandButton from './RaiseHandButton';
import ScreenSharingButton from './ScreenSharingButton.js';
import ToggleCameraButton from './ToggleCameraButton';
import { SlidingView } from '../../../base/react';
import styles from './styles';
import AudioRoutePickerDialog from '../../../mobile/audio-mode/components/AudioRoutePickerDialog';
import { RawDevice, deviceInfoMap } from '../../../mobile/audio-mode/components/AudioRoutePickerDialog';
import { openDialog } from '../../../base/dialog';
import { closeChat } from '../../../chat/actions.native';
import {
    Icon,
    IconDeviceBluetooth,
    IconDeviceEarpiece,
    IconDeviceHeadphone,
    IconDeviceSpeaker
} from '../../../base/icons';
const { AudioMode } = NativeModules;

/**
 * The type of the React {@code Component} props of {@link OverflowMenu}.
 */
type Props = {

    /**
     * The color-schemed stylesheet of the dialog feature.
     */
    _bottomSheetStyles: StyleType,

    /**
     * True if the overflow menu is currently visible, false otherwise.
     */
    _isOpen: boolean,

    /**
     * Whether the recoding button should be enabled or not.
     */
    _recordingEnabled: boolean,

    /**
     * The width of the screen.
     */
    _width: number,

    /**
     * Object describing available devices.
     */
    _devices: Array<RawDevice>,

    /**
     * Used for hiding the dialog when the selection was completed.
     */
    dispatch: Function
};

type State = {

    /**
     * True if the bottom scheet is scrolled to the top.
     */
    scrolledToTop: boolean,

    /**
     * True if the 'more' button set needas to be rendered.
     */
    showMore: boolean
}

/**
 * The exported React {@code Component}. We need it to execute
 * {@link hideDialog}.
 *
 * XXX It does not break our coding style rule to not utilize globals for state,
 * because it is merely another name for {@code export}'s {@code default}.
 */
let OverflowMenu_; // eslint-disable-line prefer-const

/**
 * Implements a React {@code Component} with some extra actions in addition to
 * those in the toolbar.
 */
class OverflowMenu extends PureComponent<Props, State> {
    /**
     * Initializes a new {@code OverflowMenu} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            scrolledToTop: true,
            showMore: false,
            selectedAudioDevice: '',
            selectedAudioDeviceIcon: ''
        };

        AudioMode.updateDeviceList && AudioMode.updateDeviceList();
        for (const device of this.props._devices) {
            if (device.selected) {
                const infoMap = deviceInfoMap[device.type];
                const text = device.type === 'BLUETOOTH' && device.name ? device.name : infoMap.text;
                const textArray = text.split('.');
                this.state.selectedAudioDeviceIcon = infoMap.icon;
                this.state.selectedAudioDevice = textArray.length > 1 ? textArray[1].toUpperCase() : text.toUpperCase();
            }
        }

        this._hangup = _.once(() => {
            sendAnalytics(createToolbarEvent('hangup'));

            // FIXME: these should be unified.
            if (navigator.product === 'ReactNative') {
                this.props.dispatch(appNavigate(undefined));
            } else {
                this.props.dispatch(disconnect(true));
            }
        });

        this._audioRoute = _.once(() => {
            this.props.dispatch(openDialog(AudioRoutePickerDialog));
        });

        this._chat = _.once(() => {
            this.props.dispatch(closeChat());
            this.props.dispatch(hideDialog(OverflowMenu_));
        });
       
        // Bind event handlers so they are only bound once per instance.
        this._onCancel = this._onCancel.bind(this);
        this._onSwipe = this._onSwipe.bind(this);
        this._onToggleMenu = this._onToggleMenu.bind(this);
        this._renderMenuExpandToggle = this._renderMenuExpandToggle.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _bottomSheetStyles, _width } = this.props;
        const { showMore } = this.state;
        const toolbarButtons = getMovableButtons(_width);

        const buttonProps = {
            afterClick: this._onCancel,
            showLabel: true,
            styles: _bottomSheetStyles.buttons
        };

        const moreOptionsButtonProps = {
            ...buttonProps,
            afterClick: this._onToggleMenu,
            visible: !showMore
        };

        return (
            <SlidingView 
            accessibilityRole = 'menu'
            //accessibilityViewIsModal = { true }
            onHide = { this._onCancel }
            position = 'bottom'
            show = { true }
       >
            <View  style={styles.overflowMenuContainer}>
            <TouchableOpacity onPress={this._audioRoute}>
                <View style={styles.actionItem}>
                    <Text style={styles.actionTitle}>{this.state.selectedAudioDevice}</Text>
                    <Icon  src={this.state.selectedAudioDeviceIcon} fill={ColorPalette.white} size={15} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._chat}>
                <View style={[styles.actionItem, {borderTopWidth: 1.25, borderTopColor: ColorPalette.gray}]}>
                    <Text style={styles.actionTitle}>CHAT GROUP</Text>
                    <IconChatSend fill={ColorPalette.white} width={15} height={15} />
                </View>
            </TouchableOpacity>
            <View style={[styles.actionItem, {borderTopWidth: 1.25, borderTopColor: ColorPalette.gray}]}>
                <Text style={styles.actionTitle}>RECORD CALL</Text>
                <IconRecording  width={15} height={15} />
            </View>
            <TouchableOpacity onPress={this._hangup}>
            <View style={[styles.actionItem, {borderTopWidth: 1.25, borderTopColor: ColorPalette.gray}]}>
                <Text style={[styles.actionTitle, { color: ColorPalette.red}]}>LEAVE CALL</Text>
                <IconLeaveCall width={15} height={15} />
            </View>
            </TouchableOpacity>
            </View>
        </SlidingView>
            // <BottomSheet
            //     onCancel = { this._onCancel }
            //     onSwipe = { this._onSwipe }
            //     /* renderHeader = { this._renderMenuExpandToggle } */>
            //     <AudioRouteButton { ...buttonProps } />
            //     {false && <InviteButton { ...buttonProps } />}
            //     <AudioOnlyButton { ...buttonProps } />
            //     {false && <RaiseHandButton { ...buttonProps } />}
            //     {false && <LobbyModeButton { ...buttonProps } />}
            //     {false && <ScreenSharingButton { ...buttonProps } />}
            //     <ToggleCameraButton { ...buttonProps } />
            //     {false && <MoreOptionsButton { ...moreOptionsButtonProps } />}
            //     {false && <Collapsible collapsed = { false }>
            //         {false && <ToggleCameraButton { ...buttonProps } />}
            //         {false && <TileViewButton { ...buttonProps } />}
            //         {false && <RecordButton { ...buttonProps } />}
            //         {false && <LiveStreamButton { ...buttonProps } />}
            //         {false && <SharedVideoButton { ...buttonProps } />}
            //         {false && <RoomLockButton { ...buttonProps } />}
            //         {false && <ClosedCaptionButton { ...buttonProps } />}
            //         {false && <SharedDocumentButton { ...buttonProps } />}
            //         {false && <MuteEveryoneButton { ...buttonProps } />}
            //         {false && <MuteEveryonesVideoButton { ...buttonProps } />}
            //         {false && <HelpButton { ...buttonProps } />}
            //     </Collapsible>}
            // </BottomSheet>
        );
    }

    _renderMenuExpandToggle: () => React$Element<any>;

    /**
     * Function to render the menu toggle in the bottom sheet header area.
     *
     * @returns {React$Element}
     */
    _renderMenuExpandToggle() {
        return (
            <View
                /* style = { [
                    this.props._bottomSheetStyles.sheet,
                    styles.expandMenuContainer
                ] } */ >
                <TouchableOpacity onPress = { this._onToggleMenu }>
                    { /* $FlowFixMe */ }
                    <IconDragHandle
                        fill = { this.props._bottomSheetStyles.buttons.iconStyle.color } />
                </TouchableOpacity>
            </View>
        );
    }

    _onCancel: () => boolean;

    /**
     * Hides this {@code OverflowMenu}.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel() {
        if (this.props._isOpen) {
            this.props.dispatch(hideDialog(OverflowMenu_));

            return true;
        }

        return false;
    }

    _onSwipe: string => void;

    /**
     * Callback to be invoked when swipe gesture is detected on the menu. Returns true
     * if the swipe gesture is handled by the menu, false otherwise.
     *
     * @param {string} direction - Direction of 'up' or 'down'.
     * @returns {boolean}
     */
    _onSwipe(direction) {
        const { showMore } = this.state;

        switch (direction) {
        case 'up':
            !showMore && this.setState({
                showMore: true
            });

            return !showMore;
        case 'down':
            showMore && this.setState({
                showMore: false
            });

            return showMore;
        }
    }

    _onToggleMenu: () => void;

    /**
     * Callback to be invoked when the expand menu button is pressed.
     *
     * @returns {void}
     */
    _onToggleMenu() {
        this.setState({
            showMore: !this.state.showMore
        });
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    return {
        _bottomSheetStyles: ColorSchemeRegistry.get(state, 'BottomSheet'),
        _isOpen: isDialogOpen(state, OverflowMenu_),
        _width: state['features/base/responsive-ui'].clientWidth,
        _devices: state['features/mobile/audio-mode'].devices
    };
}

OverflowMenu_ = connect(_mapStateToProps)(OverflowMenu);

export default OverflowMenu_;
