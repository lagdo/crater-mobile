import queryString from 'query-string';
import { ROUTES } from "../../navigation/routes";
import Lng from '../../api/lang/i18n';

// Forms
// -----------------------------------------
export const SET_ENDPOINT_API = 'moreForm/SET_ENDPOINT_API';

// Actions
// -----------------------------------------
export const MORE_SEARCH = 'more/MORE_SEARCH';
export const MORE_TRIGGER_SPINNER = 'more/MORE_TRIGGER_SPINNER';
export const LOGOUT = 'more/LOGOUT';

// Menus
// -----------------------------------------
export const MORE_MENU = () => {
    return [
        {
            title: Lng.t("more.estimate"),
            leftIcon: 'file-alt',
            iconSize: 28,
            fullItem: {
                route: ROUTES.ESTIMATE_LIST
            }
        },
        {
            title: Lng.t("more.items"),
            leftIcon: 'product-hunt',
            iconSize: 27,
            fullItem: {
                route: ROUTES.GLOBAL_ITEMS
            }
        },
        {
            title: Lng.t("more.reports"),
            leftIcon: 'signal',
            fullItem: {
                route: ROUTES.REPORTS
            }
        },
        {
            title: Lng.t("settings.expenseCategory"),
            leftIcon: 'clipboard-list',
            iconSize: 24,
            fullItem: {
                route: ROUTES.CATEGORIES
            }
        },
        {
            title: Lng.t("settings.taxes"),
            leftIcon: 'percent',
            fullItem: {
                route: ROUTES.TAXES
            }
        },
        {
            title: Lng.t("more.settings"),
            leftIcon: 'cogs',
            fullItem: {
                route: ROUTES.SETTING_LIST
            }
        },
        {
            title: Lng.t("more.logout"),
            leftIcon: 'sign-out-alt',
            iconSize: 26,
            fullItem: {
                action: 'onLogout'
            }
        },
    ]
}
