import React, { useState } from 'react';
import { Image, View, ActivityIndicator } from 'react-native';

type IProps = {
    imageStyle: Object,
    imageName: String,
    uri: Boolean,
    imageProps: Object,
    loadingImageStyle: Object
};

export const AssetImage = (props: IProps) => {
    const { imageSource, imageStyle, loadingImageStyle, uri, imageProps } = props;

    const [loading, setLoading] = useState(false);

    const imageLoad = () => setLoading(!loading);

    return (
        <View>
            {loading && <ActivityIndicator
                style={[imageStyle, loadingImageStyle && loadingImageStyle, { position: 'absolute' }]}
            />
            }
            <Image
                source={uri ? { uri: imageSource } : imageSource}
                style={imageStyle}
                onLoadStart={imageLoad}
                onLoad={imageLoad}
                {...imageProps}
            />
        </View>
    );
}

export default AssetImage;
