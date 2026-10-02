import { useState } from 'react';

/**
 * Two-way data binding untuk input form.
 * @param {string} defaultValue
 * @returns {[string, function, function]} [value, onChange, setValue]
 */
export default function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue);

  function onChange(event) {
    setValue(event.target.value);
  }

  return [value, onChange, setValue];
}