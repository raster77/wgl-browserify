const Matrix4 = require('../src/wgl/Matrix4');
const Vector3 = require('../src/wgl/Vector3');
const SimpleTest = require('../src/simpleTest/SimpleTest');

const test = new SimpleTest('matrix4 tests');

function isEquivalent(a, b) {
        if (a === b) {
                return true;
        }
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
                return false;
        }

        for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];

                // If values of same property are not equal,
                // objects are not equivalent
                if (a[propName] !== b[propName]) {
                        return false;
                }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
}

function arrayEquals(a, b) {
        if (a.length !== b.length) {
                return false;
        } else {
                for (let i = 0, l = a.length; i < l; i++) {
                        if (a[i] !== b[i]) {
                                return false;
                        }
                }
        }
        return true;
}

function run() {
        let m4 = new Matrix4();
        //let res = arrayEquals(m4.datas, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        let res = isEquivalent(m4.datas, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        test.add('mat4.create()', res === true);

        m4.perspective(60, 800 / 600, 1, 1000);
        res = arrayEquals(m4.datas, [-0.1170899641212431, 0, 0, 0, 0, -0.15611995216165747, 0, 0, 0, 0, -1.002002002002002, -1, 0, 0, -2.002002002002002, 0]);
        test.add('mat4.perspective(60, 800/600, 1, 1000)', res === true);

        m4.identity();
        res = arrayEquals(m4.datas, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        test.add('m4.identity()', res === true);

        m4.translate(new Vector3(10, 20, 30));
        res = arrayEquals(m4.datas, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1]);
        test.add('m4.translate(new Vector3(10, 20, 30))', res === true);

        m4.rotateX(90);
        res = arrayEquals(m4.datas, [1, 0, 0, 0, 0, -0.4480736161291701, 0.8939966636005579, 0, 0, -0.8939966636005579, -0.4480736161291701, 0, 10, 20, 30, 1]);
        test.add('m4.rotateX(90)', res === true);

        m4.rotateY(90);
        res = arrayEquals(m4.datas, [-0.4480736161291701, 0.799230034528929, 0.4005763178669152, 0, 0, -0.4480736161291701, 0.8939966636005579, 0, 0.8939966636005579, 0.4005763178669152, 0.2007699654710709, 0, 10, 20, 30, 1]);
        test.add('m4.rotateY(90)', res === true);

        m4.rotateZ(90);
        res = arrayEquals(m4.datas, [0.2007699654710709, -0.758690209557334, 0.6197423552465924, 0, 0.4005763178669152, -0.5137390188471502, -0.758690209557334, 0, 0.8939966636005579, 0.4005763178669152, 0.2007699654710709, 0, 10, 20, 30, 1]);
        test.add('m4.rotateZ(90)', res === true);

        m4.scale(new Vector3(1.5));
        res = arrayEquals(m4.datas, [0.3011549482066064, -1.1380353143360011, 0.9296135328698886, 0, 0.6008644768003728, -0.7706085282707253, -1.1380353143360011, 0, 1.3409949954008367, 0.6008644768003728, 0.3011549482066064, 0, 10, 20, 30, 1]);
        test.add('m4.scale(new Vector3(1.5))', res === true);

        test.run();
}

exports.run = run;