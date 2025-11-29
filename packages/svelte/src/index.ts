import TestComponent from './components/TestComponent.svelte'

export { TestComponent }
export function helloName(name: string) {
  return `Hello ${name}!`
}
