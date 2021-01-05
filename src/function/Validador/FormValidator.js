import validator from 'validator';

class FormValidator {
  constructor(validations) {
    this.validations = validations;
  }

  validate(state) {

    
    let validation = this.valid();

    this.validations.forEach(rule => {

  
      // let tipo = typeof state[rule.field]

      if (!validation[rule.field].isInvalid) {

           
        let field_value=''
        if((typeof state[rule.field]) === 'string' || (typeof state[rule.field]) === 'number'  ){
            field_value= state[rule.field].toString();
        }else if(state[rule.field] === null ){
            field_value = ""
        }else{
            field_value= Object.keys(state[rule.field]).length.toString();
            if(field_value==='0'){
              field_value = ""
            }
        }
                
         const args = rule.args || [];
         const validation_method = 
                typeof rule.method === 'string' ?
                validator[rule.method] : 
                rule.method
        if(validation_method(field_value, ...args, state) !== rule.validWhen) {
            validation[rule.field] = { isInvalid: true, message: rule.message }
            validation.isValid = false;
        }
      }
    });

    return validation;
  }

  valid() {
    const validation = {}

    this.validations.map(rule => (
      validation[rule.field] = { isInvalid: false, message: '' }
    ));

    return { isValid: true, ...validation };
  }
}

export default FormValidator;