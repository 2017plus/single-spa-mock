import { started } from "../startapp.js";
import { getAppChanges, shouldBeActive } from "../application/app.helper.js";
import { toBootStrapPromise } from "../lifecycles/bootstrap.js";
import { toLoadPromise } from "../lifecycles/load.js";
import { toMountPromise } from "../lifecycles/mount.js";
import { toUnmountPromise } from "../lifecycles/unmount.js";
import './navigation-event.js';
import { callCapturedEventListeners } from "./navigation-event.js";

export function reroute(event) {
    const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();
    function callEventListener() {
        callCapturedEventListeners(event);
    }

    function loadApps() {
        return Promise.all(appsToLoad.map(app => toLoadPromise(app))).then(callEventListener);
    }

    function performAppChange() {
        // 将不需要的应用卸载掉，返回一个卸载的promsie
        const unmountAllPromises = Promise.all(appsToUnmount.map(toUnmountPromise))

        function tryBootstrapAndMount(app, unmountAllPromises) {
            if (shouldBeActive(app)) {
                //保证卸载完毕后再挂载
                return toBootStrapPromise(app).then(app => unmountAllPromises.then(() => toMountPromise(app)))
            }
        }
        // 流程：加载需要的应用，启动对应的应用，卸载不需要的应用，挂载对应的应用
        const loadPromises = Promise.all(appsToLoad.map((app) => toLoadPromise(app).then((app) => {
            return tryBootstrapAndMount(app, unmountAllPromises)
        })))

        const mountPromises = Promise.all(appsToMount.map((app) => tryBootstrapAndMount(app, unmountAllPromises)))

        return Promise.all([loadPromises, mountPromises]).then(() => {
            callEventListener();
        })

    }

    if (started) {
        return performAppChange();
    }
    return loadApps();
}
