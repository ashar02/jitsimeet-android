// @flow

import { openDialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { IconAudioRoute } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../../base/toolbox/components';

import AudioRoutePickerDialog from './AudioRoutePickerDialog';
import {
    Icon,
    IconDeviceBluetooth,
    IconDeviceEarpiece,
    IconDeviceHeadphone,
    IconDeviceSpeaker
} from '../../../base/icons';

type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function used to open/show the
     * {@code AudioRoutePickerDialog}.
     */
    dispatch: Function
};
const deviceInfoMap = {
    BLUETOOTH: {
        icon: IconDeviceBluetooth,
        text: 'audioDevices.bluetooth',
        type: 'BLUETOOTH'
    },
    EARPIECE: {
        icon: IconDeviceEarpiece,
        text: 'audioDevices.phone',
        type: 'EARPIECE'
    },
    HEADPHONES: {
        icon: IconDeviceHeadphone,
        text: 'audioDevices.headphones',
        type: 'HEADPHONES'
    },
    SPEAKER: {
        icon: IconDeviceSpeaker,
        text: 'audioDevices.speaker',
        type: 'SPEAKER'
    }
};

/**
 * A toolbar button which triggers an audio route picker when pressed.
 */
class AudioRouteButton extends AbstractButton<Props,*> {
    constructor(Props){
        super(Props)
    }
    accessibilityLabel = 'toolbar.accessibilityLabel.audioRoute';
    icon=IconDeviceSpeaker;
    toggledIcon = this.props?._devices?deviceInfoMap[this.props._devices?.find(device => device.selected == true)?.type]?.icon: IconAudioRoute;
    label = 'toolbar.audioRoute';

    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        this.props.dispatch(openDialog(AudioRoutePickerDialog));
    }
    _isIconChange(){
        if(deviceInfoMap[this.props._devices?.find(device => device.selected == true)?.type]?.icon){
            return true
        }
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Object}
 */
 function _mapStateToProps(state) {
    return {
        _devices: state['features/mobile/audio-mode'].devices
    };
}
export default translate(connect(_mapStateToProps)(AudioRouteButton));
