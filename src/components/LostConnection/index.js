import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux';
import styles from './styles';
import { AssetImage } from '../AssetImage';
import { CtGradientButton } from '../Button';
import { Text } from 'react-native-elements';
import { IMAGES } from '../../config';
import Lng from '../../api/lang/i18n';
import { checkConnection } from '../../api/helper';
import { ROUTES } from '../../navigation/routes';

export const LostConnection = (props) => {
    const {
        navigation,
    } = props;

    const [loading, setLoading] = useState(false);

    const onRetry = async () => {

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 1000);

        let isConnected = await checkConnection();
        !isConnected ? navigation.navigate(ROUTES.LOST_CONNECTION) : navigation.pop();
    };

    return (
        <View style={styles.container}>

            <View style={styles.main}>

                <View style={styles.bodyContainer}>
                    <Text style={styles.title}>
                        {Lng.t("lostInternet.title")}
                    </Text>

                    <View style={styles.logoContainer}>
                        <AssetImage
                            imageSource={IMAGES.LOST_CONNECTION}
                            imageStyle={styles.imgLogo}
                        />
                    </View>

                    <Text h6 style={styles.description}>
                        {Lng.t("lostInternet.description")}
                    </Text>
                </View>

                <View style={{ marginTop: 25 }}>
                    <CtGradientButton
                        onPress={onRetry}
                        btnTitle={Lng.t("button.retry")}
                        loading={loading}
                    />
                </View>

            </View>

        </View>
    );
}

const mapStateToProps = ({ global: { language } }) => ({ language });

//  connect
const LostConnectionContainer = connect(
    mapStateToProps,
)(LostConnection);

export default LostConnectionContainer;
