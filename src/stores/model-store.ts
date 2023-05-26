export const useModelStore = defineStore({
  id: 'useModelStore',
  state: () => ({
    modelName: '',
    progress: {
      loading: false,
      value: 0,
    },
  }),
  actions: {
    setProgress(status: boolean, value: number) {
      this.progress.loading = status;
      this.progress.value = value;
    },
  },
});
