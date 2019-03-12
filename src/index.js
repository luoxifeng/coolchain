var isFuncition = fn => typeof fn === 'function';
var join = (...arr) => arr.join("");

function loop(obj, protoObj) {
    protoObj._nextChains.forEach(chain => {
        var _path = chain.path;
        if (isFuncition(chain)) return;
        obj[_path] = Object.create(chain, {
            _prevChain: {
                value: obj
            }
        });
        loop(obj[_path], chain);
    });
}

class Chain {
    constructor(path, prevChain, index = 0) {
        this._prevChain = prevChain;
        this._nextChains = [];
        this.path = path;
        this.index = index;
    }

    invokePath() {
        var invokePath = this._prevChain.invokePath;
        return (isFuncition(invokePath) ? invokePath.call(this._prevChain) : invokePath) + `.${this.path}`;
    }
}

class CoolChain extends Chain {
    constructor(fn) {
        super("_", null);
        this._endFn = fn;
    }

    invokePath() {
        return this.path;
    }

    init() {
        var selfTop = this;
        const chain = function chain(target, paths, index = 1) {
            var path = paths.shift();
            var isFn = false;
            if(/\(\)$/.test(path)) {
                path = path.replace(/\(\)/g, "");
                isFn = true;
            }
    
            if (!target[path]) {
                if (isFn) {
                    function middleFn(arg) {
                        var _invokePath = this.invokePath();

                        function fn() {}
                        fn.prototype = middleFn;
                        var o = new fn()
                        o.invokePath = () => join(_invokePath, `.${path}(${arg || ''})`);
                       
                        loop(o, middleFn);
                        return o;
                    }
                   
                    middleFn.__proto__ = new Chain(`${path}()`, target, index);
                    target[path] = middleFn;
                } else {
                    if (!paths.length) {
                        function endFn(arg) {
                            var g = join(this.invokePath(), `.${path}(${arg || ''})`);

                            selfTop._endFn.apply(selfTop, [g])
                        }
                        endFn.isEnd = true;
                        target[path] = endFn;
                    } else {
                        target[path] = new Chain(path, target, index);
                    }
                }
                target._nextChains.push(target[path]);
            }

            if (paths.length) {
                chain(target[path], paths, ++index);
            }
        }
    
        this._invokes.forEach(invoke => {
            chain(this, invoke);
        });
    
    }

    register(invokes) {
        this._invokes = [invokes];
        this.init();
    }
    
}

var target = {};

var chain = new CoolChain(function (args) {
    console.log(args, this);
});
chain.register(["success", "top", "duration()", "text()", "show"])
chain.register(["except()", "toBe"])

chain.success.top.duration(1000).text(10).show("测试");
// chain.success.top.duration(2000).text(10).show("测试");

// chain.register(["success", "bottom", "duration()", "show"])
// chain.success.bottom.duration(1000).show("测试");

// chain.register(["type()", "position()", "duration()", "show"])
// chain.type('success').position('bottom').duration(1000).show("测试");

// chain.register(["type()", "position()", "sleep()", "show"])
// chain.type('success').position('bottom').sleep(1000).show("测试");
