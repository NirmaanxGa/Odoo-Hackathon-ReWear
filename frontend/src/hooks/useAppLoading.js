import { useLoading } from "../context/LoadingContext";

export const useAppLoading = () => {
  const { isLoading, showLoading, hideLoading } = useLoading();

  const withLoading = async (asyncFunction) => {
    try {
      showLoading();
      const result = await asyncFunction();
      return result;
    } catch (error) {
      throw error;
    } finally {
      hideLoading();
    }
  };

  const triggerPageRefresh = () => {
    showLoading();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return {
    isLoading,
    showLoading,
    hideLoading,
    withLoading,
    triggerPageRefresh,
  };
};

export default useAppLoading;
