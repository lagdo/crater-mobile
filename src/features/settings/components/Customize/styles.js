import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '~/styles/colors';
import { fonts } from '~/styles/fonts';

const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({

    bodyContainer: {
        paddingHorizontal: 22,
        paddingVertical: 17,
    },
    submitButton: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    handleBtn: {
        marginHorizontal: 9,
    },
    dividerLine: {
        marginTop: 18,
        marginBottom: 18,
        backgroundColor: colors.gray,
        borderColor: colors.gray,
        borderWidth: 0.2,
    },
    autoGenerateHeader: {
        marginTop: 7,
        color: colors.dark2,
        fontFamily: fonts.poppins,
        fontSize: 20,
    },

    // row
    rowViewContainer: {
        flex: 1,
        flexDirection: "row"
    },
    rowView: {
        flex: 1
    },

    // tabs
    tabs: {
        backgroundColor: colors.veryLightGray,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    tabView: {
        height: 55
    }
});
