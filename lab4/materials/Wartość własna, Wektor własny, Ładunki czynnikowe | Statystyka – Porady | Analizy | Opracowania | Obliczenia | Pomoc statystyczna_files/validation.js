var LiveValidation=function(e,i){this.initialize(e,i)};LiveValidation.VERSION="1.3 standalone",LiveValidation.TEXTAREA=1,LiveValidation.TEXT=2,LiveValidation.PASSWORD=3,LiveValidation.CHECKBOX=4,LiveValidation.SELECT=5,LiveValidation.FILE=6,LiveValidation.massValidate=function(e){for(var i=!0,t=0,a=e.length;t<a;++t){var n=e[t].validate();i&&(i=n)}return i},LiveValidation.prototype={validClass:"LV_valid",invalidClass:"LV_invalid",messageClass:"LV_validation_message",validFieldClass:"LV_valid_field",invalidFieldClass:"LV_invalid_field",initialize:function(e,i){var t=this;if(!e)throw new Error("LiveValidation::initialize - No element reference or element id has been provided!");if(this.element=e.nodeName?e:document.getElementById(e),!this.element)throw new Error("LiveValidation::initialize - No element with reference or id of '"+e+"' exists!");this.validations=[],this.elementType=this.getElementType(),this.form=this.element.form;var a=i||{};this.validMessage=a.validMessage||"ok";var n=a.insertAfterWhatNode||this.element;if(this.insertAfterWhatNode=n.nodeType?n:document.getElementById(n),this.onValid=a.onValid||function(){this.insertMessage(this.createMessageSpan()),this.addFieldClass()},this.onInvalid=a.onInvalid||function(){this.insertMessage(this.createMessageSpan()),this.addFieldClass()},this.onlyOnBlur=a.onlyOnBlur||!1,this.wait=a.wait||0,this.onlyOnSubmit=a.onlyOnSubmit||!1,this.form&&(this.formObj=LiveValidationForm.getInstance(this.form),this.formObj.addField(this)),this.oldOnFocus=this.element.onfocus||function(){},this.oldOnBlur=this.element.onblur||function(){},this.oldOnClick=this.element.onclick||function(){},this.oldOnChange=this.element.onchange||function(){},this.oldOnKeyup=this.element.onkeyup||function(){},this.element.onfocus=function(e){return t.doOnFocus(e),t.oldOnFocus.call(this,e)},!this.onlyOnSubmit)switch(this.elementType){case LiveValidation.CHECKBOX:this.element.onclick=function(e){return t.validate(),t.oldOnClick.call(this,e)};case LiveValidation.SELECT:case LiveValidation.FILE:this.element.onchange=function(e){return t.validate(),t.oldOnChange.call(this,e)};break;default:this.onlyOnBlur||(this.element.onkeyup=function(e){return t.deferValidation(),t.oldOnKeyup.call(this,e)}),this.element.onblur=function(e){return t.doOnBlur(e),t.oldOnBlur.call(this,e)}}},destroy:function(){if(this.formObj&&(this.formObj.removeField(this),this.formObj.destroy()),this.element.onfocus=this.oldOnFocus,!this.onlyOnSubmit)switch(this.elementType){case LiveValidation.CHECKBOX:this.element.onclick=this.oldOnClick;case LiveValidation.SELECT:case LiveValidation.FILE:this.element.onchange=this.oldOnChange;break;default:this.onlyOnBlur||(this.element.onkeyup=this.oldOnKeyup),this.element.onblur=this.oldOnBlur}this.validations=[],this.removeMessageAndFieldClass()},add:function(e,i){return this.validations.push({type:e,params:i||{}}),this},remove:function(e,i){for(var t=!1,a=0,n=this.validations.length;a<n;a++)if(this.validations[a].type==e&&this.validations[a].params==i){t=!0;break}return t&&this.validations.splice(a,1),this},deferValidation:function(e){300<=this.wait&&this.removeMessageAndFieldClass();var i=this;this.timeout&&clearTimeout(i.timeout),this.timeout=setTimeout(function(){i.validate()},i.wait)},doOnBlur:function(e){this.focused=!1,this.validate(e)},doOnFocus:function(e){this.focused=!0,this.removeMessageAndFieldClass()},getElementType:function(){switch(!0){case"TEXTAREA"==this.element.nodeName.toUpperCase():return LiveValidation.TEXTAREA;case"INPUT"==this.element.nodeName.toUpperCase()&&"TEXT"==this.element.type.toUpperCase():return LiveValidation.TEXT;case"INPUT"==this.element.nodeName.toUpperCase()&&"PASSWORD"==this.element.type.toUpperCase():return LiveValidation.PASSWORD;case"INPUT"==this.element.nodeName.toUpperCase()&&"CHECKBOX"==this.element.type.toUpperCase():return LiveValidation.CHECKBOX;case"INPUT"==this.element.nodeName.toUpperCase()&&"FILE"==this.element.type.toUpperCase():return LiveValidation.FILE;case"SELECT"==this.element.nodeName.toUpperCase():return LiveValidation.SELECT;case"INPUT"==this.element.nodeName.toUpperCase():throw new Error("LiveValidation::getElementType - Cannot use LiveValidation on an "+this.element.type+" input!");default:throw new Error("LiveValidation::getElementType - Element must be an input, select, or textarea!")}},doValidations:function(){this.validationFailed=!1;for(var e=0,i=this.validations.length;e<i;++e){var t=this.validations[e];switch(t.type){case Validate.Presence:case Validate.Confirmation:case Validate.Acceptance:this.displayMessageWhenEmpty=!0,this.validationFailed=!this.validateElement(t.type,t.params);break;default:this.validationFailed=!this.validateElement(t.type,t.params)}if(this.validationFailed)return!1}return this.message=this.validMessage,!0},validateElement:function(e,i){var t=this.elementType==LiveValidation.SELECT?this.element.options[this.element.selectedIndex].value:this.element.value;if(e==Validate.Acceptance){if(this.elementType!=LiveValidation.CHECKBOX)throw new Error("LiveValidation::validateElement - Element to validate acceptance must be a checkbox!");t=this.element.checked}var a=!0;try{e(t,i)}catch(e){if(!(e instanceof Validate.Error))throw e;(""!==t||""===t&&this.displayMessageWhenEmpty)&&(this.validationFailed=!0,this.message=e.message,a=!1)}finally{return a}},validate:function(){return!!this.element.disabled||(this.doValidations()?(this.onValid(),!0):(this.onInvalid(),!1))},enable:function(){return this.element.disabled=!1,this},disable:function(){return this.element.disabled=!0,this.removeMessageAndFieldClass(),this},createMessageSpan:function(){var e=document.createElement("span"),i=document.createTextNode(this.message);return e.appendChild(i),e},insertMessage:function(e){if(this.removeMessage(),this.displayMessageWhenEmpty&&(this.elementType==LiveValidation.CHECKBOX||""==this.element.value)||""!=this.element.value){var i=this.validationFailed?this.invalidClass:this.validClass;e.className+=" "+this.messageClass+" "+i,this.insertAfterWhatNode.nextSibling?this.insertAfterWhatNode.parentNode.insertBefore(e,this.insertAfterWhatNode.nextSibling):this.insertAfterWhatNode.parentNode.appendChild(e)}},addFieldClass:function(){this.removeFieldClass(),this.validationFailed?-1==this.element.className.indexOf(this.invalidFieldClass)&&(this.element.className+=" "+this.invalidFieldClass):(this.displayMessageWhenEmpty||""!=this.element.value)&&-1==this.element.className.indexOf(this.validFieldClass)&&(this.element.className+=" "+this.validFieldClass)},removeMessage:function(){for(var e,i=this.insertAfterWhatNode;i.nextSibling;){if(1===i.nextSibling.nodeType){e=i.nextSibling;break}i=i.nextSibling}e&&-1!=e.className.indexOf(this.messageClass)&&this.insertAfterWhatNode.parentNode.removeChild(e)},removeFieldClass:function(){-1!=this.element.className.indexOf(this.invalidFieldClass)&&(this.element.className=this.element.className.split(this.invalidFieldClass).join("")),-1!=this.element.className.indexOf(this.validFieldClass)&&(this.element.className=this.element.className.split(this.validFieldClass).join(" "))},removeMessageAndFieldClass:function(){this.removeMessage(),this.removeFieldClass()}};var LiveValidationForm=function(e){this.initialize(e)};LiveValidationForm.instances={},LiveValidationForm.getInstance=function(e){var i=Math.random()*Math.random();return e.id||(e.id="formId_"+i.toString().replace(/\./,"")+(new Date).valueOf()),LiveValidationForm.instances[e.id]||(LiveValidationForm.instances[e.id]=new LiveValidationForm(e)),LiveValidationForm.instances[e.id]},LiveValidationForm.prototype={initialize:function(e){this.name=e.id,this.element=e,this.fields=[],this.oldOnSubmit=this.element.onsubmit||function(){};var i=this;this.element.onsubmit=function(e){return!!LiveValidation.massValidate(i.fields)&&!1!==i.oldOnSubmit.call(this,e||window.event)}},addField:function(e){this.fields.push(e)},removeField:function(e){for(var i=[],t=0,a=this.fields.length;t<a;t++)this.fields[t]!==e&&i.push(this.fields[t]);this.fields=i},destroy:function(e){return!(0!=this.fields.length&&!e)&&(this.element.onsubmit=this.oldOnSubmit,!(LiveValidationForm.instances[this.name]=null))}};var Validate={Presence:function(e,i){var t=(i=i||{}).failureMessage||"Can't be empty!";return""!==e&&null!=e||Validate.fail(t),!0},Numericality:function(e,i){var t=e,a=(e=Number(e),(i=i||{}).minimum||0==i.minimum?i.minimum:null),n=i.maximum||0==i.maximum?i.maximum:null,s=i.is||0==i.is?i.is:null,l=i.notANumberMessage||"musi być liczbą!",o=i.notAnIntegerMessage||"musi być liczbą całkowitą!",r=i.wrongNumberMessage||"musi być "+s+"!",d=i.tooLowMessage||"nie może być mniejszy niż "+a+"!",h=i.tooHighMessage||"nie może być większy niż "+n+"!";switch(isFinite(e)||Validate.fail(l),i.onlyInteger&&(/\.0+$|\.$/.test(String(t))||e!=parseInt(e))&&Validate.fail(o),!0){case null!==s:e!=Number(s)&&Validate.fail(r);break;case null!==a&&null!==n:Validate.Numericality(e,{tooLowMessage:d,minimum:a}),Validate.Numericality(e,{tooHighMessage:h,maximum:n});break;case null!==a:e<Number(a)&&Validate.fail(d);break;case null!==n:e>Number(n)&&Validate.fail(h)}return!0},Format:function(e,i){e=String(e);var t=(i=i||{}).failureMessage||"Not valid!",a=i.pattern||/./,n=i.negate||!1;return n||a.test(e)||Validate.fail(t),n&&a.test(e)&&Validate.fail(t),!0},Email:function(e,i){var t=(i=i||{}).failureMessage||"Must be a valid email address!";return Validate.Format(e,{failureMessage:t,pattern:/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i}),!0},Length:function(e,i){e=String(e);var t=(i=i||{}).minimum||0==i.minimum?i.minimum:null,a=i.maximum||0==i.maximum?i.maximum:null,n=i.is||0==i.is?i.is:null,s=i.wrongLengthMessage||"Must be "+n+" characters long!",l=i.tooShortMessage||"Must not be less than "+t+" characters long!",o=i.tooLongMessage||"Must not be more than "+a+" characters long!";switch(!0){case null!==n:e.length!=Number(n)&&Validate.fail(s);break;case null!==t&&null!==a:Validate.Length(e,{tooShortMessage:l,minimum:t}),Validate.Length(e,{tooLongMessage:o,maximum:a});break;case null!==t:e.length<Number(t)&&Validate.fail(l);break;case null!==a:e.length>Number(a)&&Validate.fail(o);break;default:throw new Error("Validate::Length - Length(s) to validate against must be provided!")}return!0},Inclusion:function(e,i){var t=(i=i||{}).failureMessage||"nie może być zerem!",a=!1!==i.caseSensitive;if(i.allowNull&&null==e)return!0;i.allowNull||null!=e||Validate.fail(t);var n=i.within||[];if(!a){for(var s=[],l=0,o=n.length;l<o;++l){var r=n[l];"string"==typeof r&&(r=r.toLowerCase()),s.push(r)}n=s,"string"==typeof e&&(e=e.toLowerCase())}var d=!1,h=0;for(o=n.length;h<o;++h)n[h]==e&&(d=!0),i.partialMatch&&-1!=e.indexOf(n[h])&&(d=!0);return(!i.negate&&!d||i.negate&&d)&&Validate.fail(t),!0},Exclusion:function(e,i){return(i=i||{}).failureMessage=i.failureMessage||"nie może być zerem!",i.negate=!0,Validate.Inclusion(e,i),!0},Confirmation:function(e,i){if(!i.match)throw new Error("Validate::Confirmation - Error validating confirmation: Id of element to match must be provided!");var t=(i=i||{}).failureMessage||"Does not match!",a=i.match.nodeName?i.match:document.getElementById(i.match);if(!a)throw new Error("Validate::Confirmation - There is no reference with name of, or element with id of '"+i.match+"'!");return e!=a.value&&Validate.fail(t),!0},Acceptance:function(e,i){var t=(i=i||{}).failureMessage||"Must be accepted!";return e||Validate.fail(t),!0},Custom:function(e,i){var t=(i=i||{}).against||function(){return!0},a=i.args||{},n=i.failureMessage||"Not valid!";return t(e,a)||Validate.fail(n),!0},now:function(e,i,t){if(!e)throw new Error("Validate::now - Validation function must be provided!");var a=!0;try{e(i,t||{})}catch(e){if(!(e instanceof Validate.Error))throw e;a=!1}finally{return a}},fail:function(e){throw new Validate.Error(e)},Error:function(e){this.message=e,this.name="ValidationError"}};