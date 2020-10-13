import { StyleSheet } from 'react-native';
import { colors } from '~/styles/colors';
import { headerTitle } from '~/api/helper';
import { fonts } from '~/styles/fonts';

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.veryLightGray,
    },
    mainContainer: {
        paddingHorizontal: 20,
    },
    headerContainer: {
        backgroundColor: colors.veryLightGray,
    },
    submitButton: {
        paddingHorizontal: 10
    },
    addressStreetField: {
        marginTop: -20,
    },
    fakeInputPlaceholderStyle: {
        paddingLeft: 10,
    },
    images: {
        height: 110,
        resizeMode: "contain",
    },
    titleStyle: {
        ...headerTitle({ marginLeft: -12, marginRight: -15 })
    }
});
