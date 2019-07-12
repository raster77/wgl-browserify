const SimpleTest = require('../src/simpleTest/SimpleTest');
const Vector3 = require('../src/wgl/Vector3');

const test = new SimpleTest('Vector3 tests');

function arrayEquals(a, b) {
        if (a.length !== b.length) {
                return false;
        } else {
                for (let i = 0, l = a.length; i < l; i++) {
                        if (a[i] !== b[i]) {
                                res = false;
                                console.log('break at ' + i);
                                return false;
                        }
                }
        }
        return true;
}

function run() {

        let v = new Vector3();
        test.add('new Vector3() should be 0, 0, 0', arrayEquals(v.datas, [0, 0, 0]));

        v = new Vector3(1, 2, 3);
        test.add('new Vector3(1, 2, 3) should be 1, 2, 3', arrayEquals(v.datas, [1, 2, 3]));

        v = new Vector3(1, 2);
        test.add('new Vector3(1, 2) should be 1, 1, 1', arrayEquals(v.datas, [1, 1, 1]));

        v.set(10, 20, 30);
        test.add('v.set(10, 20, 30) should be 10, 20, 30', arrayEquals(v.datas, [10, 20, 30]));

        v.setAll(100);
        test.add('v.setAll(100) should be 100, 100, 100', arrayEquals(v.datas, [100, 100, 100]));

        v.set(1, 2, 3).add(new Vector3(4, 5, 6));
        test.add('v.set(1, 2, 3).add(new Vector3(4, 5, 6)) shoud be 5, 7, 9', arrayEquals(v.datas, [5, 7, 9]));

        v.set(1, 2, 3).substract(new Vector3(4, 5, 6));
        test.add('v.set(1, 2, 3).substract(new Vector3(4, 5, 6)) shoud be -3, -3, -3', arrayEquals(v.datas, [-3, -3, -3]));

        v.set(1, 2, 3).multiply(new Vector3(4, 5, 6));
        test.add('v.set(1, 2, 3).multiply(new Vector3(4, 5, 6)) shoud be 4, 10, 18', arrayEquals(v.datas, [4, 10, 18]));

        v.set(1, 2, 3).divide(new Vector3(4, 5, 6));
        let v2 = v.datas[1].toFixed(2);
        test.add('v.set(1, 2, 3).divide(new Vector3(4, 5, 6)) shoud be 0.25, 0.4, 0.5',
                v.datas[0] === 0.25 && v2 === '0.40' && v.datas[2] === 0.5);

        l = v.set(10, 20, 30).lengthSquared();
        test.add('v.set(10, 20, 30).lengthSquared() shoud be 1400', l === 1400);

        l = v.length();
        test.add('vec3.length(vec3.create(10, 20, 30)) shoud be 37.41', l === 37.416573867739416);

        let vCross = v.set(1, 2, 3).cross(new Vector3(4, 5, 6));
        test.add('v.set(1, 2, 3).cross(new Vector3(4, 5, 6)) shoud be -3, 6, -3', arrayEquals(vCross.datas, [-3, 6, -3]));

        l = v.dot(new Vector3(4, 5, 6));
        test.add('v.dot(new Vector3(4, 5, 6)) shoud be 32', l === 32);

        let vNormalize = v.set(1, 2, 3).normalize();
        test.add('v.set(1, 2, 3).normalize() shoud be 6, 3.74, 6', arrayEquals(vNormalize.datas, [0.2672612419124244, 0.5345224838248488, 0.8017837257372732]));

        l = v.setAll(10).distanceSquared(new Vector3(100));
        test.add('v.setAll(10).distanceSquared(new Vector3(100)) shoud be 24300', l === 24300);

        l = new Vector3(10).distance(new Vector3(100));
        test.add('new Vector3(10).distance(new Vector3(100)) shoud be 155.88457268119896', l === 155.88457268119896);

        v.set(10, 15, -20).negate();
        test.add('v.set(10, 15, -20).negate() shoud be -10, -15, 20', arrayEquals(v.datas, [-10, -15, 20]));

        let floatArr = v.toFloat32Array();
        test.add('v.toFloat32Array() shoud be -10, -15, 20',
                floatArr[0] === -10 && floatArr[1] === -15 && floatArr[2] === 20);

        let clonedVec = v.clone();
        test.add('v.toFloat32Array() shoud be -10, -15, 20', arrayEquals(clonedVec.datas, [-10, -15, 20]));

        test.run();
}

exports.run = run;