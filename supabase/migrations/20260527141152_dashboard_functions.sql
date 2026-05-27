CREATE OR REPLACE FUNCTION fn_distribuicao_notas()
RETURNS TABLE (nota text, total bigint)
LANGUAGE sql STABLE
AS $$
  SELECT nota::text, COUNT(*)::bigint
  FROM avaliacoes
  WHERE deleted_at IS NULL
  GROUP BY nota
  ORDER BY nota;
$$;

CREATE OR REPLACE FUNCTION fn_evolucao_satisfacao()
RETURNS TABLE (periodo text, satisfacao numeric, total bigint)
LANGUAGE sql STABLE
AS $$
  SELECT
    to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as periodo,
    ROUND(
      (COUNT(*) FILTER (WHERE nota IN ('excellent', 'good'))::numeric / GREATEST(COUNT(*), 1)) * 100,
      1
    ) as satisfacao,
    COUNT(*)::bigint as total
  FROM avaliacoes
  WHERE deleted_at IS NULL
    AND created_at >= NOW() - INTERVAL '30 days'
  GROUP BY date_trunc('day', created_at)
  ORDER BY date_trunc('day', created_at);
$$;

CREATE OR REPLACE FUNCTION fn_ranking_unidades()
RETURNS TABLE (
  unidade_id uuid,
  unidade_nome text,
  tipo text,
  satisfacao numeric,
  total bigint,
  media numeric
)
LANGUAGE sql STABLE
AS $$
  SELECT
    u.id as unidade_id,
    u.nome as unidade_nome,
    u.tipo::text,
    ROUND(
      (COUNT(*) FILTER (WHERE a.nota IN ('excellent', 'good'))::numeric / GREATEST(COUNT(*), 1)) * 100,
      1
    ) as satisfacao,
    COUNT(*)::bigint as total,
    ROUND(AVG(a.pontuacao), 2) as media
  FROM unidades u
  LEFT JOIN avaliacoes a ON a.unidade_id = u.id AND a.deleted_at IS NULL
  WHERE u.deleted_at IS NULL
  GROUP BY u.id, u.nome, u.tipo
  HAVING COUNT(*) > 0
  ORDER BY satisfacao DESC;
$$;
