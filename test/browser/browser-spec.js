﻿// vm-shim browser-spec

describe("vm-shim suite", function() {
  
  it("contains runInContext()", function() {
  
    expect(typeof vm.runInContext).toBe('function');
  });
  
  // rest of these lean on vm to execute assertions
  
  it("passes expect to context", function() {
  
    vm.runInContext("expect(true).toBe(true);", { 
        expect: expect
    });
  });  
    
  it("context not leaked", function() {
  
    vm.runInContext("expect(context).toBe(undefined);", { 
        expect: expect
    });
  });
  
  it("passes string value", function() {
  
    vm.runInContext("expect(string).toBe('string value');", { 
        expect: expect,
        string: 'string value'
    });
  });
  
  it("passes number value", function() {
  
    vm.runInContext("expect(number).toBe(347.347);", { 
        expect: expect,
        number: 347.347
    });
  });
  
  it("passes boolean value", function() {
  
    vm.runInContext("expect(boolean).toBe(true);", { 
        expect: expect,
        boolean: true
    });
  });

  it("passes objects as properties", function() {

    vm.runInContext("expect(object.id).toBe('an id/string');", { 
      expect: expect,
      object: { id: 'an id/string' } 
    });
  });

  it("accepts function as src-code", function() {

    vm.runInContext(function(){
  
      expect(context).toBe(undefined);
      expect(object.id).toBe('an id/string');
    
    }, { object: { id: 'an id/string' }, expect: expect });
  });

  it("internal vars not leaked", function() {

    vm.runInContext(function(code,src,key){
    
      var undef = 'undefined';
      
      expect(typeof context).toBe(undef);
      expect(typeof code).toBe(undef);
      expect(typeof src).toBe(undef);
      expect(typeof key).toBe(undef);
    
    }, { expect: expect });
  });
  
  it("context attrs override external scope vars", function() {

    var attr = "shouldn't see this";
   
    vm.runInContext(function(){
  
      expect(attr).toBe('ok');

    }, { attr: 'ok', expect: expect });
  });
  
  it("bad code throws error", function() {
    
    function exec(){
      
      function throwIt() {
        barf;
      }

      // now try it and view the console
      try {
        throwIt();
      } catch (e) {
        if (typeof console != 'undefined') {
          console.dir(e);
        }
        expect(e.message).toContain('barf');
      }
    }
    
    vm.runInContext(exec, { expect: expect });
  });  
});

/*
  // original console tests - archiving for posterity :)
  
  vm.runInContext("console.log('should be null: ' + context); console.log('string'); console.log(string);", 
    { string: 'string value' });
    
  vm.runInContext("console.log('should be null: ' + context); console.log('number'); console.log(number);", 
    { number: 347.347 });
    
  vm.runInContext("console.log('should be null: ' + context); console.log('boolean'); console.log(boolean);", 
    { boolean: true });
  
  vm.runInContext(function(){
    console.log('should be null: ' + context); 
    console.log('function');
    console.log('should be an id/string: ' + object.id);
  }, { object: { id: 'an id/string' } });
  
*/