// zerovalidate

// Copyright 2013 Moshe Kolodny
// Released under the MIT license

;(function($) {
	$.fn.zerovalidate = function(validateFunctions, options) {
		options = $.extend({
			errorClass: 'zero-validate-error',
			inputPassed: function($input) { $input.popover('destroy').removeClass(options.errorClass); },
			inputFailed: function(errorString, $input) {
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
			formPassed: $.noop,
			formFailed: function(e) {
				if (e.type === 'submit') {
					e.preventDefault();
				} else {
					return false; // e.type === 'validate' when triggered with .triggerHandler('validate') return failure
				}
			}
		}, options);

		return this.each(function() {
			var $form = $(this),
				validSoFar,
				runThroughInputs = function($formInputs, goodFn, badFn) {
					$formInputs.each(function() {
						var
							$input = $(this),
							validate = $input.data('validate'),
							validateFn = validateFunctions[validate] || $.fn.zerovalidate.functions[validate] || $.noop,							
							result = validateFn.call($input[0], ['checkbox', 'radio'].indexOf($input[0].type.toLowerCase()) > -1 ? $input[0].checked : $input.val(), $input, $form);

						if (typeof result === 'string') {
							badFn.call($input[0], result, $input, $form);
							validSoFar = false;
						} else {
							goodFn.call($input[0], $input, $form);
						}
					});
				};

			$form.on('submit validate', function(e) {
				validSoFar = true;
				runThroughInputs($form.find(':input'), options.inputPassed, options.inputFailed);
				if (!validSoFar) {
					return options.formFailed.call($form[0], e, $form);
				} else {
					return options.formPassed.call($form[0], e, $form);
				}
			});

			$form.on('input', ':input:not(:radio,:checkbox,select)', function() {
				runThroughInputs($form.find('.' + options.errorClass), options.inputPassed, $.noop);
			});
			$form.on('click', ':radio,:checkbox', function() {
				runThroughInputs($form.find('.' + options.errorClass), options.inputPassed, $.noop);
			});
			$form.on('change', 'select', function() {
				runThroughInputs($form.find('.' + options.errorClass), options.inputPassed, $.noop);
			});
		});
	};
	$.fn.zerovalidate.functions = {
		notBlank: function(value) { if (!$.trim(value).length) return 'This field cannot be left blank'; }
		//email: function(value) { if (!/\w{2,}@\w{2,}\.\w{2,}/.test(value)) return 'Please enter a valid email'; }
	};
})(jQuery);

