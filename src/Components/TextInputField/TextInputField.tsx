import React from "react";
import { Text, TextInput } from "react-native";
import { Label } from "@components/Label";
import { TextInputFieldProps } from "./TextInputFieldProps";
import { textInputFieldStyles } from "./TextInputFieldStyles";

export function TextInputField(props: TextInputFieldProps): JSX.Element {
  const {
    label,
    value,
    style,
    error,
    onChangeText,
    onBlur,
  } = props;

  return (
    <>
      {
        label
        && (
          <Label>
            {label}
          </Label>
        )
      }
      <TextInput
        value={value}
        style={[
          textInputFieldStyles.textInput,
          !!error && textInputFieldStyles.textInputError,
          style,
        ]}
        onChangeText={onChangeText}
        onBlur={onBlur}
      />
      {
        error
        && (
          <Text style={textInputFieldStyles.errorMessage}>
            {error}
          </Text>
        )
      }
    </>
  );
}
