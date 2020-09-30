import React, { useState } from 'react'
import { View, Platform, Linking } from 'react-native'
import { connect } from 'react-redux';
import styles from './styles';
import { AssetImage } from '../AssetImage';
import { CtGradientButton } from '../Button';
import { Text } from 'react-native-elements';
import { IMAGES } from '../../config';
import Lng from '../../api/lang/i18n';
import { goBack, MOUNT, UNMOUNT } from '../../navigation/actions';
import { ROUTES } from '../../navigation/routes';

export const UpdateAppVersion = (props) => {
    const [loading, setLoading] = useState(false);
    const { language } = props;

    useEffect(() => {
        const { navigation } = this.props
        goBack(MOUNT, navigation, { route: ROUTES.UPDATE_APP_VERSION })

        return () => goBack(UNMOUNT);
    }, []);

    const onUpdateApp = () => {

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 1000);

        Platform.OS === 'android' ?
            Linking.openURL('https://play.google.com/store/apps/details?id=com.craterapp.app') :
            Linking.openURL('http://itunes.apple.com/app/id1489169767');
    }

    return (
        <View style={styles.container}>

            <View style={styles.main}
            >
                <View style={styles.logoContainer}>
                    <AssetImage
                        imageSource={IMAGES.LOGO_DARK}
                        imageStyle={styles.imgLogo}
                    />
                </View>

                <View style={styles.bodyContainer}>

                    <Text h4 style={styles.title}>
                        {Lng.t("updateApp.title")}
                    </Text>

                    <Text h6 style={styles.description}>
                        {Lng.t("updateApp.description")}
                    </Text>

                </View>

                <View style={{ marginTop: 25 }}>
                    <CtGradientButton
                        onPress={onUpdateApp}
                        btnTitle={Lng.t("button.updateCapital")}
                        loading={loading}
                    />
                </View>

            </View>
        </View>
    );
}

const mapStateToProps = ({ global }) => ({
    language: global.language,
});

const mapDispatchToProps = {

};


//  connect
const UpdateAppVersionContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UpdateAppVersion);

UpdateAppVersionContainer.navigationOptions = () => ({
    header: null,
});


export default UpdateAppVersionContainer;
