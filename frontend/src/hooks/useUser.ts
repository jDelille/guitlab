import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoaded(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoaded(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { user, loaded };
};
