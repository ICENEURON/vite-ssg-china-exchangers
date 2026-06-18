const navigationPendingEventName = "heatex:navigation-pending";

export type NavigationPendingDetail = {
  pending: boolean;
};

export function setNavigationPending(pending: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent<NavigationPendingDetail>(navigationPendingEventName, {
    detail: { pending },
  }));
}

export function startNavigationFeedback() {
  setNavigationPending(true);
}

export function stopNavigationFeedback() {
  setNavigationPending(false);
}

export function subscribeNavigationFeedback(callback: (pending: boolean) => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handlePendingEvent = (event: Event) => {
    callback(Boolean((event as CustomEvent<NavigationPendingDetail>).detail?.pending));
  };

  window.addEventListener(navigationPendingEventName, handlePendingEvent);
  return () => window.removeEventListener(navigationPendingEventName, handlePendingEvent);
}
