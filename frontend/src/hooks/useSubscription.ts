import { useCallback, useEffect, useState } from "react";
import { subscriptionService } from "../services/subscription.service";
import { getErrorMessage } from "../services/apiClient";

interface UseSubscriptionResult {
  isSubscribed: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

/**
 * Estado de la suscripción del usuario a un libro.
 * El botón de la UI depende de `isSubscribed`.
 */
export const useSubscription = (bookId: number): UseSubscriptionResult => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const { data } = await subscriptionService.isSubscribed(bookId);
        if (!cancelled) setIsSubscribed(data.subscribed);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const subscribe = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await subscriptionService.subscribe(bookId);
      setIsSubscribed(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }, [bookId]);

  const unsubscribe = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await subscriptionService.unsubscribe(bookId);
      setIsSubscribed(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }, [bookId]);

  return { isSubscribed, isLoading, isSubmitting, error, subscribe, unsubscribe };
};
