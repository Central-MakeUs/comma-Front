import { useEffect, useRef, useState } from 'react';

type UseEditableNicknameParams = {
  initialValue?: string;
  suggestedValue?: string;
};

export function useEditableNickname({
  initialValue = '',
  suggestedValue
}: UseEditableNicknameParams = {}) {
  const [value, setValue] = useState(initialValue);
  const hasUserEditedValueRef = useRef(false);

  useEffect(() => {
    if (!suggestedValue || hasUserEditedValueRef.current || value.length > 0) return;

    setValue(suggestedValue);
  }, [suggestedValue, value.length]);

  const handleChange = (nextValue: string) => {
    hasUserEditedValueRef.current = true;
    setValue(nextValue);
  };

  return {
    value,
    setValue,
    handleChange
  };
}
