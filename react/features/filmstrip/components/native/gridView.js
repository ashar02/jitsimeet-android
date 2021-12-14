import React, { Component } from "react";
import { View, Text, Dimensions, FlatList } from "react-native";
import { connect } from "../../../base/redux";
import Thumbnail from "./Thumbnail";

class GridView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullWidth: Dimensions.get("window").width,
            fullHeight: Dimensions.get("window").height - 90,
            tileSize: 0,
        };
    }
    componentDidMount = () => {
        const tileSize =
            this.state.fullHeight /
            (this.props?._participants?.length / 2).toFixed(0);
        this.setState({ tileSize: tileSize });
    };
    renderItem = ({ item, index }) => {
        const styleOverrides = {
            aspectRatio: 1,
            flex: 1,
            height: this.state.tileSize,
            maxHeight: this.state.tileSize,
            maxWidth: this.state.fullWidth / 2,
            width: this.state.fullWidth / 2,
        };

        if (
            this.props?._participants?.length % 2 !== 0
                ? index !== this.props?._participants?.length - 1
                : true
        ) {
            return (
                <View
                    style={{
                        width: this.state.fullWidth / 2,
                        height: this.state.tileSize,
                        backgroundColor: "#fff",
                    }}
                >
                    <Thumbnail
                        disableTint={true}
                        key={item.id}
                        participant={item}
                        renderDisplayName={true}
                        styleOverrides={styleOverrides}
                        tileView={true}
                    />
                </View>
            );
        }
    };

    render() {
        const styleOverrides = {
            aspectRatio: 1,
            flex: 1,
            height: this.state.tileSize,
            maxHeight: this.state.tileSize,
            maxWidth: this.state.fullWidth,
            width: this.state.fullWidth,
            alignSelf:'center'
        };
        return (
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        width: this.state.fullWidth,
                        height: this.state.fullHeight,
                    }}
                >
                    <FlatList
                        data={this.props._participants}
                        renderItem={this.renderItem}
                        numColumns={2}
                        key={1}
                    />
                    {this.props?._participants?.length % 2 !== 0 ? (
                    <View
                        style={{
                            width: this.state.fullWidth,
                            height: this.state.tileSize,
                            alignSelf:'center'
                        }}
                    >
                        <Thumbnail
                            disableTint={true}
                            key={this.props._participants.id}
                            participant={this.props._participants}
                            renderDisplayName={true}
                            styleOverrides={styleOverrides}
                            tileView={true}
                        />
                    </View>
                ) : (
                    <View></View>
                )}
                </View>
                
            </View>
        );
    }
}

function _mapStateToProps(state) {
    const responsiveUi = state["features/base/responsive-ui"];

    return {
        _aspectRatio: responsiveUi.aspectRatio,
        _height: responsiveUi.clientHeight,
        _participants: state["features/base/participants"],
        _width: responsiveUi.clientWidth,
    };
}

export default connect(_mapStateToProps)(GridView);
