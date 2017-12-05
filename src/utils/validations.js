export const validations = {
	checkMinLength: function(text, minLength) {
		if(text.length >= minLength) {
			return '';
		} else {
			return `length should be at least ${minLength} characters`;
		}
	}
}
