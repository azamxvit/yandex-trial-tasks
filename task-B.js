function solution() {
    let committed = false;
    let rootSet = false;
    let current = [];
    let stack = [];
    let actions = [];

    const api = {
        root(selector) {
            if (!rootSet) {
                current = Array.from(document.querySelectorAll(selector));
                rootSet = true;
                stack.push([...current]);
            }
            return this;
        },

        append(tag, attrs = {}) {
            actions.push(() => {
                current.forEach(parent => {
                    const el = document.createElement(tag);
                    applyAttrs(el, attrs);
                    parent.appendChild(el);
                });
            });
            return this;
        },

        appendMany(count, tag, attrs) {
            actions.push(() => {
                current.forEach(parent => {
                    for (let i = 0; i < count; i++) {
                        const el = document.createElement(tag);
                        const data = typeof attrs === "function" ? attrs(i) : attrs || {};
                        applyAttrs(el, data);
                        parent.appendChild(el);
                    }
                });
            });
            return this;
        },

        css(prop, value) {
            actions.push(() => {
                current.forEach(el => {
                    if (typeof prop === "string") {
                        el.style[prop] = value;
                    } else {
                        Object.assign(el.style, prop);
                    }
                });
            });
            return this;
        },

        children(selector) {
            stack.push([...current]);
            current = current
                .flatMap(el => Array.from(el.children))
                .filter(el => selector ? el.matches(selector) : true);
            return this;
        },

        select(selector) {
            stack.push([...current]);
            current = current
                .flatMap(el => Array.from(el.querySelectorAll(selector)));
            return this;
        },

        previousContext(steps = 1) {
            while (steps-- > 0 && stack.length > 1) {
                stack.pop();
            }
            current = [...stack[stack.length - 1]];
            return this;
        },

        remove(selector) {
            actions.push(() => {
                current.forEach(el => {
                    if (!selector || el.matches(selector)) {
                        el.remove();
                    }
                });
            });
            return this;
        },

        commit() {
            if (committed) return this;
            committed = true;
            actions.forEach(fn => fn());
            return this;
        }
    };

    function applyAttrs(el, attrs) {
        for (const key in attrs) {
            if (key === "content") {
                el.textContent = attrs[key];
            } else {
                el.setAttribute(key, attrs[key]);
            }
        }
    }

    return api;
}
