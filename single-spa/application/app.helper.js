import { apps } from "./app.js";

// 启动流程
export const NOT_LOADED = 'NOT_LOADED'; // 应用未加载
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'; // 路径匹配了，要去加载这个资源
export const LOAD_ERR = 'LOAD_ERR'; // 资源加载失败

// 启动流程
export const NOT_BOOTSTRAPED = 'NOT_BOOTSTRAPED'; // 资源加载完毕，需要启动，此时应用还未启动
export const BOOTSTRAPING = 'BOOTSTRAPING'; // 启动中
export const NOT_MOUNTED = 'NOT_MOUNTED';   // 未挂载

// 挂载流程
export const MOUNTING = 'MOUNTING'; // 正在挂载
export const MOUNTED = 'MOUNTED';   // 挂载完成

// 卸载流程
export const UNMOUNTING = 'UNMOUNTING'  // 卸载中
export const UNLOADING = 'UNLOADING'

// 加载是正在下载应用 LOADING_SOURCE_CODE，激活已经运行了

// 看一下这个应用是否正在被激活
export function isActive(app) {
    return app.status === MOUNTED;
}

// 看一下此应用是否被激活
export function shouldBeActive(app) {
    return app.activeWhen(window.location)
}

export function getAppChanges() {

    const appsToLoad = [], appsToMount = [], appsToUnmount = [];

    apps.forEach((app) => {

        const appShouldActive = shouldBeActive(app);

        switch (app.status) {
            case NOT_LOADED:
            case LOADING_SOURCE_CODE:

                // 当前路径下，哪些应用要被加载
                if (appShouldActive) {
                    appsToLoad.push(app);
                }
                break;

            case NOT_BOOTSTRAPED:
            case BOOTSTRAPING:
            case NOT_MOUNTED:
                // 当前路径下，哪些应用要被挂载
                if (appShouldActive) {
                    appsToMount.push(app);
                }
                break;

            case MOUNTED:
                // 当前路径下，哪些应用要被卸载
                if (!appShouldActive) {
                    appsToUnmount.push(app);
                }

            default:
                break;
        }
    })


    return { appsToLoad, appsToMount, appsToUnmount };
}