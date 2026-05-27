-- ============================================================
-- Rewrite trigger function to handle concurrent inserts atomically
-- Uses pg_advisory_xact_lock to serialize access per unidade/dia
-- + ON CONFLICT DO UPDATE for atomic upsert
-- ============================================================

CREATE OR REPLACE FUNCTION fn_atualizar_indicadores()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  lock_key BIGINT;
BEGIN
  -- Advisory lock per (unidade_id, day) to serialize concurrent inserts
  -- Prevents race conditions from multiple users evaluating the same unit at the same time
  lock_key := (
    ('x' || substr(md5(NEW.unidade_id || date_trunc('day', NEW.created_at)::TEXT), 1, 16))::BIT(64)::BIGINT
  );
  PERFORM pg_advisory_xact_lock(lock_key);

  INSERT INTO indicadores_materializados
    (nivel, municipio_id, secretaria_id, unidade_id, setor_id,
     periodo_inicio, periodo_fim, intervalo,
     total_avaliacoes, total_excellent, total_good, total_regular, total_bad,
     media_pontuacao, satisfacao_bruta)
  SELECT
    'unidade',
    NEW.municipio_id,
    NEW.secretaria_id,
    NEW.unidade_id,
    NEW.setor_id,
    date_trunc('day', NEW.created_at)::DATE,
    date_trunc('day', NEW.created_at)::DATE,
    'day',
    COUNT(*),
    COUNT(*) FILTER (WHERE nota = 'excellent'),
    COUNT(*) FILTER (WHERE nota = 'good'),
    COUNT(*) FILTER (WHERE nota = 'regular'),
    COUNT(*) FILTER (WHERE nota = 'bad'),
    ROUND(AVG(pontuacao), 3),
    ROUND((COUNT(*) FILTER (WHERE nota IN ('excellent', 'good'))::NUMERIC / GREATEST(COUNT(*), 1)) * 100, 2)
  FROM avaliacoes
  WHERE unidade_id = NEW.unidade_id
    AND created_at >= date_trunc('day', NEW.created_at)
    AND created_at < date_trunc('day', NEW.created_at) + INTERVAL '1 day'
    AND deleted_at IS NULL
  GROUP BY municipio_id, secretaria_id, unidade_id, setor_id
  ON CONFLICT (nivel, municipio_id,
    COALESCE(secretaria_id, '00000000-0000-0000-0000-000000000000'),
    COALESCE(unidade_id, '00000000-0000-0000-0000-000000000000'),
    COALESCE(setor_id, '00000000-0000-0000-0000-000000000000'),
    periodo_inicio, intervalo)
  DO UPDATE SET
    total_avaliacoes  = EXCLUDED.total_avaliacoes,
    total_excellent   = EXCLUDED.total_excellent,
    total_good        = EXCLUDED.total_good,
    total_regular     = EXCLUDED.total_regular,
    total_bad         = EXCLUDED.total_bad,
    media_pontuacao   = EXCLUDED.media_pontuacao,
    satisfacao_bruta  = EXCLUDED.satisfacao_bruta,
    updated_at        = NOW();

  RETURN NEW;
END;
$$;
