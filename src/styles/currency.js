import { StyleSheet, Platform } from 'react-native';
import { colors } from './colors';
import { fonts } from './fonts';

export default styles = StyleSheet.create({
    fieldStyle: {
        display: 'flex',
        minWidth: 80,
        marginTop: -6
    },
    itemContainer: {
        marginVertical: 4,
        borderWidth: 1,
        borderColor: colors.lightGray
    },
    itemLeftTitle: {
        fontSize: 15,
        fontFamily: fonts.poppins,
        color: colors.dark
    },
    itemLeftSubTitleLabel: {
        marginLeft: -6,
    },
    itemLeftSubTitle: {
        color: colors.darkGray,
        fontSize: 13,
    },
    itemRightTitle: {
        fontFamily: fonts.poppins,
        fontSize: 18,
        color: colors.secondary
    },
    label: {
        paddingBottom: 10,
        paddingTop: 15,
    },
});
