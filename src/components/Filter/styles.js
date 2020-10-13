import { Platform, StyleSheet } from 'react-native';
import { colors } from '~/styles/colors';
import { fonts } from '~/styles/fonts';
import { isIPhoneX } from '~/api/helper';

export default StyleSheet.create({
    listViewContainer: {
        flex: 1,
        paddingBottom: isIPhoneX() ? 30 : 13,
    },
    bodyContainer: {
        paddingHorizontal: 22,
        paddingVertical: 17,
    },
    modalContainer: {
        flex: 1,
        ...Platform.select({
            android: {
                marginTop: -20,
                margin: 0,
                padding: 0
            },
        }),
    },
    backIcon: {
        color: colors.dark,
    },
    submitHint: {
        fontSize: 17,
    },
    dateFieldContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        marginHorizontal: -10,
    },
    dateField: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 6,
    },
    submitButton: {
        flexDirection: "row",
        // justifyContent: "space-between",
    },
    handleBtn: {
        marginHorizontal: 9,
    },
    buttonContainer: {
        flex: 1,
    },
    inputIconStyle: {
        marginLeft: 5,
    },
    counter: {
        position: "absolute",
        top: -9,
        right: -11,
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        backgroundColor: colors.primary,
        borderWidth: 1.5,
        borderColor: colors.veryLightGray,
        alignItems: "center",
        justifyContent: "center"
    },
    counterText: {
        color: colors.veryLightGray,
        fontSize: 13,
        textAlign: "center",
    }
});
