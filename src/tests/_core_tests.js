/**
 * Created by fbaytelm on 8/4/15.
 */

var tests = [];

function runTests() {
    var passed = 0;
    var failed = 0;
    var t_start = new Date().getTime();
    tests.forEach(function (obj) {
        try {
            var start = new Date().getTime();
            obj();
            var end = new Date().getTime();
            console.log("{0} pass {1}ms".format(getFunctionName(obj), end - start));
            passed++;
        } catch (e) {
            console.log("{0} fail: {1} ({2})".format(getFunctionName(obj), (e.message?e.message:e.constructor.name), e.line));
            failed++;
        }
    });
    var t_end = new Date().getTime();
    console.log("==== {0}ms ====".format(t_end - t_start));
    console.log("pass " + passed + "/" + (passed + failed));
    console.log("fail " + failed + "/" + (passed + failed));

}
setTimeout(runTests, 1);
