function unitTest(description, condition, message) {
    this.description = description;
    this.condition = condition;
    this.message = message;
}

function assert(description, condition, message) {
    let res = false;
    console.log(description);
    if (!condition) {
        console.error('\x1b[31m%s\x1b[0m', message || '    Failed');
    } else {
        res = true;
        console.log('\x1b[32m%s\x1b[0m', '    Passed');
    }
    return res;
}

class SimpleTest {
    constructor(name) {
        this.name = name;
        this.datas = [];
    }

    add(description, condition, message) {
        this.datas.push(new unitTest(description, condition, message));
    }

    run() {
        let passedTest = 0;
        let failedTest = 0;
        console.log(this.name);
        console.log(this.datas.length + ' tests to run');
        console.log('------------------------------');
        console.log('');
        let i = 1;
        this.datas.forEach(test => {
            let desc = '  #Test ' + i + ': ' + test.description;
            if (assert(desc, test.condition, test.message)) {
                passedTest++;
            } else {
                failedTest++;
            }
            i++;
        });
        
        console.log('');
        console.log('Done');
        console.log(passedTest + ' / ' + this.datas.length + ' tests passed');
        console.log(failedTest + ' / ' + this.datas.length + ' tests failed');
        console.log('------------------------------');
    }
}

module.exports = SimpleTest;