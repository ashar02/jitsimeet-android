// @flow

import React, { PureComponent } from 'react';
import { TouchableOpacity, View, Text, NativeModules } from 'react-native';
import _ from 'lodash';
import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { BottomSheet, hideDialog, isDialogOpen } from '../../../base/dialog';
import { IconDragHandle, IconUserProfile, IconChatSend, IconUserPin } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { ColorPalette, StyleType } from '../../../base/styles';


import { SlidingView } from '../../../base/react';
import styles from './styles';
import { profileInfo, privateChat } from '../../../filmstrip/actions.native';

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
let ThumbnailMenu_; // eslint-disable-line prefer-const

/**
 * Implements a React {@code Component} with some extra actions in addition to
 * those in the toolbar.
 */
class ThumbnailMenu extends PureComponent<Props, State> {
    /**
     * Initializes a new {@code OverflowMenu} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            scrolledToTop: true,
            showMore: false
        };


        this._privateChat = _.once(() => {
            this.props.dispatch(privateChat('email2'));
        });

        this._profileInfo = _.once(() => {
            this.props.dispatch(profileInfo('email1'));
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
        const { _bottomSheetStyles, _width, participantCount } = this.props;
        const { showMore } = this.state;
        //const toolbarButtons = getMovableButtons(_width);

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
                position = 'top'
                show = { true }
           >
                <View  style={[styles.thumbnailMenuContainer, {zIndex: participantCount == 7 || participantCount == 10 ? 1 : 0, elevation: 5}]}>
                <TouchableOpacity>
                    <View style={styles.actionItem}>
                        <Text style={styles.actionTitle}>PIN</Text>
                        <IconUserPin width={15} height={15} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._privateChat}>
                    <View style={[styles.actionItem, {borderTopWidth: 1.25, borderTopColor: ColorPalette.gray}]}>
                        <Text style={styles.actionTitle}>PRIVATE MESSAGE</Text>
                        <IconChatSend width={15} height={15} />
                    </View>
                </TouchableOpacity>
                {/* <View style={[styles.actionItem, {borderTopWidth: 1.25, borderTopColor: ColorPalette.gray}]}>
                    <Text style={styles.actionTitle}>RECORD CALL</Text>
                    <IconRecording  width={15} height={15} />
                </View> */}
                <TouchableOpacity onPress={this._profileInfo}>
                <View style={[styles.actionItem, {borderTopWidth: 1.25, borderTopColor: ColorPalette.gray}]}>
                    <Text style={styles.actionTitle }>PROFILE INFO</Text>
                    <IconUserProfile width={15} height={15} />
                </View>
                </TouchableOpacity>
                </View>
            </SlidingView>

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
            this.props.dispatch(hideDialog(ThumbnailMenu_));

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
        _isOpen: isDialogOpen(state, ThumbnailMenu_),
        _width: state['features/base/responsive-ui'].clientWidth,
        _devices: state['features/mobile/audio-mode'].devices
    };
}

ThumbnailMenu_ = connect(_mapStateToProps)(ThumbnailMenu);

export default ThumbnailMenu_;