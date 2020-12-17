import { env } from '../config';
import { ROUTES } from '../navigation/routes';
import { navigate } from '../navigation/actions';
import { isIosPlatform, checkConnection, checkExpiredToken } from './helper';

type IProps = {
    path: string,
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    headers?: Object,
    body?: Object,
};

let props = {};

export default class Request {
    static setProps(p) {
        props = p;
    }

    static get(params) {
        return this.request({ method: 'GET', ...params });
    }

    static post(params) {
        return this.request({ method: 'POST', ...params });
    }

    static put(params) {
        return this.request({ method: 'PUT', ...params });
    }

    static delete(params) {
        return this.request({ method: 'DELETE', ...params });
    }

    static patch(params) {
        return this.request({ method: 'PATCH', ...params });
    }

    static async request({
        path,
        method,
        body,
        headers = {},
        image,
        fullResponse = false,
        imageName = '',
        isAuthRequired = true,
        isPing = null,
        type = 'create',
    }: IProps) {
        const {
            company,
            idToken,
            resetIdToken,
            expiresIn = null,
            endpointApi,
        } = props;

        const apiUrl = isPing ? isPing:
            (endpointApi !== null && endpointApi !== undefined) ? endpointApi : env.ENDPOINT_API;
        const url = `${apiUrl}${path}`;
        const isConnected = await checkConnection()
        const isExpired = checkExpiredToken(expiresIn)

        if (!isConnected) {
            navigate(ROUTES.LOST_CONNECTION);
            return
        }

        if (isExpired && isAuthRequired) {
            resetIdToken();
            navigate(ROUTES.AUTH);
            return
        }

        const defaultHeaders = image
            ? {
                Authorization: `Bearer ${idToken}`,
                company: company ? company.id : 1,
                Accept: 'application/json'
            }
            : {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
                company: company ? company.id : 1,
                Accept: 'application/json'
            };

        const formData = new FormData();

        if (image) {
            const uri = image.uri;
            const uriParts = uri.split('.');
            const fileType = uriParts[uriParts.length - 1];

            formData.append(imageName, JSON.stringify({
                name: `${imageName}.${fileType}`,
                data: image.base64.trimRight()
            }))

            type && formData.append('type', type)

            for (const key in body) {
                if (body.hasOwnProperty && body.hasOwnProperty(key)) {
                    formData.append(key, body[key]);
                }
            }
        }

        const options = {
            method,
            body: image ? formData : JSON.stringify(body),
            headers: { ...defaultHeaders, ...headers },
        };

        return fetch(url, options).then((response) => {
            const {
                headers: { map },
            } = response;

            if (response.status === 500) {
                throw response;
            }

            if (response.status === 401) {
                navigate(ROUTES.AUTH);
            }

            if (response.status === 403 || response.status === 404) {

                throw response;
            }

            if (response.ok) {
                if (response.status === 204) {
                    return Promise.resolve();
                } else {
                    if (fullResponse) {
                        return response;
                    }

                    return response.json().then((v) => v);
                }
            }
            throw response;
        });
    }
}
