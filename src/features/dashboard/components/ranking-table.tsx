"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RankingItem {
  unidade_id: string;
  unidade_nome: string;
  tipo: string;
  satisfacao: number;
  total: number;
  media: number;
}

export function RankingTable({ data }: { data: RankingItem[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Nenhuma avaliacao encontrada
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">#</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Satisfacao</TableHead>
          <TableHead className="text-right">Media</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, i) => (
          <TableRow key={item.unidade_id}>
            <TableCell className="font-medium">{i + 1}</TableCell>
            <TableCell>{item.unidade_nome}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {item.tipo}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <span
                className={cn(
                  "font-semibold",
                  item.satisfacao >= 70 && "text-green-600",
                  item.satisfacao >= 40 && item.satisfacao < 70 && "text-yellow-600",
                  item.satisfacao < 40 && "text-red-600"
                )}
              >
                {item.satisfacao}%
              </span>
            </TableCell>
            <TableCell className="text-right">{item.media.toFixed(2)}</TableCell>
            <TableCell className="text-right text-muted-foreground">
              {item.total}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
