zerovalidate
============

A minimalist javascript form validator

----

### Usage:

```HTML
<form id="form-id">
  <input type="text" name="input1" data-validate="someFunc" />
  <input type="text" name="input2" data-validate="someOtherFunc" />
  <input type="submit" value="submit" />
</form>
```

```javascript
$('#form-id').zerovalidate({
  someFunc: function(value) {
    if ($.trim(value) === 0) { return 'Please enter a value'; }
  },
  someOtherFunc: function(value, $input) {
    if ($input.data('startingValue') === value) { return 'Cannot use default value'; }
  }
});
```

---



#### Basic API:

`$.fn.zerovalidate(validateFunctions, options)`

`validateFunctions` is an object of function name => validate function (just look at the sample)  
context is the native DOM element, the arguments passed in are `($input.val(), $input, $form)`

`options` is an options object which can contain (taken right from the source):

---

```javascript
errorClass: 'zero-validate-error',
```

---

`inputPassed($input, $form)`: 
```javascript
inputPassed: function($input) { $input.removeClass(options.errorClass); },
```

---

`inputFailed(errorString, $input, $form)`:
```javascript
inputFailed: function(errorString, $input, $form) {
  $input  // validation failed
    .popover({
      content: errorString,
      placement: $input.data('placement') // it's ok if this is undefined, it defaults to right (so far)
  })
  .popover('show')
  .one('click', function() {
    $input.popover('destroy');
  })
  .addClass(options.errorClass);
},
```

---

`formPassed(event, $form)`:
```javascript
formPassed: $.noop,
```

---

`formFailed(event, $form)`:
```javascript
formFailed: function(e) { e.preventDefault(); }
```
