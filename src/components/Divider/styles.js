import { StyleSheet } from 'react-native';
import { colors } from '~/styles/colors';
import { fonts } from '~/styles/fonts';

export const styles = StyleSheet.create({
    dividerContainer: {
        marginVertical: 20,
        marginHorizontal: 12,
        position: 'relative',
    },
    divider: {
        backgroundColor: colors.darkGray,
        marginVertical: 15,
        height: 1,
    },
    titleContainer: {
        position: 'absolute',
        top: 0,
        borderRadius: 10,
        height: 30,
        width: 35,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        left: '45%',
    },
    title: {
        color: colors.darkGray,
        fontFamily: fonts.poppins,
    },
    withoutTitle: {
        backgroundColor: colors.gray,
        borderColor: colors.gray,
        borderWidth: 0.7,
        marginBottom: 2,
    },
});
