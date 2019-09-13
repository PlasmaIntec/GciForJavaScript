/*
 *  GciSession.test.js
 */

const { GciSession } = require("./GciSession");
let session;
let nil, arrayClass, byteArrayClass, collectionClass, globals, objectClass, stringClass, symbolClass, 
    symbolDictionaryClass, undefinedObjectClass;

getLogin = () => {
    const fs = require('fs');
    fs.access('./GciLogin.js', fs.F_OK, (err) => {
    if (err) {
        fs.copyFile('./GciDefault.js', './GciLogin.js', (err) => {
        if (err) throw err;
        });
    }
    });
    return require("./GciLogin");
}
const login = getLogin();

test('bad user', () => {
    let error;
    try {
        session = new GciSession({...login, gs_user: 'no such user'});
    } catch (e) {
        error = e;
    }
    expect(session).toBe(undefined);
    expect(error.message()).toBe('Login failed:  the userId/password combination is invalid or expired.');
})

test('login', () => {
    let error;
    try {
        session = new GciSession(login);
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
    expect(session === undefined).toBe(false);
})

test('abort', () => {
    let error;
    try {
        session.abort();
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
})

test('begin', () => {
    let error;
    try {
        session.begin();
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
})

test('break (hard)', () => {
    let error;
    try {
        session.hardBreak();
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
})

test('break (soft)', () => {
    let error;
    try {
        session.softBreak();
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
})

test('commit', () => {
    let error;
    try {
        session.commit();
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
})

test('isCallInProgress', () => {
    let error, flag;
    try {
        flag = session.isCallInProgress();
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
    expect(flag).toBe(false);
})

test('trace', () => {
    let error, flag0, flag1, flag2, flag3;
    try {
        flag0 = session.trace(1);
        flag1 = session.trace(2);
        flag2 = session.trace(3);
        flag3 = session.trace(0);
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
    expect(flag0).toBe(0);
    expect(flag1).toBe(1);
    expect(flag2).toBe(2);
    expect(flag3).toBe(3);
})

test('resolveSymbol', () => {
    let error, other;
    try {
        nil = session.resolveSymbol('nil');
        arrayClass = session.resolveSymbol('Array');
        byteArrayClass = session.resolveSymbol('ByteArray');
        collectionClass = session.resolveSymbol('Collection');
        globals = session.resolveSymbol('Globals');
        objectClass = session.resolveSymbol('Object');
        stringClass = session.resolveSymbol('String');
        symbolClass = session.resolveSymbol('Symbol');
        symbolDictionaryClass = session.resolveSymbol('SymbolDictionary');
        undefinedObjectClass = session.resolveSymbol('UndefinedObject');
        other = session.resolveSymbol('should not be found!');
    } catch (e) {
        error = e;
    }
    expect(nil).toBe(20);
    expect(arrayClass).toBe(66817);
    expect(objectClass).toBe(72193);
    expect(globals).toBe(207361);
    expect(other).toBe(undefined);
    expect(error.message).toBe('Symbol not found!');
})

test('resolveSymbolObj', () => {
    let error, oop;
    try {
        oop = session.execute('#Array');
        oop = session.resolveSymbolObj(oop);
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
    expect(oop).toBe(66817);    // Array

})

test('fetchClass', () => {
    let error, oop;
    try {
        oop = session.fetchClass(globals);
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
    expect(oop).toBe(symbolDictionaryClass);
})

test('fetchSize', () => {
    let error, sizeOfNil, sizeOfArrayClass, sizeOfGlobals;
    try {
        sizeOfNil = session.fetchSize(nil);
        sizeOfArrayClass = session.fetchSize(arrayClass);
        sizeOfGlobals = session.fetchSize(globals);
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
    expect(sizeOfNil).toBe(0);
    expect(sizeOfArrayClass).toBe(19);
    expect(sizeOfGlobals > 1000).toBe(true);
})

test('fetchVaryingSize', () => {
    let error, sizeOfNil, sizeOfArrayClass, sizeOfGlobals;
    try {
        sizeOfArrayClass = session.fetchVaryingSize(arrayClass);
        sizeOfGlobals = session.fetchVaryingSize(globals);
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
    expect(sizeOfArrayClass).toBe(0);
    expect(sizeOfGlobals > 1000).toBe(true);
})

test('isKindOf', () => {
    let error, flag1, flag2;
    try {
        flag1 = session.isKindOf(globals, symbolDictionaryClass);
        flag2 = session.isKindOf(nil, symbolDictionaryClass);
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
    expect(flag1).toBe(true);
    expect(flag2).toBe(false);
})

test('isKindOfClass', () => {
    expect(session.isKindOfClass(globals, symbolDictionaryClass)).toBe(true);
    expect(session.isKindOfClass(nil, symbolDictionaryClass)).toBe(false);
})

test('isSubclassOf', () => {
    expect(session.isSubclassOf(arrayClass, collectionClass)).toBe(true);
    expect(session.isSubclassOf(collectionClass, arrayClass)).toBe(false);
})

test('isSubclassOfClass', () => {
    expect(session.isSubclassOfClass(arrayClass, collectionClass)).toBe(true);
    expect(session.isSubclassOfClass(collectionClass, arrayClass)).toBe(false);
})

test('oopIsSpecial', () => {
    expect(session.oopIsSpecial(nil)).toBe(true);
    expect(session.oopIsSpecial(globals)).toBe(false);
})

test('objExists', () => {
    expect(session.objExists(nil)).toBe(true);
    expect(session.objExists(nil + 1)).toBe(false);
})

test('execute', () => {
    let error, oop1, oop2;
    try {
        oop1 = session.execute('Array');
        oop2 = session.execute('2 + 3');
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
    expect(oop1).toBe(arrayClass);
    expect(oop2).toBe(42);
})

test('executeFetchBytes', () => {
    let error, string;
    try {
        string = session.executeFetchBytes("'Hello World!'", 16);
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
    expect(string).toBe('Hello World!');
})

test('perform', () => {
    let error, oop1, oop2;
    try {
        oop1 = session.perform(globals, 'yourself', []);
        oop2 = session.perform(18, '+', [26]);  // 2 + 3
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
    expect(oop1).toBe(globals);
    expect(oop2).toBe(42);      // 5
})

test('performFetchBytes', () => {
    let error, string1, string2, string3;
    try {
        string1 = session.performFetchBytes(42, 'printString', [], 8);
        string2 = session.performFetchBytes(arrayClass, 'printString', [], 6);
        string3 = session.performFetchBytes(arrayClass, 'printString', [], 4);
    } catch (e) {
        error = e;
    }
    expect(string1).toBe('5');
    expect(string2).toBe('Array');
    expect(string3).toBe(undefined);
    expect(error.message).toBe('Actual size of 5 exceeded buffer size of 4');
})

test('continue', () => {
    let error, oop;
    try {
        oop = session.execute('2 halt + 3');
    } catch (e) {
        error = e;
    }
    expect(oop).toBe(undefined);
    expect(error.message()).toBe('a Halt occurred (error 2709)');
    oop = session.continueWith(error.context());
    expect(oop).toBe(42);
})

test('continueWith', () => {
    let error, oop;
    try {
        oop = session.execute('5 / 0');
    } catch (e) {
        error = e;
    }
    expect(oop).toBe(undefined);
    expect(error.number()).toBe(2026); // a ZeroDivide occurred
    oop = session.continueWith(error.context(), 42);
    expect(oop).toBe(42);
})

test('clearStack', () => {
    let error, oop, gsProcess;
    try {
        oop = session.execute('5 / 0');
    } catch (e) {
        error = e;
    }
    expect(oop).toBe(undefined);
    expect(error.number()).toBe(2026); // a ZeroDivide occurred
    gsProcess = error.context();
    try {
        session.clearStack(gsProcess);
        oop = session.continueWith(gsProcess);
    } catch (e) {
        error = e;
    }
    expect(oop).toBe(undefined);
    expect(error.number()).toBe(2092); // an InternalError occurred
})

test('fetchSpecialClass', () => {
    let error;
    expect(session.fetchSpecialClass(nil)).toBe(undefinedObjectClass);
    try {
        session.fetchSpecialClass(21);
    } catch (e) {
        error = e;
    }
    expect(error.message).toBe('Not a special OOP');
})

test('doubleToOop', () => {
    let oop;
    oop = session.doubleToOop(1.0);
    expect(oop).toBe('9151314442816847878');
})

test('oopToDouble', () => {
    const oop = '9151314442816847878';
    const double = session.oopToDouble(oop);
    expect(double).toBe(1.0);
})

test('i64ToOop', () => {
    const oop = session.i64ToOop(5);
    expect(oop).toBe(42);
})

test('oopToI64', () => {
    expect(session.oopToI64(42)).toBe(5); 
})

test('newObj', () => {
    const obj = session.newObj(arrayClass);
    expect(session.isKindOf(obj, arrayClass)).toBe(true);
})

test('newByteArray', () => {
    let obj = session.newByteArray();
    expect(session.isKindOf(obj, byteArrayClass)).toBe(true);
    expect(session.fetchSize(obj)).toBe(0);
    obj = session.newByteArray('abc\0xyz');
    expect(session.fetchSize(obj)).toBe(7);
    obj = session.newByteArray('abc\0xyz', 3);
    expect(session.fetchSize(obj)).toBe(3);
})

test('newString', () => {
    let obj = session.newString();
    expect(session.isKindOf(obj, stringClass)).toBe(true);
    expect(session.fetchSize(obj)).toBe(0);
    obj = session.newString('abc\0xyz');
    expect(session.fetchSize(obj)).toBe(3);
})

test('newSymbol', () => {
    let obj = session.newSymbol('Array');
    expect(session.isKindOf(obj, symbolClass)).toBe(true);
})

test('logout', () => {
    let error;
    try {
        session.logout();
    } catch (e) {
        error = e;
    }
    expect(error).toBe(undefined);
})

test('logout', () => {
    let error;
    try {
        session.logout();
    } catch (e) {
        error = e;
    }
    expect(error.message()).toBe('argument is not a valid GciSession pointer');
})

test('version', () => {
    const version = session.version();
    // expect(version).toBe('3.4.3 build gss64_3_4_x_branch-45183');
    expect(version).toBe('3.5.0 build 64bit-46205');
})

