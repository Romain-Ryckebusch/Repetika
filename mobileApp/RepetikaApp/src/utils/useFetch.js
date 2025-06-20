// src/utils/useFetch.js

import { useState, useEffect, useCallback } from "react";

const fetchCache = {}; // Cache global en mémoire

export default function useFetch(url) {
    const [data, setData] = useState(fetchCache[url] || null);
    const [loading, setLoading] = useState(!fetchCache[url]);
    const [error, setError] = useState(null);

    const fetchData = () => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        fetch(url, { signal: controller.signal })
            .then(res => res.json())
            .then(json => {
                fetchCache[url] = json; // Mise en cache
                setData(json);
            })
            .catch(err => {
                if (err.name !== "AbortError") setError(err);
            })
            .finally(() => setLoading(false));
        return controller;
    };

    // Fonction pour forcer le rafraîchissement
    const refetch = useCallback(() => {
        delete fetchCache[url];
        fetchData();
    }, [url]);

    useEffect(() => {
        if (fetchCache[url]) {
            setData(fetchCache[url]);
            setLoading(false);
            return;
        }
        const controller = fetchData();
        return () => controller.abort();
    }, [url]);

    return { data, loading, error, refetch };
}