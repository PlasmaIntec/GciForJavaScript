/*
 *  GciLibrary.js
 */

const FFI = require('ffi-napi');

const OOP_ILLEGAL = 1;
const OOP_NIL = 20;
const OOP_CLASS_STRING = 74753;

const GciSessionType = 'int64';
const OopType = 'int64';

class GciErrSType {       // gci.ht 
    constructor() { this.buffer = Buffer.alloc(2200);   }   // 2163 plus some padding
    ref()       { return this.buffer;                   }
    category()  { return this.buffer.readIntLE(  0, 6); }   // size is actually 8 bytes, but Buffer only supports 6 bytes before Node.js v12.0.0
    context()   { return this.buffer.readIntLE(  8, 6); }
    exception() { return this.buffer.readIntLE( 16, 6); }
    // args() an array of 10 OopType values
    number()    { return this.buffer.readIntLE(104, 4); }
    argCount()  { return this.buffer.readIntLE(108, 4); }
    fatal()     { return this.buffer.readIntLE(112, 1); }
    message()   { return this.buffer.toString('utf8',  113, 1025).split('\0').shift() }
    reason()    { return this.buffer.toString('utf8', 1138, 1025).split('\0').shift() }
}

GciLibrary = (path) => {
    return FFI.Library(path, {
        'GciI32ToOop'               : [ OopType,    [ 'int'] ], 
        'GciTsAbort'                : [ 'bool',     [ GciSessionType, 'pointer' ] ],
        'GciTsBegin'                : [ 'bool',     [ GciSessionType, 'pointer' ] ],
        'GciTsBreak'                : [ 'bool',     [ GciSessionType, 'bool', 'pointer' ] ],
        'GciTsCommit'               : [ 'bool',     [ GciSessionType, 'pointer' ] ],
        'GciTsCallInProgress'       : [ 'int',      [ GciSessionType, 'pointer' ] ],
        'GciTsCharToOop'            : [ OopType,    [ 'uint' ] ],
        'GciTsDoubleToSmallDouble'  : [ OopType,    [ 'double'] ], 
        'GciTsEncrypt'              : [ 'string',   [ 'string', 'pointer', 'int64' ]],
        'GciTsExecute'              : [ OopType,    [ 
                                        GciSessionType, 
                                        'string',   // const char* sourceStr
                                        OopType,    // sourceOop
                                        OopType,    // contextObject
                                        OopType,    // symbolList
                                        'int',      // int flags
                                        'uint16',   // ushort environmentId
                                        'pointer'   // GciErrSType *err
                                    ] ],
        'GciTsExecute_'             : [ OopType,    [ 
                                        GciSessionType, 
                                        'string',   // const char* sourceStr
                                        'int64',    // ssize_t sourceSize
                                        OopType,    // sourceOop
                                        OopType,    // context
                                        OopType,    // symbolList
                                        'int',      // flags
                                        'uint16',   // ushort environmentId
                                        'pointer'   // GciErrSType *err
                                    ] ],
        'GciTsExecuteFetchBytes'    : [ 'int64',    [ 
                                        GciSessionType, 
                                        'string',   // const char* sourceStr
                                        'int64',    // ssize_t sourceSize
                                        OopType,    // sourceOop
                                        OopType,    // context
                                        OopType,    // symbolList
                                        'pointer',  // ByteType *result
                                        'uint64',   // ssize_t maxResultSize
                                        'pointer'   // GciErrSType *err
                                    ] ],
        'GciTsFetchClass'           : [ OopType,    [ GciSessionType, OopType, 'pointer' ] ],
        'GciTsFetchSize'            : [ 'int64',    [ GciSessionType, OopType, 'pointer' ] ],
        'GciTsFetchVaryingSize'     : [ 'int64',    [ GciSessionType, OopType, 'pointer' ] ],
        'GciTsGemTrace'             : [ 'int',      [ GciSessionType, 'int', 'pointer' ] ],
        'GciTsIsKindOf'             : [ 'int',      [ GciSessionType, OopType, OopType, 'pointer' ] ],
        'GciTsLogin'                : [ GciSessionType, [ 
                                        'string', // const char *StoneNameNrs
                                        'string', // const char *HostUserId
                                        'string', // const char *HostPassword
                                        'bool',   // BoolType hostPwIsEncrypted
                                        'string', // const char *GemServiceNrs
                                        'string', // const char *gemstoneUsername
                                        'string', // const char *gemstonePassword
                                        'uint',   // unsigned int loginFlags (per GCI_LOGIN* in gci.ht)
                                        'int',    // int haltOnErrNum
                                        'pointer' // GciErrSType *err
                                    ] ],
        'GciTsLogout'               : [ 'bool',     [ GciSessionType, 'pointer' ] ],
        'GciTsOopIsSpecial'         : [ 'bool',     [ OopType ] ],
        'GciTsOopToChar'            : [ 'int',      [ OopType ] ],
        'GciTsPerform'              : [ OopType,    [ 
                                        GciSessionType, 
                                        OopType,    // receiver
                                        OopType,    // aSymbol 
                                        'string',   // const char* selectorStr 
                                        'pointer',  // const OopType *args
                                        'int',      // int numArgs
                                        'int',      // int flags
                                        'uint16',   // ushort environmentId
                                        'pointer'   // GciErrSType *err
                                    ] ],
        'GciTsPerformFetchBytes'    : [ OopType,    [ 
                                        GciSessionType, 
                                        OopType,    // receiver 
                                        'string',   // const char *selectorStr
                                        'pointer',  // const OopType *args 
                                        'int',      // int numArgs
                                        'pointer',  // ByteType *result
                                        'uint64',   // ssize_t  maxResultSize
                                        'pointer'   // GciErrSType *err 
                                    ] ],
        'GciTsProtectMethods'       : [ 'bool',     [ GciSessionType, 'bool', 'pointer' ] ],
        'GciTsResolveSymbol'        : [ OopType,    [ GciSessionType, 'string', OopType, 'pointer' ] ],
        'GciTsResolveSymbolObj'     : [ OopType,    [ GciSessionType, OopType, OopType, 'pointer' ] ],
        'GciTsSessionIsRemote'      : [ 'int',      [ GciSessionType ] ],
        'GciTsVersion'              : [ 'uint',     [ 'string', 'size_t' ] ],
    });
}

module.exports = { GciLibrary, GciErrSType, OOP_ILLEGAL, OOP_NIL, OOP_CLASS_STRING };
