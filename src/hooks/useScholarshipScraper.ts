import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SCRAPER_SOURCES = [
  { name: "Scholarships365", url: "https://scholarships365.info/" },
  { name: "ScholarshipsCorner", url: "https://scholarshipscorner.website/" },
  { name: "OpportunitiesCorners", url: "https://opportunitiescorners.info/" },
  { name: "ScholarshipsAds", url: "https://www.scholarshipsads.com/" },
  { name: "AfterSchoolAfrica", url: "https://www.afterschoolafrica.com/scholarships/" },
  { name: "ScholarshipRoar", url: "https://scholarshiproar.com/" },
];

interface ScrapeResult {
  source: string;
  found: number;
  added: number;
  errors: string[];
}

interface ScrapeResponse {
  success: boolean;
  results: ScrapeResult[];
  error?: string;
}

export const useRunScraper = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (selectedSources?: string[]): Promise<ScrapeResponse> => {
      const { data, error } = await supabase.functions.invoke("scrape-scholarships", {
        body: { sources: selectedSources?.length ? selectedSources : null },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as ScrapeResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["scholarships"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });

      const totalFound = data.results.reduce((sum, r) => sum + r.found, 0);
      const totalAdded = data.results.reduce((sum, r) => sum + r.added, 0);

      toast.success(`Scraping complete: Found ${totalFound} scholarships, added ${totalAdded} new ones`);
    },
    onError: (error) => {
      console.error("Scraper error:", error);
      toast.error(`Scraping failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });
};
