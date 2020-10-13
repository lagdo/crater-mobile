import { StyleSheet } from 'react-native';
import { colors } from '~/styles/colors';
import { fonts } from '~/styles/fonts';
import { isIPhoneX } from '~/api/helper';

export const styles = StyleSheet.create({

    animatedToastView:
    {
        marginHorizontal: 22,
        paddingHorizontal: 25,
        paddingVertical: 11,
        borderRadius: 25,
        zIndex: 9999,

        position: 'absolute',
        bottom: isIPhoneX() ? 110 : 81,
        left: 0,
        right: 0,

        backgroundColor: colors.veryDarkGray,
        justifyContent: 'center',
    },

    title:
    {
        fontSize: isIPhoneX() ? 15 : 13,
        fontFamily: fonts.poppins,
        alignSelf: 'stretch',
        textAlign: 'center',
        color: colors.white
    }
});
