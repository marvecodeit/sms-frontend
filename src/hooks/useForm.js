import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validate = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = useCallback((key, value) => {
    setValues(v => ({ ...v, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  }, [errors]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    set(name, type === 'checkbox' ? checked : value);
  }, [set]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, []);

  const submit = useCallback(async (fn) => {
    if (validate) {
      const errs = validate(values);
      if (Object.keys(errs).length > 0) { setErrors(errs); return false; }
    }
    setLoading(true);
    try {
      await fn(values);
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, [values, validate]);

  return { values, errors, loading, set, handleChange, reset, submit, setValues };
};
