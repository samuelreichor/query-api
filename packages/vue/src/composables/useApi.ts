import { inject } from 'vue';
import type { CraftCmsOptions } from '../types';

export function useCraft(): CraftCmsOptions {
  return inject<CraftCmsOptions>('CraftCmsOptions')!;
}
