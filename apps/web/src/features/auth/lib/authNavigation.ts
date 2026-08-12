export const getPostLoginPath = (data: { onboardingCompleted: boolean }) =>
  data.onboardingCompleted ? '/loading' : '/nickname';
