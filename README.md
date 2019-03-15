# coolchain
coolchain 让你的链式调用更语义化

## 用法

```
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
```