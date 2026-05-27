CREATE OR REPLACE FUNCTION fn_atualizar_indicadores()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM indicadores_materializados
  WHERE nivel = 'unidade'
    AND municipio_id = NEW.municipio_id
    AND COALESCE(secretaria_id, '00000000-0000-0000-0000-000000000000') = COALESCE(NEW.secretaria_id, '00000000-0000-0000-0000-000000000000')
    AND COALESCE(unidade_id, '00000000-0000-0000-0000-000000000000') = COALESCE(NEW.unidade_id, '00000000-0000-0000-0000-000000000000')
    AND COALESCE(setor_id, '00000000-0000-0000-0000-000000000000') = COALESCE(NEW.setor_id, '00000000-0000-0000-0000-000000000000')
    AND periodo_inicio = date_trunc('day', NEW.created_at)::DATE
    AND intervalo = 'day';

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
  GROUP BY municipio_id, secretaria_id, unidade_id, setor_id;

  RETURN NEW;
END;
$$;

ALTER TABLE avaliacoes ENABLE TRIGGER trg_avaliacoes_atualiza_indicadores;
