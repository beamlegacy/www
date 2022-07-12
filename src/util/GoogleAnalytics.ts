export type GoogleAnalyticsEventOptions = {[key: string]: string}
declare global {
  interface Window {
    dataLayer?: IArguments[]
  }
}

export class GoogleAnalytics {
  static gtag(
    _type: string,
    _action: string,
    _options?: GoogleAnalyticsEventOptions
  ): void {
    if (!window.dataLayer) {
      window.dataLayer = []
    }

    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments || [])
  }

  static trackEvent = (
    eventAction: string,
    options?: GoogleAnalyticsEventOptions
  ) : void => {
    this.gtag("event", eventAction, options)
  }

  static listEvents = () : IArguments[] => {
    return window.dataLayer || []
  }

  static eventFired = (eventAction: string) : boolean => {
    if (!window.dataLayer) {
      return false
    }
    return !!window.dataLayer.find(event => event[1] === eventAction)
  }
}