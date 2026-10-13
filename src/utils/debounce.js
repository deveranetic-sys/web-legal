import { ref, watch } from 'vue';

/**
 * Standard debounce function
 * Delays invoking func until after wait milliseconds have elapsed since the last time it was invoked.
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export function debounce(fn, delay = 250) {
  let timer = null;
  const debounced = function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
  };
  return debounced;
}

/**
 * Vue 3 Composable: Creates a debounced copy of any reactive ref
 * Keeps input instantaneous in template while debouncing heavy computed filtering.
 * @param {import('vue').Ref<any>} sourceRef
 * @param {number} delay
 * @returns {import('vue').Ref<any>}
 */
export function useDebouncedRef(sourceRef, delay = 250) {
  const debounced = ref(sourceRef.value);
  let timeoutId = null;

  watch(sourceRef, (newVal) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      debounced.value = newVal;
    }, delay);
  });

  return debounced;
}
