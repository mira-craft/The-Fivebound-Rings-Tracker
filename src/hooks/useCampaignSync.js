import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { initialState } from "../constants/ringState";

export function useCampaignSync(campaignId) {
  const [state, setState] = useState(initialState);
  const [version, setVersion] = useState(1);
  const versionRef = useRef(1);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    async function loadCampaign() {
      setLoading(true);

      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", campaignId)
        .single();

      if (error && error.code === "PGRST116") {
        const { data: insertData, error: insertError } = await supabase
          .from("campaigns")
          .insert([
            {
              id: campaignId,
              state: initialState,
              version: 1,
            },
          ])
          .select()
          .single();

        if (!insertError) {
          setState(insertData.state);
          setVersion(insertData.version);
          versionRef.current = insertData.version;
          setLastUpdated(insertData.updated_at);
        }
      } else if (!error && data) {
        setState(data.state);
        setVersion(data.version);
        versionRef.current = data.version;
        setLastUpdated(data.updated_at);
      }

      setLoading(false);
    }

    loadCampaign();
  }, [campaignId]);

  useEffect(() => {
    const channel = supabase
      .channel("campaign-" + campaignId)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "campaigns",
          filter: `id=eq.${campaignId}`,
        },
        (payload) => {
          const newData = payload.new;
          setState(newData.state);
          setVersion(newData.version);
          versionRef.current = newData.version;
          setLastUpdated(newData.updated_at);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  async function saveStateToDatabase(newState) {
    if (cooldown) return;

    setCooldown(true);

    const currentVersion = versionRef.current;

    const { data, error } = await supabase
      .from("campaigns")
      .update({
        state: newState,
        version: currentVersion + 1,
      })
      .eq("id", campaignId)
      .eq("version", currentVersion)
      .select();

    if (error) {
      console.error("Update error:", error);
      setTimeout(() => setCooldown(false), 800);
      return;
    }

    if (!data || data.length === 0) {
      const { data: freshData } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", campaignId)
        .single();

      if (freshData) {
        setState(freshData.state);
        setVersion(freshData.version);
        versionRef.current = freshData.version;
        setLastUpdated(freshData.updated_at);
      }
    } else if (data.length === 1) {
      setVersion(data[0].version);
      versionRef.current = data[0].version;
      setLastUpdated(data[0].updated_at);
    }

    setTimeout(() => setCooldown(false), 800);
  }

  function updateState(updater) {
    setState((prev) => {
      const newState =
        typeof updater === "function" ? updater(prev) : updater;
      saveStateToDatabase(newState);
      return newState;
    });
  }

  return { state, updateState, loading, lastUpdated };
}
