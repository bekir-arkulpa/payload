"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const react_1 = __importStar(require("react"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const react_router_dom_1 = require("react-router-dom");
const modal_1 = require("@faceless-ui/modal");
const react_i18next_1 = require("react-i18next");
const react_toastify_1 = require("react-toastify");
const Config_1 = require("../Config");
const api_1 = require("../../../api");
const useDebounce_1 = __importDefault(require("../../../hooks/useDebounce"));
const Context = (0, react_1.createContext)({});
const maxTimeoutTime = 2147483647;
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)();
    const [tokenInMemory, setTokenInMemory] = (0, react_1.useState)();
    const { pathname } = (0, react_router_dom_1.useLocation)();
    const { push } = (0, react_router_dom_1.useHistory)();
    const config = (0, Config_1.useConfig)();
    const { admin: { user: userSlug, inactivityRoute: logoutInactivityRoute, autoLogin, }, serverURL, routes: { admin, api, }, } = config;
    const exp = user === null || user === void 0 ? void 0 : user.exp;
    const [permissions, setPermissions] = (0, react_1.useState)();
    const { i18n } = (0, react_i18next_1.useTranslation)();
    const { openModal, closeAllModals } = (0, modal_1.useModal)();
    const [lastLocationChange, setLastLocationChange] = (0, react_1.useState)(0);
    const debouncedLocationChange = (0, useDebounce_1.default)(lastLocationChange, 10000);
    const id = user === null || user === void 0 ? void 0 : user.id;
    const refreshCookie = (0, react_1.useCallback)((forceRefresh) => {
        const now = Math.round((new Date()).getTime() / 1000);
        const remainingTime = (exp || 0) - now;
        if (forceRefresh || (exp && remainingTime < 120)) {
            setTimeout(async () => {
                try {
                    const request = await api_1.requests.post(`${serverURL}${api}/${userSlug}/refresh-token`, {
                        headers: {
                            'Accept-Language': i18n.language,
                        },
                    });
                    if (request.status === 200) {
                        const json = await request.json();
                        setUser(json.user);
                    }
                    else {
                        setUser(null);
                        push(`${admin}${logoutInactivityRoute}?redirect=${encodeURIComponent(window.location.pathname)}`);
                    }
                }
                catch (e) {
                    react_toastify_1.toast.error(e.message);
                }
            }, 1000);
        }
    }, [exp, serverURL, api, userSlug, push, admin, logoutInactivityRoute, i18n]);
    const refreshCookieAsync = (0, react_1.useCallback)(async (skipSetUser) => {
        try {
            const request = await api_1.requests.post(`${serverURL}${api}/${userSlug}/refresh-token`, {
                headers: {
                    'Accept-Language': i18n.language,
                },
            });
            if (request.status === 200) {
                const json = await request.json();
                if (!skipSetUser)
                    setUser(json.user);
                return json.user;
            }
            setUser(null);
            push(`${admin}${logoutInactivityRoute}`);
            return null;
        }
        catch (e) {
            react_toastify_1.toast.error(`Refreshing token failed: ${e.message}`);
            return null;
        }
    }, [serverURL, api, userSlug, push, admin, logoutInactivityRoute, i18n]);
    const setToken = (0, react_1.useCallback)((token) => {
        const decoded = (0, jwt_decode_1.default)(token);
        setUser(decoded);
        setTokenInMemory(token);
    }, []);
    const logOut = (0, react_1.useCallback)(() => {
        setUser(null);
        setTokenInMemory(undefined);
        api_1.requests.post(`${serverURL}${api}/${userSlug}/logout`);
    }, [serverURL, api, userSlug]);
    const refreshPermissions = (0, react_1.useCallback)(async () => {
        try {
            const request = await api_1.requests.get(`${serverURL}${api}/access`, {
                headers: {
                    'Accept-Language': i18n.language,
                },
            });
            if (request.status === 200) {
                const json = await request.json();
                setPermissions(json);
            }
            else {
                throw new Error(`Fetching permissions failed with status code ${request.status}`);
            }
        }
        catch (e) {
            react_toastify_1.toast.error(`Refreshing permissions failed: ${e.message}`);
        }
    }, [serverURL, api, i18n]);
    // On mount, get user and set
    (0, react_1.useEffect)(() => {
        const fetchMe = async () => {
            try {
                const request = await api_1.requests.get(`${serverURL}${api}/${userSlug}/me`, {
                    headers: {
                        'Accept-Language': i18n.language,
                    },
                });
                if (request.status === 200) {
                    const json = await request.json();
                    if (json === null || json === void 0 ? void 0 : json.user) {
                        setUser(json.user);
                    }
                    else if (json === null || json === void 0 ? void 0 : json.token) {
                        setToken(json.token);
                    }
                    else if (autoLogin && autoLogin.prefillOnly !== true) {
                        // auto log-in with the provided autoLogin credentials. This is used in dev mode
                        // so you don't have to log in over and over again
                        const autoLoginResult = await api_1.requests.post(`${serverURL}${api}/${userSlug}/login`, {
                            body: JSON.stringify({
                                email: autoLogin.email,
                                password: autoLogin.password,
                            }),
                            headers: {
                                'Accept-Language': i18n.language,
                                'Content-Type': 'application/json',
                            },
                        });
                        if (autoLoginResult.status === 200) {
                            const autoLoginJson = await autoLoginResult.json();
                            setUser(autoLoginJson.user);
                            if (autoLoginJson === null || autoLoginJson === void 0 ? void 0 : autoLoginJson.token) {
                                setToken(autoLoginJson.token);
                            }
                        }
                        else {
                            setUser(null);
                        }
                    }
                    else {
                        setUser(null);
                    }
                }
            }
            catch (e) {
                react_toastify_1.toast.error(`Fetching user failed: ${e.message}`);
            }
        };
        fetchMe();
    }, [i18n, setToken, api, serverURL, userSlug, autoLogin]);
    // When location changes, refresh cookie
    (0, react_1.useEffect)(() => {
        if (id) {
            refreshCookie();
        }
    }, [debouncedLocationChange, refreshCookie, id]);
    (0, react_1.useEffect)(() => {
        setLastLocationChange(Date.now());
    }, [pathname]);
    // When user changes, get new access
    (0, react_1.useEffect)(() => {
        if (id) {
            refreshPermissions();
        }
    }, [i18n, id, api, serverURL, refreshPermissions]);
    (0, react_1.useEffect)(() => {
        let reminder;
        const now = Math.round((new Date()).getTime() / 1000);
        const remainingTime = exp - now;
        if (remainingTime > 0) {
            reminder = setTimeout(() => {
                openModal('stay-logged-in');
            }, (Math.min((remainingTime - 60) * 1000), maxTimeoutTime));
        }
        return () => {
            if (reminder)
                clearTimeout(reminder);
        };
    }, [exp, openModal]);
    (0, react_1.useEffect)(() => {
        let forceLogOut;
        const now = Math.round((new Date()).getTime() / 1000);
        const remainingTime = exp - now;
        if (remainingTime > 0) {
            forceLogOut = setTimeout(() => {
                setUser(null);
                push(`${admin}${logoutInactivityRoute}?redirect=${encodeURIComponent(window.location.pathname)}`);
                closeAllModals();
            }, Math.min(remainingTime * 1000, maxTimeoutTime));
        }
        return () => {
            if (forceLogOut)
                clearTimeout(forceLogOut);
        };
    }, [exp, push, closeAllModals, admin, i18n, logoutInactivityRoute]);
    return (react_1.default.createElement(Context.Provider, { value: {
            user,
            setUser,
            logOut,
            refreshCookie,
            refreshCookieAsync,
            refreshPermissions,
            permissions,
            setToken,
            token: tokenInMemory,
        } }, children));
};
exports.AuthProvider = AuthProvider;
const useAuth = () => (0, react_1.useContext)(Context);
exports.useAuth = useAuth;
//# sourceMappingURL=index.js.map