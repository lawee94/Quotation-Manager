import React from "react";
import Input from "../component/UI/Input";

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const getArrayFromState = (State) => {
  const selArray = [];
  for (let key in State) {
    selArray.push({
      id: key,
      config: State[key],
    });
  }
  return selArray;
};

export const checkValidity = (value, rules) => {
  let isValid = true;
  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
  }

  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
  }

  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid;
  }
  return isValid;
};

export const formElement = (formElement, onChangeFunction) => {
  return (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      display="block"
      value={formElement.config.value}
      changed={onChangeFunction}
    />
  );
};

export const elemConfig = (
  elemType,
  type,
  placeholder,
  validation,
  disable = false,
  value
) => {
  const element = {
    elementType: elemType,
    elementConfig: {
      placeholder,
      type,
      disabled: disable,
      required: validation.required,
    },
    value: value,
    validation: validation,
    valid: false,
    touched: false,
  };
  return element;
};

export const inputHandler = (event, inputIdentifier, State) => {
  const updatedInput = { ...State };
  const inpElement = updatedInput[inputIdentifier];
  inpElement.value = typeof event === "object" ? event.target.value : event;
  inpElement.valid = checkValidity(
    inpElement.value,
    State[inputIdentifier].validation
  );
  inpElement.touched = true;
  updatedInput[inputIdentifier] = inpElement;
  return updatedInput;
};

export const validity = (state) => {
  let isvalid = true;
  let inp = "";
  getArrayFromState(state).map((val) => {
    inp = inputHandler(val.config.value, val.id, state);
    if (!inp[val.id].valid) isvalid = false;
  });
  return { isvalid, inp };
};
