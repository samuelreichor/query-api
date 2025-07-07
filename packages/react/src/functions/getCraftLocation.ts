import { Location } from 'react-router'

export function getCraftLocation(location: Location) {
  if (window === undefined) {
    throw new Error('window is undefined, this function can only be used in the browser.')
  }
  return {
    pathname: location.pathname,
    absoluteUrl: window.location.origin + location.pathname + location.search,
  }
}
