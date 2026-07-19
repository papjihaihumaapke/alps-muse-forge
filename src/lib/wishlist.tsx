import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function useWishlist() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["wishlist", user?.id ?? "anon"],
    queryFn: async () => {
      if (!user) return [] as string[];
      const { data, error } = await supabase.from("wishlist_items").select("product_slug").eq("user_id", user.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.product_slug);
    },
  });
}

export function useToggleWishlist() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, on }: { slug: string; on: boolean }) => {
      if (!user) throw new Error("sign in to save items");
      if (on) {
        const { error } = await supabase.from("wishlist_items").insert({ user_id: user.id, product_slug: slug });
        if (error && !error.message.includes("duplicate")) throw error;
      } else {
        const { error } = await supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("product_slug", slug);
        if (error) throw error;
      }
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(v.on ? "saved to wishlist" : "removed from wishlist");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
