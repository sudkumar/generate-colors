(function () {
    'use strict';

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    /**
     * Get the Hue from RGB
     * @param {Integer} r - red value [0- 255]
     * @param {Integer} g - red value [0- 255]
     * @param {Integer} b - red value [0- 255]
     * @return {Integer} - hue - 0 - 360
     */
    function getHueFromRgb(r, g, b) {
      const M = Math.max(r, g, b);
      const m = Math.min(r, g, b);
      const c = M - m;
      let hx = 0;
      if (c === 0) {
        hx = 0;
      } else if (M === r) {
        hx = ((g - b) / c) % 6;
      } else if (M === g) {
        hx = (b - r) / c + 2;
      } else if (M === b) {
        hx = (r - g) / c + 4;
      }
      hx = hx * 60;
      if (hx < 0) {
        hx = hx + 360;
      }
      return Math.round(hx)
    }

    /**
     * Convert rgb to HSV
     * @param {Integer} r - red value [0- 255]
     * @param {Integer} g - red value [0- 255]
     * @param {Integer} b - red value [0- 255]
     * @return {Array} hsv - [h, s, v]
     */
    function rgbToHsv(r, g, b) {
      r = r / 255;
      g = g / 255;
      b = b / 255;
      const M = Math.max(r, g, b);
      const m = Math.min(r, g, b);
      const c = M - m;
      let sat = 0;
      if (M !== 0) {
        sat = (c / M) * 100;
      }
      const hue = getHueFromRgb(r, g, b);
      const v = Math.max(r, g, b) * 100;
      return [hue, Math.round(sat), Math.round(v)]
    }

    /**
     * Converts HSV to RGB value.
     *
     * @param {Integer} h Hue as a value between 0 - 360 degrees
     * @param {Integer} s Saturation as a value between 0 - 100%
     * @param {Integer} v Value as a value between 0 - 100%
     * @returns {Array} The RGB values  EG: [r,g,b], [255,255,255]
     */

    function hsvToRgb(h, s, v) {
      v = v / 100;
      s = s / 100;
      const c = v * s;
      const hx = h / 60;
      const x = c * (1 - Math.abs((hx % 2) - 1));
      let rgb = [0, 0, 0];
      if (!h) {
        rgb = [0, 0, 0];
      } else if (hx >= 0 && hx <= 1) {
        rgb = [c, x, 0];
      } else if (hx >= 1 && hx <= 2) {
        rgb = [x, c, 0];
      } else if (hx >= 2 && hx <= 3) {
        rgb = [0, c, x];
      } else if (hx >= 3 && hx <= 3) {
        rgb = [0, x, c];
      } else if (hx >= 4 && hx <= 5) {
        rgb = [x, 0, c];
      } else {
        rgb = [c, 0, x];
      }
      const m = v - c;
      return rgb.map(c => Math.round((c + m) * 256))
    }

    // cache the calculated colors
    let colorForString = {
      "": [0, 0, 0],
    };

    const defaultOptions = {
      contrast: 35,
    };

    function getColorForString(str = "", options = {}) {
      options = Object.assign({}, defaultOptions, options);
      const cacheKey = str + JSON.stringify(options);
      if (colorForString[cacheKey]) {
        return colorForString[cacheKey] || [0, 0, 0]
      }
      if (!str) {
        return colorForString[cacheKey] || [0, 0, 0]
      }
      const letters = str.split("");
      // get the hash
      const hash = letters.reduce((hash, l) => {
        const val = l.charCodeAt();
        return val * val * val * val + hash
      }, 0);
      // int to rgb
      const c = (hash & 0x00ffffff).toString(16).toUpperCase();
      const hex = "000000".substring(0, 6 - c.length) + c;
      const int = parseInt(hex, 16);
      const r = (int >> 16) & 255;
      const g = (int >> 8) & 255;
      const b = int & 255;

      const [hue, sat, val] = rgbToHsv(r, g, b);
      // value to 35 for contrast
      const rgb = hsvToRgb(hue, sat, Math.min(val, options.contrast || 35));
      colorForString[cacheKey] = rgb;
      return rgb
    }

    /* docs/app.svelte generated by Svelte v3.12.1 */

    function create_fragment(ctx) {
    	var div, h2, t0, t1, input, dispose;

    	return {
    		c() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(ctx.color);
    			t1 = space();
    			input = element("input");
    			attr(input, "type", "text");
    			attr(input, "placeholder", "Type here to see the background change...");
    			set_style(div, "background", ctx.color);
    			dispose = listen(input, "input", ctx.input_input_handler);
    		},

    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h2);
    			append(h2, t0);
    			append(div, t1);
    			append(div, input);

    			set_input_value(input, ctx.value);
    		},

    		p(changed, ctx) {
    			if (changed.color) {
    				set_data(t0, ctx.color);
    			}

    			if (changed.value && (input.value !== ctx.value)) set_input_value(input, ctx.value);

    			if (changed.color) {
    				set_style(div, "background", ctx.color);
    			}
    		},

    		i: noop,
    		o: noop,

    		d(detaching) {
    			if (detaching) {
    				detach(div);
    			}

    			dispose();
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	function input_input_handler() {
    		value = this.value;
    		$$invalidate('value', value);
    	}

    	let value, color;

    	$$self.$$.update = ($$dirty = { value: 1 }) => {
    		if ($$dirty.value) { $$invalidate('color', color = `rgb(${getColorForString(value).join(',')})`); }
    	};

    	$$invalidate('value', value = "");

    	return { value, color, input_input_handler };
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    	}
    }

    const app = new App({
      target: document.getElementById("root"),
    });

}());
//# sourceMappingURL=bundle.[hash].js.map