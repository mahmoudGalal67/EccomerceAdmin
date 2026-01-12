'use client';

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["orders", debounced, page, perPage],
    queryFn: async () => {
      const res = await api.get("/orders/seller", {
        params: { search: debounced, page, per_page: perPage },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const deleteOrders = useMutation({
    mutationFn: (ids: number[]) =>
      api.post("/orders/bulk-delete", { ids }),
    onSuccess: () => {
      setSelectedIds([]);
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return (
    <div style={{ padding: 20 }}>
      <input
        placeholder="Search order or name"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      <select value={perPage} onChange={(e) => setPerPage(+e.target.value)}>
        {[10, 15, 25, 50].map(n => (
          <option key={n} value={n}>{n} / page</option>
        ))}
      </select>

      {selectedIds.length > 0 && (
        <button onClick={() => deleteOrders.mutate(selectedIds)}>
          Delete {selectedIds.length}
        </button>
      )}

      <DataTable
        columns={columns()}
        data={data?.data ?? []}
        page={page}
        setPage={setPage}
        pageCount={data?.last_page ?? 1}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        search={data?._search}
        isLoading={isLoading}
      />
    </div>
  );
}
